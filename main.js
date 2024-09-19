
// public key
//99d7c07d74c026e85a23c1dbdb1454bd

//private key
//2c70912eacc85117c854d1cd8bf4d0d869fb631d

//hash=  b1da2d2133efcaee66a056c03b5b33ce

//ts = "marvel"


const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const publicKey = "99d7c07d74c026e85a23c1dbdb1454bd";
const ts = "marvel";
const hash = "b1da2d2133efcaee66a056c03b5b33ce";
const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

fetch(urlApi + urlPersonajes + paramAutenticacion, {
  method: "GET",
  headers: {
    /* Authorization: `${publicKey}`, */
    "Content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));




/*
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