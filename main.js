const publicKey = "99d7c07d74c026e85a23c1dbdb1454bd";
const ts = "marvel";
const hash = "b1da2d2133efcaee66a056c03b5b33ce";

const urlApi = "http://gateway.marvel.com";
const urlPersonajes = "/v1/public/characters";
const urlComics = "/v1/public/comics";
const urlBase = "http://gateway.marvel.com/v1/public/";

const paramAutenticacion = `?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

const tipoBusqueda = document.getElementById("tipo-busqueda"); // select tipo (comics/perso)
const ordenBusqueda = document.getElementById("orden-busqueda"); // select orden
const numeroResultados = document.getElementById("numero-resultados"); // obtener resultados totales 

const ordenBusquedaComics = document.getElementById("orden-busqueda-comics");
const ordenBusquedaPersonajes = document.getElementById("orden-busqueda-personajes");

const contenedorInput = document.getElementById("contenedor-input");

const btnBuscar = document.getElementById("btn-buscar")

const contenedorResultados = document.getElementById("contenedor-resultados"); // contenedor div del html

const primeraPagina = document.getElementById("primera-pagina");
const paginaAnterior = document.getElementById("pagina-anterior");
const paginaSiguiente = document.getElementById("pagina-siguiente");
const ultimaPagina = document.getElementById("ultima-pagina")

const resultadosPorPagina = 20
let paginaActual = 0
const cantidadDeResultados = 0


function crearTarjetasComics(tarjetas) {
  tarjetas.forEach(tarj => {
    const nuevaTarjetaComics = document.createElement('div');
    nuevaTarjetaComics.className = 'cardComics';

    const conteImgComics = document.createElement("div");
    conteImgComics.className = "contenedorImgComics";
    nuevaTarjetaComics.appendChild(conteImgComics);

    const nuevaImagenComics = document.createElement('img');
    nuevaImagenComics.className = 'imgComics';
    nuevaImagenComics.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`; //${comic.thumbnail.path}.jpg
    conteImgComics.appendChild(nuevaImagenComics);

    const tituloComics = document.createElement('h3');
    tituloComics.className = 'tituloComics';
    tituloComics.textContent = tarj.title;
    tituloComics.style.marginTop = '10px';
    nuevaTarjetaComics.appendChild(tituloComics);

    contenedorResultados.appendChild(nuevaTarjetaComics);
  });
}

// CREAR LAS TARJETAS PERSONAJES
function crearTarjetasPersonajes(tarjetas) {
  tarjetas.forEach(tarj => {
    const nuevaTarjetaPersonajes = document.createElement('div');
    nuevaTarjetaPersonajes.className = 'cardComics';

    const conteImgPersonajes = document.createElement("div");
    conteImgPersonajes.className = "contenedorImgComics";
    nuevaTarjetaPersonajes.appendChild(conteImgPersonajes);

    const nuevaImagenPersonajes = document.createElement('img');
    nuevaImagenPersonajes.className = 'imgComics';
    nuevaImagenPersonajes.src = `${character.thumbnail.path}.${character.thumbnail.extension}`; //${character.thumbnail.path}.jpg
    conteImgPersonajes.appendChild(nuevaImagenPersonajes);

    const tituloPersonajes = document.createElement('h3');
    tituloPersonajes.className = 'tituloComics';
    tituloPersonajes.textContent = tarj.name;
    tituloPersonajes.style.marginTop = '10px';
    nuevaTarjetaPersonajes.appendChild(tituloPersonajes);

    contenedorResultados.appendChild(nuevaTarjetaPersonajes);
  });
}


// MOSTRAR RESULTADOS 

tipoBusqueda.onchange = () => {
    if (tipoBusqueda.value === "characters") {
      ordenBusquedaComics.classList.add("hidden")
      ordenBusquedaPersonajes.classList.remove("hidden")
    }
    if (tipoBusqueda.value === "comics") {
      ordenBusquedaComics.classList.remove("hidden")
      ordenBusquedaPersonajes.classList.add("hidden")
    }
}

const mostrarResultados = (tipo = "comics", orden = "title", contenedorInput = "") => {
     valorInput = ""
    if (contenedorInput !== "") {
        if (tipo === "comics") {
            valorInput = `&titleStartsWith=${contenedorInput}`
        }
        if (tipo === "characters"){
            valorInput = `&nameStartsWith=${contenedorInput}`
        }
    }
    fetch (`${urlBase}${tipo}${paramAutenticacion}&orderBy=${orden}${valorInput}&offset=${paginaActual * resultadosPorPagina}`)
   
    .then(res => res.json())
    .then(data => {
        total = data.data.total
        //contenedorResultados.innerHTML = "";
        console.log(data)
       console.log(total)
        data.data.results.map((tipo) => {
            if (tipo == "comics") {
                //return contenedorResultados.innerHTML +=
                return crearTarjetasComics(tipo)
            }
            if (tipo == "characters") {               
                //return contenedorResultados.innerHTML +=
                return crearTarjetasPersonajes(tipo)
            }
        })
        let offset = data.data.offset
        deshabilitarOHabilitarBotones(offset, cantidadDeResultados)
        mostrarCantidadDeResultados(cantidadDeResultados)

    })
}

mostrarResultados();


const buscarResultados = () => {
    if (contenedorInput.value != "") {
        if (tipoBusqueda.value === "characters") {
            mostrarResultados(tipoBusqueda.value, ordenBusquedaPersonajes.value, contenedorInput.value)
        }
        else {
            mostrarResultados(tipoBusqueda.value, ordenBusquedaComics.value, contenedorInput.value)
        }
    }
    else {
        if (tipoBusqueda.value === "characters") {
            mostrarResultados(tipoBusqueda.value, ordenBusquedaPersonajes.value)
        }
        else {
            mostrarResultados(tipoBusqueda.value, ordenBusquedaComics.value)
        }
    }
}

btnBuscar.onclick = () => {
    paginaActual = 0
    buscarResultados()
}


primeraPagina.onclick = () => {
    contenedorResultados.innerHTML = ""
    paginaActual = 0
    buscarResultados()
}

paginaAnterior.onclick = () => {
  contenedorResultados.innerHTML = ""
    paginaActual--
    buscarResultados()
}

paginaSiguiente.onclick = () => {
  contenedorResultados.innerHTML = ""
    paginaActual++
    buscarResultados()
}

ultimaPagina.onclick = () => {
    let restoDeResultados = cantidadDeResultados % resultadosPorPagina
    if (restoDeResultados > 0 ) {
        paginaActual = (cantidadDeResultados - (restoDeResultados)) / resultadosPorPagina
    }    
    else {
        paginaActual = (cantidadDeResultados / resultadosPorPagina) - 1
    }
    buscarResultados()
}

deshabilitarOHabilitarBotones = (offset = 0, cantidadDeResultados = 0) => {
    if (paginaActual == 0) {
        primeraPagina.disabled = true
        paginaAnterior.disabled = true
    }
    else {
        primeraPagina.disabled = false
        paginaAnterior.disabled = false
    }

    if (offset + 20 >= cantidadDeResultados) {
        paginaSiguiente
    .disabled = true
        ultimaPagina.disabled = true
    }
    else {
        paginaSiguiente
    .disabled = false
        ultimaPagina.disabled = false
    }
}


const mostrarCantidadDeResultados = (cantidadDeResultados) => {
  numeroResultados.innerHTML = `${cantidadDeResultados}`
}

