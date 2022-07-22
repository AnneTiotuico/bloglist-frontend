import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
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

  const handleAddBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      let addedBlog = await blogService.create(newBlog)
      setBlogs([...blogs, addedBlog])
      
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

  const handleUpdateLikes = async (newBlog) => {
    try {
      await blogService.update(newBlog.id, newBlog)      
      setMessage(`liked ${newBlog.title} by ${newBlog.author}`)
      setMsgType('')
      setTimeout(() => {
        setMessage(null)
      }, 1000)
    } catch (exception) {
      setMessage('Cannot update likes')
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleDeleteBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return
    }
    try {
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))      
      setMessage(`deleted ${blog.title} by ${blog.author}`)
      setMsgType('')
      setTimeout(() => {
        setMessage(null)
      }, 1000)
    } catch (exception) {
      setMessage('Cannot delete blog')
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleAddBlog} />
    </Togglable>
  )

  console.log(blogs)

  const blogsList = () => (
    <>
      <h2>blogs</h2>
      <p>{user.name} logged-in</p> 
      <button onClick={handleLogout}>logout</button>
      {blogForm()}
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleUpdateLikes={handleUpdateLikes} handleDeleteBlog={handleDeleteBlog}/>
      )}
    </>
  )

  return (
    <div>
      <Notification message={message} msgType={msgType} />
      {user === null 
        ? <LoginForm 
            handleLogin={handleLogin} 
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
           />
        : blogsList()}
    </div>
  )
}

export default App
