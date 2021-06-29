var apiURL = "";

window.onload = function () {
    if (getQueryVariable("name")) {
        changeLoginTypeA.setAttribute("href", changeLoginTypeA.getAttribute("href") + "?returnto=" + getQueryVariable("returnto") + "&name=" + getQueryVariable("name"));
        nameBox.innerHTML = "<t data-i18n='toContinue'></t> <t data-i18n='" + getQueryVariable("name") + "'></t> ";
    }
    if (getQueryVariable("msg")) {
        info.innerHTML = "<t data-i18n='" + getQueryVariable("msg") + "'></t> ";
    }
    changeLanguage();
    alreadyLogged();
}

function login() {
    let user = uname.value;
    let passwd = pass.value;
    if (!(user && passwd)) {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + "<t data-i18n='fillall'></t>";
    }
    if ((user.length < 4 && user.length > 16) || passwd.length < 4) { info.innerHTML = "<t data-i18n='errorOccured'></t><tdata-i18n='lengthError'></t>"; }
    else {
        info.innerHTML = "<t data-i18n='loging'></t>";
        $.ajax(apiURL + "login.php", {
            type: "POST",
            async: false,
            data: { "user": user, "pass": passwd, "g-recaptcha-response": grecaptcha.getResponse() },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: true },
            success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    info.innerHTML = "<t data-i18n='logok'></t>";
                    returnURL = getQueryVariable("returnto");
                    if (!returnURL || returnURL == "null") returnURL = "/info.html";
                    window.location.href = returnURL;
                } else if (status == "error") {
                    info.innerHTML = "<t data-i18n='errorOccured'></t>" + data['info'];
                }

            },
            error: function () {
                info.innerHTML = "<t data-i18n='errorOccured'></t><t data-i18n='errorNet'></t>" + data['info'];
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
    }
    else if (!readNeeds.checked) {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + "<t data-i18n='checkterms'></t>";
    }
    else if ((user.length < 4 && user.length > 16) || passwd.length < 4) { info.innerHTML = "<tdata-i18n='lengthError'></t>"; }
    else if (passwd != passwd2) {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + "<t data-i18n='2timepwnotsame'></t>";
        pass.value = pass2.value = "";

    }
    else if ((user.length < 4 && user.length > 16) || passwd.length < 4) { info.innerHTML = "<t data-i18n='errorOccured'></t><tdata-i18n='lengthError'></t>"; }
    else {
        info.innerHTML = "<t data-i18n='registering'></t>";
        $.ajax(apiURL + "register.php", {
            type: "POST",
            async: false,
            data: { "user": user, "email": emailadd, "pass": passwd, "g-recaptcha-response": grecaptcha.getResponse() },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: true },
            success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    info.innerHTML = "<t data-i18n='registerok'></t>";
                    window.location.href = changeLoginTypeA.getAttribute("href");
                } else if (status == "error") {
                    info.innerHTML = "<t data-i18n='errorOccured'></t>" + data['info'];
                }

            },
            error: function () {
                info.innerHTML = "<t data-i18n='errorOccured'></t><t data-i18n='errorNet'></t>" + data['info']
            }
        });
    }
    changeLanguage();
    grecaptcha.reset();
}

function time() {
    timeNow = new Date;
    return timeNow.getTime();
}

function alreadyLogged() {
    $.ajax(apiURL + "userinfo.php", {
        type: "POST",
        async: false,
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
    // changeLanguage();

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