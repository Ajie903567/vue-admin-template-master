<template>
  <div>
    <h2 align="center">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: auto">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="发布课程"></el-step>
    </el-steps>

    <el-dialog
      title="提示"
      :visible.sync="chapterDialogVisible"
      width="30%"
      :before-close="chapterHandleClose">
      <h2 align="center">请输入章节信息</h2>
      <div>
        <p>章节所属课程ID：{{this.chapterData.courseId}}</p>
        <el-input placeholder="请输入章节标题" v-model="chapterData.title"></el-input>
        <el-input placeholder="请输入章节序号" v-model="chapterData.sort"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="chapterDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </span>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog
      :visible.sync="dialogVideoFormVisible" title="添加课时小节">
      <el-form :model="videoData" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="videoData.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="videoData.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="videoData.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            action="http://localhost:9001/eduvod/videos/addvod/uploadALiYunVideo"
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
    <div id="mainDiv">
      <ul id="chapterList">
       <span id="chapterActs">
              <el-button type="primary" round @click="addChapterButton">添加章节</el-button>
       </span>
        <li v-for="chapter in chapterVideoList" :key="chapter.id" id="chapterLi">
          <div id="chapterDiv">
            {{chapter.title}}
            <span style="position: absolute;right: 10%">
          <el-button type="primary" @click="updateChapter(chapter.id)">编辑</el-button>
          <el-button type="danger" @click="deleteChapter(chapter.id)">删除</el-button>
          <el-button type="success" @click="addVideoInChapter(chapter.id)">添加小节</el-button>
        </span>
          </div>
          <!--视频-->
          <ul id="videoList">
            <li v-for="video in chapter.videoVoList" :key="video.id" id="videoLi">
              <p id="videoP">
                {{video.title}}
                <span style="position: absolute;right: 10%">
              <el-button type="primary" size="small" @click="updateVideo(video.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteVideo(video.id)">删除</el-button>
            </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <el-form label-width="120px" style="position: relative;top: 90%;left: 27%">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveButtonDisable" type="primary" @click="next">保存并下一步</el-button>
        <el-button type="danger" @click="deleteCourseById">取消发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import cv from '../../../api/edu/cv'

  export default {
    data() {
      return {
        active:'',
        saveButtonDisable:false,
        chapterVideoList:[],
        courseId:'',
        chapterData:{
          title:'',
          courseId:'',
          sort:''
        },
        chapterId:'',
        videoId: null,
        videoData: {  // 小节对象
          title: '',
          sort: 0,
          free: 0,
          videoSourceId: '',
          chapterId: '',
          courseId: '',
          videoOriginalName:''//视频名称
        },
        chapterDialogVisible:false,//章节添加信息弹窗
        chapterUpdateVisible:false,//章节修改的弹窗
        dialogVideoFormVisible:false,//小节添加的弹窗
        fileList: [],//上传文件列表
      }
    },
    created() {
      if (this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        this.getChapterVideo()
      }
    },
    methods: {
      //视频上传成功以后执行的方法
      handleVodUploadSuccess(response,file,fileList) {
        this.videoData.videoSourceId = response.data.videoId
        this.videoData.videoOriginalName = file.name
      },
      //视图上传多于一个视频
      handleUploadExceed() {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      },
//======================================以下是小节操作部分=====================================
      //显示添加小节的弹窗
      addVideoInChapter(chapterId) {
        this.dialogVideoFormVisible = true
        this.videoData.title = ''
        this.videoData.free = ''
        this.videoData.sort = ''
        this.videoData.videoSourceId = ''
        this.videoData.chapterId = chapterId
        this.videoData.courseId = this.courseId
      },
      //确定添加小节的按钮
      saveOrUpdateVideo() {
        if (this.videoId == null) {
          this.dialogVideoFormVisible = false
          cv.addVideo(this.videoData)
            .then(res => {
              if (res.code == 20000) {
                this.$message({
                  type:'success',
                  message:'小节添加成功'
                })
              }
              this.getChapterVideo()
            })
        }
        if (this.videoId != null) {
          cv.updateVideo(this.videoData)
            .then(res => {
              if (res.code == 20000) {
                this.$message({
                  type:'success',
                  message:'小节修改成功'
                })
              }
              this.dialogVideoFormVisible = false
              this.getChapterVideo()
            })
        }
      },
      //修改小节
      updateVideo(id) {
        cv.getVideo(id)
        .then(res => {
          this.videoData = res.data.videoData
          this.videoId = res.data.videoData.id
        })
        this.dialogVideoFormVisible = true
      },

      //删除小节
      deleteVideo(id) {
        this.$confirm('是否删除此小节？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(() => {
          cv.deleteVideo(id)
            .then(res => {
              if (res.code == 20000) {
                this.$message({
                  type:'success',
                  message:'小节删除成功'
                })
              }
              this.getChapterVideo()
            })
        })
      },
//======================================以下是章节操作部分=====================================
      //上一步
      previous() {
        //返回上一步之前，删除已经添加的章节和小节信息
        cv.deleteChapterAndVideo(this.courseId)

        .then(res => {
          console.log(res.code)
          if (res.code == 20000){
            this.$message({
              type:'success',
              message:'已清除章节信息'
            })
          }
        }).catch(error => {
          this.$message({
            type:'error',
            message:'清除章节信息失败'
          })
        })
        this.$router.push({path:'/course/info/' + this.courseId})
      },
      //取消发布并清除信息
      deleteCourseById() {
        cv.deleteCourseById(this.courseId)
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
      //下一步
      next() {
        //跳转下一步页面
        this.$router.push({path:'/course/publish/' + this.courseId})
      },
      //查询课程的所有章节和小节信息
      getChapterVideo() {
        cv.getAllChapterVideo(this.courseId)
          .then(res => {
            this.chapterVideoList = res.data.item
          })
      },
      //添加章节
      addChapter() {
        cv.addChapter(this.chapterData)
        .then(res => {
          if (res.code == 20000) {
            this.$message({
              type:'success',
              message:'章节添加成功！'
            })
          }else {
            this.$message({
              type:'error',
              message:'章节添加失败！'
            })
          }
        })
      },
      //添加的弹窗
      addChapterButton() {
        this.chapterDialogVisible = true
        this.chapterData.courseId = this.$route.params.id
      },
      //弹窗关闭
      chapterHandleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          }).catch(_ => {});
      },
      //添加章节弹窗确定
      chapterDataSubmit() {
        cv.addChapter(this.chapterData)
        .then(res => {
          if (res.code == 20000){
            this.chapterDialogVisible = false
            this.$message({
              type:'success',
              message:'章节添加成功'
            })
          }
        }).then(response => {
          this.$router.go(0)
        }).catch(error => {
          this.$message({
            type:'error',
            message:'章节添加失败'
          })
        })
      },

      //显示编辑的弹窗
      updateChapter(id) {
        //回显数据
        cv.selectChapterById(id)
        .then(response => {
          this.chapterData = response.data.eduChapter
        })
        this.chapterDialogVisible = true
      },

      //提交编辑章节信息
      updateChapterBtId(){
        cv.updateChapter(this.chapterData)
        .then(response => {
          if (response.code == 20000){
            this.$message({
              type:'success',
              message:'章节修改成功'
            })
          }
          this.chapterDialogVisible = false
          this.getChapterVideo()
        }).catch(error => {
          this.$message({
            type:'error',
            message:'章节添加失败'
          })
        })

      },
      //判断添加或者删除使用的按钮
      saveOrUpdate() {
        if (this.chapterData.id == null){
          this.chapterDataSubmit()
        }else{
          this.updateChapterBtId()
        }
      },
      //删除章节
      deleteChapter(id) {
        this.$confirm('是否删除此记录？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(() => {
          cv.deleteChapterById(id)
            .then(res => {
              if (res.code = 20000){
                this.$message({
                  type:'success',
                  message:'章节删除成功'
                })
              }
              this.getChapterVideo()
            })
        })
      },
    }
  }
</script>

<style scoped>
  #chapterList{
  }
  #chapterLi{
    position: relative;
    top: 50px;
  }
  #chapterDiv{
    font-size: 20px;
    margin: 10px;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }
  #chapterActs {
    position: absolute;
    right: 10%;
    font-size: 14px;
  }
  #videoList{
    padding-left: 50px;
  }
  #videoP{
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }
  #mainDiv {
    padding-bottom: 50px;
  }
</style>
