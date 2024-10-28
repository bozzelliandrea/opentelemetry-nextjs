"use client";

import { useEffect, useState } from "react";
import { getCall_NEXT } from "./api-client";
import { Faro, withFaroErrorBoundary } from "@grafana/faro-react";
import buildFaroInstrumentation from "@/observability/instrumentation.faro";

function Home() {
  const [data, setData] = useState("");
  let faro: Faro | undefined = undefined;

  useEffect(() => {
    if (!faro) {
      faro = buildFaroInstrumentation();
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <b>Fetch GET API</b>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              const json = await getCall_NEXT();
              console.log("Received json ", json);
              setData(JSON.stringify(json));
            } catch (error) {
              console.error("Failed to fetch configurations:", error);
            }
          }}
        >
          call_GET_API
        </button>
        <p>{data}</p>
      </main>
    </div>
  );
}

//export default withFaroProfiler(Home); disabled for better performance
export default withFaroErrorBoundary(Home, {});
