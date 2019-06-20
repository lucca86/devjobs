import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    // Limpiar las alertas
    let alertas = document.querySelector('.alertas');

    if(alertas) {
        limpiarAlertas();
    }

    if(skills) {
        skills.addEventListener('click', agregarSkills);
        // Una vez que estamos en editar, llamar a la función
        skillsSeleccionados();
    }

    const vacantesListado = document.querySelector('.panel-administracion');

    if(vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
    }
})

const skills = new Set();

const agregarSkills = e => {
    if(e.target.tagName === 'LI') {
        if(e.target.classList.contains('activo')){
            // Quitarlo del set y quitar la clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            // Agregarlo al set y agregar la clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    // Convierte el SET en un array
    const skillsArray = [...skills] 
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = () => {
    // Uso Array.from, porque los datos vienen como un nodelist y no como arreglo
    const seleccionadas = Array.from(document.querySelectorAll('lista-conocimientos .activo'));

    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent)
    })
    // Inyectarlo en el hidden
    const skillsArray = [...skills] 
    document.querySelector('#skills').value = skillsArray;
}
 const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');

    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);     
         } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
         }
    }, 2000);
 }

 // Eliminar Vacantes
 const accionesListado = e => {
     e.preventDefault();
     if(e.target.dataset.eliminar) {
         // Eliminar por medio de axios
        
         Swal.fire({
            title: '¿Está seguro de borrar?',
            text: "Una vez eliminada no se puede recuperar!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar'
          }).then((result) => {
            if (result.value) {
                // enviar la petición con Axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
                
                // Axios para eliminar el registro
                axios.delete(url, { params: {url} })
                    .then(function(respuesta) {
                        if(respuesta.status === 200) {
                            Swal.fire(
                                'Eliminado!',
                                respuesta.data,
                                'success'
                              );
                            // TODO: Eliminar del DOM
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);     
                        }                
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar'
                        })
                    })
            }
          })
     } else if (e.target.tagName === 'A'){
         
         window.location.href = e.target.href
     }
     
 }