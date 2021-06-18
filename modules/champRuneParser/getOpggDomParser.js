var getOpggDomParser = {};

const request = require('request-promise');
const cheerio = require('cheerio');

getOpggDomParser.getLine = function(champ_name, callback) {
    return new Promise(function(resolve, reject) {
        const url = 'https://www.op.gg/champion/statistics';

        request(url).then(function(html) {
            let pathList = [];

            const $ = cheerio.load(html);
            const $hrefList = $('table.champion-index-table tbody').children('tr');

            $hrefList.each(function(i, elem) {
                pathList[i] = {
                    path: $(this).find('td.champion-index-table__cell a').attr('href'),
                    line: $(this).find('td.champion-index-table__cell a')
                            .children('div.champion-index-table__position').text()
                            .replace(/[^Jungle^Support^Top^Mid^Bottom^\,]/gi, '')
                };
            });

            let searchIndexs = [];
            for(let i = 0; i < pathList.length; i++) {
                if(pathList[i].path.indexOf(champ_name) != -1)
                    searchIndexs.push(i);
            }

            let resultPath = [];
            for(let i = 0; i < searchIndexs.length; i++)
                resultPath.push(pathList[searchIndexs[i]].path);

            console.log(resultPath);
            console.log(pathList[searchIndexs[0]].line.toLowerCase());

            const lineArray = pathList[searchIndexs[0]].line.toLowerCase().split(',');
            if(lineArray[0] === 'bottom')
                lineArray[0] = 'adc';
            console.log(lineArray[0]);

            resolve(lineArray[0]);
        });
    });
};

getOpggDomParser.getDom = function(champ_name, line){
    return new Promise(function(resolve, reject) {
        const url = 'https://www.op.gg/champion/'+ champ_name +'/statistics/' + line;
    
        request(url).then(function(html) {
            const $ = cheerio.load(html);
            const $articleList = $('tbody.tabItem td.champion-overview__data');

            let url_changed_domString =
            '<head><link href="https://opgg-static.akamaized.net/css3/common.css?t=1620889724" rel="stylesheet" type="text/css">' +
            '<link href="https://opgg-static.akamaized.net/css3/sprite.css?t=1620889724" rel="stylesheet" type="text/css">' +
            '<link href="https://opgg-static.akamaized.net/css3/champion.css?t=1620889724" rel="stylesheet" type="text/css">' +
            '<link href="https://opgg-static.akamaized.net/css3/ranking.css?t=1620889724" rel="stylesheet" type="text/css">' +
            '<link href="https://opgg-static.akamaized.net/css3/editor.css?t=1620889724" rel="stylesheet" type="text/css">' +
            '<link href="https://opgg-static.akamaized.net/css3/champion2.css?t=1620889724" rel="stylesheet" type="text/css">' +
            '<link href="https://opgg-cdn.akamaized.net/nanumgothic/font_nanumgothic.css" rel="stylesheet" type="text/css">' +
            '</head>' + '<body style="width:567px;height:220px">' +
            $articleList.html().toString().replace(/\/\//gm, 'https://') + '</body>';

            // console.log(url);
            resolve(url_changed_domString);
        });
    });
};

getOpggDomParser.retDom = function(champ_name, callback) {
    this.getLine(champ_name)
        .then(function(line){
            getOpggDomParser.getDom(champ_name, line)
            .then(function(dom_data){
                callback(dom_data);
            });
        })
        .catch(function(err){
            callback(err);
        });
};

module.exports = getOpggDomParser;