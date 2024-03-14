"use client";
import { trpc } from "@/server/trpc";
import React, { useState } from "react";
import { useAsyncFn, useDebounce, useMount } from "react-use";

interface TaskSelectorProps {}

const TaskSelector = ({}: TaskSelectorProps) => {
  const [inputValue, setInputValue] = useState("");

  const [serverEvents, doFetch] = useAsyncFn(async () => {
    const data = await trpc.task.searchTasks.query({
      query: inputValue,
    });
    return data;
  }, [inputValue]);

  const [, cancel] = useDebounce(
    () => {
      doFetch();
    },
    500,
    [inputValue]
  );

  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        className="border border-gray-300 p-2 w-full text-black"
        placeholder="Start typing..."
      />
      <div className="absolute z-10 top-10 left-0 right-0 mt-1 border border-gray-300">
        {serverEvents.value?.map((suggestion, index) => (
          <div
            key={index}
            // onClick={onClick}
            className="cursor-pointer p-2 hover:bg-gray-100"
          >
            {suggestion.title}
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskSelector;
