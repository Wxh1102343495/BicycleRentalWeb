import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }

}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(response => {
        const {data} = response
        // 更改store中的状态 通过提交mutations 调用commit方法，第一个参数 一个回调函数，执行修改逻辑的函数，第二个 是mutations的载荷(一般为你需要修改的状态值)

        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response

        if (!data) {
          return reject('验证失败，请重新登录。')
        }

        // const { name, avatar } = data
        const {roles, name, avatar } = data

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        // resolve(data)

        if (!roles || roles.length <= 0) {
          reject('getInfo: roles 必须是数组!')
        }
        console.log(roles)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

// dynamically modify permissions
  async changeRoles({commit, dispatch}, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const {roles} = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {root: true})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

