import React from "react";
import Image, { StaticImageData } from "next/image";

interface CreateMethodProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: StaticImageData;
  title: string;
  description: string;
}

const CreateMethod = ({
  icon,
  title,
  description,
  ...props
}: CreateMethodProps) => {
  return (
    <div
      className="flex bg-gray-900 p-4 rounded-xl flex-col gap-4 hover:bg-gray-950 transition-colors cursor-pointer"
      {...props}
    >
      <div className="flex flex-row items-center gap-6 pl-2">
        <Image src={icon} height={40} alt="google docs icon" />
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">{title}</h1>
          <span className="text-gray-200 font-medium text-base">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateMethod;
