"use client";
import { trpc } from "@/server/trpc";
import React, { use } from "react";

interface MyButtonProps {}

const MyButton = ({}: MyButtonProps) => {
  const data = use(trpc.getUsers.query());

  return (
    <button
      onClick={async () => {
        const d = await trpc.addUsers.mutate({
          name: "shin",
        });
        alert(d);
      }}
    >
      {JSON.stringify(data, null, 4)}
    </button>
  );
};

export default MyButton;
