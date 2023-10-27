<script setup>
import {
  fetchCityBriefInfo,
  fetchCityLocation,
  fetchCityWeather,
  fetchCityAir,
  getLocation,
  fetchCityNews,
} from '@/apis/APIs';
import { TopLeft, Search } from '@element-plus/icons-vue'
import AMapLoader from "@amap/amap-jsapi-loader";
import { ElMessage } from "element-plus"

window._AMapSecurityConfig = {
  securityJsCode: '6049a6c51356ecd3f93924f4125fbb1a',
}
</script>

<template>
  <el-head style="width: 80vw; margin-bottom: 20px;">
    <el-row>
      <el-col :span="10">
        <h1 style="font-size: 8ch;">WUS City Online<sub style="font-size: large;">Ver 0.1.0</sub></h1>
      </el-col>
      <el-col :span="8" style="padding-right: 12px; padding-left: 120px; padding-top: 40px;">
        <el-input placeholder="请输入城市名称" v-model="input" size="large" />
      </el-col>
      <el-col :span="2" style="padding-top: 40px;">
        <el-button size="large" @click="fetchData" :icon="Search" color="#3375b980">重新搜</el-button>
      </el-col>
      <el-col :span="2" style="padding-top: 40px;">
        <el-button size="large" @click="backToHome" :icon="TopLeft" color="#4e8e2f80">返回</el-button>
      </el-col>
    </el-row>
  </el-head>

  <el-body style="margin-left: -5vw; width: 84vw;">
    <el-row>
      <el-col :span="15">
        <el-card class="box-card" style="min-height: 247px;">
          <template #header>
            <div class="card-header">
              <span>城市简介</span>
            </div>
          </template>
          <div class="text item">
            {{ briefInfo }}
          </div>
          <div class="text" style="float: right;">
            —— from 百度百科
          </div>
        </el-card>
        <br>

        <el-row>
          <el-col :span="18">

            <el-card class="box-card" style="min-height: 183px;">
              <template #header>
                <div class="card-header">
                  <span>省市新闻（请输入省、直辖市、自治区名称）</span>
                </div>
              </template>
              <div v-for="(news, index) in newsList" :key="index" class="text" style="font-size: 16px;">
                <a :href="news.url">{{ news.title }}</a>
              </div>
              <div class="text" style="float: right;">
                —— from 天行数据
              </div>
            </el-card>
            <br>

            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>空气质量</span>
                </div>
              </template>
              <div class="text item">
                <el-row>
                  <el-col :span="6" style="text-align: center;">
                    <el-statistic title="质量" :value=this.airData.category />
                  </el-col>
                  <el-col :span="6" style="text-align: center;">
                    <el-statistic title="AQI" :value=this.airData.aqi />
                  </el-col>
                  <el-col :span="6" style="text-align: center;">
                    <el-statistic title="PM2.5" :value=this.airData.pm2p5 />
                  </el-col>
                  <el-col :span="6" style="text-align: center;">
                    <el-statistic title="PM10" :value=this.airData.pm10 />
                  </el-col>
                </el-row>
              </div>
              <div class="text" style="float: right;">
                —— from 和风天气
              </div>
            </el-card>
            <br>
          </el-col>
          <el-col :span="6" style="padding-left: 20px;">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>城市天气</span>
                </div>
              </template>
              <div class="text item">
                天气：<span style="font-size: large;">{{ weatherData.text }}</span>
              </div>
              <div class="text item">
                温度：<span style="font-size: large;">{{ weatherData.temp }}℃</span>
              </div>
              <div class="text item">
                风力：<span style="font-size: large;">{{ weatherData.windSpeed }}</span>
              </div>
              <div class="text item">
                风向：<span style="font-size: large;">{{ weatherData.windDir }}</span>
              </div>
              <div class="text item">
                气压：<span style="font-size: large;">{{ weatherData.pressure }}百帕</span>
              </div>
              <div class="text item">
                湿度：<span style="font-size: large;">{{ weatherData.humidity }}%</span>
              </div>
              <div class="text" style="float: right;">
                —— from APISpace
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="1" />

      <el-col :span="8" style="margin-left: -40px;">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>地理信息</span>
            </div>
          </template>
          城市坐标：<span style="font-size: x-large;">东经{{ locat.split(',')[0] }}度，北纬{{ locat.split(',')[1] }}度</span><br>
          <div class="text" style="float: right;">
            —— from 和风天气
          </div><br>

          <div id="container"></div>
          <div class="text" style="float: right;">
              —— from 高德地图
            </div>
        </el-card>

      </el-col>
    </el-row>
  </el-body>
</template>

<script>
export default {
  data() {
    return {
      input: this.$route.query.city || '',
      briefInfo: '数据加载中……',
      locat: '',
      weatherData: [],
      airData: [],
      newsList: [],

      map: null, // 添加map变量
    };
  },
  methods: {
    async refresh() {
      this.briefInfo = '数据加载中……';
      this.locat = '';
      this.weatherData = [];
      this.airData = [];
      this.newsList = [];

      this.locat = await fetchCityLocation(this.input);
      if ('' !== this.locat) {
        this.weatherData = await fetchCityWeather();
        this.airData = await fetchCityAir();
        if (this.map) {
          this.map.setCenter(getLocation());
        }
      }
      this.newsList = await fetchCityNews(this.input);
      this.briefInfo = await fetchCityBriefInfo(this.input);
    },
    backToHome() {
      this.$router.push('/')
    },
    async fetchData() {
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

      await this.refresh();
      this.$router.push({ path: '/info', query: { city: this.input } });
    },
  },
  async mounted() {
    AMapLoader.load({
      key: "2f305a821b6909d13b5ca6e930598993", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        this.map = new AMap.Map("container", {
          // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式
          zoom: 11, // 初始化地图级别
          center: [121.215004, 31.285124], // 初始化地图中心点位置
        });
      })
      .catch((e) => {
        console.log(e);
      });
    this.refresh();
  },
};
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.home_div {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
  position: relative;
}
</style>

<style scoped>
#container {
  width: 100%;
  height: 490px;
}
</style>