(function(window) {
	var T = window.T = {
		index: 0,
		turnIndex: 0, //服务器返回的中奖索引
		turnAni: "",
		multiple: 1,
		isFree: 1,
		multipleTimes: 0,
		coinNums: 0,
		goldNums: 0
	};

	T.getElements = function() {
		var head = document.getElementsByTagName('head')[0];
		T.turnAni = document.createElement('style');
		head.appendChild(T.turnAni);
	}

	T.createBulletin = function(arr) {
		var area = $("#coinLi");
		area[0].innerHTML = "";
		for(var i = 0; i < arr.length; i++) {
			var li = document.createElement("li");
			var name = arr[i].nickname;
			var len = 0;
			for(var j = 0; name&&j < name.length; j++) {
				var a = name.charAt(j);
				if(a.match(/[^\x00-\xff]/ig) != null) {
					len += 2;
				} else {
					len += 1;
				}
				if(len >= 10) {
					name = name.substring(0, j + 1) + "...";
					break;
				}
			}

			li.innerHTML = "恭喜 " + "<font color='#FFE100'>" + name + "</font> 获得 " +
				"<font color='#FFE100'>" + arr[i].reward + "</font>";
			area[0].appendChild(li);
		}
		area[0].innerHTML += area[0].innerHTML;

		var top = area.scrollTop();
		var intervalId = 0;
		function scroll() {
			if(top >= area[0].scrollHeight / 2) {
				top = 0;
				area.scrollTop(top);
			} else {
				area.scrollTop(++top);
			}
			clearInterval(intervalId);
			intervalId = setInterval(scroll, 50);
		}
		intervalId = setInterval(scroll, 50);
	}

	T.createTurn = function() {
		var turnCon = document.getElementById("turnCon");
		for(var i = 0; i < 9; i++) {
			var turndiv = document.createElement("div");
			if(i == 4) {
				turndiv.setAttribute("class", "startDiv");
				//				turndiv.setAttribute("onclick", "start()");
			} else {
				turndiv.setAttribute("class", "turnDiv");
			}
			turnCon.appendChild(turndiv);
			switch(i) {
				case 0:
					var turn1 = document.createElement("div");
					turn1.setAttribute("class", "moneyDiv");
					turndiv.appendChild(turn1);
					turn1.innerText = "1元";
					var turn2 = document.createElement("div");
					turn2.setAttribute("class", "turnTxt");
					turndiv.appendChild(turn2);
					turn2.innerText = "1元现金";
					break;
				case 1:
					var turn1 = document.createElement("div");
					turn1.setAttribute("class", "coinDiv1");
					turndiv.appendChild(turn1);
					var turn2 = document.createElement("div");
					turn2.setAttribute("class", "turnTxt");
					turndiv.appendChild(turn2);
					turn2.innerText = "120金币";
					break;
				case 2:
					var turn1 = document.createElement("div");
					turn1.setAttribute("class", "phoneDiv");
					turndiv.appendChild(turn1);
					var turn2 = document.createElement("div");
					turn2.setAttribute("class", "turnTxt");
					turndiv.appendChild(turn2);
					turn2.innerText = "iPhoneXS";
					break;
				case 3:
					var turn1 = document.createElement("div");
					turn1.setAttribute("class", "coinDiv2");
					turndiv.appendChild(turn1);
					var turn2 = document.createElement("div");
					turn2.setAttribute("class", "turnTxt");
					turndiv.appendChild(turn2);
					turn2.style.marginTop = "-0.15rem";
					turn2.innerText = "400金币";
					break;
				case 4:
					var start = document.createElement("div");
					start.setAttribute("class", "startTxt");
					start.innerText = "开 始";
					turndiv.appendChild(start);
					var turnNums = document.createElement("div");
					turnNums.setAttribute("class", "turnNumsDiv");
					turnNums.innerText = "免费次数:1";
					turndiv.appendChild(turnNums);
					break;
				case 5:
					var turn1 = document.createElement("div");
					turn1.setAttribute("class", "coinDiv3");
					turndiv.appendChild(turn1);
					var turn2 = document.createElement("div");
					turn2.setAttribute("class", "turnTxt");
					turndiv.appendChild(turn2);
					turn2.innerText = "40金币";
					break;
				case 6:
					var turn1 = document.createElement("div");
					turn1.setAttribute("class", "moneyDiv");
					turndiv.appendChild(turn1);
					turn1.innerText = "5元";
					var turn2 = document.createElement("div");
					turn2.setAttribute("class", "turnTxt");
					turndiv.appendChild(turn2);
					turn2.innerText = "5元现金";
					break;
				case 7:
					var turn1 = document.createElement("div");
					turn1.setAttribute("class", "coinDiv4");
					turndiv.appendChild(turn1);
					var turn2 = document.createElement("div");
					turn2.setAttribute("class", "turnTxt");
					turndiv.appendChild(turn2);
					turn2.innerText = "200金币";
					break;
				case 8:
					var turn1 = document.createElement("div");
					turn1.setAttribute("class", "moneyDiv");
					turndiv.appendChild(turn1);
					turn1.innerText = "2元";
					var turn2 = document.createElement("div");
					turn2.setAttribute("class", "turnTxt");
					turndiv.appendChild(turn2);
					turn2.innerText = "2元现金";
					break;
				default:
					break;
			}
		}
	}

	T.start = function() {
		var select = document.getElementById("selectDiv");
		select.style.left = T.getSelectLeft() + "rem";
		select.style.top = T.getSelectTop(false) + "rem";

		T.turnAni.innerHTML =
			'@keyframes turn1{' +
			'0%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			'12.5%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			'25%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			'37.5%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			'50%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			'62.5%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			'75%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			'87.5%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			'100%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(false) + 'rem;' +
			'}' +
			'}';
		select.style.animation = '500ms turn1 linear 3';
		select.addEventListener('animationend', slowlyHandler)

		console.log(T.turnAni.innerHTML);
	}

	function slowlyHandler() {
		var select = document.getElementById("selectDiv");
		select.removeEventListener('animationend', slowlyHandler);
		select.style.animation = '';
		var maxNum = 8 + (T.index >= T.turnIndex ? (8 - T.index + T.turnIndex) : (T.turnIndex - T.index));
		var nums = Math.floor(100 / (maxNum));
		T.turnAni.innerHTML =
			'@keyframes turn2{' +
			'0%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			nums + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			(2 * nums) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			(3 * nums) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			(4 * nums) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			(5 * nums) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			(6 * nums) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			(7 * nums) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			(8 * nums) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(true) + 'rem;' +
			'}' +
			(9 < maxNum ? 9 * nums : 100) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(9 < maxNum ? true : false) + 'rem;' +
			'}' +
			(10 < maxNum ? 10 * nums : 100) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(10 < maxNum ? true : false) + 'rem;' +
			'}' +
			(11 < maxNum ? 11 * nums : 100) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(11 < maxNum ? true : false) + 'rem;' +
			'}' +
			(12 < maxNum ? 12 * nums : 100) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(12 < maxNum ? true : false) + 'rem;' +
			'}' +
			(13 < maxNum ? 13 * nums : 100) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(13 < maxNum ? true : false) + 'rem;' +
			'}' +
			(14 < maxNum ? 14 * nums : 100) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(14 < maxNum ? true : false) + 'rem;' +
			'}' +
			(15 < maxNum ? 15 * nums : 100) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(15 < maxNum ? true : false) + 'rem;' +
			'}' +
			(16 < maxNum ? 16 * nums : 100) + '%{' +
			'left: ' + T.getSelectLeft() + 'rem;' +
			'top: ' + T.getSelectTop(16 < maxNum ? true : false) + 'rem;' +
			'}' +
			'}';
		select.style.animation = '2s turn2 linear';
		select.addEventListener('animationend', endHandler);

		console.log(T.turnAni.innerHTML);
	}

	function endHandler() {
//		alert(T.index + ":" + T.turnIndex);
		var select = document.getElementById("selectDiv");
		select.removeEventListener('animationend', endHandler);
		T.index = T.turnIndex;
		select.style.left = T.getSelectLeft() + "rem";
		select.style.top = T.getSelectTop(false) + "rem";
		var mul = 0;
		if(T.multipleTimes == 5 || T.multipleTimes == 15||T.multipleTimes == 35 || T.multipleTimes == 85){
			mul = T.multiple;
		}else{
			mul = 1;
		}
		turnable.settlement((T.coinNums/mul),mul);//调用安卓的方法
	}

	T.getSelectLeft = function() {
		var left = 0;
		switch(T.index) {
			case 0:
			case 6:
			case 7:
				left = 0.05;
				break;
			case 1:
			case 5:
				left = 1.92;
				break;
			case 2:
			case 3:
			case 4:
				left = 3.79;
				break;
			default:
				break;
		}
		return left;
	}

	T.getSelectTop = function(isTurn) {
		var top = 0;
		switch(T.index) {
			case 0:
			case 1:
			case 2:
				top = -0;
				break;
			case 3:
			case 7:
				top = 1.25;
				break;
			case 4:
			case 5:
			case 6:
				top = 2.5;
				break;
			default:
				break;
		}
		if(isTurn) setIndex();
		return top;
		J
	}

	function setIndex() {
		T.index++;
		T.index = (T.index > 7 ? 0 : T.index);
	}

	T.createList = function(arr) {
		var list = document.getElementById("exchangeList");
		list.innerHTML = "";
		for(var i = 0; i < arr.length; i++) {
			var lidiv = document.createElement("div");
			lidiv.setAttribute("class", "liDiv");
			list.appendChild(lidiv);
			var ex1 = document.createElement("div");
			ex1.setAttribute("class", "exCoin" + (arr[i].reward_goldcoin>400?400:arr[i].reward_goldcoin));
			lidiv.appendChild(ex1);
			var ex2 = document.createElement("div");
			ex2.setAttribute("class", "exTxt");
			lidiv.appendChild(ex2);
			ex2.innerText = arr[i].reward_goldcoin + "金币";
		}
	}

})(window)