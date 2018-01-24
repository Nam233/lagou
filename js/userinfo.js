/* 
                       .::::. 
                     .::::::::. 
                    :::::::::::  FUCK ME 
                ..:::::::::::' 
              '::::::::::::' 
                .:::::::::: 
           '::::::::::::::.. 
                ..::::::::::::. 
              ``:::::::::::::::: 
               ::::``:::::::::'        .:::. 
              ::::'   ':::::'       .::::::::. 
            .::::'      ::::     .:::::::'::::. 
           .:::'       :::::  .:::::::::' ':::::. 
          .::'        :::::.:::::::::'      ':::::. 
         .::'         ::::::::::::::'         ``::::. 
     ...:::           ::::::::::::'              ``::. 
    ```` ':.          ':::::::::'                  ::::.. 
                       '.:::::'                    ':'````.. 
*/
//加载完页面检查登录cookie
$(document).ready(function(){ 
	check_login();
}); 
//检查是否登录
function check_login(argument) {
  // body...
  var user = $.cookie("username");
    if (user == 'admin'){
      $("#login_status").html(`<span >${user}</span>
        <span id="exit" >注销</span> `);
    }
    else{
      alert("你不是超级管理员，请先登录");
      location.href="index.html";
    }
}
//注销功能
$("#login_status").on('click','#exit',function(){
  $.cookie('username',null, { expires: 7, path: '/' }); 
  check_login();
});
//跳转到职位管理页面
$("#turn_to_job").on('click',function(){
  location.href="jobmannager.html";
});
//跳转到首页页面
$("#turn_to").on('click',function(){
  location.href="index.html";
});