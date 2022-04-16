function sendResetEmail() {
    if (!email.value) {
        resultBox.setAttribute("data-i18n", "reset.nofill");
    }
    else {
        $.ajax(apiURL + "resetpassword.php", {
            type: "POST",
            async: true,
            data: { "email": email.value, "g-recaptcha-response": grecaptcha.getResponse(), "sessionid": getCookie("sessionid") || getCookie("PHPSESSID") },
            crossDomain: true,
            datatype: "jsonp",
                success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    console.log("success");
                    resultBox.setAttribute("data-i18n", "reset.sendsuccess");
                    resultErr.innerHTML = "";
                    logout(false);
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 2000);
                    changeLanguage();
                }
                else if (status == "error") {
                    console.error("error: " + data['info']);
                    resultBox.setAttribute("data-i18n", "reset.senderror");
                    changeLanguage();
                    resultErr.innerHTML = data['info'];
                }
            },
            error: function () {
                console.error("error: Network error.");
                resultBox.setAttribute("data-i18n", "reset.senderror");
                changeLanguage();
                resultErr.innerHTML = "Network error.";
            }
        });
    }
}

function resetPassword() {
    let passwd = pass.value;
    let passwd2 = pass2.value;
    if (!(getQueryVariable("user") && getQueryVariable("code"))) {
        resultBox.setAttribute("data-i18n", "reset.lackinfo");
        changeLanguage();
        resultErr.innerHTML = "";
    }
    else if (!(passwd && passwd2)) {
        resultBox.setAttribute("data-i18n", "reset.nofill");
        changeLanguage();
        resultErr.innerHTML = "";
    }
    else if (!(passwd == passwd2)) {
        resultBox.setAttribute("data-i18n", "reset.setnotmatch");
        passwd = passwd2 = "";
        changeLanguage();
        resultErr.innerHTML = "";
    }
    else {
        $.ajax(apiURL + "verification.php?action=resetPassword", {
            type: "POST",
            async: true,
            data: { "user": getQueryVariable("user"), "code": getQueryVariable("code"), "time": getQueryVariable("time"), "pass": passwd, "sessionid": getCookie("sessionid") || getCookie("PHPSESSID") },
            crossDomain: true,
            datatype: "jsonp",
                success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    console.log("success");
                    resultBox.setAttribute("data-i18n", "reset.setsuccess");
                    resultErr.innerHTML = "";
                    logout(false);
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 2000);
                    changeLanguage();
                }
                else if (status == "error") {
                    console.error("error: " + data['info']);
                    resultBox.setAttribute("data-i18n", "reset.seterror");
                    changeLanguage();
                    resultErr.innerHTML = data['info'];
                }
            },
            error: function () {
                console.error("error: Network error.");
                resultBox.setAttribute("data-i18n", "reset.seterror");
                changeLanguage();
                resultErr.innerHTML = "Network error.";
            }
        });
    }
}