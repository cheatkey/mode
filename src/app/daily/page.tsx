import React from "react";
import TimeBlocking from "./components/TimeBlocking";
interface DailyPageProps {}

const DailyPage = ({}: DailyPageProps) => {
  return (
    <div className="bg-gray-900 w-full min-h-screen">
      <main className="w-[1280px] p-10 flex flex-col gap-4">
        <p>DailyPage</p>

        <div className="bg-gray-950 w-full p-8 pl-5 rounded-2xl">
          <div className="text-gray-200 font-semibold text-2xl">
            2024/03/12 (화)
          </div>
        </div>

        <TimeBlocking />
      </main>
    </div>
  );
};

export default DailyPage;
