interface iInsertChatInput {
    message: string
    room: string
    type: number
    replyTo?: string
    file?: string
}

interface iUpdateChatInput {
    message?: string
    room: string
    type?: number
    replyTo?: string
    file?: string
    pin?: boolean
}

interface iCreateReactionInput {
    chatId: ObjectId,
    moji: String
}

type User = {
    _id: string
    username: string
}

interface iChatInput {
    message: string
    roomId: string
    type: number
    replyTo?: string
    forwardedFrom?: string
    file?: string
}

type KickOutInput = {
    user: Object
    kickedUserId: string
    roomId: string
}

type kickOutOfRoomServiceInput = {
    kickedUserId: string
    roomId: string
}