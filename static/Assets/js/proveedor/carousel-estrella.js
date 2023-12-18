// document ready
$(document).ready(function () {
    // Manejar el evento de clic en el botón "Guardar"
    $('.btn-comentario').on('click', function () {
        // Obtener valores del textarea y la calificación
        let comentario = $('textarea[name="areaReview"]').val();
        let calificacion = $('input[name="rating1"]:checked').val();

        // Verificar que se haya ingresado un comentario y una calificación
        if (comentario.trim() === '' || calificacion === undefined) {
            // Sweet alert 2
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingrese un comentario y una calificación',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Crear un nuevo elemento div con los datos del testimonio
        let nuevoTestimonio = `
            <div class="col-lg-4 d-none d-lg-block nuevo-testimonio">
            <img class="rounded-circle shadow-1-strong mb-4" src="https://www.df.cl/noticias/site/artic/20200906/imag/foto_0000000120200906170425.jpg" alt="avatar" style="width: 150px;" />
                <h5 class="mb-3">LOS PELAMBRES</h5>
                <p class="text-muted"><i class="fas fa-quote-left pe-2"></i>${comentario}</p>
                <ul class="list-unstyled text-warning d-inline-flex justify-content-center mb-0">
                    ${generarEstrellas(calificacion)}
                </ul>
            </div>`;

        // Agregar el nuevo testimonio al contenedor deseado
        $('.nuevo-testimonio').append(nuevoTestimonio);

        // Limpiar el textarea y deseleccionar la calificación
        $('textarea[name="areaReview"]').val('');
        $('input[name="rating1"]').prop('checked', false);

        // Cerrar el modal (si es necesario)
        $('#modal-1').modal('hide');
    });

    // Función para generar el HTML de las estrellas según la calificación
    function generarEstrellas(calificacion) {
        let estrellasHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= calificacion) {
                estrellasHtml += '<li><i class="fas fa-star fa-sm"></i></li>';
            } else {
                estrellasHtml += '<li><i class="far fa-star fa-sm"></i></li>';
            }
        }
        return estrellasHtml;
    }
});
