import React from 'react';
import { useSocket } from '../../context/SocketContext';

const OnlineUsers = () => {
  const { onlineUsers, isConnected } = useSocket();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '12px',
      color: '#666'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isConnected ? '#28a745' : '#dc3545',
          animation: isConnected ? 'pulse 1.5s infinite' : 'none'
        }} />
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      {isConnected && onlineUsers.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span>•</span>
          <span>{onlineUsers.length} user(s) online</span>
        </div>
      )}
    </div>
  );
};

export default OnlineUsers;