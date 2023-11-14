class SocketReceiver {
    token
    data
    constructor(body) {
        this.token = body.token
        this.data = body.data
    }
}

class SocketSender {
    constructor({ message, data, error }) {
        this.message = message
        this.data = data
        this.error = error ?? false
    }
}

module.exports = {SocketReceiver, SocketSender}