const publicKey = "99d7c07d74c026e85a23c1dbdb1454bd";
const ts = "marvel";
const hash = "b1da2d2133efcaee66a056c03b5b33ce";

const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const urlComics = "/v1/public/comics";

const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

const contenedorResultados = document.getElementById("contenedor-resultados"); // contenedor div del html

function mostrarTarjetas() {
  fetch(urlApi +  urlComics + paramAutenticacion) 
  .then((response) => response.json())

  .then((data) => {
    
    const comics = data.data.results; // Accede a los 
    console.log(data);
    crearTarjetas(comics);}) // Llama a la función para crear tarjeta

  .catch((error) => console.error(error));
  }

mostrarTarjetas();

function crearTarjetas(tarjetas) {
    tarjetas.forEach(tarj => {
        const nuevaTarjetaComics = document.createElement('div');
        nuevaTarjetaComics.className = 'cardComics';
        nuevaTarjetaComics.setAttribute('tabindex', '0');;  //Hace que el div sea enfocable y su posición en el orden de tabulación depende de su lugar en el HTML.Mejora la accesibilidad y permite la interacción del usuario.
        contenedorResultados.appendChild(nuevaTarjetaComics);

        const conteImgComics = document.createElement("div");
        conteImgComics.className = "contenedorImgComics";
        nuevaTarjetaComics.appendChild(conteImgComics);

        const nuevaImagenComics = document.createElement('img');
        nuevaImagenComics.className = 'imgComics';
        const imageUrlComics = `${tarj.thumbnail.path}.${tarj.thumbnail.extension}`; 
        nuevaImagenComics.src = imageUrlComics;
        conteImgComics.appendChild(nuevaImagenComics);

        const tituloComics = document.createElement('h3');
        tituloComics.className ='tituloComics';
        tituloComics.textContent = `${tarj.title}`; 
        tituloComics.style.marginTop = '10px'; // Separar imagen del texto
        nuevaTarjetaComics.appendChild(tituloComics);
        
        
        
        
        //PARA MOSTRAR EL DETALLE DE CADA CARD
        //nuevaTarjeta.addEventListener('click', function() {  //funcion que debe mostarme en detalle : Se debe mostrar la información de un cómic (al clickear sobre el mismo)Portada-Título-Fecha de lanzamiento-Guionistas-Descripción-Personajesincluidos
        //Se debe mostrar la información de un personaje (al clickear sobre el mismo:Imagen-Nombre-Descripción-Cómics en los que aparece.
        //    alert(tarj.name);   // a modo de ej,
        });
      }




/*  REALIZADO EN CLASE --------------------
const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const publicKey = "99d7c07d74c026e85a23c1dbdb1454bd";
const ts = "marvel";
const hash = "b1da2d2133efcaee66a056c03b5b33ce";
const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

fetch(urlApi + urlPersonajes + paramAutenticacion, {
  method: "GET",
  headers: {
    /* Authorization: `${publicKey}`, 
    "Content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

  FIN REALIZADO  EN CLASE ---------------------- */

