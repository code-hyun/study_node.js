// clova config
const clientId = 'gy3zsjsfoz';
const clientSecret = 'VkHcHzS5baIcRhdlo11HlsoU0dEkbbU0rrTRCCxR';
const clova_url = 'https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang='

// db config
const dbConfig = {
    user: 'test',
    host: 'localhost',
    database: 'test',
    password: 'test',
    port: '5432',
}

module.exports = {
    id : clientId, secret : clientSecret, url : clova_url, dbConfig
}