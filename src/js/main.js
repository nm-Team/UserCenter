const apiURL = "http://api.nmteam.ml/";

async function getJSON(url) {
    try {
        let response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
        });
        return await response.text();
    } catch (error) {
        console.log('Request Failed', error);
        info.innerHTML = "<t data-i18n='errorNet'></t>" + error;
        changeLanguage();
        return -1;
    }
}

function login() {
    if (uname.value && pass.value) {
        json = load(apiURL + "login.php?name=" + uname.value + "&pass=" + pass.value + "&t=" + time());
    }
    returnJSON = JSON.parse(json);
    if (returnJSON.status == "successful") {
        // 登录成功，然后呢
    }
    else if (returnJSON.status == "error") {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + returnJSON.info;
    }
    changeLanguage();
}

function time() {
    timeNow = new Date;
    return timeNow.getTime();
}

function load(url, fun = false) {
    // 如果有好心人，请帮我用异步或者fetch什么的重写一下，我不是这块料，自裁了
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}