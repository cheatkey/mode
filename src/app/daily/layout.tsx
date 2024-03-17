import React from "react";
import TaskCreator from "../components/task/TaskCreator";
interface DailyLayoutProps {
  children: React.ReactNode;
}

const DailyLayout = ({ children }: DailyLayoutProps) => {
  return (
    <div>
      <TaskCreator />
      {children}
    </div>
  );
};

export default DailyLayout;
