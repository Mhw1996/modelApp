// 截取传来的字符串
var strHref = location.href;
if (strHref.indexOf("?")) {
  var intPos = strHref.indexOf("?");
  intPos = intPos + 4;
  // 从二级分类跳转过来的二级id
  var num = strHref.substring(intPos, strHref.length);
}
var id = num ? num : false;
var pub_url = pub.url;
var app = new Vue({
  el: "#app",
  data: {
    buyer_id: "",
    dept_id: "",
    total: [],
    totalnone: false,
    totalPrice: 0,
    allselected: false,
    ipt: "",
    goback: false,
    data_show: false,

    // 优惠卷列表
    show_dis_pannel: false, // 优惠券的弹出框
    count_list: [], // 优惠券的列表
    dis_count_shop_id: "", // 点击优惠券的店铺
    dis_count_goods_id: "", // 点击优惠券的商品
    dis_count_coupon_id: "" //点击立即领取使用
  },
  created() {
    // 如果是从详情页跳转进来的话设置back
    this.goback = id;
    const that = this
    // //  console.log(this.goback);
    this.buyer_id = localStorage.getItem("buyer_id");
    // 判断是否用户登录
    if (this.buyer_id) {
      var data = {
        buyer_id: this.buyer_id
      };
      // this.InitAjax(data);
      pub._Init(that, pub.url, pub.detail_api.listShoppingCartGoods, data, that.cb_listShoppingCartGoods)

    } else {
      // this.show_dis_pannel=false;
      alert("请先登录");
      window.location.href = "./login.html";
    }
  },
  computed: {},
  watch: {},
  methods: {
    /**
     * 关闭弹框
     */
    CloseDisPannel() {
      this.show_dis_pannel = false;
    },

    /**
     * 优惠券
     */
    GoDisCount(parm, goods_id) {
      //  console.log("领店铺卷", parm);
      if (this.buyer_id) {
        this.dis_count_goods_id = goods_id;
        var that = this;
        this.dis_count_shop_id = parm;
        var data = {
          shop_id: parm,
          user_id: this.buyer_id
        };
        // //  console.log(data);
        pub._Init(
          that,
          pub.disCountUrl,
          pub.detail_api.coupon_findUserGetCoupon,
          data,
          that.BackDisCountList
        );
      } else {
        alert("请先登录");
        window.location.href = "./login.html";
      }
    },
    BackDisCountList(res) {
      //  console.log("店铺优惠券的回调函数的", res);
      if (res.code == "200") {
        this.count_list = res.data;
        this.show_dis_pannel = true;
      } else {
        //  console.log("店铺优惠券数据异常");
      }
    },

    /**
     * 立即领取
     */
    GoReceive(pa) {
      var that = this;
      //  console.log("立即领取", pa, this.dis_count_shop_id);
      this.dis_count_coupon_id = pa;
      var data = {
        user_id: this.buyer_id,
        coupon_id: pa,
        product_id: this.dis_count_goods_id,
        shop_id: this.dis_count_shop_id
      };
      //  console.log(data);
      pub._Init(
        that,
        pub.disCountUrl,
        pub.detail_api.coupon_getCoupon,
        data,
        that.BackReceive
      );
    },

    /**
     * 立即领取成功之后 自行修改领取状态 页面显示去使用
     */
    BackReceive(res) {
      //  console.log("领取优惠卷的回调", res);
      if (res.code == "200") {
        for (var x = 0; x < this.count_list.length; x++) {
          if (this.dis_count_coupon_id == this.count_list[x].coupon_id) {
            this.count_list[x].coupon_send_status = "CLOSE";
          }
        }
      } else if (res.code == "BEYOND_LIMIT") {
        alert(res.msg);
      } else if (res.code == "NONE") {
        alert(res.msg);
      }
    },
    /**
     * 请求数据
     */
    InitAjax(data) {
      // //  console.log("进入函数", data);
      var that = this;
      $.ajax({
        type: "POST",
        contentType: "application/json",
        url: pub_url + "listShoppingCartGoods",
        data: JSON.stringify(data),
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          //  console.log(res);
          if (res.stateCode == 200) {
            for (var dr = 0; dr < res.data.length; dr++) {
              res.data[dr].single_selected = false;
              // res.data[dr].ipt_num = res.data[dr].goods_count;
            }
            that.total = res.data;
            // //  console.log(res, that.total);
            that.data_show = true;
          } else {
            // //  console.log("请求数据失败");
            alert("数据加载失败");
          }
        }
      });
    },
cb_listShoppingCartGoods(res){
  //  console.log(res);
  const that = this
  if (res.stateCode == 200) {
    for (var dr = 0; dr < res.data.length; dr++) {
      res.data[dr].single_selected = false;
      // res.data[dr].ipt_num = res.data[dr].goods_count;
    }
    that.total = res.data;
    // //  console.log(res, that.total);
    that.data_show = true;
  } else {
    // //  console.log("请求数据失败");
    alert("数据加载失败");
  }
},
    /**
     * 勾选商品 SelectImg
     * 1 获取商品id  遍历商品数组找到商品
     * 2 计算单个商品的总价
     * 3 判断是否全选
     *       遍历商品数组得到所有商品的价格总和
     *       选中商品的所有单个商品的总价之和
     *       两个价格总价进行比较
     *           相等则全选 否则反之
     */
    SelectImg(parm) {
      //  console.log("勾选商品事件传入的参数");
      // //  console.log("勾选商品事件传入的参数", parm);
      /**
       * 重写
       */
      var id = parm;
      // var single_total = 0;
      var select_arr = this.total;
      // //  console.log(select_arr);
      for (var s = 0; s < select_arr.length; s++) {
        if (select_arr[s].goods_id == id) {
          if (!select_arr[s].single_selected) {
            select_arr[s].single_selected = true;
          } else {
            select_arr[s].single_selected = false;
          }
        }
      }
      // //  console.log(select_arr);
      var sm = 0;
      for (var se = 0; se < select_arr.length; se++) {
        if (select_arr[se].single_selected) {
          sm = sm + select_arr[se].goods_count * select_arr[se].goods_price;
        }
      }
      sm = Math.floor(sm * 1000) / 1000;
      this.totalPrice = sm;
      // //  console.log(sm);

      this.total = select_arr;
      var zero_price = 0;
      for (var d = 0; d < select_arr.length; d++) {
        zero_price =
          zero_price + select_arr[d].goods_price * select_arr[d].goods_count;
        zero_price = Math.floor(zero_price * 1000) / 1000;
      }
      if (zero_price == this.totalPrice) {
        this.allselected = true;
      } else {
        this.allselected = false;
      }
      this.total = select_arr;
    },

    /**
     * 全选函数
     * 1 修改全选状态
     * 2 由全选状态修改单个商品的选中状态
     * 3 由单个商品的选中状态决定总价格
     */
    Allselect() {
      /**
       * 重写
       */
      this.allselected = !this.allselected;
      var select_arr = this.total;
      for (var s = 0; s < select_arr.length; s++) {
        if (this.allselected) {
          if (select_arr[s].goods_count > 0) {
            select_arr[s].single_selected = true;
          }
        } else {
          select_arr[s].single_selected = false;
        }
      }
      // //  console.log(select_arr);
      var sm = 0;
      for (var se = 0; se < select_arr.length; se++) {
        if (select_arr[se].single_selected) {
          sm = sm + select_arr[se].goods_count * select_arr[se].goods_price;
        }
      }
      sm = Math.floor(sm * 1000) / 1000;
      this.totalPrice = sm;
      this.total = select_arr;
    },

    /**
     * 单个商品的数量减少 cardown()
     * 1 获取商品id 遍历商品数组找到商品
     * 2 计算 数量值的差和差价
     * 3 更新总价
     * 注意
     *    需要注意在减少到0时候需要做等于0的处理
     */
    Cardown(parm) {
      //  console.log("商品的数量减少事件");
      // //  console.log(parm, "商品的数量减少事件");

      /**
       * 重写
       * 
       * 第一种思路 先减数量 在判断
       * select_arr[s].goods_count--;
          if (select_arr[s].goods_count <= 0) {
            select_arr[s].goods_count = 1;
          }
          第二种 先判断 在减数量
           if (select_arr[s].goods_count >1) {
            select_arr[s].goods_count --;
          }else{
            select_arr[s].goods_count = 1
          }
       */
      var id = parm;
      var select_arr = this.total;
      // //  console.log(select_arr);
      for (var s = 0; s < select_arr.length; s++) {
        if (select_arr[s].goods_id == id) {
          select_arr[s].goods_count--;
          if (select_arr[s].goods_count <= 0) {
            select_arr[s].goods_count = 1;
          }
        }
      }
      var sm = 0;
      for (var se = 0; se < select_arr.length; se++) {
        if (select_arr[se].single_selected) {
          sm = sm + select_arr[se].goods_count * select_arr[se].goods_price;
        }
      }
      sm = Math.floor(sm * 1000) / 1000;
      this.totalPrice = sm;
      this.total = select_arr;
    },

    /**
     * 单个商品数量增加
     * 1 获取商品id 遍历商品数组找到商品
     * 2 计算 数量值的差和差价
     * 3 更新总价
     */
    Caradd(parm) {
      // //  console.log(parm, "商品增加数量");
      //  console.log("商品增加数量");
      /**
       * 重写
       */
      var money = 0;
      var id = parm;
      var select_arr = this.total;
      // //  console.log(select_arr);
      for (var s = 0; s < select_arr.length; s++) {
        if (select_arr[s].goods_id == id) {
          if (select_arr[s].goods_count) {
            select_arr[s].goods_count++;
          } else {
            select_arr[s].goods_count = 1;
          }
        }
      }
      var sm = 0;
      for (var se = 0; se < select_arr.length; se++) {
        if (select_arr[se].single_selected) {
          sm = sm + select_arr[se].goods_count * select_arr[se].goods_price;
        }
      }
      sm = Math.floor(sm * 1000) / 1000;
      this.totalPrice = sm;
      this.total = select_arr;
    },

    /**
     * input框的修改数量事件
     * 1 获取商品id 遍历商品列表 找到商品
     * 2 输入框与商品的数量的双向绑定
     *       在商品数量<=1 那么数量就只可以为1
     * 3 遍历商品列表计算选中商品的总价
     *       注意在总价的相加的时候需要在循环之外进行
     * 4 根据总价的数目 设置全选的状态
     */
    inputFunc(parm) {
      //  console.log("输入框的数量修改");
      // //  console.log(parm, "商品数量的修改",event.target.value);

      /**
       * 重写
       */

      var id = parm;
      var select_arr = this.total;
      var ori_count = 0;
      event.target.value = parseInt(
        event.target.value.replace(/\D/g, "") == "" ||
          parseInt(event.target.value.replace(/\D/g, "") == "")
          ? event.target.value.replace(/\D/g, "")
          : event.target.value,
        10
      );
      if (event.target.value == "NaN") {
        event.target.value = 1;
      }
      var sm = 0;
      for (var se = 0; se < select_arr.length; se++) {
        if (select_arr[se].single_selected) {
          sm = sm + select_arr[se].goods_count * select_arr[se].goods_price;
        }
      }
      sm = Math.floor(sm * 1000) / 1000;
      this.totalPrice = sm;
      this.total = select_arr;
    },
    func(parm) {
      // //  console.log("输入框的失去焦点事件");
      var select_arr = this.total;
      // //  console.log("焦点事件", parm, event);
      for (var s = 0; s < select_arr.length; s++) {
        if (select_arr[s].goods_id == parm) {
          if (select_arr[s].goods_count == 0) {
            select_arr[s].goods_count = 1;
            select_arr[s].single_selected = false;
          }
          // //  console.log(select_arr[s].goods_count, event.target.value);
        }
      }
      var sm = 0;
      for (var se = 0; se < select_arr.length; se++) {
        if (select_arr[se].single_selected) {
          sm = sm + select_arr[se].goods_count * select_arr[se].goods_price;
        }
      }
      sm = Math.floor(sm * 1000) / 1000;
      this.totalPrice = sm;
      this.total = select_arr;
    },

    /**
     * 删除商品
     * 1 获取商品主键 universalid
     * 2 判断该商品是否选中
     * 3 将主键放入需要删除的数组中
     * 4 前端页面删除该商品 在商品列表中找到该商品
     * 5 发送请求  数据库删除商品
     */
    DelGood(parm) {
      // //  console.log(parm, "删除商品");
      var del_arr = [];
      var universalid = parm;
      var that = this;
      var total_arr = this.total;
      for (var t = 0; t < total_arr.length; t++) {
        if (total_arr[t].universalid == universalid) {
          if (total_arr[t].single_selected) {
            del_arr.push(universalid);

            var confirm_str = confirm("确定删除该商品");
            if (confirm_str == true) {
              pub._Init(that, pub.url, pub.detail_api.deleteShoppingCartGoods, del_arr, that.cb_deleteShoppingCartGoods)
              // $.ajax({
              //   type: "POST",
              //   contentType: "application/json",
              //   url: pub_url + "deleteShoppingCartGoods",
              //   data: JSON.stringify(del_arr),
              //   error: function(request) {
              //     alert("Connection error");
              //   },
              //   success: function(res) {
              //     // //  console.log(del_arr,res)
              //     if (res.stateCode == 200) {
              //       //  console.log("删除成功");
              //       // alert("删除成功");

              //       total_arr.splice(t, 1);
              //       that.total = total_arr;
              //       // //  console.log(total_arr );
              //       history.go(0);
              //     } else {
              //       // //  console.log("删除失败");
              //       alert("删除失败");
              //     }
              //   }
              // });
              total_arr.splice(t, 1)
              that.total = total_arr
            }
          } else {
            // //  console.log("选择需要删除的商品");
            alert("请选择商品");
          }
        }
      }
    },
    cb_deleteShoppingCartGoods(res) {
      if (res.stateCode == 200) {
        //  console.log("删除成功");
        // alert("删除成功");

       
        // that.total = total_arr;
        // //  console.log(total_arr );
        history.go(0);
      } else {
        // //  console.log("删除失败");
        alert("删除失败");
      }
    },
    /**
     * 去结算  shoppingCartCommoditySettlement 只是生成订单并未提交  跳转订单详情页面勾选地址 然后提交订单
     */
    GoBuy() {
      //  console.log("点击结算");
      const that = this
      var buy_arr = [];
      var total = this.total;
      for (var b = 0; b < total.length; b++) {
        if (total[b].single_selected) {
          buy_arr.push(total[b]);
        }
      }
      var data = {
        buyer_id: this.buyer_id,
        goods: buy_arr
      };
      // //  console.log(data);
      var flag = 1;
      for (var by = 0; by < buy_arr.length; by++) {
        if (buy_arr[by].goods_count == 0) {
          flag = !flag;
        }
      }
      // //  console.log(flag);
      // 判断是否勾选商品
      if (buy_arr.length) {
        pub._Init(that, pub.url, pub.detail_api.shoppingCartCommoditySettlement, data, that.cb_shoppingCartCommoditySettlement)
        // $.ajax({
        //   type: "POST",
        //   contentType: "application/json",
        //   url: pub_url + "shoppingCartCommoditySettlement",
        //   data: JSON.stringify(data),
        //   error: function (request) {
        //     //  console.log("Connection error");
        //   },
        //   success: function (res) {
        //     //  console.log(res);
        //     if (res.stateCode == 200) {
        //       // //  console.log("生成订单成功返回数据", res);
        //       var GoBuyDetail = JSON.stringify(res.data);
        //       // //  console.log("GoBuyDetail", GoBuyDetail);
        //       localStorage.setItem("GoBuyDetail", GoBuyDetail);
        //       // 跳转页面
        //       location.href = "./carorderdetail.html";
        //     } else {
        //       // //  console.log("生成订单失败");
        //       alert("订单生成失败");
        //     }
        //   }
        // });
      } else {
        alert("选择商品进行结算");
      }
    },
    cb_shoppingCartCommoditySettlement(res){
      if (res.stateCode == 200) {
        // //  console.log("生成订单成功返回数据", res);
        var GoBuyDetail = JSON.stringify(res.data);
        // //  console.log("GoBuyDetail", GoBuyDetail);
        localStorage.setItem("GoBuyDetail", GoBuyDetail);
        // 跳转页面
        location.href = "./carorderdetail.html";
      } else {
        // //  console.log("生成订单失败");
        alert("订单生成失败");
      }
    },

    /**
     * 只有从详情页面跳转之后才会有返回上一级的箭头
     * 同时才可以执行事件
     * 返回上一级
     */
    back() {
      window.history.go(-1);
    },

    /**
     * 暂无商品，去首页
     */
    GoIndex() {
      window.location.href = "./index.html";
    },

    /**
     * 点击商品跳转 详情页面
     */
    GoDetail(parm, b) {
      window.location.href = "./GoodDetail.html?id=" + parm + "&shop=" + b;
    }
    // method结尾
  }
});
