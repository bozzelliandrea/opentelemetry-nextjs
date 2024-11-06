import { NodeSDK, logs } from "@opentelemetry/sdk-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import {
  CompositePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { CustomHeaderPropagator } from "./custom/CustomHeaderPropagator";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const OTEL_COLLECTOR_URL = "http://localhost:4318";
const OTEL_SERVICE_NAME = "opentelemetry-nextjs-backend";

export async function wrapper() {
  console.log("Function Called!");

  return "Bearer <your token>";
}

if (!OTEL_COLLECTOR_URL) {
  console.warn(
    "OTEL_COLLECTOR_URL not set. Skipping OpenTelemetry instrumentation."
  );
} else {
  console.log(typeof wrapper);
  console.log("Is Func: ", wrapper instanceof Function);
  try {
    const sdk = new NodeSDK({
      serviceName: OTEL_SERVICE_NAME,
      traceExporter: new OTLPTraceExporter({
        url: `${OTEL_COLLECTOR_URL}/v1/traces`,
        compression: CompressionAlgorithm.GZIP,
        headers: {
          Authorization: wrapper,
        },
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: `${OTEL_COLLECTOR_URL}/v1/metrics`,
          compression: CompressionAlgorithm.GZIP,
          headers: {
            Authorization: wrapper,
          },
        }),
      }),
      logRecordProcessors: [
        new logs.SimpleLogRecordProcessor(
          new OTLPLogExporter({
            url: `${OTEL_COLLECTOR_URL}/v1/logs`,
            compression: CompressionAlgorithm.GZIP,
            headers: {
              Authorization: wrapper,
            },
          })
        ),
      ],
      textMapPropagator: new CompositePropagator({
        propagators: [
          new CustomHeaderPropagator("next-webapp"),
          new W3CTraceContextPropagator(),
        ],
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          // disable `instrumentation-fs` prevent trace bloating
          "@opentelemetry/instrumentation-fs": {
            enabled: false,
          },
        }),
      ],
    });

    sdk.start();
    console.log("OpenTelemetry instrumentation started successfully.");
  } catch (error) {
    console.error("Error starting OpenTelemetry instrumentation:", error);
  }
}
