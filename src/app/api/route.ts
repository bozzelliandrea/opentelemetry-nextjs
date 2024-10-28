import { NextResponse } from "next/server";
import { logger } from "../../../logger";
//import type { NextRequest } from "next/server";

export async function GET() {
  logger.info("GET /api/ - Started call");

  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random", {
      method: "GET",
    });

    logger.info("GET /api/ - Fetch completed with status " + response.status);

    const body = await response.json();

    logger.info("GET /api/ - Response ready, Finished call");

    return NextResponse.json(body);
  } catch (error) {
    logger.error("Call Failed " + error);
  }

  return NextResponse.json({ status: "Error" });
}
