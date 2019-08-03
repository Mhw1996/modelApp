//浏览器(czy)
$(document).ready(function (e) {

        var counter = 0;

        if (window.history && window.history.pushState) {

            $(window).on('popstate', function () {

                window.history.pushState('forward', null, '#');

                window.history.forward(1);

                 //alert("不可回退");  //如果需在弹框就有它
               self.location="./myorder.html?id=5"; //如查需要跳转页面就用它

            });

        }
        window.history.pushState('forward', null, '#'); //在IE中必须得有这两行

        window.history.forward(1);

    });
/**
 * 截取传来的字符串
 * 注意在截取的时候 开始截取的位置是由参数名字的长度决定的 所以要固定的加上参数名的长度
 * 首先截取传来的所有参数集合
 * 1 截取第一个参数(商品的id)
 * 2 截取第二个参数(店铺id)
 */
var strHref = location.href;
if (strHref.indexOf("?")) {
  var intPos = strHref.indexOf("?");
  intPos = intPos + 4;
  var parm_str = strHref.substring(intPos, strHref.length);
  var and = parm_str.indexOf("&");
  // 商品编号
  var num = parm_str.substring(0, and);
  // 店铺id
  and = and + 6;
  var shop = parm_str.substring(and, parm_str.length);
}
// 订单编号id
var id = num;
var dept_id = shop;

