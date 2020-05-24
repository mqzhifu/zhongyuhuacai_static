/*
* @Author: xuren
* @Date:   2019-02-20 11:15:31
* @Last Modified by:   Kir
* @Last Modified time: 2019-04-18 18:07:39
*/
var prevprev;
var parpar;
var type;
var selected;
// var name;
var m = new Map();
m.set("type","修改账号类别");
// m.set("company","修改公司名称");
m.set("address","修改联系地址");
m.set("contact","修改联系人");
m.set("phone","修改联系电话");
m.set("sex","修改性别");
m.set("nickname","修改昵称");
m.set("ps","修改登陆密码");

var td = new Map();
td.set("2","个人账号");
td.set("1","公司账号");

var sexDesc = new Map();
sexDesc.set("1","男");
sexDesc.set("2","女");


//建立一?可存取到?file的url
  function getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
      } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
      }
      return url;
  }
  //上传头像到服务器
  function upimg() {
      var pic = $('#upload')[0].files[0];
      if(pic == undefined){
      	return;
      }
      var file = new FormData();
      file.append('avatar', pic);
      $.ajax({
          url: '/developer/modifyBaseInfo/',
          type: "post",
          data: file,
          dataType:"json",
          cache: false,
          contentType: false,
          processData: false,
          success: function(data) {
              // console.log(data);
              // $("#pic").attr("src", data.avatar);
          }
      });
  }

