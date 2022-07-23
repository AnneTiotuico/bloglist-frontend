import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('initial render of page', () => {
  let container
  let mockHandler

  beforeEach(() => {
    const blog = {
      title: 'book title here',
      author: 'jane austen',
      url: 'testing blog url',
      likes: 2,
      user: {
        username: 'annemelody',
        name: 'anne',
        id: '62d89f87444344dff3edef41'
      },
      id: '62d8a4ebe5dd7ed8f117f32b'
    }

    mockHandler = jest.fn()

    container = render(<Blog blog={blog} user={blog.user} handleUpdateLikes={mockHandler}/>).container
  })

  test('shows blog\'s title and author, but not url or likes', () => {
    const element = screen.getByText('book title here jane austen')
    expect(element).toBeDefined()
    const div = container.querySelector('.toggleableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('clicking the view button shows the url and likes', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.toggleableContent')
    expect(div).not.toHaveStyle('display: none')
    const url = screen.getByText('testing blog url', { exact: false })
    expect(url).toBeDefined()
    const likes = screen.getByText('likes 2', { exact: false })
    expect(likes).toBeDefined()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})