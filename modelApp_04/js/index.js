// 自执行函数
(function(win, doc) {

  var pub_url = pub.url;

  // 直接发送字符串
  function InitAjax(cb) {
    // var aaa = "page_id=1";
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
        //  console.log(data);
        cb(data);
      }
    });
  }
  InitAjax(InitDataSet);
  var InitTotalData;
  function InitDataSet(res) {
    InitTotalData = res;
    // //  console.log(InitTotalData)
  }


  // 各种原始信息
  // 顶部导航信息

  // 模块的说明信息
  var info_modules = InitTotalData.modules;
  var info_recommend = InitTotalData.recommend;
  // 显示商城的logo标志
  //  console.log(InitTotalData.user)
  for(var lo = 0 ;lo<InitTotalData.user.length;lo++){
    if(InitTotalData.user[lo].event_id == 'logo'){
      $('.logo_info').empty().append(` <a href="`+InitTotalData.user[lo].event_url+`"><img class="logo_img" src="`+InitTotalData.user[lo].event_img+`" alt=""></a>`)
    }
  }
  //  console.log(info_modules);

  // if(InitTotalData.user){
  //  console.log(InitTotalData);
  var Init_nav = InitTotalData.user;
  // //  console.log("顶部导航信息", Init_nav);

  // 商品分类的二级联动
  if (InitTotalData.navigation) {
    var shop_list_arr = InitTotalData.navigation;
    FirstGoodList(shop_list_arr);
  } else {
    $(".classify").empty();
  }
  // //  console.log("商品的二级联动数据", shop_list_arr);

  // 轮播图信息
  if (InitTotalData.carousel) {
    var Init_carousel = InitTotalData.carousel;
    Carousel(Init_carousel);

    var swiper = new Swiper(".swiper-container", {
      autoplay: {
        delay: 2000,
        stopOnLastSlide: false,
        disableOnInteraction: true
      },
      loop: true,
      autoplayDisableOnInteraction: false,
      pagination: {
        el: ".swiper-pagination"
      }
    });
  } else {
    $(".banner_photo").empty();
  }
  // //  console.log("轮播图数据", Init_carousel);

  // 排行榜信息
  if (InitTotalData.charts) {
    var Init_charts = InitTotalData.charts;
    InitTop(Init_charts);
    recom(info_recommend)
  } else {
    $(".top_left_box").empty();
  }
  // //  console.log("排行榜信息", Init_charts);

  // 轮播图渲染
  function Carousel(res) {
    var carousel_str = "";
    for (var c = 0; c < res.length; c++) {
      carousel_str =
        carousel_str +
        `
        <a   href="` +
        res[c].event_url +
        `" class="swiper-slide"   >
          <img class='banner_img' src="` +
        res[c].event_img +
        `" alt="` +
        res[c].event_name +
        `"  >
        </a>
        `;
    }
    $(".banner_photo")
      .empty()
      .append(carousel_str);
  }
  // Carousel(Init_carousel)

  // 商品一级分类
  function FirstGoodList(res) {
    var first_good_str = "";
    for (var f = 0; f < res.length; f++) {
      first_good_str =
        first_good_str +
        `
        <a  data-id="` +
        res[f].navigation_id +
        `" id="` +
        f +
        `" class="classify_div"  >
          <img class="classify_img" src="` +
        res[f].navigation_img +
        `" alt="">
          <span class="classify_span" >` +
        res[f].navigation_name +
        `</span>
        </a>
        `;
    }
    $(".classify").append(first_good_str);
  }
  // FirstGoodList(shop_list_arr)

  // 点击一级发生跳转携带参数 一级的id 到分类页面接受id 默认显示该分类
  $(".classify").on("click", ".classify_div", function() {
    var topid = $(this).attr("id");
    // //  console.log(topid);
    location.href = "./classify.html?topid=" + topid;
  });

  // 排行榜
  function InitTop(res) {
    var init_top_str = "";
    init_top_str =
      init_top_str +
      ` 
          <span class='top_blue'  >` +
      res[0].event_type_name +
      `</span>
          <span class='top_text' >汇集全网最好的</span>
          <div class='top_photo' >
            <img class='top_list_img' src='` +
      res[0].event_type_parameter[0].event_img +
      `' >
          </div>    
        
      `;
    $(".top_left_one")
      .empty()
      .append(init_top_str);

  }
  // InitTop(Init_charts)

  function recom(res) {
    var init_top_str_two = "";
    init_top_str_two =
      init_top_str_two +
      ` 
          <span class='top_blue'  >` +
      info_modules.recommend.module_name +
      `</span>
          <span class='top_text' >` +
      info_modules.recommend.module_introduce +
      `</span>
          <div class='top_photo' >
            <img class='top_list_img' src='` +
      res[1].event_img +
      `' >
          </div>    
        
      `;

    $(".top_left_two")
      .empty()
      .append(init_top_str_two);
  }

  var InitGoods = InitTotalData.goods;
  // //  console.log("推荐商品", InitGoods);
  function InitGood(res) {
    var line_str = `---- `+info_modules.goods.module_name+` ----`
    $('.line').empty().append(line_str)
    var good_arr = [];
    for (var g = 0; g < res.length; g++) {
      for (var gd = 0; gd < res[g].event_type_parameter.length; gd++) {
        good_arr.push(res[g].event_type_parameter[gd]);
      }
    }
    //  console.log(good_arr);
    var good_str = "";
    for (var gh = 0; gh < good_arr.length; gh++) {
      good_str =
        good_str +
        `
      <a href='` +
        good_arr[gh].event_url +
        `' class='good_item' href=""   >
        <img class='good_item_icon' src='` +
        good_arr[gh].event_img +
        `' >
        <div class='good_item_infos' >
          <span>` +
        good_arr[gh].event_name +
        `</span>       
        </div>
        <div class='good_item_info'>
          <span class='name'>￥` +
        good_arr[gh].event_price +
        `</span>
            
        </div>
      </a>
      `;
    }
    $(".goodlist")
      .empty()
      .append(good_str);
  }

  InitGood(InitGoods);

  $(".nav_div").on("click", function() {
    window.location.href = "./seachgood.html";
  });
})(window, document);
