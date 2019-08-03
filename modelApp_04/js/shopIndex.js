new Vue({
	el:'#app_index',
	data:{
		mag:'appindex',
		myurlbk:'../imges/shopindexbg.png',
		active:0,
		isactivebg:false,
		navLists:[],
		imageSwipe: [],
		// 店铺的id：shop_id
		shop_id:"",
		// 店铺的背景图
		bgimg:'',
		// 店铺的logo
		shopLogo:'',
		// 店铺的名称
		shopName:'',
		// 带横幅的热卖，推荐商品列表
		bannerList:[],
		// 分页展示加载更多的商品
		pageNum:1,
		pageSize:6,
		// 上新商品的分页
		newPageNum:1,
		NewpageSize:1,
		getMoreList:[],
		// tab导航栏中的bottom
		isMark:false,
		navigation_id:"N201906171444001",
		navMark:'',
		// 上新的商品
		newProList:[],
		// 加载更多时显示或隐藏mybtn
		isBtnShow:false,
		myToast:false,
		myToast_1:false,
		// 以下是导航栏目中商品栏目中所用到的数据
		shoplist:[],
		initdata:{},
		listPageNum:1,
		 // 切换搜索后选中的颜色
		 allshow:true,
		 saleShow:false,
		 newShow:false,
		 priceShow:false,
		 // 切换搜索后箭头的指向
		 showId:true,
		 newProId:true,
		 PriceId:true,
	},
	methods:{
		jumpsearch(){
			window.location.href="./ShopSearch.html"
		},
		jumptest(){
			window.history.go(-1)
			sessionStorage.clear('navigation_id')
		},
		// 跳转到商品的详情页面；商品的id+店铺的id
		jumpShopInfo(id){
			console.log(id,'商品的id',this.shop_id,"店铺的id")
			window.location.href = "./GoodDetail.html?id=" + id + "&shop=" + this.shop_id
		},
		setnavigation_id(){
			// alert(localStorage.getItem('navigation_id'))
			// localStorage.getItem('navigation_id')
			if(sessionStorage.getItem('navigation_id')==null){
					this.navigation_id="N201906171444001"
			}else{
				  this.navigation_id=sessionStorage.getItem('navigation_id')
			}
			// this.navigation_id=sessionStorage.getItem('navigation_id')
		},
		jumpLink(link,index){
			console.log(link, index)
			// window.location.href=link
			window.location.href = "./GoodDetail.html?id=" +link + "&shop=" + this.shop_id
		},
		// 分类跳转到搜索页面
		typefun(target){
			console.log(target)
			window.location.href="./ShopSearch.html?target_id="+target
		},
			// 切换tab
		cutTabs(tabI,index,navId){
			this.navigation_id=navId
			console.log(tabI,index,navId)
			sessionStorage.setItem('navigation_id',navId)
			// sessionStorage.setItem('navigation_id',navId)
			console.log(this.myToast,"myToast的状态")
			if(this.myToast){
				console.log('数据加载完成后，执行的结果')		
			}else{
				console.log('数据未加载完成时执行的')	
				setTimeout(()=>{
					vant.Toast.loading({
						duration:1000,
						mask: true,
						message: '加载中...' 
					});
				},0)
			}
			if(this.myToast_1){
				console.log('数据加载完成后，执行的结果')		
			}else{
				console.log('数据未加载完成时执行的')	
				setTimeout(()=>{
					vant.Toast.loading({
						duration:1000,
						mask: true,
						message: '加载中...'
					});
				},0)
			}
			
		},
		//获取到首页中顶部的导航栏
		getNavTop(){
			const that=this
			var shop_id=pub._parm("shop_id")
			localStorage.setItem("shop_id",shop_id)
			that.shop_id=localStorage.getItem('shop_id')
			var indexNavParam={
				that: that,
				_url: pub._url,
				ur: pub._DetailApi.api_navList,
				data: {shop_id:shop_id},
				cbk: that.getIndexNavInfocbk
			}
			pub._InitAjax(indexNavParam)
		},
		getIndexNavInfocbk(res){
			const that=this
			if(res.code=='200'){
				console.log(res,'顶部的导航栏')
				that.navLists=res.data
			}
		},
		// 回滚到顶部
		backTop(){
			$('html,body').animate({
					scrollTop: 0
			}, 700);
		},
		// 点击四张图片的时候跳转到指定的商品的详情页面
		fourFun(img_target){
			// console.log(img_target)
			// window.location.href=img_target
			window.location.href = "./GoodDetail.html?id=" +img_target + "&shop=" + this.shop_id
		},
		// 点击九张图片的时候跳转到指定的商品的详情页面
		nineFun(img_target){
			console.log(img_target)
			// window.location.href=img_target
			window.location.href = "./GoodDetail.html?id=" +img_target + "&shop=" + this.shop_id
		},
		// 店铺的基本信息包括名称，头像，背景图
		getIndexBaseInfo(){
			const that = this
			var indexBaseParam = {
				that: that,
				_url: pub._url,
				ur: pub._DetailApi.api_shopBaseInfo,
				data: {shop_id:that.shop_id},
				cbk: that.getIndexBaseInfocbk
			}
			console.log(indexBaseParam)
			pub._InitAjax(indexBaseParam);
		},
		getIndexBaseInfocbk(res){
			const that=this 
			console.log(res)
			if(res.code=='200'){
				that.bgimg=res.data.background_img
				that.shopLogo=res.data.dept_img_url
				that.shopName=res.data.dept_name
			}
		},
		// 轮播图列表页
		getSwipeInfo(){
			const that = this 
			var indexSwipeInfoParam={
				that: that,
				_url: pub._url,
				ur: pub._DetailApi.api_Swipe_info,
				data: {shop_id:that.shop_id},
				cbk: that.getIndexSwipeCbk
			}
			console.log(indexSwipeInfoParam)
			pub._InitAjax(indexSwipeInfoParam)
		},
		getIndexSwipeCbk(res){
			const that=this
			console.log(res.data,'轮播图')
			that.imageSwipe=res.data
		},
		// 店铺商品栏目商品列表 -- 带横幅的
		getShopTypeList(){
			const that = this 			
			var getShopListParams={
				that: that,
				_url: pub._url,
				ur: pub._DetailApi.api_typeList,
				data: {shop_id:that.shop_id},
				cbk: that.getShopTypeListCbk
			}
			console.log(getShopListParams)
			pub._InitAjax(getShopListParams)
		},
		getShopTypeListCbk(res){
			const that=this
			if(res.code=='200'){
				console.log(res.data,'带横幅的商品列表')
				that.bannerList=res.data
			}
		},
		// 加载更多时的商品的列表
		getShopList(){
			const that = this 		
			const pageNum=that.pageNum++	
			var getShopListParams={
				that: that,
				_url: pub._url,
				ur: pub._DetailApi.api_shopProduct,
				data: {
					shop_id:that.shop_id,
					pageNum:pageNum,
					pageSize:that.pageSize,
				},
				cbk: that.getShopListCbk
			}
			console.log(getShopListParams)
			pub._InitAjax(getShopListParams)
		},
		getShopListCbk(res){
			const that=this 
			if(res.code=='200'){
				console.log(res,'分页显示加载更多的列表')
				var rowsList=that.getMoreList.concat(res.data.list)
				that.getMoreList=rowsList;
			}
			if(res.data.list.length==0){
				alert('没有更多了')
			}
		},
		// 上新的商品；
		getnewPro(){
			const that = this 			
			const pageNum=that.newPageNum++
			var getNewProParams={
				that: that,
				_url: pub._url,
				ur: pub._DetailApi.api_newPro,
				data: {
					shop_id:that.shop_id,
					pageNum:pageNum,
					pageSize:that.NewpageSize,
				},
				cbk: that.getnewProCbk
			}
			console.log(getNewProParams)
			pub._InitAjax(getNewProParams)
		}	,
		getnewProCbk(res){
			const that=this
			if(res.code=='200'){
				console.log(res.data,'上新的商品',res.data.list.length)
				var rowsList=that.newProList.concat(res.data.list)
				that.newProList=rowsList;
				console.log(that.newProList,"newproList")
				that.myToast=true;
				console.log(that.myToast,"myToast 数据加载完成后的状态")			
			}
			if(res.data.list.length==0){
				// alert('暂无更多商品')
				console.log(that.isBtnShow)
				that.isBtnShow=true
			}else{
				that.isBtnShow=false
			}
		},
		// 以下是导航栏中的商品列表所用到的函数
		// 请求数据 data文传入的形参 请求需要的参数
		InitAjax(data) {
			var that = this;
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
						// 此shoplist与shopSearch.js中的shoplist保持一致
						that.shoplist=res.data.list
						that.myToast_1=true;
						console.log(that.shoplist,'此shoplist为商品栏目中的商品列表')
					}else{
						console.log('数据加载失败')
					}
				}
			});
		},
		// 加载更多
		shoplistmore(){
			console.log('shoplistmore 加载更多.....')
			this.initdata.pageNum = this.initdata.listPageNum;
      this.initdata.pageSize = this.initdata.pageSize+6;
      this.InitAjax(this.initdata);
      console.log(this.shoplist)
      console.log(this.initdata.pageNum,this.initdata.pageSize)
		},
		// 默认的排序方式
		mydefault(){
			console.log('默认的搜索方式')
      var data={
        pageNum:this.listPageNum,
        pageSize:this.pageSize,
        shop_id:localStorage.getItem('shop_id')
      }
      this.saleShow=false,
      this.allshow=true,
      this.newShow=false,
      this.priceShow=false
      this.initdata=data;
      var that=this
      this.InitAjax(this.initdata)
		},
		//按销量进行排序；
		salenum(){
			console.log('按销量进行排序')
			this.showId =! this.showId
			if(this.showId){
				console.log('up')
				var data={
					pageNum:this.listPageNum,
					pageSize:this.pageSize,
					shop_id:localStorage.getItem('shop_id'),
					sale_count_sort:"up"
				}
			}else{
				console.log('down')
				var data={
					pageNum:this.listPageNum,
					pageSize:this.pageSize,
					shop_id:localStorage.getItem('shop_id'),
					sale_count_sort:"down"
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
		// 按上新的方式进行排序
		newProFun(){
			console.log('按上新的方式进行排序')
			this.newProId =! this.newProId
			if(this.newProId){
				console.log('up')
				var data={
					pageNum:this.listPageNum,
					pageSize:this.pageSize,
					shop_id:localStorage.getItem('shop_id'),
					add_time_sort:"up"
				}
			}else{
				console.log('down')
				var data={
					pageNum:this.listPageNum,
					pageSize:this.pageSize,
					shop_id:localStorage.getItem('shop_id'),
					add_time_sort:"down"
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
		//按价格进行排序 
		priceFun(){
			console.log('按价格进行排序')
			this.PriceId =! this.PriceId
			if(this.PriceId){
				console.log('up')
				var data={
					pageNum:this.listPageNum,
					pageSize:this.pageSize,
					shop_id:localStorage.getItem('shop_id'),
					sale_price_sort:"up"
				}
			}else{
				console.log('down')
				var data={
					pageNum:this.listPageNum,
					pageSize:this.pageSize,
					shop_id:localStorage.getItem('shop_id'),
					sale_price_sort:"down"
				}
			}
			this.saleShow=false,
      this.allshow=false,
      this.newShow=false,
      this.priceShow=true
      this.initdata=data;
      var that=this
      this.InitAjax(this.initdata)

		}
	},
	created() {
		this.getNavTop()
		this.getSwipeInfo()
		this.getIndexBaseInfo()
		this.getShopTypeList()
		this.getShopList()
		// 调用的是商品栏目中的函数
		var data={
      pageNum:this.listPageNum,
      pageSize:this.pageSize,
      shop_id:localStorage.getItem('shop_id')
		}
		console.log(data,'data,调用商品栏目中的函数')
    this.initdata=data;
		var that=this
		setTimeout(()=>{
			this.InitAjax(this.initdata)
		},20)
		// 调用的是上新商品的函数
		setTimeout(()=>{
			this.getnewPro()
		},40)
		this.setnavigation_id()		
	},
})