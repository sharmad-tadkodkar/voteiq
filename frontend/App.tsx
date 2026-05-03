import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Chat from './components/Chat';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div class="min-h-screen flex flex-col">
        <Header />
        <main class="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
