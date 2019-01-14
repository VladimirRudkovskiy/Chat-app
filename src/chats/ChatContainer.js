import React, { Component } from 'react';
import SideBar from '../components/sidebar/SideBar'
import { COMMUNITY_CHAT, MESSAGE_SENT, MESSAGE_RECIEVED, 
	TYPING, PRIVATE_MESSAGE, USER_CONNECTED, USER_DISCONECTED } from '../Events'
import ChatHeading from './ChatHeading'
import Messages from '../components/messages/Messages'
import MessageInput from '../components/messages/MessageInput'
import { values } from 'lodash'

export default class ChatContainer extends Component {
	constructor(props) {
	  super(props);	
	
	  this.state = {
			chats:[],
			users:[],
	  	activeChat:null
	  };
	}

	componentDidMount() {
		const { socket } = this.props
		this.initSocket(socket) //initialize all our staff to socket
	}

	componentWillUnmount(){ //to not set state when user logs out
		const { socket } = this.props
		socket.off( PRIVATE_MESSAGE )
		socket.off( USER_CONNECTED )
		socket.off( USER_DISCONECTED )

	}

	initSocket(socket) {
		const { user } = this.props
		socket.emit(COMMUNITY_CHAT, this.resetChat)
		socket.on(PRIVATE_MESSAGE, this.addChat)
		socket.on('connect', ()=> {
			socket.emit(COMMUNITY_CHAT, this.resetChat) // reset all chat if someone disconnects
		})
		socket.on(USER_CONNECTED, (users)=>{
			this.setState({ users:values(users) })
		})
		socket.on(USER_DISCONECTED, (users)=>{
			this.setState({ users:values(users) })
		})
	}

	sendOpenPrivateMessage = (reciever) => { 
		const { socket, user } = this.props
		const { activeChat } = this.state
		socket.emit(PRIVATE_MESSAGE, {reciever, sender:user.name, activeChat})
	}


	//	Reset the chat back to only the chat passed in.


	resetChat = (chat)=>{
		return this.addChat(chat, true)
	}

	/*
		Adds chat to the chat container, if reset is true removes all chats
		and sets that chat to the main chat.
		Sets the message and typing socket events for the chat.
	*/
	addChat = (chat, reset = false)=>{
		const { socket } = this.props
		const { chats } = this.state

		const newChats = reset ? [chat] : [...chats, chat]
		this.setState({chats:newChats, activeChat:reset ? chat : this.state.activeChat})

		const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
		const typingEvent = `${TYPING}-${chat.id}`

		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		socket.on(messageEvent, this.addMessageToChat(chat.id))
	}

	/*
	 	Returns a function that will 
	  adds message to chat with the chatId passed in. 
	*/
	addMessageToChat = (chatId)=>{
		return message => {
			const { chats } = this.state
			let newChats = chats.map((chat)=>{
				if(chat.id === chatId)
					chat.messages.push(message)
				return chat
			})

			this.setState({chats:newChats})
		}
	}


	//	Updates the typing of chat with id passed in.


	updateTypingInChat = (chatId) =>{
		return ({isTyping, user})=>{
			if(user !== this.props.user.name){

				const { chats } = this.state

				let newChats = chats.map((chat)=>{
					if(chat.id === chatId){
						if(isTyping && !chat.typingUsers.includes(user)){
							chat.typingUsers.push(user)
						}else if(!isTyping && chat.typingUsers.includes(user)){
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
						}
					}
					return chat
				})
				this.setState({chats:newChats})
			}
		}
	}

	
	//	Adds a message to the specified chat

	sendMessage = (chatId, message)=>{
		const { socket } = this.props
		socket.emit(MESSAGE_SENT, {chatId, message} )
	}

	
	//	Sends typing status to server.

	sendTyping = (chatId, isTyping)=>{
		const { socket } = this.props
		socket.emit(TYPING, {chatId, isTyping})
	}

	setActiveChat = (activeChat)=>{
		this.setState({activeChat})
	}
	render() {
		const { user, logout } = this.props
		const { chats, activeChat, users } = this.state
		return (
			<div className="container">
				<SideBar
					logout={logout}
					chats={chats}
					user={user}
					users={users}
					activeChat={activeChat}
					setActiveChat={this.setActiveChat}
					onSendPrivateMessage={this.sendOpenPrivateMessage}
					/>
				<div className="chat-room-container">
					{
						activeChat !== null ? (

							<div className="chat-room">
								<ChatHeading name={activeChat.name} />
								<Messages 
									messages={activeChat.messages}
									user={user}
									typingUsers={activeChat.typingUsers}
									/>
								<MessageInput 
									sendMessage={
										(message)=>{
											this.sendMessage(activeChat.id, message)
										}
									}
									sendTyping={
										(isTyping)=>{
											this.sendTyping(activeChat.id, isTyping)
										}
									}
									/>

							</div>
						):
						<div className="chat-room choose">
							<h3>Choose a chat!</h3>
						</div>
					}
				</div>

			</div>
		);
	}
}