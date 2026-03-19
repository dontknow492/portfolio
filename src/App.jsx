import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Smartphone, Monitor, Cpu, Code2, Database, Layout, Layers, Terminal, ArrowRight, ExternalLink, Bot, Send, Loader2, Sparkles } from 'lucide-react';

// --- CONFIG & DATA ---
const COLORS = {
  base: '#050505',
  accentAndroid: '#38BDF8', // Electric Blue
  accentPython: '#818CF8',  // Soft Indigo
};

const PROJECTS = [
  {
    title: "Next: AI Image Organizer",
    tech: "Kotlin Multiplatform • ONNX",
    highlight: "Local AI inference.",
    description: "An intelligent gallery app that categorizes images locally on-device without compromising privacy. Built with KMP for cross-platform efficiency.",
    color: COLORS.accentAndroid,
    icon: <Cpu className="w-6 h-6" />,
    codeSnippet: `val model = OnnxInferenceModel.load(context)\nval predictions = model.predict(imageBitmap)\nval tags = predictions.filter { it.score > 0.8 }`,
    link: "https://github.com/dontknow492/Next"
  },
  {
    title: "Ollama-gui",
    tech: "Desktop & Android • Compose",
    highlight: "Privacy-focused AI.",
    description: "A seamless graphical interface for interacting with local LLMs via Ollama. Ensures your data never leaves your machine.",
    color: COLORS.accentPython,
    icon: <Terminal className="w-6 h-6" />,
    codeSnippet: `ViewModel {\n  val response = repository.generate(prompt)\n  _uiState.update { it.copy(text = response) }\n}`,
    link: "https://github.com/dontknow492/Ollama-gui"
  },
  {
    title: "ExpenseTracker",
    tech: "Android • Jetpack Compose",
    highlight: "Data Visualization & Offline-first.",
    description: "Modern personal finance management. Features interactive charts, offline-first Room database architecture, and deep UX polish.",
    color: '#10B981', // Emerald
    icon: <Database className="w-6 h-6" />,
    codeSnippet: `@Dao\ninterface TransactionDao {\n  @Query("SELECT * FROM tx")\n  fun getAll(): Flow<List<Tx>>\n}`,
    link: "https://github.com/dontknow492/ExpenseTracker"
  },
  {
    title: "Musify",
    tech: "Native Android • Compose",
    highlight: "Clean UI & Performance.",
    description: "A beautiful, performant local music player. Implements advanced Media3 APIs and dynamic color theming based on album art.",
    color: '#F43F5E', // Rose
    icon: <Layers className="w-6 h-6" />,
    codeSnippet: `exoPlayer.setMediaItem(mediaItem)\nexoPlayer.prepare()\nexoPlayer.play()`,
    link: "https://github.com/dontknow492/Musify"
  }
];

const SKILLS = [
  { category: "Primary", items: ["Android SDK", "Jetpack Compose", "Compose Multiplatform", "Kotlin", "Coil"], icon: <Smartphone className="w-5 h-5 text-[#38BDF8]" /> },
  { category: "Secondary", items: ["Python", "PySide6", "Pandas", "NumPy", "Matplotlib"], icon: <Monitor className="w-5 h-5 text-[#818CF8]" /> },
  { category: "Process", items: ["Functional Testing", "Regression Testing", "UI/UX Prototyping", "Clean Architecture"], icon: <Layout className="w-5 h-5 text-gray-400" /> }
];

// --- COMPONENTS ---

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('.interactive-card')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      // FIXED: Added "hidden md:block" so custom cursor doesn't hijack touch interactions on mobile
      className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-screen"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0)',
        border: isHovering ? '1px solid rgba(56, 189, 248, 0.5)' : '2px solid rgba(255, 255, 255, 0.3)',
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
};

