const mensajeAmarillo = document.getElementById("mensaje-amarillo");
const mensajeVerde = document.getElementById("mensaje-verde");
const mensajeRojo = document.getElementById("mensaje-rojo");
const mensajeCargando = document.getElementById("mensaje-cargando");
const informesContainer = document.getElementById("informe-container");
const cuadritos = document.getElementById("cuadritos");
const mesasEscrutadas = document.getElementById("mesas-escrutadas");
const electores = document.getElementById("electores");
const participacion = document.getElementById("participacion");

let informes = [];
let resultados = "";

document.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("INFORMES")) {
    informes = JSON.parse(localStorage.getItem("INFORMES"));
    /*const promises =*/ informes.forEach((informe) => {
      url = armarUrl(informe);
      return consultarResultados(url, informe);
    });
  } else {
    mostrarMensaje(
      mensajeAmarillo,
      "Debe agregar un INFORME desde Paso o Generales primero!"
    );
  }
});

function mostrarMensaje(tipoMensaje, mensaje) {
  tipoMensaje.textContent = mensaje;
  tipoMensaje.style.visibility = "visible";
  setTimeout(function () {
    ocultarMensajes();
  }, 5000);
}

function armarUrl(informe) {
  let datos = informe.split("|");

  let anioEleccion = datos[0];
  let tipoRecuento = datos[1];
  let tipoEleccion = datos[2];
  let categoriaId = datos[3];
  let distritoId = datos[4];
  let seccionProvincialId = datos[5];
  let seccionId = datos[6];
  let circuitoId = datos[7];
  let mesaId = datos[8];
  let añoSeleccionado = datos[9];
  let cargoSeleccionado = datos[10];
  let distritoSeleccionado = datos[11];
  let seccionSeleccionada = datos[12];

  let urlSinParametros = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`;
  let parametros = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;
  let url = urlSinParametros + parametros;
  return url;
}

async function consultarResultados(url, informe) {
  try {
    mensajeCargando.style.visibility = "visible";
    let response = await fetch(url);

    if (response.ok) {
      mensajeCargando.style.visibility = "hidden";
      let resultados = response.json();
      console.log(resultados);
      crearInforme(resultados, informe);
    } else {
      mostrarMensaje(
        mensajeRojo,
        "Error: Se produjo un error al intentar agregar resultados al informe"
      );
    }
  } catch (err) {
    mostrarMensaje(
      mensajeRojo,
      "Error: Se produjo un error al intentar agregar resultados al informe"
    );
  }
}

function crearInforme(resultados, informe) {
  let datos = informe.split("|");
  let eleccion = datos[2] === "1" ? "Paso" : "Generales";

  let tr = document.createElement("tr");

  let tdProvincia = document.createElement("td");
  cambiarImagenProvincia(tdProvincia, informe);

  let tdEleccion = document.createElement("td");
  let h4Eleccion = document.createElement("h4");
  h4Eleccion.textContent = `Elecciones ${datos[0]} | ${eleccion}`;

  let pEleccion = document.createElement("p");
  pEleccion.classList.add("texto-path");
  pEleccion.textContent = `${datos[0]}>${eleccion}>${datos[10]}>${datos[11]}>${datos[12]}`;

  tdEleccion.appendChild(h4Eleccion);
  tdEleccion.appendChild(pEleccion);

  let tdCuadritos = document.createElement("td");
  let nuevoCuadritos = document.getElementById("cuadritos").cloneNode(true);
  let spansDentroDeCuadritos = nuevoCuadritos.querySelectorAll("span");

  spansDentroDeCuadritos[0].textContent = `Mesas Escrutadas ${resultados.estadoRecuento.mesasTotalizadas}`;
  spansDentroDeCuadritos[1].textContent = `Electores ${resultados.estadoRecuento.cantidadElectores}`;
  spansDentroDeCuadritos[2].innerHTML = `Participacion sobre escrutado <br> ${resultados.estadoRecuento.participacionPorcentaje}%`;

  nuevoCuadritos.style.visibility = "visible";
  tdCuadritos.appendChild(nuevoCuadritos);

  let tdDatos = document.createElement("td");
  resultados.valoresTotalizadosPositivos.forEach(
    (
      agrupacion
    ) => /*=> sirve para definir funciones flecha (arrow functions).*/ {
      let p1Partido = document.createElement("p");
      p1Partido.textContent = agrupacion.nombreAgrupacion;

      let spanP1Partido = document.createElement("span");
      spanP1Partido.textContent = `${agrupacion.votosPorcentaje}%`;
      spanP1Partido.classList.add("porcentajes");

      let p2Partido = document.createElement("p");

      let spanP2Partido = document.createElement("span");
      spanP2Partido.textContent = `${agrupacion.votos} votos`;
      spanP2Partido.classList.add("porcentajes");

      tdDatos.appendChild(p1Partido);
      tdDatos.appendChild(p2Partido);

      p1Partido.appendChild(spanP1Partido);
      p2Partido.appendChild(spanP2Partido);
    }
  );

  tr.appendChild(tdProvincia);
  tr.appendChild(tdEleccion);
  tr.appendChild(tdCuadritos);
  tr.appendChild(tdDatos);

  informesContainer.appendChild(tr);
}

/* function crearInforme(resultados, informe) {
  const datos = informe.split("|");
  const eleccion = datos[2] === "1" ? "Paso" : "Generales";

  const tr = document.createElement("tr");

  const tdProvincia = document.createElement("td");
  cambiarImagenProvincia(tdProvincia, informe);

  const tdEleccion = document.createElement("td");
  const h4Eleccion = document.createElement("h4");
  h4Eleccion.textContent = `Elecciones ${datos[0]} | ${eleccion}`;

  const pEleccion = document.createElement("p");
  pEleccion.classList.add("texto-path");
  pEleccion.textContent = `${datos[0]}>${eleccion}>${datos[10]}>${datos[11]}>${datos[12]}`;

  tdEleccion.appendChild(h4Eleccion);
  tdEleccion.appendChild(pEleccion);

  const tdCuadritos = document.createElement("td");
  const nuevoCuadritos = document.getElementById("cuadritos").cloneNode(true);
  const spansDentroDeCuadritos = nuevoCuadritos.querySelectorAll("span");

  spansDentroDeCuadritos[0].textContent = `Mesas Escrutadas ${resultados.estadoRecuento.mesasTotalizadas}`;
  spansDentroDeCuadritos[1].textContent = `Electores ${resultados.estadoRecuento.cantidadElectores}`;
  spansDentroDeCuadritos[2].innerHTML = `Participacion sobre escrutado <br> ${resultados.estadoRecuento.participacionPorcentaje}%`;

  nuevoCuadritos.style.visibility = "visible";
  tdCuadritos.appendChild(nuevoCuadritos);

  const tdDatos = document.createElement("td");
  resultados.valoresTotalizadosPositivos.forEach((agrupacion) => {
    const p1Partido = document.createElement("p");
    p1Partido.textContent = agrupacion.nombreAgrupacion;

    const spanP1Partido = document.createElement("span");
    spanP1Partido.textContent = `${agrupacion.votosPorcentaje}%`;
    spanP1Partido.classList.add("porcentajes");

    const p2Partido = document.createElement("p");

    const spanP2Partido = document.createElement("span");
    spanP2Partido.textContent = `${agrupacion.votos} votos`;
    spanP2Partido.classList.add("porcentajes");

    tdDatos.appendChild(p1Partido);
    tdDatos.appendChild(p2Partido);

    p1Partido.appendChild(spanP1Partido);
    p2Partido.appendChild(spanP2Partido);
  });

  tr.appendChild(tdProvincia);
  tr.appendChild(tdEleccion);
  tr.appendChild(tdCuadritos);
  tr.appendChild(tdDatos);

  informesContainer.appendChild(tr);
} */
/*function crearInforme(resultados, informe) {
  let datos = informe.split("|");

  let anioEleccion = datos[0];
  let tipoEleccion = datos[2];
  let añoSeleccionado = datos[9];
  let cargoSeleccionado = datos[10];
  let distritoSeleccionado = datos[11];
  let seccionSeleccionada = datos[12];
  let eleccion = "";

  if (tipoEleccion == 1) {
    eleccion = "Paso";
  } else {
    eleccion = "Generales";
  }

  try {
    let agrupaciones = resultados.valoresTotalizadosPositivos;
    const tr = document.createElement("tr");

    const tdProvincia = document.createElement("td");
    cambiarImagenProvincia(tdProvincia, informe);

    const tdEleccion = document.createElement("td");

    const h4Eleccion = document.createElement("h4");
    h4Eleccion.textContent = `Elecciones ${anioEleccion} | ${eleccion}`;

    const pEleccion = document.createElement("p");
    pEleccion.classList.add("texto-path");
    pEleccion.textContent = `${anioEleccion}>${eleccion}>${cargoSeleccionado}>${distritoSeleccionado}>${seccionSeleccionada}`;

    tdEleccion.appendChild(h4Eleccion);
    tdEleccion.appendChild(pEleccion);

    const tdCuadritos = document.createElement("td");
    let nuevoCuadritos = document.getElementById("cuadritos").cloneNode(true);

    tdCuadritos.appendChild(nuevoCuadritos);

    const spansDentroDeCuadritos = nuevoCuadritos.querySelectorAll("span");
    console.log(spansDentroDeCuadritos);

    const spanMesas = spansDentroDeCuadritos[0];
    spanMesas.textContent = `Mesas Escrutadas ${resultados.estadoRecuento.mesasTotalizadas}`;

    const spanElectores = spansDentroDeCuadritos[1];
    spanElectores.textContent = `Electores ${resultados.estadoRecuento.cantidadElectores}`;

    const spanParticipacion = spansDentroDeCuadritos[2];
    spanParticipacion.innerHTML = `Participacion sobre escrutado <br> ${resultados.estadoRecuento.participacionPorcentaje}%`;

    nuevoCuadritos.style.visibility = "visible";

    const tdDatos = document.createElement("td");

    agrupaciones.forEach((agrupacion) => {
      const p1Partido = document.createElement("p"); // crea el <p> donde va el nombre de la lista//
      p1Partido.textContent = agrupacion.nombreAgrupacion; // agrega el nombre de la lista al <p>//

      const spanP1Partido = document.createElement("span"); //crea el span donve va el porcentaje de votos//
      const porcentajeVotos = `${agrupacion.votosPorcentaje}%`; // calculo el porcentaje y hago que solo tenga 2 decimales//
      spanP1Partido.textContent = porcentajeVotos; // agrega el porcentaje//
      spanP1Partido.classList.add("porcentajes"); //agrega el span a la clase porcentajes//

      const p2Partido = document.createElement("p"); //crea el elemnto <p> que va acontener el span con los votos//

      const spanP2Partido = document.createElement("span"); // crea el span donve van los votos//
      spanP2Partido.textContent = `${agrupacion.votos} votos`; // formateo los votos para que se vean asi "XXX votos" //
      spanP2Partido.classList.add("porcentajes");

      tdDatos.appendChild(p1Partido);
      tdDatos.appendChild(p2Partido);

      p1Partido.appendChild(spanP1Partido);
      p2Partido.appendChild(spanP2Partido);
    });

    tr.appendChild(tdProvincia);
    tr.appendChild(tdEleccion);
    tr.appendChild(tdCuadritos);
    tr.appendChild(tdDatos);

    informesContainer.appendChild(tr);
  } catch (error) {
    console.log("No se creo el informe porque el resultado esta vacio");
  }
}*/

function ocultarMensajes() {
  mensajeCargando.style.visibility = "hidden";
  mensajeRojo.style.visibility = "hidden";
  mensajeAmarillo.style.visibility = "hidden";
  mensajeVerde.style.visibility = "hidden";
}

function cambiarImagenProvincia(svgContainer, informe) {
  let datos = informe.split("|");
  let distrito = datos[11];

  const provincia = provinciasSVG.find(
    (item) => item.provincia.toUpperCase() === distrito.toUpperCase()
  );

  if (provincia) {
    const divSvg = document.createElement("div");
    divSvg.innerHTML = provincia.svg;
    divSvg.classList.add("contenedor-provincia");

    svgContainer.appendChild(divSvg);
  } else {
    svgContainer.innerHTML = "<p>La imagen no se pudo cargar</p>";
  }
}
