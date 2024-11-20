import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, set, onValue } from "firebase/database";

const TestRealTimeDB: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [receivedText, setReceivedText] = useState<string>("");

  const handleSendText = async () => {
    try {
      const textRef = ref(db, "test"); // Specify the path in the database
      await set(textRef, inputText); // Write the input text to Firebase
      setInputText(""); // Clear the input field
    } catch (error) {
      console.error("Error writing to database:", error);
    }
  };

  useEffect(() => {
    const textRef = ref(db, "test"); // Path in the Realtime Database
    // Listen for changes in the database
    onValue(textRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setReceivedText(data); // Update the received text
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test Realtime Database</h2>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text"
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={handleSendText} style={{ padding: "5px 10px" }}>
        Send
      </button>
      <div style={{ marginTop: "20px" }}>
        <h4>Received Text:</h4>
        <p>{receivedText}</p>
      </div>
    </div>
  );
};

export default TestRealTimeDB;