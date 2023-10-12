const socket = io();

// console.log(socket)


// // Set dark mode (if previously done )----------->

let getDrakMode = localStorage.getItem("darkmode")
if (getDrakMode) {
    let r = document.querySelector(':root');
    // console.log(r)
    r.style.setProperty('--white', '#212529');
    r.style.setProperty('--theme', '#521262');
    document.querySelector(".text_input").style.color = "white"
    document.getElementsByTagName("BODY")[0].style.backgroundColor = "#212529";
}



// // // Ask name of user ---->

let userName = prompt("Enter your name.(Default Guest)")
if (userName) {
    userName = userName.trim()

    // // // second if for (if input is just spaces) soto avoid error for that ----->
    if (userName) {
        userName = userName[0].toLocaleUpperCase() + userName.substring(1)
    }
}


let nameRegex = (/^[a-zA-Z]+([\s][a-zA-Z]+)*$/)
if (!userName || !nameRegex.test(userName)) {
    userName = "Guest"
}

// console.log(userName)


// // // Input div ------>
let textArea = document.querySelector(".text_input")

// // // Writting mode active --->
textArea.focus()


// // // msg div ------>
let messageArea = document.querySelector(".message_area")



// // // This var is created for who sended the last msg --------->
// // // acc. to this var showing name or only msg -->

let who = null



textArea.addEventListener("keyup", (e) => {

    if (e.key === "Enter") {
        submitMessage()
        return
    }
})






// // // Emoji click ---------->
function emojiClickHandler(input) {

    // console.log( typeof input)

    let clickedEmoji;

    switch (input) {
        case "1":
            clickedEmoji = "😊 "
            break;

        case "2":
            clickedEmoji = "👍 "
            break;

        case "3":
            clickedEmoji = "👌 "
            break;

        case "4":
            clickedEmoji = "🎉 "
            break;

        case "5":
            clickedEmoji = "❤️ "
            break;
        case "6":
            clickedEmoji = "🤣 "
            break;
        case "7":
            clickedEmoji = "🥲 "
            break;

        default:
            clickedEmoji = "👍 "
            break;
    }

    textArea.value += clickedEmoji

    // // // Now send msg with emoji on click ---------> 

    submitMessage()

    // // // scroll to last line (when clicked on emojies) --->
    textArea.scrollTop = textArea.scrollHeight
}



// // // Enter reading from body by id body works -------->

let bodyDiv = document.getElementById("body")
bodyDiv.addEventListener("keyup", (e) => {
    let value = textArea.value.trim()
    // console.log((value))

    if (e.key === "Enter" && value != "") {
        submitMessage()    // // // Calling send msg function 
        return
    }
})





// // // height to emoji div---------->

// let heightOfInputDiv = document.querySelector(".text_input").clientHeight

// console.log(heightOfInputDiv)
// console.log(heightOfInputDiv-5)
// document.querySelector(".emoji").style.bottom = `${heightOfInputDiv-10}px`



// // // Some global variables that used in audio ------->

// // // Send sound (new instance of audio objcet) ---->
let sendAudio = new Audio("./sounds/send.mp3")
// // // Recive sound (new instance of audio objcet) ---->c
let reciveAudio = new Audio("./sounds/recive.mp3")




// // // This is actual  function to send msg -->

function submitMessage() {
    let value = textArea.value.trim()
    // console.log(e.target.value)
    if (value === '') {
        textArea.value = ""
        return alert("Write something in Message Box, please")
    }
    else {


        // // // Setting dark and light mode by textarea ----->
        // // dark mode ------->
        if (value === "#dark") {
            // console.log("Dark Mode")
            // alert("Dark Mode")

            let r = document.querySelector(':root');
            // console.log(r)
            r.style.setProperty('--white', '#212529');
            r.style.setProperty('--theme', '#521262');
            document.querySelector(".text_input").style.color = "white"
            document.getElementsByTagName("BODY")[0].style.backgroundColor = "#212529";

            textArea.value = ""
            localStorage.setItem("darkmode", "yes")
            return
        }

        // // back to light mode ------->
        if (value === "#normal") {
            // console.log("Ligth Mode")
            // alert("Ligth Mode")

            let r = document.querySelector(':root');
            // console.log(r)
            r.style.setProperty('--white', '#ebfefd');
            r.style.setProperty('--theme', '#163172');
            document.querySelector(".text_input").style.color = "black"
            document.getElementsByTagName("BODY")[0].style.backgroundColor = "#fff";

            textArea.value = ""
            localStorage.removeItem("darkmode")
            return
        }

        // // // By below way we will get capitalization 
        // // 1st -> uppercase of str[0] , oth index will in uppercase
        // // 2nd -> substring() function give us part of main str from given index to end (if end index is not given , if end index is given that will not include.)

        value = value[0].toUpperCase() + value.substring(1)

        // // // caling actual sendmsg function with msg value.
        sendMessage(value)
        who = 0
    }
}



// // // Sending msgs --->

