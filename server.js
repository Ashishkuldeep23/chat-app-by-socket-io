const express = require("express")
const router = require("./src/router")

const app = express()

const http = require('http');
const server = http.createServer(app);


const port = process.env.PORT || 3000
server.listen(port, () => { console.log(`${port} port is open 😂`) })


// app.use( express.static("/public") )
app.use(express.static('public'))


app.get("/", router)




// // // Error handler middle ware for page not found ------>
app.use((req, res) => {
  res.status(404).send(' <div> <img src="http://www.digitalmesh.com/blog/wp-content/uploads/2020/05/404-error.jpg" alt="page not found image" style="height:100vh; width:100vw;" /></div> ')
})


// // // // Server err handler code ------>
// // // Not using now use in jwt code --->
// app.use((err , req , res , next)=>{
//   console.log(err.stack)
//   res.status(500).send("Something broken on server please contect to owner.")
// })




/// // // Socket IO code --------->>

const io = require("socket.io")(server)

let countOfOnline = 0

io.on("connection", (socket) => {
  console.log("a user Connected")
  countOfOnline++

  let sendFirst = {
    online: countOfOnline
  }

  // // // This will send first ------>
  socket.send(sendFirst)

  socket.on("message", (msgObj) => {

    // // // now sending new obj with how many online included ----->
    let sendObj = { online: countOfOnline, ...msgObj }

    // console.log(msgObj)
    socket.broadcast.emit("message", sendObj)

  })




  socket.on('disconnect', () => {
    countOfOnline--
    console.log('user disconnected');
  });
})






