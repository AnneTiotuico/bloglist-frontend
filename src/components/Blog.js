import { useState } from 'react'

const Blog = ({ blog, user, handleUpdateLikes, handleDeleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showToUser = { display: (user.id === (blog.user.id || blog.user)) ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateLikes = (event) => {
    event.preventDefault()
    let likedBlog = { ...blog, likes: blog.likes += 1 }
    handleUpdateLikes(likedBlog)
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    handleDeleteBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={hideWhenVisible}>view</button>
        <button onClick={toggleVisibility} style={showWhenVisible}>hide</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url}<br/>
        likes {blog.likes}<button onClick={updateLikes} style={{ marginLeft : 5 }}>like</button><br/>
        {blog.user.name}<br/>
        <button onClick={deleteBlog} style={showToUser}>remove</button>
      </div>
    </div>
  )}

export default Blog