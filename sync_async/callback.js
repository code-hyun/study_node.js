const db = [];

function register(user){
    return saveDB(user, function(user){ // 3중 중첩 콜백
        return sendEmail(user, function(user){ // 콜백
            return getResult(user); // 콜백
        })
    })
}

function saveDB(user, callback) {
    db.push(user);
    console.log(`save ${user.name} to DB`);
    return callback(user);
}

function sendEmail(user, callback){
    console.log(`email to ${user.email}`);
    return callback(user)
}

function getResult(user){
    return `success register ${user.name}`;
}
const result = register({email : "andy@test@naver.com", password : "1234", name : 'andy'});
console.log(result);