//远程服务器
const pub={
  _url:'http://teashop.yanxukj.com/malls/shop/',
  // _url:'http://192.168.1.116:8080/shop/',
  // _url:'http://192.168.1.123:83/malls/shop/',
//接口
_DetailApi:{
  api_indexPro:'column/roomColumnPro',//测试首页商品信息
  api_navList:'homeNav',//首页中顶部导航
  api_Swipe_info:'homeCarousel',//轮播图
  api_shopBaseInfo:'shopInfo', //店铺的基本信息，包括名称，头像，背景图
  api_typeList:'homeColumnProduct',//店铺商品栏目商品列表 -- 带横幅的
  api_shopProduct:'shopProduct', //商品加载更多时的列表
  api_newPro:'newPro',//上新的商品
} ,
// 封装的请求
/**
   * @param {*} that this指向
   * @param {*} _url 公共接口地址
   * @param {*} ur 具体接口地址
   * @param {*} data 形参
   * @param {*} cbk 回调
 */
_InitAjax(op) {
  $.ajax({
    type: "POST",
    headers: {
      token: localStorage.getItem('tk'),
    },
    contentType:"application/json",
    url: op._url + op.ur,
    data: JSON.stringify(op.data),
    error: function (request) {
      console.log(request, "ajax请求失败");
    },
    success: function (res) {
      // console.log(res)
      if (res.stateCode == '400' || res.code == '401' ) {
        alert('身份过期，请重新登录')
        window.location.href = './login.html'
      } else{
        op.cbk(res);
      }
    },
    fail: function (r) {
      console.log("Ajax的fail函数，", r);
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
}
 }