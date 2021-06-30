window.onload = function () {
    activation();
}

function activation() {
    if (!getQueryVariable("user") || !getQueryVariable("code")) {
        resultBox.setAttribute("data-i18n", "activation.lackinfo");
    }
    else {
        $.ajax(apiURL + "activation.php", {
            type: "POST",
            async: false,
            data: { "user": getQueryVariable("user"), "code": getQueryVariable("code") },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: true },
            success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    console.log("success");
                    resultBox.setAttribute("data-i18n", "activation.success");
                    loadingSvg.className = "";
                    successSvg.className = "show";
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 2000);
                    changeLanguage();
                }
                else if (status == "error") {
                    console.error("error: " + data['info']);
                    resultBox.setAttribute("data-i18n", "activation.error");
                    resultErr.innerHTML += data['info'];
                    loadingSvg.className = "";
                    errorSvg.className = "show";
                }
            },
            error: function () {
                console.error("error: Network error.");
                resultBox.setAttribute("data-i18n", "activation.error");
                changeLanguage();
                resultErr.innerHTML += "Network error.";
                loadingSvg.className = "";
                errorSvg.className = "show";
            }
        });
    }
    changeLanguage();
}
