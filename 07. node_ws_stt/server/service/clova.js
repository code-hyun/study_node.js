const fs = require('fs');
const request = require('request');
const logger = require('../config/logger');
const conf = require('../config/config')
const clientId = conf.id;
const clientSecret = conf.secret;

// language => 언어 코드 ( Kor, Jpn, Eng, Chn )
async function stt(language, filePath) {
    return new Promise ((resolve, reject)=>{
        const url = `${conf.url}${language}`;
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
