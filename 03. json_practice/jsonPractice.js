/* 
    Json 파일 구조
    최상위 [] : 전체 코드 시작과 끝
    { } : 하위데이터로 한단계 내려감, 데이터 호출시 "." 호출
    내부 [] : 데이터 배열, Index 번호로 호출
*/

const jsonData = require("./jsonPractice.json");
console.log(jsonData)
console.log(jsonData[0].contact.email, jsonData[0].contact.phone)
jsonData[0].password = btoa(123456);
jsonData[1].password = btoa(123456);
console.log(jsonData[1])
console.log(jsonData[0].hobbies.favorites)
console.log(JSON.parse(JSON.stringify(jsonData)))

for(let x in jsonData){

    console.log(jsonData[x].hobbies)
    jsonData[x].hobbies.interests.splice(0,0,"test")
    console.log(jsonData[x].hobbies)
}