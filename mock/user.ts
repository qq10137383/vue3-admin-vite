import { MockMethod } from 'vite-plugin-mock'
import { UserVo, LoginDto, LoginVo } from '@/api/user'
import { resultSuccess, resultError } from './_util'

const tokens: Record<string, LoginVo> = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users: Record<string, UserVo> = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/vue-element-admin/user/login',
    method: 'post',
    response: (config: { body: LoginDto }) => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return resultError(60204, 'Account and password are incorrect.')
      }

      return resultSuccess(token)
    }
  },
  // get user info
  {
    url: '/vue-element-admin/user/info',
    method: 'get',
    response: (config: { query: { token: string } }) => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return resultError(50008, 'Login failed, unable to get user details.')
      }

      return resultSuccess(info)
    }
  },
  // user logout
  {
    url: '/vue-element-admin/user/logout',
    method: 'post',
    response: () => resultSuccess('success')
  }
] as MockMethod[]
