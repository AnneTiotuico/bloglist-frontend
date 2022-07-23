import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  let { container } = render(<BlogForm createBlog={createBlog} />)

  const title = container.querySelector('input[name="title"]')
  const author = container.querySelector('input[name="author"]')
  const url = container.querySelector('input[name="url"]')
  const sendButton = screen.getByText('create')

  await user.type(title, 'stargirl')
  await user.type(author, 'elem')
  await user.type(url, 'testing blog url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('stargirl')
  expect(createBlog.mock.calls[0][0].author).toBe('elem')
  expect(createBlog.mock.calls[0][0].url).toBe('testing blog url')
})