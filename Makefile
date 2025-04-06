.PHONY: build up down logs clean test influx-query

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

test:
	curl http://localhost:3000
	curl http://localhost:3000/error
	curl http://localhost:3000/metrics

influx-query:
	docker-compose exec influxdb influx query 'from(bucket:"logging") |> range(start: -1h) |> limit(n:10)' --token my-super-secret-token --org myorg

influx-shell:
	docker-compose exec -e INFLUX_TOKEN=my-super-secret-token -e INFLUX_ORG=myorg influxdb bash