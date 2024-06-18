const tipoEleccion = 2;
const tipoRecuento = 1;
let periodosSelect = document.getElementById("año");
let cargosSelect = document.getElementById("cargo");
let distritosSelect = document.getElementById("distrito");
let seccionSelect = document.getElementById("seccion");
let inputSeccionProvincial = document.getElementById("hdSeccionProvincial");
let botonFiltrar = document.getElementById("filtrar");
let titulo = document.getElementById("titulo");
let subtitulo = document.getElementById("subtitulo");
let contenido = document.getElementById("sec-contenido");
let mensajeAmarillo = document.getElementById("mensaje-amarillo");
let mensajeVerde = document.getElementById("mensaje-verde");
let mensajeRojo = document.getElementById("mensaje-rojo");
let mensajeCargando = document.getElementById("mensaje-cargando");
let cuadroMesas = document.getElementById("cuadro-mesas");
let cuadroElectores = document.getElementById("cuadro-electores");
let cuadroParticipacion = document.getElementById("cuadro-participacion");
let svgContainer = document.getElementById("svg-container");
let cuadroAgrupaciones = document.getElementById("cuadro-agrupaciones");
let cuadroResumenVotos = document.getElementById("cuadro-resumen");
let botonAgregarInforme = document.getElementById("agregar-informe");

let añoSeleccionado = "";
let cargoSeleccionado = "";
let distritoSeleccionado = "";
let seccionSeleccionada = "";

let resultados = "";

let agrupacionesYColores = {};

let coloresGraficaPlenos = [
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-amarillo"
  ),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-celeste"
  ),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-bordo"
  ),
  getComputedStyle(document.documentElement).getPropertyValue("--grafica-lila"),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-lila2"
  ),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-verde"
  ),
  getComputedStyle(document.documentElement).getPropertyValue("--grafica-gris"),
];
let coloresGraficaLivianos = [
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-amarillo-claro"
  ),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-celeste-claro"
  ),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-bordo-claro"
  ),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-lila-claro"
  ),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-lila2-claro"
  ),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-verde-claro"
  ),
  getComputedStyle(document.documentElement).getPropertyValue(
    "--grafica-gris-claro"
  ),
];

document.addEventListener("DOMContentLoaded", () => {
  mostrarMensaje(
    mensajeAmarillo,
    "Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR"
  );
});
document.addEventListener("DOMContentLoaded", consultarAños);
periodosSelect.addEventListener("change", consultarDatos);
cargosSelect.addEventListener("change", cargarDistritos);
distritosSelect.addEventListener("change", cargarSeccion);
seccionSelect.addEventListener("change", () => {
  seccionSeleccionada =
    seccionSelect.options[seccionSelect.selectedIndex].textContent;
});
botonFiltrar.addEventListener("click", consultarResultados);
botonAgregarInforme.addEventListener("click", agregarInforme);

function crearListaAgrupacionesYColores() {
  let agrupaciones = resultados.valoresTotalizadosPositivos.sort(
    (a, b) => b.votos - a.votos
  );
  let cont = 0;
  agrupaciones.forEach((agrupacion) => {
    let idAgrupacion = agrupacion.idAgrupacion;

    if (cont < 6) {
      agrupacionesYColores[idAgrupacion] = {
        colorPleno: coloresGraficaPlenos[cont],
        colorLiviano: coloresGraficaLivianos[cont],
      };
      cont++;
    } else {
      agrupacionesYColores[idAgrupacion] = {
        colorPleno: coloresGraficaPlenos[cont],
        colorLiviano: coloresGraficaLivianos[cont],
      };
    }
  });
}

