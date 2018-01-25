var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var upload = require("./util/upload");

mongoose.Promise = global.Promise; //node下面 没有 window ，全局是global
mongoose.connect("mongodb://10.7.187.61:27017/songyufeng")//为了兼容老的mongdb链接，加了以后mongoose会帮我们增加很多配置
        .then(function(db){
        	console.log("数据库链接成功！")
        })
// mongoose.connect("mongodb://127.0.0.1:27017/songyufeng")//寝室用
//         .then(function(db){
//             console.log("数据库链接成功！")
//         })
var app = express(); //使用expree 工厂函数
var User = require('./model/user');
var Info = require('./model/jobinfo')
app.use(express.static("html"));
app.use(express.static("uploadcache"));
app.use(express.static("bootstrap-3.3.7-dist"));
app.use(express.static("js"));
app.use(express.static("css"));
//使用插件
app.use(bodyParser.json())//处理post请求的参数为json格式
app.use(bodyParser.urlencoded({ //处理post请求为form表单格式
   extended: true
}));
//处理前端路径为/api/login的post请求
app.post("/api/login",function(req,res){
    //查询是否有这个用户
    let {username,pwd} = req.body;
    User.find({username},function(err,doc){
        //console.log(doc)
        if (doc.length) {
            if(doc[0].pwd != pwd){
            	  res.json({
		    	       code:1,
		    	       msg:"密码错误"
		          })
		        return
            }
                 res.json({
		    	       code:0,
		    	       msg:"登陆成功"
		          })
        }else{
          res.json({
    	       code:1,
    	       msg:"用户名不存在"
          }) 

        };
    });
})
//处理用户注册
app.post("/api/regist",function(req,res){
    //获取到了数据，要存到数据库了
   // console.log(req.body)
    let {username,pwd,email} = req.body;
    //创建usermodel实例
	 var  u =  new User({
	    	username, 
	    	pwd,
	    	email
	    });
    //判断是否有重名的情况
    User.find({username},function(err,doc){
    	if(doc.length){
		 	res.json({
    	       code:1,
    	       msg:"用户名已存在"
            })
            return;
    	}
    	 u.save(function(err,doc){
         if (err) {
         	console.log(err);
         	return
         };
         res.json({
             code:0,
             msg:"注册成功"
         })
    });//保存到数据库
    })
});
//处理用户信息调用
app.post('/userinfo',function(req,res){
    User.find({},function(err,doc){
       if (err) {
            console.log(err);
            return
         };
         res.json({
             code:0,
             list:doc
         })
    })
})
//处理上传图片
app.post('/upload',  function(req,res) {
	/*optional stuff to do after success */
	upload.upload(req,res);
});
//处理职位信息存储
app.post('/upload/jobinfo',function(req,res){
	let{jobname,companyname,jobex,jobtype,jobplace,money,img,user} = req.body;
	var i = new Info({
		jobname,
		companyname,
		jobex,
		jobtype,
		jobplace,
		money,
		img,
		user
	});
	i.save(function(err,doc){
         if (err) {
         	console.log(err);
         	return
         };
         res.json({
             code:0,
             msg:doc
         })
	});
});
//处理职位加载列表
app.post('/api/jobinfo',function(req,res){
	var {user} = req.body;
	if (user == 'admin'){
		Info.count({},function(err,num){
         if (err) {
         	return
         };
         res.json({
         	code:0,
         	num:num
         })
	})
	}else{
	Info.count({user},function(err,num){
         if (err) {
         	return
         };
         res.json({
         	code:0,
         	num:num
         })
	})
}
});
//处理职位列表翻页
app.post('/api/pages',function(req,res){
	var {user,page} = req.body;
	if(user == "admin"){
		Info.find({},null,{skip: (page-1)*5, limit: 5},function(err,doc){
         if (err) {
         	return
         };
         res.json({
         	code:0,
         	list:doc
         })
	})
	}else{
		Info.find({user},null,{skip: (page-1)*5, limit: 5},function(err,doc){
         if (err) {
         	return
         };
         res.json({
         	code:0,
         	list:doc
         })
	})
	}
	
});
//处理职位修改
app.post('/update/jobinfo',function(req,res){
	let{_id,jobname,companyname,jobex,jobtype,jobplace,money,img} = req.body;
	Info.findOneAndUpdate({_id},{jobname,companyname,jobex,jobtype,jobplace,money,img},{new:true},function(err,doc){
		if (err) {
        	return
        };
        res.json({
        	code:0,
        	msg:doc
        })
	})
});
//处理职位删除
app.post('/delete/jobinfo',function(req,res){
	var _id = req.body;
	Info.findOneAndRemove({_id},function(err,doc){
        if (err) {
        	return
        };
        res.json({
        	code:0,
        	msg:"删除成功"
        })
    })
});
app.listen(8090,function(){
	console.log("启动成功！")
});