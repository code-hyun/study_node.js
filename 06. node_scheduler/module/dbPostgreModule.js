const { Pool } = require('pg');
const logger = require('../logger/logger')

const pool = new Pool({
    user: 'test',
    host: 'localhost',
    database: 'test',
    password: 'test',
    port: '5432',
});

async function storeToDatabase(data) {
    jsonObj = JSON.parse(data)
    if (!jsonObj || !jsonObj.DailyAverageCityAir || !jsonObj.DailyAverageCityAir.row) {
        logger.error('Invalid data structure');
        return;
    }
    const { DailyAverageCityAir } = jsonObj;
    const { row } = DailyAverageCityAir;
    let tableName;
    for (const item of row) {
        const { MSRDT_DE, MSRRGN_NM, MSRSTE_NM, PM10, PM25, O3, NO2, CO, SO2 } = item;

        // 날짜별 테이블 이름 생성
        tableName = `air_quality_${MSRDT_DE}`;


        // 테이블이 존재하는지 확인하고, 없다면 생성
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ${tableName} (
                region_name TEXT,
                district_name TEXT,
                pm10 FLOAT,
                pm25 FLOAT,
                o3 FLOAT,
                no2 FLOAT,
                co FLOAT,
                so2 FLOAT
            );
        `);

        // 데이터 삽입
        await pool.query(`
            INSERT INTO ${tableName} (region_name, district_name, pm10, pm25, o3, no2, co, so2)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [MSRRGN_NM, MSRSTE_NM, PM10, PM25, O3, NO2, CO, SO2]);
    }
    logger.info(`${tableName} 테이블 생성 및 삽입 완료`)
}


module.exports = {
    storeToDatabase
};
