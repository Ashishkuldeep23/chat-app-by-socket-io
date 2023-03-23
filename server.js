const express = require("express")
const router = require("./src/router") 

const app = express()

const http = require('http');
const server = http.createServer(app);


const port = process.env.PORT || 3000
server.listen(port , ()=>{console.log(`${port} port is open 😂`)} )


// app.use( express.static("/public") )
app.use(express.static('public'))


app.get("/" ,router)






const io = require("socket.io")(server)

let c = 0

io.on( "connection" , (socket)=>{
    console.log("a user Connected")
    c++

    let sendFirst = {
      online : c
    }

    socket.send(JSON.stringify(sendFirst))

    socket.on("message" , (msgObj)=>{

      // console.log(msgObj)
      socket.broadcast.emit("message" , msgObj)

    })




    socket.on('disconnect', () => {
      c--
      console.log('user disconnected');
    });
} )






