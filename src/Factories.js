const uuidv4 = require('uuid/v4') 

//create user
const createUser = ({name = "", email = email} = {}) => ( 
	{
		id:uuidv4(),
		name,
		email
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

// create chat creates chat object
const createChat = ({messages= [], name= 'Community', users = []} ={}) => ( 
	{
		id: uuidv4(),
		name,
		messages,
		users,
		typingUsers:[]
	}
)

// return a string represented in 24hr time
const getTime = (date) => {
	return `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`
}

module.exports = {
	createMessage,
	createChat,
	createUser
}