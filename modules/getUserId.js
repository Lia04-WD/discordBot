var getUserId = {};

getUserId.getUserInfo = function(user_name, callback){
    var get_key = require("./privateKeys_riot_api");
    var key = get_key.returnToken();

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest;

    var path = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + encodeURI(user_name);
    path += `?api_key=${key}`;

    xhr.open("GET", path);
    xhr.send();

    var json_data;
    xhr.onload = function(){
        json_data = JSON.parse(xhr.responseText);
        
        var return_temp = {
            id: `${json_data.id}`,
            puuid: `${json_data.puuid}`,
            accountId: `${json_data.accountId}`,
            level: `${json_data.summonerLevel}`
        };

        callback(return_temp);
    };
};

module.exports = getUserId;