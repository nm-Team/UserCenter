# nm-Team/UserCenter
nmTeam 用户中心前端。

## 使用方法  
请在 <code>/src/js/main.js</code> 和 <code>/src/js/getinfo.js</code> 设置 API 地址。  

## 关于登录网页调用 
nmTeam User Center 提供了无与伦比的登录前端网页。因此您只需要专心于您的内容创作，无需纠结于登录的实现。  
您可以通过跳转的方式引导用户登录，只需设置目标网址即可。例如：  
<code>https://accounts.nmteam.ml/?returnto=https://example.com&name=Example&nbsp;Title&msg=This&nbsp;is&nbsp;a&nbsp;sample</code>
其中 <code>returnto</code> 在您的环境下是一个必填项，它将为一个包含协议头的 Web 地址以告知登录页面在操作成功后定向到何处；否则，登录成功后将进入用户中心。    
<code>name</code> 和 <code>msg</code> 均为可选项。如果您传入了对应的参数，它们会分别出现在页面的二级标题和末尾。在传入这些参数时，除了一般字符，您还可以匹配 nmTeam Accounts 语言文件中定义的语言变量。  
自 2021 年 7 月 7 日更新起，您需要在您服务域名的 Cookie 中加入返回 URL 中的 <code>sessionid</code> 参数。<code>getinfo.js</code> 可自动完成这一操作。  

## 关于 <code>getinfo.js</code> 及其使用 
<code>getinfo.js</code> 提供了让接入 nmTeam 的应用得以快速获取 nmTeam 账号登录情况的强大能力。  
要使用 <code>getinfo.js</code>，您需要首先在需要调用之的 JavaScript 前引用 <code>getinfo.js</code>。例如：  
<code>&lt;script src="https://accounts.nmteam.ml/src/js/getinfo.js" &gt; &lt;/script&gt;</code>  
通过 <code>getInfo</code> 函数，您可以轻松获取登录状态。<code>getInfo</code> 函数的使用示例如下：  
<code>userInfo = getInfo(function(){console.log("Success.");});</code>  
在 2021 年 7 月 4 日后，<code>getInfo</code> 函数实验性新增了一个字段 <code>fun</code>，其默认值为空函数。您可以在此获取到结果后需要执行的 JavaScript。  
自 2021 年 7 月 7 日更新起，<code>getinfo.js</code> 可自动在您服务域名的 Cookie 中加入返回 URL 中的 <code>sessionid</code> 参数。  