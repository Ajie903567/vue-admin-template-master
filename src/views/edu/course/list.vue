<template>
  <div id="main">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option :value="'Normal'" label="已发布"/>
          <el-option :value="'Draft'" label="未发布"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetQueryData()">清空</el-button>
    </el-form>
    <el-table :data="this.list">
      <el-table-column label="序号" width="80" align="center">
        <template slot-scope="scope">
          {{(page - 1) * size + scope.$index +1}}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称" width="200" align="center">
      </el-table-column>
      <el-table-column prop="status" label="课程状态" width="100" align="center">
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="100" align="center">
      </el-table-column>
      <el-table-column prop="price" label="课程价格" width="100" align="center">
      </el-table-column>
      <el-table-column prop="viewCount" label="浏览数" width="100" align="center">
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" icon="el-icon-edit">修改课程基本信息</el-button>
          </router-link>
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" icon="el-icon-edit">修改课程大纲信息</el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" @click="deleteCourse(scope.row.id)">删除课程</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="size"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
  import cv from '../../../api/edu/cv'
  export default {
    name: 'TeacherList',
    data() {
      return {
        list:null,
        page:null,//当前页
        size:4,//每页的记录数
        total:0,//总记录数
        courseQuery:{} // 查询条件载体
      }
    },
    created() {
      this.getList()
    },
    methods:{
      //多条件查询列表
      getList(page = 1){
        this.page = page
        cv.getEduCourseList()
          .then(response =>{
            this.list = response.data.courseList
          })
          .catch(error => {
            console.log(error)
          })
      },
      //清空查询条件
      resetQueryData() {
        this.teacherQuery = {}
        this.getList()
      },
      //删除课程
      deleteCourse(id) {
        this.$confirm('是否删除此记录？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(() =>{
          return cv.deleteCourseAllData(id)
        }).then(() => {
          this.getList()
          this.$message({
            type:'success',
            message:'删除成功！'
          })
        }).catch((response) => {//失败
          if (response === 'cancel'){
            this.$message({
              type:'info',
              message:'取消删除'
            })
          }else {
            this.$message({
              type:'error',
              message:'删除失败'
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  #main{
    position: relative;
    left: 5%;
  }
</style>
