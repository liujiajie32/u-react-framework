'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
// const CommonChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"); 
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Folder path definition
const ROOT_PATH = path.resolve(__dirname, '../');
const NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');
const DIST_JS_PATH = path.resolve(ROOT_PATH, 'dist/js');
const DIST_CSS_PATH = path.resolve(ROOT_PATH, 'dist/css');
const DIST_HTML_PATH = path.resolve(ROOT_PATH, 'dist');
const TEST_PATH = path.resolve(ROOT_PATH, 'test');


// Judge if there's an argument '-p' or '--production' in command
var isProduction = false;
for (let i in process.argv) {
  if (process.argv[i] === '-p' || process.argv[i] === '--production') {
    isProduction = true;
    break;
  }
}
var outputName  = isProduction ? 'u.all.min' : 'u.all';

var cleanPath = [
  // path.resolve(ROOT_PATH, '*.zip'),
  // path.resolve(DIST_HTML_PATH, '*.html'),
];




var config = {
  entry:  {
    [outputName]: [
      './src/componentA/componentA',
      './src/componentB/componentB'
    ],
/*   
    'componentA': './src/componentA/componentA',
    'componentB': './src/componentB/componentB',
    //'test-componentA': './src/componentA/test-componentA',
*/ 
  },
  output: {
    path: isProduction ? DIST_JS_PATH : TEST_PATH,
    filename: '[name].js'
  },
  plugins: [
    // Abstract common chunks to vendor.js
    // new CommonChunkPlugin({name: 'vendors', filename:'vendors.js'}),
    // Clean dist folder before compiling
    new CleanWebpackPlugin(cleanPath, {
      root: ROOT_PATH,
      verbose: true // open console information output
    }),
    // new HtmlWebpackPlugin({
    //   title: 'Test APP',
    //   filename: '../html/index.html',
    //   chunks: [outputName]
    // }),
    // new HtmlWebpackPlugin({
    //   title: 'Test ComponentA',
    //   filename: '../html/test-componentA.html',
    //   template: path.resolve(ROOT_PATH, './src/componentA/test-componentA.ejs'),
    //   chunks: ['test-componentA']
    // }),
    // new HtmlWebpackPlugin({
    //   title: 'Test ComponentB',
    //   filename: '../html/test-componentB.html',
    //   chunks: ['componentB']
    // })
  ],

  externals: [{
    'react': 'React',
    'react-dom': 'ReactDOM'
  }],
  module: {
    loaders:[{
      // babel loader
      test:/\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
      // include: DIST_JS_PATH,
      query: {
        presets: ['es2015', 'stage-1', 'react'],
        plugins: [
          ["transform-runtime", {
            "helpers": false,
            "polyfill": true,
            "regenerator": true
          }],
          "add-module-exports",
          "transform-es3-member-expression-literals",
          "transform-es3-property-literals"
        ]
      }
    }]
  },

  resolve:{
    extensions:['.js', '.jsx', '.css']
  }

}

// // 遍历所有.html文件，使用HtmlWebpackPlugin将资源文件引入html中
// var htmlfiles = fs.readdirSync(HTML_ROOT_PATH);
// htmlfiles.forEach(function (item) {
//     var currentpath = path.join(HTML_ROOT_PATH, item);
//     //console.log(currentpath);
//     var extname = path.extname(currentpath);
//     if (fs.statSync(currentpath).isFile()) {
//         //console.log("replace", currentpath.replace("\\html\\", "\\dist\\"))
//         config.plugins.push(new HtmlWebpackPlugin({
//             title: '',
//             template: currentpath,
//             filename: currentpath.replace("\\html\\", "\\dist\\"),
//             minify: isprod ? htmlMinifyOptions : false, // 生产模式下压缩html文件
//             //chunks: ['index', 'vendors'],   // 配置该html文件要添加的模块
//             inject: 'body'
//         }))
//     }
// });

console.log(typeof(config.plugins));

if(isProduction) {
  cleanPath.push(path.resolve(DIST_JS_PATH, '*.min.js'));

  // config.entry[outputName] = [
  //   './src/componentA/componentA',
  //   './src/componentB/componentB'
  // ];
  config.entry['componentA'] = './src/componentA/componentA';
  config.entry['componentB'] = './src/componentB/componentB';

  config.plugins.push(new HtmlWebpackPlugin({
    title: 'Test APP',
    filename: '../index.html',
    chunks: [outputName]
  }));

} else {
  // cleanPath.push(path.resolve(DIST_JS_PATH, '*.js'));

  // config.entry[outputName] = [
  //   './src/componentA/componentA',
  //   './src/componentB/componentB'
  // ];

  config.entry['componentA/test-componentA'] = './src/componentA/test-componentA';
  config.entry['componentB/test-componentB'] = './src/componentB/test-componentB';

  config.plugins.push(new HtmlWebpackPlugin({
    title: 'Test ComponentA',
    filename: './test-componentA.html',
    template: path.resolve(ROOT_PATH, './src/componentA/test-componentA.ejs'),
    chunks: ['componentA/test-componentA']
  }));

  config.plugins.push(new HtmlWebpackPlugin({
    title: 'Test ComponentB',
    filename: './test-componentB.html',
    template: path.resolve(ROOT_PATH, './src/componentB/test-componentB.ejs'),
    chunks: ['componentB/test-componentB']
  }));


}

console.log(typeof(config.plugins));


module.exports = config;
