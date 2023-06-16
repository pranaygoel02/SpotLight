import React from "react";

function Card({ photo, name, title, comment }) {
  return (
    <div className="flex flex-col w-full gap-4 items-start justify-center p-6 group text-black border-r border-neutral-200">
      <p className="text-neutral-500 text-sm">
        "{comment}"
      </p>
      <div className="flex items-center gap-4">
        <img alt="photo" className="w-12 rounded-full object-cover" src={photo} />
        <div>
          <h3 className="font-base font-medium">{name}</h3>
          <p className="text-neutral-500">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
