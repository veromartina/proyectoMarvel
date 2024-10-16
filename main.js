const publicKey = "99d7c07d74c026e85a23c1dbdb1454bd";
const ts = "marvel";
const hash = "b1da2d2133efcaee66a056c03b5b33ce";

const urlBase = `http://gateway.marvel.com/v1/public/`;
const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

const urlComics = `${urlBase}comics/`;
const urlPersonajes = `${urlBase}characters/`;

const tipoBusqueda = document.getElementById("tipo-busqueda");
const ordenBusquedaComics = document.getElementById("orden-busqueda-comics");
const ordenBusquedaPersonajes = document.getElementById(
    "orden-busqueda-personajes"
);
const contenedorInput = document.getElementById("contenedor-input");
const btnBuscar = document.getElementById("btn-buscar");
const contenedorResultados = document.getElementById("contenedor-resultados");
const contenedorDetalles = document.getElementById("contenedor-detalles");
const primeraPagina = document.getElementById("primera-pagina");
const paginaAnterior = document.getElementById("pagina-anterior");
const paginaSiguiente = document.getElementById("pagina-siguiente");
const ultimaPagina = document.getElementById("ultima-pagina");
const numeroResultados = document.getElementById("numero-resultados");
const totales = document.getElementById("totales");

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

const mostrarResultados = (
    tipo = "comics",
    orden = "title",
    contenedorInput = ""
) => {
    let valorInput = contenedorInput
        ? tipo === "comics"
            ? `&titleStartsWith=${contenedorInput}`
            : `&nameStartsWith=${contenedorInput}`
        : "";

    fetch(
        `${urlBase}${tipo}${paramAutenticacion}&orderBy=${orden}${valorInput}&offset=${paginaActual * resultadosPorPagina
        }`
    )
        .then((res) => {
            if (!res.ok) throw new Error("La respuesta de la red no fue correcta");
            return res.json();
        })
        .then((data) => {
            console.log(data);
            cantidadDeResultados = data.data.total;
            contenedorResultados.innerHTML = "";

            crearTarjetas(data.data.results, tipo);

            let offset = data.data.offset;
            deshabilitarOHabilitarBotones(offset, cantidadDeResultados);
            mostrarCantidadDeResultados(cantidadDeResultados);
        })
        .catch((error) => console.error("Error al obtener datos:", error));
};

