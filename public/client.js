const socket = io();

// console.log(socket)

let userName = prompt("Enter your name.(Default Guest)")

let nameRegex = (/^[a-zA-Z]+([\s][a-zA-Z]+)*$/)

if (!userName || !nameRegex.test(userName)) {
    userName = "Guest"
}

// console.log(userName)



let textArea = document.querySelector(".text_input")
textArea.focus()


let messageArea = document.querySelector(".message_area")



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
        id: new Date(),
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




// // Reciving msgs -------->
socket.on('message', (msgObj) => {


    if (Object.keys(msgObj).length === 1) {
        document.querySelector(".online").innerHTML = `<h3 class="text-warning">${msgObj.online} Online</h3>`
    } else {

        appentMsg(msgObj, "in")
        scollToBottom()
        who = 1
        // console.log(who)
    }

})




// // screen scroll
function scollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}



// // // Show menu and hide menu -------->


function showMenu(){
    document.querySelector(".main_menu").style.display = "block"
}


function hideMenu(){
    document.querySelector(".main_menu").style.display = "none"

}



