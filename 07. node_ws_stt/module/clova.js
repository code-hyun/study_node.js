const fs = require('fs');
const request = require('request');
const logger = require('../logger/logger')
// const clientId = 'CLOVA clientID';
// const clientSecret = 'CLOVA clienSecret';
const clientId = 'gy3zsjsfoz';
const clientSecret = 'VkHcHzS5baIcRhdlo11HlsoU0dEkbbU0rrTRCCxR';

// language => 언어 코드 ( Kor, Jpn, Eng, Chn )
async function stt(language, filePath) {
    return new Promise ((resolve, reject)=>{
        const url = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=${language}`;
        const requestConfig = {
            url: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'X-NCP-APIGW-API-KEY-ID': clientId,
                'X-NCP-APIGW-API-KEY': clientSecret
            },
            body: fs.createReadStream(filePath)
        };

        request(requestConfig, (err, response, body) => {
            if (err) {
                logger.error(err);
                return;
            }

            logger.info(`CLOVA 응답 코드 : ${response.statusCode}`);
            logger.info(`[STT] | ${body}`);
            resolve(body);
        });
    })
    
}

module.exports = {
    stt
}

// stt('Kor', '음성 파일 경로 (ex: ./test.wav)');
