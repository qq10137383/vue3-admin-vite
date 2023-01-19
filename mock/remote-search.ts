import { MockMethod } from 'vite-plugin-mock'
import { mock, Random } from 'mockjs'
import { NameVo } from '@/api/remote-search'
import { resultSuccess } from './_util'

const NameList: NameVo[] = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(mock({
    name: '@first'
  }))
}
NameList.push({ name: 'mock-Pan' })

export default [
  // username search
  {
    url: '/vue-element-admin/search/user',
    method: 'get',
    response: (config: { query: { name: string } }) => {
      const { name } = config.query
      const mockNameList = NameList.filter(item => {
        const lowerCaseName = item.name.toLowerCase()
        return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
      })
      return {
        code: 20000,
        data: { items: mockNameList }
      }
    }
  },

  // transaction list
  {
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    response: () => {
      return resultSuccess({
        total: 20,
        'items|20': [{
          order_no: '@guid()',
          timestamp: +Random.date('T'),
          username: '@name()',
          price: '@float(1000, 15000, 0, 2)',
          'status|1': ['success', 'pending']
        }]
      })
    }
  }
] as MockMethod[]
