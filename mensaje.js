const fs = require('fs')

class Mensaje {
    constructor(archivo){
        this.archivo = archivo
    }
    
    async save(objeto){
        try {
            let contenido = await fs.promises.readFile(`./${this.archivo}`,'utf-8')
            let content = JSON.parse(contenido)
            let idCorrelativo =content.length === 0 ? 1 : content[content.length-1].id+1//validación por si el array está vacío
            objeto = {//le di formato al objeto para que el id este primero
                "id": idCorrelativo,
                "correo": objeto.correo,
                "fechaMessage": objeto.fechaMessage,
                "texto": objeto.texto
            }
            content.push(objeto)
            
            await fs.promises.writeFile(`./${this.archivo}`,`${JSON.stringify(content)}`)
           console.log(`el ID asignado es ${idCorrelativo}`)
        } catch (error) {
            console.log(error) 
        }
    }

    async getAll(){
        try {
            let contenido = await fs.promises.readFile(`./${this.archivo}`,'utf-8')
            let content = JSON.parse(contenido)

            return content
        } catch (err) {
            console.log(err)
        }
    }


    
        
}
module.exports = Mensaje