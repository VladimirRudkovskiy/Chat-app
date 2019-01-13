const io = require('./index.js').io

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED, 
		LOGOUT, COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT,
		TYPING, PRIVATE_MESSAGE  } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')

let connectedUsers = { } //key value with username and user id 

let communityChat = createChat()

module.exports = function(socket){
					
	console.log("Socket Id:" + socket.id);

	let sendMessageToChatFromUser;

	let sendTypingFromUser;

	//Verify Username
	socket.on(VERIFY_USER, (nickname, email, callback)=>{ //callback -> this.setUser
		if(isUser(connectedUsers, nickname && email)){
			callback({ isUser:true, user:null })
		}else{
			callback({ isUser:false, user:createUser({name:nickname, email:email, socketId:socket.id})})
		}
	})

	//User Connects with username
	socket.on(USER_CONNECTED, (user)=>{
		user.socketId = socket.id
		connectedUsers = addUser(connectedUsers, user)
		socket.user = user

		sendMessageToChatFromUser = sendMessageToChat(user.name)
		sendTypingFromUser = sendTypingToChat(user.name)

		io.emit(USER_CONNECTED, connectedUsers)
		console.log(connectedUsers);

	})
	
	//User disconnects
	socket.on('disconnect', ()=>{
		if("user" in socket){
			connectedUsers = removeUser(connectedUsers, socket.user.name)

			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
	})


	//User logsout
	socket.on(LOGOUT, ()=>{
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		io.emit(USER_DISCONNECTED, connectedUsers)
		console.log("Disconnect", connectedUsers);

	})

	//Get Community Chat
	socket.on(COMMUNITY_CHAT, (callback)=>{
		callback(communityChat)
	})

	socket.on(MESSAGE_SENT, ({chatId, message})=>{
		sendMessageToChatFromUser(chatId, message)
	})

	socket.on(TYPING, ({chatId, isTyping})=>{
		sendTypingFromUser(chatId, isTyping)
	})

	socket.on(PRIVATE_MESSAGE, ({reciever, sender})=> {
		if(reciever in connectedUsers){
			const newChat = createChat({ name: `${reciever}&${sender}`, users:[reciever, sender]}) // creating a new chat with new users
			const recieverSocket = connectedUsers[reciever.socketId] // send to persen who request to create a privat chat
			socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat) // send a event to socket
			socket.emit(PRIVATE_MESSAGE, newChat) //emit privat message and send new chat
		}
	})

}
/*
 Returns a function that will take a chat id and a boolean isTyping
 and then emit a broadcast to the chat id that the sender is typing
*/

function sendTypingToChat(user){
	return (chatId, isTyping)=>{
		io.emit(`${TYPING}-${chatId}`, {user, isTyping})
	}
}

/*
 Returns a function that will take a chat id and message
 and then emit a broadcast to the chat id.
*/

function sendMessageToChat(sender){
	return (chatId, message)=>{
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
	}
}


// Adds user to list passed in.


function addUser(userList, user){
	let newList = Object.assign({}, userList)
	newList[user.name] = user
	return newList
}


 // Removes user from the list passed in.


function removeUser(userList, username){
	let newList = Object.assign({}, userList) //create a list with object
	delete newList[username] // delete the object
	return newList
}


// Checks if the user is in list passed in.


function isUser(userList, username){ // user list or object with username we wanna check for
  	return username in userList
}