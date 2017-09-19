'use strict';

const fs = require( 'fs' );
const path = require('path');
const webpack = require( 'webpack' );
// const CommonChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"); 
const cleanWebpackPlugin = require( 'clean-webpack-plugin' );
const htmlWebpackPlugin = require( 'html-webpack-plugin' );
const paths = require( './paths' );

// Judge if there's an argument '-p' or '--production' in command
let isProduction = false;
for(let i in process.argv) {
  if(process.argv[ i ] === '-p' || process.argv[ i ] === '--production') {
    isProduction = true;
    break;
  }
}
let outputName = 'u';

var config = {
  entry: {
    'u': './src/u.all'
  },
  output: {
    path: isProduction ? paths.distJS : paths.testHTML,
  //  publicPath: './',
    filename: isProduction ? '[name].min.js' : '[name].js',
    library: '[name]',
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
    // new htmlWebpackPlugin({
    //   title: 'Test Framework',
    //   filename: '../index.html',
    //   chunks: [outputName]
    // }),
    // new htmlWebpackPlugin({
    //   title: 'Test ComponentA',
    //   filename: 'test-componentA.html',
    //   template: path.resolve(paths.src, 'test-component.ejs'),
    //   chunks: ['test-componentA']
//    }),
  // new htmlWebpackPlugin({
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
      exclude: /(node_modules|bower_components)/,
      include: paths.src,
      options: {
        // Not to use .babelrc or .babelignore files
        babelrc: false,
        // use the default cache directory in node_modules/.cache/babel-loader
        cacheDirectory: true,
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
    extensions: ['.jsx', '.js'],
    // alias: {}
  }

}

// // 遍历所有.html文件，使用htmlWebpackPlugin将资源文件引入html中
// var htmlfiles = fs.readdirSync(HTML_ROOT_PATH);
// htmlfiles.forEach(function (item) {
//     var currentpath = path.join(HTML_ROOT_PATH, item);
//     //console.log(currentpath);
//     var extname = path.extname(currentpath);
//     if (fs.statSync(currentpath).isFile()) {
//         //console.log("replace", currentpath.replace("\\html\\", "\\dist\\"))
//         config.plugins.push(new htmlWebpackPlugin({
//             title: '',
//             template: currentpath,
//             filename: currentpath.replace("\\html\\", "\\dist\\"),
//             minify: isprod ? htmlMinifyOptions : false, // 生产模式下压缩html文件
//             //chunks: ['index', 'vendors'],   // 配置该html文件要添加的模块
//             inject: 'body'
//         }))
//     }
// });




//console.log(cmpnList);

if(isProduction) {
  // Clean files in dist folder
  if(paths.clean.length) {
    config.plugins.push(new CleanWebpackPlugin(paths.clean, {
      root: paths.root,
      verbose: true // open console information output
    }));
  }

  Object.assign(config.entry, paths.cmpnSrcList);

  // config.entry = JSON.parse(JSON.stringify(paths.cmpnSrcList));
  // config.entry[outputName] = new Array();
  // for(let p in cmpnList) {
  //   config.entry[outputName].push(cmpnList[p]);
  // }

  console.log(config.entry);

  config.plugins.push(new htmlWebpackPlugin({
    title: 'Test APP',
    filename: '../index.html',
    chunks: [ outputName ]
  }));

} else {
  // Clean files in test folder
  // config.plugins.push(new CleanWebpackPlugin('test', {
  //   root: paths.root,
  //   verbose: true // open console information output
  // }));

  // console.log(paths.cmpnTestList);

  Object.assign(config.entry, paths.cmpnTestList);

console.log(config.entry);

  //config.entry = JSON.parse(JSON.stringify(paths.cmpnTestList));
  // config.plugins.push(new htmlWebpackPlugin({
  //   title: 'Test framework',
  //   filename: path.resolve(paths.testHTML, 'index.html'),
  //   template: paths.defaultTemplate,
  //   chunks: [ outputName ],
  //   hash: true,
  //   chunksSortMode: function() {console.log(arguments)}
  // }));

  for(let c in paths.cmpnTestList) {
    config.plugins.push(new htmlWebpackPlugin({
      title: c.slice(c.indexOf('/')+1, c.length),
      //filename: 'componentA/test-componentA.html',
      filename: c+'.html',
      template: paths.defaultTemplate,
      chunks: [c],
      hash: true
    }));

  }

  // config.plugins.push(new htmlWebpackPlugin({
  //   title: 'Test componentA',
  //   //filename: 'componentA/test-componentA.html',
  //   filename: 'componentA/test-componentA.html',
  //   template: paths.defaultTemplate,
  //   chunks: ['componentA/test-componentA'],
  //   hash: true
  // }));


  // config.plugins.push(new htmlWebpackPlugin({
  //   title: 'Test componentB',
  //   //filename: 'componentB/test-componentB.html',
  //   filename: 'componentB/test-componentB.html',
  //   template: paths.defaultTemplate,
  //   chunks: ['componentB/test-componentB'],
  //   hash: true
  // }));


}

// Use vendors form local
// Use compressed versions in p11ackaging
if(paths.vendorsFromLocal.length) {
  config.resolve.alias = new Object();
  config.module.noParse = new Array();

  paths.vendorsFromLocal.forEach(function(vendor) {
    let vendorPath = path.resolve(paths.nodeModules, vendor);
    config.resolve.alias[vendor.split(path.sep)[0]] = vendorPath;
    config.module.noParse.push(vendorPath);
  } );
}



module.exports = config;