const MagneticButton = ({ children, onClick, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    // Basic protection against touch events triggering mouse moves wildly
    if (window.innerWidth < 768) return; 
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={`relative px-8 py-4 rounded-full font-medium text-sm tracking-wide bg-white text-black hover:bg-gray-100 transition-colors overflow-hidden group ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- AI ASSISTANT COMPONENT ---

const AIAgent = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Manish's AI Agent. Ask me anything about his experience, projects, or tech stack!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const apiKey = ""; // API Key provided by the execution environment
    const systemPrompt = `You are a helpful, professional AI assistant embedded in Manish Bhatt's developer portfolio. 
    Manish is a 2025 BCA Graduate specializing in Android, Kotlin Multiplatform (KMP), and Python AI integration. 
    His projects include: 
    1. Next: AI Image Organizer (KMP, ONNX)
    2. Ollama-gui (Desktop/Android GUI for local LLMs)
    3. ExpenseTracker (Android, Jetpack Compose, Offline-first)
    4. Musify (Native Android, Media3). 
    His skills include Android SDK, Jetpack Compose, Kotlin, PySide6, Pandas. 
    Keep your answers concise, engaging, and highly positive about Manish's skills. Limit responses to 2-3 short sentences.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ parts: [{ text: userMsg }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    let responseText = "Sorry, I'm having trouble connecting to the network right now. Please try again later.";

    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        
        const data = await res.json();
        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I don't have an answer for that right now.";
        break; 
      } catch (err) {
        if (i < 4) {
          const delay = Math.pow(2, i) * 1000;
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden flex flex-col h-[500px] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#38BDF8] to-[#818CF8]" />
      
      <div className="p-6 border-b border-white/[0.05] flex items-center gap-4 bg-white/[0.01]">
        <div className="p-3 bg-[#38BDF8]/10 rounded-2xl border border-[#38BDF8]/20">
          <Bot className="w-6 h-6 text-[#38BDF8]" />
        </div>
        <div>
          <h4 className="text-xl font-medium flex items-center gap-2">
            ✨ AI Recruiter Assistant
          </h4>
          <p className="text-sm text-gray-400">Powered by Gemini API</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-white rounded-tr-sm' 
                : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 text-gray-400 text-sm">
               <Loader2 className="w-4 h-4 animate-spin text-[#38BDF8]" /> Thinking...
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/[0.05] bg-black/20">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center"
        >
          {/* FIXED: Changed text-sm to text-base md:text-sm to prevent auto-zoom on mobile keyboards */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g. What is Manish's experience with Compose?"
            disabled={isLoading}
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-base md:text-sm focus:outline-none focus:border-[#38BDF8]/50 focus:bg-white/10 transition-all text-white placeholder-gray-500 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-3 bg-[#38BDF8] text-black rounded-full hover:bg-[#38BDF8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#38BDF8]/30 selection:text-white overflow-hidden" style={{ colorScheme: 'dark' }}>
      <CustomCursor />
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#38BDF8] rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#818CF8] rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-24 space-y-32">
        
        <section className="relative min-h-[80vh] flex flex-col justify-center items-start pt-20">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full">
            <FadeIn delay={0.1}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-4">
                MANISH BHATT
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h2 className="text-xl md:text-3xl text-gray-400 font-light tracking-tight max-w-2xl mt-4 border-l-2 border-[#38BDF8] pl-6">
                Building Scalable, User-Centric Multiplatform Experiences.
              </h2>
            </FadeIn>
            <FadeIn delay={0.4} className="mt-12">
              <MagneticButton onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>
                Explore My Stack <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </FadeIn>

            <motion.div 
              className="absolute top-1/2 right-10 transform -translate-y-1/2 hidden lg:flex items-center justify-center w-80 h-80"
              animate={{ rotateY: 360, rotateX: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
            >
               <div className="absolute w-64 h-64 bg-gradient-to-tr from-[#38BDF8]/20 to-[#818CF8]/20 rounded-3xl border border-white/10 backdrop-blur-3xl flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.2)]">
                  <Code2 className="w-24 h-24 text-white/50" />
               </div>
               <div className="absolute w-48 h-48 bg-[#050505] rounded-full border border-white/5 flex items-center justify-center translate-z-12 shadow-2xl">
                  <Smartphone className="w-16 h-16 text-[#38BDF8]" />
               </div>
            </motion.div>
          </motion.div>
        </section>

        <section id="about" className="space-y-8">
          <FadeIn>
             <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">01. The Narrative</h3>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeIn delay={0.1} className="md:col-span-2">
              <div className="h-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl rounded-3xl p-8 md:p-12 hover:bg-white/[0.04] transition-colors duration-500">
                <Code2 className="w-8 h-8 text-[#38BDF8] mb-6" />
                <h4 className="text-2xl font-medium mb-4">Bridging UX and Architecture</h4>
                <p className="text-gray-400 leading-relaxed text-lg">
                  As a developer, my core philosophy is rooted in <strong>Clean Architecture</strong> and <strong>UX focus</strong>. I bridge the gap between high-level mobile UI using Jetpack Compose and deep backend logic with Python and AI integrations. Building apps isn't just about code; it's about crafting experiences that feel native, fluid, and powerful.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="h-full bg-gradient-to-br from-[#38BDF8]/10 to-transparent border border-[#38BDF8]/20 backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between hover:border-[#38BDF8]/40 transition-colors duration-500">
                <div>
                  <h4 className="text-lg font-medium text-[#38BDF8] mb-1">Education</h4>
                  <p className="text-3xl font-bold mb-4">2025</p>
                  <p className="text-gray-300">BCA Graduate</p>
                  <p className="text-gray-500 text-sm">LSMPG Campus (SSJU)</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-gray-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Available for roles
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="projects" className="space-y-12">
           <FadeIn>
             <div className="flex justify-between items-end">
                <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">02. Selected Work</h3>
             </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS.map((project, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <motion.div 
                  // FIXED: Changed cursor-none to md:cursor-none so normal tapping works on mobile
                  className="interactive-card group relative h-[450px] bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden md:cursor-none"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${project.color} 0%, transparent 70%)` }}
                  />
                  
                  <div className="absolute inset-0 p-8 flex flex-col z-10">
                    <div className="flex justify-between items-start mb-auto">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white backdrop-blur-md">
                        {project.icon}
                      </div>
                      
                      {/* FIXED: Changed opacity so the button is always visible on mobile, fades in on desktop */}
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/20">
                         <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 font-mono text-sm whitespace-pre pointer-events-none">
                      {project.codeSnippet.repeat(5)}
                    </div>

                    <div className="mt-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-mono px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                          {project.tech}
                        </span>
                      </div>
                      <h4 className="text-3xl font-bold mb-2">{project.title}</h4>
                      <p className="text-gray-400 mb-2">{project.description}</p>
                      <p className="text-sm font-medium" style={{ color: project.color }}>
                        Highlight: {project.highlight}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="space-y-8">
           <FadeIn>
             <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">03. Technical Arsenal</h3>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SKILLS.map((skillGroup, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-8 h-full hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    {skillGroup.icon}
                    <h4 className="text-lg font-medium">{skillGroup.category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-default">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="space-y-8 pt-12">
           <FadeIn>
             <div className="flex items-center gap-3">
               <Sparkles className="w-5 h-5 text-[#818CF8]" />
               <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">04. Interactive Agent</h3>
             </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <AIAgent />
          </FadeIn>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.05] mt-32">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center justify-center space-y-8">
          <FadeIn delay={0.1}>
             <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-center mb-6">Let's build something exceptional.</h2>
          </FadeIn>
          
          <FadeIn delay={0.2} className="flex gap-6">
            {[
              { icon: <Github className="w-5 h-5" />, label: "GitHub", url: "https://github.com/dontknow492" },
              { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", url: "https://linkedin.com/in/YOUR_USERNAME" }, 
              { icon: <Mail className="w-5 h-5" />, label: "Email", url: "mailto:YOUR_EMAIL@example.com" } 
            ].map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-110 transition-all duration-300 text-gray-400 hover:text-white">
                {social.icon}
              </a>
            ))}
          </FadeIn>

          <FadeIn delay={0.3} className="text-gray-600 text-sm mt-12 flex items-center gap-2">
            Built with Kotlin & Coffee <span className="mx-2">|</span> © 2026 Manish Bhatt
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}
