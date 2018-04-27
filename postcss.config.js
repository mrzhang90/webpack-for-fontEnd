// module.exports = {
//     plugins: [
//         require('postcss-cssnext'),
//         require('postcss-css-variables'),
//         require('precss')
//     ]
// }


const cssnext = require('postcss-cssnext');
//处理基础的变量
const cssvariables = require('postcss-css-variables');
//预处理的css-类似sass,向写js一样写css
// const precss = require('precss');
const postcssPresetEnv = require('postcss-preset-env');
module.exports = {
	plugins: [
		//浏览器向上3个版本,生成对应的css
		// postcssPresetEnv({}),
		postcssPresetEnv({
			browsers: 'last 2 versions'
		}),
		cssnext({}),
		cssvariables({})
		// require('precss')
		// require('cssnext'),
		// require('cssvariables')
	]
}