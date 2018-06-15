<template>
  <el-card class="box-card">
    <my-breadcrumb level1="数据统计" level2="数据列表"></my-breadcrumb>
    <div ref="chart" style="width: 800px;  height: 530px"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts';

export default {
  data() {
    return {
      options: {}
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const myChart = echarts.init(this.$refs.chart);
      myChart.showLoading();
      const { data: { data } } = await this.$http.get('reports/type/1');
      //  console.log(data);
      const o = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      };
      this.options = { ...data, ...o };
      this.options.xAxis[0].boundaryGap = false;
      myChart.setOption(this.options);
      myChart.hideLoading();
    }
  }
};
</script>

<style>
</style>
