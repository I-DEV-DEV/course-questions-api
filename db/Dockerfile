# Dockerfile
FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root123
ENV MYSQL_DATABASE=course_questions
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=mypassword

COPY init.sql /docker-entrypoint-initdb.d/
