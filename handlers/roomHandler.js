const { joinRoomEvents, leaveRoomEvents, errorEvents, kickEvents, inviteEvents, editRoomInfo, deleteRoomEvents, createNewRoom } = require("../utilities/socketEvents")
const RoomActiveUser = require("../store/RoomActiveUsers")
const RoomService = require("../services/roomService")
const OnlineUsers = require("../store/OnlineUsers")
const { SocketSender, SocketReceiver } = require("../utilities/SocketResponse")
const { validator } = require("../utilities/validator")

function roomHandler(io, socket) {

    /**
     * @event ('joinRoom')
     * @param {User} user - user info
     * @param {string} roomId
    */

    socket.on(joinRoomEvents.onEvent, async (data) => {
        try {
            console.log(`@event: join_room`)
            const { userId, roomId } = data

            RoomActiveUser.insert({ socketId: socket.id, userId, roomId })

            socket.join(roomId)

            io.to(roomId).emit(joinRoomEvents.emitEvent, new SocketSender({
                message: `User ${userId} joined room ${roomId}`,
                data: roomId
            }))


        } catch (error) {
            console.log(error)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

    socket.on(createNewRoom.onEvent, async (data) => {
        try {
            const { roomObject, userIds } = data

            if (userIds) {
                if (!Array.isArray(userIds)) throw new Error("User Ids must be arrays")
                const onlineUserMatched = OnlineUsers.list.filter(item => userIds.includes(item.userId))

                const matchers = onlineUserMatched.map(i => i.socketId)

                if (matchers.length > 0) {
                    io.to(onlineUserMatched.map(i => i.socketId)).emit(createNewRoom.emitEvent, { roomObject, roomId })
                }
            } else {
                socket.emit(createNewRoom.emitEvent, roomObject)
            }
        } catch (error) {

        }
    })

    socket.on(editRoomInfo.onEvent, async (data) => {
        try {
            console.log(`@event: edit_room_info`)
            const { editedRoomObject, roomId } = validator(data, {
                editedRoomObject: { message: "editedRoomObject is not valid", $: (value) => !!value._id },
                roomId: { message: "", $: () => true }
            })

            io.to(roomId).emit(editRoomInfo.emitEvent, editedRoomObject)
        } catch (error) {
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

    socket.on("send_join_room_request", ({ ownerId, request, room }) => {
        try {
            const ownerSocketUser = OnlineUsers.list.find(user => user.userId === ownerId)
            if (ownerSocketUser) {
                io.to(ownerSocketUser.socketId).emit("receive_send_join_room_request", {
                    message: `Someone have requested to join room ${room}`, request
                })
            } else socket.emit("receive_send_join_room_request", { message: "Owner is not online" })
        } catch (error) {
            console.log(error)
            socket.emit(errorEvents.emitEvent, "Something went wrong")
        }
    })

    /** @event ('kickOut') @param {KickOutInput} */
    socket.on(kickEvents.onEvent, async (data) => {

        try {
            console.log(`@event: kick`, data)
            const { kickerObject, kickedUserObject, roomObject, roomId } = data

            io.to(roomId).emit(kickEvents.emitEvent, { kickerObject, kickedUserObject, roomObject })
        } catch (error) {
            console.log(error)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })


    socket.on(inviteEvents.onEvent, async (data) => {
        try {

            const { roomObject, userIds, roomId } = data
            console.log(`@event: invite`, roomObject, userIds)

            if (!roomObject) throw new Error("roomObject must be provided")
            if (!roomId) throw new Error("roomId must be provided")

            if (userIds) {
                if (!Array.isArray(userIds)) throw new Error("User Ids must be arrays")

                if (userIds.length > 0) {
                    io.to(userIds).emit(inviteEvents.emitEvent, { roomObject, roomId, userIds })
                }
            }

            // io.emit(inviteEvents.emitEvent, { roomObject, roomId })

        } catch (error) {
            console.log(error)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

    socket.on(deleteRoomEvents.onEvent, async ({ deletedRoomId }) => {

        io.emit(deleteRoomEvents.emitEvent, {
            deletedRoomId
        })
    })

    /** @event ('leaveRoom') */
    socket.on(leaveRoomEvents.onEvent, async ({ roomId, userObject }) => {

        try {
            if (!roomId) throw new Error("roomId must be provided")
            if (!userObject) throw new Error("userObject must be provided")

            io.to(roomId).compress(true).emit(leaveRoomEvents.emitEvent, userObject)

        } catch(error) {
            console.log(error)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })
}

module.exports = {
    roomHandler
}
