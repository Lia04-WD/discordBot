const discord = require("./node_modules/discord.js");

const privateKeys = require("./modules/privateKeys.js");
const animeBirth = require("./modules/animeCharInfo.js");
const stmodule = require("./modules/standardModule.js");
const movie = require("./modules/movieChart.js");
const readFile = require("./modules/fileSystem.js");
const lotation_champ = require("./modules/getLotation_champ.js");
const get_user_info = require("./modules/getUserId.js");
const get_lank_info = require("./modules/getRank.js");

const koreanToEnglish = require('./modules/champRuneParser/koreanToEnglish');
const getOpggDomParser = require('./modules/champRuneParser/getOpggDomParser');

const nodeHtmlToImage = require('node-html-to-image');
const { MessageAttachment } = require("discord.js");

const client = new discord.Client();
client.setMaxListeners(0);     // unlimit event number of listeners

function setEmbed(title, color, description){
    const embed = new discord.MessageEmbed();
    embed.setTitle(title);
    embed.setColor(color);
    embed.setDescription(description);

    return embed;
}

async function sendImage(msg, dom_string) {
    const images = await nodeHtmlToImage({
        html: dom_string,
        quality: 100,
        type: 'jpeg',
        puppeteerArgs: {
            args: ['--no-sandbox'],
        },
        encoding: 'binary',
    });
    return msg.channel.send(msg.content.slice(3, msg.content.length) + '룬', new MessageAttachment(images));
}

client.on("ready", function(){
    console.log(`${client.user.tag}봇이 시작됨!!`);
});

// standard command
client.on('message', function(msg){
    if(msg.content[0] === ';'){
        const replyMsg  =msg.content.slice(1, msg.content.length);
        msg.channel.send(`<@${msg.author.id}>님이 같이 "${replyMsg}" 할 사람을 찾고 있음!`);
    }
});

// animation char info
client.on("message", function(msg){
    if(msg.content.slice(0, 3) === "#생일" && msg.content[3] === " "){
        // msg.channel.send(`생일 명령어 사용됨, 전달된 인자 : ${arg}`);
        
        const arg = msg.content.slice(3, msg.content.length);
        for(let i = 0; i < arg.length; i++){
            if(arg[i] === " ")
                arg[i] = "+";
            else
                continue;
        }

        animeBirth.setUrl(arg, function(data){

            if(data[0] === undefined){
                const des = "Error!! 캐릭터 정보를 찾을 수 없어요 ㅠㅠ";
                embed = setEmbed("ERROR", 0xFF0000, des);
                msg.channel.send(embed);

                return;
            }
            else
                var url = data[0].url;

            animeBirth.getInfo(url, function(name, info){
                const result = animeBirth.sortResult(info);

                if(result !== 0){
                    let return_string = "";
                    for(let i = 0; i < result.length; i++){
                        return_string += `${result[i].type} : ${result[i].value}\n`;
                    } return_string += "\n출처 : character.onnada.com\n";
                    
                    const embed = setEmbed(name[0].name, 0x0080FF, return_string);
                    msg.channel.send(embed);
                }
                else{
                    const des = "Error!! 캐릭터 정보를 찾을 수 없어요 ㅠㅠ";
                    embed = setEmbed("ERROR", 0xFF0000, des);
                    msg.channel.send(embed);
                }
            });
        });
    }

});

// animation chart info
client.on('message', function(msg){
    if(msg.content === "#애니순위"){
        animeBirth.getRank(function(data){
            const titles = data;

            let return_string = "";
            for(let i = 0; i < 10; i++){
                return_string += `${i + 1} : ${titles[i].title}\n`;
            } return_string += "\n출처 : anime.onnada.com/rank.php\n";
            
            const embed = setEmbed(stmodule.getDayToString() + " 애니순위", 0xFF66FF, return_string);
            msg.channel.send(embed);
        });
    }
});

// animation char rank info
client.on('message', function(msg){
    if(msg.content === "#캐릭터순위"){
        animeBirth.getCharRank(function(data){
            const dataArray = data;

            let return_string = "";
            for(let i = 0; i < 10; i++){
                return_string += `${i + 1} : ${dataArray[i].name} | ${dataArray[i].title}\n`;
            } return_string += "\n출처 : character.onnada.com/rank.php\n";

            const embed = setEmbed(stmodule.getDayToString() + " 캐릭터 순위", 0x33FFFF, return_string);
            msg.channel.send(embed);
        });
    }
});

// movie chart info
client.on('message', function(msg){
    if(msg.content === "#영화"){
        movie.getCGVChart(function(data){
            const chartArray = data;

            let return_argu = "";
            for(let i = 0; i < chartArray.length; i++){
                return_argu += `No.${i + 1} : ${chartArray[i].title}\n`;
            } return_argu += "\n출처 : www.cgv.co.kr/movies\n";

            const embed = setEmbed(stmodule.getDayToString() + " CGV 영화 순위", 0xFF0000, return_argu);
            msg.channel.send(embed);
        });
    }
});

