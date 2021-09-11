let pagina = 1;

const inscripcion = {
    nombre: '',
    fecha: '',
    hora: '',
    cursos: []
}

document.addEventListener('DOMContentLoaded', function() {

    // Consulta los cursos
    mostrarCursos();

    // Resalta el Div Actual segun el tab al que se presiona
    mostrarSeccion();

    eventListeners();
});

function eventListeners() {




    // Oculta o muestra una sección segun el tab al que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    // Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // Muestra el resumen del curso ( o mensaje de error en caso de no pasar la validación )
    mostrarResumen();


    // Almacena el nombre del cliente en el objeto
    nombreInscripcion();

    // Almacena la fecha de que va asistir al curso en el objeto
    fechaInscripcion();

    // deshabilita dias pasados
    deshabilitarFechaAnterior();

    // Almacena la hora que va asistir al curso en el objeto
    horaCursos();
}

function mostrarSeccion() {

    // Eliminar mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if( seccionAnterior ) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
   
    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar la función de mostrar sección
            mostrarSeccion();

            botonesPaginador();
        })
    })
}


async function mostrarCursos() {
    try {
        const resultado = await fetch('./cursos.json');
        const db = await resultado.json();

        const { cursos } = db;

       // Generar el HTML
       cursos.forEach( curso => {
            const { id, nombre, precio } = curso;

            // DOM Scripting
            // Generar nombre de servicio
            const nombreCurso = document.createElement('P');
            nombreCurso.textContent = nombre;
            nombreCurso.classList.add('nombre-curso');

            // Generar el precio del curso
            const precioCurso = document.createElement('P');
            precioCurso.textContent = `$ ${precio}`;
            precioCurso.classList.add('precio-servicio');

            // Generar div contenedor de curso
            const cursoDiv = document.createElement('DIV');
            cursoDiv.classList.add('servicio');
            cursoDiv.dataset.idServicio = id;

            // Selecciona un servicio para la cita
            cursoDiv.onclick = seleccionarCurso;


            // Inyectar precio y nombre al div de servicio
            cursoDiv.appendChild(nombreCurso);
            cursoDiv.appendChild(precioCurso);

            // Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(cursoDiv);
       } )
    } catch (error) {
        console.log(error);
    }
}


function seleccionarCurso(e) {
    
    let elemento;
    // Forzar que el  elemento al cual le damos click sea el DIV 
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt( elemento.dataset.idServicio );

        eliminarCurso(id);
    } else {
        elemento.classList.add('seleccionado');

        const cursoObj = {
            id: parseInt( elemento.dataset.idServicio ),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        agregarCurso(cursoObj);
    }
}

function eliminarCurso(id) {
   const { cursos } = inscripcion;
   inscripcion.cursos = cursos.filter( curso => curso.id !== id );

  
}

function agregarCurso(cursoObj) {
    const { cursos } = inscripcion;
    inscripcion.cursos = [...cursos, cursoObj];


}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina  === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la página 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // Cambia la sección que se muestra por la de la página
}

function mostrarResumen() {
    // Destructuring
    const { nombre, fecha, hora, cursos } = inscripcion;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia el HTML previo
    while( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }


    // validación de objeto
    if(Object.values(inscripcion).includes('')) {
        const noCursos = document.createElement('P');
        noCursos.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noCursos.classList.add('invalidar-cita');

        // agregar a resumen Div
        resumenDiv.appendChild(noCursos);

        return;
    } 

    const headingInscripcion = document.createElement('H3');
    headingInscripcion.textContent = 'Resumen de Inscripcion';

    // Mostrar el resumen
    const nombreInscripcion = document.createElement('P');
    nombreInscripcion.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaInscripcion = document.createElement('P');
    fechaInscripcion.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaInscripcion = document.createElement('P');
    horaInscripcion.innerHTML = `<span>Hora:</span> ${hora}`;

    const cursosInscripcion = document.createElement('DIV');
    cursosInscripcion.classList.add('resumen-servicios');

    const headingInscripcion = document.createElement('H3');
    headingInscripcion.textContent = 'Cursos a Tomar';

    cursosInscripcion.appendChild(headingInscripcion);

    let cantidad = 0;

    // Iterar sobre el arreglo de servicios
    cursos.forEach( curso => {

        const { nombre, precio } = curso;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoCurso = document.createElement('P');
        textoCurso.textContent = nombre;

        const precioCurso = document.createElement('P');
        precioCurso.textContent = precio;
        precioCurso.classList.add('precio');

        const totalCurso = precio.split('$');
        // console.log(parseInt( totalServicio[1].trim() ));

        cantidad += parseInt( totalCurso[1].trim());

        // Colocar texto y precio en el div
        contenedorServicio.appendChild(textoCurso);
        contenedorServicio.appendChild(precioCurso);

        cursosInscripcion.appendChild(contenedorServicio);

    } );


    resumenDiv.appendChild(headingInscripcion);
    resumenDiv.appendChild(nombreInscripcion);
    resumenDiv.appendChild(fechaInscripcion);
    resumenDiv.appendChild(horaInscripcion);

    resumenDiv.appendChild(cursosInscripcion);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar:  </span> $ ${cantidad}`;


    resumenDiv.appendChild(cantidadPagar);
}

function nombreInscripcion() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        // Validación de que nombreTexto debe tener algo
        if( nombreTexto === '' || nombreTexto.length < 3 ) {
            mostrarAlerta('Nombre no valido', 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            inscripcion.nombre = nombreTexto;
        }
    });
}


function mostrarAlerta(mensaje, tipo) {

    // Si hay una alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }

    // Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta );

    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaInscripcion() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {

        const dia = new Date(e.target.value).getUTCDay();
        
        if([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no son permitidos', 'error');
        } else {
            inscripcion.fecha = fechaInput.value;

            console.log(inscripcion);
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCursos() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18 ) {
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            inscripcion.hora = horaCita;

            console.log(inscripcion);
        }
    });
}