import React from "react";
import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat/ChatPage";
const App: React.FC = () => {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<LandingPage />} />

      {/* Chat route */}
      <Route path="/chat" element={<Chat />} />
    </Routes>
    
  );
};

export default App;
