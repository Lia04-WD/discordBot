const { ReadStream } = require("fs");

const standardMoudle = {};

standardMoudle.getDayToString = function(){
    const date = new Date();
    const reData = {year: `${date.getFullYear()}`,
                    month: `${date.getMonth() + 1}`,
                    date: `${date.getDate()}`};

    const reString = `${reData.year}년 ${reData.month}월 ${reData.date}일`;
    return reString;
}

module.exports = standardMoudle;