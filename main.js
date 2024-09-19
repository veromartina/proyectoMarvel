
const urlBase = "http://gateway.marvel.com/v1/public" //¿PUEDO USARLA PARA TRAER TODO (COMIC Y PERSONAJES)

const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const publicKey = "99d7c07d74c026e85a23c1dbdb1454bd";
const ts = "marvel";
const hash = "b1da2d2133efcaee66a056c03b5b33ce";
const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

const contenedorResultados = document.getElementById("contenedor-resultados"); // contenedor div del html

function crearTarjetas(tarjetas) {
    tarjetas.forEach(tarj => {
        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.className = 'card';

        const nuevaImagen = document.createElement('img');
        nuevaImagen.className = 'imgCard';
        
        const imageUrl = `${tarj.thumbnail.path}.${tarj.thumbnail.extension}`; 
        nuevaImagen.src = imageUrl;

        const descripcion = document.createElement('h3');
        descripcion.className ='descripCard';
        descripcion.textContent = tarj.name; 
        descripcion.style.marginTop = '10px'; // Separar imagen del texto

        nuevaTarjeta.appendChild(nuevaImagen);
        nuevaTarjeta.appendChild(descripcion);
        contenedorResultados.appendChild(nuevaTarjeta);
        
        //PARA MOSTRAR EL DETALLE DE CADA CARD
        nuevaTarjeta.addEventListener('click', function() {  //funcion que debe mostarme en detalle : Se debe mostrar la información de un cómic (al clickear sobre el mismo)Portada-Título-Fecha de lanzamiento-Guionistas-Descripción-Personajesincluidos
        //Se debe mostrar la información de un personaje (al clickear sobre el mismo:Imagen-Nombre-Descripción-Cómics en los que aparece.
            alert(tarj.name);   // a modo de ej,
        });
    });
}

function mostrarTarjetas() {
  fetch(urlApi + urlPersonajes + paramAutenticacion) 
  .then((response) => response.json())

  .then((data) => {
    console.log(data);
    const personajes = data.data.results; // Accede a los personajes
    crearTarjetas(personajes);}) // Llama a la función para crear tarjeta

  .catch((error) => console.error(error));
  }

mostrarTarjetas();

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

