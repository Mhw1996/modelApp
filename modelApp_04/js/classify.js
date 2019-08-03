var pub_url = pub.url;
(function() {
  function InitAjax(cb) {
    var aaa = { page_id: 1 };
    $.ajax({
      type: "POST",
      contentType: "application/json;charset=utf-8",
      cache: true,
      url: pub_url + "homepage",
      data: JSON.stringify(aaa),
      async: false,
      error: function(request) {
        //  console.log("Connection error");
      },
      success: function(data) {
         console.log(data);
        cb(data);
      }
    });
  }
  InitAjax(InitDataSet);

  var InitTotalData;
  function InitDataSet(res) {
    InitTotalData = res;
    //  console.log(InitTotalData);
  }

  var shop_list_arr = InitTotalData.navigation;
  //  console.log("商品的二级联动数据", shop_list_arr);

  // var strHref = location.href;   获取地址
  // var intPos = strHref.indexOf("?");  找到第一个？位置
  // var strRight = strHref.substr(intPos + 1); 从？下一个位置开始裁切 得到所有参数的字符串
  // var s_getID = strRight.split("&") || strRight.split(" ");  利用&将字符串切割为字符串数组
  // 找到需要的参数的下标 已知参数名称为UUID 所以可以确定需要裁切的位数
  // var uuid = s_getID[0].slice(5);

  var strHref = location.href;
  if (strHref.indexOf("?")) {
    var intPos = strHref.indexOf("?");
    var strRight = strHref.substr(intPos + 1);
    var s_getID = strRight.split("&") || strRight.split(" ");
    var top_id = s_getID[0].slice(6);
  }

  // 搜索结果未知隐藏
  $(".sear_con").hide();

  // 左边一级渲染
  function Left(res) {
    var left_str = "";
    for (var l = 0; l < res.length; l++) {
      left_str =
        left_str +
        `
      <span data-first-id="` +
        l +
        `" id="` +
        res[l].navigation_id +
        `" class="left_first"  >` +
        res[l].navigation_name +
        `</span>
      `;
    }
    $(".con_left")
      .empty()
      .append(left_str);
    // 有首页点击一级携带的参数 设置默认
    $(".left_first")
      .eq(top_id)
      .addClass("left_first_act");
  }
  Left(shop_list_arr);

  InitSecond(shop_list_arr[top_id].navigation_two);

  // 右边二级渲染
  // 默认显示第一个二级
  function InitSecond(arr) {
    var init_second_arr = arr;
    //  console.log(init_second_arr);
    var init_second_str = "";
    // for(var s=0;s<init_second_arr.length;s++){
    //   init_second_str = init_second_str +`
    //   <a class="right_second" href="./seachgood.html?id=`+init_second_arr[s].navigation_id+`" >
    //     <img class="right_img" src="`+init_second_arr[s].navigation_img+`" alt="缩略图">
    //     <span class="right_text" >`+init_second_arr[s].navigation_name+`</span>
    //   </a>
    //   `
    // }

    for (var s = 0; s < init_second_arr.length; s++) {
      init_second_arr[s].navigation_img = init_second_arr[s].navigation_img
        ? init_second_arr[s].navigation_img
        : "./imges/default.jpg";
      init_second_str =
        init_second_str +
        `
      <a class="right_second" id="` +
        init_second_arr[s].navigation_id +
        `" >
        <img class="right_img" src="` +
        init_second_arr[s].navigation_img +
        `" alt="缩略图">
        <span class="right_text" >` +
        init_second_arr[s].navigation_name +
        `</span>
      </a>
      `;
    }
    $(".con_right")
      .empty()
      .append(init_second_str);
  }
  // InitSecond(shop_list_arr[0].navigation_two)
  // 点击显示二级
  $(".con_left").on("click", "span", function() {
    //  console.log("拿数据");
    $(this)
      .addClass("left_first_act")
      .siblings()
      .removeClass("left_first_act");
    var second_target = $(this).attr("data-first-id");
    var second_arr = shop_list_arr[second_target].navigation_two;
    var second_str = "";
    // for(var s=0;s<second_arr.length;s++){
    //   second_str = second_str +`
    //   <a class="right_second" href="./seachgood.html?id=`+second_arr[s].navigation_id+`" >
    //     <img class="right_img" src="`+second_arr[s].navigation_img+`" alt="缩略图">
    //     <span class="right_text" >`+second_arr[s].navigation_name+`</span>
    //   </a>
    //   `
    // }
    for (var s = 0; s < second_arr.length; s++) {
      second_arr[s].navigation_img = second_arr[s].navigation_img
        ? second_arr[s].navigation_img
        : "./imges/default.jpg";
      second_str =
        second_str +
        `
      <a class="right_second" id="` +
        second_arr[s].navigation_id +
        `" >
        <img class="right_img" src="` +
        second_arr[s].navigation_img +
        `" alt="缩略图">
        <span class="right_text" >` +
        second_arr[s].navigation_name +
        `</span>
      </a>
      `;
    }
    $(".con_right")
      .empty()
      .append(second_str);
  });

  // 搜索

  $(".con_right").on("click", ".right_second", function() {
    //  console.log("点击事件");
    var id = $(this).attr("id");
    // //  console.log(id);
    window.location.href = "./seachgood.html?id=" + id;
  });

  /**
   * 点击顶部的搜索框 跳转商品搜索页面
   */
  $(".nav_div").on("click", function() {
    window.location.href = "./seachgood.html";
  });
})();
