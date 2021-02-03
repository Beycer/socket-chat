class Usuarios {


    constructor() {
        //va inicializar cada una de las perosnas que estan conectadas al chat
        this.personas = [];
    }

    //Agregar persona al chat
    agregarPersona(id, nombre, sala) {

        let persona = { id, nombre, sala };

        this.personas.push(persona);

        return this.personas;
    }

    //Obtener una persona por el ID
    getPersona(id) {
        //la funcion filter regresa un nuevo arreglo por lo cual yo necesito siempre
        //la primera posición [0]
        let persona = this.personas.filter(persona => {
            return persona.id === id;
        })[0]; //Si encuentra a alguien solo quiero un registro y por eso pongo 0
        //para que siempre sea un unuico registro
        //todo esto de arriba se puede resumir de la sig manera
        /*Es lo mismo
        let persona = this.personas.filter(persona => persona.id === id)[0];
        */

        //Si encuentra una persona voy a tener un objeto, si no voy a tener un undefine o null
        return persona;
    }

    //Obtener todas las personas
    getPersonas() {
        return this.personas;
    }

    //Personas por sala
    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        /*
        let personasEnSala = this.personas.filter(persona => {
            return persona.sala === sala
        })*/
        return personasEnSala;
    }


    //Eliminar una persona del arreglo de personas
    //suponiendo que el usuario se desconecto, abandona el chat
    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        ///Esta funcion regresa un nuevo arreglo y lo voy a almacenar en 
        //this.personas
        //la asignacion que hago  en this.personas
        //va a remplazar el arreglo actual de las personas que tenga ,, this.personas
        /*
        this.personas = this.personas.filter(persona => {
            return persona.id != id;
        });
        */
        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;
    }

}


module.exports = {
    Usuarios
}