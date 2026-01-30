package me.opel.backend;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import me.opel.backend.errors.ErrorResponse;
import me.opel.backend.errors.ValidationErrorResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleEntityNotFound(EntityNotFoundException ex, HttpServletRequest request) {
        log.error("Entity not found: {}", ex.getMessage());

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.NOT_FOUND.value())
                            .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                            .message("Resource not found")
                            .path(request.getRequestURI())
                            .build();
    }

    @ExceptionHandler(EmptyResultDataAccessException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleEmptyResultDataAccess(EmptyResultDataAccessException ex, HttpServletRequest request) {
        log.error("Empty result:  {}", ex.getMessage());

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.NOT_FOUND.value())
                            .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                            .message("Resource not found")
                            .path(request.getRequestURI())
                            .build();
    }

    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNoResourceFound(NoResourceFoundException ex, HttpServletRequest request) {
        log.error("No resource found: {}", ex.getMessage());

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.NOT_FOUND.value())
                            .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                            .message("Endpoint not found")
                            .path(request.getRequestURI())
                            .build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            var fieldName = error.getField();
            var errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.error("Validation failed for {}: {} errors", request.getRequestURI(), errors.size());

        return ValidationErrorResponse.builder()
                                      .timestamp(LocalDateTime.now())
                                      .status(HttpStatus.BAD_REQUEST.value())
                                      .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                                      .message("Validation failed")
                                      .path(request.getRequestURI())
                                      .validationErrors(errors)
                                      .build();
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();

        ex.getConstraintViolations().forEach(error -> {
            var violation = error.getPropertyPath().toString();
            var message = error.getMessage();
            errors.put(violation, message);
        });

        log.error("Constraint violation:  {}", ex.getMessage());

        return ValidationErrorResponse.builder()
                                      .timestamp(LocalDateTime.now())
                                      .status(HttpStatus.BAD_REQUEST.value())
                                      .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                                      .message("Validation failed")
                                      .path(request.getRequestURI())
                                      .validationErrors(errors)
                                      .build();
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {

        var message = String.format("Invalid value '%s' for parameter '%s'.  Expected type: %s", ex.getValue(),
                                    ex.getName(),
                                    ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown");

        log.error("Type mismatch: {}", message);

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.BAD_REQUEST.value())
                            .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                            .message(message)
                            .path(request.getRequestURI())
                            .build();
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        log.error("Malformed JSON request: {}", ex.getMessage());

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.BAD_REQUEST.value())
                            .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                            .message("Malformed JSON request")
                            .path(request.getRequestURI())
                            .build();
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMissingParameter(MissingServletRequestParameterException ex,
                                                HttpServletRequest request) {
        var message = "Required parameter '%s' is missing".formatted(ex.getParameterName());

        log.error(message);

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.BAD_REQUEST.value())
                            .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                            .message(message)
                            .path(request.getRequestURI())
                            .build();
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public ErrorResponse handleMethodNotSupported(HttpRequestMethodNotSupportedException ex,
                                                  HttpServletRequest request) {
        var message = "HTTP method '%s' is not supported for this endpoint".formatted(ex.getMethod());

        log.error(message);

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.METHOD_NOT_ALLOWED.value())
                            .error(HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase())
                            .message(message)
                            .path(request.getRequestURI())
                            .build();
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    public ErrorResponse handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex,
                                                     HttpServletRequest request) {
        var message = "Media type '%s' is not supported".formatted(ex.getContentType());

        log.error(message);

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value())
                            .error(HttpStatus.UNSUPPORTED_MEDIA_TYPE.getReasonPhrase())
                            .message(message)
                            .path(request.getRequestURI())
                            .build();
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleDataIntegrityViolation(DataIntegrityViolationException ex, HttpServletRequest request) {
        log.error("Data integrity violation: {}", ex.getMessage());

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.CONFLICT.value())
                            .error(HttpStatus.CONFLICT.getReasonPhrase())
                            .message("Data integrity violation. The operation conflicts with existing data")
                            .path(request.getRequestURI())
                            .build();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error occurred", ex);

        return ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                            .message("An unexpected error occurred")
                            .path(request.getRequestURI())
                            .build();
    }

}
