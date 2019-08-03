// 截取传来的字符串
var strHref = location.href;
if (strHref.indexOf("?") > 0) {
  var intPos = strHref.indexOf("?");
  var intPosLen = intPos + 4;
  var num = strHref.substring(intPosLen, strHref.length);
  var id = num;
} else {
  var id = '1';
}

var pub_url = pub.url;
var app = new Vue({
  el: "#app",
  data: {
    InitTotalData: {},
    Init_charts: [],
    list: [],
    show: 1
  },
  created() {
    this.InitAjax(this.InitDataSet);
    this.show = id ? id :1;
    this._id(this.show)
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

      // 商品联动
      this.Init_charts = res.navigation;
      //  console.log(this.Init_charts, res);
      this.list = res.navigation[0].navigation_two;
      //  console.log(this.list);
    },

    /**
     * 点击一级
     */
    TabSecond(parm) {
      this._id(parm)
    },

    _id(parm) {
      this.show = parm;
      //  console.log("点击了一级", parm);
      for (var i = 0; i < this.Init_charts.length; i++) {
        if (this.Init_charts[i].top_navigation_id == parm) {
          // //  console.log(this.Init_charts[i])
          this.list = this.Init_charts[i].navigation_two;
          //  console.log(this.list);
        }
      }
    }
    //
  }
});
