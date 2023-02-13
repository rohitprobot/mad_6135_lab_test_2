const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
const db = new sqlite3.Database('whDB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});


// Serve the HTML form
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <style>
input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type=submit] {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=submit]:hover {
  background-color: #45a049;
}

div {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}
</style>
  <body bgcolor=”#DBF9FC">
  <h1 style="color:white"> Lab Test 2</h1>
  </br>
      <form action="/search" method="post">
      <input type="text" name="partNumber" placeholder="Enter Part Number">
      <input type="submit" value="Submit">
    </form>
    </body>
    </html>
  `);
});

// Handle the form submission
app.post('/search', (req, res) => {
  const partNumber = req.body.partNumber;
  const query = `
    SELECT Shelf.ShelfLocation, Bin.BinID, COUNT(PartNumber.PartNumberID)
    FROM PartNumber
    JOIN Bin ON PartNumber.BinID = Bin.BinID
    JOIN Shelf ON Bin.ShelfID = Shelf.ShelfID
    WHERE PartNumber.PartNumber = ?
  `;
  db.get(query, [partNumber], (err, row) => {
    if (err) {
      console.error(err.message);
    }
    res.send(`
    <DOCTYPE html>
    <html>
    <body bgcolor=”#DBF9FC">
      <p style="color:white;">Shelf No: ${row.ShelfLocation}</p>
      <p style="color:white;">Bin No: ${row.BinID}</p>
      <p style="color:white;">Total Count: ${row['COUNT(PartNumber.PartNumberID)']}</p>
      </body>
      </html>
    `);
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});