function completarCuadroAgrupaciones() {
  let agrupaciones = resultados.valoresTotalizadosPositivos.sort(
    (a, b) => b.votos - a.votos
  );

  removerHijos(cuadroAgrupaciones);

  if (agrupaciones) {
    agrupaciones.forEach((agrupacion) => {
      let divAgrupacion = document.createElement("div");
      divAgrupacion.classList.add("agrupacion");

      let h4Titulo = document.createElement("h4");
      h4Titulo.classList.add("titulo-agrupaciones");
      h4Titulo.textContent = agrupacion.nombreAgrupacion;
      divAgrupacion.appendChild(h4Titulo);

      let divPartido = document.createElement("div");
      divPartido.classList.add("partido");

      let p1Partido = document.createElement("p");
      p1Partido.textContent = agrupacion.nombreAgrupacion;

      let spanP1Partido = document.createElement("span");
      let porcentajeVotos = `${agrupacion.votosPorcentaje}%`;
      spanP1Partido.textContent = porcentajeVotos;
      spanP1Partido.classList.add("porcentajes");
      p1Partido.appendChild(spanP1Partido);
      divPartido.appendChild(p1Partido);

      let p2Partido = document.createElement("p");
      let spanP2Partido = document.createElement("span");
      spanP2Partido.textContent = `${agrupacion.votos} votos`;
      spanP2Partido.classList.add("porcentajes");
      p2Partido.appendChild(spanP2Partido);
      divPartido.appendChild(p2Partido);

      let divBarra = document.createElement("div");
      divBarra.classList.add("progress");
      divBarra.style.background =
        agrupacionesYColores[agrupacion.idAgrupacion.toString()].colorLiviano;

      let divProgresoBarra = document.createElement("div");
      divProgresoBarra.classList.add("progress-bar");
      divProgresoBarra.style.background =
        agrupacionesYColores[agrupacion.idAgrupacion.toString()].colorPleno;
      divProgresoBarra.style.width = porcentajeVotos;

      let spanDivProgresoBarra = document.createElement("span");
      spanDivProgresoBarra.textContent = porcentajeVotos;
      spanDivProgresoBarra.classList.add("progress-bar-text");

      divProgresoBarra.appendChild(spanDivProgresoBarra);
      divBarra.appendChild(divProgresoBarra);
      divPartido.appendChild(divBarra);

      divAgrupacion.appendChild(divPartido);
      cuadroAgrupaciones.appendChild(divAgrupacion);
    });
  }
}

function completarResumenVotos() {
  let agrupaciones = resultados.valoresTotalizadosPositivos;
  let cont = 0;

  removerHijos(cuadroResumenVotos);

  agrupaciones.forEach((agrupacion) => {
    if (cont < 7) {
      const divBarra = document.createElement("div");
      divBarra.classList.add("bar");
      divBarra.style.width = `${agrupacion.votosPorcentaje}%`;
      divBarra.style.background =
        agrupacionesYColores[agrupacion.idAgrupacion].colorPleno;
      divBarra.dataset.name = agrupacion.nombreAgrupacion;
      divBarra.title = `${agrupacion.nombreAgrupacion} ${agrupacion.votosPorcentaje}%`;
      cont++;

      cuadroResumenVotos.appendChild(divBarra);
    }
  });
}

function ocultarMensajes() {
  mensajeCargando.style.visibility = "hidden";
  mensajeRojo.style.visibility = "hidden";
  mensajeAmarillo.style.visibility = "hidden";
  mensajeVerde.style.visibility = "hidden";
}

