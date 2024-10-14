const publicKey = "99d7c07d74c026e85a23c1dbdb1454bd";
const ts = "marvel";
const hash = "b1da2d2133efcaee66a056c03b5b33ce";

const urlBase = `http://gateway.marvel.com/v1/public/`;
const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

const urlComics = `http://gateway.marvel.com/v1/public/comics/`;
const urlPersonajes = `http://gateway.marvel.com/v1/public/characters/`;


const tipoBusqueda = document.getElementById("tipo-busqueda");
const ordenBusquedaComics = document.getElementById("orden-busqueda-comics");
const ordenBusquedaPersonajes = document.getElementById("orden-busqueda-personajes");
const contenedorInput = document.getElementById("contenedor-input");
const btnBuscar = document.getElementById("btn-buscar");
const contenedorResultados = document.getElementById("contenedor-resultados");
const primeraPagina = document.getElementById("primera-pagina");
const paginaAnterior = document.getElementById("pagina-anterior");
const paginaSiguiente = document.getElementById("pagina-siguiente");
const ultimaPagina = document.getElementById("ultima-pagina");
const numeroResultados = document.getElementById("numero-resultados");
const contenedorDetalles = document.getElementById("contenedor-detalles")

const resultadosPorPagina = 20;
let paginaActual = 0;
let cantidadDeResultados = 0;

tipoBusqueda.onchange = () => {
    if (tipoBusqueda.value === "characters") {
        ordenBusquedaComics.classList.add("hidden");
        ordenBusquedaPersonajes.classList.remove("hidden");
    } else {
        ordenBusquedaComics.classList.remove("hidden");
        ordenBusquedaPersonajes.classList.add("hidden");
    }
};

const mostrarResultados = (tipo = "comics", orden = "title", contenedorInput = "") => {
    let valorInput = contenedorInput ? (tipo === "comics" ? `&titleStartsWith=${contenedorInput}` : `&nameStartsWith=${contenedorInput}`) : "";

    fetch(`${urlBase}${tipo}${paramAutenticacion}&orderBy=${orden}${valorInput}&offset=${paginaActual * resultadosPorPagina}`)
        .then(res => {
            if (!res.ok) throw new Error('La respuesta de la red no fue correcta');
            return res.json();
        })
        .then(data => {
            console.log(data);
            cantidadDeResultados = data.data.total;
            contenedorResultados.innerHTML = "";

            crearTarjetas(data.data.results, tipo);

            let offset = data.data.offset;
            deshabilitarOHabilitarBotones(offset, cantidadDeResultados);
            mostrarCantidadDeResultados(cantidadDeResultados);
        })
        .catch(error => console.error('Error al obtener datos:', error));
};

function crearTarjetas(tarjetas, tipo) {
    tarjetas.forEach(tarj => {
        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.className = 'tarjetasCreadas';

        const conteImg = document.createElement("div");
        conteImg.className = "contenedorImg";
        nuevaTarjeta.appendChild(conteImg);

        const nuevaImagen = document.createElement('img');
        nuevaImagen.className = "imgTarj";
        nuevaImagen.src = `${tarj.thumbnail.path}.${tarj.thumbnail.extension}`;
        conteImg.appendChild(nuevaImagen);

        const titulo = document.createElement('h3');
        titulo.className = "tituloH3";
        titulo.textContent = tipo === "comics" ? tarj.title : tarj.name;
        titulo.style.marginTop = '10px';
        nuevaTarjeta.appendChild(titulo);

        // Agregar el event listener aquí
        nuevaTarjeta.addEventListener('click', () => {
            console.log(`Clic en tarjeta: ${tipo === "comics" ? tarj.id : tarj.id}`);
            if (tipo === "comics") {
                InfoComics(tarj.id);
            } else if (tipo === "characters") {
                InfoPersonajes(tarj.id);
            }
        });

        contenedorResultados.appendChild(nuevaTarjeta);
    });
}

const buscarResultados = () => {
    if (contenedorInput.value) {
        mostrarResultados(tipoBusqueda.value, tipoBusqueda.value === "characters" ? ordenBusquedaPersonajes.value : ordenBusquedaComics.value, contenedorInput.value);
    } else {
        mostrarResultados(tipoBusqueda.value, tipoBusqueda.value === "characters" ? ordenBusquedaPersonajes.value : ordenBusquedaComics.value);
    }
};

btnBuscar.onclick = () => {
    paginaActual = 0;
    buscarResultados();
};

primeraPagina.onclick = () => {
    contenedorResultados.innerHTML = "";
    paginaActual = 0;
    buscarResultados();
};

paginaAnterior.onclick = () => {
    if (paginaActual > 0) {
        contenedorResultados.innerHTML = "";
        paginaActual--;
        buscarResultados();
    }
};

paginaSiguiente.onclick = () => {
    contenedorResultados.innerHTML = "";
    paginaActual++;
    buscarResultados();
};

