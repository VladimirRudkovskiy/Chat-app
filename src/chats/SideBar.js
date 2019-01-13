import React, { Component } from 'react';



export default class SideBar extends Component{
	constructor(props) {
		super(props)
			this.state = {
				reciever:""
			}
		}
	
		handleSubmit = (e) => {
			e.preventDefault() // so we dont submit this page 
			const { reciever } = this.state
			const { onSendPrivateMessage } = this.props

			onSendPrivateMessage(reciever) //sende reciever to chat container
		}

		
	render(){
		const { chats, activeChat, user, setActiveChat, logout} = this.props
		const { reciever } = this.state
		return (
			<div id="side-bar">
					<div className="heading">
						<div className="app-name">Chat</div>
					</div>
					<form onSubmit={this.handleSubmit} className="search">
						<i className="search-icon">+</i>
						<input
						 placeholder="Search" 
						 type="text"
						 value={reciever}
						 onChange={(e)=>{ this.setState({reciever:e.target.value})}}/>
						<div className="plus"></div>
					
					</form>

					<div 
						className="users" 
						ref='users' 
						onClick={(e)=>{ (e.target === this.refs.user) && setActiveChat(null) }}>
							
						{
						chats.map((chat)=>{
							if(chat.name){
								const lastMessage = chat.messages[chat.messages.length - 1];
								const chatSideName = chat.users.find((name)=>{
									return name !== user.name 
								}) || "Community"
								const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : ''
								
								return(
								<div 
									key={chat.id} 
									className={`user ${classNames}`}
									onClick={ ()=>{ setActiveChat(chat) } }
									>
									<div className="user-photo">{chatSideName[0].toUpperCase()}</div>
									<div className="user-info">
										<div className="name">{chatSideName}</div>
											{lastMessage && <div className="last-message">{lastMessage.message}</div>}
									</div>
								
								</div>
							)
							}

							return null
						})	
						}
						
					</div>
					<div className="current-user">
						<span>{user.name}</span>
						<div onClick={()=>{logout()}} title="Logout" className="logout">
							Log Out
						</div>
					</div>
			</div>
		);
	
}
}	