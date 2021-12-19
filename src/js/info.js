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
    $.ajax(apiURL + "userinfo.php?nid=" + nId + "&CodySession=" + getCookie("PHPSESSID"), {
        type: "POST",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        xhrFields: { withCredentials: false },
        success: function (data) {
            let status = data['status'];
            if (status == "success") {
                console.log("Success.");
                nick.innerHTML = data['data']['nick'];
                nameT.innerHTML = data['data']['user'];
                tUID.value = data['data']['uid'];
                tNick.value = data['data']['nick'];
                tEmail.value = data['data']['email'];
                tName.value = data['data']['user'];
                uAvatar = data['data']['avatar'];
                avatar.style.backgroundImage = "url(" + data['data']['avatar'] + ")";
                // 解析用户角色
                switch (data['data']['role']) {
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
    changePasswordB.setAttribute("hidden", "");
    safeInfoB.removeAttribute("hidden");
}

function changePassword() {
    if (!(pOld.value && pNew.value && pNew2.value))
        alert("<t data-i18n='fillall'></t>");
    else if (pNew.value != pNew2.value)
        alert("<t data-i18n='2timepwnotsame'></t>");
    else {
        $.ajax(apiURL + "changepassword.php?nid=" + nId + "&CodySession=" + getCookie("PHPSESSID"), {
            type: "POST",
            async: true,
            data: { "oldpass": pOld.value, "newpass": pNew.value },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: false },
            success: function (data) {
                let status = data['status'];
                if (status == "success") {
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
    if (tNick.value == "") {
        changeInfoError += "Change nick error: Nick can't be empty.<br />";
    }
    else {
        $.ajax(apiURL + "editprofile.php?nid=" + nId + "&CodySession=" + getCookie("PHPSESSID"), {
            type: "POST",
            async: true,
            data: { "nick": tNick.value, avatar: uAvatar },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: false },
            success: function (data) {
                let status = data['status'];
                if (status == "success") {
                    console.log("Change nick success");
                }
                else if (status == "error") {
                    console.error("Change nick error: " + data['info']);
                    changeInfoError += "Change nick error: " + data['info'] + "<br />";
                }
            },
            error: function () {
                console.error("Change pw error: Network error.");
                changeInfoError += "Change nick error: <t data-i18n='networkerror'></t><br />";
            }
        });
    }
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
    changePasswordB.removeAttribute("hidden");
    safeInfoB.setAttribute("hidden", "");
}

function uploadAvatar() {
    alert("<t data-i18n='info.come_soon'></t>");
}

function changeAvatar() {
    if (avatarURL.value.slice(0, 8) != "https://")
        alert("<t data-i18n='changeavatar.givealink'></t>");
    else {
        avatarToSet = avatarURL.value;
        $.ajax(apiURL + "editprofile.php?nid=" + nId + "&CodySession=" + getCookie("PHPSESSID"), {
            type: "POST",
            async: true,
            data: { "avatar": avatarToSet, "nick": tNick.value },
            crossDomain: true,
            datatype: "jsonp",
            xhrFields: { withCredentials: false },
            success: function (data) {
                let status = data['status'];
                if (status == "success") {
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