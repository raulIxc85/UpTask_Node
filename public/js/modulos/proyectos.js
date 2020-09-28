import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar){
    btnEliminar.addEventListener('click', e =>  {
        const urlProyecto = e.target.dataset.proyectoUrl;

        Swal.fire({
            title: '¿Desea eliminar el proyecto?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                //console.log(url);
                //return;
                //enviar peticion de axios
                axios.delete(url, { params: {urlProyecto}})
                    .then(function(respuesta){

                        Swal.fire(
                          'Informacion!',
                          respuesta.data,
                          'success'
                        );
              
                        setTimeout(()=>{
                              window.location.href = '/'
                        },3000);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se puedo eliminar el proyecto'
                        })
                    })
            }
          })
    })
    
}

export default btnEliminar;