const { default: axios } = require('axios');
const endpoints = require('../utilities/apiUrls')
const { AxiosClient } = require('../utilities/axiosClient');
const { BEARER } = require('../utilities/constants');
const axiosClient = new AxiosClient();

class ChatService {
    /** @param {string} token */
    constructor(token) {
        this.instance = axios.create({
            baseURL: process.env.API_URL ?? `http://localhost:5555/api`,
            headers: { Authorization: BEARER + token.replace(/"/g, "") }
        })
    }


    /** @param {iInsertChatInput} body */
    insertChat(body) {
        return this.instance.post(`${endpoints.CREATE_CHAT_API_URL}`, body)
    }

    /** @param {string} chatId @param {iUpdateChatInput} body */
    updateChat(chatId, body) {
        return this.instance.put(`${endpoints.UPDATE_CHAT_API_URL}` + chatId, body)
    }

    /** @param {string} chatId */
    removeChat(chatId) {
        return this.instance.delete(`${endpoints.DELETE_CHAT_API_URL}` + chatId)
    }

    pinChat(chatId, roomId) {
        return this.instance.post(`${endpoints.PIN_CHAT_API_URL}`, { chatId, roomId })
    }

    /** @param {iCreateReactionInput} body */
    createReaction(body) {
        return this.instance.post(`${endpoints.CREATE_REACTION_API_URL}`, body)
    }

    removeReaction(reactionId) {
        return this.instance.delete(`${endpoints.REMOVE_REACTION_API_URL.replace('{{reaction}}', reactionId)}}`)
    }
}

module.exports = ChatService