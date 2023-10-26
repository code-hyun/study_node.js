const express = require('express');
const service = require('../service/service');
const logger = require('../config/logger');
const router = express.Router();

let tid;
router.get('/check', async (req, res) => {
    let header = req.headers;
    let clientTid = header.tid;
    console.log(`client tid : ${header.tid}`)
    let isCheck = await service.check_tid(clientTid);
    if(isCheck.check){
        tid = isCheck;
    }else {
        tid = await service.create_tid();
    }
    console.log(tid)
    res.send(JSON.stringify(tid))
})

module.exports = router;