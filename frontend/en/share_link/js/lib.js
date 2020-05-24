
var kaixin_domain;
var kaixin_sdk_domain;
var kaixin_gameId;

var env = 0;
var guestToken;
var thirdType;//4:微信.6:facebook.9:qq, 31:公众号授权, google:7
var inviteCode;//邀请码
var sharePath;//分享路径

//需要缓存的数据
var platform_token;//平台token
var third_openId;//第三方唯一id
var third_unionId;//第三方unionId
var third_nickname;//第三方用户名
var third_avatar;//第三方用户头像

function libInit(_gameId, _env, _inviteCode, _thirdType, _sharePath, _protocol){
	kaixin_gameId = _gameId;
	inviteCode = _inviteCode;
	thirdType = _thirdType;
	sharePath = _sharePath;
	
	env = _env;
// 	if(_env == 0){
// 		//测试环境
// 		kaixin_domain = _protocol+"://hifunapi-test.kaixin001.com/";
// 		kaixin_sdk_domain = _protocol+"://hifunsdk-test.kaixin001.com/";
// 	}else{
// 		//正式环境
// 		kaixin_domain = _protocol+"://hifunapi.kaixin001.com/";
// 		kaixin_sdk_domain = _protocol+"://hifunsdk.kaixin001.com";
// 	}
	kaixin_domain = _protocol +"://#API_URL#/";
	kaixin_sdk_domain = _protocol + "://#SDK_URL#/"

	platform_token = getLocalStorage("platform_token_os");
	third_openId = getLocalStorage("third_openId");
	third_unionId = getLocalStorage("third_unionId");
	
	setLoginVisibel(false);
	
	
	if(platform_token && platform_token != ""){
		//已经登陆过，直接getOne
		getOne();
		return;
	}
	getGameCover();
	if(thirdType){
		//三方登陆返回的地址，facebook:6, google:7
		var code = getQueryString("code");
		
		if(thirdType == 6){
			//facebook登陆
			
		}else if(thirdType == 7){
			//google登陆
			
		}
	}else{
		//不是三方回调
		thirdAuth();
	}
}

function thirdAuth(){
	guest(function(){
		setLoginVisibel(true);
	})
}

/*
* 本地存储
*/
function setLocalStorage(key, value){
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem(key, value);
	}
}

function getLocalStorage(key){
	if (typeof(Storage) !== "undefined") {
		return localStorage.getItem(key);
	}
}

//xmlhttp
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



function initGoogle(){
	gapi.load('auth2', function(){
	  auth2 = gapi.auth2.init({
		client_id: '538117998596-k37vbis15cmjr631ifmnu4ri7k230sec.apps.googleusercontent.com', //客户端ID
		cookiepolicy: 'single_host_origin',
		scope: 'profile' 
	  });
	  attachSignin(document.getElementById('googleBtn'));
	});

}


//google
function attachSignin(element) {
	auth2.attachClickHandler(element, {},
	function(googleUser) {
		var profile = auth2.currentUser.get().getBasicProfile();
// 		console.log('ID: ' + profile.getId());
// 		console.log('Full Name: ' + profile.getName());
// 		console.log('Given Name: ' + profile.getGivenName());
// 		console.log('Family Name: ' + profile.getFamilyName());
// 		console.log('Image URL: ' + profile.getImageUrl());
// 		console.log('Email: ' + profile.getEmail());
		third_openId = profile.getId();
		third_nickname = profile.getName();
		third_avatar = profile.getImageUrl();
		
		setLocalStorage("third_openId",third_openId);
		setLocalStorage("third_nickname",third_nickname);
		setLocalStorage("third_avatar",third_avatar);
		
		thirdType = 7;
		thirdLogin();
		
	}, function(error) {
	  console.log(JSON.stringify(error, undefined, 2));
	  setLoginVisibel(true);
	});
}

//获得游客token
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
					shareStat(2, accessToken);
				})
			}else{
				console.log("/login/guest/, err:"+res.msg);
			}
		}
	});
}

//缓存登陆
function sessionLogin(){
	if(third_openId){
		thirdLogin();
	}
}

//平台第三方登陆、注册
function thirdLogin(){
	var type = thirdType;
	
	request({
		url:kaixin_domain+"/login/third/",
		data:{
			type: type,
			uniqueId: third_openId,
			nickname: third_nickname,
			avatar:third_avatar,
			token: guestToken
		},
		success:function(res){
			res = JSON.parse(res);
			if(res.code == 200){
				platform_token = res.msg.token;
				setLocalStorage("platform_token_os", platform_token);

				getOne();
			}
		}
	})

}

//获取用户信息
function getOne(){
	request({
		url:kaixin_domain+"/user/getOne/",
		data:{
			token: platform_token
		},
		success:function(res){
			res = JSON.parse(res);
			if(res.code == 200){
				var uid = res.msg.uid;
				var invite_uid = res.msg.invite_uid;
				if(parseInt(invite_uid) <=0){
					//设置邀请码
					setInviteCode();
				}
				//飞豆登陆统计
				loginReport("576610011009", 5766, 462, "s7jLbFqigCCp7jgzbHSD", uid);
				
				setLoginVisibel(false);
				//显示游戏
				gotoGame();
				showGameCover(false,"");
				
				getAccessToken(platform_token, function(accessToken){
					shareStat(1, accessToken);
				})
				
			}else{
				if(isPlatformTokenValid(res.code)){
					//平台token失效，重新认证或登录
					
					platform_token = "";
					setLocalStorage("platform_token", '')
					thirdAuth();
				}
			}
		}
	})
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
			}
		}
	})
}

