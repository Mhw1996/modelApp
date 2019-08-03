
var pub_url = pub.url;
var app = new Vue({
  el: "#app",
  data: {
    InitTotalData:{},
    Init_charts:[],
    list:[],
    show:1
  },
  created() {
    this.InitAjax(this.InitDataSet);

  },
  methods: {
    /**
     * 请求原始数据
     */
    InitAjax(cb) {
      var aaa = "page_id=1";
      $.ajax({
        type: "POST",
        // contentType: "application/json",
        cache: true,
        url: pub_url+"homepage",
        data: aaa,
        // async: false,
        error: function(request) {
          alert("Connection error");
        },
        success: function(data) {
          // //  console.log(data);
          cb(data);
        }
      });
    },

    /**
     * 回调函数
     */
    InitDataSet(res) {
      // 全部信息
      this.InitTotalData = res;

      // 排行榜单
      this.Init_charts = res.charts;
      //  console.log(this.Init_charts);
      this.list = res.charts[0].event_type_parameter
    }

    /**
     * 点击切换 
     */
    ,Tab(parm){      
      this.show = parm + 1;
      this.list = this.InitTotalData.charts[parm].event_type_parameter
    }

    /**
     * 点击商品跳转
     */
    ,GoClick(parm){
      window.location.href = parm
    }
    //
  }
});
