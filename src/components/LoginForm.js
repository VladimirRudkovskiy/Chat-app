import React, { Component } from 'react';
import { VERIFY_USER } from '../Events'
export default class LoginForm extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			nickname:'',
			error:'',
			email:''
		};
	}

	setUser = ({user, isUser}) => {
		console.log(user, isUser);
		if(isUser){
			this.setError('Username is taken')
		}else{
			this.setError('')
			this.props.setUser(user)
		}
	}

	handleSubmit = (e) => {
		e.preventDefault()

		const { socket } = this.props
		const { nickname } = this.state
		const { email } = this.state
		socket.emit(VERIFY_USER, nickname, email, this.setUser)
	}

	handleChange = (e) => {
		this.setState({nickname:e.target.value})

	}
	
	handleChangeEmail = (e) => {
		this.setState({email:e.target.value})
	}


	setError = (error) => {
		this.setState({error})
	}

	render() {
		const { nickname, email, error } = this.state
		return (
			<div className='Login'>
				<form onSubmit={this.handleSubmit} className='login-form'>
					<label htmlFor='nickname'>
						<h2>Got a nickname?</h2>
					</label>
					<input
						ref={(input)=> {this.textInput = input }}
						type ='text'
						id='nickname'
						value={nickname}
						onChange={this.handleChange}
						placeholder={'Enter your username'}
						/>
						<div className='error'>{error ? error:null}</div>
						
				</form>
				<form onSubmit={this.handleSubmit} className='login-form'>
					<label htmlFor='email'>
						<h2>Got email?</h2>
					</label>
					<input
						ref={(input)=> {this.textInput = input }}
						type ='text'
						id='email'
						value={email}
						onChange={this.handleChangeEmail}
						placeholder={'Enter your email'}
						/>
				
				</form>
			</div>
		);
	}
}