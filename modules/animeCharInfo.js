const { html } = require("cheerio");

const animeCharInfo = {};

/**
 * crawl functions
 * arguments    : anime char's name    ex>> 에밀리아
 * return       : crawling result object
 */

animeCharInfo.setUrl = function(name, callback){

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    
    const axios = require("../node_modules/axios");
    const cheerio = require("../node_modules/cheerio");

    const url = "http://character.onnada.com/search.php?q=" + encodeURI(name);

    const getHtml = async() => {
        try{
            return await axios.get(url);
        } catch(err){}
    };

    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("table.web-array tbody").children("tr.array");

        $bodyList.each(function(i, elem){
            ulList[i] = {
                url: $(this).find("td.name a").attr("href")
            };
        });

        const data = ulList.filter(n => n.url);
        
        callback(data);
    });
};

animeCharInfo.getInfo = function(url, callback){

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    
    const axios = require("../node_modules/axios");
    const cheerio = require("../node_modules/cheerio");

    const getHtml = async() => {
        try{
            return await axios.get(url);
        } catch(err){}
    };

    getHtml().then(html => {
        let ulList = [];
        let birthList = [];
        const $ = cheerio.load(html.data);

        const $bodyList = $("div.layout-main article").children("div.view-title");
        const $infoList = $("div.view-info").children("div.list");

        $bodyList.each(function(i, elem){
            ulList[i] = {
                name: $(this).find("h1").text()
            };
        });

        $infoList.each(function(i, elem){
            birthList[i] = {
                data: $(this).find("p").text()
            };
        });

        const name = ulList.filter(n => n.name);
        const info = birthList.filter(n => n.data);
        
        callback(name, info);
    });
};

animeCharInfo.getRank = async function(callback){
    
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    const axios = require("../node_modules/axios");
    const cheerio = require("../node_modules/cheerio");

    const url = "http://anime.onnada.com/rank.php";
    const getHtml = async() => {
        try{
            return await axios.get(url);
        } catch(err){
            console.error(err);
        }
    };
    
    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("table.web-array tbody").children("tr.array");

        $bodyList.each(function(i, elem){
            ulList[i] = {
                title: $(this).find("td.maintitle a").text()
            };
        });

        const data = ulList.filter(n => n.title);
        callback(data);
    });

};

animeCharInfo.getCharRank = function(callback){
    
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    const axios = require("../node_modules/axios");
    const cheerio = require("../node_modules/cheerio");

    const url = "http://character.onnada.com/rank.php";

    const getHtml = async() => {
        try{
            return await axios.get(url);
        } catch(err){
            console.error(err);
        }
    };
    
    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("table.web-array tbody").children("tr.array");

        $bodyList.each(function(i, elem){
            ulList[i] = {
                name: $(this).find("td.name a").text(),
                title: $(this).find("td.anime a").text()
            };
        });

        const data = ulList.filter(n => n.name);
        callback(data);
    });
};

animeCharInfo.sortResult = function(info){

    if(info[0] === undefined || info[0] === null){
        return 0;
    }

    else{
        let resultString = info[0].data.split("\n");
        let str = [];
        let index = 0;
        for(let i = 0; i < resultString.length; i++){
            if(resultString[i] !== ""){
                str[index] = resultString[i];
                index++;
            }
        }

        index = 0;
        let jsonData = [];
        for(let i = 0; i < str.length; i += 2){
            jsonData[index] = {type:`${str[i]}`, value:`${str[i + 1]}`};
            index++;
        }

        return jsonData;
    }
};

module.exports = animeCharInfo;