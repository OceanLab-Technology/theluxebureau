import React from "react";

interface InputProps {
  id: string;
  type: string;
  className: string;
  placeholder: string;
}

export default function Input({
  id,
  type,
  className,
  placeholder,
}: InputProps) {
  return (
    <input
      id={id}
      type={type}
      className={`${className} w-full border-0 border-b border-stone-500 bg-transparent px-0 py-3 text-stone-800 placeholder:text-stone-500 focus:border-stone-600 text-sm focus:ring-0 outline-none rounded-none`}
      placeholder={placeholder}
    />
  );
}
