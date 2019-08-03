var pub_url = pub.url;
$(function() {
  // 直接发送字符串
  function InitAjax(cb) {
     var aaa = {"page_id":1};
    $.ajax({
      type: "POST",
      contentType:"application/json;charset=utf-8",
      cache: true,
      url: pub_url + "homepage",
      data:JSON.stringify(aaa) ,
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
  if (InitTotalData.recommend) {
    var Init_recommend = InitTotalData.recommend;
    // //  console.log("推荐商品信息", Init_recommend);
    recommend(Init_recommend);
  }

  function recommend(res) {
    if (res.length) {
      var recommend_str = ``;
      for (var rec = 0; rec < res.length; rec++) {
        var am = rec + 1;
        recommend_str =
          recommend_str +
          `
        <a href="` +
          res[rec].event_url +
          `" class="shop_item">
          <div class="item_img">
            <img class="item_imgs" src="` +
          res[rec].event_img +
          `" alt="">
          </div>
          <div class="top_num">` +
          am +
          `</div>
          <div class="shop_item_info">
            <p class="item_text">` +
          res[rec].event_name + `~` + res[rec].event_remark +
          `</p>
          <p class="item_text">￥` +
          res[rec].event_price +
          `</p>
          </div>
        </a>
        `;
      }
    } else {
      //  console.log('重新获取数据')
    }

    $(".shop_list")
      .empty()
      .append(recommend_str);
  }

  // 点击返回按钮的事件
  $(".back").on("click", function() {
    // //  console.log("点击返回按钮");
    location.href = "./index.html";
  });
});
