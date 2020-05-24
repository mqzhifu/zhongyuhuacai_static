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

function ajaxType(obj) {
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