const { default: axios } = require("axios");

async function createNotify(listOfUser, content, type=null) {

    const API = process.env.API_URL ?? `http://localhost:5555/api`

    try {
        return await axios.post(API + "/notify/insertByListOfUser", {
            listOfUser,
            content,
            type: type ?? "receive_message"
        })
    } catch(error) {
        throw new Error(`Request error ${error.message}`)
    }
}

module.exports = createNotify