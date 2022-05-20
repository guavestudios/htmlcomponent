module.exports = function (grunt) {
	/**
	 * searchcomponent
	 *
	 * ## Options ##
	 * components: basic key where the components array should be stored
	 * [files]: standard grunt files as paths where to look for the components
	 */
	grunt.registerMultiTask('searchcomponent',function(){
		var opts=this.options({
			components: "jsComponents"
		});

		var pattern=/data-hc\=[\"\'](.*?)[\"\']/g;
		var componentsMap={};

		//read each file and find components
		this.files.forEach(function(file){
			file.src.forEach(function(fp){
				var c=grunt.file.read(fp);
				var res;
				while(res=pattern.exec(c)){
					componentsMap[res[1]]=true;
				}
			});
		});

		grunt.log.writeln("found components: "+Object.keys(componentsMap).join(", "));

		var comps=grunt.config.get(opts.components) || [];
		comps=comps.concat(Object.keys(componentsMap));
		grunt.config.set(opts.components, comps);
	});

	grunt.registerTask('component-static','this task is needed for inline components',function(){
		var opts = this.options({
			outfile: "../dist/static.js",
			componentsKey: "jsComponents",
			htmlcomponent: "htmlcomponent",
			main: "app/main",

		});
		var outfile = opts.outfile;
		var components=grunt.config.get(opts.componentsKey) || [];
		var htmlcompKey=opts.htmlcomponent;
		var mainKey=opts.main;
		var params=[htmlcompKey, mainKey].concat(components).map(function(v){return '"'+v+'"'});
		var str="define([{0}],function(hc, m) {\n".replace("{0}", params.join(","));

		//build the map
		str+="var map={}; \n";
		str+=components.map(function(v,i){
			return "map['{0}']=arguments[{1}];".replace("{0}", v).replace("{1}", i+2);
		}).join("\n")+"\n";

		//init component
		str+="hc.setStaticLoader(map);\n";
		str+="typeof m == 'function' && m('build');\n";
		str+="typeof m == 'object' && typeof m.default == 'function' && m.default('build');\n";
		str+="return map;";
		str+="});";
		grunt.file.write(outfile,str);
	});

	grunt.registerMultiTask('component-static-webpack','this task is needed for inline components',function(){
		var opts = this.options({
			outfile: "../dist/static.js",
			componentsKey: "jsComponents",
			htmlcomponent: "htmlcomponent",
			main: "app/main",
			compRoute: '@/'
		});
		var outfile = opts.outfile;
		var components=grunt.config.get(opts.componentsKey) || [];
		var htmlcompKey=opts.htmlcomponent;
		var mainKey=opts.main;
		var params=[].concat(components);

		var str = params.reduce(function(p, c, i) {
			return p + "import {0} from '{1}'\n".replace("{0}", "comp"+i).replace("{1}", opts.compRoute + c);
		}, "")

		//build the map
		str+="var map={}; \n";
		str+=components.map(function(v,i){
			return "map['{0}']=comp{1};".replace("{0}", v).replace("{1}", i);
		}).join("\n")+"\n";

		str+="export default map;"
		grunt.file.write(outfile,str);
	});
};
