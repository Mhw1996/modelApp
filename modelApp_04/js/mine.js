var pub_url = pub.url;
var app = new Vue({
  el: "#app",
  data: {
    buyer_id: "",
    dept_id: "",
    person: {},
    show: false
  },
  created() {

    const that = this
    this.dept_id = localStorage.getItem("dept_id");
    this.buyer_id = localStorage.getItem("buyer_id");

    if (this.buyer_id) {
      var data = {
        customer_id: this.buyer_id
      };
      // 获取用户信息
      // this.InitAjax(data, this.Set);
      pub._Init(that, pub.url, pub.detail_api.findCustomer, data, this.cb_findCustomer)
    } else {
      // //  console.log("用户未登录");
    }
  },
  methods: {
    cb_findCustomer(res) {
      //  console.log(res)
    },
    /**
     * 请求用户信息
     */
    // InitAjax(data, cb) {
    //   var that = this;
    //   $.ajax({
    //     type: "POST",
    //     headers: {
    //       token:localStorage.getItem('tk'),
    //     },
    //     contentType: "application/json",
    //     url: pub_url + "findCustomer",
    //     data: JSON.stringify(data),
    //     error: function(request) {
    //       //  console.log("Connection error");
    //     },
    //     success: function(res) {
    //       //  console.log("请求用户返回数据", res);
    //       if (res.stateCode == 200) {
    //         cb(res.data[0].CustomerInfo);
    //       } else {
    //         // //  console.log("请求数据失败");
    //         alert("数据加载失败");
    //       }
    //     }
    //   });
    // },
    cb_findCustomer(res) {
      //  console.log(res)
      if (res.stateCode == 200) {
        this.Set(res.data[0].CustomerInfo);
      } else {
        // //  console.log("请求数据失败");
        alert(res.msg);
        window.location.href = './login.html'
      }
    },
    /**
     * 回调函数
     */
    Set(res) {
      var that = this;
      that.show = true;
      that.person = res;
      //  console.log(res);
      var mineobj = JSON.stringify(res);
      localStorage.setItem("mine", mineobj);
    },
    /**
     * 跳转地址管理
     */
    GoAddress() {
      //  console.log("跳转地址管理");
      if (this.buyer_id) {
        window.location.href = "./adress.html";
      } else {
        alert("请先登录");
        window.location.href = "./login.html";
      }
    },
    /**
     * 跳转卡包
     */
    GoCouponBag() {
      //  console.log("跳转卡包页面");
      if (this.buyer_id) {
        window.location.href = "./myDisCount.html?user_id=" + this.buyer_id;
      }
    },
    /**
     * 跳转订单页面
     */
    SkanOrder(parm) {
      //  console.log("跳转全部订单页面");
      if (this.buyer_id) {
        window.location.href = "./myorder.html?id=" + parm;
      } else {
        alert("请登录之后查看订单");
        window.location.href = "./login.html";
      }
    },

    /**
     * 跳转 个人信息主页
     */
    GoMy(parm) {
      if (parm) {
        location.href = "./my.html?id=" + parm;
      } else {
        alert("请登录！");
        window.location.href = "./login.html";
      }
      // //  console.log("跳转个人信息主页", parm);
    },

    /**
     * 用户未登录 跳转登录页面
     */
    UserLogin() {
      //  console.log("跳转登录页面");
      window.location.href = "./login.html";
    },
    // methods结尾

    /**
     * 进入预约系统
     * flag = 0  用户
     * flag = 1 店家
     * fg = 9
     */
    Gorevervation() {
      var user = localStorage.getItem("buyer_id");
      if (user) {
        // 我自己的项目练习
        // window.location.href =
        //   "http://localhost:8080/#/?user=" + user + "&flag=" + 0 + "&fg=" + "9";

        // 服务器
        window.location.href = pub.tr + user + "&flag=" + 0 + "&fg=" + "9";
      } else {
        window.location.href = "./login.html";
      }
    },

    /**
     * 店铺端进入预约
     */
    Gorevervationshop() {
      var user = localStorage.getItem("buyer_id");
      if (user) {
        // 我自己的项目练习
        // window.location.href =
        //   "http://localhost:8080/#/?user=" +
        //   user +
        //   "&flag=" +
        //   1 +
        //   "&fg=" +
        //   "9" +
        //   "&shop_id=" +
        //   "shop001";

        // 服务器
        window.location.href =
          pub.tr + user + "&flag=" + 1 + "&fg=" + "9" + "&shop_id=" + "shop001";
      } else {
        window.location.href = "./login.html";
      }
    },

    /**
     * 跳转评价
     */
    GoExpress(id) {
      // //  console.log(id);
      if (this.person.customer_id) {
        window.location.href = "./express.html?id=" + this.person.customer_id;
      } else {
        alert("请登录");
      }
    }
  }
});
