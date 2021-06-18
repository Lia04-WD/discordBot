var getChampList = {};

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const getVersion = require('./getVersion');

getChampList.getList = function(callback) {
    getVersion.get_version(function(current_version) {
        var xhr = new XMLHttpRequest;
        var path = "http://ddragon.leagueoflegends.com/cdn/"+ current_version +"/data/ko_KR/champion.json";

        xhr.open("GET", path);
        xhr.send();

        xhr.onload = function(){
            var return_value = JSON.parse(xhr.responseText);
            callback(return_value);
        };
    });
};

module.exports = getChampList;