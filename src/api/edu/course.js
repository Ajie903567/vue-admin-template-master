import request from '@/utils/request'

export default {

  //添加课程
  addCourseData(courseData) {
    return request({
      url: '/edu/course/addCourseData',
      method: 'post',
      data:courseData
    })
  },
  //查询所有讲师
  getAllTeacher() {
    return request({
      url:'/edu/teacher/findAll',
      method:'get'
    })
  },
  //查询所有的课程分类
  getAllOneTwoSubject() {
    return request({
      url: '/edu/subject/getAllOneTwoSubject',
      method: 'get',
    })
  },
  //查询课程信息
  getCourseData(courseId) {
    return request({
      url : `/edu/course/getCourseInfo/${courseId}`,
      method: 'get',
    })
  },
  //修改课程信息
  updateCourseData(courseInfoVo) {
    return request({
      url : `/edu/course/updateCourse/${courseInfoVo}`,
      method: 'post',
    })
  },
  //（取消发布）根据ID删除课程
  deleteCourseById(id) {
    return request({
      url : `/edu/course/deleteCourseById/${id}`,
      method:'delete'
    })
  },
}
