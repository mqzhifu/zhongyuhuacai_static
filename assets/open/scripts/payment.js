
var getUrlParam = function getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    }
//按钮点击删除

$(document).ready(function(){
  
$('.delete').on('click', function(){
  $(".goodsPrice").val('')
  $(".model_number").val('')
  $(".goodsName").val('')
  $('.addlist').hide();
})
// 点击添加
$('.sure').on('click', function(){
  var modelNumber = $('.model_number').val() // 机型
  var mallPrice =  $('.goodsPrice').val() // 商品价格
  var goodsName = $('.goodsName').val()  // 商品名称
  //var goodsId = 
  
  if($('.model_number').val() !='' && $('.goodsPrice').val() !='' && $('.goodsName').val() !='') {
    var formdata = new FormData();
    formdata.append('gameid', getUrlParam('gameid'));
    formdata.append('ios_type', modelNumber);
    formdata.append('price', mallPrice);
    formdata.append('goods_name', goodsName);
    $.ajax({
            url: '/payment/addGoodsItem/',
            type: "post",
            data: formdata,
            dataType:"json",
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                if(data.code == 1){

                  $(".card_content").append(`<div class='info_title_01 clean_up'><span>${modelNumber}</span></div><div class='info_title_01 info_title_02'><span>￥${mallPrice}</span></div><div class='info_title_01 info_title_03'><span>${goodsName}</span></div><div class='info_title_01 info_title_04'><span>${data.data}</span></div>`)
                  
                  $('.model_number').val('')
                  $('.goodsPrice').val('')
                  $('.goodsName').val('')
                }else{
                  layer.alert(data.message);
                }
            }
        });
  }
  
  // console.log(modelNumber)
  
})
//点击按钮添加商品
$('.card_btn').on('click', function(){
  $('.addlist').show();
})
});