<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel上传格式说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'/static/01.xlsx'">点击下载模板</a>
        </el-tag>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="http://localhost:9001/edu/subject/addSubject"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :disable="importButtonDisable"
          :limit="1"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" :loading="loading" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return{
        importButtonDisable:true,
      }
    },
    created() {

    },
    methods: {
      //上传的方法
      submitUpload() {
        this.importButtonDisable=true
        this.loading = true
        //js:document.getElementById("upload").submit
        this.$refs.upload.submit()
      },
      //上传失败的方法
      fileUploadError() {
        this.loading=false
        this.$message({
          type:'error',
          message:'添加课程分类失败！'
        })
      },
      //上传成功的方法
      fileUploadSuccess() {
        this.loading=true
        this.$message({
          type:'success',
          message:'添加课程分类成功！'
        })
      },
    }
  }
</script>

<style scoped>

</style>
