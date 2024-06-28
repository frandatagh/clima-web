const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

const tempActual = document.querySelector('#tempActual');
const tempMax = document.querySelector('#max');
const tempMin = document.querySelector('#min');
const st = document.querySelector('#st');
const humedad = document.querySelector('#humedad');
const viento = document.querySelector('#viento');
const direccion = document.querySelector('#direccion');
const nubocidad = document.querySelector('#nubocidad');
const precipitacion = document.querySelector('#precipitacion');

const btnMenu = document.querySelector('#btnMenu');
const menu = document.querySelector('#menu');

document.addEventListener('DOMContentLoaded', function() {
    
    

    
    
});

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})
// Despliegue del menu
btnMenu.addEventListener('click', () => {
    console.log('Me diste click - Corregir bug');
    
    menu.classList.toggle('hidden');
    const desplegable =  document.querySelector('.hidden');
    
    if(!desplegable && btnMenu){
       
        menu2.classList.add('flex-col', 'space-y-2');
    } else {
        menu2.classList.remove('flex-col', 'space-y-2');
    }
})

function buscarClima(e) {
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === ''){
        // Hubo un error
        mostrarError('Ambos campos son obligatorios');
        return;
    }


    // Consultar API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
        // Crear un alerta
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
             <strong class="font-bold">Error!</strong>
             <span class="block">${mensaje}</span>
         `;

        container.appendChild(alerta);

        // Se elimina despues de cinco segundos
        setTimeout(() => {
            alerta.remove();
        }, 5000)
    }
}

function consultarAPI(ciudad, pais) {


    const appId = 'd2c4f0b09c9d6df42d3eb1b70de55c31';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner(); //Muestra un spinner de carga

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {

            console.log(datos);

            limpiarHTML(); // Limpiar el HTML previo

            if(datos.cod === "404"){
                mostrarError('Ciudad no encontrada');
            }

            // Imprimir respuesta en el HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos) {
    const {name, clouds: {all}, main: {temp, temp_max, temp_min, feels_like, humidity, pressure}, wind: {deg, speed}} = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    const sensTerm = kelvinACentigrados(feels_like);
    
    

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font.bold', 'text-2x1');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('div');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('div');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    
    resultado.appendChild(resultadoDiv);

    //Funcion para conocer la dirección del viento
    function direccionViento(gradoActual) {
        
        if(deg<=23 && deg>=338){
            //Entonces el viento es del NORTE
            return gradoActual = 'Norte';
        } else if(deg>=24 && deg<=68) {
            //Entonces el viento es del NORESTE
            return gradoActual = 'Noreste';
        } else if(deg>=69 && deg<=113) {
            //Entonces el viento es del ESTE
            return gradoActual = 'Este';
        } else if(deg>=114 && deg<=157) {
            //Entonces el viento es del SURESTE
            return gradoActual = 'Sureste';
        } else if(deg>=158 && deg<=202) {
            //Entonces el viento es del SUR
            return gradoActual = 'Sur';
        } else if(deg>=203 && deg<=248) {
            //Entonces el viento es del SUROESTE
            return gradoActual = 'Suroeste';
        } else if(deg>=249 && deg<=292) {
            //Entonces el viento es del OESTE
            return gradoActual = 'Oeste';
        } else if(deg>=293 && deg<=337) {
            //Entonces el viento es del NOROESTE
            return gradoActual = 'Noroeste';
        }
    }
    let gradoActual = direccionViento(deg);
    console.log(gradoActual);

    tempActual.innerHTML = `${centigrados} &#8451;`;
    tempMax.innerHTML = `Máxima: ${max}°`;
    tempMin.innerHTML = `Mínima: ${min}°`;
    st.innerHTML = `ST: ${sensTerm}°`;
    humedad.innerHTML = `Humedad: ${humidity}%`;
    viento.innerHTML = `Viento: ${speed} k/h`;
    direccion.innerHTML = `V.Dirección: ${gradoActual}`;
    nubocidad.innerHTML = `Nubocidad: ${all}%`;
    
    
}

//Funcion comprimida para convertir grados kelvin de la API a centigrados 

const kelvinACentigrados = grados => parseInt(grados - 273.15);



function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;

    resultado.appendChild(divSpinner);
}