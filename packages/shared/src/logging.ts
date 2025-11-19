import winston from 'winston';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

// Custom logging and tracing service
class ObservabilityService {
  private static instance: ObservabilityService;
  private logger: winston.Logger | null = null;
  private sdk: NodeSDK | null = null;
  
  private constructor() {}

  public static getInstance(): ObservabilityService {
    if (!ObservabilityService.instance) {
      ObservabilityService.instance = new ObservabilityService();
    }
    return ObservabilityService.instance;
  }

  // Initialize logging
  initLogging(serviceName: string): void {
    if (this.logger) {
      return; // Already initialized
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: serviceName },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        // In production, you might want to add file transport
        ...(process.env.NODE_ENV === 'production' 
          ? [new winston.transports.File({ filename: 'error.log', level: 'error' })]
          : []),
      ],
    });
  }

  // Initialize distributed tracing
  async initTracing(serviceName: string): Promise<void> {
    if (this.sdk) {
      return; // Already initialized
    }

    // Determine the collector endpoint (default to local Jaeger)
    const collectorEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';
    
    this.sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({
        url: `${collectorEndpoint}/v1/traces`,
      }),
      instrumentations: [
        getNodeAutoInstrumentations(),
        new ExpressInstrumentation(),
        new HttpInstrumentation(),
      ],
      serviceName: serviceName,
    });

    try {
      await this.sdk.start();
      console.log('Tracing initialized successfully');
    } catch (error) {
      console.error('Error initializing tracing:', error);
    }
  }

  // Initialize both logging and tracing
  async initialize(serviceName: string): Promise<void> {
    this.initLogging(serviceName);
    await this.initTracing(serviceName);
  }

  // Get the logger instance
  getLogger(): winston.Logger {
    if (!this.logger) {
      throw new Error('Logger not initialized. Call initLogging() first.');
    }
    return this.logger;
  }

  // Get a child logger with additional metadata
  getChildLogger(metadata: Record<string, unknown>): winston.Logger {
    if (!this.logger) {
      throw new Error('Logger not initialized. Call initLogging() first.');
    }
    return this.logger.child(metadata);
  }

  // Log an error with trace ID if available
  logError(message: string, error: any, traceId?: string): void {
    const logger = this.getLogger();
    logger.error({
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      traceId,
      timestamp: new Date().toISOString()
    });
  }

  // Log an info message with metadata
  logInfo(message: string, metadata?: Record<string, unknown>): void {
    const logger = this.getLogger();
    logger.info({
      message,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  // Log a warning with metadata
  logWarning(message: string, metadata?: Record<string, unknown>): void {
    const logger = this.getLogger();
    logger.warn({
      message,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  // Shutdown the service gracefully
  async shutdown(): Promise<void> {
    if (this.sdk) {
      try {
        await this.sdk.shutdown();
        console.log('Tracing shut down successfully');
      } catch (error) {
        console.error('Error shutting down tracing:', error);
      }
    }

    // Note: Winston doesn't have a shutdown method in this version
  }
}

export const observabilityService = ObservabilityService.getInstance();