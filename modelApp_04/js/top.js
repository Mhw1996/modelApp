var pub_url = pub.url;
$(function() {
  // 直接发送字符串
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
        // //  console.log(data);
        cb(data);
      }
    });
  }
  InitAjax(InitDataSet);

  function InitDataSet(res) {
    InitTotalData = res;
  }

  var InitTotalData;
  if (InitTotalData.charts) {
    var Init_charts = InitTotalData.charts;
    //  console.log("排行榜信息", Init_charts);

    initChart(Init_charts);
    defaultItem();
  }

  function initChart(res) {
    var top_list_str = "";
    if (res.length > 4) {
      for (var t = 0; t < 4; t++) {
        top_list_str =
          top_list_str +
          '<p data-id="' +
          t +
          '" class="top_list_item">' +
          res[t].event_type_name +
          "</p>";
      }
    } else {
      // //  console.log(1);
      for (var t = 0; t < res.length; t++) {
        top_list_str =
          top_list_str +
          '<p data-id="' +
          t +
          '" class="top_list_item">' +
          res[t].event_type_name +
          "</p>";
      }
    }

    $(".top_list")
      .empty()
      .append(top_list_str);
  }
  // initChart (Init_charts);

  $(".top_list").on("click", ".top_list_item", function() {
    // //  console.log('点击了头')
    $(this)
      .addClass("top_list_item_act")
      .siblings()
      .removeClass("top_list_item_act");
    var item_id = $(this).attr("data-id");
    // //  console.log(item_id)
    defaultItem(item_id);
  });

  function defaultItem(a) {
    // 如果传参 则显示对应的一级的商品信息
    // 如果为空 则默认显示第一个一级的内容
    var id = a ? a : 0;
    var item_arr = Init_charts[id].event_type_parameter;
    var item_str = "";
    // //  console.log(item_arr);
    for (var im = 0; im < item_arr.length; im++) {
      var am = im + 1;
      item_str =
        item_str +
        `
      <a href="` +
        item_arr[im].event_url +
        `" class="shop_item" >
        <div class="item_img" >
          <img class="item_imgs" src="` +
        item_arr[im].event_img +
        `" alt="">
        </div>
        <div class="top_num" >` +
        am +
        `</div>
        <div class="shop_item_info" >
          <p class="item_text" >` +
        item_arr[im].event_name +
        `~` +
        item_arr[im].event_introduce +
        `</p>
          <p class="item_buy" >购买</p> 
        </div>
      </a>
      `;
    }
    $(".shop_list")
      .empty()
      .append(item_str);
    $(".item_img").css({
      width: "0.6rem",
      height: "0.6rem"
    });
  }

  // 默认样式
  $(".top_list")
    .children()
    .eq(0)
    .addClass("top_list_item_act");
  // defaultItem()
  // 点击返回按钮的事件
  $(".back").on("click", function() {
    // //  console.log('点击返回按钮')
    location.href = "./index.html";
  });
});
