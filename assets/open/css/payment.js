// user
var user_Boolean = false;
var password_Boolean = false;
var verify_Boolean = false;
var varconfirm_Boolean = false;
var emaile_Boolean = false;
var Mobile_Boolean = false;
$('.reg_user').blur(function(){
  if ((/^[a-z0-9_-]{4,8}$/).test($(".reg_user").val())){
    $('.user_hint').html("4-20个字符，支付中英文、数字").css("color","rgba(158,172,202,1)");
    user_Boolean = true;
  }else {
    $('.user_hint').html("请输入昵称").css("color","#EF4D57");
    user_Boolean = false;
  }
});
// password
$('.reg_password').blur(function(){
  if ((/^[a-z0-9_-]{6,16}$/).test($(".reg_password").val())){
    $('.password_hint').html("字母、数字或英文符号，最短8位，区分大小写").css("color","rgba(158,172,202,1)");
    password_Boolean = true;
  }else {
    $('.password_hint').html("请输入正确格式的密码").css("color","#EF4D57");
    password_Boolean = false;
  }
});
// verify
$('.reg_verify').blur(function(){
  if ((/^[a-z0-9_-]{6,16}$/).test($(".reg_verify").val())){
    $('.verify_hint').html("请输入验证码").css("color","rgba(158,172,202,1)");
    verify_Boolean = true;
  }else {
    $('.verify_hint').html("请输入正确的验证码").css("color","#EF4D57");
    verify_Boolean = false;
  }
});


// password_confirm
$('.reg_confirm').blur(function(){
  if (($(".reg_password").val())==($(".reg_confirm").val())){
    $('.confirm_hint').html("✔").css("color","green");
    varconfirm_Boolean = true;
  }else {
    $('.confirm_hint').html("×").css("color","red");
    varconfirm_Boolean = false;
  }
});


// Email
$('.reg_email').blur(function(){
  if ((/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/).test($(".reg_email").val())){
    $('.email_hint').html("✔").css("color","green");
    emaile_Boolean = true;
  }else {
    $('.email_hint').html("×").css("color","red");
    emaile_Boolean = false;
  }
});


// Mobile
$('.reg_mobile').blur(function(){
  if ((/^1[34578]\d{9}$/).test($(".reg_mobile").val())){
    $('.mobile_hint').html("做为登录账号").css("color","rgba(158,172,202,1)");
    Mobile_Boolean = true;
  }else {
    $('.mobile_hint').html("请输入正确的手机号").css("color","#EF4D57");
    Mobile_Boolean = false;
  }
});


// click
$('.red_button').click(function(){
  if(user_Boolean && password_Boolea && varconfirm_Boolean && emaile_Boolean && Mobile_Boolean == true){
    alert("注册成功");
  }else {
    alert("请完善信息");
  }
});


$('.switch').on('switch-change', function(e, data) { 
  // console.log()
  if(data.value) {
    $('#myModal-open').modal('show')
  } else {
    $('#myModal-close').modal('show')  
  }
})

//按钮点击删除
$('.delete').on('click', function(){
  $(".goodsPrice").val('')
  $(".model_number").val('')
  $(".goodsName").val('')
})
// 点击添加
$('.sure').on('click', function(){
  var modelNumber = $('.model_number').val() // 机型
  var mallPrice =  $('.goodsPrice').val() // 商品价格
  var goodsName = $('.goodsName').val()  // 商品名称
  //var goodsId = 

  // console.log(modelNumber)
  if($('.model_number').val() !='' && $('.goodsPrice').val() !='' && $('.goodsName').val() !='') {
    $(".card_content").append(`<div class='info_title_01 clean_up'><span>${modelNumber}</span></div><div class='info_title_01 info_title_02'><span>￥${mallPrice}</span></div><div class='info_title_01 info_title_03'><span>${goodsName}钻石</span></div><div class='info_title_01 info_title_04'><span>4</span></div>`)
  }
  $('.model_number').val('')
  $('.goodsPrice').val('')
  $('.goodsName').val('')
})
//点击按钮添加商品
$('.card_btn').on('click', function(){
  $('.addlist').show()
})