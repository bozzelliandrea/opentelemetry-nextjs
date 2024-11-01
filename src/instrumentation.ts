export async function register() {
  console.log("Runtime + " + process.env.NEXT_RUNTIME);
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./observability/instrumentation.node");
  } else {
    console.error("Instrumentation not supported on current runtime");
  }
}
