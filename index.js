var mongoClient=require('mongodb').MongoClient;
var mongoDbObj;
var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
//configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//connecting to mongo DB
mongoClient.connect('mongodb://localhost:27017/studentDB', function(err, db){
  if(err)
    console.log(err);
  else{
	    console.log("Connected to MongoDB");
	    mongoDbObj={db: db,
	      students: db.collection('students')
	    };

	    //GET

		app.get('/students', function (req, res){
			   //READALL
			mongoDbObj.students.find().toArray(function(err, data){
			  if(err){
			    console.log(err);
			    res.json({"result": "error"});
				}
			  else{
			  	console.log("Student details");
			    //operate with the deta
			    console.log(data);
			  	res.json(data);

			  }
			});
		});

		app.get('/students/:studentId', function (req, res){
			//READ
			mongoDbObj.students.find({"studentId":parseInt(req.params.studentId) }).toArray(function(err, data){
			  if(err){
			    console.log(err);
			    res.json({"result": "error"});
				}
			  else{
			    //operate with the deta
			    console.log("Student detail of :" + req.params.studentId);
			    console.log(data);
			    res.json(data);
			  }
			});
		});
		//CREATE
	   app.post('/students',function(req,res){
			var studentObject={};
			studentObject.studentId= req.body.studentId;
			studentObject.class = req.body.class;
			studentObject.name = req.body.name;
			studentObject.marks ={};
			studentObject.marks.totalMarks = req.body.marks.totalMarks;
			studentObject.marks.percent = req.body.marks.percent;
				//CREATE
			mongoDbObj.students.insert(studentObject,{w:1},function(err, result){
			  if(err){
			    console.log(err);
			    res.json({"result": "error"});
			  }
			  else{
			    //Handle the success case
			    console.log("Written succes");
			    res.json({"result": "created success"});
			  }
			});

		});
	   //PUT
	   app.put('/students/:studentId', function (req, res){
				//UPDATE
			mongoDbObj.students.update({studentId: parseInt(req.params.studentId) },{$set: {name: req.body.studentName} },{w:1}, function(err, result){
				  if(err){
				    console.log(err);
				    res.json({"result": "error"});
					}
				  else{
				    //operate with the deta
				    console.log("succesfully updated " + req.body.studentName);
				    res.json({"result": "success"});
				  }
			});
		});
	   	//DELETE
	   	app.delete('/students/:studentId', function (req, res){
			mongoDbObj.students.remove({studentId: parseInt(req.params.studentId)}, {w:1}, function(err, result) {
				if(err){
					console.log(err);
					 res.json({"result": "error"});
				}
				else{
					console.log("succesfully removed " );
					 res.json({"result": "success"});
				}
			});
		});

	   	//start the server
		var server = app.listen(8000, function () {

		  var host = server.address().address
		  var port = server.address().port

		  console.log("Example app listening at http://%s:%s", host, port)

		});
		
	}
});
