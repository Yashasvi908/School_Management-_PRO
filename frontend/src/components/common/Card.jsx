import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`} {...props}>
            {children}
        </div>
    );
};

const Header = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-slate-100 ${className}`}>
        {children}
    </div>
);

const Content = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

const Footer = ({ children, className = '' }) => (
    <div className={`px-6 py-4 bg-slate-50 border-t border-slate-100 ${className}`}>
        {children}
    </div>
);

Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;

export default Card;
