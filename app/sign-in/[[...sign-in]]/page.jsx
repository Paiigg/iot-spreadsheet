import React from "react";

import { SignedOut, SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="absolute translate-x-[-50%] left-[50%] top-[15%]">
      <SignIn />
    </div>
  );
}
