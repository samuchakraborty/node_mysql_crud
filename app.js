const express = require("express");
const bodyParser = require("body-parser");
const mySql = require("mysql");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const pool = mySql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "node_js",
});

//get all data from the database

app.get("/getAll", function (req, res) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    } else {

      connection.query("SELECT * from emp1", (err, result) => {
      //  connection.release();

        if (!err) {
          res.status(200).json({
            status: "Fetch data",
            data: result,
          });
        } else {
          res.status(404).json({
            status: "you have no right",
            err: err,
          });
          console.log(err);
        }
      });
    }
  });
});

//get specified data by id

app.get("/getAll/:id", function (req, res) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    } else {
    //  console.log("connection id : " + connection.threadId);

      connection.query(
        "SELECT * from emp1 where id=" + req.params.id,
        (err, result) => {
          connection.release();

          if (!err) {

            
            res.status(200).json({
              status: "Fetch data for id:   " + req.params.id,
              data: result,
            });
          } else {
            res.status(404).json({
              status: "you have no right",
              err: err,
            });
            console.log(err);
          }
        }
      );
    }
  });
});

//insert data into the table
app.post("/insertData", function (req, res) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    } else {
      const name1 = req.body.name;

      const designation1 = req.body.designation;
      const salary1 = req.body.salary;

      var sql2 = "SELECT * from emp1";
      var sql =
        'INSERT INTO emp1 (name, designation, salary) VALUES ("' +
        name1 +
        '","' +
        designation1 +
        '", "' +
        salary1 +
        '")';
   
      connection.query(sql, (err, result) => {
     //   connection.release();

        if (!err) {
          var queryForLastId =
            "SELECT * from emp1 where id = " + result.insertId;
          connection.query(queryForLastId, (err, result) => {
            //  connection.release();

            if (!err) {
              res.status(200).json({
                status: "Successfully added",
                data: result,
              });
            } else {
              res.status(404).json({
                status: "you have no right",
                err: err,
              });
              console.log(err);
            }
          });

    
        } else {
          res.status(404).json({
            status: "you have no right",
            err: err,
          });
          console.log(err);
        }
      });
    }
  });
});

app.get('/delete/:id', function (req, res) {
  
  pool.getConnection((err, connection) => {
    if(err) {
      console.log(err);
    
    } else{
      var sql = 'DELETE FROM emp1 WHERE id=' + req.params.id;
      console.log(sql);
      connection.query(sql, (err, result) => {
        
        if (!err) {
          
          res.json({ success: 1 , msg: "Successfully deleted id: "+ req.params.id});
        }
      });

    }
    
  




  });



});




app.listen(port, () => {
  console.log("port is start : " + port);
});
