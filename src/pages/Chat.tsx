import React, { useState } from "react";
import { Input, Button, List } from "antd";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { sender: "User", content: userMessage };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "Bot", content: data.reply }]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error.message);
    }

    setUserMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat with Lucy</h2>
      <List
        bordered
        dataSource={messages}
        renderItem={(message) => (
          <List.Item>
            <strong>{message.sender}: </strong>
            {message.content}
          </List.Item>
        )}
        style={{ marginBottom: "20px", maxHeight: "400px", overflowY: "auto" }}
      />
      <Input
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message"
        style={{ marginBottom: "10px" }}
      />
      <Button type="primary" onClick={handleSendMessage}>
        Send
      </Button>
    </div>
  );
};