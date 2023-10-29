const axios = require('axios');

async function getTop20(){
    const url = "http://raw.githubusercontent.com/wapj/jsbackend/main/movieinfo.json";
    try {
        const result = await axios.get(url);
        const { data } = result;

        if(!data.articleList || data.articleList.size == 0){
            throw new Error('데이터가 없어')
        }

        const movieinfos = data.articleList.map((article, idx) => {
            return {title : article.title, rank: idx + 1};
        })

        for(let movieinfo of movieinfos){
            console.log(`[${movieinfo.rank}위] ${movieinfo.title}`);
        }
        
    } catch (error) {
        throw new Error(error)
    }
}
getTop20()