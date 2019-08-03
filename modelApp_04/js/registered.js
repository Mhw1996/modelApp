var pub_url = pub.url;
var app = new Vue({
  el: "#app",
  data: {
    name: "",
    pass: "",
    account: ""
  },
  created() {},
  methods: {
    // 登录事件
    LoginIn() {
      var that = this;
      // //  console.log(this.pass.length)
      var phone = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
      if (!phone.test(this.account) && this.pass.length >= 6) {
        //  console.log("账号或者密码格式不正确");
        alert("账号密码格式不正确！");
      } else {
        var data = {
          customerinfo: {
            customer_password: this.pass,
            customer_tel: this.account,
            customer_nickname: this.name,
            customer_name: this.name
          }
        };
        //  console.log(data);
        $.ajax({
          type: "POST",
          contentType: "application/json",
          url: pub_url + "addCustomer",
          data: JSON.stringify(data),
          error: function(request) {
            alert("Connection error");
          },
          success: function(res) {
            //  console.log(res);
            if (res.stateCode == 200) {
              //  console.log("注册用户返回数据", res);
              // localStorage.setItem("buyer_id", res.data.customer_id);
              // location.href = './login.html'
              that.Login();
            } else if (res.stateCode == "fail") {
              alert("注册失败，请重新注册");
              //  console.log("请求数据失败");
            } else if (res.stateCode == "customer_id_already_exists") {
              alert(res.stateMsg);
            }
          }
        });
      }
    },
    back() {
      window.history.go(-1);
    },
    /** login_type
     * login_account	账号密码登录
     * login_verification	手机验证码登录
     * login_wechat	微信登录
     *
     */
    Login() {
      //  console.log(returnCitySN.cip);
      var data = {
        customer_tel: this.account,
        customer_password: this.pass,
        customer_last_login_ip: returnCitySN.cip,
        customer_status_id: "normal",
        login_type: "login_account"
      };
      //  console.log(data);
      $.ajax({
        type: "POST",
        contentType: "application/json",
        // contentType:"application/json;charset=utf-8",
        url: pub_url + "loginOnCustomer",
        data: JSON.stringify(data),
        error: function(request) {
          alert("登录失败，重新登录");
        },
        success: function(res) {
          //  console.log("用户登录返回数据", res);
          if (res.stateCode == 200) {
            //  console.log("用户登录返回数据", res);
            localStorage.setItem("buyer_id", res.data.customer_id);
            location.href = "./index.html";
          } else {
            //  console.log("请求数据失败");
            alert(res.stateMsg);
          }
        }
      });
    }
  }
});
