
import React from 'react';

interface FloatingChatButtonProps {
    onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 end-6 bg-primary hover:bg-primary-600 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75 transition-transform transform hover:scale-110"
            aria-label="Open AI Assistant"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.897 5.515 4.599 6.906C6.793 17.05 7 17.389 7 17.781V20c0 .552.447 1 1 1h.5a1 1 0 00.748-.333l1.196-1.495c.31-.387.756-.632 1.24-.711C11.758 18.423 11.878 18.4 12 18.4c5.514 0 10-3.589 10-8.4S17.514 2 12 2zm4 9h-3v3H9v-3H6V9h3V6h2v3h3v2z"/>
            </svg>
        </button>
    );
};

export default FloatingChatButton;