ultimaPagina.onclick = () => {
    if (cantidadDeResultados > 0) {
        paginaActual = Math.floor((cantidadDeResultados - 1) / resultadosPorPagina);
        buscarResultados();
    }
};

const deshabilitarOHabilitarBotones = (offset = 0, cantidadDeResultados = 0) => {
    // Comprobar si estamos en la primera página
    if (paginaActual === 0) {
        primeraPagina.disabled = true;
        primeraPagina.classList.remove('bg-blue-500');
        primeraPagina.classList.add('bg-gray-500', 'bg-opacity-30', 'boton-desabilitado');

        paginaAnterior.disabled = true;
        paginaAnterior.classList.remove('bg-blue-500');
        paginaAnterior.classList.add('bg-gray-500', 'bg-opacity-30', 'boton-desabilitado');
    } else {
        primeraPagina.disabled = false;
        primeraPagina.classList.remove('bg-gray-500', 'bg-opacity-30', 'boton-desabilitado');
        primeraPagina.classList.add('bg-blue-500');

        paginaAnterior.disabled = false;
        paginaAnterior.classList.remove('bg-gray-500', 'bg-opacity-30', 'boton-desabilitado');
        paginaAnterior.classList.add('bg-blue-500');
    }

    // Comprobar si estamos en la última página
    if (offset + resultadosPorPagina >= cantidadDeResultados) {
        paginaSiguiente.disabled = true;
        paginaSiguiente.classList.remove('bg-blue-500');
        paginaSiguiente.classList.add('bg-gray-500', 'bg-opacity-30', 'boton-desabilitado');

        ultimaPagina.disabled = true;
        ultimaPagina.classList.remove('bg-blue-500');
        ultimaPagina.classList.add('bg-gray-500', 'bg-opacity-30', 'boton-desabilitado');
    } else {
        paginaSiguiente.disabled = false;
        paginaSiguiente.classList.remove('bg-gray-500', 'bg-opacity-30', 'boton-desabilitado');
        paginaSiguiente.classList.add('bg-blue-500');

        ultimaPagina.disabled = false;
        ultimaPagina.classList.remove('bg-gray-500', 'bg-opacity-30', 'boton-desabilitado');
        ultimaPagina.classList.add('bg-blue-500');
    }
};

const mostrarCantidadDeResultados = (cantidad) => {
    numeroResultados.innerHTML = `${cantidad}`;
};

// Función para mostrar detalles del cómic
const InfoComics = (comicId) => {
    fetch(`${urlComics}${comicId}${paramAutenticacion}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.json();
        })
        .then(json => {
            console.log(json);  // Agregar esto para ver la respuesta
            if (json.data && json.data.results.length) {
                const comic = json.data.results[0];
                contenedorResultados.classList.add("hidden");
                contenedorDetalles.classList.remove("hidden");
                contenedorDetalles.innerHTML = `
                    <div>
                        <h2>${comic.title}</h2>
                        <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}">
                        <p>Fecha de lanzamiento: ${comic.dates[0].date}</p>
                        <p>Descripción: ${comic.description || "No disponible"}</p>
                        <p>Guionistas: ${comic.creators.items.map(item => item.name).join(', ')}</p>
                        <p>Personajes incluidos: ${comic.characters.items.map(item => item.name).join(', ')}</p>
                        
                        <button id="back-button">Volver a la búsqueda</button>
                    </div>
                `;

                document.getElementById('back-button').addEventListener('click', () => {
                    contenedorDetalles.innerHTML = ''; // Limpiar los resultados previos
                    mostrarResultados(); // Llamar a mostrarResultados para mostrar la vista original
                });
            } else {
                console.error("No se encontró el cómic con el ID proporcionado.");
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
};

// Función para mostrar detalles del personaje
const InfoPersonajes = (characterId) => {
    fetch(`${urlPersonajes}${characterId}${paramAutenticacion}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.json();
        })
        .then(json => {
            console.log(json);  // Agregar esto para ver la respuesta
            if (json.data && json.data.results.length) {
                const character = json.data.results[0];
                contenedorResultados.classList.add("hidden");
                contenedorDetalles.classList.remove("hidden");
                contenedorDetalles.innerHTML = `
                    <div>
                        <h2>${character.name}</h2>
                        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
                        <p>Descripción: ${character.description || "No disponible"}</p>
                        <p>Cómics: ${character.comics.items.map(item => item.name).join(', ')}</p>

                        <button id="back-button">Volver a la búsqueda</button>
                    </div>
                `;

                document.getElementById('back-button').addEventListener('click', () => {
                    contenedorDetalles.innerHTML = ''; // Limpiar los resultados previos
                    mostrarResultados(); // Llamar a mostrarResultados para mostrar la vista original
                });
            } else {
                console.error("No se encontró el personaje con el ID proporcionado.");
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
};

mostrarResultados(); // Llama a mostrarResultados inicialmente si es necesario