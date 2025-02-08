import React from "react";

type CardProps = {
  text: string;
};

export default function Card({ text }: CardProps) {
  return (
    <div className="bg-blue-500 text-white p-3 rounded shadow-md">
      {text}
    </div>
  );
}
