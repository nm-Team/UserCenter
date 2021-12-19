var infoApiURL = "https://logapi.nmteam.ml/";
var manageURL = "https://accounts.nmteam.xyz";
var nid = "1";

getSessionId();

function getInfo(fun = function () { }) {
    $.ajax(infoApiURL + "userinfo.php?nid=" + nId + "&CodySession=" + getCookie("PHPSESSID"), {
        type: "POST",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        xhrFields: { withCredentials: false },
        success: function (data) {
            let status = data['status'];
            if (status == "success") {
                console.log("GetInfo: Success.");
                returnWord = data['data'];
            }
            else if (status == "error") {
                console.error("GetInfo: Not logged in.");
                returnWord = -1;
            }
            fun(returnWord);
        },
        error: function () {
            console.error("GetInfo: Error.");
            returnWord = -2;
        }
    });
    return returnWord;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == "null") {
            return null;
        }
        if (pair[0] == variable) {
            return decodeURI(pair[1]);
        }
    }
    return null;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function getSessionId() {
    // 获取有没有带sessionid参数，有则存Cookie
    if (getQueryVariable("sessionid") != "" && getQueryVariable("sessionid") != null) {
        if (getQueryVariable("long_log") == "true") {
            longLog = ";max-age=999999999999";
            console.log("GetInfo: It's a long time log.");
        }
        else longLog = "";
        sessionid = getQueryVariable("sessionid");
        // 目前逻辑暂时设定为直接访问用户中心的登录的是他们最后一次通过各种方式访问的账号，所以此处不做什么区分
        document.cookie = "PHPSESSID=" + sessionid + "; domain=" + window.location.hostname + "; path=/" + longLog;
        console.log("GetInfo: Get sessionid.");
        // 肥水不流外人田，存进Cookie之后在地址栏隐藏sessionid
        setTimeout(() => {
            removeParam("sessionid");
            removeParam("long_log");
        }, 2000);
    }
}

function changeURLParam(name, value) {
    var url = document.URL, resultUrl = ''
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg);
    var replaceText = name + '=' + value;
    if (r != null) {
        var tmp = url.replace(unescape(name + '=' + r[2]), replaceText);
        resultUrl = (tmp);
    } else {
        if (url.match('[\?]')) {
            resultUrl = url + '&' + replaceText;
        }
        else {
            resultUrl = url + '?' + replaceText;
        }
    }
    history.replaceState(null, null, resultUrl)
}

function removeParam(parameter) {
    var url = document.location.href;
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {
        var urlBase = urlparts.shift();
        var queryString = urlparts.join("?");
        var prefix = encodeURIComponent(parameter) + '=';
        var pars = queryString.split(/[&;]/g);
        for (var i = pars.length; i-- > 0;)
            if (pars[i].lastIndexOf(prefix, 0) !== -1)
                pars.splice(i, 1);
        url = urlBase + '?' + pars.join('&');
        window.history.pushState('', document.title, url); // added this line to push the new url directly to url bar .
    }
    return url;
}
