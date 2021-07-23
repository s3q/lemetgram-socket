const port = process.env.PORT || 8900

const io = require("socket.io")(port, {
    cors: {
        origin: "https://lemetgram-app.herokuapp.com"
    }
})

let users = []

const userIsConnected = (userId, socketId) => {
    !users.some(user => user.userId == userId) &&
        users.push({ userId, socketId })
}


const userIsDisconnected = (socketId) => {
    users = users.filter(user => user.socketId != socketId)
}


const getUser = (userId) => {
    console.log(userId)
    return users.find(u => u.userId == userId)
}

io.on("connection", (socket) => {

    socket.on("isConnected", userId => {
        userIsConnected(userId, socket.id)
        io.emit("usersIsConnected", users)
    })

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        console.log(senderId, receiverId, text)
        const user = getUser(receiverId)
        console.log(user)
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text
        })
    })

    socket.on("disconnect", () => {
        userIsDisconnected(socket.id)
        io.emit("usersIsConnected", users)
    })
})