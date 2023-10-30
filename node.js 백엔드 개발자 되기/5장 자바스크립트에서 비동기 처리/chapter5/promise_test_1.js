const DB = []

function saveDB(user){
    const oldDBSize = DB.length;
    DB.push(user)
    console.log(`save ${user.name} to DB`)

    return new Promise((resolve, reject) => {
        if(DB.length > oldDBSize){
            resolve(user)
        }else{
            reject(new Error("Save DB Error!"));
        }
    })
}

function sendEmail(user){
    console.log(`email to ${user.email}`);
    return new Promise((resolve) => {
        resolve(user)
    })
}

function getResult(user){
    return new Promise((resolve) => {
        resolve(`success register ${user.name}`);
    })
}

function registerByPromise(user){
    // 비동기 호출이지만 순서를 지켜서 실행
    const result = saveDB(user).then(sendEmail).then(getResult);

    console.log(result);
    return result;
}

const myUser  = {email : 'andy@naver.com', password : '1234', name : 'andy'};
const result = registerByPromise(myUser);

result.then(console.log)