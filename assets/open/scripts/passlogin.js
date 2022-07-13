/*
* @Author: Kir
* @Date:   2019-04-15 14:48:12
* @Last Modified by:   zhengtian
* @Last Modified time: 2019-05-28 14:10:52
*/

$(function () {
    $(".login_button").click(function () {
        var phone = $("#phone").val().trimSpace();
        if (!phone) {
        	layer.alert("请输入手机号");
        	return;
        }
        var ps = $("#ps").val();
        if (!ps) {
        	layer.alert("请输入密码");
        	return;
        }
        var url = "/index/login/?cellphone=" + phone + "&password=" + ps;
        $.ajax({
            type: 'GET',
            url: url,
            success: function (data) {
                var d = eval("(" + data + ")");
                if (200 != d.code) {
                    layer.alert(d.msg);
                } else {
                    location.href = "/game/show/";
                }
            }
        });
    });
});