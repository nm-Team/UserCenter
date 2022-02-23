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
    $.ajax(apiURL + "userinfo.php?CodySESSION=" + getCookie("PHPSESSID"), {
        type: "POST",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        success: function (data) {
            let status = data['status'];
            if (status == "successful") {
                console.log("Success.");
                nick.innerHTML = data['info']['nick'];
                nameT.innerHTML = data['info']['user'];
                tUID.value = data['info']['uid'];
                tNick.value = data['info']['nick'];
                tEmail.value = data['info']['email'];
                tName.value = data['info']['user'];
                avatar.style.backgroundImage = "url(" + data['info']['avatar'] + "&time=" + time() + ")";
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
    changePasswordB.setAttribute("hidden", "");
    safeInfoB.removeAttribute("hidden");
}

function changePassword() {
    if (!(pOld.value && pNew.value && pNew2.value))
        alert("<t data-i18n='fillall'></t>");
    else if (pNew.value != pNew2.value)
        alert("<t data-i18n='2timepwnotsame'></t>");
    else {
        $.ajax(apiURL + "updateinfo.php?action=password&CodySESSION=" + getCookie("PHPSESSID"), {
            type: "POST",
            async: true,
            data: { "oldpass": pOld.value, "newpass": pNew.value },
            crossDomain: true,
            datatype: "jsonp",
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
    if (tNick.value == "") {
        changeInfoError += "Change nick error: Nick can't be empty.<br />";
    }
    else {
        $.ajax(apiURL + "updateinfo.php?action=nick&CodySESSION=" + getCookie("PHPSESSID"), {
            type: "POST",
            async: true,
            data: { "nick": tNick.value },
            crossDomain: true,
            datatype: "jsonp",
            success: function (data) {
                let status = data['status'];
                if (status == "successful") {
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

var image = document.querySelector('#cropperImg');
var cropper = new Cropper(image, {
    viewMode: 1,
    dragMode: 'move',
    aspectRatio: 1,
    autoCropArea: 1,
    restore: false,
    modal: false,
    guides: false,
    highlight: false,
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
});

$("#avatar_imageInput").on("change", function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
        var replaceSrc = evt.target.result;
        cropper.replace(replaceSrc, false);
    }
    reader.readAsDataURL(file);
    openO('changeAvatar_1');
});

function changeAvatar() {
    var avatarToSet = cropper.getCroppedCanvas({ width: 200, height: 200 }).toDataURL('image/png', 0.7);
    var blob = dataURLtoBlob(avatarToSet);
    var file = blobToFile(blob, "avatar.png");
    var formData = new FormData();
    formData.append("avatar", file, "avatar.png");
    console.log(file);
    $.ajax(apiURL + "avatar.php?CodySESSION=" + getCookie("PHPSESSID"), {
        type: "POST",
        async: true,
        data: formData,
        crossDomain: true,
        contentType: false,
        processData: false,
        datatype: "jsonp",
        success: function (data) {
            let status = data['status'];
            if (status == "successful") {
                console.log("Change av success");
                alert("<t data-i18n='changeavatar.success'></t>");
                changeLanguage();
                openO("main");
                refreshInfo();
            }
            else if (status == "error") {
                console.error("Change av error: " + data['info']);
                alert("<t data-i18n='changeavatar.error'></t>" + data['info']);
                changeLanguage();
                openO("main");
                refreshInfo();
            }
        },
        error: function () {
            console.error("Change av error: Network error.");
            alert("<t data-i18n='changeavatar.error'></t><t data-i18n='networkerror'></t>");
            changeLanguage();
            openO("main");
            refreshInfo();
        }
    });
}

//将base64转换为blob
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

//将blob转换为file
blobToFile = function (theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}