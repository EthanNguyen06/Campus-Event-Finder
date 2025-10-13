import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/LoginPage.css';

function LoginPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!username || !password) {
			setError('Please enter both username and password.');
			return;
		}
		setError('');
		alert(`Logged in as ${username}`);
	};

	return (
		<>
			<Navbar />
			<div className="login-container">
				<h1>Login</h1>
				<form onSubmit={handleSubmit} className="login-form">
					<div>
						<label htmlFor="username">Username/email:</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							autoComplete="username"
						/>
					</div>
					<div>
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
						/>
					</div>
					{error && <div className="error-message">{error}</div>}
					<button type="submit">Login</button>
				</form>
			</div>
		</>
	);
}

export default LoginPage;
