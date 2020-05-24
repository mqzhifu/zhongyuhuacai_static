document.write("<script language=javascript src='https://apis.google.com/js/api:client.js'></script>");
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
  
 function fbLogin(){
 	FB.getLoginStatus(function(response) {
 		if(response.status == "connected"){
 			statusChangeCallback(response);
 		}else{
 			FB.login(function(response) {
				statusChangeCallback(response);
 			});
 		}
 	});
 }
 function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

 function statusChangeCallback(response) {
 	if (response.status === 'connected') {
 	 //response.authResponse.userID;

 	  FB.api('/me', {fields: 'picture.type(large),name'}, function(response) {
 		  console.log('Successful login for: ' + response.name);
 		  var 	third_openId = response.id,
 		  		third_nickname = response.name,
					 third_avatar = encodeURIComponent(response.picture.data.url);
				//encodeURIComponent()
				//decodeURIComponent()
 		  //setLocalStorage("third_nickname", third_nickname);
 		  //setLocalStorage("third_avatar", third_avatar);
 		  console.log(third_openId,third_nickname,third_avatar);
 		  register(6,third_openId,third_nickname,third_avatar);
 		  //平台三方登陆
 		});
 	  
 	} else {
 		//用户取消登陆或者登陆不成功
 	}
 }

 /*function fbLogout(){
	FB.logout(function(response) {
	   // Person is now logged out
	});
 }
*/ 
function fbLogout(){
 FB.api(
   '/me/permissions',
   'DELETE',
   {},
   function(response) {
    console.log("delete permission");
    // Insert your code here
   }
 );
 }
///google
 function initGoogle(){
 	
 	gapi.load('auth2', function(){
 	  auth2 = gapi.auth2.init({
 		//client_id: '538117998596-k37vbis15cmjr631ifmnu4ri7k230sec.apps.googleusercontent.com', //客户端ID
 		client_id: '538117998596-1i61ke200ive8lqot5do7d6rvp5t5mm0.apps.googleusercontent.com', //客户端ID
 		cookiepolicy: 'single_host_origin',
 		scope: 'profile' 
 	  });
 	  attachSignin(document.getElementById('googleBtn'));
 	  console.log('in');
 	  //logOut(7);
 	  //logOut(6);
 	});
 
 }


 function attachSignin(element) {
 	auth2.attachClickHandler(element, {},
 	function(googleUser) {
 		var profile = auth2.currentUser.get().getBasicProfile();
 		var third_openId = profile.getId(),
 			third_nickname = profile.getName(),
 			third_avatar = profile.getImageUrl();
 		console.log(third_openId,third_nickname,third_avatar);
 		register(7,third_openId,third_nickname,third_avatar);
 		//平台三方登陆
 		
 	}, function(error) {
 	  //用户取消登陆或者登陆不成功
 	});
 }
function googleLogout(){
	var auth2;
  	if(!gapi.auth2){
	  	gapi.load('auth2', function() {
		  	auth2 = gapi.auth2.getAuthInstance();
		   	auth2.disconnect();
		   	console.log('google');
	  	});
  	}else{
	   	auth2 = gapi.auth2.getAuthInstance();
	   	auth2.disconnect();
	   	console.log('google');
  	}
 }
 function logOut(regType){
 	var regType=regType;
 	if(regType==6){
 		fbLogout()
 	}else if(regType==7){
 		googleLogout()
 	}
 }
function register(regType,userID,thirdNickname,thirdAvatar){
	var regType=regType,
		userID=userID,
		thirdNickname=thirdNickname,
		thirdAvatar=thirdAvatar;
	$.ajax({
        type: "POST",
				
        url: "/index/thirdReg/?regType="+regType+"&userID="+userID+"&thirdNickname="+thirdNickname+"&thirdAvatar="+thirdAvatar,
		    dataType:"json",
				
        success: function(data) {
        	window.location.href="/game/show/";
        	logOut(regType);
        }
	});
}