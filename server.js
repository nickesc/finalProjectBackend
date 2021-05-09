const express=require("express");
const bodyParser=require("body-parser");
//const fs = require ("fs-extra");
const cors=require("cors");
const fetch = require("node-fetch");

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nick:portPass@cluster0.onn1x.mongodb.net/portfolio?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });

const app=express();
const jsonParser=bodyParser.json();
app.use(cors());

let database= null;
let gbCollection=null;
let icCollection=null;
async function connectDB(){
	await client.connect();
	database = client.db("mechmarket");
	gbCollection = database.collection("groupbuy");
	icCollection = database.collection("interest");

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
async function getGB(req, res){
	//projection={title:1, url:1, help:1}

	let query={help:"1"}
	let gbCursor = await gbCollection.find();
	let gb = await gbCursor.toArray();

	console.log(gb)

	res.json(gb);

}

async function getIC(req, res){
	//projection={title:1, url:1, help:1}

	let query={help:"1"}
	let icCursor = await icCollection.find();
	let ic = await icCursor.toArray();

	console.log(ic)

	res.json(ic);

}

async function updateList(out, collection, i){
		
	var post = out.data.children[i].data

	//post._id=post.name;

	if (true){ // in an if statement so i could collapse it in IDE
		delete post.approved_at_utc;
		delete post.saved;
		delete post.mod_reason_title;
		delete post.gilded;
		delete post.clicked;
		delete post.link_flair_richtext;
		delete post.hidden;
		delete post.pwls;
		delete post.top_awarded_type;
		delete post.hide_score;
		delete post.quarantine;
		delete post.upvote_ratio
		delete post.author_flair_background_color
		delete post.subreddit_type
		delete post.media_embed
		delete post.author_flair_template_id
		delete post.is_original_content
		delete post.user_reports
		delete post.secure_media
		delete post.is_reddit_media_domain
		delete post.is_meta
		delete post.category
		delete post.secure_media_embed
		delete post.can_mod_post
		delete post.approved_by
		delete post.author_premium
		delete post.thumbnail
		delete post.edited
		delete post.author_flair_css_class
		delete post.author_flair_richtext
		delete post.gildings
		delete post.content_categories
		delete post.is_self
		delete post.mod_note
		delete post.link_flair_type
		delete post.removed_by_category
		delete post.banned_by
		delete post.author_flair_type
		delete post.domain
		delete post.allow_live_comments
		delete post.selftext_html
		delete post.suggested_sort
		delete post.banned_at_utc
		delete post.view_count
		delete post.archived
		delete post.no_follow
		delete post.is_crosspostable
		delete post.pinned
		delete post.over_18
		delete post.all_awardings
		delete post.awarders
		delete post.media_only
		delete post.link_flair_template_id
		delete post.can_gild
		delete post.spoiler
		delete post.locked
		delete post.author_flair_text
		delete post.treatment_tags
		delete post.visited
		delete post.removed_by
		delete post.num_reports
		delete post.distinguished
		delete post.mod_reason_by
		delete post.removal_reason
		delete post.link_flair_background_color
		delete post.is_robot_indexable
		delete post.report_reasons
		delete post.discussion_type
		delete post.send_replies
		delete post.whitelist_status
		delete post.contest_mode
		delete post.mod_reports
		delete post.author_patreon_flair
		delete post.author_flair_text_color
		delete post.permalink
		delete post.parent_whitelist_status
		delete post.stickied
		delete post.subreddit_subscribers
		delete post.num_crossposts
		delete post.media
		delete post.is_video
		delete post.link_flair_text_color
		delete post.likes
		delete post.downs
		delete post.created
		delete post.wls
		delete post.num_comments
		delete post.link_flair_text

	}

	let titles = await findTitle(post);
	
	post.type=titles[0];
	post._id=titles[1];
	post.setName=titles[1]

	if (post.type!=-1){
		
		post.imageURL = await findImage(post);
		post.infoURL = await findInfo(post);
		
		let query={_id:post._id};
		let findResult = await collection.findOne(query);

		if (findResult!=null){
			console.log("" + post._id + " already exists")
		} else{
			try{
				var result = await collection.insertOne(post)

				extra=post.imageURL
				if (extra=="https://i.imgur.com/3KKc9Ox.png"){
					extra="missing image"
				}
				console.log("" + result.insertedId + " inserted with " + extra + " | "+post.infoURL)
			} catch (err){
				console.log("" + post._id + " already exists")
			}
			
		}
	}

		
}

async function findInfo(post){
	bodyString=post.selftext;
	urls=detectURLs(bodyString)

	let infoURL=""

	for (d=0;d<urls.length;d++){
		if (urls[d].indexOf("geekhack")!=-1 || urls[d].indexOf("cannonkeys")!=-1 ){
			infoURL=urls[d]
		}
	}

	if (infoURL==""){
		infoURL="none"
	}

	return infoURL
}

async function findImage(post){
	bodyString=post.selftext;


	urls=detectURLs(bodyString)

	//console.log(urls)
	for (q=0;q<urls.length;q++){
		if (urls[q].indexOf(".png")!=-1){
			return urls[q]
		}
		else if (urls[q].indexOf(".jpg")!=-1){
			return urls[q]
		}
	}
	
	return "https://i.imgur.com/3KKc9Ox.png";
}

function detectURLs(message) {
	var urlRegex = /(((https?:\/\/)|(www\.))[^(\))(\*)]+)/g;
	return message.match(urlRegex).slice(0,)
  }

