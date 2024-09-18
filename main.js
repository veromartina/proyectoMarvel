/*
Your public key
99d7c07d74c026e85a23c1dbdb1454bd

Your private key
2c70912eacc85117c854d1cd8bf4d0d869fb631d

Read more about how to use your keys to sign requests.

Your rate limit:
 
3000
calls/day Number of calls your application can make per day.

hash=  

*/
/*
const publicKey = '';
const ts = 3000;
const hash = 'c4d792be383164231dbf43283ce1ef7b';

const limit = 20;
let offset = 0;
let totalResults = 0;


function obtenerTarjetas(url) {
    if (!url) {
        url = `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    }
    fetch(url)
        .then(response => response.json())
        .then(data => obtenerTarjetas(data.data.results))
        .catch(error => console.error('Error:', error));
}

*/