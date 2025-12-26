# Stage 1: Build stage
FROM gradle:9.2.1-alpine AS build
WORKDIR /home/gradle/src

# Step 1: Copy only the files needed to download dependencies
# This layer is cached unless build.gradle or settings.gradle change
COPY --chown=gradle:gradle build.gradle.kts settings.gradle.kts ./

# Step 2: Download dependencies (go-offline)
# We use a cache mount to persist the Gradle home directory across builds
RUN --mount=type=cache,target=/home/gradle/.gradle \
    gradle build --no-daemon --quiet -x bootJar

# Step 3: Copy the actual source code
COPY --chown=gradle:gradle . .

# Step 4: Build the application
# The --mount here ensures we reuse the dependencies downloaded in Step 2
RUN --mount=type=cache,target=/home/gradle/.gradle \
    gradle build --no-daemon --quiet -x test

# Stage 2: Runtime stage
FROM eclipse-temurin:25-jre-alpine
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]