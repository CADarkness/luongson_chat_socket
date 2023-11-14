const OnlineUsers = require("../store/OnlineUsers")
const { errorEvents } = require("../utilities/socketEvents")


function notifyHandler(io, socket) {

    socket.on("send_notify", ({ key, data, userIds }) => {
        console.log(`@event: send_notify`, key, data)
        try {

            if (userIds) {
                if (userIds.length > 0) {
                    io.to(userIds).emit("receive_notify", { key, data })
                }
                return
            }
            io.emit("receive_notify", { key, data })
        } catch (error) {
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

}


module.exports = notifyHandler