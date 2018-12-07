const uuidv4 = require('uuid/v4')
/*
	create a user.
	@prop id {string}
	@prop name {string}
	@param {object}
		name {string}
*/

const createUser = ({name = ''} = {}) => (
	{
		id:uuidv4(),
		name
	}
)


/*
	create message
	creates a message object
	@prop id {string}
	@prop time {Date} the time in 24hr format
	@prop message {string} actual string message 
	@prop sender {string} sender of the message 
	@param {object} 
			message {string}
			sender {string}
*/

const createMessage = ({message = '', sender = ''} = { }) => (
	{
		id:uuidv4(),
		time: getTime(new Date(Date.now())),
		message,
		sender
	}
)

/*
	create Chat 
	creates a chat object
	@prop id {string}
	@prop name {string}
	@prop message {Array.Message}
	@prop users {Array.string}
	@param {object}
		messages {Array.Message}
		name {string}
		users {Array.string}

*/

const createChat = ({messages= [], name= 'Community', users = []} ={}) => (
	{
		id: uuidv4(),
		name,
		messages,
		users,
		typingUsers:[]
	}
)

/*
	@param date {Date}
	@return a string represented in 24hr time
*/


const getTime = (date) => {
	return `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`
}

module.exports = {
	createMessage,
	createChat,
	createUser
}