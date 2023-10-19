const { Pool } = require('pg');
const logger = require('../logger/logger')
const TIME = 5 * 60 * 1000;
const pool = new Pool({
    user: 'test',
    host: 'localhost',
    database: 'test',
    password: 'test',
    port: '5432',
});

async function tid_check(data){
    await pool.query(`
        CREATE TABLE IF NOT EXISTS stt_table (
        tid TEXT, create_at TIMESTAMP
        );
    `);
    
    const tidInfo = await pool.query('SELECT * FROM stt_table WHERE tid = $1;', [data]);
    if(tidInfo.rowCount === 0){
        return false;
    }else{
        if((new Date() - tidInfo.rows[0].create_at)>= TIME){
            logger.info(`${(new Date() - tidInfo.rows[0].create_at)/1000/60 - 5} 분 지나서 유효시간 만료`);
            return false;
        }
        return true;
    }
    
}

module.exports = {tid_check}