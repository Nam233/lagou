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
var $InputFile = $("#InputFile"),$showImg = $("#showImg"),$jobname = $("#jobname"),$cpname = $("#cpname"),
$jobtype = $("#jobtype"),$jobstr = $("#jobstr"),$salary = $("#salary"),$jobexp = $("#jobexp");
//加载页面前检查登录cookie
check_login();
var info_count;
var page_num = 1;
var storage=window.localStorage;
load_pages();
load_list(storage.page);
$("#update_btn").hide();
//进入加载数据
//加载列表
function load_list(page=1) {
	$.post('/api/pages',{user:$.cookie('username'),page:page} ,function(data) {
	//console.log(data);
	//第二个参数必须是对象
	
	if (!data.list.length){
		check_info();
		return;
	} 
	var html = template("listTemp",data);
     $("#job_list").append(html); 
     change_index(page); 
     check_info();
});
}
//首先获取全部数据加载分页
function load_pages() {
	// body...
	$.post('/api/jobinfo',{user:$.cookie('username')},function(data){
		if(data.num !=0){
		info_count = data.num;
	}else{
		info_count = 1;
	}
}).then(function(){
	$('.M-box1').pagination({
    totalData: info_count,
    showData: 5,
    coping: true,
    isHide:true,
    current:storage.page,
    //点击页码执行的回调函数
    callback: function (api) {
    	$(".add_").remove();
    	storage.page = api.getCurrent()
        load_list(storage.page);
    }
});
});
}

//检查登录函数
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
			alert("请先登录");
			location.href="index.html";
		}
}
//注销功能
$("#login_status").on('click','#exit',function(){
	$.cookie('username',null, { expires: 7, path: '/' }); 
	storage.page = 1;
	check_login();
});
//动态上传公司图片
$("#InputFile").on('change',function(e){
	e.preventDefault();
	//判断用户是否上传的是图
        var file = this.files[0];
        if(file&&file.type=="image/png"||file.type=="image/jpeg"){
        	//开始上传
        	var form = new FormData(); //返回一个假的form对象
        	form.append("upload",file);
        	$.ajax({
        		url: '/upload',
        		type: 'POST',
        		dataType: 'json',
        		data: form,
        		contentType: false, //发送信息到服务器的内容类型 告诉jq不要去设置Content-Type请求头//默认是 application/x-www-form-urlencoded （form类型） 
		        processData: false, //processData 是jq 独有的参数 用于对data参数进行序列化处理，默认值是true，
		                     //所谓序列化 就是比如{ width:1680, height:1050 }参数对象序列化为width=1680&height=1050这样的字符串。
        	})
        	.done(function(res) {
        		//console.log(res);
        		if (!res.code) {
        			$("#showImg").attr({
        				src: res.img
        			});
        		};
        	})
        }
});
//跳转首页
$("#turn_to").on('click',function(){
	location.href="index.html";
});
//弹出添加框
$(".tj").on('click',function(){
	$("#update_btn").hide();
	$("#add_btn").show();
	$('input').val('');
	$('.modal img').attr('src','');
})
//提交职位信息
$("#add_btn").on('click',function(){
	var img = $showImg.attr('src');
	var jobname = $jobname.val();
	var companyname = $cpname.val();
	var jobtype = $jobtype.val();
	var jobexp = $jobexp.val();
	var jobstr = $jobstr.val();
	var salary = $salary.val();
	var params = {};
	params.jobname = jobname;
	params.companyname = companyname;
	params.jobex = jobexp;
	params.jobtype = jobtype;
	params.jobplace = jobstr;
	params.money = salary;
	params.img = img;
	params.user = $.cookie('username'); 
	if(!params.jobname||!params.companyname ||!params.jobex||!params.jobtype||!params.jobplace||!params.money||!params.img){
		alert("请输入全部信息");
		return;
	}
	//存储数据库
	$.post('/upload/jobinfo',params,function(res){
		$('input').val('');
		$("#job_box").modal("hide");
		if($(".add_").length<5){
			//添加列表
			var html = template("listTemp",{list:[res.msg]});
			$("#job_list").append(html);
			change_index(storage.page);
			check_info();
		}else{
			load_pages();
		}
	});
});
//修改内容弹出框点击修改的填充进编辑框
$("#job_list").on('click','.update',function(){
	$("#add_btn").hide();
	$("#update_btn").show();
	$("#update_btn").attr('data-id',this.dataset.id);
	var parent = $(this).parents('.add_');
	$showImg.attr('src',parent.find('img').attr('src'));
	$jobname.val(parent.find('.jobname').text());
	$cpname.val(parent.find('.cpname').text());
	$jobexp.val(parent.find('.jobexp').text());
	$jobtype.val(parent.find('.jobtype').text());
	$jobstr.val(parent.find('.jobstr').text());
	$salary.val(parent.find('.salary').text());
});
//点击修改按钮修改更新数据库
$("#update_btn").on('click',function(){
	var img = $showImg.attr('src');
	var jobname = $jobname.val();
	var companyname = $cpname.val();
	var jobtype = $jobtype.val();
	var jobexp = $jobexp.val();
	var jobstr = $jobstr.val();
	var salary = $salary.val();
	var params = {};
	params.jobname = jobname;
	params.companyname = companyname;
	params.jobex = jobexp;
	params.jobtype = jobtype;
	params.jobplace = jobstr;
	params.money = salary;
	params.img = img;
	params._id = this.dataset.id;
	if(!params.jobname||!params.companyname ||!params.jobex||!params.jobtype||!params.jobplace||!params.money||!params.img){
		alert("请输入全部信息");
		return;
	}
	$.post('/update/jobinfo',params,(res)=>{
		$('input').val('');
		$("#job_box").modal("hide");
		$('#update_btn').hide();
		$('#add_btn').show();
		var html = template('listTemp',{list:[res.msg]});
		//修改当前dom元素的显示
		$("span.update[data-id="+params._id+"]").parents('.add_').replaceWith(html);
	});
});
//点击删除按钮删除该条记录
$("#job_list").on('click','.del',function(){
	$.post('/delete/jobinfo',{_id:this.dataset.id},(data)=>{
		
		if($(".add_").length == 1){
			if(storage.page !=1){
				storage.page -= 1
			}
			load_pages();
			$(this).parents('.add_').remove();
			load_list(storage.page);
		}else{
			$(this).parents('.add_').remove();
			change_index(storage.page);
		}
	});
})
//遍历序号自动修改
function change_index(page_num) {
	// body...
	for(let i = 0,l = $(".add_").length;i<l;i++){
		$($(".add_")[i]).find('._index').text(i+1+(page_num-1)*5);
	}
}
//跳转到用户管理页面
$("#nav_ul").on('click','.user_admin',function(){
	location.href="userinfo.html";
});
//检查是否有数据
function check_info(argument) {
	console.log($("#job_list").find(".add_").length)
	if($("#job_list").find(".add_").length == 0){
		$("#job_list").after(`<p id="null_info">请先添加数据</p>`);
	}else{
		console.log("2");
		$(".warp").find('#null_info').remove();
	}
}