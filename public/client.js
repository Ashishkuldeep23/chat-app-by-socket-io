const socket = io();

// console.log(socket)

let userName = prompt("Enter your name.(Default Guest)")

let nameRegex = (/^[a-zA-Z]+([\s][a-zA-Z]+)*$/)
if (!userName || !nameRegex.test(userName)) {
    userName = "Guest"
}

// console.log(userName)


// // // Input div ------>
let textArea = document.querySelector(".text_input")
textArea.focus()


// // // msg div ------>
let messageArea = document.querySelector(".message_area")



// // // This var is created for who sended the last msg --------->
// // // acc. to this var showing name or only msg -->

let who = null




textArea.addEventListener("keyup", (e) => {
    
    if (e.key === "Enter") {
        submitMessage()
    }
})




// // // This is actual  function to send msg -->

function submitMessage() {
    let value = textArea.value.trim()
    // console.log(e.target.value)
    if (value === '') {
        return alert("Write something in Message Box, please")
    }
    else {
        sendMessage(value)
        who = 0
    }
}







function sendMessage(msg) {

    let msgObj = {
        user: userName,
        message: msg
    }


    appentMsg(msgObj, 'out')
    textArea.value = ""
    scollToBottom()

    // // Sending to server ------>
    socket.emit("message", msgObj)

}





function appentMsg(msgObj, type) {

    let mainDiv = document.createElement("div")

    // // // All classes ------->
    mainDiv.classList.add(type, 'msg', "animate__animated", "animate__flipInY")


    // // // This var is used to set inner html -->
    let markUp;


    if (who === null) {

        if (type === "out") {
            markUp = `
            <h5>You (${msgObj.user})</h5>
            <p>${msgObj.message}</p>
            `
        } else {
            markUp = `
            <h5>${msgObj.user}</h5>
            <p>${msgObj.message}</p>
            `
        }

    } else if (who === 0 && type === "out") {

        markUp = `
        <p>${msgObj.message}</p>
        `
    } else if (who === 1 && type === "in") {

        markUp = `
        <p>${msgObj.message}</p>
        `
    } else {

        if (type === "out") {
            markUp = `
            <h5>You (${msgObj.user})</h5>
            <p>${msgObj.message}</p>
            `
        }else{
            markUp = `
            <h5>${msgObj.user}</h5>
            <p>${msgObj.message}</p>
            `
        }

    }


    mainDiv.innerHTML = markUp
    messageArea.appendChild(mainDiv)
}




// // Reciving msgs (from server by brodcast function) -------->
socket.on('message', (msgObj) => {

    // console.log(msgObj)

    if (Object.keys(msgObj).length === 1) {
        document.querySelector("#online").innerHTML = `<h3 class="text-warning">${msgObj.online} Online</h3>`
    } else {

        document.querySelector("#online").innerHTML = `<h3 class="text-warning">${msgObj.online} Online</h3>`
        appentMsg(msgObj, "in")
        scollToBottom()
        who = 1
        // console.log(who)
    }

})




// // screen scroll  ----------->
function scollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}




// // // Show menu or hide ----->
let showMenu = false 

function showOrHideMenu(){

    if(!showMenu){
        document.getElementById("menu").style.visibility = "visible"
        showMenu = !showMenu
    }else{
        document.getElementById("menu").style.visibility = "hidden"
        showMenu = !showMenu
    }

}
