const express = require('express');
const service = require('../service/service');
const logger = require('../config/logger');
const router = express.Router();

let tid;
router.get('/check', async (req, res) => {
    // header
    let header = req.headers;
    let clientTid = header.tid;
    logger.info(`[HTTP] client tid : ${header.tid}`)
    
    // tid check
    let isCheck = await service.check_tid(clientTid);
    if(isCheck.check){
        tid = clientTid;
    }else {
        tid = await service.create_tid();
    }
    logger.info(`[HTTP] tid : ${tid}`)
    res.send(tid)
})

module.exports = router;