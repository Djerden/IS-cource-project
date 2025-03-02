package com.djeno.backend.exceptions;

import com.djeno.backend.models.DTO.SimpleMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ArticleNotFoundException.class)
    public ResponseEntity<SimpleMessage> handleArticleNotFoundException(ArticleNotFoundException e) {
        SimpleMessage message = new SimpleMessage(e.getMessage());
        return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<SimpleMessage> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException e) {
        SimpleMessage message = new SimpleMessage(e.getMessage());
        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<SimpleMessage> handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        SimpleMessage message = new SimpleMessage(e.getMessage());
        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
    }
}
