const data = require("./myData_2.json");

// json 데이터 넣기
data[0] = {
    "name" : 'Park',
    'age' : 30,
    "hobby" : ['농구', '야구', '러닝'],
    "skill" : {
        "DB" : ["myBatis", "JDBC", "JPA"],
        "Java" : ["Spring", "Spring Boot"],
    }
}
console.log(data);

// 데이터 추가
data[0].skill.JavaScript = {
    "node" : ["node1", "node2"],
    "react" : ["react1", "react2"]
}
console.log(data[0].skill);

// 데이터 삭제
delete data[0].skill.DB;
delete data[0].skill.Java;
delete data[0].hobby;

// 결과
console.log(data[0])


// data[1]에 json 데이터 넣기
data[1]={
    name : "Kim"
}
data[1].age = 25;
data[1].hobby = [];
data[1].hobby.push('야구', '농구', '러닝');

// 출력
console.log(data[1]);