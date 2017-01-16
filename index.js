/*依赖库*/
const cheerio = require('cheerio');
const fs = require('fs');
const superagent = require('superagent');
const path = require('path');
const request = require('request');

let baseUrl = "http://www.meizitu.com/a/"; //目标网址
let pageMax = 1; //最多页面数
let startIdx = 1; //起始页面序号

/*获取html函数*/
function getHtml(url,startIdx) {
    //传入baseUrl与页面序号拼接为完整url
    superagent.get(url+startIdx+'.html')
        .end(function (err,res) {
            // console.log(res);
            let $ = cheerio.load(res.text);
            // console.log($);
            let html = $('#maincontent>.postContent>p:first-child>img').toArray();
            // console.log(html);
            for(let i=0;i<html.length;i++){
                let imgsrc = html[i].attribs.src;
                //srcs.push(imgsrc);
                // console.log('图片url地址为：'+srcs);
                let fileName = parseUrlForFileName(imgsrc);
                downImg(imgsrc,fileName,startIdx,function () {
                    console.log(fileName+'下载完成');
                });
            }

        });
    //递归调用
    if(startIdx<pageMax){
        getHtml(baseHref,++startIdx)
    }
    else {
        console.log('开始爬取第'+startIdx+'页数据...');
        console.log('共计'+pageMax+'页数据...');
    }

}
/*解析图片文件名*/
function parseUrlForFileName(address) {
    let d = new Date();
    //path模块的basename来解析图片文件名
    let fileName = d.getFullYear()+'_'+d.getMonth()+1+'_'+d.getDate()+'_'+path.basename(address);
    console.log('图片名称为:'+fileName);
    return fileName;
}

/*下载图片函数*/
function downImg(url,fileName,pgNum,callback) {
    //调用request模块的head方法来下载
    request.head(url,function (err,res) {
        if (err) {
            console.log('err: '+ err);
            return false;
        }
        console.log('res:'+res);

    });
    //调用fs文件系统模块中的createWriteStream来下载到本地目录
    request(url).pipe(fs.createWriteStream('upload/page'+pgNum+'_'+fileName)).on('close', callback);
}

function start(href,idx) {
    getHtml(href,idx);
}
//传入baseUrl与起始页面序号开始爬取
start(baseUrl,startIdx);