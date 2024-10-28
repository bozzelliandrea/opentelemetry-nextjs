import { logger } from "../logger";

export async function register() {
    logger.info("Runtime + " + process.env.NEXT_RUNTIME)
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("./observability/instrumentation.node");
    } else {
        logger.error("Instrumentation not supported on current runtime")
    }
}
