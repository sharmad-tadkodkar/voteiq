import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Vote, MessageSquare } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header class="w-full p-4 md:p-6 flex justify-between items-center border-b-4 border-vote-green bg-white sticky top-0 z-10">
      <Link to="/" class="flex items-center gap-2 group">
        <div class="bg-vote-orange p-2 rounded-xl transform group-hover:rotate-12 transition-transform duration-300 border-2 border-black">
          <Vote size={28} class="text-white" />
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-black">
          Vote<span class="text-vote-green">IQ</span>
        </h1>
      </Link>

      <nav>
        {location.pathname !== '/chat' ? (
          <Link 
            to="/chat" 
            class="flex items-center gap-2 bg-vote-green hover:bg-vote-green-dark text-white px-5 py-2.5 rounded-full font-bold border-2 border-black btn-3d"
          >
            <MessageSquare size={20} />
            <span class="hidden sm:inline">Ask CivicBot</span>
          </Link>
        ) : (
          <Link 
            to="/" 
            class="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-5 py-2.5 rounded-full font-bold border-2 border-black btn-3d"
          >
            <span>Home</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
