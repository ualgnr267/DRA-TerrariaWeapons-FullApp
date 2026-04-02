# Terraria Weapons Full App

Aplicacion full-stack para consultar informacion de armas de Terraria.

Incluye:
- Backend REST con Spring Boot + JPA + PostgreSQL.
- Frontend con Angular.
- Orquestacion con Docker Compose.
- Dataset en JSON dentro de `scripts/terraria-weapons.json`.

## Estructura del proyecto

- `backend/demo`: API REST (Java 17, Spring Boot, Maven).
- `frontend`: cliente web Angular.
- `scripts`: dataset y script de scraping.
- `docker-compose.yml`: levanta base de datos, backend y frontend.

## Requisitos

- Docker y Docker Compose, o
- Java 17 + Maven + Node.js 20 + PostgreSQL.

## Ejecutar con Docker (recomendado)

Desde la raiz del proyecto:

```bash
docker compose up --build
```

Servicios:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- Endpoint de armas: http://localhost:8080/api/weapons
- PostgreSQL: localhost:5432

Para detener:

```bash
docker compose down
```

## Datos

El backend carga datos desde:
- `scripts/terraria-weapons.json`
