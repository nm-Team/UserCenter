var apiURL = "";

function login() {
    let user = uname.value;
    let passwd = pass.value;
    if (!(user && passwd)) {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + "<t data-i18n='fillall'></t>";
        changeLanguage();
    }
    if ((user.length < 4 && user.length > 16) || passwd.length < 4) { info.innerHTML = "<t data-i18n='errorOccured'></t><tdata-i18n='lengthError'></t>"; }
    else {
        changeLanguage();
        info.innerHTML = "<t data-i18n='loging'></t>";
        changeLanguage();
        $.ajax(apiURL + "login.php", {
            type: "POST",
            async: true,
            data: { "user": user, "pass": passwd, "g-recaptcha-response": grecaptcha.getResponse() },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: true },
            success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    info.innerHTML = "<t data-i18n='logok'></t>";
                    changeLanguage();
                    returnURL = getQueryVariable("returnto");
                    if (!returnURL || returnURL == "null") returnURL = "/info.html";
                    window.location.href = returnURL;
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
            xhrFields: { withCredentials: true },
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
    $.ajax(apiURL + "logout.php", {
        type: "POST",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        xhrFields: { withCredentials: true },
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
    $.ajax(apiURL + "userinfo.php", {
        type: "POST",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        xhrFields: { withCredentials: true },
        success: function (data) {
            let status = data['status'];
            if (status == "successful") {
                console.error("Already logged. ");
                returnURL = getQueryVariable("returnto");
                if (!returnURL) returnURL = "/info.html";
                window.location.href = returnURL;
            }
            else if (status == "error") {
                console.log("Not logged in.");
            }
        },
        error: function () {
        }
    });
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