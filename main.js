const publicKey = "99d7c07d74c026e85a23c1dbdb1454bd";
const ts = "marvel";
const hash = "b1da2d2133efcaee66a056c03b5b33ce";

const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const urlComics = "/v1/public/comics";



const urlBase = "http://gateway.marvel.com/v1/public/";
const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

const tipoBusqueda = document.getElementById("tipo-busqueda");
const ordenBusqueda = document.getElementById("orden-busqueda");
const numeroResultados = document.getElementById("numero-resultados");
const ordenBusquedaComics = document.getElementById("orden-busqueda-comics");
const ordenBusquedaPersonajes = document.getElementById("orden-busqueda-personajes");
const contenedorInput = document.getElementById("contenedor-input");
const valorInput = document.getElementById("valor-input");
const btnBuscar = document.getElementById("btn-buscar");
const contenedorResultados = document.getElementById("contenedor-resultados");
const primeraPagina = document.getElementById("primera-pagina");
const paginaAnterior = document.getElementById("pagina-anterior");
const paginaSiguiente = document.getElementById("pagina-siguiente");
const ultimaPagina = document.getElementById("ultima-pagina");

const resultadosPorPagina = 20;
let paginaActual = 0;
let cantidadDeResultados = 0; // Cambiado a variable global

tipoBusqueda.onchange = () => {
    if (tipoBusqueda.value === "characters") {
        ordenBusquedaComics.classList.add("hidden");
        ordenBusquedaPersonajes.classList.remove("hidden");
    } else if (tipoBusqueda.value === "comics") {
        ordenBusquedaComics.classList.remove("hidden");
        ordenBusquedaPersonajes.classList.add("hidden");
    }
};

const mostrarResultados = (tipo = "comics", orden = "title", contenedorInput = "") => {
    let valorInput = "";
    if (contenedorInput !== "") {
        valorInput = tipo === "comics" ? `&titleStartsWith=${contenedorInput}` : `&nameStartsWith=${contenedorInput}`;
    }
    
    fetch(`${urlBase}${tipo}${paramAutenticacion}&orderBy=${orden}${valorInput}&offset=${paginaActual * resultadosPorPagina}`)
    .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
    .then(data => {
        console.log(data); // Verifica la respuesta de la API
        cantidadDeResultados = data.data.total; // Actualizar la variable para uso posterior
        contenedorResultados.innerHTML = ""; // Limpiar resultados previos

        data.data.results.forEach(tarj => {
            if (tipo === "comics") {
                crearTarjetasComics([tarj]);
            } else if (tipo === "characters") {
                crearTarjetasPersonajes([tarj]);
            }
        });

        let offset = data.data.offset;
        deshabilitarOHabilitarBotones(offset, cantidadDeResultados);
        mostrarCantidadDeResultados(cantidadDeResultados);
    })
    .catch(error => console.error('Error fetching data:', error));
};

function crearTarjetasComics(tarjetas) {
    tarjetas.forEach(tarj => {
        const nuevaTarjetaComics = document.createElement('div');
        nuevaTarjetaComics.className = 'cardComics';

        const conteImgComics = document.createElement("div");
        conteImgComics.className = "contenedorImgComics";
        nuevaTarjetaComics.appendChild(conteImgComics);

        const nuevaImagenComics = document.createElement('img');
        nuevaImagenComics.className = 'imgComics';
        nuevaImagenComics.src = `${tarj.thumbnail.path}.${tarj.thumbnail.extension}`;
        conteImgComics.appendChild(nuevaImagenComics);

        const tituloComics = document.createElement('h3');
        tituloComics.className = 'tituloComics';
        tituloComics.textContent = tarj.title;
        tituloComics.style.marginTop = '10px';
        nuevaTarjetaComics.appendChild(tituloComics);

        contenedorResultados.appendChild(nuevaTarjetaComics);
    });
}

function crearTarjetasPersonajes(tarjetas) {
    tarjetas.forEach(tarj => {
        const nuevaTarjetaPersonajes = document.createElement('div');
        nuevaTarjetaPersonajes.className = 'cardComics';

        const conteImgPersonajes = document.createElement("div");
        conteImgPersonajes.className = "contenedorImgComics";
        nuevaTarjetaPersonajes.appendChild(conteImgPersonajes);

        const nuevaImagenPersonajes = document.createElement('img');
        nuevaImagenPersonajes.className = 'imgComics';
        nuevaImagenPersonajes.src = `${tarj.thumbnail.path}.${tarj.thumbnail.extension}`;
        conteImgPersonajes.appendChild(nuevaImagenPersonajes);

        const tituloPersonajes = document.createElement('h3');
        tituloPersonajes.className = 'tituloComics';
        tituloPersonajes.textContent = tarj.name;
        tituloPersonajes.style.marginTop = '10px';
        nuevaTarjetaPersonajes.appendChild(tituloPersonajes);

        contenedorResultados.appendChild(nuevaTarjetaPersonajes);
    });
}

const buscarResultados = () => {
    if (contenedorInput.value != "") {
        if (tipoBusqueda.value === "characters") {
            mostrarResultados(tipoBusqueda.value, ordenBusquedaPersonajes.value, contenedorInput.value);
        } else {
            mostrarResultados(tipoBusqueda.value, ordenBusquedaComics.value, contenedorInput.value);
        }
    } else {
        if (tipoBusqueda.value === "characters") {
            mostrarResultados(tipoBusqueda.value, ordenBusquedaPersonajes.value);
        } else {
            mostrarResultados(tipoBusqueda.value, ordenBusquedaComics.value);
        }
    }
}

btnBuscar.onclick = () => {
    paginaActual = 0;
    buscarResultados();
}

primeraPagina.onclick = () => {
    contenedorResultados.innerHTML = "";
    paginaActual = 0;
    buscarResultados();
}

paginaAnterior.onclick = () => {
    contenedorResultados.innerHTML = "";
    paginaActual--;
    buscarResultados();
}

paginaSiguiente.onclick = () => {
    contenedorResultados.innerHTML = "";
    paginaActual++;
    buscarResultados();
}

ultimaPagina.onclick = () => {
    if (cantidadDeResultados > 0) {
        paginaActual = Math.floor((cantidadDeResultados - 1) / resultadosPorPagina); // Corregido para usar Math.floor
        buscarResultados();
    }
}

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

const mostrarCantidadDeResultados = (cantidadDeResultados) => {
    numeroResultados.innerHTML = `${cantidadDeResultados}`;
}

// Llama a mostrarResultados inicialmente si es necesario
mostrarResultados();

//
nuevaTarjetaComics.eve