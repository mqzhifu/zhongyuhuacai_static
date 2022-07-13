(function(window) {
	var C = window.C = {
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
	//匹配动态效果
	var initMatchId = 0;
	C.init = function() {
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
			C.slideshow2.style.left = isShow ? "8rem" : "9rem";
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
window.onload=function(){
	var 
		aImg=document.getElementsByClassName('flash'),
		aAttr=['top','left','opacity','width','height','zIndex'],
		oTarget=[];
	for(var i=0;i<aImg.length;i++){
		oAttr=[];
		for(var j=0;j<aAttr.length;j++){
			if(aAttr[j]==='opacity'){
				oAttr[aAttr[j]]=parseFloat(getStyle(aImg[i],aAttr[j])*100);
			}else{
				oAttr[aAttr[j]]=parseInt(getStyle(aImg[i],aAttr[j]));
			}
		}
		oTarget.push(oAttr);
	}
	setInterval(function(){
		oTarget.push(oTarget.shift());
		for(var i=0;i<aImg.length;i++)
		{
			timeMove(aImg[i],oTarget[i],Tween.Linear,300);
		}
	},3000);
	/*$(window).resize(function(){
		window.location.reload();
	})*/
	function getStyle(obj,sAttr){
		if(obj.currentStyle){
			return obj.currentStyle[sAttr];
		}else{
			return getComputedStyle(obj,null)[sAttr];
		}
	}
}