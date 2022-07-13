(function(window) {
	var C = window.C = {
		star1: "",
		star2: "",
		star3: "",
		star4: "",
		star5: "",
		starIndex: 1,
		slideshow: "",
		imgs: "", //得到图片们
		fonts: "",
		current: -1, //current为当前活跃的图片编号
		slideshow2: "",
		imgs2: "", //得到图片们
		fonts2: "",
		//		current2: 0, //current为当前活跃的图片编号
		match1: "",
		match2: "",
		matchTxt: ""
	};

	C.createName = function(index) {
		var name = "";
		switch(index) {
			case 1:
				name = "吖莉";
				break;
			case 2:
				name = "邓云峰峰峰";
				break;
			case 3:
				name = "阿青青青";
				break;
			case 4:
				name = "不优雅先生";
				break;
			case 5:
				name = "艾米丽洋";
				break;
			case 6:
				name = "画画的张旺";
				break;
			case 7:
				name = "安小琪";
				break;
			case 8:
				name = "屌丝男士";
				break;
			case 9:
				name = "楚月";
				break;
			case 10:
				name = "叫我木村拓哉";
				break;
			case 11:
				name = "格子迷妹儿";
				break;
			case 12:
				name = "魏思澄";
				break;
			case 13:
				name = "桂林邱淑贞";
				break;
			case 14:
				name = "李凌波";
				break;
			case 15:
				name = "叫我蛋蛋";
				break;
			case 16:
				name = "凌凌OVO";
				break;
			case 17:
				name = "柠檬水";
				break;
			case 18:
				name = "王润泽";
				break;
			case 19:
				name = "少女美芽";
				break;
			case 20:
				name = "艺术大亨";
				break;
			default:
				break;
		}
		return name;
	}

	//	C.slideShow = function() {
	//		var timeId = 0;
	//		index = C.current;
	//		index2 = C.current2;
	//
	//		function slideOff() {
	//			C.imgs[index].className = ""; //图片淡出
	//			C.fonts[index].className = "";
	//			C.imgs2[index2].className = ""; //图片淡出
	//			C.fonts2[index2].className = "";
	//		}
	//
	//		function slideOn() {
	//			C.imgs[index].className = "active"; //图片淡入
	//			C.fonts[index].className = "nameActive";
	//			C.imgs2[index2].className = "active"; //图片淡入
	//			C.fonts2[index2].className = "nameActive";
	//		}
	//
	//		function normalSlide() {
	//			C.imgs[random].style.transform = "scale(1)";
	//			C.imgs[random].style.webkitTransform = "scale(1)";
	//			C.imgs2[random].style.transform = "scale(1)";
	//			C.imgs2[random].style.webkitTransform = "scale(1)";
	//			clearInterval(slideon);
	//			clearTimeout(timeId);
	//		}
	//
	//		function changeSlide() { //切换图片的函数
	//			if(index >= random) {
	//				C.imgs[random].style.transform = "scale(1.1)";
	//				C.imgs[random].style.webkitTransform = "scale(1.1)";
	//				C.imgs2[random].style.transform = "scale(1.1)";
	//				C.imgs2[random].style.webkitTransform = "scale(1.1)";
	//				timeId = setTimeout(normalSlide, 500);
	//				C.slideMatch();
	//			} else {
	//				slideOff();
	//				index++; //自增1
	//				index2++; //自增1
	//				slideOn();
	//			}
	//
	//		} //每2s调用changeSlide函数进行图片轮播
	//		var slideon = setInterval(changeSlide, 1000);
	//
	//	}
	//
	//	var initId = 0;
	//	C.slideMatch = function() {
	//		C.match1.style.visibility = C.match2.style.visibility = "visible";
	//		C.match1.className = 'match1 matchImgAni1';
	//		C.match2.className = 'match2 matchImgAni1';
	//		C.matchTxt.visibility = "visible";
	//		
	//		initId = setTimeout(function(){
	//			C.match1.style.visibility = C.match2.style.visibility = "hidden";
	//			C.match1.style.left = C.match2.style.left = "3rem";
	//			C.match1.className = C.match2.className = '';
	//			C.matchTxt.visibility = "hidden";
	//			C.imgs[random].className = C.imgs2[random].className = "";
	//			C.fonts[random].className = C.fonts2[random].className = "";
	//			C.imgs[0].className = C.imgs2[0].className = "active";
	//			C.fonts[0].className = C.fonts2[0].className = "nameActive";
	//			C.setRandom();
	//		},5000);
	//	}
	//
	//	var random = 0;
	//
	//	C.setRandom = function() {
	//		random = Math.floor(Math.random() * 17) + 3;
	//		C.slideShow();
	//	}
	function play(docl) {
		docl.style.display = "block";
		docl.src = "http://mgres.kaixin001.com.cn/xyx/static/frondend/OfficialWebsite/img/star.gif";
//		docl.src = "http://mgres.kaixin001.com.cn/xyx/static/frondend/OfficialWebsite/img/star.gif?r="+Math.random();
//		docl.src = "img/star.gif";
	}

	function stop(docl) {
		docl.style.display = "none";
		docl.src = "http://mgres.kaixin001.com.cn/xyx/static/frondend/OfficialWebsite/img/star1.png";
//		docl.src = "http://mgres.kaixin001.com.cn/xyx/static/frondend/OfficialWebsite/img/star1.png?r="+Math.random();
	}

	C.startStar = function() {
		if(C.starIndex > 5){
			return;
		}

		switch(C.starIndex) {
			case 1:
				play(C.star1);
				break;
			case 2:
				play(C.star2);
				break;
			case 3:
				play(C.star3);
				break;
			case 4:
				play(C.star4);
				break;
			case 5:
				play(C.star5);
				break;
			default:
				break;
		}

		setTimeout(C.startStar, 300);

		C.starIndex++;
		
//		setTimeout(stopStar, 610);
	}

	function stopStar() {
		switch(C.starIndex) {
			case 1:
				stop(C.star1);
				break;
			case 2:
				stop(C.star2);
				break;
			case 3:
				stop(C.star3);
				break;
			case 4:
				stop(C.star4);
				break;
			case 5:
				stop(C.star5);
				break;
			default:
				break;
		}
	}

	//匹配动态效果
	var initMatchId = 0;
	C.init = function() {
		C.star1 = document.getElementsByClassName("star1")[0];
		C.star2 = document.getElementsByClassName("star2")[0];
		C.star3 = document.getElementsByClassName("star3")[0];
		C.star4 = document.getElementsByClassName("star4")[0];
		C.star5 = document.getElementsByClassName("star5")[0];
		//		C.star1.stop();

		C.startStar();

		C.slideshow = document.getElementById("user1");
		C.imgs = C.slideshow.getElementsByTagName("img"); //得到图片们
		C.fonts = C.slideshow.getElementsByTagName("font");
		C.current = -1; //current为当前活跃的图片编号
		C.slideshow2 = document.getElementById("user2");
		C.imgs2 = C.slideshow2.getElementsByTagName("img"); //得到图片们
		C.fonts2 = C.slideshow2.getElementsByTagName("font");
		C.current2 = 0; //current为当前活跃的图片编号
		C.match1 = document.getElementsByClassName("match1")[0];
		C.match2 = document.getElementsByClassName("match2")[0];
		C.matchTxt = document.getElementsByClassName("matchTxt")[0];
		//		C.setRandom();
		initMatchId = setTimeout(C.showMatch(true), 5000);
	}

	var setSlideId = 0;
	var stopMatchId = 0;
	C.showMatch = function(isShow) {
		if(isShow) {
			C.current++;
			C.current = C.current > 3 ? 0 : C.current;
		}
		C.matchTxt.style.visibility = "hidden";
		C.match1.style.opacity = "0";
		C.imgs[C.current].className = C.imgs2[C.current].className = "active";
		C.fonts[C.current].className = C.fonts2[C.current].className = "nameActive";
		C.slideshow.style.opacity = C.slideshow2.style.opacity = isShow ? "0" : "1";
		C.slideshow.style.left = isShow ? "1rem" : "2.2rem";
		C.slideshow2.style.left = isShow ? "8.2rem" : "7rem";

		C.slideshow.className = isShow ? "user1Ani" : "user1Ani2";
		C.slideshow2.className = isShow ? "user2Ani" : "user2Ani2";

		setSlideId = setTimeout(function() {
			C.slideshow.style.opacity = C.slideshow2.style.opacity = isShow ? "1" : "0";
			C.slideshow.style.left = isShow ? "2.2rem" : "1rem";
			C.slideshow2.style.left = isShow ? "7rem" : "8.2rem";
			clearTimeout(setSlideId);
		}, 900);

		stopMatchId = setTimeout(function() {
			C.stopMatch(isShow);
		}, 1200);

		clearTimeout(initMatchId);
	}

	C.stopMatch = function(isShow) {
		C.matchTxt.style.visibility = isShow ? "visible" : "hidden";
		C.slideshow.className = C.slideshow2.className = "";
		C.match1.style.visibility = C.match2.style.visibility = isShow ? "visible" : "hidden";
		C.match1.className = isShow ? 'match1 matchImgAni1' : "";
		C.match2.className = isShow ? 'match2 matchImgAni1' : "";

		if(isShow){
			initImgId = setTimeout(function() {
				C.match1.style.left = "1rem"
				C.match2.style.left = "7rem";
				C.match1.style.opacity = C.match2.style.opacity = "1";
			
				clearTimeout(initImgId);
			}, 800);
		}

		initId = setTimeout(function() {
			C.imgs[C.current].className = C.imgs2[C.current].className = "";
			C.fonts[C.current].className = C.fonts2[C.current].className = "";
			C.matchTxt.style.visibility = isShow ? "hidden" : "visible";
			C.match1.style.visibility = C.match2.style.visibility = isShow ? "hidden" : "visible";
			C.match1.style.left = C.match2.style.left = "3rem";
			C.match1.className = C.match2.className = '';
			C.match1.style.opacity = C.match2.style.opacity = "0";

			C.showMatch(!isShow);
			clearTimeout(initId);
		}, (isShow ? 3000 : 800));
		clearTimeout(stopMatchId);
	}

})(window)