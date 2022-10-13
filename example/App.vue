<template>
  <div class="vue-track-plush">
    <h3>vue-track-plush-demo</h3>

    <!-- 测试参数传递对象 -->
    <div
      class="button-box"
      v-track:browse
      :track-params="{ name: 'testName', pageName: 'pageName' }"
    >
      <button
        v-track:click
        :track-params="{
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
      <button v-track:click :track-params="clickTrackParams">
        指令点击上报(参数是字符串)
      </button>
    </div>

    <div class="button-box">
      <button @click="customClickReport">自定义点击上报</button>
    </div>

    <div class="button-box">
      <button @click="customBrowseReport">自定义浏览上报</button>
    </div>
  </div>
</template>

<script>
// 自定义埋点上报
import { clickEvent, browseEvent } from "vue-track-plush";

export default {
  data() {
    return {
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
        // baseURL: "<接口域名>",
        // url: "<接口地址>",
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
        // baseURL: "<接口域名>",
        // url: "<接口地址>",
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
