var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "",
  database : "moods",
  port: "3306"
}); 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  

  connection.query('SHOW TABLES LIKE "users"', (error, results) => {
	if(error) return console.log(error);
	if(results.length==0){
    
  var sql = "CREATE TABLE users (rollNumber VARCHAR(255) NOT NULL, section VARCHAR(255), firstName VARCHAR(255), lastName VARCHAR(255), password VARCHAR(255))";

    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
    
  }
});


 
  console.log('connected as id ' + connection.threadId);
});


exports.register = async function(req,res){
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds)

  var users={
     "rollNumber":req.body.rollNumber,
     "section": req.body.section,
     "firstName": req.body.firstName,
     "lastName": req.body.lastName,
     "password":encryptedPassword
   }
  
  connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    } else {
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
      }
  });
}

exports.getStudent = async function(req,res){
  var rollNumber= req.body.rollNumber;
  var className = req.body.className;
  connection.query('SELECT mood FROM real_data_moods WHERE rollNumber = ? and className= ?',[rollNumber,className], async function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      if(results.length >0){
        res.send({
          "code":200,
          "success":results
        })

      }
    }
  });
}

exports.login = async function(req,res){
  var rollNumber= req.body.rollNumber;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE rollNumber = ?',[rollNumber], async function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      if(results.length >0){
        const comparision = await bcrypt.compare(password, results[0].password)
        if(comparision){
          var data = results;
          delete data[0].password;
            res.send({
              "code":200,
              "success":data
            })
        }
        else{
          res.send({
               "code":204,
               "success":"roll Number and password does not match"
          })
        }
      }
      else{
        res.send({
          "code":206,
          "success":"RollNumber does not exits"
            });
      }
    }
    });
}


exports.insertMood = async function(req,res){

  var users_mood={
     "rollNumber":req.body.rollno,
     "fullName": req.body.name,
     "className": req.body.className,
     "mood": req.body.mood,
     "section": req.body.section,
     "date": req.body.data,
   }

     connection.query('SHOW TABLES LIKE "real_data_moods"', (error, results) => {
     if(error) return console.log(error);
     if(results.length==0){
       
     var sql = "CREATE TABLE real_data_moods (rollNumber VARCHAR(255), fullName VARCHAR(255), className VARCHAR(255), mood VARCHAR(255), section VARCHAR(255), date VARCHAR(255))";
   
       connection.query(sql, function (err, result) {
         if (err) throw err;
         console.log("Table created");
       });
       
     }
   });




  
  connection.query('INSERT INTO real_data_moods SET ?',users_mood, function (error, results, fields) {
    console.log(error);
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"+ error
      })
    } else {
      res.send({
        "code":200,
        "success":"okay sucessfully"
          });
      }
  });
}
