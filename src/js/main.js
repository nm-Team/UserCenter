var apiURL = "https://api.nmteam.xyz/";
var messageApiURL = "https://announcementapi.nmteam.xyz/";
var nId = "1";

var newscript = document.createElement('script');
newscript.setAttribute('type', 'text/javascript');
newscript.setAttribute('src', '/src/js/getinfo.js');
var head = document.getElementsByTagName('head')[0];
head.appendChild(newscript);

$(window).on("load", function () {
    $.ajax(messageApiURL + "accounts.json", {
        type: "GET",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        xhrFields: { withCredentials: false },
        success: function (data) {
            if (data['announce_' + language]) {
                alert(data['announce_' + language]);
            }
        },
        error: function () {
            console.log("Get announcement error");
        }
    });
});

function login() {
    let user = uname.value;
    let passwd = pass.value;
    if (!(user && passwd)) {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + "<t data-i18n='fillall'></t>";
        changeLanguage();
    }
    if (recoMe.checked == true) {
        reco = true;
    }
    else reco = false;
    if ((user.length < 4 && user.length > 16) || passwd.length < 4) { info.innerHTML = "<t data-i18n='errorOccured'></t><tdata-i18n='lengthError'></t>"; }
    else {
        changeLanguage();
        info.innerHTML = "<t data-i18n='loging'></t>";
        changeLanguage();
        $.ajax(apiURL + "login.php", {
            type: "POST",
            async: true,
            data: { "user": user, "pass": passwd, "g-recaptcha-response": grecaptcha.getResponse(), "remember": reco },
            crossDomain: true,
            datatype: "jsonp",
                success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    info.innerHTML = "<t data-i18n='logok'></t>";
                    changeLanguage();
                    document.cookie = "sessionid=" + data['sessionid'] + "; domain=" + window.location.hostname + "; path=/";
                    goWith(data['sessionid']);
                } else if (status == "error") {
                    info.innerHTML = "<t data-i18n='errorOccured'></t>" + data['info'];
                    changeLanguage();
                }
            },
            error: function () {
                info.innerHTML = "<t data-i18n='errorOccured'></t><t data-i18n='errorNet'></t>" + data['info'];
                changeLanguage();
            }
        });
    }
    changeLanguage();
    grecaptcha.reset();
}

function register() {
    let user = uname.value;
    let emailadd = email.value;
    let passwd = pass.value;
    let passwd2 = pass2.value;
    if (!(user && emailadd && passwd && passwd2)) {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + "<t data-i18n='fillall'></t>";
        changeLanguage();
    }
    else if (!readNeeds.checked) {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + "<t data-i18n='checkterms'></t>";
        changeLanguage();
    }
    else if ((user.length < 4 && user.length > 16) || passwd.length < 4) { info.innerHTML = "<tdata-i18n='lengthError'></t>"; }
    else if (passwd != passwd2) {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + "<t data-i18n='2timepwnotsame'></t>";
        changeLanguage();
        pass.value = pass2.value = "";
    }
    else if ((user.length < 4 && user.length > 16) || passwd.length < 4) { info.innerHTML = "<t data-i18n='errorOccured'></t><tdata-i18n='lengthError'></t>"; }
    else {
        info.innerHTML = "<t data-i18n='registering'></t>";
        $.ajax(apiURL + "register.php", {
            type: "POST",
            async: true,
            data: { "user": user, "email": emailadd, "pass": passwd, "g-recaptcha-response": grecaptcha.getResponse() },
            crossDomain: true,
            datatype: "jsonp",
                success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    info.innerHTML = "<t data-i18n='registerok0'></t><br /><t data-i18n='registerok1'></t><br /><t data-i18n='registerok2'></t><br /><a href='javascript:resendEmail();' target='_self' data-i18n='registerok3'></a>";
                    document.getElementsByTagName("form")[0].style.display = "none";
                    changeLanguage();
                } else if (status == "error") {
                    info.innerHTML = "<t data-i18n='errorOccured'></t>" + data['info'];
                    changeLanguage();
                }
            },
            error: function () {
                info.innerHTML = "<t data-i18n='errorOccured'></t><t data-i18n='errorNet'></t>" + data['info'];
                changeLanguage();
            }
        });
    }
    changeLanguage();
    grecaptcha.reset();
}