function sendMessage(msg) {

    let msgObj

    // // // Here new if else added for sending read ---->

    if (who !== 0) {
        msgObj = {
            id: new Date(),
            user: userName,
            message: msg
        }
    } else {
        msgObj = {
            user: userName,
            message: msg
        }
    }


    // console.log(msgObj)


    if (msgObj.message === "😊" || msgObj.message === "👍" || msgObj.message === "👌" || msgObj.message === "🤣" || msgObj.message === "❤️" || msgObj.message === "🎉" || msgObj.message === "🥲") {

        // console.log("haha haha 😊😊😊😊")
        appentMsg(msgObj, 'out', "animate__animated  animate__zoomInUp", "3rem")
        textArea.value = ""
        scollToBottom()

        // // Sending to server (frontEnd to BackEnd)------>
        socket.emit("message", msgObj)

        sendAudio.play()    // // // Playing the send sound.
        return
    } else {
        appentMsg(msgObj, 'out')
        textArea.value = ""
        scollToBottom()

        // // // Sending to server (frontEnd to BackEnd)------>
        socket.emit("message", msgObj)

        sendAudio.play()    // // // Playing the send sound.
        return
    }


    // // Sending to server (frontEnd to BackEnd)------>
    // socket.emit("message", msgObj)
}



// // // // Camara icon click handler ------->

// // Upload file --->
function uploadFiles(e) {

    // let inputTag = document.getElementById("fileInput")
    // console.log(inputTag)

    // console.log(e)

    let inputFileIs = e.target.files[0]
    // console.log(inputFileIs)


    // // // Append sended msg --->
    let blod = new Blob([inputFileIs], { type: inputFileIs.type })

    let reader = new FileReader();
    reader.readAsDataURL(blod)

    reader.onloadend = () => {
        // appentMsg({ src: reader.result, user: msgObj.userName }, "in", "animate__animated  animate__zoomInUp", "3rem", true)
        appentMsg({ src: reader.result, user: userName }, "out", "animate__animated  animate__zoomInUp", "3rem", true)
        scollToBottom()
        sendAudio.play()

    }

    // // // Don't give image directly convert it into reader file.
    // appentMsg({ src: inputFileIs, user: userName }, "out", "animate__animated  animate__zoomInUp", "3rem", true)


    // // // Actual send fn
    sendFileToServer(inputFileIs)
}


// // Send file --->
function sendFileToServer(file) {

    console.log("File sended ...");


    let msgObject = {
        userName: userName,
        type: "file",
        body: file,
        mimeType: file.mimeType,
        filename: file.name
    }

    // console.log(file.mimeType , file.name )

    socket.emit("upload", msgObject, (status) => {
        console.log(status);
    });

}



// appentMsg(msgObj, "in", "animate__animated  animate__zoomInUp", "3rem")

function appentMsg(msgObj, type, className = "img_style_file animate__animated  animate__zoomInUp ", fontSize, fileType = false) {

    let mainDiv = document.createElement("div")

    // // // All classes ------->
    mainDiv.classList.add(type, 'msg', "animate__animated", "animate__flipInY")

    mainDiv.style.width = "fit-content"

    // // // This var is used to set inner html -->
    let markUp;


    if (fileType) {

        if (type === "out") {
            // console.log("out")

            markUp = `
            <h5>You (${msgObj.user})</h5>
            <img class="${className} img_style_file" src="${msgObj.src}" alt="">
            `

        } else {
            // console.log("In")

            markUp = `
            <h5>${msgObj.user}</h5>
            <img class="${className} img_style_file" src="${msgObj.src}" alt="">
            `
        }


    }


    // // // Other then file

    else if (who === null) {

        if (type === "out") {
            markUp = `
            <h5>You (${msgObj.user})</h5>
            <p class="${className}" style="font-size:${fontSize};">${msgObj.message}</p>
            `
        } else {
            markUp = `
            <h5>${msgObj.user}</h5>
            <p class="${className}" style="font-size:${fontSize};">${msgObj.message}</p>
            `
        }

    } else if (who === 0 && type === "out") {

        markUp = `
        <p class="${className}" style="font-size:${fontSize};">${msgObj.message}</p>
        `
    } else if ((msgObj.id !== undefined)) {
        // // // Here new if else added , if something data is coming in id then show all data ---->
        if (type === "out") {
            markUp = `
            <h5>You (${msgObj.user})</h5>
            <p class="${className}" style="font-size:${fontSize};">${msgObj.message}</p>
            `
        } else {
            markUp = `
            <h5>${msgObj.user}</h5>
            <p class="${className}" style="font-size:${fontSize};">${msgObj.message}</p>
            `
        }

    } else if (who === 1 && type === "in") {

        markUp = `
        <p class="${className}" style="font-size:${fontSize};">${msgObj.message}</p>
        `
    } else {

        markUp = `
        <h5>${msgObj.user}</h5>
        <p class="${className}" style="font-size:${fontSize};">${msgObj.message}</p>
        `
    }


    mainDiv.innerHTML = markUp
    messageArea.appendChild(mainDiv)

    scollToBottom()
}




