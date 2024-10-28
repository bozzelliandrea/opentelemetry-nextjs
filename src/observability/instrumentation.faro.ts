import {
  ErrorsInstrumentation,
  getWebInstrumentations,
  initializeFaro,
  WebVitalsInstrumentation,
  type Faro,
} from "@grafana/faro-react";
import { W3CTraceContextPropagator } from "@opentelemetry/core";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";

export default function buildFaroInstrumentation(): Faro {
  const faroCollectorUrl: string = "http://localhost:12347/collect";

  const faro = initializeFaro({
    url: faroCollectorUrl,
    app: {
      name: "opentelemetry-nextjs-frontend",
    },
    batching: {
      enabled: false,
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: true,
      }),

      new ErrorsInstrumentation(),
      new WebVitalsInstrumentation(),
      new TracingInstrumentation({
        propagator: new W3CTraceContextPropagator(),
        instrumentations: [
          new DocumentLoadInstrumentation(),
          new FetchInstrumentation({
            ignoreUrls: [faroCollectorUrl], // ignore collector to avoid fetch loop
            propagateTraceHeaderCorsUrls: "http://localhost:9091/*",
          }),
          new UserInteractionInstrumentation(),
        ],
      }),
    ],
  });
  console.log("Faro OpenTelemetry instrumentation started successfully.");
  return faro;
}
