# Backend Dockerfile
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/terraria-api-0.0.1-SNAPSHOT.jar app.jar

ENV TERRARIA_WEAPONS_JSON_PATH=/scripts/terraria-weapons.json
EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
