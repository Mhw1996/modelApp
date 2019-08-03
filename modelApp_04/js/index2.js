var pub_url = pub.url;
var app = new Vue({
  el: "#app",
  data: {
    InitTotalData: {},
    Init_nav: [],
    Init_charts: [],
    Init_carousel: [],
    shop_list_arr: [],
    InitGoods: []
  },
  created() {
    /**
     * 将用户信息存入缓存中
     */
    // localStorage.setItem("buyer_id", "9543201805091605842");
    localStorage.setItem("dept_id", "shop001");

    this.InitAjax(this.InitDataSet);

    //
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
      // 头部信息
      this.Init_nav = res.user;
      // 排行榜信息
      this.Init_charts = res.charts;
      // 轮播图
      // this.Init_carousel = res.carousel;
      // 商品联动
      this.shop_list_arr = res.navigation;
      // 推荐商品
      this.InitGoods = res.goods;
      //  console.log(this.InitTotalData, res);

      app.Banner();
    },

    /**
     * 轮播图
     */
    Banner() {
      this.Init_carousel = this.InitTotalData.carousel;
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
     * 点击一级跳转二级分类
     */
    GoClassify(parm) {
      //  console.log("点击的一级分类id", parm);
      window.location.href = "./classify2.html?id=" + parm;
    }

    /**
     *  跳转top榜单页面
     */
    ,GoTop(){
      window.location.href = './top2.html'
    }
    //
  }
});
