import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import "./Chatbot.css";
import { CiMicrophoneOn } from "react-icons/ci";
//import sendIcon from "./icon.png"; // Using your uploaded send icon
import { IoIosSend } from "react-icons/io";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("(Results will appear here)");
  const [showDownload, setShowDownload] = useState(false);
  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() === "") {
      setOutput("Error: Input cannot be empty.");
      return;
    }

    setOutput("Generating...");
    setShowDownload(false);
    //setUserInput("");

    try {
      const response = await fetch("https://kchatbot.onrender.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gemini-pro", contents: userInput }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const cleanChunk = chunk.replace(/^data: /, "").trim();

        if (cleanChunk) {
          try {
            const data = JSON.parse(cleanChunk);
            result += data.text + "\n";
            setOutput(result);
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          } catch (error) {
            console.error("Error parsing JSON", error);
          }
        }
      }

      setShowDownload(true);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    setUserInput("");
  };

  const handleDownload = () => {
    const pdf = new jsPDF();
    const margin = 10;
    const maxWidth = 180;
    const lineHeight = 7;
    const textLines = pdf.splitTextToSize(output, maxWidth);

    let y = 10;
    pdf.setFontSize(12);
    pdf.text("Recipe Chatbot - Result:", margin, y);
    y += 10;

    textLines.forEach((line) => {
      if (y + lineHeight > 280) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });

    pdf.save("chatbot_result.pdf");
  };

  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setUserInput("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
    };

    recognition.start();
  };

  return (
    <main className="chatbot-container">
      <div className="prompt-box">
        <h1>Recipe Chatbot</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter your instructions"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="button" className="mic-btn" onClick={startVoiceInput}>
              <CiMicrophoneOn />
            </button>
            <button type="submit" className="send-btn">
            <IoIosSend />
            </button>
          </div>
        </form>

        <div className="output" ref={chatContainerRef}>
          {output.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {showDownload && (
          <button className="download-btn" onClick={handleDownload}>
            Download PDF
          </button>
        )}
      </div>
    </main>
  );
};

export default Chatbot;
