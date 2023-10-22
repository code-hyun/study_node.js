const { Pool } = require('pg');
const logger = require('../logger/logger')

const pool = new Pool({
    user: 'test',
    host: 'localhost',
    database: 'test',
    password: 'test',
    port: '5432',
});



async function create_tid() {
   
    const tid = createTid();
    try {
        await pool.query('INSERT INTO stt_table (tid, create_at) VALUES ($1, NOW());', [tid]);
        logger.info(`${tid} , ${new Date()} INSERT 완료`)
    } catch (error) {
        console.error('TID 생성 및 삽입 중 오류 발생:', error);
    }
    return tid;
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
    create_tid
};