CREATE DATABASE IF NOT EXISTS course_questions;
USE course_questions;

CREATE TABLE IF NOT EXISTS questions (
  questionId INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT NOT NULL,
  question VARCHAR(1000) NOT NULL,
  opt1 VARCHAR(1000),
  opt2 VARCHAR(1000),
  opt3 VARCHAR(1000),
  opt4 VARCHAR(1000),
  ans VARCHAR(1000)
);

ALTER TABLE questions AUTO_INCREMENT = 1001;

/*
INSERT INTO questions (courseId, question, opt1, opt2, opt3, opt4, ans) 
VALUES
('1001','Colour not in rainbow','Violet','Black','Blue','Yellow','Black'),
('1001','Speed of photon','Speed of sound','Speed of light','.','.','Speed of light'),
('1002','Capital of India','New Delhi','Mumbai','Chennai','Kolkatta','New Delhi');

SELECT * FROM questions;
*/