function logout(showMsg = true) {
    $.ajax(apiURL + "logout.php?CodySESSION=" + getCookie("sessionid") || getCookie("PHPSESSID"), {
        type: "POST",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        success: function (data) {
            let status = data['status'];
            if (status == "successful") {
                console.log("Logout success.");
                if (showMsg)
                    alert("<t data-i18n='logoutok'></t>");
                changeLanguage();
                window.location.href = "/index.html";
            }
            else if (status == "error") {
                console.log("Logout faliure.");
                if (showMsg)
                    alert("<t data-i18n='errorOccured'></t>" + data['info']);
            }
        },
        error: function () {
            if (showMsg)
                alert("<t data-i18n='errorOccured'></t><t data-i18n='errorNet'></t>" + data['info']);
        }
    });
    changeLanguage();
}

function time() {
    timeNow = new Date;
    return timeNow.getTime();
}

function alreadyLogged() {
    $.ajax(apiURL + "userinfo.php?CodySESSION=" + getCookie("sessionid") || getCookie("PHPSESSID"), {
        type: "POST",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        success: function (data) {
            let status = data['status'];
            if (status == "successful") {
                console.log("Has a logged sessionid. ");
                try {
                    useCurrentToLogBox.className = "open";
                    useCurrentToLogButton.innerHTML = i18n.t('continueas') + " " + data['info']['nick'] + " (" + data['info']['user'] + ")";
                    useCurrentToLogButton.onclick = function () { goWith(getCookie("sessionid") || getCookie("PHPSESSID")); };
                }
                catch (err) {
                    console.log("No continue div.");
                }
            }
            else if (status == "error") {
                console.log("Not logged in.");
            }
        },
        error: function () {
        }
    });
}

function goWith(sid) {
    returnURL = getQueryVariable("returnto");
    let sessionid = sid;
    if (!returnURL || returnURL == "null") returnURL = "/info.html";
    if (returnURL.indexOf("?") != -1) returnURL += "&sessionid=" + sessionid;
    else returnURL += "?sessionid=" + sessionid;
    if (recoMe.checked == true) {
        returnURL += "&long_log=true";
    }
    window.location.href = returnURL;
}

function alert(msg) {
    alertDate = new Date();
    alertTime = alertDate.getTime();
    new_element = document.createElement('div');
    new_element.setAttribute('id', 'smallMsg' + alertTime);
    new_element.setAttribute('class', 'msgBox smallMsg');
    document.body.appendChild(new_element);
    document.getElementById('smallMsg' + alertTime).innerHTML = `<p>` + msg + `</p>
    <button data-i18n="close" id="aboutClose" onclick="document.getElementById('smallMsg`+ alertTime + `').setAttribute('open','false'); msgBoxCover.setAttribute('smallMsg','false');"></button>`;
    changeLanguage();
    document.getElementById('smallMsg' + alertTime).setAttribute("open", "true");
    msgBoxCover.setAttribute("smallMsg", "true");
}

