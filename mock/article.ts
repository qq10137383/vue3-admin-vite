import { MockMethod } from 'vite-plugin-mock'
import { mock, Random } from 'mockjs'
import { Article, ArticleQueryDto, PV } from '@/api/article'
import { resultSuccess } from './_util'

const List: Article[] = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(mock({
    id: '@increment',
    timestamp: +Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform']
  }))
}

export default [
  {
    url: '/vue-element-admin/article/list',
    method: 'get',
    response: (config: { query: ArticleQueryDto }) => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((_, index) => index < limit * page && index >= limit * (page - 1))

      return resultSuccess({
        total: mockList.length,
        items: pageList
      })
    }
  },

  {
    url: '/vue-element-admin/article/detail',
    method: 'get',
    response: (config: { query: { id: string } }) => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return resultSuccess(article)
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    method: 'get',
    response: () => {
      const pvData: PV[] = [
        { key: 'PC', pv: 1024 },
        { key: 'mobile', pv: 1024 },
        { key: 'ios', pv: 1024 },
        { key: 'android', pv: 1024 }
      ]
      return resultSuccess(pvData)
    }
  },

  {
    url: '/vue-element-admin/article/create',
    method: 'post',
    response: () => resultSuccess('success')
  },

  {
    url: '/vue-element-admin/article/update',
    method: 'post',
    response: () => resultSuccess('success')
  }
] as MockMethod[]

