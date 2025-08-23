// src/components/dashboard/MessagesPanel.jsx
import React from 'react';
import ConversationList from '../ConversationList';

const MessagesPanel = () => {
  return (
    <div className="messages-panel">
      <h2>My Messages</h2>
      <p>Select a conversation to view your messages.</p>
      <hr className='message1'/>
      <ConversationList />
    </div>
  );
};
export default MessagesPanel;