'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardComponent extends React.FC<CardProps> {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Title: typeof CardTitle;
}

const Card: CardComponent = ({ children, className = '' }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: CardProps) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }: CardProps) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }: CardProps) => (
  <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: CardProps) => (
  <h2 className={`text-lg font-bold text-gray-900 ${className}`}>
    {children}
  </h2>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;

export { Card, CardHeader, CardContent, CardFooter, CardTitle };
