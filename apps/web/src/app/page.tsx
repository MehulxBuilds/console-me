"use client";

import { Button } from "@repo/ui";
import { useState } from "react";
import { test } from "@/lib/db-test";

export default function Home() {
  const [res, setRes] = useState<any>("");
  const handlePushTOdb = async () => {
    const res = await test();

    setRes(res);
  }

  console.log(res);

  return (
    <div>
      <Button onClick={handlePushTOdb}>
        Hello
      </Button>
    </div>
  );
};