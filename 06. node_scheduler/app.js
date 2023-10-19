const nodeschedule = require('node-schedule');
const fs = require('fs');
const express = require('express');
const SCHEDULE_PORT = 3003;
const app = express();
const fetchModule = require('./module/fetchModule');
const dbPostgres = require('./module/dbPostgreModule')
const logger = require('./logger/logger');
const { writeFileSync } = require('fs');


let date = new Date(2023, 0, 1);  // 시작 날짜를 2023년 1월 1일로 설정

// 날짜 형식 지정 yyyymmdd
function formatDate(d) {
    const yyyy = d.getFullYear().toString();
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return yyyy + mm + dd;
}
// 스케줄러 서버
app.listen(SCHEDULE_PORT, () => {
    logger.info(`Scheduler listening on port ${SCHEDULE_PORT}`);
    // 매 1초마다 스케줄러 실행
    nodeschedule.scheduleJob('1 * * * * *', async () => {

        // yyyymmdd 형식으로 변환
        let dateStr = formatDate(date);
        // 공공데이터 url
        const urlBase = 'http://openAPI.seoul.go.kr:8088/인증키/json/DailyAverageCityAir/1/100/'
        // json으로 db 형성하기 위한 path 설정
        let basePath = `./db/${dateStr}_apiTest.json`;
        logger.info(`저장경로 : ${basePath}`)

        while (fs.existsSync(basePath)) {
            logger.error(`File for ${dateStr} already exists. Moving to the next date.`);
            date.setDate(date.getDate() + 1);
            dateStr = formatDate(date);
            basePath = `./db/${dateStr}_apiTest.json`;
            logger.info(basePath)
        }

        logger.info(`Fetching data for date: ${dateStr}`);

        // 공공데이터 api 요청하기 위한 url 설정
        const url = urlBase + dateStr;
        logger.info(`날짜 : ${dateStr}`);
    
        try {
            // 공공데이터 응답 데이터
            let data = await fetchModule.main(url);
            logger.info(data)

            // 데이터를 json db로 형성
            writeFileSync(`${basePath}`, data);

            // 데이터를 DB에 저장
            dbPostgres.storeToDatabase(data);

            // 
            date.setDate(date.getDate() + 1);  // 작업이 성공적으로 완료되면 날짜를 증가
        } catch (error) {
            logger.error("Failed to fetch data:", error.message);
        }

    });
});
