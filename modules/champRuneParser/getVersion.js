var getVersion = {};

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

getVersion.get_version = function(callback){
    const xhr = new XMLHttpRequest;
    const path = "https://ddragon.leagueoflegends.com/api/versions.json";

    xhr.open("GET", path);
    xhr.send();

    xhr.onload = function(){
        const version_list = JSON.parse(xhr.responseText)
        console.log(version_list[0]);
        callback(version_list[0]);
    };
};

module.exports = getVersion;