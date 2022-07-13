/*
* @Author: Kir
* @Date:   2019-02-20 14:55:55
* @Last Modified by:   Kir
* @Last Modified time: 2019-05-31 11:24:59
*/

function registCompany(update=false) {

	// 营业执照号
	var license = $("#license").val().trimSpace();
	// 省
	var province = $("#province_selector").find("option:selected").attr('name');
	// 市
	var city = $("#city_selector").find("option:selected").attr('name');
	// 区
	var district = $("#district_selector").find("option:selected").attr('name');
	// 详细地址
	var company_addr = $("#company_addr").val().trimSpace();
	// 营业执照（图）
	var license_img = $('#file1')[0].files[0];
	// 法人名称
	var legal_person = $("#legal_person").val().trimSpace();
	// 法人身份证号
	var idcard_number = $("#idcard_number").val().trimSpace();
	// 身份证有效期（起）
	var idcard_start_date = $("#idcard_start_date").val();
	// 身份证有效期（止）
	var idcard_end_date = $("#idcard_end_date").val();
	// 身份证正面
	var idcard_1 = $('#file2')[0].files[0];
	// 身份证反面
	var idcard_2 = $('#file3')[0].files[0];
	// 联系人
	var contact = $("#contact").val().trimSpace();
	// 联系地址
	var contact_addr = $("#contact_addr").val().trimSpace();
	// 联系邮箱
	var contact_email = $("#contact_email").val().trimSpace();
	// 联系电话
	var contact_phone = $("#contact_phone").val().trimSpace();

	if (!hasText(license)  || !hasText(province) 	  ||
		!hasText(city) 	  || !hasText(district) || !hasText(company_addr) ||
		(!hasText(license_img) && update==false) )
	{
		layer.alert("请完善基础信息！");
		return;
	}
	if (!hasText(legal_person) 	  || !hasText(idcard_number) || !hasText(idcard_start_date) ||
		!hasText(idcard_end_date) || (!hasText(idcard_1)&&update==false) || (!hasText(idcard_2)&&update==false) )
	{
		layer.alert("请完善法人信息！");
		return;
	}
	if (!hasText(contact) || !hasText(contact_addr) || !hasText(contact_email) ||
		!hasText(contact_phone)) 
	{
		layer.alert("请完善联系人信息！");
		return;
	}
	
	var sendData = new FormData();
	sendData.append("type", 1); //公司
    sendData.append("license", license);
    sendData.append("province", province);
    sendData.append("city", city);
    sendData.append("district", district);
    sendData.append("company_addr_detail", company_addr);
    sendData.append("license_img", license_img);
    sendData.append("legal_person", legal_person);
    sendData.append("idcard_number", idcard_number);
    sendData.append("idcard_start_date", idcard_start_date);
    sendData.append("idcard_end_date", idcard_end_date);
    sendData.append("idcard1", idcard_1);
    sendData.append("idcard2", idcard_2);
    sendData.append("contact", contact);
    sendData.append("contact_addr", contact_addr);
    sendData.append("contact_email", contact_email);
    sendData.append("contact_phone", contact_phone);

    $.ajax({
        type: "POST",
        url: "/developer/submit/",
		data: sendData,
		dataType:"json",
		cache: false,
		contentType: false,
		processData: false,
        success: function(data) {
        	if(data.code == 200){
        		if (update) {
        			layer.alert("提交成功", 
	                    {title:'提示'}, 
	                    function(){
	                        location.reload();
	                });
        		} else {
        			$('#myModal').modal();
        		}
            }else{
                //错误信息
                layer.alert(data.message);
            }
        }

	})
}


function registPerson(update=false) {
	// 身份证号
	var idcard_number = $("#idcard_number").val().trimSpace();
	// 身份证有效期（起）
	var idcard_start_date = $("#idcard_start_date").val();
	// 身份证有效期（止）
	var idcard_end_date = $("#idcard_end_date").val();
	// 身份证正面
	var idcard_1 = $('#file2')[0].files[0];
	// 身份证反面
	var idcard_2 = $('#file3')[0].files[0];
	// 联系人
	var contact = $("#contact").val().trimSpace();
	// 联系地址
	var contact_addr = $("#contact_addr").val().trimSpace();
	// 联系邮箱
	var contact_email = $("#contact_email").val().trimSpace();
	// 联系电话
	var contact_phone = $("#contact_phone").val().trimSpace();

	if (!hasText(idcard_number) || !hasText(idcard_start_date) ||
		!hasText(idcard_end_date) || (!hasText(idcard_1)&&update==false)      || (!hasText(idcard_2)&&update==false) )
	{
		layer.alert("请完善用户信息！");
		return;
	}
	if (!hasText(contact) || !hasText(contact_addr) || !hasText(contact_email) ||
		!hasText(contact_phone)) 
	{
		layer.alert("请完善联系人信息！");
		return;
	}
	
	var sendData = new FormData();
	sendData.append("type", 2); //个人
    sendData.append("idcard_number", idcard_number);
    sendData.append("idcard_start_date", idcard_start_date);
    sendData.append("idcard_end_date", idcard_end_date);
    sendData.append("idcard1", idcard_1);
    sendData.append("idcard2", idcard_2);
    sendData.append("contact", contact);
    sendData.append("contact_addr", contact_addr);
    sendData.append("contact_email", contact_email);
    sendData.append("contact_phone", contact_phone);

    $.ajax({
        type: "POST",
        url: "/developer/submit/",
		data: sendData,
		dataType:"json",
		cache: false,
		contentType: false,
		processData: false,
        success: function(data) {
        	if(data.code == 200){
                if (update) {
        			layer.alert("提交成功", 
	                    {title:'提示'}, 
	                    function(){
	                        location.reload();
	                });
        		} else {
        			$('#myModal').modal();
        		}
            }else{
                //错误信息
                layer.alert(data.message);
            }
        }

	})
}


function uploadImg() {
	$('.identitycard1,.identitycard1-img').click(function(){
		$('#idcard_1').click();
		$("#idcard_1").on("change", function() {
		    var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
		    if (objUrl) {
		        $(".identitycard1-img").attr("src", objUrl); //将图片路径存入src中，显示出图片
		        $(".identitycard1-img").show();
		        $(".identitycard1").hide();
		    }
		});
	});

	$('.identitycard2,.identitycard2-img').click(function(){
		$('#idcard_2').click();
		$("#idcard_2").on("change", function() {
		    var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
		    if (objUrl) {
		        $(".identitycard2-img").attr("src", objUrl); //将图片路径存入src中，显示出图片
		        $(".identitycard2-img").show();
		        $(".identitycard2").hide();
		    }
		});
	});

	$('.business,.business-img').click(function(){
		$('#license-img').click();
		$("#license-img").on("change", function() {
		    var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
		    if (objUrl) {
		        $(".business-img").attr("src", objUrl); //将图片路径存入src中，显示出图片
		        $(".business-img").show();
		        $(".business").hide();
		    }
		});
	});
}

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

