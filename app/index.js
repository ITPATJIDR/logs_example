const express = require('express');
const winston = require('winston');
const fluentLogger = require('fluent-logger');
const os = require('os');

const app = express();
const port = 3000;

// Configure fluent-logger
const logger = fluentLogger.createFluentSender('express', {
  host: 'fluent-bit',
  port: 24224,
  timeout: 3.0,
  requireAckResponse: true
});

// Also use Winston for console logging
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'express-app' },
  transports: [
    new winston.transports.Console()
  ]
});

// Log function that sends to both console and fluent
function log(level, tag, data) {
  winstonLogger[level](tag, data);
  logger.emit(tag, data);
}

// Add system metrics to the logs
function getSystemMetrics() {
  return {
    memory_usage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
    cpu_load: os.loadavg()[0],
    uptime: process.uptime(),
    hostname: os.hostname()
  };
}

// Log system metrics every 30 seconds
setInterval(() => {
  log('info', 'system_metrics', {
    ...getSystemMetrics(),
    message: 'System metrics collected'
  });
}, 30000);

// Middleware to log all requests
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    log('info', 'request_completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
      ...getSystemMetrics()
    });
  });
  
  next();
});

// Routes
app.get('/', (req, res) => {
  log('info', 'home_page_accessed', { 
    message: 'Home page was accessed',
    ...getSystemMetrics()
  });
  res.send('Hello World! Try accessing /error to generate an error log.');
});

app.get('/error', (req, res) => {
  log('error', 'error_endpoint_accessed', { 
    message: 'Error endpoint was accessed',
    error: 'This is a sample error',
    ...getSystemMetrics()
  });
  res.status(500).send('Error endpoint accessed');
});

// Add a metrics endpoint
app.get('/metrics', (req, res) => {
  const metrics = getSystemMetrics();
  log('info', 'metrics_endpoint_accessed', {
    message: 'Metrics endpoint was accessed',
    ...metrics
  });
  res.json(metrics);
});

// Start server
app.listen(port, () => {
  log('info', 'server_started', { 
    message: `Express server listening on port ${port}`,
    port,
    ...getSystemMetrics()
  });
}); 