const node_schedule = require('node-schedule');
const fs = require('fs');
const express = require('express');
const SCHEDULE_PORT = 3002;
const app = express();
const fetchModule = require('./module/fetchModule');
const dbPostgres = require('./module/dbPostgreModule');
const logger = require('./logger/logger');

let date = new Date(2023, 0, 1);  // 시작 날짜를 2023년 1월 1일로 설정

// 날짜 형식 지정 yyyymmdd
function formatDate(d) {
    const yyyy = d.getFullYear().toString();
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return yyyy + mm + dd;
}

async function handleDataForDate(currentDate) {
    let dateStr = formatDate(currentDate);
    let basePath = `./db/${dateStr}_apiTest.json`;

    if (fs.existsSync(basePath)) {
        logger.error(`${dateStr} 이미 존재하는 파일.`);
        currentDate.setDate(currentDate.getDate() + 1);
        return handleDataForDate(currentDate);  // 재귀적으로 다음 날짜로 넘어간다.
    }

    logger.info(`Fetching data for date: ${dateStr}`);
    const url = `http://openAPI.seoul.go.kr:8088/7a694f42506d796e3130347242526a72/json/DailyAverageCityAir/1/100/${dateStr}`;
    logger.info(`날짜 : ${dateStr}`);
    
    try {
        let data = await fetchModule.main(url);
        logger.info(data);
        fs.writeFileSync(basePath, data);
        dbPostgres.storeToDatabase(data);
        currentDate.setDate(currentDate.getDate() + 1);  // 작업이 성공적으로 완료되면 날짜를 증가
    } catch (error) {
        logger.error("요청 실패:", error.message);
    }
}

// 스케줄러 서버
app.listen(SCHEDULE_PORT, () => {
    logger.info(`스케줄러 서버 포트 : ${SCHEDULE_PORT}`);
    // 매 1초마다 스케줄러 실행
    node_schedule.scheduleJob('1 * * * * *', () => {
        handleDataForDate(date);
    });
});
