(function(window) {
	var C = window.C = {
		token: "",
		timeId: "",
		name: "",
		inviteCode: ""
	};
//		C.getToken = function(notify){
//			C.token = notify;
//		}
	C.getToken = function() {
		var url = location.search; //获取url中"?"符后的字串  
  		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("=");
			theRequest = strs[1];
			C.token = theRequest;
		}
	}
	
	C.setCodeAndName = function(){
		var url = decodeURI(location.search); //获取url中"?"符后的字串  
  		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var nameIndex = url.indexOf("=");
//			var codeIndex = url.lastIndexOf("=");	
			var codeIndex = url.indexOf("&code=");
			var username = url.substring(nameIndex+1,codeIndex);
			var temp = url.substring(codeIndex+6);
			var tempIndex = temp.indexOf("&");
			var copyId = document.getElementById("copyId");
			if(tempIndex != -1){
				var code = temp.substring(0,tempIndex);
				copyId.innerText = code;
				C.inviteCode = code;
			}else{
				copyId.innerText = temp;
				C.inviteCode = temp;
			}
			C.name = username;
			var name = document.getElementById("name");
			
			var len = 0;
			for(var i = 0; i < username.length; i++) {
				var a = username.charAt(i);
				if(a.match(/[^\x00-\xff]/ig) != null) {
					len += 2;
				} else {
					len += 1;
				}
				if(len >= 12) {
					username = username.substring(0, i + 1) + "...";
					break;
				}
			}
			name.innerText =  username;
		}
		// alert(len);
	}
	
	C.setInitFontSize = function() {
		var docEl = document.documentElement,
			resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
			recalc = function() {
				docEl.style.fontSize = (docEl.clientWidth / 750) * 100 + 'px';
			};

		//绑定浏览器缩放与加载时间
		window.addEventListener(resizeEvt, recalc, false);
		document.addEventListener('DOMContentLoaded', recalc, false);
	}

	C.copyCode = function() {
		//复制邀请码功能
		var clipboard = new ClipboardJS("#copyBtn");
		var copyInfo = document.getElementById("copyInfo")
		clipboard.on("success", function(element) { //复制成功的回调
			showCopyInfo("复制成功")
			console.info("复制成功，复制内容： " + element.text);
		});
		clipboard.on("error", function(element) { //复制失败的回调
			showCopyInfo("复制失败")
			console.info(element);

		});

		var tId;

		function showCopyInfo(str) {
			copyInfo.innerText = str;
			copyInfo.style.display = "block"; //显
			if(tId) {
				clearTimeout(tId);
			}
			tId = setTimeout(function() {
				copyInfo.style.display = "none";
			}, 1000);
		}
	}

	C.setTime = function(useTime) {
		var secondTime = useTime;
		var minuteTime = 0;
		var hourTime = 0;
		if(secondTime >= 60) {
			minuteTime = Math.floor(secondTime / 60);
			secondTime = secondTime % 60;
			if(minuteTime >= 60) {
				hourTime = Math.floor(minuteTime / 60);
				minuteTime = minuteTime % 60;
			}
		}

		var h = (hourTime > 9 ? hourTime.toString() : "0" + hourTime.toString());
		var m = (minuteTime > 9 ? minuteTime.toString() : "0" + minuteTime.toString());
		var s = (secondTime > 9 ? secondTime.toString() : "0" + secondTime.toString());

		if(C.timeId) {
			clearTimeout(C.timeId);
		}

		var hours = document.getElementById("hours");
		var minutes = document.getElementById("minutes");
		var seconds = document.getElementById("seconds");
		hours.innerText = h;
		minutes.innerText = m;
		seconds.innerText = s;

		C.timeId = setTimeout(function() {
			C.setTime(useTime - 1);
		}, 1000);
	}
})(window)