// news command
client.on('message', function(msg){
    if(msg.content.slice(0, 3) === "#뉴스"){
        
        var title = "Error!!";
        var return_string = "해당 명령어는 보수중에 있어요 ㅠㅠ";
        const embed = setEmbed(title, 0xFF0000, return_string);
        msg.channel.send(embed);

        /*
        const path = "C:\\Users\\김대훈\\Desktop\\webCrawlerApps\\naverNewsTitle\\naverNewsTitle\\bin\\Debug\\netcoreapp3.1\\naverNewsTitle.exe";
        
        var options = {
            encoding: "euckr",
            windowsHide: true
        };
        
        var retString;
        exec(path, options, function(error, stdout, stderr){
            if(error)
                throw error;

            retString = iconv.decode(stdout, "euc-kr");
            const embed = setEmbed("늬우스를 전달해 드리겠습네다", 0x63FF54, retString);
            embed.setFooter("출처 : news.naver.com", "https://news.naver.com/");
            msg.channel.send(embed);
        });
        */
    }
});

// lol champion rotation list info
client.on('message', function(msg){
    if(msg.content === "#로테이션" || msg.content === "#로테"){
        lotation_champ.getChamp(function(champ_list, lotation_champ){

            var resultList = [];
            for(let i = 0; i < 15; i++){
                for(var j in champ_list){

                    if (champ_list[j].key == lotation_champ[i]){
                        resultList[i] = champ_list[j].name;
                    }
                }
            }

            let return_argu = "";
            for(let i = 0; i < resultList.length; i++){
                return_argu += `${i + 1} : ${resultList[i]}\n`;
            }
            
            const embed = setEmbed("오늘의 로테이션 챔프", 0x6A89FF, return_argu);
            msg.channel.send(embed);
        });
    }
});

// kr summonor rank info
client.on('message', function(msg){
    if(msg.content.slice(0, 3) === "#랭크" && msg.content.slice(4, msg.content.length) !== undefined){
        
        var param = msg.content.slice(4, msg.content.length);

        get_user_info.getUserInfo(param, function(data){

            get_lank_info.lankInfo(data.id, function(rank_data){

                var solo_rank = {};
                var flex_rank = {};

                var bool_noRankCheck = false;
                if(rank_data[0] === undefined)
                    bool_noRankCheck = true;

                if(!bool_noRankCheck){
                    if(rank_data[0].queueType === "RANKED_SOLO_5x5"){
                        solo_rank = rank_data[0];
                        flex_rank = rank_data[1];
                    }
                    else {
                        solo_rank = rank_data[1];
                        flex_rank = rank_data[0];
                    }
                }

                var so_rank_info = [];
                var fl_rank_info = [];

                /**
                 * 
                 * [0] : tier && rank               string
                 * [1] : points                     string
                 * [2] : wins && losses             number
                 */

                // solo rank
                if(solo_rank !== undefined){
                    so_rank_info[0] = `티어 : ${solo_rank.tier} ${solo_rank.rank}`;
                    so_rank_info[1] = `점수 : ${solo_rank.leaguePoints}`;
                    so_rank_info[2] = `승 / 패 : ${solo_rank.wins}승 ${solo_rank.losses}패`;
                }

                // flex rank
                if(flex_rank !== undefined){
                    fl_rank_info[0] = `티어 : ${flex_rank.tier} ${flex_rank.rank}`;
                    fl_rank_info[1] = `점수 : ${flex_rank.leaguePoints}`;
                    fl_rank_info[2] = `승 / 패 : ${flex_rank.wins}승 ${flex_rank.losses}패`;
                }

                var return_string = "";
                return_string += "SOLO_RANK \n";

                if(solo_rank !== undefined && bool_noRankCheck !== true){
                    for(let i = 0; i < 3; i++){
                        return_string += so_rank_info[i];
                        return_string += "\n";
                    }
                }
                else{
                    return_string += "정보가 없어요 ㅠㅠ \n";
                }

                return_string += "\n";
                return_string += "FLEX_RANK \n";

                if(flex_rank !== undefined && bool_noRankCheck !== true){
                    for(let i = 0; i < 3; i++){
                        return_string += fl_rank_info[i];
                        return_string += "\n";
                    }
                }
                else{
                    return_string += "정보가 없어요 ㅠㅠ \n";
                }

                // send to discord
                var title = `${param}님의 랭크 정보`;
                const embed = setEmbed(title, 0xFF6100, return_string);
                msg.channel.send(embed);
            });
        });
    }
});

// rune page command
client.on('message', function(msg){
    if(msg.content.slice(0,2) === "#룬" && msg.content.slice(3, msg.content.length) !== undefined) {
        koreanToEnglish.kr_to_en(msg.content.slice(3, msg.content.length), function(champ_name){
            getOpggDomParser.retDom(champ_name, function(dom_data){
                sendImage(msg, dom_data);
            });
        });
    }
});

// manual info
client.on('message', function(msg){
    if(msg.content.slice(0, 4) === "#man" && msg.content.slice(4, msg.content.length) !== undefined){
        
        const argu = msg.content.slice(5, msg.content.length);
        const resultString = readFile.getDetailMan(argu);
        
        var embed;
        
        if(resultString === 1){
            const des = "Error!! 명령어 형식을 확인해 주세요";
            embed = setEmbed("ERROR", 0xFF0000, des);
        }
        else{
            embed = setEmbed(argu, 0x00FF00, resultString);
        }

        msg.author.send(embed);
    }
});

// help info
client.on('message', function(msg){
    if(msg.content === "#명령어"){
        const resultString = readFile.getDefaultMan();
        
        const embed = setEmbed("명령어 목록", 0x00FF00, resultString);
        msg.author.send(embed);
    }
});

client.login(privateKeys.returnDiscordToken());