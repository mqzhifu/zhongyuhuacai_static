/*pc端菜单*/
$(function(){
	$(".nav li").click(function(){
		$(this).addClass("active").siblings("li").removeClass("active");
	});
	$(".gameList").on("click","li",function(){
		if(!$(this).children("a").is(":visible")){
			
			var this_h=parseInt($(this).children("a").attr("attr-h")),
				this_src=$(this).children("a").attr("href");
				console.log(this_h,this_src)
			if(this_h==1){
				$(".horizontalScreen").children("iframe").attr("src",this_src);
				$(".verticalScreen").children("iframe").attr("src",'');
				
				$(".verticalScreen").hide();
				$(".horizontalScreen").show();
			}else if(this_h==2){
				$(".verticalScreen").children("iframe").attr("src",this_src);
				$(".horizontalScreen").children("iframe").attr("src",'');
				
				$(".horizontalScreen").hide();
				$(".verticalScreen").show();
			}
			$(".gameWin").show();
		}
	});
	$(".gameWinClose").click(function(){
		$(".gameWin").hide();
		$(".verticalScreen,.horizontalScreen").children("iframe").attr("src",'');
	});
	$("#contact").click(function(){
		var h = $(".gameList").height();
		console.log(h)
		$(".scroll").scrollTop(h);
	});
})
/*移动端菜单*/
$(".m_navBtn").click(function(){
	$(".m_navBox").show()
});
$(".m_navBox .winBg").click(function(){
	$(".m_navBox").hide()
});
function downLoad() {
	var type=GetQueryString('from');
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if(isiOS==true){
		alert("IOS版本正在开发中，敬请期待....");
	}else{
		if(type=='h5'){
			window.open("//play.google.com/store/apps/details?id=com.kaixin.hifun");
		}else{
			window.open("//play.google.com/store/apps/details?id=com.kaixin.hifun");
		}
		
	}
}
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

var page=1;
var dateFlag=true;
var sessionDate=sessionStorage.getItem("sessionDate"),
	sessionScroll=sessionStorage.getItem("sessionScroll"),
	sessionPage;
if(!sessionDate){
	pageLoad(page);
}else{
	staticDate();
	if(!sessionDate){
		$(".scroll").scrollTop(0);
	}else{
		$(".scroll").scrollTop(parseFloat(sessionScroll));
	}
}

function checkScrollDirector() { //判断滚动条是否滑到底部  
	var flag = 0;
	sessionStorage.setItem("sessionScroll",$(".scroll").scrollTop());
	var offBottom=$(".gameList").offset().top+$(".gameList").height();
	if($(".scroll").scrollTop() + $(window).height() >= offBottom) {
		flag = 1;
	}
	return flag;
}
function findIndex(id, items) {
	for (var i in items) {
		if (items[i].id == id)
			return i;
	}
	return -1;
}
var isTest = false;
function staticDate(){
	var games = JSON.parse(sessionStorage.getItem("sessionDate"));
	for(var i = 0; i < games.length; i++) {
		var html = "<li>"+
						"<a attr-H='"+games[i].screen+"' href='"+games[i].play_url+"'></a>"+
						"<div class='gameHome' style='background-image: url("+games[i].index_reco_img+");'></div>"+
						"<div class='bottom'>"+
							"<img class='gameIcon' src="+games[i].list_img+"  />"+
							"<div class='fr'>"+
								"<p>"+games[i].name+"</p>"+
								"<span><em></em><em></em><em></em><em></em><em></em></span>"+
							"</div>"+
						"</div>"+
					"</li>"	
		$(".gameList").append(html);
	}
}
function pageLoad(page){
	var indexPage=page||1;
	$.ajax({
        type: "POST",
        url: "#HTTP_PROTOCOL#://#API_URL#/game/getList/page="+indexPage,
		dataType:"json",
        success: function(data) {
        	var games= data.msg.list;
        	var nextpage=data.msg.pageInfo.nextPage;
        	for(var i = 0; i < games.length; i++) {
        		var playUrl;
				var orient = games[i].screen == 1 ? "landscape" : "portrait";
				var gameType;
				if(games[i].url_type == 1){
					gameType = "sdk";
				}else{
					gameType = "link";
				}
				var env = isTest ? 0 : 1; 
				var urlparam = "?url="+encodeURI(games[i].play_url)+"&type="+ gameType + "&gameId="+games[i].id+"&env="+env+"&orient="+orient+"&r=20195201050";
				var protocol;
				if(games[i].play_url.indexOf("https")==0){
					protocol = "https://";
				}else{
					protocol = "http://";
				}
				
				games[i].play_url = protocol+"#STATIC_URL#/frontend/home/login.html" + urlparam;
        		var items = sessionStorage.getItem("sessionDate");
				//判断是否读取到数组
				if (!items) {
					items = [];
				}else{
					items= typeof(items)=='string'? JSON.parse(items):items;
				}
				
				var index = findIndex(games[i].id, items);
				if (index === -1) { 
					var arr=games[i];
					items.push(arr);
					sessionStorage.setItem("sessionDate",JSON.stringify(items));
				} else { //数组中存在当前选购商品
				}
				var html = "<li>"+
								"<a attr-H='"+games[i].screen+"' href='"+games[i].play_url+"'></a>"+
								"<div class='gameHome' style='background-image: url("+games[i].index_reco_img+");'></div>"+
								"<div class='bottom'>"+
									"<img class='gameIcon' src="+games[i].list_img+"  />"+
									"<div class='fr'>"+
										"<p>"+games[i].name+"</p>"+
										"<span><em></em><em></em><em></em><em></em><em></em></span>"+
									"</div>"+
								"</div>"+
							"</li>"	
				$(".gameList").append(html);
			}
        	
			if (indexPage<nextpage) {
				page=nextpage;
				sessionStorage.setItem("sessionPage",page);
				dateFlag=true;
			}else{
				sessionStorage.setItem("sessionPage",0);
			}
        }
	});
}
$(".scroll").scroll(function() { //滚动条滚动执行 	
	if(checkScrollDirector()) {
		var nextPage=parseInt(sessionStorage.getItem("sessionPage"));
		if(nextPage){
			if(dateFlag){
				dateFlag=false;
				page=sessionStorage.getItem("sessionPage");
				pageLoad(page);
			}
		}
		
		
	}
})
var resizeTimer = null;
winSize();
$(window).bind('resize', function (){
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
            console.log("窗口发生改变了哟！");
            winSize();
    },50);
});
function winSize(){
	var bodyW=document.body.clientWidth,
		bodyH=document.body.clientHeight,
		verticalH=bodyH*0.9,
		verticalW=bodyH*0.9/1.775,
		horizontalH=bodyH*0.6,
		horizontalw=bodyH*0.6*1.775;
	$(".verticalScreen").height(verticalH);
	$(".verticalScreen").width(verticalW);
	$(".horizontalScreen").height(horizontalH);
	$(".horizontalScreen").width(horizontalw);
}