$(document).ready(function(){



	$.ajax({
		type:'post',
		dataType:"json",
		url:"/developer/getInfo/",
		success:function(info){
			data = info.data;
			// var info = $.parseJSON(res);
			$('#type').html(td.get(data.type+""));
			$('#company').html(data.company);
			$('#contact').html(data.contact);
			$('#phone').html(data.phone);
			$('#address').html(data.address);

			$('#nickname').html(data.nickname);
			$('#pic').attr('src',data.avatar);
			$('#sex').html(sexDesc.get(data.sex+""));
			$('#uid').html(data.uid);

		}

	});

	$('.td-blue').click(function(){
		prevprev = $(this).prev().prev();
		parpar = $(this).parent().parent();
		selected = prevprev.attr('id');
		type = parpar.attr('id');

		if(selected == "type"){
			$('.old_ps').hide();
			$('.confirm_ps').hide();
			$('.forget_ps').hide();
			$('.sex-radio').hide();
			$('.modifyItem').hide();
			$('.modal-select').show();
			// for()
			// $('.modal-select').val(1);
			
			// for(var key in td){
			// 	console.log(key);
			// 	if(td.get(key) == prevprev.text()){
			// 		console.log(prevprev.text());
			// 		$('.modal-select').val(key);
			// 	}
			// }
			td.forEach(function (value, key, map) {
			    if(value == prevprev.text()){
					$('.modal-select').val(key);
				}
			 });

			$('.modal-select').attr('name',selected);
		}else if(selected == "sex"){
			$('.confirm_ps').hide();
			$('.old_ps').hide();
			$('.forget_ps').hide();
			$('.sex-radio').show();
			$('.modifyItem').hide();
			$('.modal-select').hide();

			sexDesc.forEach(function(value, key, map){
				if(value == prevprev.text()){

					$("input[name='sexradio']").each(function(){
						if($(this).val() == key){
							$(this).attr("checked","checked");
						}
					});
				}
			});
		}else if(selected == "ps"){
			$('.confirm_ps').val("");
			$('.old_ps').val("");
			$('.forget_ps').val("");
			$('.confirm_ps').show();
			$('.old_ps').show().attr('placeholder','旧密码');
			$('.forget_ps').show();
			$('.modifyItem').show().attr('placeholder','新密码').attr('type','password');
			$('.sex-radio').hide();
			$('.modal-select').hide();
		}else{
			$('.confirm_ps').hide();
			$('.old_ps').hide();
			$('.forget_ps').hide();
			$('.sex-radio').hide();
			$('.modal-select').hide();
			$('.modifyItem').show().removeAttr('placeholder').attr('type','text');
			$('.modifyItem').val(prevprev.text());
	    	$('.modifyItem').attr('name',selected);
		}

		$('#myModalLabel').text(m.get(selected));
		
	});

	$('#avatar-btn').click(function(){
		$('#upload').click();
		$('#upload').change(function(){
			var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
		      if (objUrl) {
		          $("#pic").attr("src", objUrl); //将图片路径存入src中，显示出图片
		          upimg();
		      }
		});
	});
	// $('#upload').change(function(){
	// 	var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
	//       if (objUrl) {
	//           $("#pic").attr("src", objUrl); //将图片路径存入src中，显示出图片
	//           upimg();
	//       }
	// });

	$('.btn-modal-yes').click(function(){
		// name = $('.modifyItem').attr("name");
		
		var htmlLabel;
		var sendData;
		// if(selected == "type"){
		// 	htmlLabel = $('.modal-select');
		// 	sendData = htmlLabel.serialize();
		// }else 
		if(selected == "sex"){
			// sendData = new FormData();
			// var sexval = $("input[name='sexradio']:checked").val();
   //    		sendData.append('sex', sexval+"");
   			sendData = {
   				"sex":$("input[name='sexradio']:checked").val(),
   			};
      		// var file = new FormData();
      		// file.append('avatar', pic);
		}else if(selected == "ps"){
			sendData = {
				"ps":$(".modifyItem").val(),
				"old_ps":$(".old_ps").val(),
				"confirm_ps":$(".confirm_ps").val()
			}
		}else{
			htmlLabel = $('.modifyItem');
			sendData = htmlLabel.serialize();
		}
		

	      if(type==='info'){
	          var link = '/developer/modifyInfo/';
	      }else{
	          var link = '/developer/modifyBaseInfo/';
	      }
	      $.ajax({
	          type: 'get',
	          url: link,
	          dataType: 'json',
	          // contentType: "application/json",//;charset=utf-8
	          data: sendData,
	          success: function (res) {
	          	if(res.code === 1){
	          		alert(res.message);

	          		var htmlstr;
	          		if(selected=="sex"){
	          			htmlstr = sexDesc.get($("input[name='sexradio']:checked").val());
	          		}else if(selected=="ps"){

	          		}else{
	          			htmlstr = htmlLabel.val();
	          		}
	          		// else if(selected=="type"){
	          		// 	htmlstr = td.get(htmlLabel.val());
	          		// }
	          		
	          		prevprev.html(htmlstr);
	          	}else{
	          		alert(res.message);
	          	}

	          }
	      });
	});



  // $("#pic").click(function() {
  //     $("#upload").click(); //隐藏了input:file样式后，点击头像就可以本地上传
  //     $("#upload").on("change", function() {
  //         var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
  //         if (objUrl) {
  //             $("#pic").attr("src", objUrl); //将图片路径存入src中，显示出图片
  //             upimg();
  //         }
  //     });
  // });

  





// //判断浏览器是否有FileReader接口
//   if(typeof FileReader =='undefined')
//    {
//     /*$("#avatar").css({'background':'none'}).html('亲,您的浏览器还不支持HTML5的FileReader接口,无法使用图片本地预览,请更新浏览器获得最好体验');*/
//      //如果浏览器是ie
//      if($.browser.msie===true)
//      {
//        //ie6直接用file input的value值本地预览
//       if($.browser.version==6)
//        {
//          $("#browsefile").change(function(event){
//             //ie6下怎么做图片格式判断?
//             var src = event.target.value;
//             //var src = document.selection.createRange().text;    //选中后 selection对象就产生了 这个对象只适合ie
//             var img = '<img src="'+src+'" width="200px" height="200px" />';
//             $("#avatar").empty().append(img);
//           });
//       }
//        //ie7,8使用滤镜本地预览
//        else if($.browser.version==7 || $.browser.version==8)
//        {
//          $("#browsefile").change(function(event){
//            $(event.target).select();
//             var src = document.selection.createRange().text;
//             var dom = document.getElementById('avatar');
//             console.log(src);
//             //使用滤镜 成功率高
//             $("#avatar").css({"filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)"});
//             /*dom.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src= src;*/
//             dom.innerHTML = '<img id="head" alt=" " src=+src+ />';
//             //使用和ie6相同的方式 设置src为绝对路径的方式 有些图片无法显示 效果没有使用滤镜好
//             /*var img = '<img src="'+src+'" width="200px" height="200px" />';
//             $("#avatar").empty().append(img);*/
//           });
//        }
//      }
//      //如果是不支持FileReader接口的低版本firefox 可以用getAsDataURL接口
//      else if($.browser.mozilla===true)
//      {
//        $("#browsefile").change(function(event){
//          //firefox2.0没有event.target.files这个属性 就像ie6那样使用value值 但是firefox2.0不支持绝对路径嵌入图片 放弃firefox2.0
//          //firefox3.0开始具备event.target.files这个属性 并且开始支持getAsDataURL()这个接口 一直到firefox7.0结束 不过以后都可以用HTML5的FileReader接口了
//          if(event.target.files)
//          {
//           //console.log(event.target.files);
//           for(var i=0;i<event.target.files.length;i++)
//           {
//              var img = '<img src="'+event.target.files.item(i).getAsDataURL()+'" width="200px" height="200px"/>';
//             $("#avatar").empty().append(img);
//           }
//          }
//          else
//          {
//            //console.log(event.target.value);
//            //$("#imgPreview").attr({'src':event.target.value});
//          }
//          });
//      }
//    }
//    else
//    {
//       //多图上传 input file控件里指定multiple属性 e.target是dom类型
//       $("#browsefile").change(function(e){
//           for(var i=0;i<e.target.files.length;i++)
//             {
//               var file = e.target.files.item(i);
//              //允许文件MIME类型 也可以在input标签中指定accept属性
//              //console.log(/^image\/.*$/i.test(file.type));
//              if(!(/^image\/.*$/i.test(file.type)))
//              {
//                continue;      //不是图片 就跳出这一次循环
//              }
//              //实例化FileReader API
//              var freader = new FileReader();
//              freader.readAsDataURL(file);
//              freader.onload=function(e)
//              {
//                var img = '<img src="'+e.target.result+'" width="50px" height="50px"/>';
//                $("#avatar").empty().append(img);
//              }
//             }
//         });

//    }










});




