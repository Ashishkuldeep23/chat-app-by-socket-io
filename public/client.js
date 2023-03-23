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







textArea.addEventListener("keyup", (e) => {


    if (e.key === "Enter") {

        submitMessage()

    }

})




function submitMessage() {
    let value = textArea.value.trim()

    // console.log(e.target.value)
    if (value === '') {
        return alert("Write something in Message Box, please")
    }
    else {
        sendMessage(value)
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

    let className = type

    mainDiv.classList.add(className, 'msg')

    let markUp = `
    <h5>${msgObj.user}</h5>
    <p>${msgObj.message}</p>
    `


    mainDiv.innerHTML = markUp

    messageArea.appendChild(mainDiv)

}




// // Reciving msgs -------->
socket.on('message', (msgObj) => {

    // let actualObj = JSON.parse(msgObj)

    // console.log(actualObj)

    if (Object.keys(msgObj).length === 1) {

        // console.log("ok")
        // console.log(actualObj)

        document.querySelector(".online").innerHTML = `<h3 class="text-warning">${msgObj.online} Online</h3>`



    } else {

        appentMsg(msgObj, "in")
        scollToBottom()


    }

})




// // screen scroll


function scollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}