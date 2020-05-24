(function(window) {
	var G = window.G = {
		preUrl: "#HTTP_PROTOCOL#://#API_URL#/",
		//by wdy
		//		getUserUrl: "http://is-api.kaixin001.com/user/getOne/token=",
		//		incomeTotalUrl: "http://is-api.kaixin001.com/invite/incomeTotal/token=",
		//		myFriUrl: "http://is-api.kaixin001.com/invite/incomeLog/token="
		getUserUrl: "user/getOne/token=",
		incomeTotalUrl: "invite/incomeTotal/token=",
		myFriUrl: "invite/incomeLog/token=",
		inviteLog: "index/cntLog/?token=",
		tokenL: "",
	};
	function getXmlhttp() {
		try {
			return new XMLHttpRequest();
		} catch(e) {
			try {
				return ActiveXobject("Msxml12.XMLHTTP");
			} catch(e) {
				try {
					return ActiveXobject("Microsoft.XMLHTTP");
				} catch(failed) {
					return null;
				}
			}
		}
		return null;
	}

	G.req = function(obj) {
		var args = {
			timeout: 30000,
			method: "POST",
			data: null,
			async: true,
			crossDomain: true,
			url: "",
			success: function() {},
			error: function() {}
		};
		var senddata = "",
			xmlhttp = getXmlhttp();
		if(obj) {
			for(var p in obj) {
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
		if(xmlhttp == null) {
			args.error(0, "xmlhttp is null");
			return;
		}
		if(args.method == "GET") {
			if(/\?/.test(args.url)) {
				args.url += ("&" + senddata);
			} else {
				args.url += ("?" + senddata);
			}
		}
		xmlhttp.open(args.method, args.url, args.async);
		var overtime = false;
		var timer = window.setTimeout(function() {
			xmlhttp.abort();
		}, args.timeout);
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState == 4) {
				window.clearTimeout(timer);
				if(xmlhttp.status == 200) {
					args.success(xmlhttp.responseText);
				} else {
					args.error(xmlhttp.status, "request fail");
				}
			}
		}
		if(args.method == "POST") {
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send(senddata);
		} else {
			xmlhttp.send();
		}

	}

	G.incomeTotal = function(token) {
		G.getUser(token);
		G.req({
			url: G.preUrl + G.incomeTotalUrl + token + "&r=" + Math.random(),
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					var myFri = document.getElementById("myFri");
					var people = res.msg.people;
					if(people == 0) {
						myFri.style.display = "none";
					} else {
						G.getHead(token, people);
						var peopleEle = document.getElementById("friendNums");
						var incomeEle = document.getElementById("getMoney");
						var budgetEle = document.getElementById("allMoney");
						var budget = res.msg.budget;
						myFri.style.display = "block";
						peopleEle.innerText = people;
						incomeEle.innerText = res.msg.income;
						budgetEle.innerText = budget;
					}
				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
	
	G.getUser = function(token) {
		G.req({
			url: G.preUrl + G.getUserUrl + token + "&r=" + Math.random(),
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					var copyId = document.getElementById("copyId");
					copyId.innerText = res.msg.invite_code;
				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}

	G.getHead = function(token, people) {
		G.req({
			url: G.preUrl + G.myFriUrl + token + "&r=" + Math.random(),
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					var img1 = document.getElementById("fri1");
					var img2 = document.getElementById("fri2");
					var img3 = document.getElementById("fri3");
					var txt = document.getElementById("income");
					if(people == 1) {
						img1.style.display = "block";
						if(res.msg[0]) {
							img1.src = res.msg[0].avatar
						};
						/*txt.style.width = "50%";
						txt.style.marginLeft = txt.style.marginRight = "30%";*/
					} else if(people == 2) {
						img1.style.display = "block";
						img2.style.display = "block";
						if(res.msg[0]) {
							img1.src = res.msg[0].avatar
						};
						if(res.msg[1]) {
							img2.src = res.msg[1].avatar
						};
						/*txt.style.width = "60%";
						txt.style.marginLeft = txt.style.marginRight = "29%";*/
					} else {
						img1.style.display = "block";
						img2.style.display = "block";
						img3.style.display = "block";
						if(res.msg[0]) {
							img1.src = res.msg[0].avatar;
						}
						if(res.msg[1]) {
							img2.src = res.msg[1].avatar;
						}
						if(res.msg[2]) {
							img3.src = res.msg[2].avatar;
						}
						/*txt.style.width = "70%";
						txt.style.marginLeft = txt.style.marginRight = "27%";*/
					}
				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}

	G.myfriends = function(token) {
		console.log(G.myFriUrl + token);
		G.req({
			url: G.preUrl + G.myFriUrl + token + "&r=" + Math.random(),
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					for(var i = 0; i < res.msg.length; i++) {
						/*var name = document.getElementById("namep");
						var incom = document.getElementById('getnump');

						var lll = [
							['大猫02150', 1],
							['大狗', 30],
							['肥龙', 1],
							['小花', 1],
							['阿飞', 1],
							['至尊宝', 1],
							['花木兰', 1],
							['ddaadd', 1],
							['阿波罗飞船ss', 1],
							['huhu', 1]
						];

						for(var i = 0; i < lll.length; i++) {*/

						var income = res.msg[i].income;
						var headin = res.msg[i].avatar;
						//var name = lll[i][0];
						//var income = lll[i][1];
						var head = document.createElement("img");
						head.setAttribute('id', 'head');
						head.setAttribute('onerror', "this.src='img/touxiang.jpg'");
						if(res.msg[i].nickname) {
							var name = res.msg[i].nickname;
						} else {
							var name ='没名字';
						}
						var len = 0;
						for(var j = 0; j < name.length; j++) {
							var a = name.charAt(j);
							if(a.match(/[^\x00-\xff]/ig) != null) {
								len += 2;
							} else {
								len += 1;
							}
							if(len > 8) {
								name = name.substring(0, j + 1) + "...";
								break;
							}
						}
						head.src = './img/touxiang.jpg';
						if(headin) {
							head.src = headin;
						}

						var namep = document.createTextNode(name);

						//var nump = document.createTextNode(income);

						var button = document.createElement("button");
						button.setAttribute('id', 'buttonf');
						button.textContent = '提醒好友';
						button.onclick = function() {
							invite.showWindow();
						};
						var nump = document.createElement("font");
						nump.setAttribute('id', 'gmoney')
						nump.textContent = income+'元';

						var iconImg = document.createElement("img");
							iconImg.setAttribute('src', './img/friends_icon.png');
						var canget = document.createTextNode('30元');

						var img = document.createTextNode('已得全部奖励');

						var para = document.createElement("div");
						para.setAttribute('id', 'aaa');
						var para1 = document.createElement("span");
						para1.setAttribute('id', 'one');
						var para3 = document.createElement("span");
						para3.setAttribute('id', 'three');
						var para2 = document.createElement("span");
						para2.setAttribute('id', 'two');
						var para4 = document.createElement("span");
						para4.setAttribute('id', 'four');
						var para5 = document.createElement("span");
						para5.setAttribute('id', 'ouu');
						para5.style.display = 'none';
						if(income == 30) {
							button.style.display = 'none';
							para5.style.display = 'block';
						}
						//para.setAttribute('id','listi');
						para1.appendChild(head);

						para3.appendChild(namep);
						/*para2.appendChild(iconImg);*/
						para2.appendChild(nump);
						

						para4.appendChild(button);
						para4.appendChild(para5);
						para5.appendChild(img);
						var element = document.getElementById("listitem1");
						//var element1 = document.getElementById("namep");
						para.appendChild(para1);
						para.appendChild(para3);
						para.appendChild(para2);
						para.appendChild(para4);
						element.appendChild(para);

					}
				}
			},
			error: function() {
				console.log("report error!");

			}
		});
	}
	G.incomeT = function(token) {
		G.req({
			url: G.preUrl + G.incomeTotalUrl + token + "&r=" + Math.random(),
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					var people = res.msg.people;
					var income = res.msg.income;
					var budget = res.msg.budget;

					var myfriendn = document.getElementById("pnumber");
					var incomenum = document.getElementById("innumber");
					var zaitunum = document.getElementById("znumber");
					myfriendn.innerHTML = people;
					incomenum.innerHTML = income;
					//zaitunum.innerHTML = budget;

				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
	G.token=function(){
		
		G.req({
			url: G.preUrl +"login/guest/",
			success: function(resJson) {
				resJson=JSON.parse(resJson);
				sessionStorage.setItem("tokenL",resJson.msg.token);
				//console.log(resJson.msg.token);
				G.getInviteLog();
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
	G.landDown=function(){
		var token=sessionStorage.getItem("tokenL");
		G.req({
			url: G.preUrl +"index/cntLog/?token=" + token + "&type=2&category=1",
			success: function(resJson) {
				console.log('success');
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
	G.getInviteLog = function() {
		var token=sessionStorage.getItem("tokenL");
		G.req({
			url: G.preUrl + G.inviteLog + token + "&type=1&category=1",
			success: function(res) {
				console.log("report success!", res);
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
	G.invite = function(token) {
		console.log(token)
		G.req({
			url: G.preUrl + G.inviteLog + token + "&type=3&category=1",
			success: function(res) {
				console.log("report success!", res);
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
	G.wxShare=function(Sur){
		var Sur=Sur;
		console.log(Sur);
		G.req({
			url: G.preUrl + "wxopen/getJsapiConfig/?url=" + Sur,
			success: function(res) {
				res=JSON.parse(res);
				if(res.code == 200 && res.msg){
					res.msg=JSON.parse(res.msg);
					res.msg.url=decodeURIComponent(res.msg.url);
					console.log(res.msg.url)
					wx.config({
					　 debug: false, 
					　　appId: res.msg.appId,
					　　timestamp: res.msg.timestamp,
					　　nonceStr: res.msg.nonceStr,
					　　signature: res.msg.signature,
					　　jsApiList: [ "updateAppMessageShareData","updateTimelineShareData"]
					});
					wx.ready(function(){
				        wx.updateAppMessageShareData({ 
					        title: '你有一个红包待领取', 
					        desc: '开心玩赚小游戏 随时随地交朋友 快来和我一起吧~', 
					        link: res.msg.url, 
					        imgUrl: 'https://mgres.kaixin001.com.cn/xyxnew/pro/static/frontend/FunGameInvites/img/ic_launcher.png', 
					        success: function () {
					          
					        }
					    })
				        wx.updateTimelineShareData({ 
					        title: '你有一个红包待领取', 
					        link: res.msg.url, 
					        imgUrl: 'https://mgres.kaixin001.com.cn/xyxnew/pro/static/frontend/FunGameInvites/img/ic_launcher.png',
					        success: function () {
					          
					        }
					    })
				 	});
				}
				
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
})(window)