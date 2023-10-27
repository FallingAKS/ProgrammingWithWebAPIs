<script setup>
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
</script>

<template>
  <h1 style="font-size: 12ch;">WUS City Online<sub style="font-size: large;">Ver 0.1.0</sub></h1>
  <br>
  <el-row style="padding-right: 26px;">
    <el-col :span="22" style="padding-right: 12px;">
      <el-input placeholder="请输入城市名称" v-model="input" type="text" clearable size="large" />
    </el-col>
    <el-col :span="2">
      <el-button size="large" @click="fetchData" :icon="Search" color="#626aef80">搜索</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      input: '',
    };
  },
  methods: {
    fetchData() {
      if ('' === this.input) {
        ElMessage({
          showClose: true,
          message: '请输入城市名称！',
          type: 'warning',
        })
        return
      }
      // console.log(CITIES)
      if (!CITIES.includes(this.input)) {
        ElMessage({
          showClose: true,
          message: '请输入正确的行政区名称！',
          type: 'warning',
        })
        return
      }

      this.$router.push({ path: '/info', query: { city: this.input } })
    }
  },
};
</script>
