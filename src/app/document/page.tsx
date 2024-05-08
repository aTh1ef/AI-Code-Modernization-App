// pages/index.tsx

"use client"
import { SetStateAction, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Doc() {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([{ user: 'bot', message: "Hi! Paste some code and I'll help you create documentation." }]);

  const genAI = new GoogleGenerativeAI("AIzaSyBAX_z9O3M8LBZHLYU5jE6X62axupBbx_4"); // Replace YOUR_API_KEY with your actual API key

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setChatInput(e.target.value);
  };

  const handleChatSubmission = async () => {
    if (!chatInput.trim()) return;

    setChatMessages([...chatMessages, { user: 'user', message: chatInput }]);
    setChatInput('');

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const requestOptions = {
      maxOutputTokens: 100,
      temperature: 0.7,
      topP: 1,
      topK: 50,
    };

    const incomingMessage = { user: 'bot', message: 'Thinking...' };
    setChatMessages([...chatMessages, incomingMessage]);

    try {
      const result = await model.generateContent(chatInput);
      const response = await result.response;
      const botResponse = { user: 'bot', message: 'Your documentation is: ' + response.text() };
      setChatMessages([...chatMessages.filter(msg => msg !== incomingMessage), botResponse]);
    } catch (error) {
      const errorMessage = { user: 'bot', message: 'Oops! Something went wrong.' };
      setChatMessages([...chatMessages.filter(msg => msg !== incomingMessage), errorMessage]);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-900 text-white">
      <div className="flex space-x-8">
        <div className="w-96 bg-white rounded-lg shadow-lg">
          <header className="bg-purple-700 px-4 py-2">
            <h2 className="text-xl font-semibold text-white">Code Documentation Chatbot 1 (Input)</h2>
          </header>
          {/* <ul className="chatbox text-black">
            {chatMessages.map((msg, index) => (
              <li key={index} className={`chat ${msg.user === 'user' ? 'outgoing' : 'incoming'}`}>
                {msg.user === 'bot' && <span>🤖</span>}
                <p>{msg.message}</p>
              </li>
            ))}
          </ul> */}
          <div className="chat-input">
            <textarea
              className="w-full h-32 p-4 bg-gray-200 rounded-lg resize-none outline-none text-black"
              placeholder="Paste your code here and click send..."
              value={chatInput}
              onChange={handleInputChange}
              spellCheck="false"
            ></textarea>
            <button className="material-symbols-rounded bg-purple-700 text-white p-4 rounded-full hover:bg-purple-600 focus:outline-none focus:bg-purple-600" onClick={handleChatSubmission}>send</button>
          </div>
        </div>
        <div className="w-96 bg-white rounded-lg shadow-lg">
          <header className="bg-purple-700 px-4 py-2">
            <h2 className="text-xl font-semibold text-white">Code Documentation Chatbot 2 (Output)</h2>
          </header>
          <ul className="chatbox text-black">
            {chatMessages.map((msg, index) => (
              <li key={index} className={`chat ${msg.user === 'user' ? 'outgoing' : 'incoming'}`}>
                {msg.user === 'bot' && <span>🤖</span>}
                <p>{msg.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
