window.onload = function () {
    activation();
}

function activation() {
    if (!getQueryVariable("user") || !getQueryVariable("code")) {
        resultBox.setAttribute("data-i18n", "activation.lackinfo");
    }
    else {
        $.ajax(apiURL + "verification.php?action=activation", {
            type: "POST",
            async: true,
            data: { "user": getQueryVariable("user"), "code": getQueryVariable("code"), "time": getQueryVariable("time") },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: false },
            success: function (data) {
                let status = data['status'];
                if (status == "success") {
                    console.log("success");
                    resultBox.setAttribute("data-i18n", "activation.success");
                    resultErr.innerHTML = "";
                    loadingSvg.className = "";
                    successSvg.className = "show";
                    logout(false);
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 2000);
                    changeLanguage();
                }
                else if (status == "error") {
                    console.error("error: " + data['info']);
                    resultBox.setAttribute("data-i18n", "activation.error");
                    resultErr.innerHTML = data['info'];
                    loadingSvg.className = "";
                    errorSvg.className = "show";
                }
            },
            error: function () {
                console.error("error: Network error.");
                resultBox.setAttribute("data-i18n", "activation.error");
                changeLanguage();
                resultErr.innerHTML = "Network error.";
                loadingSvg.className = "";
                errorSvg.className = "show";
            }
        });
    }
    changeLanguage();
}