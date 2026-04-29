import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { checkStock } from '../../api/inventoryApi'; 
import botIcon from '../../assets/bot-icon.avif'; 
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi, how can I help you today? You can ask me to check if we have specific components in the lab!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const lowerMsg = userMsg.toLowerCase();
    
    // 1. Handle basic greetings
    if (['hi', 'hello', 'hey', 'help'].includes(lowerMsg.trim())) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: "Hello! Tell me what component you are looking for, and I'll check our live inventory." }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    // 2. Handle Manners & Acknowledgements
    const simpleMsg = lowerMsg.replace(/[^a-z]/g, ''); // removes spaces and punctuation
    if (['thanks', 'thankyou', 'thx', 'ok', 'okay', 'great', 'awesome'].includes(simpleMsg)) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: "You're very welcome! Let me know if you need to find anything else." }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    // 3. Smart NLP Filter: Remove conversational words to isolate the component name
    let itemName = lowerMsg
      .replace(/i need|do you have|are there any|looking for|finding|can i get|i want|any|some|a|an/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();

    if (!itemName) itemName = lowerMsg;

    try {
      // THE FIX: Cleaned up the checkStock call
      const res = await checkStock(itemName);
      let botReply = "";

      if (res.data.status === 'success') {
        const qty = Number(res.data.qty);
        if (qty > 0) {
          botReply = `Yes! We currently have **${qty}** of **${res.data.name}** in stock. Head over to the Borrow page to request it!`;
        } else {
          botReply = `We do have **${res.data.name}** in our catalog, but it looks like we are currently out of stock (0 left).`;
        }
      } else {
        botReply = `I couldn't find anything matching "${itemName}" in the lab right now. Please check your spelling or browse the Components Library.`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Oops! I'm having trouble connecting to the database. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  }; // End of handleSend

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  return (
    <div className="chat-widget-container">
      {!isOpen && showTooltip && (
        <div className="chat-tooltip">
          Hi, how can I help? 👋
          <div className="tooltip-arrow"></div>
        </div>
      )}

      {!isOpen && (
        <button className="chat-fab" onClick={toggleChat}>
          <img src={botIcon} alt="Bot" className="fab-bot-icon" onError={(e) => { e.target.style.display='none'; }} />
          <MessageSquare size={24} className="fab-fallback-icon" />
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="bot-avatar-wrapper">
                <img src={botIcon} alt="Eve" className="bot-avatar-img" />
              </div>
              <div>
                <h3 className="bot-name">Eve</h3>
                <span className="bot-status"><span className="status-dot"></span> Online</span>
              </div>
            </div>
            <button className="close-chat-btn" onClick={toggleChat}><X size={20} /></button>
          </div>

          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
                {msg.sender === 'bot' && <img src={botIcon} alt="Eve" className="tiny-bot-avatar" />}
                <div className="chat-bubble">
                  <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble-wrapper bot">
                <img src={botIcon} alt="Eve" className="tiny-bot-avatar" />
                <div className="chat-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-footer" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask about components..." 
              value={input} 
              onChange={e => setInput(e.target.value)} 
            />
            <button type="submit" disabled={!input.trim()} className="send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}; // End of ChatWidget component

export default ChatWidget;