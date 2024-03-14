"use client";
import React from "react";
import useTaskCreator from "./hooks/useTaskCreator";
import GoogleDocsIcon from "@/app/assets/icons/google-docs.png";
import GoogleSpreadSheetIcon from "@/app/assets/icons/sheets.png";
import Image from "next/image";
import CreateMethod from "./components/CreateMethod";

interface TaskCreatorProps {}

const TaskCreator = ({}: TaskCreatorProps) => {
  const { showModal } = useTaskCreator();

  if (!showModal) return <></>;
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 2000,
      }}
    >
      <div
        className="top-[20%] left-[50%] absolute bg-gray-800 p-10 text-base rounded-2xl w-[50%] flex flex-col gap-4"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1 className="font-bold text-2xl text-gray-100 tracking-tight">
          Task 생성
        </h1>

        <CreateMethod
          icon={GoogleDocsIcon}
          title={"Google Docs - 체크박스로 만들기"}
          description={"구글 문서에서 복사 후, 블록에 붙여넣기를 해주세요."}
        />

        <CreateMethod
          icon={GoogleSpreadSheetIcon}
          title={"Google Spreadsheet로 만들기"}
          description={"구글 문서에서 복사 후, 블록에 붙여넣기를 해주세요."}
        />
      </div>
    </div>
  );
};

export default TaskCreator;
