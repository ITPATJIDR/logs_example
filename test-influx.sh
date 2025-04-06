#!/bin/bash

echo "Generating test data..."
for i in {1..3}; do
  echo "Request $i to /"
  curl -s http://localhost:3000 > /dev/null
  sleep 1
  
  echo "Request $i to /error"
  curl -s http://localhost:3000/error > /dev/null
  sleep 1
done

echo -e "\nWaiting for logs to be processed..."
sleep 5

echo -e "\nChecking InfluxDB for recent data..."
docker-compose exec influxdb influx query 'from(bucket:"logging") |> range(start: -1m) |> limit(n:10)' --token my-super-secret-token --org myorg

echo -e "\nChecking for request metrics..."
docker-compose exec influxdb influx query 'from(bucket:"logging") |> range(start: -1m) |> filter(fn: (r) => r._measurement == "requests") |> limit(n:5)' --token my-super-secret-token --org myorg

echo -e "\nChecking for error metrics..."
docker-compose exec influxdb influx query 'from(bucket:"logging") |> range(start: -1m) |> filter(fn: (r) => r._measurement == "errors") |> limit(n:5)' --token my-super-secret-token --org myorg