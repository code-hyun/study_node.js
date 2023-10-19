var request = require('request');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        request({ url: url, method: 'GET' }, function(error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

async function main(url) {
    try {
        let data = await fetchUrl(url);
        return data;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error; 
    }
}

module.exports = {
    fetchUrl: fetchUrl,
    main: main
};
