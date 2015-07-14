var url=require('url')
var request=require('request')
var util=require('util')
var express=require('express')
var request=require('request')

module.exports.create=function(options,callback){
	var app=express();
	app.use('/',function(req,res){
		req.url=req.protocol + '://' + req.headers.host +  req.url
		console.log(req.url)
		var url=module.exports.resolveUrl(req.url,options.host)
		console.log('url to request:',url)
		request({
			url:url
		},function(err,obj,body){
			res.write(body)
			res.end();
		})
	})
	app.listen(options.port || 80,options.ip)
}

module.exports.createUrl=function(inurl,host){
	inurl=url.parse(inurl);	
	return inurl.protocol + '//' + inurl.host.replace(/-/g,'--').replace(/\./g,'-') + '.' + host + inurl.path
}

module.exports.resolveUrl=function(inurl,host){
	inurl=url.parse(inurl);	
	return inurl.protocol + '//' + inurl.host.replace('.' + host,'').replace(/--/g,'@@').replace(/-/g,'.').replace(/@@/g,'-') + inurl.path	
}