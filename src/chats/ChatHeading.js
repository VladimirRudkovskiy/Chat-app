import React from 'react';

export default function({name, numberOfUsers}) {
		
		return (
			<div className="chat-users">
				<div className="user-info">
					<div className="user-name"></div>
					<div className="status">
						<span>{numberOfUsers ? numberOfUsers : null}</span>
					</div>
				</div>
			</div>
		)
	} 
