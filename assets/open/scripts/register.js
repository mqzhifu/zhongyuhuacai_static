var show_num = [];
$(function () {
    draw(show_num);//加载验证码
    //看不清楚重新获取验证码
    $("#canvas").on('click', function () {
        draw(show_num);
    });
 
    $(".red_button").click(function () {
        if (!check()) {
            return;
        }
        var phone = $("#phone").val().trimSpace();
        var code = $("#smsCode").val();
        var ps = $("#ps").val();
        var psAgain = $("#psAgain").val();
        if (!ps) {
            layer.alert("请输入密码");
            return;
        }
        if (!psAgain) {
            layer.alert("请输入确认密码");
            return;
        }
        if (ps != psAgain) {
            layer.alert("两次密码输入不一致");
            return;
        }
        $.ajax({
            url:"/register/register/",
            type: "POST",
            data: {
                phone:phone,
                verifyCode:code,
                ps:ps
            },
            dataType:"json",
            success:function(res){
                if (res.code==200) {
                    $(location).attr('href', '/developer/company/');
                } else {
                    layer.alert(res.message);
                }
            }
        });
    });
});
 
function draw(show_num) {
    var canvas_width = $('#canvas').width();
    var canvas_height = $('#canvas').height();
    var canvas = document.getElementById("canvas");//获取到canvas的对象，演员
    var context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    var sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
    var aCode = sCode.split(",");
    var aLength = aCode.length;//获取到数组的长度
 
    for (var i = 0; i <= 3; i++) {
        var j = Math.floor(Math.random() * aLength);//获取到随机的索引值
        var deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
        var txt = aCode[j];//得到随机的一个内容
        show_num[i] = txt.toLowerCase();
        var x = 10 + i * 20;//文字在canvas上的x坐标
        var y = 20 + Math.random() * 8;//文字在canvas上的y坐标
        context.font = "bold 23px 微软雅黑";
        context.translate(x, y);
        context.rotate(deg);
        context.fillStyle = randomColor();
        context.fillText(txt, 0, 0);
        context.rotate(-deg);
        context.translate(-x, -y);
    }
    for (var i = 0; i <= 5; i++) { //验证码上显示线条
        context.strokeStyle = randomColor();
        context.beginPath();
        context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.stroke();
    }
    for (var i = 0; i <= 30; i++) { //验证码上显示小点
            context.strokeStyle = randomColor();
            context.beginPath();
            var x = Math.random() * canvas_width;
            var y = Math.random() * canvas_height;
            context.moveTo(x, y);
            context.lineTo(x + 1, y + 1);
            context.stroke();
        }
        console.log(show_num);
    }
 
    function randomColor() {//得到随机的颜色值
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    /*return "rgb(" + r + "," + g + "," + b + ")";*/
    return "#0a0afe";
}
function check() {
    var val = $(".input-code").val().toLowerCase();
    var num = show_num.join("");
 
    if (val == "") {
        layer.alert("请输入验证码");
        return false;
    } else if (val != num) {
        layer.alert('验证码错误！请重新输入！'); 
        return false;
    }
    
    return true;
}

$(function(){
	$(".yzmBtn").click(function(){
        var thisIndex = this;
        var phone = $("#phone").val().trimSpace();
        if (!phone) {
            layer.alert("请输入手机号");
            return;
        }
        if (!check()) {
            return;
        }
		
        $.ajax({
            type:'post',
            dataType:"json",
            url:"/register/sendSms/",
            data:{
                phone:$('#phone').val().trimSpace(),
            },
            success:function(res){
                if (res.code!=200) {
                    layer.alert(res.message);
                } else {
                    invokeSettime(thisIndex);
                }
            }
        });
	});
})

function invokeSettime(obj) {
	var countdown = 60;
	$(obj).addClass("disabled");
	settime(obj);
	function settime(obj) {
		if(countdown == 0) {
			$(obj).attr("disabled", false);
			$(obj).removeClass("disabled");
			$(obj).text("获取验证码");
			countdown = 60;
			return;
		} else {
			$(obj).attr("disabled", true);
			$(obj).text(countdown + "s后重新发送");
			countdown--;
		}
		setTimeout(function() {
			settime(obj);
		}, 1000)
	}
}