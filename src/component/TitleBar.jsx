import { convertToRaw } from "draft-js";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TitleBar = (props) => {
  const handleSave = () => {
    const contentState = props.text.getCurrentContent();
    localStorage.setItem("content", JSON.stringify(convertToRaw(contentState)));
    toast.success('Successfully Saved', {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    
  };

  return (
    <div className="flex justify-center items-center gap-5 p-10">
      <h1 className="ml-auto text-4xl font-bold">Text Editor</h1>
      <button
        className="ml-auto border-[2px] border-blue-700 text-2xl px-8 py-1 hover:bg-sky-700 hover:text-white hover:shadow-2xl cursor-pointer"
        onClick={handleSave}
      >
        Save
      </button>
      <ToastContainer/>
    </div>
  );
};

export default TitleBar;
