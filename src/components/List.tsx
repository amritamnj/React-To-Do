import React from "react";
import Card from "./Card";

type ListProps = {
  title: string;
  cards: string[];
};

export default function List({ title, cards }: ListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-64">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <div className="space-y-2">
        {cards.map((card, index) => (
          <Card key={index} text={card} />
        ))}
      </div>
    </div>
  );
}