// //  console.log("订单详情页面的订单编号", id, "店铺编号", dept_id);
var pub_url = pub.url;
var app = new Vue({
  el: "#app",
  data: {
    dept_id: "",
    buyer_id: "",
    orderid: "",
    orderdetail: {},
    current: "0",
    classShow: false,
    edit_address: {}, //重新选择的地址
    addr_change: false,
    // 待收货订单的orderExpress 查看物流
    orderExpress: {},

    // 弹出支付的方式
    show_pay_money: false,
    show_go_money: true,
    // 优惠卷列表
    show_dis_pannel: false, // 优惠券的弹出框
    count_list: [], // 优惠券的列表
    coupon_name: "",
    coupon_down_money: "0",
    coupon_total_money: "0",
    show_coupon_info: false,//

    mode_of_payment_zhi: true,
    mode_of_payment_chat: false,
    check_money: false, // 标记 是否完成支付的弹框
  },
  created() {
    const that = this;

   
    if ( JSON.parse(localStorage.getItem("target")) == 'true') {
      //  console.log('弹出弹框')
      localStorage.setItem("target", JSON.stringify('false'));
      this.show_pay_money = true;
      this.check_money = true
    } else {
      //  console.log('支付完成')
      localStorage.removeItem('zhi')
      localStorage.removeItem('order_id')
      localStorage.removeItem('is_fg')
      localStorage.removeItem('target')
    }


    // 判断 是否 重新选择过地址
    if (localStorage.getItem("SaveAddrObj")) {
      //  console.log("有缓存");
      this.edit_address = JSON.parse(localStorage.getItem("SaveAddrObj"));

      this.addr_change = true;
    } else {
      //  console.log("没有地址缓存");
    }
    // this.dept_id = localStorage.getItem("dept_id");
    this.dept_id = shop;

    this.buyer_id = localStorage.getItem("buyer_id");
    // this.orderid = id;
    this.orderid = pub._parm('id')
    // //  console.log(this.orderid)
    var data = {
      // dept_id: this.dept_id,
      order_id: this.orderid
    };
    // this.SearchOrder(data, this.SetOrder);

    pub._Init(that, pub.url, pub.detail_api.orderDetails, data, that.cb_orderDetails)
    if (pub._parm('fg') == '1') {
      //  console.log('立即购买的跳转')
      this.show_pay_money = true;
      this.mode_of_payment_zhi = true
    }
    /**
     * 查询物流
     */
    var _goodinfo = {
      order_id: this.orderid
    };
    // this.Logiscs(_goodinfo);
   pub._Init(that, pub.url, pub.detail_api.findOrderExpress, _goodinfo, that.cb_findOrderExpress)
  },
  computed: {},
  methods: {


    Change_zhi() {
      const that = this;
      that.mode_of_payment_zhi = !that.mode_of_payment_zhi
      that.mode_of_payment_chat = false
    },
    Change_chat() {
      const that = this;
      that.mode_of_payment_zhi = false
      that.mode_of_payment_chat = !that.mode_of_payment_chat
    },

    GoAllMoney(parm) {
      const that = this;
      if (that.mode_of_payment_zhi) {
        var data = {
          userId: this.dept_id,
          // SHout_trade_no: parm,
          // // SHtotal_amount: money,
          // SHtotal_amount: this.orderdetail.order_amount,
          // SHsubject: name_str,
          // SHbody: "手机商城合单",
          order_id: parm,
          payScene: "buy" //标记购买场景
        };
        //  console.log("支付宝支付参数", data);

        $.ajax({
          type: "POST",
          // contentType: "application/json",
          url: pub.money + "alipayTradeWapPay",
          data: data,
          error: function (request) {
            //  console.log("Connection error");
          },
          success: function (res) {
            // document.write(res);
            //  console.log("支付返回参数", res);
            // document.write(res);
            GoBuyDetail = JSON.stringify(res);
            localStorage.setItem("zhi", GoBuyDetail);
            localStorage.setItem("order_id", JSON.stringify(that.orderid));
            localStorage.setItem("is_fg", JSON.stringify('1'));
            window.location.href = './panmoney.html'
          }
        });
      } else if (that.mode_of_payment_chat) {
        var data = {
          userId: this.dept_id,
          order_id: parm,
          payScene: "buy" //标记购买场景
        };
        //  console.log("微信支付参数", data);
        $.ajax({
          type: "POST",
          // contentType: "application/json",
          url: pub.money + "weChatTradeH5Pay",
          data: data,
          error: function (request) {
            //  console.log("Connection error");
          },
          success: function (res) {
            //  console.log("微信支付返回参数", res);
            // window.location.href = res.data;
            if (res.code == "200") {
              that.check_money = true
              // window.location.href = res.data;
              window.location.href = './panmoney.html'
              localStorage.setItem("zhi", JSON.stringify(res.data));
              localStorage.setItem("order_id", JSON.stringify(that.orderid));
              localStorage.setItem("is_fg", JSON.stringify('2'));
            } else {
              alert(res.msg);
            }
          }
        });
      }
    },

    /**
     * 关闭弹框
     */
    CloseDisPannel() {
      this.show_dis_pannel = false;
    },



    /**
     * 点我付款 出现弹框
     */
    GoMoney() {
      this.show_go_money = false;
      this.show_pay_money = true;
    },


    GoCheckOrder() {
      const that = this
      //  console.log(this.orderid)
      var data = {
        // dept_id: this.dept_id,
        order_id: this.orderid
      };
      // this.SearchOrder(data, this.SetOrder);

      pub._Init(that, pub.url, pub.detail_api.orderDetails, data, that.cb_look_order)
    },

    cb_look_order(res) {
      //  console.log(res)
      if (res.stateCode == '200') {
        if (res.data.order_status_id == 'in_padment') {
          alert('请先完成付款！');
          this.show_pay_money = true;
          this.check_money = false
        } else {
          window.location.href = './myorder.html?id=5'
        }
      } else {
        alert(res.stateMsg)
      }
    },

    /**
     * 暂不支付
     */
    MoneyHide() {
      this.show_go_money = true;
      this.show_pay_money = false;
      this.check_money = false
    },
    /**
     * 请求后台数据 回调函数设置数据
     */
    // SearchOrder: function (data, cb) {
    //   var that = this;
    //   $.ajax({
    //     type: "POST",
    //     contentType: "application/json",
    //     url: pub_url + "orderDetails",
    //     data: JSON.stringify(data),
    //     error: function (request) {
    //       //  console.log("Connection error");
    //     },
    //     success: function (res) {
    //       if (res.stateCode == 200) {
    //         //  console.log("返回订单条目信息", res.data);
    //         cb(res.data);
    //       } else {
    //         //  console.log("请求数据失败");
    //       }
    //     }
    //   });
    // },
    cb_orderDetails(res) {
      if (res.stateCode == 200) {
        //  console.log("返回订单条目信息", res.data);
        this.SetOrder(res.data);
      } else {
        //  console.log("请求数据失败");
      }
    },
    SetOrder(res) {
      var that = this;
      // //  console.log(res)
      var current_text = res.order_status_id;
      var current_num = 0;
      switch (current_text) {
        case "in_padment":
          current_num = 1;
          break;
        case "in_receive":
          current_num = 3;
          break;
        case "finished":
          current_num = 5;
          break;
        case "in_evaluate":
          current_num = 4;
          break;
        case "paid":
          current_num = 2;
          break;
      }
      this.orderdetail = res;
      this.dept_id = res.dept_id
      this.current = current_num;
      //  console.log(this.orderdetail);
      this.coupon_total_money = this.orderdetail.order_amount;
      if (res.coupon_id) {
        this.show_coupon_info = true;
        this.coupon_down_money = res.coupon_detail
      }
      // //  console.log("执行优惠券的函数"); 
      // var product_arr = [];
      // for (var gh = 0; gh < this.orderdetail.orderGoods.length; gh++) {
      //   product_arr.push({
      //     goods_id: this.orderdetail.orderGoods[gh].goods_id,
      //     goods_amount: this.orderdetail.orderGoods[gh].goods_amount
      //   });
      // }
      // var c_obj = {
      //   buyer_id: this.orderdetail.buyer_id,
      //   dept_id: this.orderdetail.dept_id,
      //   order_amount: this.orderdetail.order_amount,
      //   product_arr: product_arr
      // };
      // //  console.log(c_obj);
      // pub._Init(
      //   that,
      //   pub.disCountUrl,
      //   "coupon/orderDiscountsCalculate",
      //   c_obj,
      //   that.BackCoupon
      // );
    },

    BackCoupon(res) {
      //  console.log("优惠券的回调", res);
      if (res.code == "200") {
        this.count_list = res.data;
        if (res.data.length > 0) {
          this.show_coupon_info = true;
          for (var c = 0; c < res.data.length; c++) {
            res.data[c].select = false;
          }
          res.data[0].select = true;
          this.coupon_down_money = res.data[0].coupon_detail;
          this.coupon_total_money = res.data[0].order_amount;
          this.orderdetail.order_amount = res.data[0].order_amount;
        }
      }
      // //  console.log(res.data);
    },

    ShowCoupon() {
      this.show_dis_pannel = true;
    },

    // 选择优惠券
    GoSelect(parm) {
      //  console.log("选择优惠券", parm);
      // //  console.log(this.count_list)
      for (var u = 0; u < this.count_list.length; u++) {
        this.count_list[u].select = false;
        if (this.count_list[u].coupon_id == parm) {
          this.count_list[u].select = true;
          // this.show_dis_pannel = false
          this.coupon_down_money = this.count_list[u].coupon_detail;
          this.coupon_total_money = this.count_list[u].order_amount;
          this.orderdetail.order_amount = this.count_list[u].order_amount;
        }
      }
      // //  console.log(this.count_list);
    },
    /**
     * 订单取消事件
     */
    CancelOrder(parm) {
      //  console.log("删除订单");
      // //  console.log("需要取消的订单编号", parm);
      var that = this;
      // //  console.log("删除事件", "id", id);
      var flag = confirm("确认取消么？");
      if (flag) {
        var data = {
          dept_id: that.dept_id,
          order_id: parm
        };
        // //  console.log(data);
        pub._Init(that, pub.url, pub.detail_api.deleteOrder, data, that.cb_deleteOrder)
        // $.ajax({
        //   type: "POST",
        //   contentType: "application/json",
        //   url: pub_url + "deleteOrder",
        //   data: JSON.stringify(data),
        //   error: function (request) {
        //     alert("Connection error");
        //   },
        //   success: function (res) {
        //     if (res.stateCode == 200) {
        //       //  console.log("删除成功", res);
        //       window.location.href = "./myorder.html?id=5";
        //     } else {
        //       //  console.log("删除失败");
        //       alert("删除失败");
        //     }
        //   }
        // });
      }
    },
    cb_deleteOrder(res) {
      if (res.stateCode == 200) {
        //  console.log("删除成功", res);
        window.location.href = "./myorder.html?id=5";
      } else {
        //  console.log("删除失败");
        alert("删除失败");
      }
    },
    /**
     * 待付款确认订单 ConfirmOrder
     */
    ConfirmOrder(parm) {
      var data = {
        userId: this.dept_id,
        // SHout_trade_no: parm,
        // // SHtotal_amount: money,
        // SHtotal_amount: this.orderdetail.order_amount,
        // SHsubject: name_str,
        // SHbody: "手机商城合单",
        order_id: parm,
        payScene: "buy" //标记购买场景
      };
      //  console.log("支付宝参数", data);
      //
      //调用支付宝支付接口
      $.ajax({
        type: "POST",
        // contentType: "application/json",
        url: pub.money + "alipayTradeWapPay",
        data: data,
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          document.write(res);
          // //  console.log("支付返回参数", res);

        }
      });
    },

    /**
     * 微信支付
     */
    WachatOrder(parm) {
      // var data = {
      //   userId: this.dept_id,
      //   SHout_trade_no: parm,
      //   SHtotal_amount: this.orderdetail.order_amount,
      //   SHsubject: name_str,
      //   SHbody: "手机商城合单",
      //   order_id: parm,
      //   payScene: "buy" //标记购买场景
      // };
      var data = {
        userId: this.dept_id,
        // SHout_trade_no: parm,
        // SHtotal_amount: this.orderdetail.order_amount,
        // SHsubject: name_str,
        // SHbody: "手机商城合单",
        order_id: parm,
        payScene: "buy" //标记购买场景
      };
      //  console.log("微信支付参数", data);
      //调用微信支付接口
      $.ajax({
        type: "POST",
        // contentType: "application/json",
        url: pub.money + "weChatTradeH5Pay",
        data: data,
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          window.location.href = res.data;
          // //  console.log("微信支付返回参数", res.data);
          if (res.code == "200") {
            window.location.href = res.data;
          } else {
            alert(res.msg);
          }
        }
      });
    },
    back() {
      // window.history.go(-1);
      window.location.href = './myorder.html?id=5'
    },

    /**
     * 订单详情选择地址
     */
    chooseAddress() {
      //  console.log("订单详情重新选择地址");
      window.location.href = "./adress.html";
    },

    /**
     * 跳转评价
     */
    GoValue(id, na, img) {
      // id 为需要评价的商品id
      var g_id = id;
      var g_name = na;
      var g_img = img;
      /**
       * 订单详情 this.orderdetail
       * 
       * 传递参数格式
       *  order_id: "1111",                    //假数据
          dept_id: "shop001",                  //假数据
          product_id: "xlg1",                  //假数据
          product_name: "白籽石榴",             //假数据
          product_evaluation_userId: "111",    //用户id
          product_evaluation_userName: "白徐",  //假数据
       */
      // //  console.log(JSON.parse(localStorage.getItem("mine")).customer_name)
      var good_arr = this.orderdetail.orderGoods;
      var _obj = {
        order_id: this.orderdetail.order_id,
        dept_id: this.orderdetail.dept_id,
        product_id: g_id,
        product_evaluation_userId: this.orderdetail.buyer_id,
        product_name: g_name,
        mini_img: g_img,
        product_evaluation_userName: JSON.parse(localStorage.getItem("mine"))
          .customer_name
      };

      // //  console.log(_obj)

      // 先转成json串
      // //  console.log(JSON.stringify(_obj));
      // 在转base64
      // //  console.log(Base64.encode(JSON.stringify(_obj)));
      // 解析base64
      // //  console.log(Base64.decode(Base64.encode(JSON.stringify(_obj))));

      var _str = Base64.encode(JSON.stringify(_obj));
      window.location.href = "./mkComment/index.html?" + _str;
    },

    // GoFun(that, data, url, cbk) {
    //   $.ajax({
    //     type: "POST",
    //     // contentType: "application/json",
    //     url: pub_url + url,
    //     data: data,
    //     error: function (request) {
    //       //  console.log("Connection error");
    //     },
    //     success: function (res) {
    //       //  console.log("查看物流", res);
    //       cbk(res);
    //     }
    //   });
    // },

    /**
     * 查看物流
     */
    Logiscs(data) {
     var that = this;

      $.ajax({
        type: "POST",
        contentType: "application/json",
        url: pub_url + "findOrderExpress",
        data: JSON.stringify(data),
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          if (res.data.orderExpress) {
		
           that.orderExpress = res.data.orderExpress;
            //  console.log(that.orderExpress);
          }

        }
      });
    },
     cb_findOrderExpress(res) {
		 var that = this;
      if (res.data.orderExpress) {
		     //  console.log("查看物流21"+res.data.orderExpress);
        that.orderExpress = res.data.orderExpress;
		  //  console.log(that.orderExpress);
     
      }

    },

    /**
     * 订单确认收货
     */
    GoRecieveGood(data) {
      var _goodinfo = {
        order_id: data
      };
      //  console.log(_goodinfo);
      var that = this;
      pub._Init(that, pub.url, pub.detail_api.userConfirmationOrderStatus, _goodinfo, that.cb_userConfirmationOrderStatus)
      // $.ajax({
      //   type: "POST",
      //   contentType: "application/json",
      //   url: pub_url + "userConfirmationOrderStatus",
      //   data: JSON.stringify(_goodinfo),
      //   error: function (request) {
      //     alert("Connection error");
      //   },
      //   success: function (res) {
      //     //  console.log(res);
      //     if (res.stateCode == "200") {
      //       window.location.href = "./myorder.html?id=4";
      //     } else {
      //       alert("确认收货失败");
      //     }
      //   }
      // });
    },
    cb_userConfirmationOrderStatus(res) {
      //  console.log("mmm:"+res);
      if (res.stateCode == "200") {
        window.location.href = "./myorder.html?id=4";
      } else {
        alert("确认收货失败");
      }
    },
    Go_hide_pay() {
      // this.show_pay_money = false
    },
    // 结尾
  }
});
