exports.validator = function (object, checker) {

    const errors = []

    // kiem tra xem no co duoc truyen len hay khong
    for (let key in checker) {
        if (!object[key]) {
            errors.push(`${key} must be provided`)
        }
    }

    if (errors.length > 0) throw new Error(`\x1b[31m ${JSON.stringify(errors)} \x1b[0m`)

    // kiem tra xem no truyen len dung voi yeu cau hay khong
    for (let key in object) {
        if (!checker[key].$(object[key])) {
            errors.push(checker[key].message)
        }
    }

    if (errors.length > 0) throw new Error(`\x1b[31m ${JSON.stringify(errors)} \x1b[0m`)

    return object
}