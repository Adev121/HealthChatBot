import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    // Load old messages
    axios.get("http://localhost:5000/messages").then(res => {
      setMessages(res.data);
    });

    // Receive new messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (!username || !text) return;
    const message = { username, text };
    socket.emit("sendMessage", message);
    setText("");
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc" }}>
        {messages.map((msg, i) => (
          <p key={i}><b>{msg.username}:</b> {msg.text}</p>
        ))}
      </div>

      <input
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
