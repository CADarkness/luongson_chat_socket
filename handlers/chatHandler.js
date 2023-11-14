const SendingChatUsers = require('../store/SendingChatUsers')
const {
    errorEvents, insertChatEvents,
    forceStopSendingChatEvents, sendingChatEvents,
    sendingChatErrorEvents, sendReactionToChatEvents,
    editChatEvents, removeChatEvents, pinChatEvents, deleteManyMessageEvents
} = require("../utilities/socketEvents");
const OnlineUsers = require("../store/OnlineUsers");
const { validator } = require("../utilities/validator");
const createNotify = require('../utilities/createNotify');

function chatHandler(io, socket) {

    /** @event ('sendingChat'): user is texting (keyup, change, ...) into input chat -> send event to server*/
    socket.on(sendingChatEvents.onEvent, async ({ user, roomId }) => {

        SendingChatUsers.insert({ socketId: socket.id, roomId, user })

        io.to(roomId).emit(sendingChatEvents.emitEvent, SendingChatUsers.list[roomId])
    })

    /** @event ('forceStopSendingChat'): if user force stop texting */
    socket.on(forceStopSendingChatEvents.onEvent, async ({ user, roomId }) => {

        SendingChatUsers.eject({ socketId: socket.id })

        io.to(roomId).emit(forceStopSendingChatEvents.emitEvent, SendingChatUsers.list[roomId])
    })

    /** @event ('sendReactionToChat'): @params {} */
    socket.on(sendReactionToChatEvents.onEvent, async (data) => {
        try {

            const { emoji, message, roomId } = data
            console.log(`@event: send_reaction_chat`, emoji, message, roomId)

            io.to(roomId).emit(sendReactionToChatEvents.emitEvent, {
                emoji, message, roomId
            })
        } catch (error) {
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

    /** @event ('editChat'): owner edit chat */
    socket.on(editChatEvents.onEvent, async (data) => {
        try {

            const dataParsed = data
            const { updatedMessageObject, roomId } = data
            if (!dataParsed.updatedMessageObject) throw new Error("")
            console.log(`@event: edit_chat`, updatedMessageObject)

            io.to(roomId).emit(editChatEvents.emitEvent, updatedMessageObject)
        } catch (error) {
            console.log(error.message)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

    socket.on("test", (data) => {
        try {
            const result = validator(data, {
                name: {
                    message: "Length of name must larger than or equal 6 characters",
                    $: (value) => value.length >= 6
                },
                age: {
                    message: "Age must be larger or equal 18",
                    $: (value) => value >= 18
                }
            })

            socket.emit("receive_test", result)
        } catch (error) {
            console.error(error.message)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

    /** @event ('removeChat'): owner remove chat */
    socket.on(removeChatEvents.onEvent, async (data) => {
        try {

            const { removedMessageId, roomId } = data
            console.log(`@event: remove chat`, { removedMessageId, roomId })

            io.to(roomId).emit(removeChatEvents.emitEvent, {
                msg: "This is removed chat",
                removedMessageId
            })
        } catch (error) {
            console.log(error.message)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

    socket.on(deleteManyMessageEvents.onEvent, async (data) => {
        try {

            const { ids, roomId } = data
            console.log(`@delete_many_chat`, data)

            io.to(roomId).emit(deleteManyMessageEvents.emitEvent, { msg: "This is list of deleted message", ids })
        } catch (error) {
            console.log(error.message)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

    socket.on(pinChatEvents.onEvent, async (data) => {
        try {

            const { pinnedMessageObject, roomId } = data
            console.log(`@event: pin_chat`, { pinnedMessageObject, roomId })

            io.to(roomId).emit(pinChatEvents.emitEvent, pinnedMessageObject)
        } catch (error) {
            console.log(error.message)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

    /** @event ('insertChat'): send a chat, @param {iChatInput} */
    socket.on(insertChatEvents.onEvent, async (data) => {
        try {

            if (!data.messageObject) throw new Error("messageObject must be provided")
            if (!data.roomId) throw new Error("messageObject must be provided")

            console.log(`@event: insert_chat`, data)

            io.to(data.roomId).compress(true).emit(insertChatEvents.emitEvent, data.messageObject)

            if(data.tags) {
                if (data.tags.length > 0) {
                    io.to(data.tags).emit("receive_tag_chat", data.messageObject)
                }
            }

            if (data.userIds) {
                if (data.userIds.length > 0) {
                    const notify = await createNotify(data.userIds, JSON.stringify({
                        message: data.messageObject.message, createdBy: data.messageObject.createdBy, room: data.messageObject.room
                    }))

                    console.log(`insert_chat >>> create_notify:success`)

                    io.to(data.userIds).emit("receive_chat_room_outside", {...data.messageObject, notify})
                }
            }

        } catch (error) {
            console.log(error.message)
            socket.emit(errorEvents.emitEvent, error.message)
        }
    })

}

exports.chatHandler = chatHandler;