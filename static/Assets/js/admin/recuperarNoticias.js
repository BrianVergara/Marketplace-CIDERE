$(document).ready(function () {
  let modoEdicion = false;

  $.ajax({
    url: "http://paredes.myddns.me:5000/noticias",
    type: "GET",
    success: function (response) {
      let noticias = response.noticias;
      console.log(noticias);
      let noticiasTable = $(".admin-noticia-table tbody");

      // Itera sobre cada noticia y crea dinámicamente la fila de la tabla
      noticias.forEach(function (noticia, index) {
        let rowHtml = `
                    <tr>
                        <td class="text-truncate data-id" data-id-noticia="${
                          noticia.id
                        }" id="${index + 1}">${index + 1}</td>
                        <td class="text-truncate data-titulo">${
                          noticia.titulo
                        }</td>
                        <td class="text-truncate data-noticia">${
                          noticia.noticia
                        }</td>
                        <td><img src="../assets/img/noticias/${
                          noticia.imagen
                        }" alt="Noticia"></td>
                        <td align="center">
                            <button class="btn btn-success btn-default btn-editar" data-bs-toggle="modal" data-bss-tooltip="" title="Editar" type="button" data-bs-target="#modal-1"><i class="far fa-edit" title="Editar"></i></button>
                            <a class="btn btn-warning btn-ver" role="button" data-bs-toggle="tooltip" data-bss-tooltip="" title="Ver"><i class="far fa-eye" title="Ver"></i></a>
                            <a class="btn btn-danger btn-eliminar" role="button" data-bs-toggle="tooltip" data-bss-tooltip="" title="Eliminar"><i class="far fa-trash-alt" title="Eliminar"></i></a>
                        </td>
                    </tr>`;
        noticiasTable.append(rowHtml);
      });

      // Inicializa los tooltips después de agregar dinámicamente las filas
      $('[data-bs-toggle="tooltip"]').tooltip();
    },
    error: function (error) {
      console.log(error);
    },
  });

  // Manejo del clic en el botón de agregar nueva noticia
  $(".btn-agregar-noticia").on("click", function () {
    modoEdicion = false;
    limpiarModalNoticias();
    $("#modal-1").modal("show");
  });

  // Manejo del clic en el botón de editar
  $(".admin-noticia-table").on("click", ".btn-editar", function () {
    modoEdicion = true;

    // Obtén la fila actual
    let fila = $(this).closest("tr");

    // Extrae la información del FAQ desde los atributos de datos
    let idFaq = fila.find(".data-id").text();

    // Obtener id de la base de datos
    let idFaq2 = fila.find(".data-id").attr("data-id-noticia");
    console.log(idFaq2);

    // Obtén la información de la noticia desde las celdas de la fila
    let titulo = fila.find(".data-titulo").text();
    let noticia = fila.find(".data-noticia").text();

    // Puedes obtener la URL de la imagen si la estás almacenando en una celda de la tabla

    // Almacena el ID en el atributo de datos de la modal
    $("#modal-1").attr("data-id-noticia", idFaq);
    $("#modal-1").attr("data-id-db", idFaq2);

    // Llena los campos del modal con la información de la noticia seleccionada
    $("#modal-1 .input-titulo").val(titulo);
    $("#modal-1 textarea").val(noticia);
    // Si tienes la URL de la imagen en una celda, ajusta el código para obtenerla y asignarla al campo de la imagen

    $("#modal-1").modal("show");
  });

  // Función para guardar la imagen en la carpeta y devolver el nombre
  function guardarImagen(datosBase64) {
    // Genera un nombre único para la imagen
    let nombreImagen = "imagen_" + Date.now() + ".png";

    // Devuelve el nombre de la imagen
    return nombreImagen;
  }

  // Manejo del clic en el botón de guardar dentro del modal de noticias
  $("#modal-1").on("click", ".btn-guardar-noticia", function () {
    // Obtén los valores de los campos del modal
    let titulo = $("#modal-1 .input-titulo").val();
    let noticia = $("#modal-1 textarea").val();
    // Obtén la URL de la imagen si estás almacenándola en un campo del modal
    let nuevoArchivo = $("#modal-1 .subir")[0].files[0];
    let nombreImagen = "";

    let tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"];

    // Verificar que el archivo sea de un tipo permitido y exista
    if (nuevoArchivo && tiposPermitidos.includes(nuevoArchivo.type)) {
      let lector = new FileReader();
      lector.onload = function (e) {
        // Obtiene la cadena de datos (base64) del archivo
        let datosBase64 = e.target.result;

        // Guarda la cadena de datos en una variable
        nombreImagen = guardarImagen(datosBase64);
      };
    }

    // Valida que los campos no estén vacíos
    if (titulo.trim() === "" || noticia.trim() === "") {
      // Sweet Alert 2
      Swal.fire({
        icon: "error",
        title: "No se realizaron cambios",
        text: "Por favor, rellene todos los campos",
      });
      return;
    }

    if (modoEdicion) {
      if (nuevoArchivo && !tiposPermitidos.includes(nuevoArchivo.type)) {
        // Sweet Alert 2
        Swal.fire({
          icon: "error",
          title: "No se realizaron cambios",
          text: "Por favor, seleccione una imagen",
        });
        return;
      }

      // Realiza la solicitud PUT al servicio web para editar la noticia
      // ...

      // Obtén el ID del FAQ que deseas editar
      let idFaq = $("#modal-1").attr("data-id-noticia");
      let idFaq2 = $("#modal-1").attr("data-id-db");

      $.ajax({
        url: `http://paredes.myddns.me:5000/noticia/${idFaq2}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
          titulo: titulo,
          noticia: noticia,
          imagen: "",
        }),
        success: function (response) {
          console.log(response);
          // Actualiza la fila de la tabla
          let fila = $(
            `#noticias-table tbody tr td[data-id-noticia="${idFaq}"]`
          ).closest("tr");
          fila.find(".data-titulo").text(titulo);
          fila.find(".data-noticia").text(noticia);
          // Actualiza la URL de la imagen si la tienes en una celda de la tabla

          // Sweet Alert 2
          Swal.fire({
            icon: "success",
            title: "Noticia editada",
            text: "La noticia se ha editado correctamente",
            showConfirmButton: false,
            timer: 1500,
          });
        },
        error: function (error) {
          console.log(error);
        },
      });
    } else {
      if (!nuevoArchivo || !tiposPermitidos.includes(nuevoArchivo.type)) {
        // Sweet Alert 2
        Swal.fire({
          icon: "error",
          title: "No se realizaron cambios",
          text: "Por favor, seleccione una imagen",
        });
        return;
      }

      // Realiza la solicitud POST al servicio web para agregar una nueva noticia
      // ...
      // Realiza la solicitud POST al servicio web

      let fecha = getDate();

      // fecha a formato de postgres
      function getDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 10) {
          month = "0" + month;
        }

        if (day < 10) {
          day = "0" + day;
        }

        let today = year + "-" + month + "-" + day;

        return today;
      }

      $.ajax({
        url: "http://paredes.myddns.me:5000/noticia",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          titulo: titulo,
          noticia: noticia,
          fecha: fecha,
          imagen: nombreImagen,
        }),
        success: function (response) {
          console.log(response);

          // Obtener el último ID de la tabla y sumar 1
          let idFaq = $(
            "#noticias-table tbody tr:last-child td[data-id-noticia]"
          ).attr("data-id-noticia");
          idFaq = parseInt(idFaq) + 1;

          // Agrega una nueva fila a la tabla
          let noticiasTable = $(".admin-noticia-table tbody");
          let rowHtml = `
                        <tr>
                            <td class="text-truncate data-id" data-id-noticia="${response.noticiaId}">${idFaq}</td>
                            <td class="text-truncate data-titulo">${titulo}</td>
                            <td class="text-truncate data-noticia">${noticia}</td>
                            <td><img src="../assets/img/noticias/imagen.jpg" alt="Noticia"></td>
                            <td align="center">
                                <button class="btn btn-success btn-default btn-editar" data-bs-toggle="modal" data-bss-tooltip="" title="Editar" type="button" data-bs-target="#modal-1"><i class="far fa-edit" title="Editar"></i></button>
                                <a class="btn btn-warning btn-ver" role="button" data-bs-toggle="tooltip" data-bss-tooltip="" title="Ver"><i class="far fa-eye" title="Ver"></i></a>
                                <a class="btn btn-danger btn-eliminar" role="button" data-bs-toggle="tooltip" data-bss-tooltip="" title="Eliminar"><i class="far fa-trash-alt" title="Eliminar"></i></a>
                            </td>
                        </tr>`;
          noticiasTable.append(rowHtml);

          // Sweet Alert 2
          Swal.fire({
            icon: "success",
            title: "Noticia agregada",
            text: "La noticia se ha agregado correctamente",
            showConfirmButton: false,
            timer: 1500,
          });
        },
        error: function (error) {
          console.log(error);
        },
      });
    }

    // Cierra el modal después de hacer la solicitud
    $("#modal-1").modal("hide");
  });

  // Manejo del clic en el botón de eliminar
  $(".admin-noticia-table").on("click", ".btn-eliminar", function () {
    // Sweet Alert 2
    Swal.fire({
      title: "¿Está seguro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Obtén la fila actual
        let fila = $(this).closest("tr");

        // Extrae la información del FAQ desde los atributos de datos
        let idFaq = fila.find(".data-id").attr("data-id-noticia");

        // Realiza la solicitud DELETE al servicio web
        $.ajax({
          url: "http://paredes.myddns.me:5000/noticia/" + idFaq,
          type: "DELETE",
          success: function (response) {
            console.log(response);
            // Elimina la fila de la tabla
            fila.remove();

            // Sweet Alert 2
            Swal.fire({
              icon: "success",
              title: "Noticia eliminada",
              text: "La noticia se ha eliminado correctamente",
              showConfirmButton: false,
              timer: 1500,
            });
          },
          error: function (error) {
            console.log(error);
          },
        });
      }
    });
  });

  // Función para limpiar los campos del modal de noticias
  function limpiarModalNoticias() {
    $("#modal-1 .input-titulo").val("");
    $("#modal-1 textarea").val("");
    // Limpiar el campo de la imagen si lo tienes
    $("#modal-1 .subir").val(""); // Limpiar el campo de archivo
  }

  // Limpia los campos del modal cuando se cierra completamente
  $("#modal-1").on("hidden.bs.modal", function () {
    $("#modal-1 .input-titulo").val("");
    $("#modal-1 textarea").val("");
  });
});
