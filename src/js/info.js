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
        async: true,
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

function changeInfo() {
    for (changeNum = 0; changeNum < changeableInfos.length; changeNum++) {
        document.getElementById(changeableInfos[changeNum]).removeAttribute("readonly");

    }
    changePasswordB.removeAttribute("hidden");
    safeInfoB.setAttribute("hidden", "");
}

function changePassword() {
    if (!(pOld.value && pNew.value && pNew2.value))
        alert("<t data-i18n='fillall'></t>");
    else if (pNew.value != pNew2.value)
        alert("<t data-i18n='2timepwnotsame'></t>");
    else {
        $.ajax(apiURL + "updateinfo.php?action=password", {
            type: "POST",
            async: true,
            data: { "oldpass": pOld.value, "newpass": pNew.value },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: true },
            success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    console.log("Change pw success");
                    alert("<t data-i18n='changepw.success'></t>");
                    logout(false);

                }
                else if (status == "error") {
                    console.error("Change pw error: " + data['info']);
                    alert("<t data-i18n='changepw.error'></t>" + data['info']);
                }
            },
            error: function () {
                console.error("Change pw error: Network error.");
                alert("<t data-i18n='changepw.error'></t><t data-i18n='networkerror'></t>");
            }
        });
    }
    changeLanguage();
    pOld.value = pNew.value = pNew2.value = "";
    openO("main");
}
function saveInfo() {
    // 准备搜集错误信息
    changeInfoError = "";
    // 设置 nick
    $.ajax(apiURL + "updateinfo.php?action=nick", {
        type: "POST",
        async: true,
        data: { "nick": tNick.value },
        crossDomain: true,
        datatype: "jsonp",
        xhrFields: { withCredentials: true },
        success: function (data) {
            let status = data['status'];
            if (status == "successful") {
                console.log("Change nick success");
            }
            else if (status == "error") {
                console.error("Change nick error: " + data['info']);
                changeInfoError += "Change nick error: " + data['info'];
            }
        },
        error: function () {
            console.error("Change pw error: Network error.");
            changeInfoError += "Change nick error: <t data-i18n='networkerror'></t>";
        }
    });
    if (changeInfoError == "")
        alert("<t data-i18n='changeinfo.success'></t>");
    else
        alert("<t data-i18n='changeinfo.error'></t>" + changeInfoError);
    changeLanguage();
    openO("main");
    allInfoInputs = document.getElementById("userInfo").getElementsByTagName("input");
    for (changeNum = 0; changeNum < allInfoInputs.length; changeNum++) {
        allInfoInputs[changeNum].setAttribute("readonly", "");
    }
    refreshInfo();
}

function uploadAvatar(){
    alert("<t data-i18n='info.come_soon'></t>");
}
    
function changeAvatar() {
    if ( avatarURL.value.slice(0, 8) != "https://")
        alert("<t data-i18n='changeavatar.givealink'></t>");
    else  {
        avatarToSet=avatarURL.value;
        $.ajax(apiURL + "updateinfo.php?action=avatar", {
            type: "POST",
            async: true,
            data: { "avatar":avatarToSet },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: true },
            success: function (data) {
                let status = data['status'];
                if (status == "successful") {
                    console.log("Change av success");
                    alert("<t data-i18n='changeavatar.success'></t>");
                }
                else if (status == "error") {
                    console.error("Change av error: " + data['info']);
                    alert("<t data-i18n='changeavatar.error'></t>" + data['info']);
                }
            },
            error: function () {
                console.error("Change av error: Network error.");
                alert("<t data-i18n='changeavatar.error'></t><t data-i18n='networkerror'></t>");
            }
        });
    }
    changeLanguage();
    avatarURL.value = "";
    openO("main");
    refreshInfo();
}