import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface BookCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  allItem: object;
  recentViewHandle:any;
}

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  image,
  price,
  allItem,
  recentViewHandle
}) => {
  const navigate = useNavigate();

  const handleGotoProduct = (id: string) => {
      recentViewHandle(allItem); 
    navigate(`/product/${id}`);
  };

  return (
    <button  onClick={() => handleGotoProduct(id)} className="border p-4 rounded">
      <div>
        <img
          src={image}
          alt={title}
          className="w-full h-32 object-cover mb-2"
        />
        <h2 className="font-bold">{title}</h2>
        <p>${price}</p>
      </div>
    </button>
  );
};
