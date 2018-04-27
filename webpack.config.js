const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const htmlAfterWebpackPlugin = require('./config/htmlAfterWebpackPlugin');
const getFiles=require('./src/nodeuii/controllers/getFiles.js');
const entriePath = path.join(__dirname, './src/web/views/');
const htmlPath = path.join(__dirname, './src/web/');
const jsEntris = getFiles(entriePath)
const _entries = Object.assign(jsEntris.jsEntris);
const _resolve = {
	extensions: [".js", ".css"]
}
const imgloader = {
	test: /\.(png|jpg|gif)$/,
	loader: 'file-loader?name=images/[name].[ext]'
};
const fontloader = {
	test: /\.(eot|woff|woff2|ttf|svg|otf)$/,
	loader: 'file-loader?name=fonts/[name].[ext]'
};
const htmlFiles = getFiles(htmlPath).htmlFiles;
console.log(_entries)
const webpackConfig = {
	entry: _entries,
	output: {
		path: path.join(__dirname, './build/'),
		publicPath: '/',
		filename: 'scripts/[name]-entry.js',
		chunkFilename: '[id].bundle.js',
	},
	module: {
		rules: [ 
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					"presets": [
						['env', {
							'modules': false //很重要,这样设置后，webpack执行删除无用代码、优化代码都才会生效
						}]
					]
				}
			},
			{ //告诉webpack,在解析到路径为.css文件，用style-loader、css-loader、postcss-loader
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader!postcss-loader"
				})
			},
			// {
			//   test: require.resolve('jquery'),  // 此loader配置项的目标是NPM中的jquery
			//   loader: 'expose-loader?$!expose-loader?jQuery', // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
			// },
			imgloader,
			fontloader
		]
	},
	resolve: _resolve,
	plugins:[
		/* 抽取出所有通用的部分 */
		new webpack.optimize.CommonsChunkPlugin({
			name: 'commons/commons',      // 需要注意的是，chunk的name不能相同！！！
			filename: 'scripts/[name]-bundle.[chunkhash].js',
			minChunks: 2,
		}),
		/* 全局shimming */
		// new webpack.ProvidePlugin({
		// 	$: 'jquery',
		// 	jQuery: 'jquery',
		// 	'window.jQuery': 'jquery',
		// 	'window.$': 'jquery',
		// 	Vue: 'vue',
		// 	vue: 'vue',
		// }),
		new ExtractTextPlugin("styles/[name].css"),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
		})
	]
}
for(let i=0,len=htmlFiles.length;i<len;i++){
	let _obj=htmlFiles[i]
	let filename=Object.keys(_obj)
	let filepath=_obj[filename]
	webpackConfig.plugins.push(
		new HtmlWebpackPlugin({
			filename: filename[0],//要去生成的文件
			template:filepath,//原始的要去读的文件
			inject:false//不要默认的把js插进来，我自定义 控制模板的顺序
		})
	)
}
//自己写的插件-把swig里的cssjs标记替换为真正引用的cssjs
webpackConfig.plugins.push(
	new htmlAfterWebpackPlugin({})
)
module.exports = webpackConfig;