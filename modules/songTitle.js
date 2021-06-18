const songTitle = {};

songTitle.getTitle = function(searchQuery, callback){

    const axios = require("../node_modules/axios");
    const cheerio = require("../node_modules/cheerio");

    const url = "https://youtube.com/results?search_query=" + encodeURI(searchQuery);

    const getHtml = async() => {
        try{
            return await axios.get(url);
        } catch(err){}
    };

    getHtml().then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("#title-wrapper")
        .children("h3");

        $bodyList.each(function(i, elem){
            ulList[i] = {
                url: $(this).find("#video-title").attr("href")
            };
        });

        const data = ulList.filter(n => n.url);
        
        console.log(url);
        callback(data);
    });

};

module.exports = songTitle;