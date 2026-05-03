import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, color: string }> = ({ icon, title, desc, color }) => (
  <div class={`bg-white p-6 rounded-3xl border-4 ${color} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300`}>
    <div class="mb-4">{icon}</div>
    <h3 class="text-xl font-bold mb-2 text-black">{title}</h3>
    <p class="text-gray-600 font-medium">{desc}</p>
  </div>
);

const Home: React.FC = () => {
  return (
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 max-w-6xl mx-auto">
      
      {/* Hero Section */}
      <div class="text-center max-w-3xl mb-16 mt-8">
        <div class="inline-block mb-4 px-4 py-1.5 rounded-full border-2 border-vote-orange bg-orange-100 text-vote-orange-dark font-bold text-sm animate-bounce">
          🚀 The Civic OS for Gen Z
        </div>
        <h2 class="text-5xl md:text-7xl font-extrabold text-black mb-6 leading-tight">
          Democracy, decoded. <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-vote-green to-vote-orange">
            No cap.
          </span>
        </h2>
        <p class="text-xl text-gray-600 mb-10 font-medium">
          Got questions about voting, EVMs, or what a manifesto actually means? 
          Meet CivicBot: your unbiased, jargon-free guide to the elections.
        </p>
        
        <Link 
          to="/chat" 
          class="inline-flex items-center gap-3 bg-vote-orange hover:bg-vote-orange-dark text-white text-xl font-bold py-4 px-10 rounded-full border-4 border-black btn-3d group"
        >
          Start Chatting
          <ArrowRight class="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

      {/* Features Grid */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <FeatureCard 
          icon={<div class="bg-green-100 p-3 rounded-2xl inline-block border-2 border-vote-green"><ShieldCheck size={32} class="text-vote-green" /></div>}
          title="Zero Agenda"
          desc="100% unbiased facts. We don't tell you who to vote for, just how the system works."
          color="border-vote-green"
        />
        <FeatureCard 
          icon={<div class="bg-orange-100 p-3 rounded-2xl inline-block border-2 border-vote-orange"><Zap size={32} class="text-vote-orange" /></div>}
          title="No Jargon"
          desc="Complex political terms broken down into plain English. Easy to understand."
          color="border-vote-orange"
        />
        <FeatureCard 
          icon={<div class="bg-blue-100 p-3 rounded-2xl inline-block border-2 border-blue-500"><Sparkles size={32} class="text-blue-500" /></div>}
          title="Instant Answers"
          desc="Ask anything from 'How do I register?' to 'Is this WhatsApp forward real?'"
          color="border-blue-500"
        />
      </div>

    </div>
  );
};

export default Home;
