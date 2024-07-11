import React from "react";
import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="absolute translate-x-[-50%] left-[50%] top-[5%]">
      <SignUp />
    </div>
  );
};

export default page;
