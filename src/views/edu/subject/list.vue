<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="subjectData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
  import subject from '../../../api/edu/subject'
  export default {

    data() {
      return {
        filterText: '',
        subjectData:[],
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      }
    },
    created() {
      this.getAllSubject()
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },

    methods: {
      getAllSubject() {
        subject.getAllOneTwoSubject()
        .then(response =>{
          this.subjectData = response.data.list
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
    }
  }
</script>

