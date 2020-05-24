var swiper=new Swiper('.swiper-container',{
	//autoplay:4000,
	speed:300,
	loop:true,
	mousewheelControl : true,
	direction:'vertical',
	pagination:'.swiper-pagination',
	paginationClickable :true,
	nextButton:'.swiper-button-next',
	onInit:function(swiper){
		swiperAnimateCache(swiper);
		swiperAnimate(swiper);
	},
	onSlideChangeEnd:function(swiper){
		swiperAnimate(swiper);
		console.log(swiper.activeIndex);
		if(swiper.activeIndex!==1&&swiper.activeIndex!==7){
			$(".outBox").addClass("white");
		}else{
			$(".outBox").removeClass("white");
		}
		if(swiper.activeIndex==6||swiper.activeIndex===0){
			$(".white .nextPage").hide();
		}else{
			$(".white .nextPage").show();
		}
	}
})