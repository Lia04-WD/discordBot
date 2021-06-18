var koreanToEnglish = {};

const getChampList = require('./getChampList');

koreanToEnglish.kr_to_en = function(search_key, callback) {
    getChampList.getList(function(data){
        const champ_list = data.data;

        for(let i in champ_list) {
            if(search_key === champ_list[i].name) {
                // console.log(champ_list[i].id.toLowerCase());
                callback(champ_list[i].id.toLowerCase());
            }
        }
    });
};

module.exports = koreanToEnglish;