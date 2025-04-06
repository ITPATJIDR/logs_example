
### Architecture
<img src="assets/images/image.png" alt="ArchMap Overview" style="max-width:100%;"/>

- Express App: Generates structured logs for API requests and application events
- Fluent Bit: Lightweight log forwarder that collects logs from the Express app
- Fluentd: Powerful log aggregator that processes and routes logs to different destinations
- InfluxDB: Time-series database for storing metrics and logs


### Project Structure
```
project/
├── app/
│   ├── index.js         # Express application
│   ├── package.json     # Node.js dependencies
│   └── Dockerfile       # Docker image for the app
├── fluent-bit/
│   └── fluent-bit.conf  # Fluent Bit configuration
├── fluentd/
│   ├── fluent.conf      # Fluentd configuration
│   └── Dockerfile       # Custom Fluentd image
├── logs/                # Directory for log files
├── docker-compose.yml   # Docker Compose configuration
├── test-influx.sh       # Script to test InfluxDB integration
├── Makefile             # Convenience commands
└── README.md            # This file
```