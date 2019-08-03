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
    receiveAddress: {},

    // 优惠券
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

    mode_of_payment_zhi: false,
    mode_of_payment_chat: false
  },
  created() {
    // 判断 是否 重新选择过地址
    if (localStorage.getItem("GoBuyDetail")) {
      //  console.log(78);
    } else {
      window.location.href = "./car.html";
    }
    if (localStorage.getItem("SaveAddrObj")) {
      //  console.log("有缓存");
      this.edit_address = JSON.parse(localStorage.getItem("SaveAddrObj"));
      //  console.log(this.edit_address);
      this.addr_change = 1;
    } else {
      //  console.log("没有地址缓存");

      if (JSON.parse(localStorage.getItem("GoBuyDetail")).receiveAddress[0]) {
        this.addr_change = 0;
      } else {
        this.addr_change = 2;
      }
    }
    // this.dept_id = localStorage.getItem("dept_id");
    this.buyer_id = localStorage.getItem("buyer_id");
    this.GoBuyDetail = JSON.parse(localStorage.getItem("GoBuyDetail"));
    this.goods = JSON.parse(localStorage.getItem("GoBuyDetail")).goods;
    //  console.log(this.goods);
    /**
     * 因为优惠券的原因所以整个商城只可以有一家店铺
     */
    this.dept_id = this.goods[0].dept_id;

    var adr_arr = JSON.parse(localStorage.getItem("GoBuyDetail")).receiveAddress;
    for (var ass = 0; ass < adr_arr.length; ass++) {
      if (adr_arr[ass].default_status_id == "default") {
        this.receiveAddress = adr_arr[ass];
      }
    }

    // //  console.log(this.receiveAddress);
    var money = 0;
    for (var i = 0; i < this.goods.length; i++) {
      money = money + this.goods[i].goods_price * this.goods[i].goods_count;
    }

    this.money = money;

    // 优惠券
    var product_arr = [];
    //  console.log(this.goods);
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
      order_amount: this.GoBuyDetail.caculate_amount,
      product_arr: product_arr
    };
    //  console.log(c_obj);
    var that = this;
    pub._Init(
      that,
      pub.disCountUrl,
      pub.detail_api.coupon_orderDiscountsCalculate,
      c_obj,
      that.BackCoupon
    );
  },
  computed: {},
  methods: {
    Change_zhi() {
      const that = this;
      that.mode_of_payment_zhi = !that.mode_of_payment_zhi;
      that.mode_of_payment_chat = false;
    },
    Change_chat() {
      const that = this;
      that.mode_of_payment_zhi = false;
      that.mode_of_payment_chat = !that.mode_of_payment_chat;
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
          error: function(request) {
            //  console.log("Connection error");
          },
          success: function(res) {
            // document.write(res);
            //  console.log("支付返回参数", res);
            document.write(res);
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
          error: function(request) {
            //  console.log("Connection error");
          },
          success: function(res) {
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
      // 页面滚动
      $("html").css({ height: "100%", overflow: "visible" });
      $("body").css({ height: "100%", overflow: "visible" });
      this.show_dis_pannel = false;
    },
    /**
     * GoSelect 选择优惠券
     */
    GoSelect(c_id) {
      for (var c = 0; c < this.count_list.length; c++) {
        if (this.count_list[c].coupon_id == c_id) {
          this.count_list[c].select = true;
          this.coupon_select = this.count_list[c];
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
        if (res.data.length > 0) {
          this.show_coupon_info = true;
          for (var c = 0; c < this.count_list.length; c++) {
            this.count_list[c].select = false;
          }
          this.coupon_select = this.count_list[0];
          this.count_list[0].select = true;
          this.coupon_price_detail = this.count_list[0].coupon_detail;
          this.money = this.count_list[0].order_amount;
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
     * 点击提交订单 购物车的订单
     */
    SubmitOrder() {
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
      // //  console.log(good_arr_list);
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
          goods: goods_arr,
          // 优惠券
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
          goods: goods_arr,
          // 优惠券
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
        //  console.log("用户选择地址");
      }

      if (this.addr_change != 2) {
        // //  console.log("重新选择的地址", edit_address, receiver_address);
        // //  console.log("提交立即购买提交订单的参数", data);
        /**
         * 发送后台数据
         */
        var that = this;
        pub._Init(that, pub.url, pub.detail_api.submitShoppingCartGoods, data, that.cb_submitShoppingCartGoods)
        // $.ajax({
        //   type: "POST",
        //   contentType: "application/json",
        //   url: pub_url + "submitShoppingCartGoods",
        //   // url: "http://192.168.1.123/malls/api/submitShoppingCartGoods",
        //   data: JSON.stringify(data),
        //   error: function(request) {
        //     //  console.log("Connection error");
        //   },
        //   success: function(res) {
        //     //  console.log("提交订单，返回数据", res);
        //     if (res.stateCode == 200) {
        //       //  console.log("提交订单，返回数据", res.data);
        //       //跳转订单了列表 同时清空缓存中的购买信息

        //       if (res.data.order_id.length != 0) {
        //         /**
        //          * 项目之初设计为多店铺，最后因为优惠券的加入修改为单店铺 所以从购物车跳转的订单详情页面，在付款提交的返回的订单号是一个数组
        //          * 然后在优惠券的使用中我只使用了第一个数组的第一个 事实是该订单号书组中就只有一个订单号
        //          */
        //         that._orderid = res.data.order_id[0];
        //         // that.show_pay_money = true;
        //         window.location.href = './orderdetail.html?id='+res.data.order_id[0]+'&fg=1'
        //         localStorage.removeItem("GoBuyDetail");
        //       } else {
        //         alert("重新提交");
        //       }
        //     } else {
        //       alert(res.stateMsg);
        //     }
        //   }
        // });
      } else {
        alert("请选择地址");
      }
    },
    cb_submitShoppingCartGoods(res){
      //  console.log("提交订单，返回数据", res);
      const that = this
      if (res.stateCode == 200) {
        //  console.log("提交订单，返回数据", res.data);
        //跳转订单了列表 同时清空缓存中的购买信息

        if (res.data.order_id.length != 0) {
          /**
           * 项目之初设计为多店铺，最后因为优惠券的加入修改为单店铺 所以从购物车跳转的订单详情页面，在付款提交的返回的订单号是一个数组
           * 然后在优惠券的使用中我只使用了第一个数组的第一个 事实是该订单号书组中就只有一个订单号
           */
          that._orderid = res.data.order_id[0];
          // that.show_pay_money = true;
          window.location.href = './orderdetail.html?id='+res.data.order_id[0]+'&fg=1'
          localStorage.removeItem("GoBuyDetail");
        } else {
          alert("重新提交");
        }
      } else {
        alert(res.stateMsg);
      }
    },
    /**
     * 支付宝
     */
    ConfirmOrder(parm) {
      // var data = {
      //   userId: this.dept_id,
      //   SHout_trade_no: parm,
      //   SHtotal_amount: money,
      //   SHtotal_amount: this.orderdetail.order_amount,
      //   SHsubject: name_str,
      //   SHbody: "手机商城合单",
      //   order_id: parm,
      //   payScene: "buy" //标记购买场景
      // };
      var data = {
        userId: this.dept_id,
        order_id: parm,
        payScene: "buy" //标记购买场景
      };
      //  console.log("支付宝支付参数", data);

      $.ajax({
        type: "POST",
        // contentType: "application/json",
        url: pub.money + "alipayTradeWapPay",
        data: data,
        error: function(request) {
          //  console.log("Connection error");
        },
        success: function(res) {
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
        error: function(request) {
          //  console.log("Connection error");
        },
        success: function(res) {
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
