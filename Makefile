.PHONY: build up down logs clean

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