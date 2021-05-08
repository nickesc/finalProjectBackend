const express=require("express");
const bodyParser=require("body-parser");
const fs = require ("fs-extra");
const cors=require("cors");
const fetch = require("node-fetch");

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
	//projection={title:1, url:1, help:1}

	let query={help:"1"}
	let projectsCursor = await collection1.find();
	let digital = await projectsCursor.toArray();

	res.json(digital);

}

async function updateList(out, collection){
for (i=0; i<out.data.children.length; i++){
			
			var obj = out.data.children[i].data

			obj._id=obj.name;

			delete obj.approved_at_utc;
			delete obj.saved;
			delete obj.mod_reason_title;
			delete obj.gilded;
			delete obj.clicked;
			delete obj.link_flair_richtext;
			delete obj.hidden;
			delete obj.pwls;
			delete obj.top_awarded_type;
			delete obj.hide_score;
			delete obj.quarantine;
			delete obj.upvote_ratio
			delete obj.author_flair_background_color
			delete obj.subreddit_type
			delete obj.media_embed
			delete obj.author_flair_template_id
			delete obj.is_original_content
			delete obj.user_reports
			delete obj.secure_media
			delete obj.is_reddit_media_domain
			delete obj.is_meta
			delete obj.category
			delete obj.secure_media_embed
			delete obj.can_mod_post
			delete obj.approved_by
			delete obj.author_premium
			delete obj.thumbnail
			delete obj.edited
			delete obj.author_flair_css_class
			delete obj.author_flair_richtext
			delete obj.gildings
			delete obj.content_categories
			delete obj.is_self
			delete obj.mod_note
			delete obj.link_flair_type
			delete obj.removed_by_category
			delete obj.banned_by
			delete obj.author_flair_type
			delete obj.domain
			delete obj.allow_live_comments
			delete obj.selftext_html
			delete obj.suggested_sort
			delete obj.banned_at_utc
			delete obj.view_count
			delete obj.archived
			delete obj.no_follow
			delete obj.is_crosspostable
			delete obj.pinned
			delete obj.over_18
			delete obj.all_awardings
			delete obj.awarders
			delete obj.media_only
			delete obj.link_flair_template_id
			delete obj.can_gild
			delete obj.spoiler
			delete obj.locked
			delete obj.author_flair_text
			delete obj.treatment_tags
			delete obj.visited
			delete obj.removed_by
			delete obj.num_reports
			delete obj.distinguished
			delete obj.mod_reason_by
			delete obj.removal_reason
			delete obj.link_flair_background_color
			delete obj.is_robot_indexable
			delete obj.report_reasons
			delete obj.discussion_type
			delete obj.send_replies
			delete obj.whitelist_status
			delete obj.contest_mode
			delete obj.mod_reports
			delete obj.author_patreon_flair
			delete obj.author_flair_text_color
			delete obj.permalink
			delete obj.parent_whitelist_status
			delete obj.stickied
			delete obj.subreddit_subscribers
			delete obj.num_crossposts
			delete obj.media
			delete obj.is_video
			delete obj.link_flair_text_color

			let query={_id:obj._id};
			let findResult = await collection.findOne(query);

			if (findResult!=null){
				console.log("" + i + " already exists")
			} else{
				const result = await collection.insertOne(obj)
				console.log("" + result.insertedId + " inserted")
			}
			//console.log(findResult)

			
/*
			try {
				let findResult = await collection.findOne(query);
				if (findResult!=null){
					console.log(findResult._id);
					console.log(findResult._id);
				}
				
			} catch (err) {
				console.error(`Something went wrong: ${err}`)
			}
			*/
			//let findResult= await collection.findOne(query);
			//console.log(findResult);

			//if ()
			//	if (err) console.log("already exists");
			//	const res = await collection.insertOne(obj)
			//	console.log('Inserted '+res.insertedId)
			//})
  				
			//const result = collection.insertOne(obj)

			//console.log('Checkout this JSON! ', result)
		}
}

app.get("/projects",getProjects);
app.get("/mech",getMech);
app.get("/projects/:project",getContent);
app.get("/featured",getFeatured);
app.post("/comment/:project",jsonParser, postComment)

var minutes = 1, the_interval = minutes * 5 * 1000;
setInterval(async function() {
  console.log("I am doing my 5 minutes check");
  let gbUrl="https://www.reddit.com/r/mechmarket/search/.json?q=flair%3A%22group%20buy%22&restrict_sr=1&sort=new&limit=20";
  let icUrl="https://www.reddit.com/r/mechmarket/search/.json?q=flair%3A%22interest%20check%22&restrict_sr=1&sort=new&limit=20";
  fetch(gbUrl)
	.then(res => res.json())
	.then((out) => {
		updateList(out, collection1);
  		
	})
	.catch(err => { throw err });
  fetch(icUrl)
	.then(res => res.json())
	.then((out) => {
		updateList(out, collection2);
  		
	})
	.catch(err => { throw err });
  // do your stuff here
}, the_interval);


app.listen(5001, function(){
	console.log("server is running on port 5001");
});