//设置邀请码
function setInviteCode(){
	if(!inviteCode || inviteCode == "null") return;
	request({
		url:kaixin_domain+"/invite/setUserCode/",
		data:{
			token: platform_token,
			code: inviteCode
		},
		success:function(res){
			res = JSON.parse(res);
			if(res.code == 200){
				console.log("set invite code success");
			}else{
				console.log("setInviteCode fail,code:"+res.code);
			}
		}
	}, true)
}

function isHaveThirdId(){
	if(third_openId != "undefined" && third_unionId != "undefined"){
		return true;
	}
	return false;
}


//平台汇报
var G = window.G = {
	regurl: "https://api.heyshell.com/client.thirdreg.php",
	loginurl:"https://api.heyshell.com/local.login.php",
	reporturl:"https://api.heyshell.com/client.starts.php",
	getIpUrl:"https://api.heyshell.com/client.getdata.php"
};

G.ipAdd = "127.0.0.1";
/*
* 平台汇报
*/
function loginReport(p_fValue, p_gameid, p_serverId, reportKey, uid){
	G.fValue = p_fValue;
	G.gameId = p_gameid;
	G.serverId = p_serverId;
	G.reportKey = reportKey;

	
	G.playerId = uid;

	var date = new Date();
	timestamps = parseInt(date.getTime()/1000);

	request({
		url:G.getIpUrl,
		data:{
			timestamp:timestamps,
			ip:"127.0.0.1",
			f:p_fValue,
			gameid:p_gameid,
			type:"ip"
		},
		success:function(res){
			console.log("getIp:" + res);
			G.ipAdd = res.split(":")[1];
			reg(regOk);
		},
		error:function(res){
			console.log("getIp error:"+res);

			reg(regOk);
		}

	})

	

	function loginOk(){
		date = new Date();
		timestamps = parseInt(date.getTime()/1000);

		request({
			url:G.reporturl,
			data:{
				timestamp:timestamps,
				ip:G.ipAdd,
				f:G.fValue,
				gameid:G.gameId,
				device:"",
				devicetype:getOsType(),
				deviceversion:"",
				deviceudid:G.playerId,
				devicemac:"",
				deviceidfa:"",
				appversion:"1.0.0"
			},
			success:function(){
				console.log("report success!");
			},
			error:function(){
				console.log("report error!");
			}
		});
	}

	function regOk(username, pwd){
		login(username, pwd, loginOk);
	}

}

function reg(callback){
	var date = new Date();
	var timestamps = parseInt(date.getTime()/1000);
	request({
		url:G.regurl,
		data:{
			timestamp:timestamps,
			f:G.fValue,
			thirdaccount:G.playerId.toString(),
			backinfo:"",
			device:"",
			devicetype:"",
			deviceversion:"",
			deviceudid:"",
			devicemac:"",
			deviceidfa:"",
			appversion:"1.0.0",
			appsflyerid:"",
			ip:G.ipAdd,
			gameid:parseInt(G.gameId)
		},
		success:function(res){
			var resArr = res.split(":");
			if(resArr[0] == "ok"){
				var username = resArr[2];
				var pwd = resArr[3];

				callback(username, pwd);
			}else{
				console.log("feidou reg error code:" + resArr[1]);
			}
		},
		error:function(err){
			console.log("feidou reg error:" + err);
		}
	})
}

function login(p_username, p_pwd, callback){
	var date = new Date();
	var timestamps = parseInt(date.getTime()/1000);
	var key = G.reportKey;
	var _sign = hex_md5(timestamps+p_username+G.ipAdd+G.gameId+G.serverId+p_pwd+"1"+key);

	request({
		url:G.loginurl,
		data:{
			timestamp:timestamps,
			username:p_username,
			ip:G.ipAdd,
			gameid:G.gameId,
			serverid:G.serverId,
			password:p_pwd,
			logintype:1,
			sign:_sign
		},
		success:function(res){
			var resArr = res.split(":");
			if(resArr[0] == "ok"){
				console.log("登陆成功"+res);
				callback();
			}else{
				console.log("feidou login error code:"+resArr[1]);
			}
		},
		error:function(err){
			console.log("feidou login err:"+err);
		}
	})
}

//分享统计
//type, 1:登录， 2：点击, 3:下载
function shareStat(type, accessToken){
	if(!sharePath) return;
	var tempToken;
	if(type == 2){
		tempToken = guestToken;
	}else{
		tempToken = platform_token;
	}
	
	request({
		url:kaixin_domain+"/sdk/cntShareCount/",
		data:{
			token:tempToken,
			accessToken:accessToken,
			gameId:kaixin_gameId,
			sharePath:sharePath,
			type:type
		},
		success:function(res){
			console.log("share state success");
		},
		error:function(err){
			console.log("cntShareCount:"+err);
		}
	})
}

