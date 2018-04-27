// htmlAfterWebpackPlugin.js 
/*
 *@Des  开发一个插件 帮助我们把css-js插入到对应的swig模板
 *
 */
function htmlAfterWebpackPlugin(options) {}
/*
 *1.静态资源的一个数组
 *2.type 文件类型
 */
function assetsHelper(arrs, type) {
	let result={
		jsstr:[],
		cssstr:[]
	}
	const dir = {
		js: item => `<script src="${item}"></script>`,
		css: item => `<link rel="stylesheet" href="${item}">`
	}
	for(let jsdata of arrs.js){
		result.jsstr.push(dir.js(jsdata))
	}
	for(let cssdata of arrs.css){
		result.cssstr.push(dir.css(cssdata));
	}
	// const result = dir[type] && dir[type]();
	return result;
}
htmlAfterWebpackPlugin.prototype.apply = function(compiler) {
	compiler.plugin('compilation', (compilation) => {
		compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData,callback)=>{
			let _html = htmlPluginData.html; //html文件
			let result=assetsHelper(htmlPluginData.assets)//资源文件
			//layout公用模板，一般都是指定的公用CDN资源，
			let isBase = htmlPluginData.outputName.includes('./layout.html');
			if(!isBase){
				_html=_html.replace('{{css}}',result.cssstr.join(""));			
				_html=_html.replace('{{js}}',result.jsstr.join(""));	
			}		
			htmlPluginData.html = _html;
			callback(null,htmlPluginData);
		});
	});

};

module.exports = htmlAfterWebpackPlugin;