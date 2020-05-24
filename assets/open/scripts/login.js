var Login = function () {

	var handleLogin = function () {
		$('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input

            invalidHandler: function (event, validator) { //display error alert on form submit
            	$('.alert-danger', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs
            	$(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
                },

                success: function (label) {
                	label.closest('.form-group').removeClass('has-error');
                	label.remove();
                },

                errorPlacement: function (error, element) {
                	error.insertAfter(element.closest('.input-icon'));
                },

                submitHandler: function (form) {
                	var cellphone = $("#cellphone").val();
                	var password = $("#password").val();
                	var code = $("#code").val();
                	var url = "/index/login/?cellphone=" + cellphone;
                	if (password) {
                		url += "&password=" + password;
                	} else {
                		url += "&code=" + code;
                	}
                	$.ajax({
                		type: 'GET',
                		url: url,
                		success: function (data) {
                			var d = eval("(" + data + ")");
                        // var d = eval("("+data+")");
                        if (200 != d.code) {
                        	$('#errormsg').html(d.msg);
                        } else {
                        	location.href = "/game/show/";
                        }
                    }
                });
                //form.submit();
            }
        });

		$("#smsbtn").click(function () {
			getVerifyCode()
		});
	};

	var getVerifyCode = function () {
		var resetSms = function () {
			$("#smsbtn").html("获取验证码");
			$("#smsbtn").css("cursor", "pointer");
			$("#smsbtn").css("background-color", "#FEC34D");
		};

		var resendSms = function (num) {
			$("#smsbtn").html("重发验证码(" + num + ")");
			$("#smsbtn").css("cursor", "text");
			$("#smsbtn").css("background-color", "#D7D7D7");
		}
		
		var canSend = true;

		if (!canSend) {
			return;
		}
		var cellphone = $("#cellphone").val();
		if (!cellphone) {
			$('#errormsg').html("请输入手机号");
			return;
		}

		$('#errormsg').html("");
		canSend = false;
		var num = 60;
		resendSms(num);
		var secondRetry = setInterval(function () {
			num--;
			if (num == 0) {
				canSend = true;
				resetSms();
				clearInterval(secondRetry);
			}
			else{
				resendSms(num);
			}
		}, 1000);

		var url = "/index/sendsms/?cellphone=" + cellphone;
		$.ajax({
			type: 'GET',
			url: url,
			success: function (data) {
				var d = eval( "(" + data+ ")" );
                if(200 != d.code){
                	var msg = d.msg;
                    canSend = true;
                    if (d.code == 503){
                        msg = "请输入正确的手机号";
                    }
                    $('#errormsg').html(msg);
                    resetSms();
                    clearInterval(secondRetry);
                }
            }
        });
	}

	return {
        //main function to initiate the module
        init: function () {
        	handleLogin();
        },
        getVerify: function () {
        	getVerifyCode();
        }
    };

}();