// import data from './myDataJson.json'
const user = {
    name : "user",
    age : 23,
    emails :[ 
        'jh940412@naver.com',
        'jh940412@gmail.com'
    ]
}
const str = JSON.stringify(user);
const obj = JSON.parse(str)
// console.log(str.user.name)
console.log(obj.user.name)