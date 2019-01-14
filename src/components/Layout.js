import React, { Component } from 'react';
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT } from '../Events'
import LoginForm from './LoginForm'
import ChatContainer from '../chats/ChatContainer'

const socketUrl = "http://localhost:3231"
export default class Layout extends Component {

	constructor(props) {
		super(props);
		this.state ={
			socket: null,
			user: null
		};
	}
	componentWillMount() {
		this.initSocket()
	}

	initSocket = () => { //initialized our socket for us
		const socket = io(socketUrl)
		socket.on('connect', () => {
			console.log("Connected");
		})
		this.setState({ socket })
	}

	setUser = (user) => { // sets the user property in state
		const { socket } = this.state
		socket.emit(USER_CONNECTED, user); // passing the user 
		this.setState({ user })
	}
	logout = () => { // sets the user property to null so we can log out
		const { socket } = this.state
		socket.emit(LOGOUT)
		this.setState({ user:null })
	}


	render() {
		const { socket, user } = this.state
		return(
			<div className='container'>
			{
				!user?
				 <LoginForm socket={socket} setUser={this.setUser} />
				 :
				 <ChatContainer socket={socket} user={user} logout={this.logout}/>
			} 
			</div>
		);
	}
}