async function findTitle(post){

	titleString = post.title
	//console.log(titleString)
	
	let manuf = [
		" GMK ",
		" ePBT ",
		" EPBT ",
		" SA ",
		" IFK ",
		" Infinikey ",
		" Geekark ",
		" geekark ",
		" KAT ",
		" KAM ",
		" DSA ",
		" DSS "
	]
	var blacklist = [
		"cable",
		"bag",
		"deskmat"

	]	
	var endlist = [
		"-",
		"—",
		"|",
		"|",
		":",
		"(",
		"("

	]

	let manufIndex=-1
	let startIndex=5
	let endIndex=-1
	
	for (l=0; l<manuf.length; l++){
		if (titleString.search(manuf[l])!=-1){
			manufIndex=l
			startIndex=titleString.search(manuf[l])+1
			break;
		}
	}

	for (r=0; r<blacklist.length;r++){	
		if (titleString.toLowerCase().search(blacklist[r])!=-1){
			manufIndex=-1
			break;
		}
	}
	
	for (x=0;x<endlist.length; x++){
		if (titleString.indexOf(endlist[x],startIndex)!=-1){
			if (endIndex>titleString.indexOf(endlist[x],startIndex) || endIndex==-1){
				endIndex=titleString.indexOf(endlist[x],startIndex)}
		}
	}
	if (endIndex==-1){
		manufIndex=-1;
	}

	if (titleString.toLowerCase().indexOf("update")!=-1){
		manufIndex=-1;
	}
	
	if (manufIndex==-1) return [-1,""];
	else{
		return [manuf[manufIndex].trim(), titleString.slice(startIndex, endIndex).trim()]
	}
	
}

//app.get("/projects",getProjects);
app.get("/gb",getGB);
app.get("/ic",getIC)
//app.get("/projects/:project",getContent);
//app.get("/featured",getFeatured);
//app.post("/comment/:project",jsonParser, postComment)

var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(async function() {

	let afterGB=["t3_mutcj3","t3_mikzfl"]
	let afterIC=["t3_mamjhm","t3_ms9uuy"]
	let afterText="&after="
	
	console.log("I am doing my 5 minutes check");
	let gbUrl="https://www.reddit.com/r/mechmarket/search/.json?q=flair%3A%22group%20buy%22&restrict_sr=1&sort=new&limit=100";
	let icUrl="https://www.reddit.com/r/mechmarket/search/.json?q=flair%3A%22interest%20check%22&restrict_sr=1&sort=new&limit=100";
	
	//third page

	fetch(gbUrl+afterText+afterGB[1])
		.then(res => res.json())
		.then((out) => {
			for (i=0; i<out.data.children.length; i++){
				updateList(out, gbCollection, i);
			}
		}
	)
		.catch(err => { throw err });
	fetch(icUrl+afterText+afterIC[1])
		.then(res => res.json())
		.then((out) => {
			for (i=0; i<out.data.children.length; i++){
				updateList(out, icCollection, i);
			}
		}
	)
		.catch(err => { throw err });
	
	//second page

	fetch(gbUrl+afterText+afterGB[0])
		.then(res => res.json())
		.then((out) => {
			for (i=0; i<out.data.children.length; i++){
				updateList(out, gbCollection, i);
			}
		}
	)
		.catch(err => { throw err });
	
	fetch(icUrl+afterText+afterIC[0])
		.then(res => res.json())
		.then((out) => {
			for (i=0; i<out.data.children.length; i++){
				updateList(out, icCollection, i);
			}
		}
	)
		.catch(err => { throw err });

	//first page

	fetch(gbUrl)
		.then(res => res.json())
		.then((out) => {
			for (i=0; i<out.data.children.length; i++){
				updateList(out, gbCollection, i);
			}
		}
	)
		.catch(err => { throw err });
	fetch(icUrl)
		.then(res => res.json())
		.then((out) => {
			for (i=0; i<out.data.children.length; i++){
				updateList(out, icCollection, i);
			}
		}
	)
		.catch(err => { throw err });

	
	
	



}, the_interval);


app.listen(5001, function(){
	console.log("server is running on port 5001");
});
