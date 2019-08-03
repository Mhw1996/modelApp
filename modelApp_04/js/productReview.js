var app = new Vue({
  el: "#app",
  data: {
    g_id: "", // 商品id
    pageNum: 1, // 页码
    pageSize: 2, // 页面条数
    parm: {}, // 分页中转
    evaluation_count: 0, // 单个评价总条数 在页面的 全部 展示
    page_count: 0, // 记录评价总条数 在加载更多的时候需要判断是否已经在加载完毕
    evaluation_arr: [], // 评论信息的数组
    evaluation_count_obj: {}, // 好中差评论的条数聚合
    tab_id: "all", // 全部
    more_show: true, // 标志是否可以加载更多
    loading: false, // 只有在列表数据获取之后才可以设置为ture 在滚动加载更多的时候使用

  },
  mounted() {
    window.addEventListener("scroll", function() {
      // //  console.log(document.body.scrollTop);
      // //  console.log(document.body.offsetHeight);
      // //  console.log(document.documentElement.clientHeight+'-----------'+window.innerHeight);
      // if(document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
      //   //  console.log('加载')
      // }
    });
  },
  created() {
    //  console.log("进入vue函数中！");
    const that = this;
    that.g_id = pub._parm("g_id");
    //  console.log("商品id", that.g_id);
    var data = {
      pageNum: that.pageNum,
      product_id: that.g_id,
      pageSize: that.pageSize
    };
    pub._Init(
      that,
      pub.express_url,
      pub.detail_api.api_listProductEvaluationPage,
      data,
      that.cb_api_listProductEvaluationPage
    );
    that.parm = data; // 中转参数
  },
  methods: {
    scrollEvent(eve) {
      const that = this
      // //  console.log(
      //   eve.srcElement.scrollTop,
      //   eve.srcElement.offsetHeight,
      //   eve.srcElement.scrollHeight
      // );
      if (
        eve.srcElement.scrollTop + eve.srcElement.offsetHeight >
          eve.srcElement.scrollHeight - 10 &&
        this.more_show &&
        this.loading
      ) {
        that.parm.pageNum = that.parm.pageNum + 1;
        pub._Init(
          that,
          pub.express_url,
          pub.detail_api.api_listProductEvaluationPage,
          that.parm,
          that.cb_api_listProductEvaluationPage
        );
        that.parm = that.parm; // 中转参数
      }
    },

    /**
     * 评价列表的回调
     * @param {*} res
     */
    cb_api_listProductEvaluationPage(res) {
      // //  console.log("评价回调", res);
      const that = this;
      if (res.stateCode == "200") {
        var toatl = that.page_count;
        that.page_count = res.data.pageInfo.totalCount; // 单个 评价总条数
        that.evaluation_count_obj = res.data.productEvaluationScoreCount; // 好中差评论的条数聚合
        that.evaluation_count =
          res.data.productEvaluationScoreCount.bad +
          res.data.productEvaluationScoreCount.common +
          res.data.productEvaluationScoreCount.nice; // 全部评价的条数
        // 将评价的图片由字符串转换为数组
        for (var i = 0; i < res.data.pageInfo.list.length; i++) {
          if (res.data.pageInfo.list[i].product_evaluation_picture != "") {
            var e_str = res.data.pageInfo.list[i].product_evaluation_picture;
            if (res.data.pageInfo.list[i].product_evaluation_picture == null) {
              res.data.pageInfo.list[i].product_evaluation_picture = [];
            } else {
              res.data.pageInfo.list[
                i
              ].product_evaluation_picture = e_str.split(",");
            }
          } else {
            res.data.pageInfo.list[i].product_evaluation_picture = [];
          }

          if (
            res.data.pageInfo.list[i].product_evaluation_addition_picture != ""
          ) {
            var a_str =
              res.data.pageInfo.list[i].product_evaluation_addition_picture;
            if (
              res.data.pageInfo.list[i].product_evaluation_addition_picture ==
              null
            ) {
              res.data.pageInfo.list[
                i
              ].product_evaluation_addition_picture = [];
            } else {
              res.data.pageInfo.list[
                i
              ].product_evaluation_addition_picture = a_str.split(",");
            }
            //
          } else {
            res.data.pageInfo.list[i].product_evaluation_addition_picture = [];
          }

          that.evaluation_arr.push(res.data.pageInfo.list[i]);
        }
        that.loading = true;
        if (that.evaluation_arr.length == that.page_count) {
          that.more_show = false;
        } else {
          that.more_show = true;
        }
      }
    },
    back() {
      window.history.go(-1);
    },
    /**
     * tab切换
     * @param {*} sta 状态
     */
    GoTab(sta) {
      const that = this;
      that.tab_id = sta;
      that.evaluation_arr = [];
      switch (sta) {
        case "all":
          var data = {
            pageNum: that.pageNum,
            product_id: that.g_id,
            pageSize: that.pageSize
          };
          break;
        case "nice":
          var data = {
            pageNum: that.pageNum,
            product_id: that.g_id,
            pageSize: that.pageSize,
            subjects_score: [4, 5]
          };
          break;
        case "common":
          var data = {
            pageNum: that.pageNum,
            product_id: that.g_id,
            pageSize: that.pageSize,
            subjects_score: [3]
          };
          break;
        case "bed":
          var data = {
            pageNum: that.pageNum,
            product_id: that.g_id,
            pageSize: that.pageSize,
            subjects_score: [1, 2]
          };
          break;
      }

      pub._Init(
        that,
        pub.express_url,
        pub.detail_api.api_listProductEvaluationPage,
        data,
        that.cb_api_listProductEvaluationPage
      );
      that.parm = data; // 中转参数
    },
    /**
     * 加载更多
     */
    GoMore() {
      const that = this;
      //  console.log(that.parm);
      that.parm.pageNum = that.parm.pageNum + 1;
      pub._Init(
        that,
        pub.express_url,
        pub.detail_api.api_listProductEvaluationPage,
        that.parm,
        that.cb_api_listProductEvaluationPage
      );
      that.parm = that.parm; // 中转参数
    }
  }
});
