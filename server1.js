const express=require("express");
const bodyParser=require("body-parser");
const fs = require ("fs-extra");
const cors=require("cors");

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nick:portPass@cluster0.onn1x.mongodb.net/portfolio?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });

const app=express();
const jsonParser=bodyParser.json();
app.use(cors());

let database= null;
let collection1=null;
let collection2=null;
async function connectDB(){
	await client.connect();
	database = client.db("mechmarket");
	collection1 = database.collection("groupbuy");
	collection2 = database.collection("interest");
};
connectDB();

async function getFeatured(req,res){
	projection={name:1, year:1, cover:1}

	let projectsCursor = await collection.find().project(projection);
	let projects = await projectsCursor.toArray();

	let rand1=Math.floor(Math.random() * projects.length);
	let rand2=Math.floor(Math.random() * projects.length);
	while(rand1===rand2){
		rand2=Math.floor(Math.random() * projects.length);
	}
	let rand3=Math.floor(Math.random() * projects.length);
	
	const response=[projects[rand1],projects[rand2],projects[rand3].cover];

	res.json(response);
}

async function getProjects(req,res){
	projection={name:1, year:1, cover:1}

	let query={category:"digital"}
	let projectsCursor = await collection.find(query).project(projection);
	let digital = await projectsCursor.toArray();

	query={category:"photography"}
	projectsCursor = await collection.find(query).project(projection);
	let photography = await projectsCursor.toArray();

	query={category:"physical"}
	projectsCursor = await collection.find(query).project(projection);
	let physical = await projectsCursor.toArray();

	let projects={"digital":digital,"photography":photography,"physical":physical};

	console.log(projects);

	const response=projects;

	res.json(response);
}

async function getContent(req,res){
	projectID=req.params.project.toLowerCase();

	let query={_id:projectID}

	let projectsCursor = await collection.find(query);
	let project = await projectsCursor.toArray();
	console.log(project);

	const response=project;

	res.json(response);
}

async function postComment(req, res){
	const projectID=req.params.project.toLowerCase();
	const author = req.body.author;
	const commentBody=req.body.commentBody;

	const comment={
		"author":req.body.author,
		"commentBody":req.body.commentBody
	};

	let query={_id:projectID};

	let projectsCursor = await collection.find(query).project({comments:1});
	let project = await projectsCursor.toArray();
	let newComments=project[0].comments;

	newComments.push(comment)

	console.log(newComments)

	const filter = {_id:projectID.toLowerCase()};
	const addComment={
		$set:{
			comments:newComments
		}
	}

	const result = await collection.updateOne(filter,addComment)

	const response=[
		{matchedCount:result.matchedCount},
		{modifiedCount:result.modifiedCount},
		{comment:comment}
	];
	res.json(response);

}
async function getMech(req, res){
	projection={title:1, url:1, help:1}

	let query={help:"1"}
	let projectsCursor = await collection1.find(query).project(projection);
	let digital = await projectsCursor.toArray();

	res.json(digital);

}

app.get("/projects",getProjects);
app.get("/mech",getMech);
app.get("/projects/:project",getContent);
app.get("/featured",getFeatured);
app.post("/comment/:project",jsonParser, postComment)

var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my 5 minutes check");
  let url="https://www.reddit.com/r/mechmarket/search/.json?q=flair%3A%22group%20buy%22&restrict_sr=1&sort=new&limit=100";
  fetch(url)
	.then(res => res.json())
	.then((out) => {
  		console.log('Checkout this JSON! ', out);
	})
	.catch(err => { throw err });
  // do your stuff here
}, the_interval);


app.listen(5001, function(){
	console.log("server is running on port 5001");
});
