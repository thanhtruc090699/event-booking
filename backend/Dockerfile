FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw pom.xml ./
COPY .mvn ./.mvn

# Grant execute permission to Maven wrapper
RUN chmod +x mvnw

# Download dependencies first (better caching)
RUN ./mvnw dependency:go-offline -B || true

# Copy source code
COPY src ./src

# Build the application (skip tests for production)
RUN ./mvnw clean package -DskipTests -Dmaven.test.skip=true

# Production stage - smaller image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080 (Render will override this via PORT env var)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
