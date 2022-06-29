import request from '@/utils/request'
import chapter from '../../views/edu/course/chapter'

export default {

  //查询所有的章节
  getAllChapterVideo(courseId) {
    return request({
      url: `/edu/chapter/getChapterVideo/${courseId}`,
      method: 'get',
    })
  },
  //（取消发布）根据ID删除课程全部信息
  deleteCourseById(id) {
    return request({
      url : `/edu/course/deleteCourseById/${id}`,
      method:'delete'
    })
  },
  //添加章节
  addChapter(chapterData) {
    return request({
      url : '/edu/chapter/addChapter',
      method : 'post',
      data : chapterData
    })
  },

  //上一步：删除课程已经添加的章节和小节
  deleteChapterAndVideo(id){
    return request({
      url: `/edu/chapter/deleteAllChapter/${id}`,
      method : 'delete'
    })
  },
  //修改章节信息
  updateChapter(chapterData){
    return request({
      url: '/edu/chapter/updateChapter',
      method : 'post',
      data : chapterData
    })
  },
  //根据ID进行查询
  selectChapterById(id){
    return request({
      url: `/edu/chapter/getChapterByID/${id}`,
      method : 'get',
    })
  },

  //根据id删除指定章节
  deleteChapterById(id) {
    return request({
      url:`/edu/chapter/deleteChapterById/${id}`,
      method : 'delete',
    })
  },

  //=================================以下是小节部分===================================
  //添加小节
  addVideo(videoData) {
    return request({
      url:`/edu/video/addVideoInChapter`,
      method : 'post',
      data : videoData
    })
  },
  //删除小节
  deleteVideo(id) {
    return request({
      url:`/edu/video/deleteVideoById/${id}`,
      method : 'delete'
    })
  },
  //修改小节
  updateVideo(videoData) {
    return request({
      url:`/edu/video/updateVideo`,
      method : 'post',
      data : videoData
    })
  },
  //查询小节来进行数据回显
  getVideo(id) {
    return request({
      url:`/edu/video/getVideo/${id}`,
      method : 'get'
    })
  },

  //课程发布前的信息确认
  selectCourseBeforePublish(id) {
    return request({
      url:`/edu/course/getPublishCourseData/${id}`,
      method : 'get'
    })
  },

  //课程发布修改发布状态
  publishCourse(id) {
    return request({
      url:`/edu/course/publishCourse/${id}`,
      method : 'post'
    })
  },

  //课程发布修改发布状态
  getEduCourseList() {
    return request({
      url:`/edu/course/getCourseList`,
      method : 'post'
    })
  },

  //课程列表中的删除功能
  deleteCourseAllData(courseId) {
    return request({
      url:`/edu/course/deleteCourseAllData/${courseId}`,
      method : 'delete'
    })
  },

}
