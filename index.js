const express = require('express')
const { Server: ioServer } = require('socket.io')

const http = require('http')
const app = express()
const httpServer = http.createServer(app)
const io = new ioServer(httpServer)

let productos = []
let idProducto = 1
let dato = new Date()
let fecha = `${dato.getDate()}/${dato.getMonth()+1}/${dato.getFullYear()} ${dato.getHours()}:${dato.getMinutes()}`

let messages = [
    {correo:'Servidor', fechaMessage: fecha, texto:'Saludo del servidor'}
]
const handlebars = require('express-handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.set('views','./views')

//NUEVO SERVIDOR
io.on('connection',(socket)=>{
    console.log('Un cliente se a conectado', socket.id)
    io.sockets.emit('productos', productos)

    io.sockets.emit('messages', messages)
    
    socket.on("newMessage", message =>{
        messages.push(message)
        io.sockets.emit('messages', messages)
    })
})
 

const errorMiddleware = (err, req, res, next)=>{
    if(err){
        return res.status(500).json({error:err})
    }
    next()
}

//Listar todos los productos
app.get('/', (req, res)=>{
    res.render('main')
})

//Registra un producto y muestra un mensaje con el id asignado
app.post('/', errorMiddleware,(req, res )=>{
    const producto = req.body
    producto["id"]=idProducto
    productos.push(producto)
    //res.json({Sistema: `Se registró el producto con el ID ${idProducto}`})
    idProducto++
    res.redirect('/')
})

/*****  Plantillas *******/


//plantilla Handlebars
app.set('view engine','hbs')
app.engine('hbs',handlebars.engine({
    extname: ".hbs",
    defaultLayout:"index.hbs",
    layoutsDir:__dirname+"/views/layouts",
    partialsDir:__dirname+"/views/partials"
}))





const PORT= 8080
const server = httpServer.listen(PORT, (err)=>{
    if(err) console.log(err)
    console.log(`Servidor escuchandose en el puerto ${PORT}`)
})
