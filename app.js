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
      console.log("connection id : " + connection.threadId);

      connection.query("SELECT * from emp1", (err, result) => {
        connection.release();

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

app.get("/getData/:id", function (req, res) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connection id : " + connection.threadId);

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
      console.log(name1);
      const designation1 = req.body.designation;
      const salary1 = req.body.salary;

      var sql2 = "SELECT * from emp1";
      console.log("connection id : " + connection.threadId);
      var sql =
        'INSERT INTO emp1 (name, designation, salary) VALUES ("' +
        name1 +
        '","' +
        designation1 +
        '", "' +
        salary1 +
        '")';
      console.log(sql);
      connection.query(sql, (err, result) => {
        connection.release();

          if (!err) {
              var queryForLastId = "SELECT * from emp1 where id = "+ result.insertId;
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



        //   res.json({
        //     message: "sucess",
        //     data: result.insertId,
        //   });
          // res.status(200).json({
          //   status: "Fetch data for id:   " + req.params.id,
          //   data: result,
          // });
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

app.listen(port, () => {
  console.log("port is start : " + port);
});
