import React from "react";

type RecipeCardProps = {
  title: string;
  author: string;
  cookTime: string;
  imageUrl: string;
};

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  author,
  cookTime,
  imageUrl,
}) => {
  return (
    <div className="rounded-md overflow-hidden border bg-white shadow hover:shadow-md transition">
      <div className="aspect-square w-full bg-gray-100">
        <img
          src={imageUrl}
          alt={`Recette: ${title}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="px-4 pt-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="flex items-center justify-between px-4 pb-3 pt-1 text-sm text-gray-600">
        <span>⏱ {cookTime}</span>
        <span>👨‍🍳 {author}</span>
      </div>
    </div>
  );
};

export default RecipeCard;
