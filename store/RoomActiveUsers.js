class RoomActiveUser {

    static list = {/* "roomId": [{ _id: string, username: string }] */ }

    static insert({ socketId, roomId, userId }) {
        if (!this.list[roomId]) {
            this.list[roomId] = [{ userId, socketId }]
        } else {
            const existedUser = this.list[roomId].find(user => user.socketId === socketId)
            if (!existedUser) {
                this.list[roomId].push({ userId, socketId })
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

module.exports = RoomActiveUser