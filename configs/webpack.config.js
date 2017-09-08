'use strict';

const fs = require( 'fs' );
const path = require('path');
const webpack = require( 'webpack' );
// const CommonChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"); 
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

const paths = require( './paths' );

// Folder path definition
// const ROOT_PATH = path.resolve(__dirname, '../');
// const NODE_MODULES_PATH = path.resolve( ROOT_PATH, 'node_modules' );
// const DIST_JS_shPATH = path.resolve( ROOT_PATH, 'dist/js' );
// const DIST_CSS_PATH = path.resolve( ROOT_PATH, 'dist/css' );
// const DIST_HTML_PATH = path.resolve( ROOT_PATH, 'dist' );
// const TEST_PATH = path.resolve( ROOT_PATH, 'test' );

// Judge if there's an argument '-p' or '--production' in command
let isProduction = false;
for(let i in process.argv) {
  if(process.argv[ i ] === '-p' || process.argv[ i ] === '--production') {
    isProduction = true;
    break;
  }
}
let outputName = isProduction ? 'u.all.min' : 'u.all';

var config = {
  entry: {
    [outputName]: [
      './src/componentA/componentA',
      './src/componentB/componentB'
    ],
    'componentA': './src/componentA/componentA',
    'componentB': './src/componentB/componentB',
//    '../componentA/test-componentA': './src/componentA/test-componentA',

  },
  output: {
    path: isProduction ? paths.prodJS : paths.testJS,
  //  publicPath: './',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  plugins: [
    // Abstract common chunks to vendor.js
    // new CommonChunkPlugin({name: 'vendors', filename:'vendors.js'}),
    // Clean dist folder before compiling
    // new CleanWebpackPlugin(paths.clean, {
    //   root: paths.root,
    //   verbose: true // open console information output
    // }),
    // new HtmlWebpackPlugin({
    //   title: 'Test Framework',
    //   filename: '../index.html',
    //   chunks: [outputName]
    // }),
    // new HtmlWebpackPlugin({
    //   title: 'Test ComponentA',
    //   filename: 'test-componentA.html',
    //   template: path.resolve(paths.src, 'test-component.ejs'),
    //   chunks: ['test-componentA']
//    }),
  // new HtmlWebpackPlugin({
  //   title: 'Test ComponentB',
  //   filename: '../html/test-componentB.html',
  //   chunks: ['componentB']
  // })
  ],
  // Use vendors form CDN
  externals: paths.vendorsFromCDN,
  module: {
    //noParse: [],

    loaders: [{
      // babel loader
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
      // include: DIST_JS_PATH,
      query: {
        presets: [
          'es2015', 
          'stage-1',
          'react' ],
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

  resolve: {
    extensions: [ '.js', '.jsx', '.css' ],
//    alias: {}
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

// console.log(typeof(config.plugins));

if(isProduction) {
  cleanPath.push(path.resolve(paths.distJS, '*.min.js'));

  // config.entry[outputName] = [
  //   './src/componentA/componentA',
  //   './src/componentB/componentB'
  // ];
  config.entry[ 'componentA' ] = './src/componentA/componentA';
  config.entry[ 'componentB' ] = './src/componentB/componentB';

config.plugins.push(new HtmlWebpackPlugin({
  title: 'Test APP',
  filename: '../index.html',
  chunks: [ outputName ]
}));

} else {

  config.plugins.push(new CleanWebpackPlugin('test', {
    root: paths.root,
    verbose: true // open console information output
  }));



  // config.entry[outputName] = [
  //   './src/componentA/componentA',
  //   './src/componentB/componentB'
  // ];
  let testEntry = {

  }

  config.entry['../componentA/test-componentA'] = './src/componentA/test-componentA';
  config.entry['../componentB/test-componentB'] = './src/componentB/test-componentB';


  config.plugins.push(new HtmlWebpackPlugin({
    title: 'Test framework',
    filename: path.resolve(paths.testHTML, 'index.html'),
    template: paths.defaultTemplate,
    chunks: [ outputName ],
    hash: true,
    chunksSortMode: function() {console.log(arguments)}
  }));

  config.plugins.push(new HtmlWebpackPlugin({
    title: 'Test componentA',
    //filename: 'componentA/test-componentA.html',
    filename: path.resolve(paths.testHTML, 'componentA/test-componentA.html'),
    template: paths.defaultTemplate,
    chunks: [ '../componentA/test-componentA'],
    hash: true
  }));


  config.plugins.push(new HtmlWebpackPlugin({
    title: 'Test componentB',
    //filename: 'componentB/test-componentB.html',
    filename: path.resolve(paths.testHTML, 'componentB/test-componentB.html'),
    template: paths.defaultTemplate,
    chunks: [ '../componentB/test-componentB' ],
    hash: true
  }));


}

// Use vendors form local
// Use compressed versions in packaging
if(paths.vendorsFromLocal.length) {
  config.resolve.alias = new Object();
  config.module.noParse = new Array();

  paths.vendorsFromLocal.forEach(function(vendor) {
    var vendorPath = path.resolve(paths.nodeModules, vendor);
    config.resolve.alias[vendor.split(path.sep)[0]] = vendorPath;
    config.module.noParse.push(vendorPath);
  } );
}

function sef(sd, dd) {

}

var t = fs.readdirSync(paths.src);
var subDir = {};

fs.readdirSync(paths.src).forEach(function(item) {
//  console.log(item);
  let p = path.resolve(paths.src, item);
  let s = fs.statSync(p);
  if(s.isDirectory()) {
    subDir[item] = path.resolve(p, item);
  }
});

console.log(subDir);







module.exports = config;
