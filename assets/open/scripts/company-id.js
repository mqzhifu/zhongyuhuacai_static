/*
* @Author: xuren
* @Date:   2019-02-22 14:04:16
* @Last Modified by:   xuren
* @Last Modified time: 2019-02-28 12:06:20
*/
var repeatSubmit = false;
function hasText (val) {
  if (val == '' || val == undefined || val == null) {
    return false;
  }
  return true;
}
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


$(document).ready(function(){

  
  $('.identitycard1,.identitycard1-img').click(function(){
    $('#upload').click();
    $("#upload").on("change", function() {
        var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
        if (objUrl) {
            $(".identitycard1-img").attr("src", objUrl); //将图片路径存入src中，显示出图片
            $(".identitycard1-img").show();
            $(".identitycard1").hide();
        }
    });
  });
  // $('.identitycard1').click(function(){
  //   alert("dsds");
  // });
  $('.identitycard2,.identitycard2-img').click(function(){
    $('#upload2').click();
    $("#upload2").on("change", function() {
        var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
        if (objUrl) {
            $(".identitycard2-img").attr("src", objUrl); //将图片路径存入src中，显示出图片
            $(".identitycard2-img").show();
            $(".identitycard2").hide();
        }
    });
  });

  $('.business,.business-img').click(function(){
    $('#upload3').click();
    $("#upload3").on("change", function() {
        var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
        if (objUrl) {
            $(".business-img").attr("src", objUrl); //将图片路径存入src中，显示出图片
            $(".business-img").show();
            $(".business").hide();
        }
    });
  });

  $('.btnno').click(function(){
    $('#myModal').modal();
  });

  $('.btnyes').click(function(){
    if(repeatSubmit){
      $(location).attr('href','/game/show/');
      return;
    }
    var file1 = $('#upload')[0].files[0];
    var file2 = $('#upload2')[0].files[0];
    var file3 = $('#upload3')[0].files[0];
    var sendData = new FormData();

    if(file1 === undefined || file2 === undefined || file3 === undefined){
      alert("上传信息不全");
      return;
    }

    sendData.append("idcard1", file1);
    sendData.append("idcard2", file2);
    sendData.append("business", file3);
      

    $.ajax({
      url: '/developerinfo/submitCompanyId/',
      type: "post",
      data: sendData,
      dataType:"json",
      cache: false,
      contentType: false,
      processData: false,
      success: function(res) {
          if(res.code == 200){
            repeatSubmit = true;
             $('#myModal').modal();
             
          }else{
            alert(res.message);
          }
      }
    });
  });

  $('#gosmallgame').click(function(){
    $(location).attr('href','/game/show/');
  });

});