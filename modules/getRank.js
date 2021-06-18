var getLank = {};

getLank.lankInfo = function(id, callback){
    var get_key = require("./privateKeys_riot_api.js");
    var key = get_key.returnToken();

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest;
    
    var path = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/";

    path += `${id}?api_key=`;
    path += key;

    xhr.open("GET", path);
    xhr.send();

    xhr.onload = function(){
        var return_value = JSON.parse(xhr.responseText);
        callback(return_value);
    };
};

module.exports = getLank;