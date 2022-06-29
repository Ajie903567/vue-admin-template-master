<template>
<div id="main">
  <!--查询表单-->
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
      <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
    </el-form-item>
    <el-form-item>
      <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
        <el-option :value="1"/>
        <el-option :value="2"/>
      </el-select>
    </el-form-item>
    <el-form-item label="添加时间">
      <el-date-picker
        v-model="teacherQuery.begin"
        type="datetime"
        placeholder="选择开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
      />
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-model="teacherQuery.end"
        type="datetime"
        placeholder="选择截止时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
      />
    </el-form-item>
    <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
    <el-button type="default" @click="resetQueryData()">清空</el-button>
  </el-form>
  <el-table :data="this.list">
    <el-table-column label="序号" width="60" align="center">
      <template slot-scope="scope">
        {{(page - 1) * size + scope.$index +1}}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="讲师姓名" width="100" align="center">
    </el-table-column>
    <el-table-column prop="id" label="讲师ID" width="170" align="center">
    </el-table-column>
    <el-table-column prop="intro" label="讲师简介" width="100" align="center">
    </el-table-column>
    <el-table-column prop="career" label="讲师资历" width="100" align="center">
    </el-table-column>
    <el-table-column prop="level" label="讲师头衔" width="80" align="center">
    </el-table-column>
    <el-table-column prop="gmtCreate" label="添加时间" width="160" align="center">
    </el-table-column>
    <el-table-column label="操作" width="200" align="center">
      <template slot-scope="scope">
        <router-link :to="'/teacher/edit/'+scope.row.id">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
        </router-link>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTeacher(scope.row.id)">删除</el-button>
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
  import teacher from '../../../api/edu/teacher'
  export default {
    name: 'TeacherList',
    data() {
      return {
        list:null,
        page:null,//当前页
        size:4,//每页的记录数
        total:0,//总记录数
        teacherQuery:{} // 查询条件载体
      }
    },
    created() {
      this.getList()
    },
    methods:{
      //多条件查询列表
      getList(page = 1){
        this.page = page
        teacher.getTeacherListPage(this.page,this.size,this.teacherQuery)
        .then(response =>{
          this.list = response.data.rows
          this.total = response.data.total
          console.log(this.list)
          console.log(this.total)
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
      //根据id进行逻辑删除
      deleteTeacher(id) {
          this.$confirm('是否删除此记录？','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(() =>{
            return teacher.deleteTeacherById(id)
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
