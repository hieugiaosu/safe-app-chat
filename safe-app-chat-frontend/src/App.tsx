import React from "react";
import { Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat/ChatPage";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import TestRealTimeDB from "./pages/TestRealTimeDB";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<LandingPage />} />

      {/* Chat route */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/signin" element={<SignInPage />} />
        {/* Test Realtime DB route */}
      <Route path="/testRealTimeDB" element={<TestRealTimeDB />} />
    </Routes>
    
  );
};

export default App;
