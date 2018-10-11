const S = require('./string')
module.exports = function TimeStamps(dispatch) {
    const blocked = new Set()

    function block(user) {
        blocked.add(user.name)
    }

    function processChatEvent(event) {
        if(event.channel === 26) return
        if(blocked.has(event.authorName)) return false
        var time = new Date()
        var timeStr = ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2)
        event.authorName = `</a>${timeStr}][<a href='asfunction:chatNameAction,${event.authorName}@0@0'>${event.authorName}</a>`
        return true
    }

    dispatch.hook('S_ADD_BLOCKED_USER', 2, block)
    dispatch.hook('S_USER_BLOCK_LIST', 2, ({blockList}) => {
        blockList.forEach(block)
    })
    dispatch.hook('C_REMOVE_BLOCKED_USER', 1, ({name}) => {
        blocked.delete(name)
    })
    dispatch.hook('S_LOGIN', 'raw', () => {
        blocked.clear()
    })
    dispatch.hook('S_CHAT', 2, processChatEvent)
    dispatch.hook('S_PRIVATE_CHAT', 1, processChatEvent)
}
