var app = new Vue({
  el: "#app",
  data: {
    phone: "", // 手机号
    confirm: "", // 验证码
    code_str: "发送验证码"
  },
  created() {},
  methods: {
    // 发送验证码
    /**
     * templateCode
     * SMS_153325741(注册)
     * SMS_153330698（登录）
     * SMS_153325746（解除绑定）
     * SMS_153325745（绑定）
     */
    SendCode() {
      var that = this;
      var data = {
        telePhoneNum: this.phone,
        templateCode: "SMS_153330698"
      };
      //  console.log(data);
      pub._Init(that, pub.msgCodeUrl, pub.detail_api.plu_sendSms, data, that.BackCode);
    },
    BackCode(res) {
      //  console.log("发送验证码的回调", res);
      if (res.code == "200") {
        this.code_str = "验证码已发送，请查看手机！";
      } else {
        this.code_str = "重新发送！";
      }
    },

    back() {
      window.history.go(-1);
    },

    /**
     * 登录
     */
    LoginIn() {
      // var data = {
      //   telePhoneNum:this.phone,
      //   code:this.confirm
      // }
      // //  console.log(data)
    },

    BackLogin(res) {
      //  console.log("登录的回调", res);
    }
  }
});
