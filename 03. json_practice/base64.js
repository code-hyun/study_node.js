

const data = {
    "name" : "hwang",
    "id" : "hwang94",
    "pw" : "123456",
    "email" : "hwang@naver.com"
}
// data.pw = btoa(data.pw);
// data.email = btoa(data.email);

function base64encode(text){
    return Buffer.from(text, "utf8").toString('base64');
}
function base64decode(text){
    return Buffer.from(text, 'base64').toString('utf8')
}
var encodeText = base64encode(data.pw);
console.log("base64 encode : " + encodeText);

data.pw = encodeText
console.log(data)

