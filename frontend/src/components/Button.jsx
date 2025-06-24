import React from "react";

export default function Button(props) {
  return (
    <div>
      <button className=" px-6 py-1 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-all rounded-full">
        {props.title}
      </button>
    </div>
  );
}
