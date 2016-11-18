/*
	HTMLCOMPONENT
	TODO: this file will be restructured since we use now rollup

	EXPOSED API:
	//query
	htmlcomponent.query

	//component events
	htmlcomponent.listen
	htmlcomponent.unlisten
	htmlcomponent.send

	//component data
	htmlcomponent.set
	htmlcomponent.get

	//loader
	htmlcomponent.setStaticLoader

 */
var global=window;
var map={};

var listeners=[];
var data={};

var config={
	autoinit:false,
	observe: false,
	attr:"data-hc",
	attrData:"data-hcd",
	attrInit:"data-hci",
	promiseLoader:(window.System&&window.System.import.bind(window.System))
		||function(id){
			throw new Error("htmlcomponent: no alternative loader");
		}
};
if (global.htmlcomponent){
	for (var i in config){
		config[i]=global.htmlcomponent.config[i]||config[i];
	}
}

//current arch function
function htmlcomponent(id,rest){
	config.promiseLoader(id).then(function(c){
		if (typeof c=="function") c.apply(this,args);
	});
}
htmlcomponent.config=config;

//query tree for components
function query(scope){
	if (!scope) scope=document;

	var list=document.querySelectorAll("["+config.attr+"]");
	for (var i=0,ilen=list.length; i<ilen; i++){
		var c=list[i];
		createComponent(c);
	}
	if (scope.nodeType == 1 && scope.hasAttribute(config.attr)) {
		createComponent(scope);
	}
}

//read basic component
function createComponent(c) {
	var n=c.getAttribute(config.attr);
	var d=c.getAttribute(config.attrData);
	var sd=c.firstElementChild&&c.firstElementChild.nodeName=="SCRIPT"&&c.firstElementChild.getAttribute(config.attrData)!=null&&c.firstElementChild.innerHTML;
	var data=null;
	if (d){
		data=JSON.parse(d);
	} else if (sd){
		data=JSON.parse(sd);
	}

	initComponent(n, c, data);

	c.setAttribute(config.attr+"i",n);
	c.removeAttribute(config.attr);
}

//init basic component
function initComponent(id,el,data){
	config.promiseLoader(id).then(function(n){
		n&&n(el,data);
	});
}

//shortcut to set static loader map
function setStaticLoader(map) {
	config.promiseLoader = function(id) {
		return {
			then: function(cb) {
				setTimeout(function(){
					cb(map[id]);
				},0);
			}
		};
	}
}

htmlcomponent.query=query;
htmlcomponent.setStaticLoader=setStaticLoader;


//data
function dataSet(id,value){
	data[id]=value;
}
function dataGet(id){
	return data[id];
}
htmlcomponent.set=dataSet;
htmlcomponent.get=dataGet;

//events
function send(event,data){
	var list=listeners[event];
	if (list){
		list.forEach(function(v){
			v(event,data);
		});
	}
}
function listen(event,fnc){
	var list=listeners[event];
	if (!list) list=listeners[event]=[];
	list.push(fnc);

}
function unlisten(event,fnc){
	var list=listeners[event];
	if (list){
		list.splice(list.indexOf(fnc),1);
	}
}
htmlcomponent.send=send;
htmlcomponent.listen=listen;
htmlcomponent.unlisten=unlisten;

global.htmlcomponent=htmlcomponent;

//use mutationobserver to initialize later components
if (window.MutationObserver && config.observe) {
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			//check for all dom modifications
			if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
				for (var i = 0, ilen = mutation.addedNodes.length; i < ilen; i++) {
					var node = mutation.addedNodes[i];

					if (node.nodeType == 1 && node.hasAttribute(config.attr)) {
						htmlcomponent.query(node);
					}
				}
			}
		});
	});

	observer.observe(document, {subtree:true, attributeFilter: [config.attr], childList: true});
}

// AUTOINITIALIZER
if (config.autoinit) {
	htmlcomponent.query(document);
}

// expose api
export default htmlcomponent;