function BrowserType() {
    // ??????????????? + ???????????? > ?????? > ?????? + ?????? + ???????????? + ???????????? > ?????? + ????????????
    const ua = navigator.userAgent.toLowerCase();
    const testUa = regexp => regexp.test(ua);
    const testVs = regexp => ua.match(regexp)
        .toString()
        .replace(/[^0-9|_.]/g, "")
        .replace(/_/g, ".");
    // ??????
    let system = "unknow";
    if (testUa(/windows|win32|win64|wow32|wow64/g)) {
        system = "windows"; // windows??????
    } else if (testUa(/macintosh|macintel/g)) {
        system = "macos"; // macos??????
    } else if (testUa(/x11/g)) {
        system = "linux"; // linux??????
    } else if (testUa(/android|adr/g)) {
        system = "android"; // android??????
    } else if (testUa(/ios|iphone|ipad|ipod|iwatch/g)) {
        system = "ios"; // ios??????
    }
    // ????????????
    let systemVs = "unknow";
    if (system === "windows") {
        if (testUa(/windows nt 5.0|windows 2000/g)) {
            systemVs = "2000";
        } else if (testUa(/windows nt 5.1|windows xp/g)) {
            systemVs = "xp";
        } else if (testUa(/windows nt 5.2|windows 2003/g)) {
            systemVs = "2003";
        } else if (testUa(/windows nt 6.0|windows vista/g)) {
            systemVs = "vista";
        } else if (testUa(/windows nt 6.1|windows 7/g)) {
            systemVs = "7";
        } else if (testUa(/windows nt 6.2|windows 8/g)) {
            systemVs = "8";
        } else if (testUa(/windows nt 6.3|windows 8.1/g)) {
            systemVs = "8.1";
        } else if (testUa(/windows nt 10.0|windows 10/g)) {
            systemVs = "10";
        }
    } else if (system === "macos") {
        systemVs = testVs(/os x [\d._]+/g);
    } else if (system === "android") {
        systemVs = testVs(/android [\d._]+/g);
    } else if (system === "ios") {
        systemVs = testVs(/os [\d._]+/g);
    }
    // ??????
    let platform = "unknow";
    if (system === "windows" || system === "macos" || system === "linux") {
        platform = "desktop"; // ?????????
    } else if (system === "android" || system === "ios" || testUa(/mobile/g)) {
        platform = "mobile"; // ?????????
    }
    // ???????????????
    let engine = "unknow";
    let supporter = "unknow";
    if (testUa(/applewebkit/g)) {
        engine = "webkit"; // webkit??????
        if (testUa(/edge/g)) {
            supporter = "edge"; // edge?????????
        } else if (testUa(/opr/g)) {
            supporter = "opera"; // opera?????????
        } else if (testUa(/chrome/g)) {
            supporter = "chrome"; // chrome?????????
        } else if (testUa(/safari/g)) {
            supporter = "safari"; // safari?????????
        }
    } else if (testUa(/gecko/g) && testUa(/firefox/g)) {
        engine = "gecko"; // gecko??????
        supporter = "firefox"; // firefox?????????
    } else if (testUa(/presto/g)) {
        engine = "presto"; // presto??????
        supporter = "opera"; // opera?????????
    } else if (testUa(/trident|compatible|msie/g)) {
        engine = "trident"; // trident??????
        supporter = "iexplore"; // iexplore?????????
    }
    // ????????????
    let engineVs = "unknow";
    if (engine === "webkit") {
        engineVs = testVs(/applewebkit\/[\d._]+/g);
    } else if (engine === "gecko") {
        engineVs = testVs(/gecko\/[\d._]+/g);
    } else if (engine === "presto") {
        engineVs = testVs(/presto\/[\d._]+/g);
    } else if (engine === "trident") {
        engineVs = testVs(/trident\/[\d._]+/g);
    }
    // ????????????
    let supporterVs = "unknow";
    if (supporter === "chrome") {
        supporterVs = testVs(/chrome\/[\d._]+/g);
    } else if (supporter === "safari") {
        supporterVs = testVs(/version\/[\d._]+/g);
    } else if (supporter === "firefox") {
        supporterVs = testVs(/firefox\/[\d._]+/g);
    } else if (supporter === "opera") {
        supporterVs = testVs(/opr\/[\d._]+/g);
    } else if (supporter === "iexplore") {
        supporterVs = testVs(/(msie [\d._]+)|(rv:[\d._]+)/g);
    } else if (supporter === "edge") {
        supporterVs = testVs(/edge\/[\d._]+/g);
    }
    // ?????????????????????
    let shell = "none";
    let shellVs = "unknow";
    if (testUa(/micromessenger/g)) {
        shell = "wechat"; // ???????????????
        shellVs = testVs(/micromessenger\/[\d._]+/g);
    } else if (testUa(/qqbrowser/g)) {
        shell = "qq"; // QQ?????????
        shellVs = testVs(/qqbrowser\/[\d._]+/g);
    } else if (testUa(/ucbrowser/g)) {
        shell = "uc"; // UC?????????
        shellVs = testVs(/ucbrowser\/[\d._]+/g);
    } else if (testUa(/qihu 360se/g)) {
        shell = "360"; // 360?????????(?????????)
    } else if (testUa(/2345explorer/g)) {
        shell = "2345"; // 2345?????????
        shellVs = testVs(/2345explorer\/[\d._]+/g);
    } else if (testUa(/metasr/g)) {
        shell = "sougou"; // ???????????????(?????????)
    } else if (testUa(/lbbrowser/g)) {
        shell = "liebao"; // ???????????????(?????????)
    } else if (testUa(/maxthon/g)) {
        shell = "maxthon"; // ???????????????
        shellVs = testVs(/maxthon\/[\d._]+/g);
    }
    return Object.assign({
        engine, // webkit gecko presto trident
        engineVs,
        platform, // desktop mobile
        supporter, // chrome safari firefox opera iexplore edge
        supporterVs,
        system, // windows macos linux android ios
        systemVs
    }, shell === "none" ? {} : {
        shell, // wechat qq uc 360 2345 sougou liebao maxthon
        shellVs
    });
}

function divClick(div, event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        div.click();
    }
}