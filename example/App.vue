<template>
  <div class="vue-track-plush">
    <h3>vue-track-plush-demo</h3>
    <!-- 测试参数传递对象 -->
    <div
      class="button-box"
      v-track:browse="{ name: 'testName', pageName: 'pageName' }"
    >
      <button
        v-track:click="{
          buttonName: '指令点击上报(参数是对象)',
          param1: 'param1',
          param2: 'param2',
        }"
      >
        指令点击上报(参数是对象)
      </button>
    </div>
    <!-- 测试参数传递字符串 -->
    <div class="button-box" v-track:browse :track-params="browseTrackParams">
      <button v-track:click="clickTrackParams">
        指令点击上报(参数是字符串)
      </button>
    </div>
    <div class="button-box">
      <button @click="customClickReport">自定义点击上报</button>
    </div>
    <div class="button-box">
      <button @click="customBrowseReport">自定义浏览上报</button>
    </div>
    <!-- 测试动态数据上报 -->
    <div class="button-box">
      <button @click="clickNumber++">动态修改上报数据</button> ===》{{
        clickNumber
      }}
      <button
        v-track:click="{
          buttonName: '点击的上报数据',
          currentNunber: clickNumber,
        }"
      >
        上报点击数据
      </button>
    </div>
    <div class="button-box">
      <button @click="browseNumber++">动态修改上报数据</button> ===》
      {{ browseNumber }}
      <button
        v-track:browse="{
          buttonName: '浏览的上报数据',
          currentNunber: browseNumber,
        }"
      >
        上报浏览数据
      </button>
    </div>
  </div>
</template>

<script>
// 自定义埋点上报
import { clickEvent, browseEvent } from "vue-track-plush";

export default {
  data() {
    return {
      clickNumber: 0,
      browseNumber: 0,
      clickTrackParams: "click-track-params-before",
      browseTrackParams: "browse-track-params-before",
    };
  },
  mounted() {
    // setTimeout(() => {
    //   this.clickTrackParams = "click-track-params-after";
    //   this.browseTrackParams = "browse-track-params-after";
    // }, 3000);
  },
  methods: {
    // 自定义点击上报
    customClickReport() {
      clickEvent({
        baseURL: "http://d.daily.vdian.net",
        url: "/api/action/record",
        projectName: "测试开发",
        buttonName: "按钮名称",
        param1: "参数1",
        param2: "参数2",
        paramN: "参数n",
      });
    },
    // 自定义浏览上报
    customBrowseReport() {
      browseEvent({
        baseURL: "http://d.daily.vdian.net",
        url: "/api/action/record",
        projectName: "测试开发",
        pageName: "页面名称",
        param1: "参数1",
        param2: "参数2",
        paramN: "参数n",
      });
    },
  },
};
</script>

<style scoped lang="less">
.button-box {
  margin-bottom: 10px;
}
</style>
