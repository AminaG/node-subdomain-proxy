var assert=require('assert');
var request=require('request');
var async=require('async');
var subdomain_proxy=require('../index.js');

var host='home.bua.co.il';


describe('node-subdomain.proxy',function(){

	it('createUrl',function(){
		assert.equal(
		subdomain_proxy.createUrl('http://www.this-page-intentionally-left-blank.org',host),'http://www-this--page--intentionally--left--blank-org.' + host  + '/'
		)
		assert.equal(
		subdomain_proxy.createUrl('http://www.this-page-intentionally-left-blank.org/',host),'http://www-this--page--intentionally--left--blank-org.' + host  + '/'
		)
		assert.equal(
		subdomain_proxy.createUrl('http://www.this-page-intentionally-left-blank.org/?a=b',host),'http://www-this--page--intentionally--left--blank-org.' + host + '/?a=b'
		)
		assert.equal(
		subdomain_proxy.createUrl('http://www.this-page-intentionally-left-blank.org/?a=b.c',host),'http://www-this--page--intentionally--left--blank-org.' + host + '/?a=b.c'
		)
		assert.notEqual(subdomain_proxy.createUrl('htp://www.this-page-intentionally-left-blank.org/?a=b.c'))
	})	
	it('resolveUrl',function(){
		
		assert.equal(
		subdomain_proxy.resolveUrl('https://www-this--page--intentionally--left--blank-org.' + host + '/',host),'https://www.this-page-intentionally-left-blank.org/'
		)
		assert.equal(
		subdomain_proxy.resolveUrl('https://www-this--page--intentionally--left--blank-org.' + host  + '/',host),'https://www.this-page-intentionally-left-blank.org/'
		)
		assert.equal(
		subdomain_proxy.resolveUrl('https://www-this--page--intentionally--left--blank-org.' + host + '/?a=b',host),'https://www.this-page-intentionally-left-blank.org/?a=b'
		)
		assert.equal(
		subdomain_proxy.resolveUrl('https://www-this--page--intentionally--left--blank-org.' + host + '/?a=b.c',host),'https://www.this-page-intentionally-left-blank.org/?a=b.c'
		)
		assert.notEqual(subdomain_proxy.resolveUrl('htp://www.this-page-intentionally-left-blank.org/?a=b.c'))
	})	

	it('test proxing many sites',function(done){
		subdomain_proxy.create({
			host:host
		})

		var sites=[
			'http://www.this-page-intentionally-left-blank.org',
			'http://www.google.com'
		]
		this.timeout(5000);

		async.each(sites,function(site,next){
			console.log(subdomain_proxy.createUrl(site,host))
			request({
				url:site
			},function(err,obj,body){
				request({
					url:subdomain_proxy.createUrl(site,host)
				},function(err,obj,_body){
					assert.equal(err,null,err)
					assert.ok(Math.abs(body.length-_body.length)<body.length/10)
					next();
				})
			})
		},function(){
			done();
		})
	})
})