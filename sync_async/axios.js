const axios = require('axios');

const url = "http://raw.githubusercontent.com/wapj/jsbackend/main/movieinfo.json";

axios
    .get(url)
    .then((result) => {
        if(result.status != 200){
            throw new Error('요청 실패')
        }

        if(result.data){
            console.log(result.data)
            return result.data
        }

        throw new Error('데이터가 없어!')
    })
    .then((data) => {
        if(!data.articleList || data.articleList.size == 0){
            throw new Error('데이터 없어')
        }
        return data.articleList;
    })
    .then((article) => {
        return article.map((article, idx) => {
            return { title : article.title, rank : idx + 1};
        });
    })
    .then((results) => {
        for(let movieinfo of results){
            console.log(`${movieinfo.rank}위 ${movieinfo.title}`);
        }
    })
    .catch((error) => {
        console.log("에러");
        console.error(error);
    })