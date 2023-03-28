from opentelemetry import trace
from opentelemetry.exporter.cloud_trace import CloudTraceSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.trace import Link, Tracer


def get_tracer(instrumenting_module_name: str) -> Tracer:
    tracer_provider = TracerProvider()
    cloud_trace_exporter = CloudTraceSpanExporter()
    tracer_provider.add_span_processor(BatchSpanProcessor(cloud_trace_exporter))
    trace.set_tracer_provider(tracer_provider)

    return trace.get_tracer(instrumenting_module_name)