import React, { Component } from 'react';
import { SideBarOption } from './SideBarOption'
import { get, last, differenceBy } from 'lodash'
import { createChatNameFromUsers } from '../../Factories'



export default class SideBar extends Component{
	static type = {
		CHATS:"chats",
		USERS:"users"
	}
	constructor(props) {
		super(props)
			this.state = {
				reciever:"",
				activeSidebar: SideBar.type.CHATS
			}
		}
	
		handleSubmit = (e) => {
			e.preventDefault() // so we dont submit this page 
			const { reciever } = this.state
			const { onSendPrivateMessage } = this.props

			onSendPrivateMessage(reciever) //sende reciever to chat container
			this.setState({ reciever:"" }) //by pressing ENTER its not lock on name
		}

		addChatForUser = (username) =>{
			this.setActiveSideBar(SideBar.type.CHATS) // back to chat
			this.props.onSendPrivateMessage( username )
		}

		setActiveSideBar = (newSideBar) => {
			this.setState({ activeSidebar:newSideBar })
		}

		
	render(){
		const { chats, activeChat, user, setActiveChat, logout, users} = this.props
		const { reciever, activeSidebar } = this.state
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
					<div className="side-bar-select">
						<div 
						onClick = { () =>{ this.setActiveSideBar(SideBar.type.CHATS)}}
						className={ `side-bar-select__option ${(activeSidebar === SideBar.type.CHATS) ? 'active' : ''}` }>
						<span>Chats</span>
						</div>
						<div 
						onClick = { () =>{ this.setActiveSideBar(SideBar.type.USERS)}}
						className={ `side-bar-select__option ${(activeSidebar === SideBar.type.USERS) ? 'active' : ''}` }>
						<span>Users</span>
						</div>
					</div>

					<div 
						className="users" 
						ref='users' 
						onClick={(e)=>{ (e.target === this.refs.user) && setActiveChat(null) }}>
							
						{
							activeSidebar === SideBar.type.CHATS ? 
						chats.map((chat)=>{
							if(chat.name){							
								return(
									<SideBarOption
										key = { chat.id }
										name = { chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name) }
										lastMessage = { get(last(chat.messages), 'message', '') }
										active = { activeChat.id == chat.id }
										onClick = { () => { this.props.setActiveChat(chat) } }
									/>
							)
							}

							return null
						})			
						:
							differenceBy(users, [user], 'name').map((otherUser) => {
								return(
									<SideBarOption
									key = {otherUser.id}
									name = { otherUser.name }
									onClick = { () => { this.addChatForUser( otherUser.name )} }
									/>
								)
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