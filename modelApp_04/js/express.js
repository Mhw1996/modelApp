var pub_url = pub.url;
// 评价的接口
var express_url = pub.express_url;
//  console.log(pub_url);
var app = new Vue({
  el: "#app",
  data: {
    user_id: "",
    current: "",

    pageNum: 1,
    pageSize: 100,
    // 评价列表
    express_obj: {},
    express_arr: {},

    img: [],

    // 中转参数
    parm: {}
  },
  created() {
    this.user_id = this._parm("id");
    //  console.log(this.user_id);

    var data = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      product_evaluation_userId: this.user_id,
      product_evaluation_stateId: [
        "evaluate",
        "additional_evaluation",
        "reply_evaluation",
        "reply_additional_evaluation"
      ]
    };
    //  console.log(data, pub_url);
    this.parm = data;
    var that = this;
    pub._Init(
      that,
      pub.express_url,
      pub.detail_api.listProductEvaluationPage,
      data,
      that.BackInit
    );
  },
  methods: {
    /**
     * 列表的回调
     */
    BackInit(res) {
      //  console.log(res);
      this.express_arr = res;
      if (res.stateCode == "200") {
        if (res.data.pageInfo.list.product_evaluation_picture) {
          res.data.pageInfo.list.imgs = res.data.pageInfo.list.product_evaluation_picture.split(
            ","
          );
        }
        for (var c = 0; c < res.data.pageInfo.list.length; c++) {
          if (res.data.pageInfo.list[c].product_evaluation_picture) {
            res.data.pageInfo.list[c].imgs = res.data.pageInfo.list[
              c
            ].product_evaluation_picture.split(",");
          }
        }
        // //  console.log(res.data.pageInfo.list.product_evaluation_picture);
        // //  console.log(res.data.pageInfo.list.imgs);
        this.express_obj = res.data.pageInfo;
        this.express_arr = res.data.pageInfo.list;
      } else {
        alert(res.stateMsg);
        window.history.go(-1);
      }
    },

    /**
     * 跳转评价
     * 首先调用 查询商品详情的接口 获得商品的缩略图
     */
    GoExpress(good_id, shop_id, order_id, parduct_name) {
      //  console.log("跳转追评页", shop_id, good_id);
      var data = {
        product_id: good_id,
        dept_id: shop_id,
		order_id:order_id
      };
      const that = this
      // var data = {
      //   goods_id: '123',
      //   dept_id: '1'
      // };
      var mini_url = "";
      pub._Init(that,pub.express_url,pub.detail_api.findProductEvaluation,data, that.cb_productEvaluation)
      // $.ajax({
      //   type: "POST",
      //   contentType: "application/json",
      //   url: pub_url + "findGoods",
      //   data: JSON.stringify(data),
      //   error: function(request) {
      //     //  console.log("Connection error");
      //   },
      //   success: function(res) {
      //     //  console.log(res);
      //     if (res.stateCode == "200") {
      //       mini_url = res.data[0].GoodsInfo.goods_mini_img_url;

      //       var _obj = {
      //         order_id: order_id,
      //         dept_id: shop_id,
      //         product_id: good_id,
      //         product_evaluation_userId: this.user_id,
      //         product_name: parduct_name,
      //         mini_img: mini_url,
      //         product_evaluation_userName: JSON.parse(
      //           localStorage.getItem("mine")
      //         ).customer_name
      //       };

      //       //  console.log(_obj);

      //       // 先转成json串
      //       // //  console.log(JSON.stringify(_obj))
      //       // // 在转base64
      //       // //  console.log(Base64.encode(JSON.stringify(_obj)))
      //       // // 解析base64
      //       // //  console.log(Base64.decode(Base64.encode(JSON.stringify(_obj))))

      //       var _str = Base64.encode(JSON.stringify(_obj));
      //       // //  console.log(_str);
      //       // window.location.href = "./mkComment/index.html?" + _str;
      //       //  console.log('跳转追评')
      //       window.location.href = "./commentExcess/index.html?" + _str;
      //     } else {
      //       alert("获取追评信息失败");
      //     }
      //   }
      // });

      // var _obj = {
      //   order_id:order_id,
      //   dept_id:shop_id,
      //   product_id:good_id,
      //   product_evaluation_userId:this.user_id,
      //   product_name:parduct_name,
      //   mini_img:mini_url,
      //   product_evaluation_userName:JSON.parse(localStorage.getItem("mine")).customer_name,
      // }

      // //  console.log(_obj)

      // // 先转成json串
      // // //  console.log(JSON.stringify(_obj))
      // // // 在转base64
      // // //  console.log(Base64.encode(JSON.stringify(_obj)))
      // // // 解析base64
      // // //  console.log(Base64.decode(Base64.encode(JSON.stringify(_obj))))

      // var _str = Base64.encode(JSON.stringify(_obj))
      // //  console.log(_str)
      // // window.location.href = './mkComment/index.html?'+_str

      // window.location.href = './expressDetail.html?product_id='+good_id+'&order_id='+order_id
    },

    cb_productEvaluation(res){
      //  console.log(res);
      const that = this
      if (res.stateCode == "200") {
		  var data = res.data;
      //  mini_url = res.data[0].GoodsInfo.goods_mini_img_url;

        var _obj = {
          order_id: data.order_id,
          dept_id: data.dept_id,
          product_id: data.product_id,
          product_evaluation_userId: this.user_id,
          product_name: data.product_name,
          mini_img: data.product_mini_img_url,
          product_evaluation_userName: JSON.parse(
            localStorage.getItem("mine")
          ).customer_name
        };

        //  console.log(_obj);

        // 先转成json串
        // //  console.log(JSON.stringify(_obj))
        // // 在转base64
        // //  console.log(Base64.encode(JSON.stringify(_obj)))
        // // 解析base64
        // //  console.log(Base64.decode(Base64.encode(JSON.stringify(_obj))))

        var _str = Base64.encode(JSON.stringify(_obj));
        // //  console.log(_str);
        // window.location.href = "./mkComment/index.html?" + _str;
        //  console.log('跳转追评')
        window.location.href = "./commentExcess/index.html?" + _str;
      } else {
        alert("获取追评信息失败");
      }
    },

    /**
     * 跳转评价详情
     */
    GoExpressDetail(a, b) {
      //  console.log("跳转我的评价详情", a, b);
      window.location.href =
        "./expressDetail.html?product_id=" + a + "&order_id=" + b;
    },

    /**
     * 请求函数
     * @param {*} that this 指向
     * @param {*} Url 各种公共接口地址
     * @param {*} url  接口
     * @param {*} data 参数
     * @param {*} cbk 回调
     */

    Init(that, Url, url, data, cbk) {
      $.ajax({
        type: "POST",
        contentType: "application/json",
        url: Url + url,
        data: JSON.stringify(data),
        error: function(request) {
          //  console.log("Connection error");
        },
        success: function(res) {
          cbk(res);
        }
      });
    },

    /**
     * 获取参数
     */
    _parm(variable) {
      //获取参数;
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },

    /**
     * 返回
     */
    back() {
      window.history.go(-1);
    },

    GoMore() {
      var data = this.parm;
      var that = this;

      data.pageSize = +data.pageSize + 50;
      //  console.log("加载更多,", data);
      pub._Init(
        that,
        pub.express_url,
        pub.detail_api.listProductEvaluationPage,
        data,
        that.BackInit
      );
    }
  }
});
