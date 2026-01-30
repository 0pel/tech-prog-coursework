plugins {
    java
    id("org.springframework.boot") version "4.0.2"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "me.opel"
version = "0.1.0"
description = "backend for simple todo app using spring boot"

val mapstructVersion = "1.6.3"
val mapstructSpringVersion = "2.0.0"
val mapstructLombokVersion = "0.2.0"
val openApiVersion = "3.0.1"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.mapstruct:mapstruct:$mapstructVersion")
    implementation("org.mapstruct.extensions.spring:mapstruct-spring-extensions:$mapstructSpringVersion")
    implementation("org.projectlombok:lombok-mapstruct-binding:$mapstructLombokVersion")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:$openApiVersion")

    developmentOnly("org.springframework.boot:spring-boot-devtools")

    runtimeOnly("org.postgresql:postgresql")

    compileOnly("org.projectlombok:lombok")

    annotationProcessor("org.projectlombok:lombok")
    annotationProcessor("org.mapstruct:mapstruct-processor:$mapstructVersion")
    annotationProcessor("org.mapstruct.extensions.spring:mapstruct-spring-annotations:$mapstructSpringVersion")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("org.springframework.boot:spring-boot-starter-validation-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")

    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
