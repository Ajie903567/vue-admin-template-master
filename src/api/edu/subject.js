import request from '@/utils/request'

export default {

  //查询所有的课程分类
  getAllOneTwoSubject() {
    return request({
      url: '/edu/subject/getAllOneTwoSubject',
      method: 'get',
    })
  },
}
