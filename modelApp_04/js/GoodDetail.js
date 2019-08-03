
var id = pub._parm('id') ? pub._parm('id') : ''
var dept_id = pub._parm('shop') ? pub._parm('shop') : '';
var pub_url = pub.url;

/**
 *轮播
 */
var _course = function () {
  var swiper = new Swiper(".swiper-container", {
    autoplay: {
      delay: 1000,
      stopOnLastSlide: false,
      disableOnInteraction: true
    },
    loop: true,
    autoplayDisableOnInteraction: false,
    pagination: {
      el: ".swiper-pagination"
    }
  });
};
/**
 * vue
 */
var app = new Vue({
  el: "#app",
  data: {
    buyer_id: "",
    id: "",
    dept_id: "",
    list: [],
    img: [],
    GoodsInfo: {},
    GoodsSole: {},
    ipt: 1,
    foot: false,
    person: false,
    // 详情图片
    detail_picture: [],
    // 处理过后的商品详情信息
    productDtl: {},
    // 优惠卷
    coupon_obj: {}, //优惠卷对象
    show_dis_pannel: false, // 优惠券的弹出框
    show_coupon: false, // 详情中的领取优惠券的提示
    productCoupon_list: [], // 商品优惠券的列表
    str_coupon_shop: "", // 店铺优惠券说明
    str_coupon_good: "", //商品优惠券说明
    shopCoupon_list: [], // 店铺的优惠卷列表
    dis_count_shop_id: "", // 点击优惠券的店铺
    dis_count_goods_id: "", // 点击优惠券的商品
    dis_count_coupon_id: "", //点击立即领取使用
    evaluation_arr: [], // 评价信息数组
    evaluation_obj: {}, // 评价信息
    evaluation_count: 0, // 评价总数
    goodsTypeCount: 0,
    show_car: false,

    rollIn: false
  },
  created() {
    //  console.log(pub.after_pay, pub.after_pay_order_id)

    this.buyer_id = localStorage.getItem("buyer_id");
    const that = this
    if (localStorage.getItem("buyer_id")) {
      this.person = true;
      //  查询购物车的数量
      pub._Init(
        that,
        pub.url,
        pub.detail_api.api_shoppingcarGoodsCount,
        {
         buyer_id: this.buyer_id
        },
        that.cb_api_shoppingcarGoodsCount
      );
  }


    this.id = id;
    this.dept_id = dept_id;
    // //  console.log(this.dept_id,this.id)
    var gooddata = {
      dept_id: this.dept_id,
      goods_id: this.id
    };

    // //  console.log(gooddata);
    var dis_count_data = {
      shop_id: this.dept_id,
      product_id: this.id,
      user_id: this.buyer_id
    };
    // //  console.log("优惠券参数", dis_count_data);

    pub._Init(
      that,
      pub.disCountUrl,
      pub.detail_api.coupon_productCouponList,
      dis_count_data,
      that.BackDisCountList
    );
    // this.InitAjax(gooddata);
    pub._Init(that, pub.url, pub.detail_api.findGoods, gooddata, that.cb_findGoods)
    pub._Init(
      that,
      pub.express_url,
      pub.detail_api.api_listProductEvaluationPage,
      {
        pageNum: "1",
        product_id: this.id,
        pageSize: "1"
      },
      that.cb_api_listProductEvaluationPage
    );


    // 查询评价
  },
  methods: {
    cb_findGoods(res) {
      //  console.log(res)
      const that = this
      if (res.stateCode == 200) {
        app.list = res.data;
        // app.img = res.data[1].GoodsImg;
        // 在设置过数据之后 执行轮播图函数
        // //  console.log(res.data[1].GoodsImg);

        var productDtl = {};
        for (var it = 0; it < res.data.length; it++) {
          for (var item in res.data[it]) {
            productDtl[item] = res.data[it][item];
          }
        }
        this.productDtl = productDtl;
        // //  console.log(productDtl);
        //  console.log("商品信息", this.productDtl);
        var bann_arr = [];
        for (var y = 0; y < productDtl.GoodsImg.length; y++) {
          if (
            productDtl.GoodsImg[y].goods_img_type_id == "broadcast_picture"
          ) {
            bann_arr.push(productDtl.GoodsImg[y]);
          }
        }
        // 详情图
        var detail_picture = [];

        for (var dy = 0; dy < productDtl.GoodsImg.length; dy++) {
          if (
            productDtl.GoodsImg[dy].goods_img_type_id == "detail_picture"
          ) {
            detail_picture.push(productDtl.GoodsImg[dy]);
          }
        }
        // //  console.log(detail_picture);
        that.detail_picture = detail_picture;
        // //  console.log(bann_arr);

        app.Banner(bann_arr);
        // 设置商品信息
        app.GoodsInfo = res.data[0].GoodsInfo;
        // 销售信息
        app.GoodsSole = res.data[2].GoodsSole;
      } else {
        //  console.log("请求数据失败");
      }
    },
    // InitAjax(data, cb) {
    //   var that = this;

    //   pub._Init(that, pub.url, pub.detail_api.delReceive, data, that.cb_)
    //   $.ajax({
    //     type: "POST",
    //     contentType: "application/json",
    //     url: pub_url + "findGoods",
    //     data: JSON.stringify(data),
    //     error: function (request) {
    //       //  console.log("Connection error");
    //     },
    //     success: function (res) {
    //       if (res.stateCode == 200) {
    //         app.list = res.data;
    //         // app.img = res.data[1].GoodsImg;
    //         // 在设置过数据之后 执行轮播图函数
    //         // //  console.log(res.data[1].GoodsImg);

    //         var productDtl = {};
    //         for (var it = 0; it < res.data.length; it++) {
    //           for (var item in res.data[it]) {
    //             productDtl[item] = res.data[it][item];
    //           }
    //         }
    //         this.productDtl = productDtl;
    //         // //  console.log(productDtl);
    //         //  console.log("商品信息", this.productDtl);
    //         var bann_arr = [];
    //         for (var y = 0; y < productDtl.GoodsImg.length; y++) {
    //           if (
    //             productDtl.GoodsImg[y].goods_img_type_id == "broadcast_picture"
    //           ) {
    //             bann_arr.push(productDtl.GoodsImg[y]);
    //           }
    //         }
    //         // 详情图
    //         var detail_picture = [];

    //         for (var dy = 0; dy < productDtl.GoodsImg.length; dy++) {
    //           if (
    //             productDtl.GoodsImg[dy].goods_img_type_id == "detail_picture"
    //           ) {
    //             detail_picture.push(productDtl.GoodsImg[dy]);
    //           }
    //         }
    //         // //  console.log(detail_picture);
    //         that.detail_picture = detail_picture;
    //         // //  console.log(bann_arr);

    //         app.Banner(bann_arr);
    //         // 设置商品信息
    //         app.GoodsInfo = res.data[0].GoodsInfo;
    //         // 销售信息
    //         app.GoodsSole = res.data[2].GoodsSole;
    //       } else {
    //         //  console.log("请求数据失败");
    //       }
    //     }
    //   });
    // },
    cb_api_shoppingcarGoodsCount(res) {
      const that = this;
      //  console.log("购物车的数量回调", res);
      if (res.stateCode == '200') {

        that.goodsTypeCount = res.data.goodsTypeCount
        that.show_car = true
      }
    },

    /**
     * 评价回调
     * @param {*} res
     */
    cb_api_listProductEvaluationPage(res) {
      //  console.log("查询评价回调", res);
      const that = this;
      if (res.stateCode == "200") {
        that.evaluation_arr = res.data.pageInfo.list;
        that.evaluation_obj = res.data.pageInfo.list[0];
        that.evaluation_count =
          res.data.productEvaluationScoreCount.bad +
          res.data.productEvaluationScoreCount.common +
          res.data.productEvaluationScoreCount.nice;
      }
    },

    GoProductReview() {
      // if(this.person){
      //   window.location.href = './productReview.html?s_id='+this.buyer_id
      // }else{
      //   alert('请登录查看')
      // }
      window.location.href = "./productReview.html?g_id=" + this.id;
    },

    /**
     * 关闭弹框
     */
    CloseDisPannel() {
      this.show_dis_pannel = false;
      // 页面滚动
      $("html").css({ height: "100%", overflow: "visible" });
      $("body").css({ height: "100%", overflow: "visible" });
    },

    /**
     * 优惠券
     */
    GoDisCount() {
      this.show_dis_pannel = true;
      // 禁止页面滚动
      $("html").css({ height: "100%", overflow: "hidden" });
      $("body").css({ height: "100%", overflow: "hidden" });
    },
    BackDisCountList(res) {
      //  console.log("店铺优惠券的回调函数的", res);

      if (res.code == "200") {
        this.coupon_obj = res.data;
        this.productCoupon_list = res.data.productCoupon;

        this.shopCoupon_list = res.data.shopCoupon;
        // //  console.log(
        //   this.productCoupon_list.length,
        //   this.shopCoupon_list.length
        // );
        if (
          this.productCoupon_list.length > 0 ||
          this.shopCoupon_list.length > 0
        ) {
          this.show_coupon = true;
        }
        var shop_str = "";
        if (this.shopCoupon_list.length) {
          for (var i = 0; i < this.shopCoupon_list.length; i++) {
            shop_str =
              shop_str +
              "满" +
              this.shopCoupon_list[i].coupon_use_condition +
              `可用 `;
          }
        } else {
          shop_str = "";
        }
        this.str_coupon_shop = shop_str;
        var good_str = "";
        if (this.productCoupon_list.length) {
          for (var i = 0; i < this.productCoupon_list.length; i++) {
            good_str =
              good_str +
              "满" +
              this.productCoupon_list[i].coupon_use_condition +
              `可用 `;
          }
        } else {
          good_str = "";
        }
        this.str_coupon_good = good_str;
        // //  console.log(shop_str, good_str);
      } else {
        //  console.log("店铺优惠券数据异常");
      }
    },

    /**
     * 立即领取
     */
    GoReceive(pa) {
      if (this.buyer_id) {
        var that = this;
        //  console.log("立即领取", pa, this.dis_count_shop_id);
        this.dis_count_coupon_id = pa;
        var data = {
          user_id: this.buyer_id,
          coupon_id: pa,
          product_id: this.id,
          shop_id: this.dept_id
        };
        // //  console.log("立即领取", pa, this.dis_count_shop_id);
        //  console.log(data);
        pub._Init(
          that,
          pub.disCountUrl,
          pub.detail_api.coupon_getCoupon,
          data,
          that.BackReceive
        );
      } else {
        alert("请先登录");
        window.location.href = "./login.html";
      }
    },

    /**
     * 立即领取成功之后 自行修改领取状态 页面显示去使用
     */
    BackReceive(res) {
      //  console.log("领取优惠卷的回调", res);
      if (res.code == "200") {
        //  console.log(this.shopCoupon_list);
        for (var x = 0; x < this.shopCoupon_list.length; x++) {
          if (this.dis_count_coupon_id == this.shopCoupon_list[x].coupon_id) {
            this.shopCoupon_list[x].coupon_send_status = "CLOSE";
          }
        }
        for (var x = 0; x < this.productCoupon_list.length; x++) {
          if (
            this.dis_count_coupon_id == this.productCoupon_list[x].coupon_id
          ) {
            this.productCoupon_list[x].coupon_send_status = "CLOSE";
          }
        }
      } else if (res.code == "BEYOND_LIMIT") {
        alert(res.msg);
      } else if (res.code == "NONE") {
        alert(res.msg);
      }
    },
    /**
     * 请求原始数据
     */

    back() {
    window.history.go(-1);
    console.log('这是返回店铺首页的返回键')
    },
    GoShopCar() { },
    GoCar() {
      //  console.log("跳转购物车");
      window.location.href = "./car.html?id=" + this.buyer_id;
    },
    AddShopCar(goodid) {

      var that = this;
      that.show_car = false
      var data = {
        buyer_id: this.buyer_id,
        goods_count: "1",
        goods_id: this.id
        // dept_id: this.dept_id
      };
      // //  console.log(goodid, data);
      // //  console.log(this.GoodsSole.sale_price);
      if (this.person) {
        if (this.GoodsSole.sale_price) {
          pub._Init(that, pub.url, pub.detail_api.saveShoppingCartGoods, data, that.cb_saveShoppingCartGoods)
          // $.ajax({
          //   type: "POST",
          //   contentType: "application/json",
          //   url: pub_url + "saveShoppingCartGoods",
          //   data: JSON.stringify(data),
          //   error: function (request) {
          //     //  console.log("Connection error");
          //   },
          //   success: function (res) {
          //     //  console.log(res);

          //     if (res.stateCode == 200) {
          //       //  console.log("添加购物车成功", res);
          //       // alert("添加成功");
          //       pub._Init(
          //         that,
          //         pub.url,
          //         pub.detail_api.api_shoppingcarGoodsCount,
          //         {
          //           buyer_id: that.buyer_id
          //         },
          //         that.cb_api_shoppingcarGoodsCount
          //       );
          //       // 加入购物车的翻滚动画
          //       $('.car_success').show()
          //       $('.car_success').addClass('rollIn')
          //       setTimeout(function () {
          //         $('.car_success').addClass('rollOut')
          //         $('.car_success').removeClass('rollIn')
          //         setTimeout(function () {
          //           $('.car_success').removeClass('rollOut')
          //           $('.car_success').hide()
          //         }, 1000)
          //       }, 1000)

          //       // 
          //     } else {
          //       // //  console.log("失败");
          //       alert("添加失败，重新添加");
          //     }
          //   }
          // });
        } else {
          alert("该商品信息不全，请更换商品！");
        }
      } else {
        alert("请登录");
        // this.openCenter()
        window.location.href = "./login.html";
      }
    },

    cb_saveShoppingCartGoods(res) {
      const that = this;
      //  console.log(res);

      if (res.stateCode == 200) {
        //  console.log("添加购物车成功", res);
        // alert("添加成功");
        pub._Init(
          that,
          pub.url,
          pub.detail_api.api_shoppingcarGoodsCount,
          {
            buyer_id: that.buyer_id
          },
          that.cb_api_shoppingcarGoodsCount
        );
        // 加入购物车的翻滚动画
        $('.car_success').show()
        $('.car_success').addClass('rollIn')
        setTimeout(function () {
          $('.car_success').addClass('rollOut')
          $('.car_success').removeClass('rollIn')
          setTimeout(function () {
            $('.car_success').removeClass('rollOut')
            $('.car_success').hide()
          }, 1000)
        }, 1000)

        // 
      } else {
        // //  console.log("失败");
        alert("添加失败，重新添加");
      }
    },

    /**
     * 立即购买 出现弹框
     */
    BuyNow() {
      this.foot = true;
    },

    /**
     * 轮播图
     */
    Banner(res) {
      this.img = res;
      // //  console.log(this.img);
      // this.course();
      // 数据执行的快慢影响，轮播图的执行顺序
      setTimeout(function () {
        var swiper = new Swiper(".swiper-container", {
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: true
          },
          loop: true,
          autoplayDisableOnInteraction: false,
          pagination: {
            el: ".swiper-pagination"
          }
        });
      }, 1000);
    },
    course() {
      var swiper = new Swiper(".swiper-container", {
        autoplay: {
          delay: 1000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        loop: true,
        autoplayDisableOnInteraction: false,
        pagination: {
          el: ".swiper-pagination"
        }
      });
    },
    /**
     * 减少数量
     */
    numDown() {
      this.ipt = this.ipt - 1;
      if (this.ipt <= 1) {
        this.ipt = 1;
      }
    },
    /**
     * 增加数量
     */
    numAdd() {
      this.ipt = this.ipt + 1;

      // //  console.log(this.ipt);
    },
    Close() {
      this.foot = false;
    },
    /**
     * 修改 输入框数量的事件
     */
    inputFunc() {
      if (this.ipt <= 0) {
        this.ipt = 1;
      }
    },
    /**
     * 确认购买
     */
    buyNowGood() {
      var that = this;
      //  console.log("立即购买");
      // 购买数量
      var count = this.ipt;
      var data = {
        buyer_id: this.buyer_id,
        goods_count: count,
        goods_id: this.id,
        dept_id: this.dept_id
      };

      //  console.log(data);

      if (this.person) {
        pub._Init(that, pub.url, pub.detail_api.buyNowGoods, data, that.cb_buyNowGoods)
        // $.ajax({
        //   type: "POST",
        //   contentType: "application/json",
        //   url: pub_url + "buyNowGoods",
        //   data: JSON.stringify(data),
        //   error: function (request) {
        //     //  console.log("Connection error");
        //   },
        //   success: function (res) {
        //     //  console.log(res);
        //     if (res.stateCode == 200) {
        //       //  console.log("立即购买返回的数据", res.data);
        //       that.localSetItem(res.data);
        //     } else {
        //       //  console.log("请求数据失败");
        //     }
        //   }
        // });
      } else {
        // alert("请登录");

        window.location.href = "./login.html";
      }
    },
    cb_buyNowGoods(res) {
      const that = this
      //  console.log(res);
      if (res.stateCode == 200) {
        //  console.log("立即购买返回的数据", res.data);
        that.localSetItem(res.data);
      } else {
        //  console.log(res.msg);        
      }
    },
    /**
     * 回调函数
     */
    localSetItem(res) {
      var goods = [];
      goods.push(res);
      var GoBuyDetail = {
        buyer_id: res.buyer_id,
        goods: goods,
        receiveAddress: res.receiveAddress
      };
      GoBuyDetail = JSON.stringify(GoBuyDetail);
      localStorage.setItem("GoBuyDetail", GoBuyDetail);
      //  console.log(JSON.parse(localStorage.getItem("GoBuyDetail")));
      window.location.href = "./buy-now-order-detail.html";
    },
    // 跳转到店铺首页
    jumpShopIndex(){
      window.location.href="./shopIndex.html?shop_id="+localStorage.getItem('shop_id')
    }
  }
});
