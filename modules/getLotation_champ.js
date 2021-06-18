const { callbackify } = require("util");

var getLotation_champ = {};


getLotation_champ.getChamp = function(callback){

    var get_key = require("./privateKeys_riot_api");
    var key = get_key.returnToken();
    
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest;

    var path = "http://ddragon.leagueoflegends.com/cdn/10.25.1/data/ko_KR/champion.json";
    xhr.open("GET", path);
    xhr.send();

    var json_data;
    xhr.onload = function(){
        json_data = JSON.parse(xhr.responseText).data;
    };

    var champion_parser = new XMLHttpRequest;

    var path_lot = "https://kr.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=";
    path_lot += key;
    
    champion_parser.open("GET", path_lot);
    champion_parser.send();

    var lotation_champ;
    champion_parser.onload = function(){
        lotation_champ = JSON.parse(champion_parser.responseText).freeChampionIds;

        callback(json_data, lotation_champ);  
    };
};

module.exports = getLotation_champ;