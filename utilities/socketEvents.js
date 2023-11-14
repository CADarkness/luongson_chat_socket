exports.userLoginEvents = {
    onEvent: 'user_login'
}

exports.userLogoutEvents = {
    onEvent: 'user_logout'
}

exports.errorEvents = {
    emitEvent: 'receive_error'
}

exports.createNewRoom = {
    emitEvent: 'create_new_room',
    onEvent: 'receive_create_new_room'
}

exports.editRoomInfo = {
    onEvent: 'edit_room_info',
    emitEvent: 'receive_edit_room_info'
}

exports.joinRoomEvents = {
    onEvent: 'join_room',
    emitEvent: 'receive_join_room'
}

exports.kickEvents = {
    onEvent: 'kick_out_room',
    emitEvent: 'receive_kick_out_room'
}

exports.inviteEvents = {
    onEvent: 'invite_into_room',
    emitEvent: 'receive_invite_into_room'
}

exports.leaveRoomEvents = {
    onEvent: 'leave_room',
    emitEvent: 'receive_leave_room'
}

exports.deleteRoomEvents = {
    onEvent: 'delete_room',
    emitEvent: 'receive_delete_room'
}

exports.insertChatEvents = {
    onEvent: 'insert_chat',
    emitEvent: 'receive_chat'
}

exports.editChatEvents = {
    onEvent: 'edit_chat',
    emitEvent: 'receive_edit_chat'
}

exports.removeChatEvents = {
    onEvent: 'remove_chat',
    emitEvent: 'receive_remove_chat'
}

exports.deleteManyMessageEvents = {
    onEvent: 'delete_many_chat',
    emitEvent: 'receive_delete_many_chat'
}

exports.pinChatEvents = {
    onEvent: 'pin_chat',
    emitEvent: 'receive_pin_chat'
}

exports.sendingChatEvents = {
    onEvent: 'sending_chat',
    emitEvent: 'receive_sending_chat'
}

exports.forceStopSendingChatEvents = {
    onEvent: 'force_stop_sending_chat',
    emitEvent: 'receive_force_stop_sending_chat'
}

exports.sendReactionToChatEvents = {
    onEvent: 'send_reaction_chat',
    emitEvent: 'receive_reaction_chat'
}

exports.sendingChatErrorEvents = {
    onEvent: 'chat_error',
}