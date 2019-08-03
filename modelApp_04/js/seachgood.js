/**
 * vue版本的数据渲染
 */

// 截取传来的字符串
var strHref = location.href;
//  console.log(location.href);
if (strHref.indexOf("?") > 0) {
  var intPos = strHref.indexOf("?");
  // 从二级分类跳转过来的二级id
  var equal = intPos + 4;
  var num = strHref.substring(equal, strHref.length);
}

var id = num ? num : "";

var ipt_value = "";
var pub_url = pub.url;

var app = new Vue({
  el: "#app",
  data: {
    mssage: "neirong",
    list: [],
    num: 1,
    initdata: {},
    price_id: true,
    ipt: "",
    allshow: true,
    priceshow: false,
    dateshow: false,
    show: false,
    data_time: true,
    pageNum: 1,
    pageSize: 10,

    send: {}
  },
  created: function() {
    var data = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      msg: "",
      orderby: "",
      ordermode: "",
      // navigation_id: id ? id : "",
      goods_type_three_id: id ? id : ""
    };
    this.initdata = data;
    var that = this;
    this.InitAjax(this.initdata);
  },
  methods: {
    Init(id, shop) {
      // //  console.log(id)
      window.location.href = "./GoodDetail.html?id=" + id + "&shop=" + shop;
    },

    /**
     * 综合
     */
    all() {
      //  console.log("综合");
      if (this.ipt) {
        var alldata = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          msg: this.ipt
        };
      } else {
        var alldata = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          goods_type_three_id: id ? id : ""
        };
      }
      this.allshow = true;
      this.priceshow = false;
      this.dateshow = false;

      this.initdata = alldata;
      this.InitAjax(this.initdata);
    },

    /**
     * 日期
     */
    date() {
      //  console.log("日期");
      this.data_time = !this.data_time;

      if (this.data_time) {
        if (this.ipt) {
          var datedata = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            msg: this.ipt,
            orderby: "add_time"
          };
        } else {
          var datedata = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            goods_type_three_id: id ? id : "",
            orderby: "add_time"
          };
        }
      } else {
        if (this.ipt) {
          var datedata = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            msg: this.ipt,
            orderby: "add_time",
            ordermode: "fall"
          };
        } else {
          var datedata = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            goods_type_three_id: id ? id : "",
            orderby: "add_time",
            ordermode: "fall"
          };
        }
      }

      this.allshow = false;
      this.priceshow = false;
      this.dateshow = true;

      this.initdata = datedata;
      // //  console.log(this.data_time,datedata)
      this.InitAjax(this.initdata);
    },

    /**
     * 价格
     */
    price() {
      //  console.log("价格");
      this.price_id = !this.price_id;
      if (this.price_id) {
        if (this.ipt) {
          var pricedata = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            msg: this.ipt,
            orderby: "sale_price"
          };
        } else {
          var pricedata = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            goods_type_three_id: id ? id : "",
            orderby: "sale_price"
          };
        }
      } else {
        if (this.ipt) {
          var pricedata = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            msg: this.ipt,
            orderby: "sale_price",
            ordermode: "fall"
          };
        } else {
          var pricedata = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            goods_type_three_id: id ? id : "",
            orderby: "sale_price",
            ordermode: "fall"
          };
        }
      }

      this.allshow = false;
      this.priceshow = true;
      this.dateshow = false;

      this.initdata = pricedata;

      this.InitAjax(this.initdata);
    },

    /**
     * 输入框的监听事件
     */
    inputFunc() {
      var iptdata = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        msg: this.ipt,
        orderby: "sale_price",
        ordermode: "fall"
      };
      this.initdata = iptdata;
      this.InitAjax(this.initdata);
    },

    /**
     * 返回上一级事件
     */
    back() {
      window.history.go(-1);
    },
    // 请求数据 data文传入的形参 请求需要的参数
    InitAjax(data) {
      var that = this;
      // //  console.log(data)
      $.ajax({
        type: "POST",
        contentType: "application/json",
        url: pub_url + "getGoodsByCustomer",
        data: JSON.stringify(data),
        error: function(request) {
          //  console.log("Connection error");
        },
        success: function(res) {
          //  console.log(res);

          if (res.stateCode == 200) {
            // //  console.log(res);
            app.list = res.data.list;
            that.show = true;
          } else {
            //  console.log("请求数据失败");
            // alert('暂无商品')
            that.show = false;
          }
        }
      });
    },
    // 分类没有商品 去首页
    GoIndex() {
      window.location.href = "./index.html";
    },

    GoMore() {
      // //  console.log(this.initdata)
      this.initdata.pageNum = this.initdata.pageNum;
      this.initdata.pageSize = this.initdata.pageSize += 10;
      // //  console.log(this.initdata)
      // //  console.log('加载更多')
      this.InitAjax(this.initdata);
    }
  }
});
