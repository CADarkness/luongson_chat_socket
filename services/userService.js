const { default: axios } = require("axios")
const endpoints = require('../utilities/apiUrls')
const { BEARER } = require('../utilities/constants')

class UserService {
    constructor(token) {
        this.instance = axios.create({
            baseURL: process.env.API_URL  ?? `http://localhost:5555/api`,
            headers: { Authorization: BEARER + token.replace(/"/g, "") }
        })
    }

    setOnline() {
        return this.instance.put(`${endpoints.SET_USER_ONLINE_STATUS_API_URL}`, { isOnline: true })
    }

    setOffline() {
        return this.instance.put(`${endpoints.SET_USER_ONLINE_STATUS_API_URL}`, { isOnline: false })
    }

    getSuperAdminIds() {
        return this.instance.get(`${endpoints.GET_SUPER_ADMIN_IDS_API_URL}`)
    }

    insertNotifyTo(listOfUser, content) {
        return this.instance.post(endpoints.INSERT_NOTIFY_TO_USERS, { listOfUser, content })
    }

}

module.exports = UserService