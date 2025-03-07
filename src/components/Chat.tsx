
import React from "react";
import { CourseInfo } from "@/types/types";
import ChatContainer from "./chat/ChatContainer";

interface ChatProps {
  studyOption: string;
  courseInfo: CourseInfo;
}

const Chat: React.FC<ChatProps> = ({ studyOption, courseInfo }) => {
  return <ChatContainer studyOption={studyOption} courseInfo={courseInfo} />;
};

export default Chat;
