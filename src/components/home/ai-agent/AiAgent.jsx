import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QA_KNOWLEDGE_BASE = [
    {
        keywords: ['salom', 'assalom', 'hayrli', 'qalay', 'yaxshimisiz'],
        answer: 'Assalomu alaykum! Urganch Davlat Pedagogika Instituti (UrSPI) sun\'iy intellekt yordamchisiga xush kelibsiz. Sizga qanday yordam bera olaman?'
    },
    {
        keywords: ['fakultet', 'yo\'nalish', 'qabul', 'o\'qishga', 'kirish', 'imtihon'],
        answer: 'Institutimizda qator pedagogik yo\'nalishlar va fakultetlar mavjud. Qabul jarayonlari, imtihonlar va yo\'nalishlar haqida batafsil ma\'lumotni saytimizning "Qabul" va "Ta\'lim" bo\'limlaridan olishingiz mumkin.',
        action: { url: '/', label: 'Bosh sahifaga o\'tish' }
    },
    {
        keywords: ['manzil', 'qayerda', 'lokatsiya', 'joylashuv'],
        answer: 'Urganch Davlat Pedagogika Instituti Xorazm viloyati, Urganch shahrida joylashgan.'
    },
    {
        keywords: ['rektor', 'rahbariyat', 'dekan'],
        answer: 'Institut rahbariyati (rektor, prorektorlar va dekanlar) haqida batafsil ma\'lumotni "Rahbariyat" sahifasidan topishingiz mumkin.',
        action: { url: '/rahbariyat', label: 'Rahbariyat sahifasiga o\'tish' }
    },
    {
        keywords: ['aloqa', 'telefon', 'bog\'lanish', 'raqam', 'email', 'pochtasi'],
        answer: 'Biz bilan bog\'lanish uchun saytning "Aloqa" bo\'limidagi telefon raqamlariga qo\'ng\'iroq qilishingiz yoki elektron pochta orqali xabar yuborishingiz mumkin.'
    },
    {
        keywords: ['yangiliklar', 'yangilik', ' ', 'elonlar'],
        answer: 'Institut hayotidagi so\'nggi yangiliklar va e\'lonlar bilan tanishish uchun "Yangiliklar" sahifasiga o\'tishingiz mumkin.',
        action: { url: '/news', label: 'Yangiliklar sahifasiga o\'tish' }
    },
    {
        keywords: ['sayt', 'yaratuvchi', 'qilgan', 'yaratgan'],
        answer: 'Ushbu sayt va sun\'iy intellekt moduli tajribali dasturchilar tomonidan ishlab chiqilgan.'
    }
];

