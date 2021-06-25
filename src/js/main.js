var apiURL = "https://nmapi.c0y.cc/";

function login() {
    let user = uname.value;
    let passwd = pass.value;
if(user.length > 4 && user.length<16 )
{info.innerHTML = "<t>username too long/short.</t>";}
else if(passwd.length < 4)
{info.innerHTML = "<t>password too short.</t>";}else{
    $.ajax(apiURL+"login.php", {
type:"POST",
async:false,
data:{ "user":user, "pass":passwd},
crossDomain:true,
datatype: "jsonp",
xhrFields: {withCredentials: true},
success:function(data){
    let status = data['status'];
    if (status == "successful") {
        info.innerHTML = "<t>OK</t>";
    }else if (status == "error") {
        info.innerHTML = "<t data-i18n='errorOccured'></t>" + data['info'];
    }
    changeLanguage();

},
error:function(){
info.innerHTML = "<t data-i18n='errorOccured'></t>" + data['info']}
});
}
}

function login_old() {
    if (uname.value && pass.value) {
        json = load(apiURL + "login.php?user=" + uname.value + "&pass=" + pass.value + "&t=" + time());
    }
    returnJSON = JSON.parse(json);
    if (returnJSON.status == "successful") {
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
