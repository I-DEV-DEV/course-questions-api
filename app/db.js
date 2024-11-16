import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',  				// Update with your DB host if needed
  user: 'myuser',       				// Replace with your MySQL username
  password: 'mypassword',       		// Replace with your MySQL password
  database: 'course_questions' 		// Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
  
  /*
  // Test query to check database connection
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Query error:', err);
    } else {
      console.log('Database connection is working. Test query result:', results[0].solution);
    }
    connection.end();  // Close connection after testing
  });
  */
});

export default connection;
