import axios from "axios";
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas){
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            //request para tareas
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch( url, { idTarea })
                .then(function(respuesta){
                    if(respuesta.status == 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }
        if (e.target.classList.contains('fa-trash')){
            const tareaHtml = e.target.parentElement.parentElement,
                idTarea = tareaHtml.dataset.tarea;

                Swal.fire({
                    title: '¿Desea eliminar esta tarea?',
                    text: "",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar!',
                    cancelButtonText: 'No, cancelar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        const url = `${location.origin}/tareas/${idTarea}`;
                        axios.delete(url, { params: { idTarea }})
                            .then(function(respuesta){
                                if(respuesta.status === 200){
                                    //eliminar nodo
                                    tareaHtml.parentElement.removeChild(tareaHtml);

                                    Swal.fire(
                                        'Información',
                                        respuesta.data,
                                        'success'
                                    )
                                    actualizarAvance();
                                }
                            });
                    }
                  })
        }
    });
}

export default tareas