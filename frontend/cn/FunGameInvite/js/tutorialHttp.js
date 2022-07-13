(function(window) {
	var TU = window.TU = {
		bindMoneyToken: "userSafe/bindMoneyToken/token="
	};

	TU.bindMoney = function(token,moneyToken) {
		G.req({
			url: G.preUrl + TU.bindMoneyToken + token + "&moneyToken=" + moneyToken,
			success: function(resJson) {
				var res = JSON.parse(resJson);
				console.log("report success!", res);
				if(res.code == 200) {
					withdrawPassword.inputSuccess(moneyToken);
				}else if(res.code == 8299){
					withdrawPassword.showErrorToast("已绑定过口令，不能重复绑定");
				}else{
					withdrawPassword.showErrorToast("口令错误");
				}
			},
			error: function() {
				console.log("report error!");
			}
		});
	}
})(window)