// // Reciving msgs (from server by brodcast function) -------->
socket.on('message', (msgObj) => {

    // console.log(msgObj)
    // //  Below if and else is imp. becoz when user conncet then i'm sending a object from backend with count of online persons and tackel that object ------------->

    if (Object.keys(msgObj).length === 2) {
        // // // Increase online count --->
        document.querySelector("#online").innerHTML = `<h3 class="text-warning">${msgObj.online} Online</h3>`

        // // // Set topic ----->
        document.getElementById("topic_name").innerText = `Topic : ${msgObj.topic || "Set Topic"}`

    } else {

        // // // set online count --->
        document.querySelector("#online").innerHTML = `<h3 class="text-warning">${msgObj.online} Online</h3>`


        if (msgObj.message === "😊" || msgObj.message === "👍" || msgObj.message === "👌" || msgObj.message === "🤣" || msgObj.message === "❤️" || msgObj.message === "🎉" || msgObj.message === "🥲") {

            appentMsg(msgObj, "in", "animate__animated  animate__zoomInUp", "3rem")
            scollToBottom()

            reciveAudio.play()   // // Recive sound playing --> 

        } else {
            appentMsg(msgObj, "in")
            scollToBottom()

            reciveAudio.play()     // // Recive sound playing --> 
        }

        who = 1
        // console.log(who)
    }

})





// // // Sending user name to backend ---->

// // // Below is first msg sended to backend with user name and date.
// // // i'm emitted a function with connected name and now i can access that function name in backend and use this object..
let userDetails = {
    name: userName, time: new Date()
}
socket.emit("connected-new", userDetails)



// // // reciving user name from backend (if someone joined) and also increase online count ----->
socket.on("oneUserPlus", sendObj => {
    // console.log(name)

    // // // Set name of user and show alert --->
    document.getElementById("newUser").innerText = `😊${sendObj.name} connected`
    // // // Set how many user is online ---->
    document.querySelector("#online").innerHTML = `<h3 class="text-warning">${sendObj.online} Online</h3>`

    setTimeout(() => {
        document.getElementById("newUser").innerText = ""
    }, 3000)

})




// // // If any user disconnected then update online count ---->

socket.on("oneUserMinus", (sendObj) => {
    // // // Set how many user is online ---->
    document.querySelector("#online").innerHTML = `<h3 class="text-warning">${sendObj.online} Online</h3>`
})






// // // Topic related code here ---------->

// // // click handler for change topic ------>

function changeTopic() {

    let askTopic = prompt("Give a topic for discussion.\nTopic name should be short for better UI (In one or two words).\nOnly A to Z strings are valid.")
    // console.log(askTopic)

    askTopic = askTopic.trim()

    let nameRegex = (/^[a-zA-Z]+([\s][a-zA-Z]+)*$/)
    if (!askTopic || !nameRegex.test(askTopic)) {
        return alert("Not a vaild topic name.(Only a to z allowed)")
    }

    askTopic = askTopic[0].toLocaleUpperCase() + askTopic.substring(1)

    document.getElementById("topic_name").innerText = `Topic : ${askTopic}`

    // // Send topic name to server ---->
    socket.emit("topic_send", { topic: askTopic })
}


// // recive topic name to server ------->
socket.on("topic_recive", (topicObj) => {
    document.getElementById("topic_name").innerText = `Topic : ${topicObj.topic}`
    alert(`Topic is Changed to ${topicObj.topic}`)
})



// // // User Typing ------->

// // // Send typing name ------>
textArea.addEventListener('keyup', () => {
    let length = textArea.value.length
    socket.emit("typing_send", { user: userName, len: length })
})



// // // Recive typing ------>

socket.on("typing_recive", (typingObj) => {
    // console.log(typingObj)


    // // // Typing sound (new instance of audio objcet) ---->

    let typingAudio = new Audio('./sounds/typing.mp3')


    // document.getElementById("typing").style.visibility = "visibility"
    document.getElementById("typing").innerText = `${typingObj.user} is typing...`

    typingAudio.play()


    setTimeout(() => {

        document.getElementById("typing").innerText = ""
        // document.getElementById("typing").style.visibility = "hidden"
    }, 1000)


})



// // // File recived or not reciving file --->
// // Recived img msg --->

socket.on("file_show_to_users", (msgObj) => {

    // console.log(msgObj)

    let blod = new Blob([msgObj.body], { type: msgObj.type })

    let reader = new FileReader();
    reader.readAsDataURL(blod)

    reader.onloadend = () => {
        appentMsg({ src: reader.result, user: msgObj.userName }, "in", "animate__animated  animate__zoomInUp", "3rem", true)

        reciveAudio.play()
        scollToBottom()
    }

})






// // // Some js fn's i used in my code ---------->

// // screen scroll  ----------->
function scollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}



// // // Show menu or hide ----->
let showMenu = false

function showOrHideMenu() {

    if (!showMenu) {
        document.getElementById("menu").style.visibility = "visible"
        showMenu = !showMenu
    } else {
        document.getElementById("menu").style.visibility = "hidden"
        showMenu = !showMenu
    }

}
