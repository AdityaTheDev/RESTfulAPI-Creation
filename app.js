const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const ejs=require('ejs')

const app=express()

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB",{useNewUrlParser:true})

const articleSchema={
     title:String,
     content:String
}

const Article=mongoose.model("Article",articleSchema);


//request for all articles

app.route("/articles").
get(function(req,res){

    Article.find().then(found=>{
        res.send(found);
    }).
    catch(err=>{
        res.send(err);
    })

}).
post((req,res)=>{

    const newArticle=new Article({
     title:req.body.title,
     content:req.body.content
    })
 
    newArticle.save().then(err=>{
     if(!err){
         res.send("Saved successfully")
     }
     else{
         res.send(err)
     }
    })
 }).
 delete((req,res)=>{
    Article.deleteMany().then(err=>{
        if(!err){
            res.send("successfully deleted all the articles");
        }
        else{
            res.send(err)
        }
    })
})

//request for specific article

app.route('/articles/:articleTitle').
get(function(req,res){
    Article.findOne({title:req.params.articleTitle}).then(foundArticle=>{

        if(foundArticle){
            res.send(foundArticle)
        }
        else{
            res.send("No article was found");
        }
    }).catch(err=>{
        if(err){
            res.send(err);
        }
    })
}).
put(function(req,res){
    Article.updateOne({title:req.params.articleTitle},{title:req.body.title, content:req.body.content}).then(done=>{
        if(done){
            res.send("Successful PUT");
        }
        else{
            res.send("not successful PUT");
        }
    }).catch(err=>{
        if(err){
            res.send(err);
        }
    })
}).
patch(function(req,res){
    Article.updateOne({title:req.params.articleTitle},{$set:req.body}).then(done=>{
        if(done){
            res.send("PATCH successful")
        }
        else{
            res.send("PATCH not successful")
        }
    }).catch(err=>{
        if(err){
            res.send(err);
        }
    })
}).
delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle}).then(del=>{
        if(del){
            res.send("DELETE successful")
        }
        else{
            res.send("DELETE unsuccessful")
        }
    }).catch(err=>{
        if(err){
            res.send(err)
        }
    })
})



// app.get('/articles',function(req,res){

//     Article.find().then(found=>{
//         res.send(found);
//     }).
//     catch(err=>{
//         res.send(err);
//     })

// })

// app.post('/articles',(req,res)=>{

//    const newArticle=new Article({
//     title:req.body.title,
//     content:req.body.content
//    })

//    newArticle.save().then(err=>{
//     if(!err){
//         res.send("Saved successfully")
//     }
//     else{
//         res.send(err)
//     }
//    })
// })

// app.delete('.delete',(req,res)=>{
//     Article.deleteMany().then(err=>{
//         if(!err){
//             res.send("successfully deleted all the articles");
//         }
//         else{
//             res.send(err)
//         }
//     })
// })

app.listen(3000,function(){
    console.log("server started");
})