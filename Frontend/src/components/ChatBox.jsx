const ChatBox = ({ messages }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {messages?.map((msg, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
        }}>
          <div style={{
            maxWidth: '70%',
            padding: '10px 14px',
            borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            background: msg.role === 'user' ? '#2563eb' : '#f1f5f9',
            color: msg.role === 'user' ? 'white' : '#1e293b',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatBox
