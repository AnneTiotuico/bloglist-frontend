import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, msgType }) => {
  const notifStyle = {
    color: '#027b00',
    fontSize: 16,
    fontWeight: 400,
    background: '#d3d3d3',
    borderRadius: 5,
    borderColor: '#027b00',
    borderWidth: 3,
    borderStyle: 'solid',
    padding: 5
  }

  if (msgType === 'error') {
    notifStyle.color = 'red'
    notifStyle.borderColor = 'red'
  }
  
  if (message === null) {
    return null
  }

  return (
    <div style={notifStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({})
  const [message, setMessage] = useState(null)
  const [msgType, setMsgType] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    (async () => {
      const blogs = await blogService.getAll()
      setBlogs( blogs )
    })()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong username or password')
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setUsername('')
    setPassword('')

    setMessage('loggedout')
    setMsgType('')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()

    try {
      await blogService.create(newBlog)
      setBlogs([...blogs, newBlog])
      setNewBlog({})
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setMsgType('')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('Cannot add blog')
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">login</button>
      </form>      
    </>
  )

  const blogForm = () => (
    <>
      <h2>create new</h2>
      <form onSubmit={handleAddBlog}>
        <div>
          title: <input type="text" name="title" onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}/>
        </div>
        <div>
          author: <input type="text" name="author" onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}/>
        </div>
        <div>
          url: <input type="text" name="url" onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}/>
        </div>
        <button type="submit">create</button>
      </form>  
    </>
  )

  const blogsList = () => (
    <>
      <h2>blogs</h2>
      <p>{user.name} logged-in</p> 
      <button onClick={handleLogout}>logout</button>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )

  return (
    <div>
      <Notification message={message} msgType={msgType} />
      {user === null ? loginForm() : blogsList()}
    </div>
  )
}

export default App
