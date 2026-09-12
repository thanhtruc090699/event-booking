package com.truc.eventbooking.common;

import com.truc.eventbooking.common.dto.ErrorResponse;
import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.ForbiddenException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import com.truc.eventbooking.common.exception.NotFoundException;
import org.springframework.validation.FieldError;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public org.springframework.http.ResponseEntity<ErrorResponse> handleNotFound(
            NotFoundException exception
    ){
        return org.springframework.http.ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(exception.getCode(), exception.getMessage()));
    }

    @ExceptionHandler(BusinessConflictException.class)
    public org.springframework.http.ResponseEntity<ErrorResponse> handleBusinessConflict(
            BusinessConflictException exception
    ){
        return org.springframework.http.ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(exception.getCode(), exception.getMessage()));
    }

    @ExceptionHandler(ForbiddenException.class)
    public org.springframework.http.ResponseEntity<ErrorResponse> handleForbidden(
            ForbiddenException exception
    ){
        return org.springframework.http.ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(exception.getCode(), exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException exception
    ){
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("VALIDATION_ERROR", message));
    }
}
