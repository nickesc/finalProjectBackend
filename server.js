const express=require("express");
const bodyParser=require("body-parser");
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

async function getGB(req, res){

	let query={help:"1"}
	let gbCursor = await gbCollection.find();
	let gb = await gbCursor.toArray();

	console.log(gb)

	res.json(gb);

}

async function getIC(req, res){

	let query={help:"1"}
	let icCursor = await icCollection.find();
	let ic = await icCursor.toArray();

	console.log(ic)

	res.json(ic);

}

async function getOneGb(req,res){
	postId=req.params.postId.toLowerCase();

	let query={name:postId}

	let gbCursor = await gbCollection.find(query);
	let gb = await gbCursor.toArray();
	console.log(gb);

	const response=gb;

	res.json(response);
}

async function getOneIc(req,res){
	postId=req.params.postId.toLowerCase();

	let query={name:postId}

	let icCursor = await icCollection.find(query);
	let ic = await icCursor.toArray();
	console.log(ic);

	const response=ic;

	res.json(response);
}

async function updateList(out, collection, i){
		
	var post = out.data.children[i].data


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
		delete post.id
		delete post.ups
		delete post.total_awards_received
		delete post.subreddit

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
		if(urls[d].indexOf("forms")!=-1 && post.link_flair_css_class.indexOf("interest")!=-1){
			infoURL=urls[d]
			break;
		}
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

async function findTitle(post){

	titleString = post.title
	titleString=removeInvalidChars(titleString);

	
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
		"???",
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

	if (titleString.toLowerCase().indexOf("update")!=-1 || titleString.indexOf("PnC")!=-1 || titleString.indexOf("Swift65")!=-1){
		manufIndex=-1;
	}
	
	if (manufIndex==-1) return [-1,""];
	else{
		return [manuf[manufIndex].trim(), titleString.slice(startIndex, endIndex).trim()]
	}
	
}

function removeInvalidChars(string) {
    string=string.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
	string=string.replace("Interest Check","")
	string=string.replace("&amp;","&")
	string=string.replace("is Live","")
	string=string.replace("Official GB Date","")
	string=string.replace("GB Date","")

	
	return string
}

function detectURLs(message) {
	var urlRegex = /(((https?:\/\/)|(www\.))[^(\))(\*)]+)/g;
	return message.match(urlRegex).slice(0,)
}

app.get("/gb",getGB);
app.get("/ic",getIC)
app.get("/gb/:postId",getOneGb);
app.get("/ic/:postId",getOneIc);

var seconds = 60, the_interval = seconds * 1000;
setInterval(async function() {

	let afterGB=["t3_mutcj3","t3_mikzfl"]
	let afterIC=["t3_mamjhm","t3_ms9uuy"]
	let afterText="&after="
	
	console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nUpdating collections...\nRefresh interval: "+seconds+"  seconds\n\n");
	let gbUrl="https://www.reddit.com/r/mechmarket/search/.json?q=flair%3A%22group%20buy%22&restrict_sr=1&sort=new&limit=100";
	let icUrl="https://www.reddit.com/r/mechmarket/search/.json?q=flair%3A%22interest%20check%22&restrict_sr=1&sort=new&limit=100";

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
	console.log("\nServer is running on port 5001");
});
