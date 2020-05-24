/*
* @Author: Kir
* @Date:   2019-03-05 10:33:36
* @Last Modified by:   Kir
* @Last Modified time: 2019-04-26 15:36:30
*/

var role_dev = 2;
var role_test = 3;
var gameid = getUrlParam('gameid');

$(document).ready(function(){
	$(".cannel-add-member").click(function(){
		$(".id-input").val('');
		$("[name='error-hint']").html('');
    	$("[name='search-member-avator']").attr('src', '');
    	$("[name='search-member-name']").html('');
    	$(".btn-modal-yes.btn.btn-primary").attr('disabled','disabled');
		$(".member-modal").css("display", "none");
	});

	$("#add-dev-btn").click(function(){
		$(".member-modal").css("display", "none");
		$("#add-dev-modal").css("display", "block");
	});
	$("#add-test-btn").click(function(){
		$(".member-modal").css("display", "none");
		$("#add-test-modal").css("display", "block");
	});

	$("#add-dev-submit").click(function(){
		var uid = $("#add-dev-input").val();
		if (hasText(uid)) {
			addMemberSubmit(role_dev, uid);
		}
	});

	$("#add-test-submit").click(function(){
		var uid = $("#add-test-input").val();
		if (hasText(uid)) {
			addMemberSubmit(role_test, uid);
		}
	});

	$(".id-input").blur(function() {
		var uid = $(this).val();
		$.ajax({
			type: "GET",
	        url: "/member/searchUser/",
	        data: {addUid:uid, gameid:gameid},
	        dataType:'json',
	        success: function(data){
	        	$("[name='error-hint']").html(data.message);
	        	$("[name='search-member-avator']").attr('src', data.data.avatar);
	        	$("[name='search-member-name']").html(data.data.nickname);
	        	if (data.code == 1) {
	        		$(".btn-modal-yes.btn.btn-primary").removeAttr('disabled');
	        	}
	        }
		})
	});

	$(".dev-del").click(function() {
		uid = $(this).attr('id');
		nickname = $(this).attr('name');
		var msg="确认要删除开发者 "+nickname+" 吗？";
		layer.confirm(msg,{
			title:'提示'
			},function(index){
				delMemberSubmit(uid);
				layer.close(index);
			},function(index){
				layer.close(index);
		});
	})

	$(".test-del").click(function() {
		uid = $(this).attr('id');
		nickname = $(this).attr('name');
		var msg="确认要删除测试者 "+nickname+" 吗？";

		layer.confirm(msg,{
			title:'提示'
			},function(index){
				delMemberSubmit(uid);
				layer.close(index);
			},function(index){
				layer.close(index);
		});
	})

});


function addMemberSubmit(role, uid) {
	$.ajax({
		type: "POST",
        url: "/member/addMember/",
        data: {role:role, addUid:uid, gameid:gameid},
        dataType:'json',
        success: function(data){
        	if (data.code == 1) {
        		layer.alert(data.message, 
                    {title:'提示'}, 
                    function(){
                        location.reload();
                });
        	}
        }
	});
}

function delMemberSubmit(uid) {
	$.ajax({
		type: "GET",
        url: "/member/delMember/",
        data: {delUid:uid, gameid:gameid},
        dataType:'json',
        success: function(data){
        	if (data.code == 1) {
        		layer.alert(data.message, 
                    {title:'提示'}, 
                    function(){
                        location.reload();
                });
        	}
        }
	})
}

function hasText (val) {
	if (val == '' || val == undefined || val == null) {
		return false;
	}
	return true;
}

function getUrlParam(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}
