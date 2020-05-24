(function(window) {
	var TH = window.TH = {
		//		doGoldcoinCarnival: "http://is-api.kaixin001.com/user/lottery/doGoldcoinCarnival/token=",
		doGoldcoinCarnival: "lottery/doGoldcoinCarnival/token=",
		goldcoinCarnivalInfo: "lottery/goldcoinCarnivalInfo/token=",
		goldInfo: "bank/getGoldcoinInfo/token=",
		carnivalLog: "lottery/goldcoinCarnivalLog/token=",
		bulletin: "lottery/goldcoinCarnivalBulletin/token="
	};

	TH.getCarnivalInfo = function(token) {
		G.req({
			url: G.preUrl + TH.goldcoinCarnivalInfo + token + "&r=" + Math.random(),
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					var turnNums = document.getElementsByClassName("turnNumsDiv")[0];
					if(res.msg.isFree == 1) {
						T.isFree = 1;
						turnNums.innerText = "免费次数:1"
						turnNums.style.display = "block";
					} else {
						T.isFree = 2;
						turnNums.style.display = "none";
					}
					setMultiplePro(res.msg.multiple, res.msg.multipleTimes);
				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}

	function setMultiplePro(multiple, times) { //翻几倍  还有几次翻倍数
//		T.multiple = multiple;
		var proDynamic = document.getElementsByClassName("proDynamic")[0];
		var nums2 = document.getElementsByClassName("num2")[0];
		var nums5 = document.getElementsByClassName("num5")[0];
		var nums10 = document.getElementsByClassName("num10")[0];
		var nums20 = document.getElementsByClassName("num20")[0];
		var mul2 = document.getElementsByClassName("mulDyn2")[0];
		var mul5 = document.getElementsByClassName("mulDyn5")[0];
		var mul10 = document.getElementsByClassName("mulDyn10")[0];
		var mul20 = document.getElementsByClassName("mulDyn20")[0];
		document.getElementById("nums").innerText = times;
		document.getElementById("mul").innerText = multiple;
		var startTxt = document.getElementsByClassName("startTxt")[0]; 
		switch(multiple) {
			case 0:
				nums2.style.color = "#999999";
				nums5.style.color = "#999999";
				nums10.style.color = "#999999";
				nums20.style.color = "#999999";
				mul2.style.display = "block";
				mul5.style.display = "block";
				mul10.style.display = "block";
				mul20.style.display = "block";
				proDynamic.style.width = (85 + (1 - times)) / 86 * 100 + "%";
				T.multiple = 20;
				T.multipleTimes = 85 + (1 - times);
				break
			case 2:
				proDynamic.style.width = (5 - times) / 86 * 100  + "%";
				nums2.style.color =
					nums5.style.color =
					nums10.style.color =
					nums20.style.color = "#D7063B";
				mul2.style.display =
					mul5.style.display =
					mul10.style.display =
					mul20.style.display = "none";
				T.multiple = 1;
				T.multipleTimes = 5 - times;
				break;
			case 5:
				nums2.style.color = "#999999";
				mul2.style.display = "block";
				proDynamic.style.width = (5 + (10 - times)) / 86 * 100  + "%";
				T.multiple = 2;
				T.multipleTimes = 5 + (10 - times);
				break;
			case 10:
				nums2.style.color = "#999999";
				nums5.style.color = "#999999";
				mul2.style.display = "block";
				mul5.style.display = "block";
				proDynamic.style.width = (15 + (20 - times)) / 86 * 100  + "%";
				T.multiple = 5;
				T.multipleTimes = 15 + (20 - times);
				break;
			case 20:
				nums2.style.color = "#999999";
				nums5.style.color = "#999999";
				nums10.style.color = "#999999";
				mul2.style.display = "block";
				mul5.style.display = "block";
				mul10.style.display = "block";
				proDynamic.style.width = (35 + (50 - times)) / 86 * 100  + "%";
				T.multiple = 10;
				T.multipleTimes = 35 + (50 - times);
				break;
			default:
				break;
		}
		if(T.multipleTimes == 5 ||T.multipleTimes == 15 ||T.multipleTimes == 35 ||T.multipleTimes == 85  ){
			startTxt.innerText = "翻" + T.multiple + "倍";
		}else{
			startTxt.innerText = "开 始";
		}
	}

	TH.turn = function(token) {
		G.req({
			url: G.preUrl + TH.doGoldcoinCarnival + token + "&r=" + Math.random(),
			success: function(resJson) {
//				alert(resJson)
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				var gold = parseInt(res.msg);
				if(res.code == 200 && gold) {
					if(T.multipleTimes == 5){
						T.turnIndex = 5;
					}else if(T.multipleTimes == 15){
						T.turnIndex = 1;
					}else if(T.multipleTimes == 35){
						T.turnIndex = 3;
					}else if(T.multipleTimes == 85){
						T.turnIndex = 3;
					}else{
						switch(gold) {
							case 40:
								T.turnIndex = 3;
								break;
							case 120:
								T.turnIndex = 1;
								break;
							case 200:
								T.turnIndex = 5;
								break;
							case 400:
								T.turnIndex = 7;
								break;
							default:
								break;
						}
					}
					T.coinNums = res.msg;
					var startDiv = document.getElementsByClassName("startDiv")[0];
					startDiv.setAttribute("onclick", "");
					T.start();
				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}

	TH.getGoldInfo = function(token,isRestart) {
		G.req({
			url: G.preUrl + TH.goldInfo + token + "&r=" + Math.random(),
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					var myCoin = document.getElementById("myCoin");
					myCoin.innerText = "我的金币数:" + res.msg.total;
					T.goldNums = parseInt(res.msg.total);
					var startDiv = document.getElementsByClassName("startDiv")[0];
					var startTxt = document.getElementsByClassName("startTxt")[0]; 
					if(T.goldNums>=100||T.isFree==1){
						if(isRestart){
							TH.turn(C.token);
							startDiv.setAttribute("onclick", "");
						}else{
							startDiv.style.backgroundImage = "url(img/turntable/startDivBg.png)";
							startTxt.style.color = "#A61715";
							startDiv.setAttribute("onclick", "start()");
						}
					}else{
						if(isRestart){
							turnable.showToast("金币不足");//调用安卓的方法
						}
						startDiv.style.backgroundImage = "url(img/turntable/noStart.png)";
						startTxt.style.color = "#666666";
						startDiv.setAttribute("onclick", "");
					}
				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}

	TH.getCarnivalLog = function(token) {
		G.req({
			url: G.preUrl + TH.carnivalLog + token + "&r=" + Math.random(),
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					T.createList(res.msg);
				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}

	TH.getBulletin = function(token) {
		G.req({
			url: G.preUrl + TH.bulletin + token + "&r=" + Math.random(),
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					T.createBulletin(res.msg);
				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
})(window)