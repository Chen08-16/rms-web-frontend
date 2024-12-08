import React, { useState, useContext, useEffect } from "react";
import { Input, Button, List, message, theme } from "antd";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ColorModeContext } from "../contexts/color-mode";

const genAI = new GoogleGenerativeAI("AIzaSyB01r8rP_oqc4oW5EjngH9578G7ytHT3LA");

interface ChatMessage {
  sender: "User" | "Bot";
  content: string;
  timestamp?: number;
}

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get theme token and color mode
  const { token } = theme.useToken();
  const { mode } = useContext(ColorModeContext);
  
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage: ChatMessage = { 
      sender: "User", 
      content: userMessage,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.9,
          topP: 0.1,
          topK: 16,
        },
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      
      setMessages((prev) => [...prev, { 
        sender: "Bot", 
        content: response.text(),
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      message.error("Error communicating with chatbot. Please try again.");
    } finally {
      setIsLoading(false);
      setUserMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    message.success('Chat history cleared');
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "800px", 
      margin: "0 auto",
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadius,
      boxShadow: token.boxShadow
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: "20px"
      }}>
        <h2 style={{ 
          color: token.colorPrimary,
          margin: 0
        }}>
          Chat with BistroBuddy
        </h2>
        {messages.length > 0 && (
          <Button 
            danger
            onClick={handleClearChat}
            size="small"
          >
            Clear Chat
          </Button>
        )}
      </div>
      
      <List
        bordered
        dataSource={messages}
        renderItem={(message) => (
          <List.Item
            style={{
              backgroundColor: message.sender === "Bot" 
                ? token.colorBgTextHover 
                : token.colorBgContainer,
              padding: "12px",
              borderRadius: token.borderRadiusLG,
              marginBottom: "8px",
              border: `1px solid ${token.colorBorder}`
            }}
          >
            <div style={{ width: "100%" }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <strong style={{ 
                  color: message.sender === "Bot" 
                    ? token.colorPrimary 
                    : token.colorSuccess
                }}>
                  {message.sender}
                </strong>
                {message.timestamp && (
                  <span style={{ 
                    fontSize: '12px',
                    color: token.colorTextSecondary
                  }}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div style={{ 
                whiteSpace: "pre-wrap",
                color: token.colorText
              }}>
                {message.content}
              </div>
            </div>
          </List.Item>
        )}
        style={{
          marginBottom: "20px",
          height: "500px",
          overflowY: "auto",
          backgroundColor: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          padding: "10px",
          border: `1px solid ${token.colorBorder}`
        }}
      />

      <div style={{ 
        display: "flex", 
        gap: "10px",
        marginTop: "20px" 
      }}>
        <Input
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          style={{ 
            borderRadius: token.borderRadius,
            fontSize: token.fontSize,
            backgroundColor: token.colorBgContainer,
            borderColor: token.colorBorder
          }}
        />
        <Button
          type="primary"
          onClick={handleSendMessage}
          loading={isLoading}
          disabled={!userMessage.trim()}
          style={{
            borderRadius: token.borderRadius,
            width: "100px"
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};