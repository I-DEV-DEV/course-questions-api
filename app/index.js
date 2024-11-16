import express from 'express';
import connection from './db.js';

// Ensure `db.js` is loaded when the server starts
// You can use the connection in route handlers as needed

const app = express();
const PORT = process.env.PORT || 3000; // For app
const coursePORT = 3020; // For getCourseById endpoint

app.use(express.json()); // Enable JSON parsing for request bodies

app.get('/', (req, res) => {
  res.send('Course Questions API is running!');
});

// Endpoint to get all questions in the table
app.get('/getAllQuestions', (req, res) => {
	
  connection.query('SELECT questionId, courseId, question, opt1, opt2, opt3, opt4 FROM questions', [], (err, results) => {
    if (err) {
      console.error('Error fetching questions:', err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('No questions available');
    } else {
      res.json(results);
    }
  });
});

// Endpoint to get all questions for a course
app.get('/getQuestionsByCourseId/:id', (req, res) => {
	
  const courseId = req.params.id;

  connection.query('SELECT questionId, courseId, question, opt1, opt2, opt3, opt4 FROM questions WHERE courseId = ?', [courseId], (err, results) => {
    if (err) {
      console.error('Error fetching questions:', err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('No questions available');
    } else {
      res.json(results);
    }
  });
});

//Function to check if a course exists
async function checkCourse(courseId) {
	
	try {
		//console.log(courseId);
		const response = await fetch(`http://localhost:${coursePORT}/getCourseById/${courseId}`)
		const data = await response.json();
		
		if(data && Object.keys(data).length < 1) {
			console.log(data);
			//console.log("Inside Function false");
			return false;
		} else {
			console.log(data);
			//console.log("Inside Function true");
			return true;	
		}
	}
	catch(error) {
		console.error("Error:",error)
	}
}

// Endpoint to insert questions for a course
app.post('/postQuestion', async (req, res) => {
  
  const { courseId, question, opt1, opt2, opt3, opt4, ans } = req.body;
	//console.log(req.body);	
	const courseExists = await checkCourse(courseId);
	
	if(courseExists) {
		console.log("Course available");
		//res.send(data);
		const query = "INSERT INTO questions (courseId, question, opt1, opt2, opt3, opt4, ans) VALUES (?, ?, ?, ?, ?, ?, ?)";
		connection.query(query, [courseId, question, opt1, opt2, opt3, opt4, ans], (err, result) => {
			if(err) {
				console.error("Error inserting data:", err);
				res.status(500).json({ message: "Error inserting data." });
				return;
			}
			res.status(201).json({ id: result.insertId, courseId, question });
		});	
	} else {
		console.log("No course found.");
		res.send({ message: "No course found. Invalid course ID." });
	}
	
});

//Endpoint to delete a question
app.delete('/deleteQuestion/:id',(req, res) => {
	const questionId = req.params.id;
	const query = 'DELETE FROM questions WHERE questionId = ?';
	
	connection.query(query, [questionId], (err,result) => {
		if(err) {
			console.error("Error deleting data:", err);
			res.status(500).json({ message: "Error deleting data" });
			return;
		}
		if(result.affectedRows === 0) {
			res.status(404).json({ message: "Question ID invalid" });
			return;
		}
		res.status(200).json({ message: "Question deleted successfully", questionId: questionId });
	});	
});

//Endpoint to update a question
app.put('/updateQuestion/:id',async (req, res) => { 
	const questionId = req.params.id;
	const { courseId, question, opt1, opt2, opt3, opt4, ans } = req.body;
	const query = 'UPDATE questions SET courseId = ?, question = ?, opt1 = ?, opt2 = ?, opt3 = ?, opt4 = ?, ans = ? WHERE questionId = ?';
	
	console.log(questionId);
	const courseExists = await checkCourse(courseId);
	
	if(courseExists) {
		connection.query(query, [courseId, question, opt1, opt2, opt3, opt4, ans, questionId], (err,result) => {
			if(err) {
				console.error("Error updating data:", err);
				res.status(500).json({ message: "Error updating data." });
				return;
			}
			if(result.affectedRows === 0) {
				res.status(404).json({ message: "Question ID invalid" });
				return;
			}
			res.status(200).json({ message: "Question updated successfully.", questionId: questionId });
		});	
	} else {
		console.log("No course found.");
		res.send({ message: "No course found. Invalid course ID." });
	}
});

//Endpoint to check answer for the question
app.post('/checkAnswer', (req, res) => {
  
  const { questionId, ans } = req.body;
  
  if( !questionId ) {
	  return res.status(400).send({ error: "Question ID is required." });
  }
  
  const query = "SELECT question, ans FROM questions WHERE questionId = ?";
  
  connection.query(query, [questionId], (err, results) => {
	  if(err) {
		  console.error("Error querying the database:", err);
		  return res.status(500).send({ error: "Database query failed." });
	  }
	  
	  //console.log(results);
	  //res.send(results[0].ans);
	  
	  if(results.length > 0) {
		  if(results[0].ans == ans) {
			  return res.send({ "message": "The answer is correct :)", "question": results[0].question, "answer": results[0].ans });
		  } else {
			  return res.send({ "message": "The answer is wrong :( Try again.", "question": results[0].question, "Your answer": ans });
		  }
	  } else {
		  return res.send({ "message": "Question does not exist." });
	  }
	  
  });
  
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
