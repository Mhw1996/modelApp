
var pub_url = pub.url;
//  console.log(pub_url)
var app = new Vue({
  el: "#app",
  data: {
    pass: '',
    account:'',
    
  },
  created() {},
  methods: {
    // 跳转注册页面
    GoRegistered() {
      window.location.href = "./registered.html";
    }, 
    // 登录事件
    /** login_type
     * login_account	账号密码登录
      login_verification	手机验证码登录
      login_wechat	微信登录
     * 
    */
    LoginIn() {
      //  console.log(returnCitySN.cip); 
      var data = {
        customer_tel: this.account,
        customer_password: this.pass,
        customer_last_login_ip: returnCitySN.cip,
        "customer_status_id":"normal",
        login_type:'login_account'
      };
      //  console.log(data)
      $.ajax({
        type: "POST",
        contentType: "application/json",
        // contentType:"application/json;charset=utf-8",
        url:pub_url+"loginOnCustomer",
        data: JSON.stringify(data),
        error: function(request) {
          alert("登录失败，重新登录");
        },
        success: function(res) {
          //  console.log("用户登录返回数据", res);
          if (res.stateCode == 200) {
            //  console.log("用户登录返回数据", res);
            localStorage.setItem("buyer_id", res.data.customer_id);
            // 将index_flow.html->index.html
            location.href = './index.html'
          } else {
            //  console.log("请求数据失败");
            alert(res.stateMsg)
          }
        }
      });
    }
  }
});
