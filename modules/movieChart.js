const movieChart = {};

movieChart.getCGVChart = function(callback){
    
    const axios = require("../node_modules/axios");
    const cheerio = require("../node_modules/cheerio");

    const url = "http://www.cgv.co.kr/movies/";

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
        const $bodyList = $("div.sect-movie-chart li").children("div.box-contents");

        $bodyList.each(function(i, elem){
            ulList[i] = {
                title: $(this).find("strong.title").text()
            };
        });

        const data = ulList.filter(n => n.title);
        callback(data);
    });
};

module.exports = movieChart;