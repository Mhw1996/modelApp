// 截取传来的字符串
var strHref = location.href;
if (strHref.indexOf("?") > 0) {
  var intPos = strHref.indexOf("?");
  // 从二级分类跳转过来的二级id
  var intPosLen = intPos + 4;
  var num = strHref.substring(intPosLen, strHref.length);
  var id = num;
} else {
  var id = "none";
}
//  console.log(id);
var pub_url = pub.url;

var app = new Vue({
  el: "#app",
  data: {
    people_id: "",
    person: {}
  },
  created() {
    //  console.log(id);
    if (id) {
      this.people_id = id;
    } else {
      window.location.href = "./mine.html";
    }
    var data = {
      customer_id: this.people_id
    };
    const that = this
    // this.InitAjax(data, this.Set);
    pub._Init(that, pub.url, pub.detail_api.findCustomer, data, that.cb_findCustomer)
  },
  methods: {
    /**
     * 请求用户信息
     */
    // InitAjax(data, cb) {
    //   var that = this;
    //   $.ajax({
    //     type: "POST",
    //     contentType: "application/json",
    //     url: pub_url + "findCustomer",
    //     data: JSON.stringify(data),
    //     error: function(request) {
    //       //  console.log("Connection error");
    //     },
    //     success: function(res) {
    //       if (res.stateCode == 200) {
    //         //  console.log("请求用户返回数据", res);
    //         cb(res.data[0].CustomerInfo);
    //       } else {
    //         //  console.log("请求数据失败");
    //       }
    //     }
    //   });
    // },
    cb_findCustomer(res){
      //  console.log(res)
      const that = this
      if (res.stateCode == 200) {
        //  console.log("请求用户返回数据", res);
        that.Set(res.data[0].CustomerInfo);
      } else {
        //  console.log("请求数据失败");
      }
    },
    /**
     * 回调函数
     */
    Set(res) {
      var that = this;
      that.show = true;
      that.person = res;
      // //  console.log(that.person);
      var mineobj = JSON.stringify(res);
      localStorage.setItem("mine", mineobj);
    },

    /**
     * 修改名字
     */
    ChangeName(parm) {
      //  console.log("修改名字", parm);
      window.location.href = "./change-name.html?id=" + parm;
    },

    /**
     *  修改手机号
     */
    ChangePhone(parm) {
      //  console.log("修改手机号", parm);
      window.location.href = "./change-phone.html?id=" + parm;
    },

    /**
     * 修改头像
     */
    pic(parm) {
      window.location.href = "./change-head-img.html?id=" + parm;
    },

    /**
     * 返回上一级
     */
    back() {
      window.history.go(-1);
    },

    // 退出登录
    GoLogin() {
      window.location.href = "./login.html";
      localStorage.clear();
    }

    //
  }
});