function removerHijos(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function validarSelects() {
  return (
    periodosSelect.value !== "none" &&
    cargosSelect.value !== "none" &&
    distritosSelect.value !== "none" &&
    seccionSelect.value !== "none"
  );
}

function mostrarCampoFaltante() {
  if (periodosSelect.value == "none") {
    mostrarMensaje(
      mensajeAmarillo,
      "La operación no se pudo completar.Por favor complete todos los campos!"
    );
  } else if (cargosSelect.value == "none") {
    mostrarMensaje(
      mensajeAmarillo,
      "La operación no se pudo completar.Por favor complete todos los campos!"
    );
  } else if (distritosSelect.value == "none") {
    mostrarMensaje(
      mensajeAmarillo,
      "La operación no se pudo completar.Por favor complete todos los campos!"
    );
  } else {
    mostrarMensaje(
      mensajeAmarillo,
      "La operación no se pudo completar.Por favor complete todos los campos!"
    );
  }
}

function mostrarTitulos() {
  titulo.textContent = `Elecciones ${periodosSelect.value} | Generales`;
  subtitulo.textContent = `${añoSeleccionado}>Generales>${cargoSeleccionado}>${distritoSeleccionado}>${seccionSeleccionada}`;
  titulo.style.visibility = "visible";
  subtitulo.style.visibility = "visible";
}

function mostrarContenido() {
  contenido.style.visibility = "visible";
}

function cambiarImagenProvincia() {
  removerHijos(svgContainer);

  const provincia = provinciasSVG.find(
    (item) =>
      item.provincia.toUpperCase() === distritoSeleccionado.toUpperCase()
  );

  if (provincia) {
    let h3Provincia = document.createElement("h3");
    h3Provincia.textContent = provincia.provincia;
    h3Provincia.classList.add("titulo-cuadros", "titulo-provincias");

    let divSvg = document.createElement("div");
    divSvg.innerHTML = provincia.svg;
    divSvg.classList.add("contenedor-provincia");

    svgContainer.appendChild(h3Provincia);
    svgContainer.appendChild(divSvg);
  } else {
    svgContainer.innerHTML = "<p>La imagen no se pudo cargar</p>";
  }
}

async function consultarResultados() {
  if (validarSelects()) {
    ocultarMensajes();
    const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`;
    let anioEleccion = periodosSelect.value;
    let categoriaId = cargosSelect.value;
    let distritoId = distritosSelect.value;
    let seccionProvincialId = 0; //tiene que ir 0 porque no reconoce el null
    let seccionId = seccionSelect.value;
    let circuitoId = "";
    let mesaId = "";
    let parametros = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;
    try {
      mensajeCargando.style.visibility = "visible";
      const response = await fetch(url + parametros);
      if (response.ok) {
        mensajeCargando.style.visibility = "hidden";
        resultados = response.json();
        console.log(resultados);
        mostrarTitulos();
        cambiarImagenProvincia();
        crearListaAgrupacionesYColores();
        completarCuadroAgrupaciones();
        completarResumenVotos();
        mostrarContenido();
        cuadroMesas.textContent = `${resultados.estadoRecuento.mesasTotalizadas}`;
        cuadroElectores.textContent = `${resultados.estadoRecuento.cantidadElectores}`;
        cuadroParticipacion.textContent = `${resultados.estadoRecuento.participacionPorcentaje}%`;
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
  } else {
    mostrarCampoFaltante();
  }
}

function limpiarSelect(select) {
  while (select.options.length > 1) {
    select.remove(1);
  }
}

function cargarSeccion() {
  distritoSeleccionado =
    distritosSelect.options[distritosSelect.selectedIndex].textContent;
  limpiarSelect(seccionSelect);

  datosElecciones.forEach((eleccion) => {
    if (eleccion.IdEleccion == tipoEleccion) {
      eleccion.Cargos.forEach((cargo) => {
        if (cargo.IdCargo == cargosSelect.value) {
          cargo.Distritos.forEach((distrito) => {
            if (distrito.IdDistrito == distritosSelect.value) {
              distrito.SeccionesProvinciales.forEach((seccionProvincial) => {
                inputSeccionProvincial.id =
                  seccionProvincial.IDSeccionProvincial;
                seccionProvincial.Secciones.forEach((seccion) => {
                  const option = document.createElement("option");
                  option.value = seccion.IdSeccion;
                  option.textContent = seccion.Seccion;
                  seccionSelect.appendChild(option);
                });
              });
            }
          });
        }
      });
    }
  });
}

function cargarDistritos() {
  cargoSeleccionado =
    cargosSelect.options[cargosSelect.selectedIndex].textContent;
  limpiarSelect(distritosSelect);
  limpiarSelect(seccionSelect);

  datosElecciones.forEach((eleccion) => {
    if (eleccion.IdEleccion == tipoEleccion) {
      eleccion.Cargos.forEach((cargo) => {
        if (cargo.IdCargo == cargosSelect.value) {
          cargo.Distritos.forEach((distrito) => {
            const option = document.createElement("option");
            option.value = distrito.IdDistrito;
            option.textContent = distrito.Distrito;
            distritosSelect.appendChild(option);
          });
        }
      });
    }
  });
}

async function consultarAños() {
  const url = `https://resultados.mininterior.gob.ar/api/menu/periodos`;
  try {
    const response = await fetch(url);

    if (response.ok) {
      const años = response.json();
      años.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.text = item;
        periodosSelect.appendChild(option);
      });
    } else {
      mostrarMensaje(
        mensajeRojo,
        "Error: Se produjo un error al intentar agregar resultados al informe"
      );
    }
  } catch (err) {
    ocultarMensajes();
    mostrarMensaje(
      mensajeRojo,
      "Error: Se produjo un error al intentar agregar resultados al informe"
    );
    setInterval(function () {
      mensajeRojo.style.visibility = "visible";
    }, 5000);
  }
}

