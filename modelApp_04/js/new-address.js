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

var pub_url = pub.url;

var app = new Vue({
  el: "#app",
  data: {
    Countrycode: '1',
    ProvinceList: [],
    ProvinceCode: "",
    CityList: [],
    CityCode: "",
    AreaList: [],
    AreaCode: "",
    Per_name: "",
    Per_phone: "",
    Per_detail: "",
    dept_id: "",
    buyer_id: "",
    id: "",
    top: "新增地址",
    show: false,
    province_name: "请选择省",
    city_name: '请选择市',
    area_name: '请选择区',
    edit_receive_id: '',// 在编辑地址的时候 保存事件需要
  },
  created() {
    if (!(id == "none")) {
      this.id = id;
      this.top = "编辑地址";
      this.show = true;
      //  console.log("编辑地址");
      var data = {
        receive_id: this.id
      };
      //  console.log(data)
      // 请求需要编辑的地址信息
      this.InitAjax(data, this.SetAddr)
    } else {
      //  console.log("新增地址");
      this.top = "新增地址";

    }

    var ProvinceData = {
      countrycode: this.Countrycode
    };
    // 获取中国的省份
    this.Province(ProvinceData);
    this.dept_id = localStorage.getItem("dept_id");
    this.buyer_id = localStorage.getItem("buyer_id");
  },
  methods: {
    /**
     * 省
     */
    Province(data) {
      var that = this;
      $.ajax({
        type: "POST",
        headers: {
          token: localStorage.getItem('tk'),
        },
        contentType: "application/json",
        url: pub_url + "findProvince",
        data: JSON.stringify(data),
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          //  console.log(res)

          app.ProvinceList = res;

        }
      });
    },

    /**
     * 市
     */
    City(parm) {
      //  console.log("省的code", parm);
      var data = {
        provincecode: parm
      };
      //  console.log(data)
      $.ajax({
        type: "POST",
        headers: {
          token: localStorage.getItem('tk'),
        },
        contentType: "application/json",
        url: pub_url + "findCity",
        data: JSON.stringify(data),
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          //  console.log(res)
          app.CityList = res

        }
      });
    },
    /**
     * 区
     */
    Area(parm) {
      //  console.log("省的code", parm);
      var data = {
        citycode: parm
      };
      //  console.log(data)
      $.ajax({
        type: "POST",
        headers: {
          token: localStorage.getItem('tk'),
        },
        contentType: "application/json",
        url: pub_url + "findArea",
        data: JSON.stringify(data),
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          //  console.log(res)
          app.AreaList = res

        }
      });
    },

    /**
     * 手机号
     */
    _Phone(event) {
      //  console.log("检验手机号", event.target.value);
      var phone = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
      if (!phone.test(this.Per_phone)) {
        alert('输入正确的手机号！')
        this.Per_phone = "";
      }
    },

    /**
     * 保存事件
     */
    Save() {
      // 新建地址的 地址默认值的设置 
      //  console.log(app.ProvinceCode, app.CityCode, app.AreaCode);
      var dataobj = {
        // default_status_id: "default",
        receive_name: this.Per_name,
        receive_tel: this.Per_phone,
        receive_address: this.Per_detail,
        user_type_id: "User",
        user_id: this.buyer_id,
        country_code: this.Countrycode,
        province_code: this.ProvinceCode,
        city_code: this.CityCode,
        area_code: this.AreaCode
      };
      var data = {
        receiveinfo: dataobj
      };
      //  console.log(data)
      $.ajax({
        type: "POST",
        headers: {
          token: localStorage.getItem('tk'),
        },
        contentType: "application/json",
        url: pub_url + "addReceive",
        data: JSON.stringify(data),
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          //  console.log(res)
          if (res.stateCode == 200) {
            //  console.log(res);
            window.history.go(-1);
          } else {
            //  console.log("请求数据失败");
          }
        }
      });
    },

    /**
     * 返回上一级事件
     */
    back() {
      window.history.go(-1);

    },

    /**
     * 编辑地址需要请求数据
     */
    InitAjax(data, cb) {

      $.ajax({
        type: "POST",
        headers: {
          token: localStorage.getItem('tk'),
        },
        contentType: "application/json",
        url: pub_url + "findReceive",
        data: JSON.stringify(data),
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          //  console.log("查询需要编辑的地址返回数据", res);
          if (res.stateCode == 200) {

            cb(res.data)
          } else {
            //  console.log("请求数据失败");
          }
        }
      });
    }

    /**
     * 设置需要编辑的地址条目信息
     */
    , SetAddr(res) {
      //  console.log('设置需要编辑的地址条目信息', res)
      var item = {};
      for (var it = 0; it < res.length; it++) {
        if (res[it].ReceiveInfo.receive_id == this.id) {
          item = res[it]
        }
      }
      //  console.log(item)
      this.edit_receive_id = item.ReceiveInfo.receive_id
      // this.Countrycode = item.ReceiveInfo.country_code;
      // this.citycode = item.ReceiveInfo.city_code;
      // this.AreaCode = item.ReceiveInfo.area_code;
      // this.ProvinceCode = item.ReceiveInfo.province_code;
      // this.Per_detail = item.ReceiveInfo.receive_address;
      this.Per_name = item.ReceiveInfo.receive_name;
      this.Per_phone = item.ReceiveInfo.receive_tel;
      // this.area_name = '请选择区';
      // this.city_name = '请选择城市';
      // this.province_name ='请选择省份';
      // this.area_name = item.ReceiveInfo.area_name ? item.ReceiveInfo.area_name : '请选择区';
      // this.city_name = item.ReceiveInfo.city_name ? item.ReceiveInfo.city_name : '请选择城市';
      // this.province_name = item.ReceiveInfo.province_name ? item.ReceiveInfo.province_name : '请选择省份';
      // this.Province(ProvinceCode)
      // this.City(this.citycode)
      // this. Area(AreaCode)
    }

    /**
     * 编辑地址的保存事件 
     */
    , ChangeSave() {
      var dataobj = {
        // default_status_id: "default",
        receive_name: this.Per_name,
        receive_tel: this.Per_phone,
        receive_address: this.Per_detail,
        user_type_id: "User",
        user_id: this.buyer_id,
        country_code: this.Countrycode,
        province_code: this.ProvinceCode,
        city_code: this.CityCode,
        area_code: this.AreaCode
      };
      var data = {
        receive_id: this.edit_receive_id,
        receiveinfo: dataobj
      };
      //  console.log(data)
      $.ajax({
        type: "POST",
        headers: {
          token: localStorage.getItem('tk'),
        },
        contentType: "application/json",
        url: pub_url + "editReceive",
        data: JSON.stringify(data),
        error: function (request) {
          //  console.log("Connection error");
        },
        success: function (res) {
          //  console.log('修改地址返回的数据', res);
          if (res.stateCode == 200) {
            //  console.log('修改地址返回的数据', res);
            window.history.go(-1);
          } else {
            //  console.log("请求数据失败");
          }
        }
      });
    }
  }
});
