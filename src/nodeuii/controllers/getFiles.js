const fs = require('fs');
const path = require('path');
/** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */
function fileDisplay(filePath) {
	const jsEntris = {};
	const htmlFiles = [];
	var fn=function(filePath){
		fs.readdirSync(filePath).map((filename, o) => {
			var filedir = path.join(filePath, filename);
			var stats = fs.statSync(filedir);
			var isFile = stats.isFile();
			var isDir = stats.isDirectory();
			if (isDir) {
				fn(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件  
			} else if (isFile) {
				if (filedir.indexOf('.html') != -1) {
					var parentDir=filedir.indexOf('views')!=-1?"":"widget";
					htmlFiles.push({
						[path.join("./",parentDir+'/'+filename)]:filedir
					})
				}
				if (/.entry.js$/.test(filedir)) {
					jsEntris[filename.replace(".entry.js", "")] = filedir
				}
			}
		});
	}
	fn(filePath);
	return {jsEntris,htmlFiles};
}
module.exports=fileDisplay;