<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>
    <div class="ccInfo">
      <img :src="publishCourse.cover">
      <div class="main">
        <h2>{{ publishCourse.title }}</h2>
        <p class="gray"><span>共{{ publishCourse.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ publishCourse.subjectLevelOne }} — {{ publishCourse.subjectLevelTwo }}</span></p>
        <p>课程讲师：{{ publishCourse.teacherName }}</p>
        <h3 class="red">￥{{ publishCourse.price }}</h3>
      </div>
    </div>
    <div>
      <el-button @click="deleteCourseById">取消发布</el-button>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
    </div>
  </div>
</template>

<script>
  import course from '../../../api/edu/course'
  import cv from '../../../api/edu/cv'
  export default {
    data() {
      return {
        active:'',
        saveButtonDisable:false,
        courseId:'',
        publishCourse:{},
      }
    },
    created() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getCourseData()
      }
    },
    methods: {
      //上一步
      previous() {
        this.$router.push({path:'/course/chapter/' + this.courseId})
      },
      //下一步
      publish() {
        cv.publishCourse(this.courseId)
        .then(res => {
          if (res.code == 20000) {
            this.$message({
              type: 'success',
              message: '课程发布成功'
            })
          }
          //跳转页面
          this.$router.push({path:'/course/list'})
        })
      },
      //取消发布
      deleteCourseById(id) {
        course.deleteCourseById(id)
          .then(response=> {
            if (response.code == 20000){
              this.$message({
                type:'success',
                message:'成功取消发布！'
              })
            }else {
              this.$message({
                type:'error',
                message:'数据未删除！！'
              })
            }
          })
      },
      //课程信息的查询
      getCourseData() {
        cv.selectCourseBeforePublish(this.courseId)
        .then(res => {
          this.publishCourse = res.data.publishCourseData
        })
      }
    }
  }
</script>

<style scoped>
  .ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
  }
  .ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;

    float: left;
    border: none;
  }
  .ccInfo .main {
    margin-left: 520px;
  }
  .ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
  }
  .ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
  }
  .ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
  }
  .ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
  }
</style>
