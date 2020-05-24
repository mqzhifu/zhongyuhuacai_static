// user
var user_Boolean = false;
var password_Boolean = false;
var verify_Boolean = false;
var varconfirm_Boolean = false;
var emaile_Boolean = false;
var Mobile_Boolean = false;


$('.reg_user').blur(function(){
  if ((/^1[34578]\d{9}$/).test($(".reg_user").val())){
    $('.user_hint').html("请填写联系人电话").css("color","rgba(158,172,202,1)");
    user_Boolean = true;
  }else {
    $('.user_hint').html("请输入正确格式的联系人电话").css("color","#EF4D57");
    user_Boolean = false;
  }
});
// password
$('.reg_password').blur(function(){
  if ((/^[a-z0-9_-]{6,16}$/).test($(".reg_password").val())){
    $('.password_hint').html("请填写联系人").css("color","rgba(158,172,202,1)");
    password_Boolean = true;
  }else {
    $('.password_hint').html("请输入正确格式的联系人").css("color","#EF4D57");
    password_Boolean = false;
  }
});
// verify
$('.reg_verify').blur(function(){
  if ((/^[a-z0-9_-]{6,16}$/).test($(".reg_verify").val())){
    $('.verify_hint').html("请填写联系地址").css("color","rgba(158,172,202,1)");
    verify_Boolean = true;
  }else {
    $('.verify_hint').html("请输入正确的联系地址").css("color","#EF4D57");
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
    $('.mobile_hint').html("请填写公司名称").css("color","rgba(158,172,202,1)");
    Mobile_Boolean = true;
  }else {
    $('.mobile_hint').html("请输入正确的公司名称").css("color","#EF4D57");
    Mobile_Boolean = false;
  }
});


// // click
// $('.red_button').click(function(){
//   if(user_Boolean && password_Boolea && varconfirm_Boolean && emaile_Boolean && Mobile_Boolean == true){
//     alert("注册成功");
//   }else {
//     alert("请完善信息");
//   }
// });
