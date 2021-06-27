var apiURL = "";
var changeableInfos = ["tNick",];

function openO(tabName) {
    blocks = operates.getElementsByClassName("infoDiv");
    for (closeNum = 0; closeNum < blocks.length; closeNum++) {
        blocks[closeNum].setAttribute("open", "false");
    }
    document.getElementById(tabName).setAttribute("open", "true");
}
window.onload = function () {
    refreshInfo();
}

function refreshInfo() {
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
                console.log("Success.");
                nick.innerHTML = data['info']['nick'];
                nameT.innerHTML = data['info']['user'];
                tNick.value = data['info']['nick'];
                tEmail.value = data['info']['email'];
                tName.value = data['info']['user'];
                avatar.style.backgroundImage = "url(" + data['info']['avatar'] + ")";
                // 解析用户角色
                switch (data['info']['admin']) {
                    case "0":
                        userCharacter = "User";
                        break;
                    case "1":
                        userCharacter = "Admin";
                        break;
                    default:
                        userCharacter = undefined;
                        break;
                }
                tCharacter.value = userCharacter;
            }
            else if (status == "error") {
                console.error("Not logged in.");
                window.location.href = "/index.html?name=AccountCenter";
            }

        },
        error: function () {
            info.innerHTML = "<t data-i18n='errorOccured'></t><t data-i18n='errorNet'></t>" + data['info'];
        }
    });
    changeLanguage();
}

function logout() {
    $.ajax(apiURL + "logout.php", {
        type: "POST",
        async: false,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        xhrFields: { withCredentials: true },
        success: function (data) {
            let status = data['status'];
            if (status == "successful") {
                console.log("Logout success.");
                alert("<t data-i18n='logoutok'></t>");
                window.location.href = "/index.html";
            }
            else if (status == "error") {
                console.log("Logout faliure.");
                operates("<t data-i18n='errorOccured'></t>" + data['info']);
            }
        },
        error: function () {
            operates.innerHTML = "<t data-i18n='errorOccured'></t><t data-i18n='errorNet'></t>" + data['info'];
        }
    });
    changeLanguage();
}

function changeInfo() {
    for (changeNum = 0; changeNum < changeableInfos.length; changeNum++) {
        document.getElementById(changeableInfos[changeNum]).removeAttribute("readonly");

    }
    safeInfoB.removeAttribute("hidden");
    changePasswordB.setAttribute("hidden", "");
}

function safeInfo() {
    allInfoInputs = document.getElementById("userInfo").getElementsByTagName("input");
    for (changeNum = 0; changeNum < allInfoInputs.length; changeNum++) {
        allInfoInputs[changeNum].setAttribute("readonly", "");
    }
    safeInfoB.setAttribute("hidden", "hidden");
    changePasswordB.removeAttribute("hidden");
    alert("<t data-i18n='info.come_soon'></t>");
}

function changeAvatar() {
    alert("<t data-i18n='info.come_soon'></t>");
}

function changePassword() {
    if (!(pOld.value && pNew.value && pNew2.value))
        alert("<t data-i18n='fillall'></t>");
    else if (pNew.value != pNew2.value)
        alert("<t data-i18n='2timepwnotsame'></t>");
    else {
        alert("<t data-i18n='info.come_soon'></t>");
    }
    changeLanguage();
    openO("main");
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