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

function resendEmail(){
    alert("<t data-i18n='info.come_soon'></t>");
}