const { default: axios } = require('axios')
const endpoints = require('../utilities/apiUrls')
const { AxiosClient } = require('../utilities/axiosClient')
const { BEARER } = require('../utilities/constants')
const axiosClient = new AxiosClient()

class RoomService {
    /** @param {string} token */
    constructor(token) {
        if (!token) throw new Error("Token is not provided")
        this.instance = axios.create({
            baseURL: process.env.API_URL ?? `http://localhost:5555/api`,
            headers: { Authorization: BEARER + token.replace(/"/g, "") }
        })
    }

    /** @param {string} roomId */
    findJoinedRoomByRoomId(roomId) {
        return this.instance.get(endpoints.FIND_USER_JOINED_ROOM_DETAIL_API_URL+roomId)
    }

    editRoomInfo(roomId, body) {
        return this.instance.put(endpoints.EDIT_ROOM_INFO_API_URL+roomId, body)
    }

    /** @param {kickOutOfRoomServiceInput} */
    kickOutOfRoom({ roomId, kickedUserId }) {
        return this.instance.delete(endpoints.DELETE_USER_FROM_ROOM_API_URL, { roomId, userId: kickedUserId })
    }

    inviteIntoRoom({ roomId, invitedUserId }) {
        return this.instance.post(endpoints.INVITE_USER_INTO_ROOM_API_URL, { roomId, userId: invitedUserId })
    }
}

module.exports = RoomService