function libInit(_gameId, _env, _inviteCode, _thirdType, _sharePath, _protocol){
	kaixin_gameId = _gameId;
	inviteCode = _inviteCode;
	thirdType = _thirdType;
	sharePath = _sharePath;
	env = _env;	
	guest();
}
var kaixin_domain ="#HTTP_PROTOCOL#://#API_URL#";
function guest(callback){
	request({
		url:kaixin_domain+"/login/guest/",
		success:function(res){
			res = JSON.parse(res);
			if(res.code == 200){
				guestToken = res.msg.token;
				
				if(callback){
					callback();
				}
				
				getAccessToken(guestToken, function(accessToken){
					//shareStat(2, accessToken);
				})
			}else{
				console.log("/login/guest/, err:"+res.msg);
			}
		}
	});
}
function getAccessToken(token, callback){
	request({
		url:kaixin_domain+"/sdk/getAccessToken//",
		data:{
			token: token,
			gameId: kaixin_gameId,
		},
		success:function(res){
			res = JSON.parse(res);
			if(res.code == 200){
				callback(res.msg);
				gotoGame();
			}
		}
	})
}

function getXmlhttp() {
	try{
		return new XMLHttpRequest();		
	}catch(e){
		try{
			return ActiveXobject("Msxml12.XMLHTTP");
		}catch(e){
			try{
				return ActiveXobject("Microsoft.XMLHTTP");
			}catch(failed){
				return null;
			}
		}
	}
	return null;
}

function request(obj, addHeader) {
	var args = { timeout: 5000, method:"POST", data: null, async: true, url: "",success:function() {}, error: function() {} };
	var senddata = "", xmlhttp = getXmlhttp();
	if (obj) {
		for (var p in obj) {
			args[p] = obj[p];
		}
	}
	if(args.data != null) {
		var arr = [];
		for(var p in args.data) {
			arr.push(p + "=" + encodeURIComponent(args.data[p]));
		}
		senddata = arr.join("&");
	}
	if (xmlhttp == null) {
		args.error(0, "xmlhttp is null");
		return;
	}
	if(args.method == "GET") {
		if (/\?/.test(args.url)) {
			args.url += ("&" + senddata);
		}else {
			args.url += ("?" + senddata);
		}
	}
	
	if(typeof addHeader == "undefined"){
		addHeader = false;
	}
	xmlhttp.onabort = function(e) {
		args.error(xmlhttp.status, "abort " + xmlhttp.statusText);
	}
	xmlhttp.onerror = function(e) {
		args.error(xmlhttp.status, "error " + xmlhttp.statusText);
	}
	xmlhttp.open(args.method,args.url,args.async);
	var timer = window.setTimeout(function(){
		xmlhttp.abort();
	},args.timeout);
	xmlhttp.onload = function(e) {
		window.clearTimeout(timer);
		var status=xmlhttp.status!==undefined ? xmlhttp.status:200;
		if (status===200 || status===204 || status===0){
			args.success(xmlhttp.responseText);
		}else {
			args.error(xmlhttp.status, "other " + xmlhttp.statusText);
		}
	}
	
	if(addHeader){
		var deviceType = "h5";
		var headerStr = "1.1.1|"+deviceType+"||||0|0||||||kaixin_main_app|574010011030";
		xmlhttp.setRequestHeader("http-client-data",headerStr);//http-client-data
	}
	
	if (args.method == "POST") {
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send(senddata);
	} else {
		xmlhttp.send();
	}
	
}