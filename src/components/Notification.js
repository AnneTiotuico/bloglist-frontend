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

export default Notification