new Vue({
  el:'#shopSearch',
  data:{ 
    shoplist:[],
    productName:'',
    // 切换搜索后选中的颜色
    allshow:true,
    saleShow:false,
    newShow:false,
    priceShow:false,
    // 切换搜索后箭头的指向
    showId:true,
    newProId:true,
    PriceId:true,
    // 分页展示加载更多的商品
		pageNum:1,
    pageSize:10,
    shop_id:localStorage.getItem('shop_id'),
    initdata:{}
  },
  methods:{
    jumpShopIndex(){
      window.location.href="./shopIndex.html?shop_id="+this.shop_id
    },
    jumpShopInfo(id){
      console.log(id,'商品的id',this.shop_id,"店铺的id")
      window.location.href = "./GoodDetail.html?id=" + id + "&shop=" + this.shop_id;
		},
    // 单纯的用输入框中的输入关键字进行搜索
    searchfun(){
      console.log('输入框中的输入方式')
      var data={
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        shop_id:this.shop_id,
        product_name:this.productName
      }
      this.initdata=data;
      var that=this
      this.InitAjax(this.initdata)
    },
    // 按销量进行搜索
    saleShowNum(){
      console.log('按销量进行搜索')
      this.showId =! this.showId
      if(this.showId){
        console.log('up') 
        console.log(this.productName)
        if(this.productName){
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            product_name:this.productName,
            sale_count_sort:"up"
          }
        }else{
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            sale_count_sort:"up"
          }
        }
      }else{
        console.log('down')
        if(this.productName){
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            product_name:this.productName,
            sale_count_sort:"down"
          }
        }else{
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            sale_count_sort:"down"
          }
        }
      }
      this.saleShow=true,
      this.allshow=false,
      this.newShow=false,
      this.priceShow=false
      this.initdata=data;
      var that=this
      this.InitAjax(this.initdata)
    },
    // 默认的搜索方式
    all(){
      console.log('默认的搜索方式')
      var data={
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        shop_id:this.shop_id
      }

      this.saleShow=false,
      this.allshow=true,
      this.newShow=false,
      this.priceShow=false
      this.initdata=data;
      var that=this
      this.InitAjax(this.initdata)
    },
    // 按上新的时间方式进行搜索
    newProShow(){
      this.newProId =! this.newProId
      console.log('按上新的时间顺序进行搜索',this.newProId)
      if(this.newProId){
        console.log('up') 
        console.log(this.productName)
        if(this.productName){
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            product_name:this.productName,
            add_time_sort:"up"
          }
        }else{
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            add_time_sort:"up"
          }
        }
      }else{
        console.log('down')
        if(this.productName){
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            product_name:this.productName,
            add_time_sort:"down"
          }
        }else{
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            add_time_sort:"down"
          }
        }
      }
      this.saleShow=false,
      this.allshow=false,
      this.newShow=true,
      this.priceShow=false
      this.initdata=data;
      var that=this
      this.InitAjax(this.initdata)

    },
    //按价格的顺序进行排序
    PriceShowFun(){
      this.PriceId =! this.PriceId
      console.log('按价格的顺序进行排序',this.PriceId)
      if(this.PriceId){
        if(this.productName){
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            product_name:this.productName,
            sale_price_sort:"up"
          }
        }else{
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            sale_price_sort:"up"
          }
        }
      }else{
        if(this.productName){
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            product_name:this.productName,
            sale_price_sort:"down"
          }
        }else{
          var data={
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            shop_id:this.shop_id,
            sale_price_sort:"down"
          }
        }
      }
      this.saleShow=false,
      this.allshow=false,
      this.newShow=false,
      this.priceShow=true
      this.initdata=data;
      var that=this
      this.InitAjax(this.initdata)
    }, 
    // 加载更多
    getMore(){
      this.initdata.pageNum = this.initdata.pageNum;
      this.initdata.pageSize = this.initdata.pageSize+10;
      this.InitAjax(this.initdata);
      console.log(this.shoplist)
      console.log(this.initdata.pageNum,this.initdata.pageSize)
      if(this.initdata.pageNum<1){
        alert('没有更多了')
      }
    },
    // 请求数据 data文传入的形参 请求需要的参数
    InitAjax(data) {
      var that = this;
       console.log(data)
      $.ajax({
        type: "POST",
        contentType: "application/json",
        url: pub._url+pub._DetailApi.api_shopProduct,
        data: JSON.stringify(data),
        error: function(request) {
           console.log("Connection error");
        },
        success: function(res) {
         if(res.code=='200'){
           that.shoplist=res.data.list
           console.log(that.shoplist)
         }else{
           console.log('数据加载失败')
         }
        }
      });
    },
  },
  created(){
    var data={
      pageNum:this.pageNum,
      pageSize:this.pageSize,
      shop_id:this.shop_id,
      target_id:pub._parm("target_id")
    }
    this.initdata=data;
    var that=this
    this.InitAjax(this.initdata)
    console.log(pub._parm("target_id"),'target_id')    
  }
})