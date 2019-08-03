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
    addr_change: 0,
    GoBuyDetail: {},
    money: "0",
    goods: [],

    // 弹出支付的方式
    show_pay_money: false,
    show_go_money: true,
    // 优惠卷列表
    show_dis_pannel: false, // 优惠券的弹出框
    count_list: [], // 优惠券的列表
    coupon_name: "",
    coupon_down_money: "0",
    coupon_total_money: "0",
    show_coupon_info: false, //

    caculate_amount: "", //发送优惠券的商品总额
    coupon_price_detail: "", //优惠券的详情信息
    coupon_select: {}, //用户选择的优惠券信息

    fail_login_msg: "",
    fail_login: false,

    mode_of_payment_zhi: true,
    mode_of_payment_chat: false,

  },
  created() {
    var that = this;
    // 判断 是否 重新选择过地址
    if (localStorage.getItem("SaveAddrObj")) {
      this.edit_address = JSON.parse(localStorage.getItem("SaveAddrObj"));
      this.addr_change = 1;
    } else {
      if (JSON.parse(localStorage.getItem("GoBuyDetail")).receiveAddress[0]) {
        this.addr_change = 0;
        var raddr = JSON.parse(localStorage.getItem("GoBuyDetail"))
          .receiveAddress[0];
        this.receiveAddress = raddr;
      } else {
        this.addr_change = 2;
      }
    }
    this.buyer_id = localStorage.getItem("buyer_id");
    this.GoBuyDetail = JSON.parse(localStorage.getItem("GoBuyDetail"));
    this.goods = JSON.parse(localStorage.getItem("GoBuyDetail")).goods;
  
    this.dept_id = localStorage.getItem("dept_id")
      ? localStorage.getItem("dept_id")
      : this.goods[0].dept_id;
  
    if (this.goods[0].receiveAddress) {
     
    }
    var adr_arr = JSON.parse(localStorage.getItem("GoBuyDetail"))
      .receiveAddress;
    for (var ass = 0; ass < adr_arr.length; ass++) {
      if (adr_arr[ass].default_status_id == "default") {
        this.receiveAddress = adr_arr[ass];
      }
    }

    var money = 0;
    for (var i = 0; i < this.goods.length; i++) {
      money = money + this.goods[i].goods_price * this.goods[i].goods_count;
    }

    this.money = money;
    // 优惠券
    var product_arr = [];
   
    for (var go = 0; go < this.goods.length; go++) {
      this.caculate_amount = this.goods[0].caculate_amount;
      product_arr.push({
        goods_id: this.goods[go].goods_id,
        goods_amount: this.goods[go].goods_amount
      });
    }

    var c_obj = {
      buyer_id: this.buyer_id,
      dept_id: this.dept_id,
      order_amount: this.caculate_amount,
      product_arr: product_arr
    };
  
    pub._Init(
      that,
      pub.disCountUrl,
      "coupon/orderDiscountsCalculate",
      c_obj,
      that.BackCoupon
    );

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

    /**
     * 勾选支付方式之后 支付事件
     * @param {*} parm 订单号
     */
    GoAllMoney(parm, th) {
      const that = th;
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
          beforeSend: function () {
            //  console.log('zhifu')
          },
          error: function (request) {
            //  console.log("Connection error");
          },
          success: function (res) {
            // document.write(res);
            //  console.log("支付返回参数", res);
            pub.after_pay = true
            pub.after_pay_order_id = that._orderid
            //  console.log(pub.after_pay, pub.after_pay_order_id)
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
              pub.after_pay = true
              pub.after_pay_order_id = that._orderid
              window.location.href = res.data;
            } else {
              alert(res.msg);
            }
          }
        });
      }
    },

    /**
     * 暂不支付
     */
    MoneyHide() {
      this.show_go_money = true;
      this.show_pay_money = false;
    },
    /**
     * 展示优惠券的弹框
     */
    ShowCoupon() {
      this.show_dis_pannel = true;
      // 禁止页面滚动
      $("html").css({ height: "100%", overflow: "hidden" });
      $("body").css({ height: "100%", overflow: "hidden" });
    },
    /**
     * 关闭优惠券的框
     */
    CloseCoupon() {
      this.show_dis_pannel = false;
      // 页面滚动
      $("html").css({ height: "100%", overflow: "visible" });
      $("body").css({ height: "100%", overflow: "visible" });
    },
    /**
     * GoSelect 选择优惠券
     */
    GoSelect(c_id) {
      //  console.log(c_id);

      for (var c = 0; c < this.count_list.length; c++) {
        if (this.count_list[c].coupon_id == c_id) {
          this.count_list[c].select = true;
          this.coupon_select = this.count_list[c];
          // //  console.log(c, this.count_list[c].select);
          this.coupon_price_detail = this.count_list[c].coupon_detail;
          this.money = this.count_list[c].order_amount;
          this.show_dis_pannel = false;
          this.show_pay_money = false;
        } else {
          this.count_list[c].select = false;
        }
      }
    },
    /**
     * 优惠券列表的回调
     */
    BackCoupon(res) {

      //  console.log("优惠券的回调", res);
      if (res.code == "200") {
        this.count_list = res.data;
        if (res.data.length) {
          if (res.data.length > 0) {
            this.show_coupon_info = true;
            for (var c = 0; c < this.count_list.length; c++) {
              this.count_list[c].select = false;
            }
            this.coupon_select = this.count_list[0];
            this.count_list[0].select = true;
            this.coupon_price_detail = this.count_list[0].coupon_detail;
            this.money = this.count_list[0].order_amount;

            // this.coupon_down_money = res.data[0].coupon_detail;
            // this.coupon_total_money = res.data[0].order_amount;
            // this.money = res.data[0].order_amount;
            // this.goods[0].caculate_amount = res.data[0].order_amount;
            // this.goods[0].goods_price = res.data[0].order_amount;
          }
        }
      }
      // //  console.log(res.data);
    },

    back() {
      window.history.go(-1);
    },

    /**
     * 订单详情选择地址
     */
    chooseAddress() {
      // //  console.log("订单详情重新选择地址");
      window.location.href = "./adress.html";
    },

    /**
     * 提交 立即购买的订单
     */
    SubmitNowOrder() {
      //  console.log("立即购买提交订单事件");
      var good_arr_list = this.goods;
      // //  console.log(this.goods);
      var good_obj = {};
      var goods_arr = [];
      for (var gd = 0; gd < good_arr_list.length; gd++) {
        goods_arr.push({
          goods_id: good_arr_list[gd].goods_id,
          goods_count: good_arr_list[gd].goods_count,
          universalid: good_arr_list[gd].universalid,
          dept_id: good_arr_list[gd].dept_id
        });
      }
      //  console.log(good_arr_list);
      /**
       * 在提交订单的时候需要提交的信息
       * 地址信息有两种
       * 1 订单返回的地址
       * 2 自己编辑的地址
       */
      // 1 订单返回的地址
      if (!this.addr_change) {
        var default_address = this.receiveAddress;
        var receiver_address =
          default_address.country_name +
          default_address.province_name +
          default_address.city_name +
          default_address.area_name +
          default_address.receive_address;
        var data = {
          dept_id: this.dept_id,
          buyer_id: this.buyer_id,
          receiver_tel: default_address.receive_tel,
          receiver_address: receiver_address,
          receiver_name: default_address.receive_name,
          goods_id: goods_arr[0].goods_id,
          goods_count: goods_arr[0].goods_count,

          coupon_amount: this.coupon_select.coupon_amount
            ? this.coupon_select.coupon_amount
            : "",
          coupon_id: this.coupon_select.coupon_id
            ? this.coupon_select.coupon_id
            : "",
          coupon_detail: this.coupon_select.coupon_detail
            ? this.coupon_select.coupon_detail
            : ""
        };
        //  console.log("返回的地址", default_address, receiver_address, data);
      } else {
        // 2 编辑的地址

        var edit_address = this.edit_address;

        var receiver_address =
          edit_address.province_name +
          edit_address.city_name +
          edit_address.area_name +
          edit_address.receive_address;
        var data = {
          buyer_id: this.buyer_id,
          dept_id: this.dept_id,
          receiver_tel: edit_address.receive_tel,
          receiver_address: receiver_address,
          receiver_name: edit_address.receive_name,
          goods_id: goods_arr[0].goods_id,
          goods_count: goods_arr[0].goods_count,

          coupon_amount: this.coupon_select.coupon_amount
            ? this.coupon_select.coupon_amount
            : "",
          coupon_id: this.coupon_select.coupon_id
            ? this.coupon_select.coupon_id
            : "",
          coupon_detail: this.coupon_select.coupon_detail
            ? this.coupon_select.coupon_detail
            : ""
        };

        // //  console.log("重新选择的地址", edit_address, receiver_address);
      }

      //  console.log("提交立即购买提交订单的参数", data);
      if (this.addr_change != 2) {
        /**
         * 发送后台数据
         */
        var that = this;
        pub._Init(that, pub.url, pub.detail_api.submitBuyNowGoods, data, that.cb_submitBuyNowGoods)
        // $.ajax({
        //   type: "POST",
        //   contentType: "application/json",
        //   url: pub_url + "submitBuyNowGoods",
        //   data: JSON.stringify(data),
        //   error: function (request) {
        //     //  console.log("Connection error");
        //   },
        //   success: function (res) {
        //     //  console.log(res);
        //     if (res.stateCode == 200) {
        //       //  console.log("立即购买提交订单，返回数据", res);
        //       // 执行支付事件
        //       that._orderid = res.data.order_id;
        //       //  console.log('已经生成订单，执行支付操作')
        //       window.location.href = './orderdetail.html?id=' + res.data.order_id + '&fg=1'
        //       // that.GoAllMoney(res.data.order_id, that)
        //     } else {
        //       alert(res.stateMsg);
        //     }
        //   }
        // });
      } else {
        alert("请选择地址");
      }
    },

    cb_submitBuyNowGoods(res) {
      const that = this
      if (res.stateCode == 200) {
        //  console.log("立即购买提交订单，返回数据", res);
        // 执行支付事件
        that._orderid = res.data.order_id;
        //  console.log('已经生成订单，执行支付操作')
        window.location.href = './orderdetail.html?id=' + res.data.order_id + '&fg=1'
        // that.GoAllMoney(res.data.order_id, that)
      } else {
        alert(res.stateMsg);
      }
    },

    /**
     * 待付款确认订单 ConfirmOrder  支付宝
     */
    ConfirmOrder(parm) {
      // //  console.log("支付宝", parm);
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
      var that = this;
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
          document.write(res);
        }
      });
    },

    /**
     * 微信支付
     */
    WachatOrder(parm) {
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
            window.location.href = res.data;
          } else {
            alert(res.msg);
          }
        }
      });
    }

    // 结尾
  }
});
