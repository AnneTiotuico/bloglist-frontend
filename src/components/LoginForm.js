const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword
}) => {
  return (
    <>
      <h2>log in to blogs application</h2>
      <form onSubmit={handleLogin} className='login-form'>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" className="login-button">login</button>
      </form>
    </>
  )
}

export default LoginForm