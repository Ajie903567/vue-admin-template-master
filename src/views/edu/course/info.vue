<template>
<div id="main">
  <h2 align="center">发布新课程</h2>
  <el-steps :active="1" process-status="wait" align-center style="margin-bottom: auto">
    <el-step title="填写课程基本信息"></el-step>
    <el-step title="创建课程大纲"></el-step>
    <el-step title="发布课程"></el-step>
  </el-steps>

  <el-form label-width="120px">
    <el-form-item label="课程标题">
      <el-input v-model="courseData.title" style="width: 90%" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
    </el-form-item>

    <!-- 所属分类 TODO -->
    <el-form-item label="课程分类">
      <el-select v-model="courseData.subjectParentId" placeholder="课程一级分类" @change="oneSubjectChange">
        <el-option v-for="one in oneSubjectList" :key="one.id" :label="one.title" :value="one.id"></el-option>
      </el-select>
      <el-select v-model="courseData.subjectId" placeholder="课程二级分类">
        <el-option v-for="two in twoSubjectList" :key="two.id" :label="two.title" :value="two.id"></el-option>
      </el-select>
    </el-form-item>

    <!-- 课程讲师 TODO -->
    <el-form-item label="课程讲师">
      <el-select v-model="courseData.teacherId" placeholder="请选择课程讲师">
        <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="总课时">
      <el-input-number :min="0" v-model="courseData.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
    </el-form-item>

    <!-- 课程简介 TODO -->
    <el-form-item label="课程简介">
     <tinymce :height="300" v-model="courseData.description"></tinymce>
    </el-form-item>

<!--    &lt;!&ndash; 课程封面 TODO &ndash;&gt;-->
<!--    <el-form-item label="课程封面">-->
<!--      <el-upload-->
<!--        :show-file-list="false"-->
<!--        :on-success="handleAvatarSuccess"-->
<!--        :before-upload="beforeAvatarUpload"-->
<!--        :action="'http://localhost:9001/eduoss/fileoss'"-->
<!--        class="avatar-uploader">-->
<!--        <img :src="courseData.cover">-->
<!--      </el-upload>-->
<!--    </el-form-item>-->

    <el-form-item label="课程价格">
      <el-input-number :min="0" v-model="courseData.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
    </el-form-item>
  </el-form>

<el-form label-width="120px">
  <el-form-item>
    <el-button :disabled="saveButtonDisable" type="primary" @click="next">保存并下一步</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script>
  import course from '../../../api/edu/course'
  import Tinymce from '../../../components/Tinymce'
  export default {
    components: {Tinymce},
    data() {
      return {
        active:'',
        saveButtonDisable:false,
        courseData:{
          title: '',
          subjectParentId:'',//课程一级分类id
          subjectId: '',//课程二级分类id
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '',
          price: 0
        },
        teacherList:[],
        oneSubjectList:[],
        twoSubjectList:[],
        courseId:'',
      }
    },
    created() {
      this.getAllTeacher()
      this.getAllOneSubject()
      if (this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        this.getCourseData()
        this.deleteCourseData()
      }
    },
    methods: {
      //下一步
      next() {
          course.addCourseData(this.courseData)
            .then(response => {
              if (response.code == 20000){
                this.$message({
                  type:'success',
                  message:'成功添加课程信息！'
                })
                console.log(response)
                //跳转页面
                this.$router.push({path:'/course/chapter/' + response.data.courseId})
              }else{
                this.$message({
                  type:'error',
                  message:'添加课程信息失败!'
                })
              }
            })
        // }
      },
      //查询所有讲师用于下拉框显示
      getAllTeacher() {
        course.getAllTeacher()
        .then(response=> {
          this.teacherList = response.data.items
        })
      },

      //查询所有的一级课程分类
      getAllOneSubject() {
        course.getAllOneTwoSubject()
        .then(response=> {
          this.oneSubjectList = response.data.list
        })
        // console.log(this.oneSubjectList)
      },

      //二级分类下拉框
      oneSubjectChange(value) {
        this.courseData.subjectId=''
        // console.log(value)
        // console.log(this.courseData.subjectParentId)

        //遍历所有一级分类
        for (let i=0;i<this.oneSubjectList.length;i++){
          // let oneSubject = this.oneSubjectList[i]
          //判断点击的分类的ID对应的一级分类
          if (value === this.oneSubjectList[i].id){
            // console.log(this.oneSubjectList[i].id)
            //得到其对应的所有二级分类
            this.twoSubjectList = this.oneSubjectList[i].children
            // console.log(this.oneSubjectList[i].children)
          }
        }
      },
      // //封面上传成功执行的方法
      // handleAvatarSuccess(res,file) {
      //  console.log("res:"+res);
      //  console.log(URL.createObjectURL(file.raw))
      //   this.courseData.cover = res.data.url
      // },
      // //封面上传前执行的方法
      // beforeAvatarUpload(file) {
      //   const isJPG = file.type === 'image/jpeg'
      //   const isLt2M = file.size / 1024 / 1024 < 2
      //   if (!isJPG) {
      //     this.$message.error('上传头像图片只能是 JPG 格式!')
      //   }
      //   if (!isLt2M) {
      //     this.$message.error('上传头像图片大小不能超过 2MB!')
      //   }
      //   return isJPG && isLt2M
      // }

      //查询课程信息
      getCourseData() {
        course.getCourseData(this.courseId)
        .then(response => {
          // console.log(response)
          this.courseData = response.data.courseInfoVo
        })
      },

      //修改之前删除数据库原有数据
      deleteCourseData() {
        course.deleteCourseById(this.courseId)
        .then(res => {
          if (res.code == 20000){
            this.$message({
              type:'success',
              message:'返回第一步！'
            })
          }else{
            this.$message({
              type:'error',
              message:'系统出错！！！'
            })
          }

        })
      }
    }
  }
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
