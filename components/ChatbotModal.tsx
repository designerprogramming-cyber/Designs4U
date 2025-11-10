
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import { ChatMessage } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

interface ChatbotModalProps {
    onClose: () => void;
}

const fileToDataUrl = (file: File): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ data: (reader.result as string).split(',')[1], mimeType: file.type });
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const ChatbotModal: React.FC<ChatbotModalProps> = ({ onClose }) => {
    const { t } = useApp();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'system', text: t('chatbotWelcome') }
    ]);
    const [inputText, setInputText] = useState('');
    const [inputImage, setInputImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setInputImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() && !inputImage) return;

        const userMessage: ChatMessage = { role: 'user', text: inputText, imageUrl: imagePreview || undefined };
        setMessages(prev => [...prev, userMessage, { role: 'bot', isLoading: true }]);
        
        setInputText('');
        setInputImage(null);
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const parts: ({ text: string } | { inlineData: { data: string; mimeType: string; } })[] = [];

            if (inputImage) {
                const { data, mimeType } = await fileToDataUrl(inputImage);
                parts.push({
                    inlineData: { data, mimeType },
                });
            }
            parts.push({ text: inputText || 'Please describe the image.' });

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            const responsePart = response.candidates?.[0]?.content?.parts?.[0];
            if (responsePart?.inlineData) {
                const base64ImageBytes = responsePart.inlineData.data;
                const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                const botMessage: ChatMessage = { role: 'bot', imageUrl };
                setMessages(prev => [...prev.slice(0, -1), botMessage]);
            } else {
                 throw new Error("No image data in response");
            }

        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: ChatMessage = { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const ChatBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
        const isUser = msg.role === 'user';
        const isSystem = msg.role === 'system';

        if (isSystem) {
            return (
                <div className="text-center my-4">
                    <p className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full py-1 px-4 inline-block">{msg.text}</p>
                </div>
            );
        }

        if(msg.isLoading) {
             return (
                <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-sm">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                           <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                           <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                           <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`${isUser ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'} rounded-lg p-3 max-w-sm`}>
                    {msg.imageUrl && <img src={msg.imageUrl} alt="chat content" className="rounded-md mb-2 max-h-60" />}
                    {msg.text && <p>{msg.text}</p>}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col transform transition-all" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-bold">{t('chatbotTitle')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
                </header>
                <main className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => <ChatBubble key={index} msg={msg} />)}
                    <div ref={messagesEndRef} />
                </main>
                <footer className="p-4 border-t dark:border-gray-700">
                    {imagePreview && (
                        <div className="relative mb-2 w-20">
                            <img src={imagePreview} alt="preview" className="rounded-md h-20 w-20 object-cover" />
                            <button onClick={() => { setInputImage(null); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">&times;</button>
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                        </button>
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder={t('chatbotInputPlaceholder')}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-primary text-white rounded-full p-2 disabled:opacity-50" disabled={isLoading || (!inputText.trim() && !inputImage)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default ChatbotModal;
