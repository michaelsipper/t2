// components/ui/input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      {...props}
    />
  );
};
