import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Ensure this matches your back-end URL

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome! Would you like to add a new property today?' },
    { sender: 'bot', text: '1. Add a new property\n2. View your existing properties\n3. Update your property details\n4. Check my certificates' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('bot-message', (msg) => {
      setMessages((prev) => [...prev, { sender: 'bot', text: msg }]);
    });

    return () => {
      socket.off('bot-message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    socket.emit('user-message', input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
      <div className="flex flex-col h-screen bg-lightblue-50">
        {/* Header */}
        <header className="flex items-center justify-between py-4 px-8 shadow-md">
          <div className="flex items-center space-x-4">
            <img src="https://smoovey-assets.s3.eu-west-1.amazonaws.com/Assets/Logos/Logo+1.svg" alt="Smoovey Logo" className="h-10" />
            <h1 className="text-2xl text-white font-semibold">Smoovey Chat</h1>
          </div>
        </header>

        {/* Chat Window */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${
                        msg.sender === 'bot' ? 'justify-start' : 'justify-end'
                    }`}
                >
                  <div
                      className={`rounded-lg p-3 max-w-xs break-words ${
                          msg.sender === 'bot'
                              ? 'bg-lightblue text-gray-900'
                              : 'bg-darkblue text-white'
                      }`}
                  >
                    {msg.text.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex items-center p-4 bg-white shadow-inner">
          <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkblue"
          />
          <button
              onClick={sendMessage}
              className="ml-4 px-4 py-2 bg-darkblue text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-darkblue"
          >
            Send
          </button>
        </div>
      </div>
  );
}

export default App;
