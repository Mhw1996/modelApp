const pub={
   _url:'http://tea.yanxukj.com/malls/',
  //  _url2:'http://teashop.yanxukj.com/malls/',
  // _url:"http://teashop.yanxukj.com:8083/popularize", 
   _DetailApi:{
     api_indexPro:'column/roomColumnPro',//首页商品信息
     api_addCart:'api/saveShoppingCartGoods', //商品添加购物车
   },
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
          // window.location.href='http://teashop.yanxukj.com/Saleman/#/'
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
}