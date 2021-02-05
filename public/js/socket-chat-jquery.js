var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

//Referencias jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

//Funciones para renderizar usuarios

//resive los usuarios o personas que estan en el chat
//esperaria un arreglo mas o menos asi [{},{},{}]

function renderizarUsuarios(personas) {
    console.log(personas);

    //Una parte del html que yo quiero genera de forma automatica cuando
    //cuando la pagina carga aparesca cual es el nombre de la sala
    //de esta manera creo un string que contiene todo el html que voy a usar
    //cambio el nombre de la sala que yo resivo de la url
    //entonces importo var params = new URLSearchParams(window.location.search);
    //aunq la importacion de pude hacer de diferentes maneras

    var html = '';

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';

    //Crear el HTML de la pagina del chat
    //Barrer todos los elementos del arreglo
    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '   <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }


    //Su html va ser igual al html que acabo de construir
    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, yo) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '   <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '   <div class="chat-content">';
        html += '       <h5>' + mensaje.nombre + '</h5>';
        html += '       <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '   </div>';
        html += '   <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    //Agregar el mensaje que acabo de escribir al chat
    divChatbox.append(html);

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listeners

//Obtener el id en consola, el id dentro de data es el mismo que el de 
//arriba data-id si pusiera otro nombre despues del data-
// ese es el que iria dentro del data
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

    //Se agrego el if porque si se deja asi el primer a de arriba 
    //dispara la misma condición y da undefine
    //y con el if se arregla si entra lo muestra si no no hace nada
    //hay muchas maneras de hacerlo
    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(e) {
    //antes de que e se ejecute, esto evita de cuando la persona escriba algo
    //y presione enter, hace el posteo pero no recarga la información
    //para que no se recarge el navegador web cada que hagan enter en el chat
    e.preventDefault();

    //obtener información de la caja de texto
    //console.log(txtMensaje.val());
    //Prevenir enviar mensajes vacios
    //trim quita espacios adelante y al final

    if (txtMensaje.val().trim().length === 0) {
        return; //Simplemente que no haga nada
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        //console.log('respuesta server: ', resp);
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });

});