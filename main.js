const publicKey = "99d7c07d74c026e85a23c1dbdb1454bd";
const ts = "marvel";
const hash = "b1da2d2133efcaee66a056c03b5b33ce";

const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const urlComics = "/v1/public/comics";

const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

const contenedorResultados = document.getElementById("contenedor-resultados"); // contenedor div del html

const tipoBusqueda = document.getElementById("tipo-busqueda"); //select tipo (comics/perso)

const  ordenBusqueda = document.getElementById("orden-busqueda") //select orden

//TRAER TARJETAS COMICS/PERSONAJES

function traerTarjetas() {

  if (tipoBusqueda.value === "comics") {
    fetch(urlApi + urlComics + paramAutenticacion)
      .then((response) => response.json())

      .then((data) => {

        const comics = data.data.results;
        
        crearTarjetasComics(comics);
      }) // Llama a la función para crear tarjetas comics

      .catch((error) => console.error(error));

  } else (tipoBusqueda.value === "characters")
     //ordenBusqueda.value.innerHTML = "A-Z";
    // ordenBusqueda.value.innerHTML= "Z-A";

    fetch(urlApi + urlPersonajes + paramAutenticacion)
      .then((response) => response.json())
    

      .then((data) => {
      const personajes = data.data.results;
      crearTarjetasPersonajes(personajes);
      //console.log(personajes)
      }) // Llama a la función para crear tarjetas personajes

      .catch((error) => console.error(error));

};

traerTarjetas();

//CREAR LAS TARJETAS  COMICS
function crearTarjetasComics(tarjetas) {
  contenedorResultados.innerHTML = ''; // Limpiar resultados previos
  tarjetas.forEach(tarj => {
    const nuevaTarjetaComics = document.createElement('div');
    nuevaTarjetaComics.className = 'cardComics';

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
    tituloComics.className = 'tituloComics';
    tituloComics.textContent = `${tarj.title}`;
    tituloComics.style.marginTop = '10px'; // Separar imagen del texto
    nuevaTarjetaComics.appendChild(tituloComics);
  }
  )
};

//CREAR LAS TARJETAS PERSONAJES 
function crearTarjetasPersonajes(tarjetas) {
  contenedorResultados.innerHTML = ''; // Limpiar resultados previos
  tarjetas.forEach(tarj => {
    const nuevaTarjetaPersonajes = document.createElement('div');
    nuevaTarjetaPersonajes.className = 'cardComics';

    contenedorResultados.appendChild(nuevaTarjetaPersonajes);

    const conteImgPersonajes = document.createElement("div");
    conteImgPersonajes.className = "contenedorImgComics";
    nuevaTarjetaPersonajes.appendChild(conteImgPersonajes);

    const nuevaImagenPersonajes = document.createElement('img');
    nuevaImagenPersonajes.className = 'imgComics';
    const imageUrlPersonajes = `${tarj.thumbnail.path}.${tarj.thumbnail.extension}`;
    nuevaImagenPersonajes.src = imageUrlPersonajes;
    conteImgPersonajes.appendChild(nuevaImagenPersonajes);

    const tituloPersonajes = document.createElement('h3');
    tituloPersonajes.className = 'tituloComics';
    tituloPersonajes.textContent = `${tarj.name}`;
    tituloPersonajes.style.marginTop = '10px'; // Separar imagen del texto
    nuevaTarjetaPersonajes.appendChild(tituloPersonajes);

  })
};


// FUNCIONALIDAD BOTON BUSCAR

const btnBuscar = document.getElementById("btn-buscar");
btnBuscar.addEventListener("click", () => {
  contenedorResultados.innerHTML = ''; // Limpiar resultados previos
  traerTarjetas();

});


