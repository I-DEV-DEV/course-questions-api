import express from 'express';

const app = express();
const PORT = process.env.PORT || 3020;

app.get('/', (req, res) => {
  res.send('Test Endpoint');
});

// Endpoint to get all questions for a course
app.get('/getCourseById/:id', (req, res) => {
	
	const courseId = req.params.id;
	
	if(courseId == 1001) {
		//console.log("Course 1001");
		res.send({"courseId":1001,"courseName":"Photonics"});
	} else if(courseId == 1002) {
		//console.log("Course 1002");
		res.send({"courseId":1002,"courseName":"GK"});
	} else {
		res.send({});
	}
	
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
