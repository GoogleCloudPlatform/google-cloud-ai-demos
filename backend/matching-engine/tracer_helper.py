from opentelemetry import trace
from opentelemetry.exporter.cloud_trace import CloudTraceSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.trace import Tracer


class SingletonTracerProvider:
    _instance = None

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls._create_tracer_provider()
        return cls._instance

    @staticmethod
    def _create_tracer_provider():
        tracer_provider = TracerProvider()
        cloud_trace_exporter = CloudTraceSpanExporter()
        tracer_provider.add_span_processor(BatchSpanProcessor(cloud_trace_exporter))
        trace.set_tracer_provider(tracer_provider)
        return tracer_provider


def get_tracer(instrumenting_module_name: str) -> Tracer:
    return trace.get_tracer(
        instrumenting_module_name, tracer_provider=SingletonTracerProvider.instance()
    )
