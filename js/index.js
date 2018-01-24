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
//登录按钮触发事件
$('#login_btn').on('click',function(){
		event.preventDefault();
		var username = $("#login_user").val().trim();
		var psw = $("#login_psw").val().trim();		
		var params = {};
		params.username = username;
		params.pwd = psw;
		$.post('/api/login', params, function(data) {
	    	 //console.log(data);
	    	 if (!data.code) {
                 console.log("登陆成功");
                 $.cookie('username', username, { expires: 7, path: '/' });
                 check_login();
                 $('#login_m').modal('hide');
	    	 }else{
	    	 	alert(data.msg);
	    	 	$("#login_psw").val('');
	    	 }   	 
	    }).then(function(){
	    	$("#login_psw").val('');
	    	$("#login_user").val('');
	    });
});
//注册按钮触发事件
$("#regist_btn").on('click',function(){
	event.preventDefault();
	var username = $("#regist_username").val().trim();
	var psw = $("#regist_Password1").val().trim();
	var psw_agin = $("#regist_Password2").val().trim();
	var email = $("#regist_email").val().trim();
	var params = {};
	params.username = username;
	params.pwd = psw;
	params.email = email;
	if (!params.username||!params.pwd||!params.email ) {
			 alert("不能为空！");
			 return
	};
	if (params.pwd != psw_agin) {
            alert("密码不一致！");
            $("#regist_Password1").val('');
            $("#regist_Password2").val('');
            return
    };
    //邮箱格式验证
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
	if (!reg.test(params.email)){
		alert("邮箱输入错误!");
		$("#regist_email").val('');
		return
	}
    $.post('/api/regist', params, function(data) {
	    	 
	    	 if (!data.code) {
	    	 	// location.href = "/login.html?username=" + params.username
	    	 	console.log("注册成功");
	    	 	$('#regist_m').modal('hide');
	    	 	$("#login_user").val(params.username);
	    	 	$('#login_m').modal('show');
	    	 }else{
	    	 	alert(data.msg);
	    	 };	    	
	    }).then(function(){
	    	$("#regist_username").val('');
	    	$("#regist_Password1").val('');
            $("#regist_Password2").val('');
	    	$("#regist_email").val('');
	    });
});
//注销功能
$("#login_status").on('click','#exit',function(){
	$.cookie('username',null, { expires: 7, path: '/' }); 
	check_login();
});
//检查是否登录
function check_login(argument) {
	// body...
	var user = $.cookie("username");
		if (user && user!= "null"){
			$("#login_status").html(`<span >${user}</span>
				<span id="exit" >注销</span> `);
			if(user == 'admin'){
				$("#nav_ul").append(`<li class="user_admin"><span>用户管理</span></li>`)
			}
		}
		else{
			$("#login_status").html(`<span id="login" data-toggle="modal" data-target="#login_m">登录</span>
				<span id="regist" data-toggle="modal" data-target="#regist_m">注册</span>`);
			$("#nav_ul").find('.user_admin').remove();
		}
}
//跳转到职位管理页面
$("#turn_to").on('click',function(){
	location.href="jobmannager.html";
});
//跳转到用户管理页面
$("#nav_ul").on('click','.user_admin',function(){
	location.href="userinfo.html";
});