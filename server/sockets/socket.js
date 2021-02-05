const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        //console.log(data);

        //Validar que el usuario tenga la data tambien
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        //Conectar un usuario a una sala
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        //Un evento que todas las perosnas conectadas escuchen
        //cada vez que una persona entra o sale del chat
        //lo emite a todos los usuarios del chat
        //.to y dentro de parentesis la sala
        client.broadcast.to(data.sala).emit('listadoPersona', usuarios.getPersonasPorSala(data.sala));

        //Mensaje de que alguin de unió al chat
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje(
            'Administrador', `${data.nombre} se unió`
        ));

        //console.log(personas); 
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    //El servidor debe escuchar cuando un usuario llama ese metodo de crear mensaje
    //recibe la data que es todo el mensaje que yo quiero enviar
    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);

    });



    //Desconexion
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje(
            'Administrador', `${personaBorrada.nombre} salió`
        ));
        /*
        client.broadcast.emit('crearMensaje', {
            usuario: 'Administrador',
            mensaje: `${personaBorrada.nombre} abandonó el chat`
        });
        */

        client.broadcast.to(personaBorrada.sala).emit('listadoPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    //Mensajes privados
    //La data debe contener el id de la persona que quiero enviar mensaje privado


    client.on('mensajePrivado', data => {
        //para saber que persona esta mandando el mensaje
        let persona = usuarios.getPersona(client.id);

        //para el id de la persona que yo quiero enviar
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(
            persona.nombre,
            data.mensaje
        ));
    });


});