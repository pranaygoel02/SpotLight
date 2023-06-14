import React from "react";

function Avatar({ name, size }) {
  return (
    <div className={`font-bold p-4 rounded-full flex aspect-square text-center items-center justify-center bg-gradient-to-br from-accent to-primary text-white ${size}`}>
      <p>{name?.charAt(0)}</p>
    </div>
  );
}

export default Avatar;
