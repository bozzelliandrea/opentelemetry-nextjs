import { NodeSDK, logs } from "@opentelemetry/sdk-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { W3CTraceContextPropagator } from "@opentelemetry/core";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const OTEL_COLLECTOR_URL = "http://localhost:4317";
const OTEL_SERVICE_NAME = "opentelemetry-nextjs-backend";

if (!OTEL_COLLECTOR_URL) {
  console.warn(
    "OTEL_COLLECTOR_URL not set. Skipping OpenTelemetry instrumentation."
  );
} else {
  try {
    const sdk = new NodeSDK({
      serviceName: OTEL_SERVICE_NAME,
      traceExporter: new OTLPTraceExporter({
        url: `${OTEL_COLLECTOR_URL}`,
        compression: CompressionAlgorithm.GZIP,
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: `${OTEL_COLLECTOR_URL}`,
          compression: CompressionAlgorithm.GZIP,
        }),
      }),
      logRecordProcessors: [
        new logs.SimpleLogRecordProcessor(
          new OTLPLogExporter({
            url: `${OTEL_COLLECTOR_URL}`,
            compression: CompressionAlgorithm.GZIP,
          })
        ),
      ],
      textMapPropagator: new W3CTraceContextPropagator(),
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
