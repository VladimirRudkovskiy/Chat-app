const uuidv4 = require('uuid/v4') // uuid library fot unic id for users

//create user
const createUser = ({name = "", email = email, socketId = null} = {}) => ( 
	{
		id:uuidv4(), //random id
		name,
		email,
		socketId
	}
)


// create message creates a message object
const createMessage = ({message = "", sender = ""} = { }) => ( 
	{
		id:uuidv4(),
		time: getTime(new Date(Date.now())),
		message,
		sender
	}
)

// create chat, creates chat object
const createChat = ({messages = [], name = 'Community', users = [], isCommunity = false} = {}) => ( 
	{
		id: uuidv4(),
		name:isCommunity ? "Community" : createChatNameFromUsers(users),
		messages,
		users,
		typingUsers:[],
		isCommunity
	}
)

// return string users names concatenated by a '&' or 'Empty Chat' if no users
const createChatNameFromUsers = (users, excludeUser = "") => {
	return users.filter(u => u !== excludeUser).join(' & ') || "Epty Users"
}

 
// return a string represented in 24hr time
const getTime = (date) => {
	return `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`
}

module.exports = {
	createMessage,
	createChat,
	createUser,
	createChatNameFromUsers
}