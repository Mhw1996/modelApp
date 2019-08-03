/**
 * 0
 */

var pub_url = pub.url;

function uploadFiles() {
  var formData = new FormData();

  var file = $("#excelFile").get(0).files[0];
  // 	var uploadFile = new FormData($("#file")[0]);
  var selectedId = $("#select").val();
  // formData.append("uploadFile", uploadFile);
  // formData.append("selectedId", selectedId);
  //  console.log(formData)
  // formData.append("file", file);
  // formData.append("filedir", 'head');
  formData.file = file;
  formData.filedir = head;
  //  console.log(formData)
  var data = {
    'file': file,
    'filedir': 'head'
  }
  //  console.log(formData)


  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: pub_url + "imgUploadPost",
    data: formData,
    error: function (request) {
      alert("Connection error");
    },
    success: function (res) {
      if (res.stateCode == 200) {
        //  console.log(res);
      } else {
        //  console.log("请求数据失败");
      }
    }
  });

  // if (
  //   "undefined" != typeof uploadFile &&
  //   uploadFile != null &&
  //   uploadFile != ""
  // ) {
  // $.ajax({
  // 	url:'/manage/fileupload/upload',
  // 	type:'POST',
  // 	data:formData,
  // 	async: false,
  // 	cache: false,
  // 	contentType: false, //不设置内容类型
  // 	processData: false, //不处理数据
  // 	success:function(data){
  // 		//  console.log(data);
  // 		alert(data.msg);
  // 	},
  // 	error:function(){
  // 		alert("上传失败！");
  // 	}
  // })

  // } else {
  //   alert("选择的文件无效！请重新选择");
  // }
}

// 作者：tywangh
// 来源：CSDN
// 原文：https://blog.csdn.net/qq_20565303/article/details/78478757
// 版权声明：本文为博主原创文章，转载请附上博文链接！

/**
 * 1
 */
// $(".imgInput").change(function(){

//   $(".img").attr("src",URL.createObjectURL($(this)[0].files[0]));
// });

//   //在input file内容改变的时候触发事件

//   $('#filed').change(function(){
//     var str=$(this).val();
//        var arr=str.split('\\');//注split可以用字符或字符串分割
//         var my=arr[arr.length-1];//这就是要取得的图片名称
//         //  console.log('上传的图片名称为',my)
//     //获取input file的files文件数组;

//     //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;

//     //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];

//       var file = $('#filed').get(0).files[0];

//     //创建用来读取此文件的对象

//       var reader = new FileReader();

//     //使用该对象读取file文件

//       reader.readAsDataURL(file);

//     //读取文件成功后执行的方法函数

//       reader.onload=function(e){

//     //读取成功后返回的一个参数e，整个的一个进度事件

//         //  console.log(e);

//     //选择所要显示图片的img，要赋值给img的src就是e中target下result里面

//     //的base64编码格式的地址

//         $('#imgshow').get(0).src = e.target.result;
//         //  console.log('上传图片的base64编码', e.target.result)
//       }

//     })
/**
 * 2
 */
// $(".imgInput").change(function() {
//   $(".img").attr("src", URL.createObjectURL($(this)[0].files[0]));
// });

// //在input file内容改变的时候触发事件

// $("#filed").change(function() {
//   var str = $(this).val();
//   var arr = str.split("\\"); //注split可以用字符或字符串分割
//   var my = arr[arr.length - 1]; //这就是要取得的图片名称
//   //  console.log("上传的图片名称为", my);
//   //获取input file的files文件数组;

//   //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;

//   //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];

//   var file = $("#filed").get(0).files[0];
//   //  console.log(file);
//   var data = {
//     'file':file,
//     'filedir':'head'
//   }

//   //  console.log('需要上传的参数',data)
//   $.ajax({
//     type: "POST",
//     contentType: "application/json",
//     url: "http://192.168.197.12:8080/platform/api/imgUploadPost",
//     data: JSON.stringify(data),
//     error: function(request) {
//       alert("Connection error");
//     },
//     success: function(res) {
//       if (res.stateCode == 200) {
//         //  console.log(res);

//       } else {
//         //  console.log("请求数据失败");
//       }
//     }
//   });

//   //创建用来读取此文件的对象

//   var reader = new FileReader();

//   //使用该对象读取file文件

//   reader.readAsDataURL(file);

//   //读取文件成功后执行的方法函数

//   reader.onload = function(e) {
//     //读取成功后返回的一个参数e，整个的一个进度事件

//     //  console.log(e);

//     //选择所要显示图片的img，要赋值给img的src就是e中target下result里面

//     //的base64编码格式的地址

//     $("#imgshow").get(0).src = e.target.result;
//     // //  console.log("上传图片的base64编码", e.target.result);
//   };
// });
