class SendingChatUsers {
    
    static list = {}

    static insert({ socketId, roomId, user }) {
        if (!this.list[roomId]) {
            this.list[roomId] = [{ ...user, socketId }]
        } else {
            const existedUser = this.list[roomId].find(user => user.socketId === socketId)
            if (!existedUser) {
                this.list[roomId].push({ ...user, socketId })
            }
        }
        return this.list[roomId]
    }

    static eject({ socketId }) {
        for (let room in this.list) {
            const newData = this.list[room].filter(element => element.socketId !== socketId)
            if (newData.length > 0) {
                this.list[room] = newData
            } else {
                delete this.list[room]
            }
        }
    }
}

module.exports = SendingChatUsers