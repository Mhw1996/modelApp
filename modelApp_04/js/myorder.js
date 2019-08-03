//浏览器(czy)
$(document).ready(function (e) {

  var counter = 0;

  if (window.history && window.history.pushState) {

    $(window).on('popstate', function () {

      window.history.pushState('forward', null, '#');

      window.history.forward(1);

      //alert("不可回退");  //如果需在弹框就有它
      self.location = "./mine.html"; //如查需要跳转页面就用它

    });

  }
  window.history.pushState('forward', null, '#'); //在IE中必须得有这两行

  window.history.forward(1);

});
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
    top: [
      {
        name: "",
        info: '全部',
        id: 5
      },
      {
        name: "in_padment",
        info: "待付款",
        id: 1
      },
      {
        name: "pai",
        info: "待发货",
        id: 2
      },
      {
        name: "in_receive",
        info: "待收货",
        id: 3
      },
      {
        name: "ini_evaluate",
        info: "待评价",
        id: 4
      },

    ],
    buyer_id: "",
    dept_id: "",
    topcurrent: "1",
    items: [],
    id: '1',
    initdata: {},
    pageNum: 1,
    pageSize: 100
  },
  created() {
    // document.write();
    //  console.log(window.parent.document.URL)
    //  console.log(window.history)
    this.buyer_id = localStorage.getItem("buyer_id");
    this.dept_id = localStorage.getItem("dept_id");
    //跳转携带的参数
    this.id = id;
    this._id(this.id);
  },
  computed: {},
  methods: {
    /**
     * 点击切换订单分类 miTopTab
     */
    miTopTab(parm) {
      //  console.log("切换订单列表", parm);
      this.topcurrent = parm;
      this._id(parm);
    },

    /**
     * 确定显示订单条目的函数_id封装  每一个id值确定一个对应的对单条目信息
     */
    _id(res) {
      this.topcurrent = res;

      if (res == 1) {
        // 待付款
        var status = "in_padment";
      } else if (res == 2) {
        // 待发货
        var status = "paid";
      } else if (res == 3) {
        // 待收货
        var status = "in_receive";
      } else if (res == 4) {
        // 待评价
        var status = "in_evaluate";
      } else if (res == 5) {
        // 已完成
        var status = "";
      }
      var data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        order_status_id: status,
        buyer_id: this.buyer_id
      };
      this.initdata = data
      // this.GetOrder(this.initdata, this.SetOrderItem);
      const that = this;
      pub._Init(that, pub.url, pub.detail_api.listOrderPage, this.initdata, that.cb_listOrderPage)
    },

    /**
     * 获取后台数据
     */
    // GetOrder: function(data, cb) {
    //   var that = this;
    //   $.ajax({
    //     type: "POST",
    //     contentType: "application/json",
    //     url: pub_url+"listOrderPage",
    //     data: JSON.stringify(data),
    //     error: function(request) {
    //       alert("Connection error");
    //     },
    //     success: function(res) {
    //       if (res.stateCode == 200) {
    //         //  console.log(res);
    //         //  console.log("订单条目信息", res.data.pageInfo.list);
    //         cb(res.data.pageInfo.list);
    //       } else {
    //         //  console.log("请求数据失败");
    //       }
    //     }
    //   });
    // },

    cb_listOrderPage(res) {
      this.SetOrderItem(res.data.pageInfo.list);
    },
    // 设置订单条目信息
    SetOrderItem(res) {
      this.items = res;
      //  console.log("设置条目信息", this.items);
    },

    /**
     * 进入订单详情
     */
    GoOrderDetail(parm, b) {
      //  console.log(parm);
      location.href = "./orderdetail.html?id=" + parm + "&shop=" + b;
    },

    /**
     * 删除订单信息
     */
    GoOrderDel(order_id, dept_id) {
      var that = this;

      // var staus = eve.currentTarget.dataset.staus;

      var data = {
        dept_id: dept_id,
        order_id: order_id
      };
      var is_del = confirm('是否删除订单？')     
      if (is_del) {        
        pub._Init(that, pub.url, pub.detail_api.deleteOrder, data, that.cb_deleteOrder)
      }

      // $.ajax({
      //   type: "POST",
      //   contentType: "application/json",
      //   url: pub_url+"deleteOrder",
      //   data: JSON.stringify(data),
      //   error: function(request) {
      //     alert("Connection error");
      //   },
      //   success: function(res) {
      //     if (res.stateCode == 200) { 
      //       //  console.log("删除订单成功", res);
      //       for (var d = 0; d < that.items.length; d++) {
      //         if (that.items[d].order_id == id) {
      //           that.items.splice(d, 1);
      //         }
      //       }
      //     } else {
      //       //  console.log("请求数据失败");
      //     }
      //   }
      // });
    },
    cb_deleteOrder(res) {
      const that = this
      if (res.stateCode == 200) {
        //  console.log("删除订单成功", res);
        // for (var d = 0; d < that.items.length; d++) {
        //   if (that.items[d].order_id == id) {
        //     that.items.splice(d, 1);
        //   }
        // }
        window.history.go(0)
      } else {
        //  console.log("请求数据失败");
      }
    },
    /**
     * 返回上一级
     */
    back() {
      window.location.href = "./mine.html"
      //window.history.go(-1);
    },
    /**
     * 加载更多
     */
    GoMore() {
      //  console.log('加载更多')
      this.initdata.pageSize = this.initdata.pageSize + 10
      // //  console.log(this.initdata)
      this.GetOrder(this.initdata, this.SetOrderItem);
    },
    /**
     * 暂无商品，去首页
     */
    GoIndex() {
      window.location.href = "./index.html";
    }
    // 结尾
  }
});
