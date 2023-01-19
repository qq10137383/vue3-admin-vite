import { MockMethod } from 'vite-plugin-mock'
import { mock } from 'mockjs'
import { asyncRoutes, constantRoutes } from './_routes'
import { deepClone, resultSuccess } from '../_util'
import { Role, RouteRecordRawVo } from '@/api/role'

const routes: RouteRecordRawVo[] = deepClone([...constantRoutes, ...asyncRoutes])

const roles: Role[] = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'editor',
    name: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

export default [
  // mock get all routes form server
  {
    url: '/vue-element-admin/routes',
    method: 'get',
    response: () => resultSuccess(routes)
  },

  // mock get all roles form server
  {
    url: '/vue-element-admin/roles',
    method: 'get',
    response: () => resultSuccess(roles)
  },

  // add role
  {
    url: '/vue-element-admin/role',
    method: 'post',
    response: () => resultSuccess({
      key: mock('@integer(300, 5000)')
    })
  },

  // update role
  {
    url: '/vue-element-admin/role',
    method: 'put',
    response: () => resultSuccess({
      status: 'success'
    })
  },

  // delete role
  {
    url: '/vue-element-admin/role',
    method: 'delete',
    response: () => resultSuccess({
      status: 'success'
    })
  }
] as MockMethod[]
