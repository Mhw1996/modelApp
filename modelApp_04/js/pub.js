// 远程服务器
const pub = {
  machine:'tea',
  url: "http://tea.yanxukj.com/malls/api/",
  express_url: "http://tea.yanxukj.com:9100/evaluationscore/api/", // 评价接口
  money: "http://tea.yanxukj.com/rose-33/pay/", //正式版本支付
  tr: "http://tea.yanxukj.com/tr/index.html#/?user=", //  预约
  disCountUrl: "http://tea.yanxukj.com/rose-33/", //优惠卷

  // machine: "teashop",
  // // url: 'http://192.168.1.123:80/malls/api/',
  // url: "http://teashop.yanxukj.com/malls/api/",
  // express_url: "http://teashop.yanxukj.com:8081/evaluationscore/api/", // 评价接口
  // money: "http://www.sellglobal.cn/rose-33/pay/", // 测试版支付
  // tr: "http://teashop.yanxukj.com/tr/index.html#/?user=", // 吴预约
  // disCountUrl: "http://www.sellglobal.cn/rose-33/", //优惠卷



  after_pay: false,
  after_pay_order_id: '',

  service_url: "", //客服
  detail_api: {
    api_listProductEvaluationPage: 'listProductEvaluationPage', // 评价的分页
    api_shoppingcarGoodsCount: 'shoppingcarGoodsCount', // 查询购物车数量
    submitBuyNowGoods: 'submitBuyNowGoods',
    findCustomer: 'findCustomer',
    getReceive: 'getReceive',
    editReceive: 'editReceive',
    delReceive: 'delReceive',
    coupon_findUserGetCoupon: 'coupon/findUserGetCoupon',
    coupon_getCoupon: 'coupon/getCoupon',
    deleteShoppingCartGoods: 'deleteShoppingCartGoods',
    shoppingCartCommoditySettlement: 'shoppingCartCommoditySettlement',
    imgUploadPost: 'imgUploadPost',
    coupon_orderDiscountsCalculate: 'coupon/orderDiscountsCalculate',
    submitShoppingCartGoods: 'submitShoppingCartGoods',
    homepage: 'homepage',
    listProductEvaluationPage: 'listProductEvaluationPage',
    findGoods: 'findGoods',
    listProductEvaluationPage: 'listProductEvaluationPage',
    findProductEvaluation: 'findProductEvaluation',
    coupon_productCouponList: 'coupon/productCouponList',
    saveShoppingCartGoods: 'saveShoppingCartGoods',
    buyNowGoods: 'buyNowGoods',
    plu_sendSms: 'plu/sendSms',
    coupon_findUserCouponBag: 'coupon/findUserCouponBag',
    listOrderPage: 'listOrderPage',
    deleteOrder: 'deleteOrder',
    addReceive: 'addReceive',
    findReceive: 'findReceive',
    editReceive: 'editReceive',
    editCustomer: 'editCustomer',
    orderDetails: 'orderDetails',
    findOrderExpress: 'findOrderExpress',
    userConfirmationOrderStatus: 'userConfirmationOrderStatus',
    listShoppingCartGoods: 'listShoppingCartGoods'
  },
  // pub._Init(that, pub.url, pub.detail_api.delReceive, data, that.cb_)
  /**
   const that = this
pub._Init(that, pub.url, pub.detail_api.delReceive, data, that.cb_)

   */
  /**
   * @param {*} that this指向
   * @param {*} _url 公共接口地址
   * @param {*} ur 具体接口地址
   * @param {*} data 形参
   * @param {*} cbk 回调
   */
  _Init: function (that, _url, ur, data, cbk) {
    $.ajax({
      type: "POST",
      headers: {
        token: localStorage.getItem('tk'),
      },
      contentType: "application/json",
      url: _url + ur,
      data: JSON.stringify(data),
      error: function (request) {
        //  //  console.log(request, "ajax请求失败");
      },
      success: function (res) {
        if (res.stateCode == '400'|| res.code == '401') {
          alert(res.msg)
          window.location.href = './login.html'
        } else {
          cbk(res);
        }
      },
      fail: function (r) {
        //  //  console.log("Ajax的fail函数，", r);
      }
    });
  },

  /**
   *  截取链接中的参数
   */
  _parm: function (variable) {
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
   * @param {*} event 输入框的值
   * @param {*} tgt 输入框绑定的值
   */
  _CheckPhone(event, tgt) {
    //  //  console.log("检验手机号", event.target.value);
    var phone = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
    if (!phone.test(tgt)) {
      alert("输入正确的手机号！");
      tgt = "";
    }
  }
};
//  //  console.log(pub.machine);
/**
 * 首先定义空对象 然后遍历数组，数组是对象，对象只有一个键值对
    var productDtl = {};
    for (var it = 0; it < res.data.length; it++) {
      for (var item in res.data[it]) {
        productDtl[item] = res.data[it][item];
      }
    }
 */


/**
 * 2019-04-19
 * 修改微信支付的返回页面的订单详情的提示信息
 * token 失效问题
 */

/**
 * 2019-04-16
 * 在商品详情页面点击立即购买 挑战立即购买的确认商品页面 点击去付款之后生成订单号 跳转订单详情页 同时展示选择支付方式的弹框 然后执行支付事件
 * 在支付事件中 支付宝事件的跳转页面使用了空页面的中转 在返回支付宝数据之后存入缓存 跳转空页面 然后在空页面执行支付宝的链接事件 使用此方法可以解决支付宝的返回页面仍旧是订单详情页面
 * 购物车的购买事件同上
 *
 * 将页面的部分函数公用 方便安全的问题
 */


/**
 * 2019-04-15
 * 密码的MD5加密
 * 订单详情页面的 取消订单修改为暂不支付
 * 选择的事件修改为 点击整个块都可以修改
 * 优惠券的领取之后修改为 已领取 字样
 */

/**
 * 2019-03-29
 * teashop 压缩
 * 商品详情页面的加入购物车的一个小翻滚的特效
 * 在订单详情页面的物流返回信息的判断
 * 在code文件夹的index页面中加入服务器的提示
 */
/**
 * 2019-03-28
 * 商品详情页面跳转全部评价页面的数据渲染，
 * 商品详情页的购物车的数量渲染
 * 评价列表页面的状态判断
 */

/**
 * 2019-03-27
 * 手机商城商品详情页面的评价数据展示
 */

/**
 * 2019-03-26
 * 购物车的结算页面的布局修改
 * 订单详情页面的支付布局修改
 * 详情页面跳转的评价页面的布局
 */

/**
 * 2019-03-25-
 * 详情页面的立即购买的页面修改
 */

/**
 * 2019-02-19
 * 在订单详情页添加订单编号
 * 在评价详情页面修改 商家回复 的顺序与位置
 */

/**
 * 2019-02915
 * 支付选择不使用优惠券
 */

/**
 * 2019-01-28
 * 添加追评
 * commentExcess
 */

/**
 * 2019-01-24-
 * 修改评价
 */

/**
 * 2019-01-09
 * 修改手机号的验证码
 * 完善优惠券
 */

/**
 * teashop 完成优惠券
 * tea 未完成
 */
/**
 * 2019-01-08
 *
 * 购物车结算和商品的立即购买跳转的订单详情页面的支付
 * 待付款订单的支付参数
 * 商品详情的轮播图
 * 验证码接口 合并至mall项目中
 * 支付基本完成
 * 错误弹框
 *    <div class='_no_user' v-show='fail_login' >
       {{fail_login_msg}}
      </div>

      // 错误信息的弹出框
      fail_login_msg:'',
      fail_login:false

      this.fail_login = true;
      this.fail_login_msg = res.stateMsg
      // alert(res.stateMsg);
      setTimeout(function(){
        that.fail_login = false;
      },2000)

 */

/**
 * 2019-01-07
 * 购物车结算和商品的立即购买跳转的订单详情页面的优惠券信息
 * 重写登录注册页面 完成注册接口
 */

/**
 * 2019-01-04
 * 我的卡包页面
 */

/**
 * 2019-01-03
 * 购物车的优惠卷
 * 商品详情
 * 发送手机验证码页面
 */

/**
 * 2019-01-02
 * 用户优惠券
 * 布局 商品详情页 订单详情  我的优惠券页面
 */

/**
 * 2018-12-28-teashop版本
 */

/**
 * 跳转预约的链接改为 teashop
 * 修改服务器地址
 */

/**
 * 2018-112-25
 * 服务器 tea 改为teashop
 * 支付添加 微信支付场景
 * 登录页添加背景图
 * 调整购物车的样式
 * 修改个人信息页面布局
 */

/**
 * 2018-12-24-
 * 订单详情跳转胡岩的评价 mkcomment 页面 跳转携带的参数通过base64转码 同时引入base。js
 * 订单详情 确认收货以及查看物流 此时的物流单号是固定的方便测试
 * 我的订单列表页增加全部的分类 个人信息页面同步修改
 * 增加我的评价页面 从个人信息进入
 * 增加我的评价详情页面
 */

/**
 * 2018-12-21-1700
 * 标记 支付场景
 */

/**
 * 2018-12-13-1005
 * 登录参数 "customer_status_id":"normal"
 *
 * 2018-12-13-1750
 * 首页的推荐商品的文字渲染
 */

/**
 * 2018-12-10-0850 取消预约项目的按钮
 */

// 提交时间 2018-12-05-1750
/**
 * 提交时间 2018-12-06-0920
 * 孟磊解决classify 跳转 seachgood 页面出现全部商品的问题
 * 退出登录清除缓存
 * 删除地址与订单 增加confirm 提示框
 * */

/**
 * 提交时间 2018-12-06-1040
 * 我解决classify 跳转 seachgood 页面出现全部商品的问题
 * 截取字符串的位置问题
 */

/**
 * 提交时间 2018-12-06-1525
 * 1 重写购物车的输入框 选中 全选 减少 增加 结算总价 事件
 * 2 在订单详情页面 将结算支付的数据还原为真实数据
 *   只可以支付宝支付
 * 3 退出登录跳转登录页的同时 清除浏览器数据缓存
 * 4 新增地址 不设置为默认
 * 5 注册成功之后取消跳转登录页的操作 js执行登录接口
 */

/**
 * 提交时间 2018-12-07-1445
 * 修改classify.html 页面因为数据过多而展示不完全的问题
 * 编辑地址保存时放弃设置为默认
 */
