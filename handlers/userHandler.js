const { userLoginEvents, userLogoutEvents } = require("../utilities/socketEvents");
const OnlineUsers = require("../store/OnlineUsers");
const UserService = require("../services/userService");
const createNotify = require("../utilities/createNotify");

function userHandler(io, socket) {
    // {
    //     token: String,
    //     userId: String
    // }
    socket.on(userLoginEvents.onEvent, async ({ userId, token }) => {
        try {
            console.log("LOGIN: SUCCESS", userId)
            // socket.handshake.session.token = token
            // const userService = new UserService(token)
            // await userService.setOnline()
            // setAuthorization(data.token)

            const added = OnlineUsers.insert({
                userId: userId,
                token: "token",
                socketId: socket.id,
                onTime: Date.now(),
            })

            console.log(`just added:`, added, OnlineUsers.list)

            socket.join(userId)

            socket.emit("login_time", Date.now())

        } catch (error) {
            console.log(error.message)
            socket.emit("receive_error", error.message)
        }
    });

    socket.on("user_register", async ({ userObject, token }) => {

        try {
            const userService = new UserService(token)
            const { data: adminIds } = await userService.getSuperAdminIds()

            if (!adminIds) throw new Error("List of admin is not found, can not send notify")

            const socketIds = OnlineUsers.list.filter((obj) => adminIds.includes(obj.userId)).map(u => u.socketId);

            // Save in notify to all admin

            io.to(socketIds).emit("receive_user_register", {
                message: "new user has just register",
                userObject
            })

            await createNotify(adminIds, `User ${userObject.username} has just register`, "new_user_register")
        } catch (error) {
            console.log(error.message)
            socket.emit("receive_error", error.message)
        }
    })

    socket.on("user_banned", ({ userId }) => {
        try {

            if (!userId) throw new Error("userId must be provided")

            io.to(userId).emit("receive_banned", { userId })
        } catch (error) {
            console.log(error.message)
            socket.emit("receive_error", error.message)
        }
    })

    // {
    //     userId: String
    // }
    socket.on(userLogoutEvents.onEvent, (data) => {

        try {
            console.log(`socket :: logout`)
            const user = OnlineUsers.eject({ userId: data.userId })
            if (user) {
                socket.leave(user.userId)
            }
            socket.handshake.session.token = null;
        } catch (error) {
            console.log(error.message)
            socket.emit("receive_error", error.message)
        }
    })
}

exports.userHandler = userHandler