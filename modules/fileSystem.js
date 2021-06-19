const { result } = require("lodash");

const fileSystem = {};

fileSystem.getDefaultMan = function(){

    const fs = require("fs");

    const result_data = fs.readFileSync("./manuals/defaultMan.txt", "utf8", function(err, data){
        if(err)
            return "데이터를 읽지 못했습니다";
        
        return data;
    });

    return result_data;
};

fileSystem.getDetailMan = function(data){

    const fs = require("fs");
    const path = `./manuals/${data}.txt`;       // path traversal vulnerability!!

    try{
        const result_data = fs.readFileSync(path, "utf8", function(err, data){
            return data;
        });

        return result_data;
    } catch (err) {
        const reError = 1;
        return reError;
    }
}

module.exports = fileSystem;
