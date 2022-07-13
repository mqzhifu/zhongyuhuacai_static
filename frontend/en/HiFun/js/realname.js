(function(window) {
	var R = window.R = {
		shoujiyanzheng: "https://is-api.kaixin001.com/userSafe/bindcellphone/cellphone=",
		shenfenxinxi: "https://is-api.kaixin001.com/userSafe/addReadIdAuth/",
		fasongduanxin:"https://is-api.kaixin001.com/system/sendSMS/cellphone=",
		yonghuxinxi:"https://is-api.kaixin001.com/user/getOne/toUid=&token=",
		qushenfenjiaoyan:"https://is-api.kaixin001.com/userSafe/isReadIdAuth/token=",

		//weixin:"https://is-test.feidou.com/login/third/"
		
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
	
	R.req = function(obj) {
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
//			var ceshi1 = document.getElementById('ceshi'); 
//			ceshi1.innerText=senddata;
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send(senddata);	   	  
		} else {
			xmlhttp.send();
		}

	}

	//手机号码验证
	function upperCase(){
        var phone = document.getElementsByName('shouji')[0].value;
        if(!phone){ 
        	tip('请输入手机号码')
        }
        else if(!(/^1[34578]\d{9}$/.test(phone))){ 
        

            tip("手机号码有误");  

            return false; 

        } 
        else{
        	return phone;
        	
        }
	}  
	
    var usertoken=null;
    R.getToken=function(token){
    	usertoken=token;
    }
    //发送验证码
	R.faxinxi = function(phone) {
		R.req({
			url: R.fasongduanxin +phone +"&ruleId=2&",
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					alert('发送成功')
			}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
  //发送验证码60s重发
       window.onload=function(){
                var button=document.getElementById("yanzheng");
                button.innerText="获取验证码";
                var timer=null;
                button.onclick=function(){
                	if(upperCase()){
                	var phone =upperCase();
                    R.faxinxi(phone);
                    clearInterval(timer);//这句话至关重要
                    var time=60;
                    timer=setInterval(function(){
                        console.log(time);
                        if(time<=0){
                            button.innerText="";
                            button.innerText="重新获取";
                            button.disabled=false;
                             button.style.color='#D7073B'
                             button.style.border = '0px solid #D7073B';
                            
                            
                        }else {
                        	 button.style.border = '0px solid ##666666';
                             button.style.color='##666666';
                            button.disabled=true;
                            button.innerText="";
                            button.innerText=(time)+"s";
                            time--;
                        }
                    },1000);
                }}
            }
       
         //提交验证码进行绑定
          R.tijiao1=function(){
          if(upperCase()){
            var phone = document.getElementsByName('shouji')[0].value;
            phone;
            var yanzhengma = document.getElementsByName('yanzhengxinxi')[0].value; 
      
             
            R.req({
				url: R.shoujiyanzheng +phone +"&smsCode="+yanzhengma+"&token="+usertoken+'&',
				success: function(resJson) {
					var res = JSON.parse(resJson);
					console.log("report success!", res);
					if(res.code == 200 && res.msg) {
		      		    bangdingjieguo('duigou','手机号绑定成功')
					}
					else if(res.code == 8276){
						tip('手机号已经被绑定')
					}
					else{
						tip('验证码不正确')
					}
				},
				error: function() {
					console.log("report error!");
				}
			
			});
        }}
          //身份证实名认证
        R.tijiao2=function(){
        	closeBox();
             
            var zsname = document.getElementsByName('zsname')[0].value;
            var shenfenzheng = document.getElementsByName('shenfenzhenghao')[0].value; 
           
             
        
            R.req({
			url: R.shenfenxinxi,
             //url:R.weixin,
			data:{idNo:shenfenzheng,realName:zsname,token:usertoken},
			//data:{nickname: "风月",sex: 1,token: "sre6YoCIxJOGqY6YfrWp2bOGvWl-o3Rx",type: 4,uniqueId: "oGngI5xLqIM88M3hVlxEAluDLspM",wxHeadImgUrl: "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKs2cCU7EBKlV9ibic5KicyicSkHwoNpS4JNmWOQkEEOGDdvrGsY1twz0lVylK1ACEfH7nQVxUIBAicj9Q/132"},
      
			success: function(resJson) {
				alert(resJson)
				var res = JSON.parse(resJson);
				console.log("report success!", res);
			
	        	
				if(res.code == 200 && res.msg) {
					bangdingjieguo('duigou','实名绑定成功')
				}else{
					bangdingjieguo('bacha','您输入的证件信息有误，请重新输入');
				}
			},
			error: function() {
//					var ceshi1 = document.getElementById('ceshi'); 
//			       ceshi1.innerText='report error';
				console.log("report error!");
			}
		});
    }
        
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
 /*点击弹出按钮*/
   popBox= function() {
   	 var name = document.getElementsByName('zsname')[0].value;
     var shenfenzheng = document.getElementsByName('shenfenzhenghao')[0].value;
      alert(R.shimingjiaoyan(shenfenzheng));
     if(name==""){
     	tip('真实姓名不能为空');
     }
     else if(shenfenzheng==""){
     	tip('身份证号码不能为空');
     }
    else if(!xingmingyanzheng(name)){
    	tip('请输入正确的姓名')
    }
     else if(!R.shimingjiaoyan(shenfenzheng)){
        		tip('您输入的身份信息有误');
        	}
     else{
     	alert(name);
        var popBox = document.getElementById("popBox");
        var popLayer = document.getElementById("popLayer");
        popBox.style.display = "block";
        
         var text=document.getElementById("xinxis");
         text.innerText=name;
          var text1=document.getElementById("shenfens");
          text1.innerText=shenfenzheng;
          popLayer.style.display = "block";
   
   }};
 
    /*点击关闭按钮*/
   closeBox= function() {
        var popBox = document.getElementById("popBox");
        var popLayer = document.getElementById("popLayer");
        popBox.style.display = "none";
        popLayer.style.display = "none";
   }
     closeBox1= function() {
        var neitong=document.getElementById("cuoduitishi"); 
        var popBox = document.getElementById("shimingjieguo");
        var popLayer = document.getElementById("popLayer");
        popBox.style.display = "none";
        popLayer.style.display = "none";
        R.getyonghuxinxi(usertoken);
        R.ifshenfenzheng(usertoken);
//      if(neitong.innerText=='手机号绑定成功'){
//         location.reload();
//        }
    }
   //飘字提示
   tip=function(show){
   	  var text1=document.getElementById("piaozitishi");
   	    text1.style.display = "block";
      text1.innerText=show;
       timeOut = window.setTimeout(function(){
            text1.style.display = "none";
                 },2000);
   }
 //绑定结果提示
 bangdingjieguo=function(src,string){
 	var popLayer = document.getElementById("popLayer");
     popLayer.style.display = "block";
 	 var tishi=document.getElementById("shimingjieguo");
   	 tishi.style.display = "block";
   	  var tupian=document.getElementById("cuoduitupian");
   	  tupian.src='img/'+src+'.png';
   	   var neitong=document.getElementById("cuoduitishi");
   	   neitong.innerText=string;
 }
             //用户信息
           R.getyonghuxinxi = function(token) {
		R.req({
			url: R.yonghuxinxi +token +"&",
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					var shoujihao1 = document.getElementById('bdcgsj');
					  var weibangding=document.getElementById("shoujirzgc");
					if(res.msg.cellphone){
						
						 shoujihao1.innerText='您已绑定手机号'+res.msg.cellphone[0]+res.msg.cellphone[1]+res.msg.cellphone[2]+'*****'+res.msg.cellphone[8]+res.msg.cellphone[9]+res.msg.cellphone[10];
						 shoujihao1.style.display = "block";  
						// button.style.color='#ffffff';
   	                    weibangding.style.display = "none";
					}
					else{	
					    shoujihao1.style.display = "none";  
   	                    weibangding.style.display = "block";
					}
				
			}
			
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
           var xingmingyanzheng=function(name){
           	
           	return /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(name);
           }
          //是否绑定过身份证
           R.ifshenfenzheng = function(token) {
		R.req({
			url: R.qushenfenjiaoyan +token +"&",
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200 && res.msg) {
					var shenfenhao1 = document.getElementById('bdcgsfz');
					  var weibangding1=document.getElementById("shenfenrzgc");
					   shenfenhao1.innerText='您已绑定成功身份证号！';
					 //  shenfenhao1.style.display = "block";  
					if(res.msg==1){
						
					 shenfenhao1.innerText='您已绑定成功身份证号！';
					 shenfenhao1.style.display = "block";  
 	                    weibangding1.style.display = "none";
					}
					else{	
				    shenfenhao1.style.display = "none";  
	                 weibangding1.style.display = "block";
					}
				
			}
			
			},
			error: function() {
				console.log("report error!");
			}
		});
	}  
           //实名认证校验
            R.shimingjiaoyan = function(value) {
        var length = value.length; 
        if(18 != length) return false;

         var lastNum = value.substr(value.length - 1,1);
         var twnNum = value.substr(0,2);
//var aCity=array(
//   11=>"北京",12=>"天津",13=>"河北",14=>"山西",15=>"内蒙古",21=>"辽宁",22=>"吉林",23=>"黑龙江",31=>"上海",32=>"江苏",
//   33=>"浙江",34=>"安徽",35=>"福建",36=>"江西",37=>"山东",41=>"河南",42=>"湖北",43=>"湖南",44=>"广东",45=>"广西",46=>"海南",
//   50=>"重庆",51=>"四川",52=>"贵州",53=>"云南",54=>"西藏",61=>"陕西",62=>"甘肃",63=>"青海",64=>"宁夏",65=>"新疆",71=>"台湾",
//   81=>"香港",82=>"澳门",91=>"国外");
    var aCity= new Array(
        11,12,13,14,15,21,22,23,31,32,
        33,34,35,36,37,41,42,43,44,45,46,
        50,51,52,53,54,61,62,63,64,65,71,
        81,82,91
    );

    var f = 0;

    for(i=0;i<aCity.length;i++){
        if(aCity[i] == twnNum){
            f= 1;break;
        }
    }

    if(!f){
// alert('省份所对应的ID错误' );
        return false;
    }

//判断出生日期
    var date = value.substr(6,8);
    var rg = /^(1|2)[0-9]{3}[0-9]{2}[0-9]{2}$/;
    if( ! rg.test(date) ){
        return false;
    }

//性别
    var sex = value.substr(16,1);
//if(sex % 2 == 0) var sexDesc = "女";
//else var sexDesc = "男";
//验证第18位
//将身份证号码前17位数分别乘以不同的系数
    var code = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
//将得到的17个乘积相加。将相加后的和除以11并得到余数,如下
    var szVerCode = new Array('1','0','X','9','8','7','6','5','4','3','2');
    var total = 0;
    for (i = 0;i < 17;i++) {
        var str = value.substr(i,1);
        total += parseInt( str ) * parseInt(code[i]);
    }
    if(szVerCode[ total % 11 ] != lastNum ){
// alert('第18位验证码错误');
        return false;
    }
//   6位地址码,因为数组较大，所以在客服端就不做验证了，在服务端处理
    return true;
}


})(window)