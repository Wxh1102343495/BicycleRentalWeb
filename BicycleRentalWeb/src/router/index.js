import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 普通路由 全部成员都可以访问
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    name: 'register',
    meta: {
      title: '注册',
      icon: 'el-icon-user-solid'
    },
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/paySuccess',
    component: Layout,
    children: [{
      path: 'paySuccess',
      name: 'paySuccess',
      hidden: true,
      component: () => import('@/views/paySuccess/index'),
      meta: { title: '支付成功' }
    }]
  },

  {
    path: '/returnPaySuccess',
    component: Layout,
    children: [{
      path: 'returnPaySuccess',
      name: 'returnPaySuccess',
      hidden: true,
      component: () => import('@/views/returnPaySuccess/index'),
      meta: { title: '退款成功' }
    }]
  }
]

// 需要权限的路由表
export const asyncRoutes = [
  {
    path: '/example',
    component: Layout,
    name: 'Example',
    alwaysShow: true,
    meta: { title: '个人中心', icon: 'el-icon-s-help', roles: ['sys', 'user'] },
    children: [
      {
        path: 'personInfo',
        name: 'personInfo',
        component: () => import('@/views/personInfo/index'),
        meta: { title: '修改个人信息', icon: 'table' }
      }
    ]
  },

  // 管理员权限

  {
    path: '/user',
    component: Layout,
    name: 'user',
    meta: { title: '用户管理', icon: 'el-icon-user', roles: ['sys'] },
    children: [
      {
        path: 'updateIdentity',
        name: 'updateIdentity',
        component: () => import('@/views/sys/user/updateIdentity'),
        meta: { title: '用户权限修改', icon: 'el-icon-edit' }
      },
      {
        path: 'queryUser',
        name: 'queryUser',
        component: () => import('@/views/sys/user/queryUser'),
        meta: { title: '用户信息查询', icon: 'el-icon-zoom-in' }
      }
    ]
  },

  {
    path: '/bicycle',
    component: Layout,
    name: 'bicycle',
    meta: { title: '自行车管理', icon: 'el-icon-bicycle', roles: ['sys'] },
    children: [
      {
        path: 'addBicycle',
        name: 'addBicycle',
        component: () => import('@/views/sys/bicycle/addBicycle'),
        meta: { title: '自行车录入', icon: 'el-icon-circle-plus-outline' }
      },
      {
        path: 'removeBicycle',
        name: 'removeBicycle',
        component: () => import('@/views/sys/bicycle/removeBicycle'),
        meta: { title: '自行车回收', icon: 'el-icon-remove-outline' }
      },
      {
        path: 'editBicycle',
        name: 'editBicycle',
        component: () => import('@/views/sys/bicycle/editBicycle'),
        meta: { title: '故障车维修', icon: 'el-icon-suitcase' }
      }
    ]
  },

  {
    path: '/location',
    component: Layout,
    name: 'location',
    meta: { title: '租赁地址管理', icon: 'el-icon-location-information', roles: ['sys'] },
    children: [
      {
        path: 'addLocation',
        name: 'addLocation',
        component: () => import('@/views/sys/location/addLocation'),
        meta: { title: '添加地址', icon: 'el-icon-plus' }
      },
      {
        path: 'removeLocation',
        name: 'removeLocation',
        component: () => import('@/views/sys/location/removeLocation'),
        meta: { title: '编辑地址', icon: 'el-icon-delete' }
      }
    ]
  },

  {
    path: '/coupon',
    component: Layout,
    name: 'coupon',
    meta: { title: '优惠券管理', icon: 'el-icon-s-ticket', roles: ['sys'] },
    children: [
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('@/views/sys/coupon/addCoupon'),
        meta: { title: '发布优惠券', icon: 'el-icon-plus' }
      },
      {
        path: 'queryCoupon',
        name: 'queryCoupon',
        component: () => import('@/views/sys/coupon/queryCoupon'),
        meta: { title: '管理优惠券', icon: 'el-icon-setting' }
      }
    ]
  },

  {
    path: '/problem',
    component: Layout,
    name: 'problem',
    meta: { title: '问题处理', icon: 'el-icon-warning-outline', roles: ['sys'] },
    children: [
      {
        path: 'userComplaint',
        name: 'userComplaint',
        component: () => import('@/views/sys/problem/userComplaint'),
        meta: { title: '用户投诉', icon: 'el-icon-bell' }
      },
      {
        path: 'orderInfo',
        name: 'orderInfo',
        component: () => import('@/views/sys/problem/orderInfo'),
        meta: { title: '订单评价', icon: 'el-icon-tickets' }
      },
      {
        path: 'needReturnPay',
        name: 'needReturnPay',
        component: () => import('@/views/sys/problem/needReturnPay'),
        meta: { title: '申请退款处理', icon: 'el-icon-refresh-right' }
      }
    ]
  },

  // 用户权限

  {
    path: '/bicycleRental',
    component: Layout,
    name: 'bicycleRental',
    meta: { title: '自行车', icon: 'el-icon-bicycle', roles: ['user'] },
    children: [
      {
        path: 'bicycleRental',
        name: 'bicycleRental',
        component: () => import('@/views/user/userBicycle/bicycleRental'),
        meta: { title: '租车', icon: 'el-icon-circle-plus' }
      },
      {
        path: 'bicycleReturn',
        name: 'bicycleReturn',
        component: () => import('@/views/user/userBicycle/bicycleReturn'),
        meta: { title: '还车', icon: 'el-icon-remove' }
      }
    ]
  },

  {
    path: '/userOrder',
    component: Layout,
    name: 'bicycleRental',
    alwaysShow: true,
    meta: { title: '订单', icon: 'el-icon-s-order', roles: ['user'] },
    children: [
      {
        path: 'orderIndex',
        name: 'orderIndex',
        component: () => import('@/views/user/userOrder/orderIndex'),
        meta: { title: '生成订单', icon: 'el-icon-circle-plus' },
        hidden: true
      },
      {
        path: 'queryOrderIng',
        name: 'queryOrderIng',
        component: () => import('@/views/user/userOrder/queryOrderIng'),
        meta: { title: '正在进行的订单', icon: 'el-icon-tickets' }
      },
      {
        path: 'queryOrderEnd',
        name: 'queryOrderEnd',
        component: () => import('@/views/user/userOrder/queryOrderEnd'),
        meta: { title: '历史订单', icon: 'el-icon-s-claim' }
      },
      {
        path: 'payIndex',
        name: 'payIndex',
        component: () => import('@/views/user/userOrder/payIndex'),
        meta: { title: '需要支付订单', icon: 'el-icon-s-release' }
      }
    ]
  },

  {
    path: '/couponPackage',
    component: Layout,
    name: 'couponPackage',
    meta: { title: '优惠券', icon: 'el-icon-s-ticket', roles: ['user'] },
    children: [
      {
        path: 'buyCoupon',
        name: 'buyCoupon',
        component: () => import('@/views/user/userCoupon/buyCoupon'),
        meta: { title: '优惠券市场', icon: 'el-icon-s-shop' }
      },
      {
        path: 'myCoupon',
        name: 'myCoupon',
        component: () => import('@/views/user/userCoupon/myCoupon'),
        meta: { title: '我的钱包', icon: 'el-icon-s-finance' }
      }
    ]
  },

  {
    path: '/userProblem',
    component: Layout,
    name: 'userProblem',
    meta: { title: '问题中心', icon: 'el-icon-warning', roles: ['user'] },
    children: [
      {
        path: 'bicycleError',
        name: 'bicycleError',
        component: () => import('@/views/user/userPorblem/bicycleError'),
        meta: { title: '自行车故障', icon: 'el-icon-bicycle' }
      },
      {
        path: 'UserComplaints',
        name: 'UserComplaints',
        component: () => import('@/views/user/userPorblem/UserComplaints'),
        meta: { title: '意见投诉', icon: 'el-icon-notebook-2' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