function crearTarjetas(tarjetas, tipo) {
    tarjetas.forEach((tarj) => {
        const nuevaTarjeta = document.createElement("div");
        nuevaTarjeta.className = "tarjetasCreadas";

        const conteImg = document.createElement("div");
        conteImg.className = "contenedorImg";
        nuevaTarjeta.appendChild(conteImg);
        const titulo = document.createElement("h3");
        nuevaTarjeta.appendChild(titulo);
        titulo.className = "tituloH3";
        titulo.textContent = tipo === "comics" ? tarj.title : tarj.name;
        titulo.style.marginTop = "10px";
        

        const nuevaImagen = document.createElement("img");
        nuevaImagen.className = "imgTarj";
        nuevaImagen.src = `${tarj.thumbnail.path}.${tarj.thumbnail.extension}`;
        conteImg.appendChild(nuevaImagen);

        nuevaTarjeta.addEventListener("click", () => {
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
        mostrarResultados(
            tipoBusqueda.value,
            tipoBusqueda.value === "characters"
                ? ordenBusquedaPersonajes.value
                : ordenBusquedaComics.value,
            contenedorInput.value
        );
    } else {
        mostrarResultados(
            tipoBusqueda.value,
            tipoBusqueda.value === "characters"
                ? ordenBusquedaPersonajes.value
                : ordenBusquedaComics.value
        );
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
        paginaAnterior.classList.add('bg-gray-500', 'bg-opacity-30','boton-desabilitado');
    } else {
        primeraPagina.disabled = false;
        primeraPagina.classList.remove('bg-gray-500', 'bg-opacity-30','boton-desabilitado');
        primeraPagina.classList.add('bg-blue-500');

        paginaAnterior.disabled = false;
        paginaAnterior.classList.remove('bg-gray-500', 'bg-opacity-30','boton-desabilitado');
        paginaAnterior.classList.add('bg-blue-500');
    }

    // Comprobar si estamos en la última página
    if (offset + resultadosPorPagina >= cantidadDeResultados) {
        paginaSiguiente.disabled = true;
        paginaSiguiente.classList.remove('bg-blue-500');
        paginaSiguiente.classList.add('bg-gray-500', 'bg-opacity-30','boton-desabilitado');

        ultimaPagina.disabled = true;
        ultimaPagina.classList.remove('bg-blue-500');
        ultimaPagina.classList.add('bg-gray-500', 'bg-opacity-30','boton-desabilitado');
    } else {
        paginaSiguiente.disabled = false;
        paginaSiguiente.classList.remove('bg-gray-500', 'bg-opacity-30','boton-desabilitado');
        paginaSiguiente.classList.add('bg-blue-500');

        ultimaPagina.disabled = false;
        ultimaPagina.classList.remove('bg-gray-500', 'bg-opacity-30','boton-desabilitado');
        ultimaPagina.classList.add('bg-blue-500');
    }
}



const mostrarCantidadDeResultados = (cantidad) => {
    numeroResultados.innerHTML = `${cantidad}`;
};

const InfoComics = (comicId) => {
    fetch(`${urlComics}${comicId}${paramAutenticacion}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la red");
            }
            return response.json();
        })
        .then((json) => {
            console.log(json);
            if (json.data && json.data.results.length > 0) {
                const comic = json.data.results[0];

                if (
                    comic.thumbnail &&
                    comic.thumbnail.path &&
                    comic.thumbnail.extension
                ) {
                    const imagenUrl = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
                    const fechaOriginal = new Date(comic.dates[0].date);
                    const dia = String(fechaOriginal.getDate()).padStart(2, "0");
                    const mes = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
                    const año = fechaOriginal.getFullYear();

                    contenedorResultados.classList.add("hidden");
                    contenedorDetalles.classList.remove("hidden");
                    totales.classList.add("hidden");
                    contenedorDetalles.innerHTML = `
                    <button id="botonVolver">Volver a la búsqueda</button> 
                            <h2 class="tituloH2">${comic.title}</h2>
                            <img class="imgTarj" src="${imagenUrl}" alt="${comic.title
                        }">
                            <h3 class="subtitulos">Publicado:</h3>
                            <p class="mt-2 text-gray-600"> ${dia}/${mes}/${año}</p>
                            <h3 class="subtitulos">Guionistas:</h3>
                            <p class="mt-2 text-gray-600"> ${comic.creators.items
                            .map((item) => item.name)
                            .join(", ")}</p>
                            <h3 class="subtitulos">Descripción:</h3>
                            <p class="mt-2 text-gray-600">${comic.description}</p>
                            <h2 class="tituloH2">Cantidad de personajes:${comic.characters.items.length
                        }</h2>`;
                    document.getElementById("botonVolver").addEventListener("click", () => {
                        contenedorDetalles.classList.add("hidden");
                        contenedorResultados.classList.remove("hidden");
                        totales.classList.remove("hidden");
                        mostrarResultados();
                    });

                    const personajes = comic.characters.items;
                    const personajesComics = document.createElement("div");
                    contenedorDetalles.appendChild(personajesComics);

                    if (personajes.length > 0) {
                        personajes.forEach((item) => {
                            personajesComics.innerHTML += `
                                    <h3 class="subtitulos">${item.name}</h3>
                                    <img src="${item.thumbnail.path}.${item.thumbnail.extension}" alt="${item.name}"/>
                            `;
                        });
                    } else if (personajes.length === 0) {
                        personajesComics.innerHTML += `
                        <div class="flex flex-wrap mt-10 min-h-[300px]">
                        <h2 class="tituloH2">No se encontraron resultados</h2> 
                        </div>
                        `;
                    }
                } else {
                    console.error("No se encontró la imagen del cómic.");
                }
            } else {
                console.error("No se encontró el cómic con el ID proporcionado.");
            }
        })

        .catch((error) => {
            console.error("Error al obtener los datos:", error);
        });
};

const InfoPersonajes = (characterId) => {
    fetch(`${urlPersonajes}${characterId}${paramAutenticacion}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la red");
            }
            return response.json();
        })
        .then((json) => {
            console.log(json);
            if (json.data && json.data.results.length > 0) {
                const character = json.data.results[0];
                const imagenUrl = `${character.thumbnail.path}.${character.thumbnail.extension}`;

                contenedorResultados.classList.add("hidden");
                contenedorDetalles.classList.remove("hidden");
                contenedorDetalles.innerHTML = `
                    <div>
                        <img src="${imagenUrl}" alt="${character.name}">
                        <h2>${character.name}</h2>
                        <h2>Cómics</h2>
                        
                        <p>Cómics: ${character.comics.items
                        .map((item) => item.name)
                        .join(", ")}</p>
                        
                        <button id="botonVolver">Volver a la búsqueda</button>
                    </div>
                `;

                document.getElementById("botonVolver").addEventListener("click", () => {
                    contenedorDetalles.innerHTML = "";
                    mostrarResultados();
                
                });
            } else {
                console.error("No se encontró el personaje con el ID proporcionado.");
            }
        })
        .catch((error) => {
            console.error("Error al obtener los datos:", error);
        });
};

mostrarResultados(); // Llama a mostrarResultados inicialmente si es necesario