//平台token无效
function isPlatformTokenValid(code){
	
	if(code == 8105 || code == 8109 || code == 8230 || code == 8231 || code == 8232 || code == 1002){
		return true;
	}
	
	return false;
}

function isPc(){
	var os = function (){
		var ua = navigator.userAgent,
		isWindowsPhone = /(?:Windows Phone)/.test(ua),
		isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
		isAndroid = /(?:Android)/.test(ua),
		isFireFox = /(?:Firefox)/.test(ua),
		isChrome = /(?:Chrome|CriOS)/.test(ua),
		isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
		isPhone = /(?:iPhone)/.test(ua) && !isTablet,
		isPc = !isPhone && !isAndroid && !isSymbian;
		return {
			isTablet: isTablet,
			isPhone: isPhone,
			isAndroid: isAndroid,
			isPc: isPc
		};
	}();
	
	if(os.isPc){
		return true;
	}
	return false;
}

//获取手机系统
function getOsType(){
	var _osType = "unknown";
	var curHref = window.location.href;
	if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
		_osType = "ios";
	}else if(/(Android)/i.test(navigator.userAgent)){
		_osType = "android";
	}

	return _osType;
}

//md5

var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

window.fbAsyncInit = function() {
	FB.init({
	  appId      : '390469844894868',
	  cookie     : true,  // enable cookies to allow the server to access 
						  // the session
	  xfbml      : true,  // parse social plugins on this page
	  version    : 'v3.3' // The Graph API version to use for the call
	});

  };

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  
//  function fbLogin(){
//  	FB.getLoginStatus(function(response) {
//  		if(response.status == "connected"){
//  			statusChangeCallback(response);
//  		}else{
//  			FB.login(function(response) {
// 				statusChangeCallback(response);
//  			});
//  		}
//  	});
//  }

function fbLogin(){
	FB.login(function(response){
		statusChangeCallback(response);
	});
}
 
 function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
 
 function fbLogout(){
	FB.api(
	  '/me/permissions',
	  'DELETE',
	  {},
	  function(response) {
		  console.log("delete permission");
	  }
	);
 }
 
 function statusChangeCallback(response) {
 	if (response.status === 'connected') {
 	  third_openId = response.authResponse.userID;
 	  setLocalStorage("third_openId", third_openId);
 	  FB.api('/me', {fields: 'picture.type(large),name'}, function(response) {
 		  console.log('Successful login for: ' + response.name);
 		  
 		  third_nickname = response.name;
 		  third_avatar = response.picture.data.url;
 		  setLocalStorage("third_nickname", third_nickname);
 		  setLocalStorage("third_avatar", third_avatar);
 		  
 		  thirdType = 6;
 		  thirdLogin();
 		});
 	  
 	} else {
 	  setLoginVisibel(true);
 	}
 }
 
 
 ///google
 function initGoogle(){

 	gapi.load('auth2', function(){
 	  auth2 = gapi.auth2.init({
 		client_id: '538117998596-u8vso1uetk0t6l5168rsv0e0vo4mn2lu.apps.googleusercontent.com', //客户端ID
 		cookiepolicy: 'single_host_origin',
 		scope: 'profile' 
 	  });
 	  attachSignin(document.getElementById('googleBtn'));
 	});
 
 }


 function attachSignin(element) {
 	auth2.attachClickHandler(element, {},
 	function(googleUser) {
 		var profile = auth2.currentUser.get().getBasicProfile();
 		third_openId = profile.getId();
 		third_nickname = profile.getName();
 		third_avatar = profile.getImageUrl();
 		
 		setLocalStorage("third_openId",third_openId);
 		setLocalStorage("third_nickname",third_nickname);
 		setLocalStorage("third_avatar",third_avatar);
 		
 		thirdType = 7;
 		thirdLogin();
 		
 	}, function(error) {
 	  console.log(JSON.stringify(error, undefined, 2));
 	  setLoginVisibel(true);
 	});
 }
 
 function googleLogout(){
	 var auth2;
	 if(!gapi.auth2){
		gapi.load('auth2', function() {
			auth2 = gapi.auth2.getAuthInstance();
			auth2.disconnect();
		});
	 }else{
		 auth2 = gapi.auth2.getAuthInstance();
		 auth2.disconnect();
	 }
	
 }
 
 function getGameCover(){
	request({
		url:kaixin_domain+"/login/guest/",
		success:function(res){
			res = JSON.parse(res);
			if(res.code == 200){
				var tempToken = res.msg.token;
				
				request({
				 	url:kaixin_domain+"/game/getGameInfo/",
				 	data:{
				 		token:tempToken,
				 		gameid:kaixin_gameId
				 	},
				 	success:function(res){
				 		var resObj = JSON.parse(res);
						showGameCover(true, resObj.msg.index_reco_img);
				 	},
				 	error:function(err){
				 		console.log("cntShareCount:"+err);
				 	}
				 })
			}else{
				console.log("/login/guest/, err:"+res.msg);
			}
		}
	});
 }