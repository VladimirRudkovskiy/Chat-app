const io = require('./index.js').io

const { VERIFY_USER, USER_CONNECTED, LOGOUT } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')

let connectedUsers = { }

module.exports = function(socket){
	console.log("Socket Id:" + socket.id);


		//Verify Username
		socket.on(VERIFY_USER, (nickname, callback) =>{
			if(isUser(connectedUsers, nickname)){
				callback({ isUser:true, user:null})
			}else{
				callback({ isUser: false, user:createUser({name:nickname})})
			}
		})


		//User Connects with username
		socket.on(USER_CONNECTED, (user) => {
			connectedUsers = addUser(connectedUsers, user)
			socket.user = user

			io.emit(USER_CONNECTED, connectedUsers)
			console.log(connectedUsers);
		})


		//User disconnects



		//User logouts


}


/*
	Adds user to list passed in.
	@param userList {object} Object with key value pairs of users 
	@param user {User} the user to added to the list.
	@return UserList {Object} Object with key value pairs of Users
	*/

	function addUser(userList, user){
		let newList = Object.assign({}, userList)
		newList[user.name] = user
		return newList
	}

/*
		Removes user from the list passed in.
		@param UserList {Object} Object with key value pairs of users 
		@param username {string}
		@return userList {Object} Object with key value pairs of users 
*/

	function removeUser(userList, username){
		let newList = Object.assign({}, userList)
		delete newList[username]
		return newList
	}

/*
	Checks is the user is in list passed in
	@param UserList {Object} Object with key value pairs of users 
	@param username {string}
	@return userList {Object} Object with key value pairs of users 

*/

function isUser(userList, username){
	return username in userList
}