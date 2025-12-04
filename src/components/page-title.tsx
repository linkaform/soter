"use client";
import React from 'react';

interface PageTitleProps {
  title: string; 
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default PageTitle;