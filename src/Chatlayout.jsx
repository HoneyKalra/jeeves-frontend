import React from "react";
import Sidebar from "./SideNav";
import AskJeeves from "./AskJeeves";
import { useApp } from "../context/Appcontext";

export default function ChatLayout() {
  const { optedIn, setOptedIn, isLogin, setIsLogin } = useApp();
  return (
    <div className="flex    ">
      {/* Sidebar */}

      <div className="z-40 ">{optedIn && <Sidebar />}</div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col  ">
        <AskJeeves />
      </div>

      {/* <ModalForm/> */}
    </div>
  );
}
