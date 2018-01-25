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
loadlist();
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
      storage.page = 1;
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
//加载列表
function loadlist(argument) {
  $.post('/userinfo',function(data){
    var html = template("listTemp",data);
     $("#job_list").append(html);
  }).then(()=>{//从页面剔除超级管理员的数据
     var l = $("#job_list").find('.add_').length;
     for(let i = 0;i < l;i++){
      if($($("#job_list").find('.add_')[i]).find('.username').text() == 'admin'){
          $($("#job_list").find('.add_')[i]).remove();
      }
     }
  })
}
//点击修改按钮
$("#job_list").on('click','.update',function(){
  var  username = $(this).parents('.add_').find('.username').text();
  var  email = $(this).parents('.add_').find('.useremail').text();
  $("#username").val(username);
  $("#useremail").val(email);
})
//确认修改
$("#update_btn").on('click',function(){
  var email = $("#useremail").val().trim();
  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
  if (!reg.test(email)){
   $("#useremail").val('');
    alert("邮箱输入错误!");
    return
  }
  if($("#userpsw").val() != $("#userpsw_again").val()){
    alert('请两次输入一致的密码');
    $("#userpsw").val('');
    $("#userpsw_again").val('');
    return
  }
  var parmes = {};
  $.post('/userinfo/update',parmes,function(data){

  });
});