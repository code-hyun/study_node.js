const fs = require('fs');
const path = require('path');
const logger = require('../config/logger')

function fileCheck(tid) {
    const directory = './get_stt';
    
    try {
        const files = fs.readdirSync(directory);
        
        for (const file of files) {
            const filePath = path.join(directory, file);  // 전체 파일 경로를 구함
            const fileContent = fs.readFileSync(filePath, 'utf8');  // 파일 내용을 문자열로 읽어옴
            
            if (fileContent.includes(tid)) {
                let time = new Date(JSON.parse(fileContent).create_tid_time);
                let checkTime =((new Date() - time)/1000/60).toFixed(1) < 5;
                if(checkTime){
                    logger.info(`[Tid] : true | 유효시간 : ${checkTime} | ${tid}` )
                    return true;
                }else{
                    logger.info(((new Date() - time)/1000/60 - 5).toFixed(1) + "분 지남")
                    return false
                }
            }
        }
    } catch (err) {
        console.error("Error:", err);
    }

    return false;
}


module.exports = {fileCheck};
