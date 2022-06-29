import request from '@/utils/request'

export default {
  //讲师列表
  getTeacherListPage(currentPage,pageSize,teacherQuery) {
    return request({
      url: `/edu/teacher/pageTeacherCondition/${currentPage}/${pageSize}`,
      method: 'post',
    //  teacherQuery条件对象，后端用RequestBody获取，前端用~~
    //  data表示把对象转换成json进行传递到接口里面去
      data:teacherQuery
    })
  },
  // 根据id查询讲师
  selectTeacherById(id) {
    return request({
      url: `/edu/teacher/selectTeacherById/${id}`,
      method: 'get'
    })
  },
  //删除讲师
  deleteTeacherById(deleteById) {
    return request({
      url: `/edu/teacher/${deleteById}`,
      method: 'delete'
    })
  },
  // 添加讲师
  addTeacher(teacher) {
    return request({
      url: '/edu/teacher/addTeacher',
      method: 'post',
      data:teacher
    })
  },
  //修改讲师
  updateTeacherById(teacher) {
    return request({
      url: '/edu/teacher/updateTeacherById',
      method: 'post',
      data:teacher
    })
  }
}
