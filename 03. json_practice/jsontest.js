const data = require("./myDataJson.json");
const data2 = require("./myDataJson2.json")
const data3 = require("./jsonTest.json")

data2[0].email = btoa("jh940412@naver.com");
data2[1].email = btoa("jh940412@gmail.com");
data2[0].password = btoa("abcd12345");
data2[1].password = btoa("aasdfasfasfda5");
console.log(data2)

delete data2[0].email
delete data2[1].email

data3.members[1].name = "hwang"
data3.members[1].age = 30;
data3.members[1].power = [{
    key1 : "value",
    key2 : "value",
    key3 : "value"

},{
    key1 : "value",
    key2 : "value",
    key3 : "value"
}]
console.log(atob(data2[1].password));
console.log(data2[1].powers.splice(3,0, "drum"));
console.log(data2[1].powers);





