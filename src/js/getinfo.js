var infoApiURL = "";

function getInfo() {
    $.ajax(infoApiURL + "userinfo.php", {
        type: "POST",
        async: true,
        data: {},
        crossDomain: true,
        datatype: "jsonp",
        xhrFields: { withCredentials: true },
        success: function (data) {
            let status = data['status'];
            if (status == "successful") {
                console.log("GetInfo: Success.");
                returnWord = data['info'];
            }
            else if (status == "error") {
                console.error("GetInfo: Not logged in.");
                returnWord = -1;
            }
        },
        error: function () {
            console.error("GetInfo: Error.");
            returnWord = -2;
        }
    });
    return returnWord;
}
