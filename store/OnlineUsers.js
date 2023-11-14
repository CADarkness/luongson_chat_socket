class OnlineUsers {
    
    static list = []

    static insert (data) {
        if (this.list.length === 0 || this.list.find(user => user.userId !== data.userId)) {
            this.list.push(data)
        }
        return data
    }

    static eject (data) {
        let target = null

        if (data?.userId) {
            let foundedUser = this.list.find(user => user.userId === data.userId)
            if (foundedUser) target = foundedUser
            this.list = this.list.filter(user => user.userId !== data.userId)
        }
        if (data.socketId) {
            let foundedUser = this.list.find(user => user.socketId === data.socketId)
            if (foundedUser) target = foundedUser
            this.list = this.list.filter(user => user.socketId !== data.socketId)
        }
        return target
    }

    static findByUserId(userId) {
        return this.list.find(user => user.userId === userId)
    }

    static findBySocketId(socketId) {
        return this.list.find(user => user.socketId === socketId)
    }
}

module.exports = OnlineUsers