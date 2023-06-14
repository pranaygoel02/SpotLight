import React from "react";

function Avatar({ name, size }) {
  return (
    <div className={`font-bold p-4 rounded-full flex aspect-square text-center items-center justify-center bg-gradient-to-br from-yellow-400 to-accent text-gray-800 ${size}`}>
      <p>{name?.charAt(0)}</p>
    </div>
  );
}

export default Avatar;