async function consultarDatos() {
  añoSeleccionado =
    periodosSelect.options[periodosSelect.selectedIndex].textContent;
  const url = "https://resultados.mininterior.gob.ar/api/menu?año=";
  try {
    const response = await fetch(url + periodosSelect.value);

    if (response.ok) {
      limpiarSelect(cargosSelect);
      limpiarSelect(distritosSelect);
      limpiarSelect(seccionSelect);

      datosElecciones = response.json();
      datosElecciones.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
          eleccion.Cargos.forEach((cargo) => {
            const option = document.createElement("option");
            option.value = cargo.IdCargo;
            option.text = cargo.Cargo;
            cargosSelect.appendChild(option);
          });
        }
      });
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

function agregarInforme() {
  let vAnio = periodosSelect.value;
  let vTipoRecuento = tipoRecuento;
  let vTipoEleccion = tipoEleccion;
  let vCategoriaId = cargosSelect.value;
  let vDistrito = distritosSelect.value;
  let vSeccionProvincial = 0;
  let seccionId = seccionSelect.value;
  let circuitoId = "";
  let mesaId = "";

  nuevoInforme = `${vAnio}|${vTipoRecuento}|${vTipoEleccion}|${vCategoriaId}|${vDistrito}|${vSeccionProvincial}|${seccionId}|${circuitoId}|${mesaId}|${añoSeleccionado}|${cargoSeleccionado}|${distritoSeleccionado}|${seccionSeleccionada}`;

  let informes = [];

  if (
    periodosSelect.value === "none" ||
    cargosSelect.value === "none" ||
    distritosSelect.value === "none" ||
    seccionSelect.value === "none"
  ) {
    mostrarMensaje(
      mensajeRojo,
      "Error: Se produjo un error al intentar agregar resultados al informe.Por favor complete todos los campos antes de agregar el informe."
    );
    return; // Sale de la función si no se completan todos los campos
  }

  if (localStorage.getItem("INFORMES")) {
    informes = JSON.parse(localStorage.getItem("INFORMES"));
  }

  if (informes.includes(nuevoInforme)) {
    mostrarMensaje(mensajeAmarillo, "El informe ya se encuentra añadido.");
  } else {
    informes.push(nuevoInforme);
    localStorage.setItem("INFORMES", JSON.stringify(informes));
    mostrarMensaje(mensajeVerde, "Informe agregado con éxito");
  }
}

function mostrarMensaje(tipoMensaje, mensaje) {
  tipoMensaje.textContent = mensaje;
  tipoMensaje.style.visibility = "visible";
  setTimeout(function () {
    ocultarMensajes();
  }, 5000);
}
