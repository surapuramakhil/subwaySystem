# Subway System API

This project implements a RESTful API for managing a subway system, including train lines, stations, and optimal route calculations.

## Technologies Used

- Node.js
- TypeScript
- Express.js
- Neo4j (Graph Database)
- PostgreSQL
- Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose installed on your machine
- Node.js (for local development)

## Getting Started

This is project is setup on Docker Environment - user dockercompse for spawning entire setup including databases - PostGres & Neo4j
Docker Compose is used as development enviroment, for production use cases, build image using docker file as it creates prod version and deploy it in your production env (k8 Env)
lot of configurations are preset - check docker-compose.yml file

1. clone / download this project
2. Start the application using Docker Compose:
```sh 
    docker compose up 
```

This will start the Node.js application, PostgreSQL database, and Neo4j database.

3. The API will be available at `http://localhost:3000`

if databasse is not initialized
### DataBase Setup Instructions [one time only]
p.s. following steps needs to be performed when application is up so that you can access spawned postgres DB

prisma schema file location - prisma/schema.prisma

1. create prima migration file
   
   ```zsh
   docker-compose exec app npx prisma migrate dev --name init
   ```

2. Review Migration file (optional). Push/apply migration to database

    ```zsh
    docker-compose exec app npx prisma db push  
    ```

3. Generate Primsa client

    ```zsh
    docker-compose exec app npx prisma generate 
    ```

# Evaluation README

## Does your code completely solve the questions?
yes 

### Running Challenge

#### Running Challenge 1

#### Running Challenge 2

## Is your code organized and well thought-out?

yes, code is well thoughtout, following standard practices.

## Would it be easy to extend your code to a more complex solution with more requirements?

#### Extensibility
The code has been designed with extensibility in mind:
1. Modular Architecture: The project is structured into services, controllers, and models, making it easy to add new features or modify existing ones.
2. Database Abstraction: We use repositories to abstract database operations, allowing for easy switching or addition of new data sources.
3. Middleware Pattern: Express middleware is used for cross-cutting concerns like error handling and logging, making it easy to add new global behaviors.
4. Configuration Management: Environment variables and a config module are used for easy configuration in different environments.
5. Scalable Graph Algorithms: The use of Neo4j's Graph Data Science library allows for easy implementation of more complex routing algorithms in the future.
   
To extend the system, you can:
- Add new models to src/models/
- Implement new services in src/services/
- Create new controllers in src/controllers/
- Add new routes in src/routes/

## How did you test your solution?
   
Performed Manual integration test using postman

postman API's JSON file - ./GetParkerCoding.postman_collection.json

``` JSON
{
	"info": {
		"_postman_id": "d01cc01b-a9cc-4888-aefd-0d29fcb355f8",
		"name": "GetParker Coding",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "27041425"
	},
	"item": [
		{
			"name": "Subway Challenge",
			"item": [
				{
					"name": "create trailline 1",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n\n\"stations\": [\"Canal\", \"Houston\", \"Christopher\", \"14th\"],\n\n\"name\": \"1\",\n\n\"fare\": 2.75\n\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/train-line",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"train-line"
							]
						}
					},
					"response": []
				},
				{
					"name": "create trailline E",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"stations\": [\n        \"Spring\",\n        \"West 4th\",\n        \"14th\",\n        \"23rd\"\n    ],\n    \"name\": \"E\",\n    \"fare\": 1.75\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/train-line",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"train-line"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get Route",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/route?origin=Hoston&destination=23rd",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"route"
							],
							"query": [
								{
									"key": "origin",
									"value": "Hoston"
								},
								{
									"key": "destination",
									"value": "23rd"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "create Card",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n\n\"number\": \"1234\",\n\n\"amount\": 10.0\n\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/card",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"card"
							]
						}
					},
					"response": []
				},
				{
					"name": "Station Enter",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n\n\"card_number\": \"1234\"\n\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/station/:station/enter",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"station",
								":station",
								"enter"
							],
							"variable": [
								{
									"key": "station",
									"value": "Houston",
									"type": "string"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Station Exit",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": ""
						}
					},
					"response": []
				}
			]
		}
	]
}
```


# Subway System Implementation Challenge

## Current Implementation

This project implements a subway system based on the provided problem statement, with the following key features:
- Adding train lines with stations and fares
- Finding optimal routes between stations
- Managing prepaid cards for passengers
- Handling entry and exit of passengers at stations

### Key Components

1. `TrainLineService`: Manages train lines, stations, and route calculations.
2. `CardService`: Handles prepaid card operations.
3. `RideService`: Manages passenger rides, including entry and exit operations.

## Problem Statement Scoping and Limitations

The current implementation is based on a simplified problem statement that doesn't fully address the complexities of real-world subway systems. This has led to certain limitations in the system design:

### Simplified Fare Structure

The problem statement specifies:
> "The amount users should pay when taking trains from this line"

This implies a single fare per line, which doesn't account for:
- Stations served by multiple lines



### Fare Deduction at Entry

A significant limitation arises from the requirement to deduct the fare when a passenger enters a station:

> "POST /station/[station]/enter
> card_number - unique identification of the card being used to pay for the ride
> returns the amount left in the card after paying for the ride"

This requirement introduces several challenges:

1. **Unknown Destination**: At the point of entry, the system doesn't know the passenger's destination, making it impossible to calculate an accurate fare for distance-based or zone-based pricing systems.

**Arbitrary Line Selection**: For multi-line stations, the system arbitrarily selects the fare from one of the lines.

**As the result system is forced to Arbitrary Line Selection**
