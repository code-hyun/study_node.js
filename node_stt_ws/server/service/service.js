const { Pool } = require('pg');
const conf = require('../config/config');
const logger = require('../config/logger');
const TIME = 5 * 60 * 1000;

const pool = new Pool(conf.dbConfig);

async function check_tid(tid){
    await pool.query(`
        CREATE TABLE IF NOT EXISTS stt_table (
        tid TEXT, create_at TIMESTAMP
        );
    `);
    let tidCheck;
    const tidInfo = await pool.query('SELECT * FROM stt_table WHERE tid = $1;', [tid]);
    if(tidInfo.rowCount === 0){
        tidCheck = {check : false};
        return tidCheck;
    }else{
        if((new Date() - tidInfo.rows[0].create_at)>= TIME){
            logger.info(`${((new Date() - tidInfo.rows[0].create_at)/1000/60 - 5).toFixed(1)} 분 지나서 유효시간 만료`);
            tidCheck = {check : false}
            return tidCheck;
        }
        tidCheck = {check : true, create_time : tidInfo.rows[0].create_at}
        return tidCheck;
    }
    
}


async function create_tid() {
    const tid = createTid();
    const time = new Date();
    try {
        await pool.query('INSERT INTO stt_table (tid, create_at) VALUES ($1, $2);', [tid, time]);
        logger.info(`${tid} , ${new Date()} INSERT 완료`)
    } catch (error) {
        console.error('TID 생성 및 삽입 중 오류 발생:', error);
    }
    let create_tid = {tid : tid, create_time : time}
    return create_tid;
}
function createTid() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tid = '';
    for (let i = 0; i < 13; i++) {
        tid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return tid;
}

module.exports = {
    create_tid, check_tid
};
