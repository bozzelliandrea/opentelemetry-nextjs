import {
  Context,
  TextMapGetter,
  TextMapPropagator,
  TextMapSetter,
} from "@opentelemetry/api";

export const H_SENDER: string = "xsender";
export const H_INFO: string = "xinfo";

// example with a text map propagator to add http custom headers inside trace
export class CustomHeaderPropagator implements TextMapPropagator {
  private readonly sender: string;

  constructor(sender: string) {
    this.sender = sender;
  }

  inject(context: Context, carrier: any, setter: TextMapSetter<any>): void {
    setter.set(carrier, H_SENDER, this.sender);
  }

  extract(context: Context, carrier: any, getter: TextMapGetter<any>): Context {
    return context;
  }

  fields(): string[] {
    return [H_SENDER, H_INFO];
  }
}
