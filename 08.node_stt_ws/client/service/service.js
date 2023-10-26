const fs = require('fs');
const path = require('path');
function fileCheck(tid) {
    const directory = '/Users/ailak/Documents/dev_study/08.node_stt_ws/client/get_stt';

    try {
        const files = fs.readdirSync(directory);
        
        for (const file of files) {
            const filePath = path.join(directory, file);  // 전체 파일 경로를 구함
            const fileContent = fs.readFileSync(filePath, 'utf8');  // 파일 내용을 문자열로 읽어옴
            
            if (fileContent.includes(tid)) {
                let time = new Date(JSON.parse(fileContent).create_tid_time);
                console.log(((new Date() - time)/1000/60).toFixed(1) + "분 지남")
                let checkTime =((new Date() - time)/1000/60).toFixed(1) < 5;
                if(checkTime){
                    return true;
                }else{
                    return false
                }
            }
        }
    } catch (err) {
        console.error("Error:", err);
    }

    return false;
}


module.exports = fileCheck;