export default function AiAgent() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Assalomu alaykum! \n\nMen Urganch davlat pedagogika instituti saytining sun'iy intellekt yordamchisiman. \n\nSizga qanday yordam bera olaman?", isBot: true }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = { id: Date.now(), text: inputValue, isBot: false };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate RAG / AI processing delay
        setTimeout(() => {
            let botResponse = "Kechirasiz, ma'lumotlar bazasidan bu savolga aniq javob topa olmadim. Iltimos, savolingizni aniqroq yozing yoki sayt menyularidan qidiring.";
            let botAction = null;

            const lowerInput = newUserMessage.text.toLowerCase();

            for (const qa of QA_KNOWLEDGE_BASE) {
                if (qa.keywords.some(kw => lowerInput.includes(kw))) {
                    botResponse = qa.answer;
                    if (qa.action) botAction = qa.action;
                    break;
                }
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, action: botAction, isBot: true }]);
            setIsTyping(false);
        }, 1200);
    };

    const RobotIcon = () => (
        <svg width="65" height="65" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            <defs>
                <linearGradient id="bodyGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="1" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="faceGrad" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1e293b" />
                    <stop offset="1" stopColor="#020617" />
                </linearGradient>
                <style>
                    {`
            @keyframes blink-eyes {
              0%, 92%, 98%, 100% { transform: scaleY(1); }
              95% { transform: scaleY(0.1); }
            }
            .eyes-animate {
              animation: blink-eyes 4s infinite;
              transform-origin: center;
              transform-box: fill-box;
            }
            @keyframes float-robot {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            .robot-float {
              animation: float-robot 3s ease-in-out infinite;
            }
          `}
                </style>
            </defs>

            <g className="robot-float">
                {/* Ears */}
                <rect x="5" y="35" width="20" height="30" rx="8" fill="#94a3b8" />
                <rect x="75" y="35" width="20" height="30" rx="8" fill="#94a3b8" />

                {/* Head */}
                <rect x="12" y="15" width="76" height="65" rx="32" fill="url(#bodyGrad)" filter="drop-shadow(0 8px 10px rgba(0,0,0,0.15))" />

                {/* Face */}
                <rect x="20" y="24" width="60" height="46" rx="20" fill="url(#faceGrad)" />

                <g className="eyes-animate">
                    <path d="M 32 42 Q 37 32 42 42" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.8))' }} />
                    <path d="M 58 42 Q 63 32 68 42" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.8))' }} />
                </g>

                <path d="M 45 55 Q 50 62 55 55" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 4px rgba(74,222,128,0.8))' }} />
            </g>
        </svg>
    );

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            <div
                className={`absolute bottom-24 right-0 transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="bg-white/95 backdrop-blur-xl w-[320px] sm:w-[380px] rounded-3xl shadow-2xl border border-gray-200/60 flex flex-col overflow-hidden h-[500px] max-h-[70vh]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 pb-5 flex justify-between items-center text-white shadow-sm relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-8 -mb-8 blur-lg"></div>

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/20 shadow-inner">
                                <RobotIcon />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[15px] tracking-wide">UrSPI AI Agent</h3>
                                <p className="text-[11px] text-blue-100 flex items-center gap-1.5 opacity-90 mt-0.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Onlayn yordamchi
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors relative z-10 active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 scroll-smooth flex flex-col gap-5">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 max-w-[88%] ${msg.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${msg.isBot
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                                    : 'bg-white text-blue-600 border border-gray-100'
                                    }`}>
                                    {msg.isBot ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div
                                    className={`p-3.5 rounded-2xl text-[14px] shadow-sm leading-relaxed whitespace-pre-wrap flex flex-col gap-2 ${msg.isBot
                                        ? 'bg-white text-gray-700 rounded-tl-sm border border-gray-100 shadow-sm'
                                        : 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                                        }`}
                                    style={{ wordBreak: 'break-word' }}
                                >
                                    <span>{msg.text}</span>
                                    {msg.action && (
                                        <button
                                            onClick={() => {
                                                navigate(msg.action.url);
                                                setIsOpen(false);
                                            }}
                                            className="mt-1 bg-blue-50 hover:bg-blue-100 text-blue-600 active:scale-95 text-[13px] font-semibold py-2 px-4 rounded-xl w-fit transition-all duration-200 border border-blue-200 shadow-sm"
                                        >
                                            {msg.action.label}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3 max-w-[85%] self-start animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white text-gray-800 p-3.5 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex items-center gap-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 shrink-0">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Savolingizni yozing..."
                            className="flex-1 bg-slate-100/80 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 text-[14px] rounded-full px-5 py-3 outline-none transition-all duration-200 placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-blue-300 disabled:active:scale-100 disabled:cursor-not-allowed text-white w-11 h-11 flex items-center justify-center rounded-full shadow-lg shadow-blue-500/30 transition-all duration-200 shrink-0"
                        >
                            <Send size={18} className="ml-1" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-20 h-20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 relative focus:outline-none rounded-full ${!isOpen ? 'bg-blue-100/50 backdrop-blur-sm border border-white/50 shadow-[0_8px_32px_rgba(37,99,235,0.2)]' : ''
                    }`}
            >
                {isOpen ? (
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg text-white">
                        <X size={28} />
                    </div>
                ) : (
                    <RobotIcon />
                )}
            </button>
        </div>
    );
}
