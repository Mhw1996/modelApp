var pub_url = pub.url;
var app = new Vue({
  el: "#app",
  data: {
    dept_id: "",
    buyer_id: "",
    list: [],
    top: "新增收货地址",
    initdata: {},
    more: false,
    pageNum: 1,
    pageSize: 100
  },
  created() {
    this.dept_id = localStorage.getItem("dept_id");
    this.buyer_id = localStorage.getItem("buyer_id");
    var data = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      user_id: this.buyer_id
    };
    this.initdata = data;
    // this.InitAjax(this.initdata);
    const that = this
    pub._Init(that, pub.url, pub.detail_api.getReceive, this.initdata, that.cb_getReceive)
  },
  methods: {
    cb_getReceive(res) {
      const that = this
      if (res.stateCode == 200) {

        app.list = res.data.list;
        app.user_type_id = res.data.list[0].user_type_id
          ? res.data.list[0].user_type_id
          : "";

        if (res.data.list.length > 100) {
          that.more = true;
        } else {

        }
      } else {

        alert("数据加载失败");
      }
    },
    /**
     * 请求地址信息
     */
    // InitAjax(data) {
    //   var that = this;
    //   $.ajax({
    //     type: "POST",
    //     contentType: "application/json",
    //     url: pub_url + "getReceive",
    //     data: JSON.stringify(data),
    //     error: function(request) {
    //       alert("Connection error");
    //     },
    //     success: function(res) {
    //       // console.log(res)
    //       if (res.stateCode == 200) {
    //         // console.log(res);
    //         app.list = res.data.list;
    //         app.user_type_id = res.data.list[0].user_type_id
    //           ? res.data.list[0].user_type_id
    //           : "";
    //         // console.log(app.list);
    //         if (res.data.list.length > 100) {
    //           that.more = true;
    //         } else {
    //           console.log("加载更多");
    //         }
    //       } else {
    //         // console.log("请求数据失败");
    //         alert("数据加载失败");
    //       }
    //     }
    //   });
    // },

    /**
     * 新增地址
     */
    GoAddress() {
      window.location.href = "./new-address.html";
    },
    /**
     * 返回上一级
     */
    back() {
      var id;

      window.history.go(-1);


      SaveAddrObj = JSON.stringify(SaveAddrObj);

      localStorage.setItem("SaveAddrObj", SaveAddrObj);
    },

    /**
     * 加载更多
     */
    GoMore() {
      const that = this
      this.initdata.pageSize = this.initdata.pageSize += 10;

      pub._Init(that, pub.url, pub.detail_api.getReceive, this.initdata, that.cb_getReceive)
    },
    /**
     * 设置默认地址 修改地址接口
     */
    DefaultAddr(parm) {

      const that = this
      for (var ad = 0; ad < this.list.length; ad++) {
        this.list[ad].default_status_id = "narmol";
        if (this.list[ad].receive_id == parm) {
          this.list[ad].default_status_id = "default";
        }
      }
      var data = {
        receive_id: parm,
        receiveinfo: {
          default_status_id: "default"
        }
      };

      pub._Init(that, pub.url, pub.detail_api.editReceive, data, that.cb_editReceive)


    },

    cb_editReceive(res) {
      if (res.stateCode == 200) {

      } else {

        alert("数据加载失败");
      }
    },

    /**
     * 删除地址
     */
    DelAddr(parm) {

      var flag = confirm("确认删除地址么？");

      if (flag) {
        var data = {
          receive_id: parm
        };
        for (var sa = 0; sa < this.list.length; sa++) {
          if (this.list[sa].receive_id == parm) {
            this.list.splice(sa, 1);
          }
        }
        const that = this
        pub._Init(that, pub.url, pub.detail_api.delReceive, data, that.cb_delReceive)

      }
    },
    cb_delReceive(res) {
      if (res.stateCode == 200) {

      } else {

        alert("数据加载失败");
      }
    },

    /**
     * 编辑地址
     */
    EditAddr(parm) {

      window.location.href = "./new-address.html?id=" + parm;
    },

    /**
     * 保存从订单页面跳转而来需要选择的收货地址
     * 存入缓存
     */
    SaveAddrItem(parm) {
      var SaveAddrObj = {};

      for (var sa = 0; sa < this.list.length; sa++) {
        if (this.list[sa].receive_id == parm) {
          SaveAddrObj = this.list[sa];
        }
      }

      SaveAddrObj = JSON.stringify(SaveAddrObj);

      localStorage.setItem("SaveAddrObj", SaveAddrObj);
      alert("已选地址");
    }

    //
  }
});
