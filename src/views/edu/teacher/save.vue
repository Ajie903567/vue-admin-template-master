<template>
<div id="main">
<el-form>
  <el-form-item label="请输入讲师的信息"></el-form-item>
<!--  <el-form-item label="讲师 ID">-->
<!--    <el-input v-model="teacher.id" style="width: 60%"></el-input>-->
<!--  </el-form-item>-->
  <el-form-item label="讲师名称">
    <el-input v-model="teacher.name" style="width: 60%"></el-input>
  </el-form-item>
  <el-form-item label="讲师简介">
    <el-input v-model="teacher.intro" :rows="10" type="textarea" style="width: 60%"></el-input>
  </el-form-item>
  <el-form-item label="讲师资历">
    <el-input v-model="teacher.career"style="width: 60%"></el-input>
  </el-form-item>
  <el-form-item label="讲师头衔">
    <el-select v-model="teacher.level" clearable placeholder="请选择" style="width: 60%">
      <el-option :value="1"></el-option>
      <el-option :value="2"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="讲师头像">
    <!-- 头衔缩略图 -->
    <pan-thumb :image="teacher.avatar"/>
    <!-- 文件上传按钮 -->
    <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
    </el-button>
    <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
    <image-cropper
      v-show="imagecropperShow"
      :width="300"
      :height="300"
      :key="imagecropperKey"
      :url="'http://localhost:9001/eduoss/fileoss'"
      field="file"
      @close="close"
      @crop-upload-success="cropSuccess"/>
  </el-form-item>
  <el-form-item>
    <el-button :disabled="saveButtonDisable" type="primary" @click="addOrUpdateTeacher">保存</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<script>
import teacher from '../../../api/edu/teacher'
import PanThumb from '../../../components/PanThumb'
import ImageCropper from '../../../components/ImageCropper'
  export default {
  components: { PanThumb,ImageCropper },
    data() {
      return {
        teacher: {
          // id: null,
          name: null,
          intro: null,
          career: null,
          level: null,
          avatar: null
        },
        saveButtonDisable: false,//保存按钮是否禁用
        imagecropperShow:false,//上传弹窗组件是否显示
        imagecropperKey:0,//上传组件的key值
        BASE_API:'http://localhost:9001'
      }
    },
    created() {
      this.init()
    },
    watch:{//监听
      $route(to,from){//路由发生变化，代码就会执行
        this.init()
      }
    },
    methods:{
      close() {//关闭上传弹窗的方法
        this.imagecropperShow = false
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },
      cropSuccess(data) {//上传成功后的方法
        this.imagecropperShow = false
        //上传成功以后接口返回图片的地址
        this.teacher.avatar = data.url
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },
      init() {
        if (this.$route.params && this.$route.params.id) {//去做修改操作
          const id = this.$route.params.id
          this.getTeacher(id)
        }else {//做删除操作前清空表单
          this.teacher = {}
        }
      },
      //根据id查询讲师
      getTeacher(id) {
        teacher.selectTeacherById(id)
        .then(request => {
          this.teacher = request.data.teacher
          }).catch(reason => {
            this.$message({
              type:'error',
              message:'找不到该讲师的数据！'
            })
        })
      },
      //添加或者修改讲师
      addOrUpdateTeacher() {
        this.saveButtonDisable=true
        //判断是添加还是修改
        if (!this.$route.params.id){//添加
          this.addTeacher()
        }else {
          this.updateTeacher()
        }
      },
      //添加讲师
      addTeacher() {
        teacher.addTeacher(this.teacher)
        .then(request => {
          if (request.code == 20000){
            return this.$message({
              type:'success',
              message:'保存成功！'
            })
          }
        }).then(request => {
          this.$router.push({path:'/teacher/list'})
        }).catch(reason => {
          if (reason.code == 20001){
            this.$message({
              type:'error',
              message:'添加失败！'
            })
          }
        })
      },
      //修改讲师
      updateTeacher() {
        teacher.updateTeacherById(this.teacher)
        .then(request => {
          this.$message({
            type:'success',
            message:'讲师修改成功！'
          })
        }).then(request => {
          this.$router.push({path:'/teacher/list'})
        }).catch( error=> {
          this.$message({
            type:'error',
            message:'修改失败！'
          })
        })
      }
    }
  }
</script>

<style scoped>
#main{
  position: relative;
  left: 10%;
}

</style>
