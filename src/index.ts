// @ts-ignore
import express,{Request, Response} from 'express'
import {data} from "./data"
import {resolutions} from "./data";
import {videoType} from "./types";
import bodyParser from "body-parser";
const app = express()
const port = process.env.PORT || 5000
const parserMiddleware = bodyParser({})
app.use(parserMiddleware);

app.get('/',(req:Request, res:Response)=>{
    res.send('Hello!')
})

app.get('/hometask_01/api/videos',(req:Request, res:Response)=>{
    res.send(data)
})
app.get('/hometask_01/api/videos/:id',(req:Request, res:Response)=>{

    let video = data.find(v => v.id === +req.params.id)
    if(!video){
        res.send(404)
    }
    res.send(video)
})
app.delete('/hometask_01/api/videos/:id',(req:Request, res:Response)=>{
    for(let i=0; i < data.length; i++){
        if(data[i].id === +req.params.id) {
            data.splice(i,1);
            res.send(204);
            return;
        }
    }
    res.send(404)
})
app.delete('/hometask_01/api/testing/all-data',(req:Request, res:Response)=>{
            res.status(204).send([]);
})
app.put('/hometask_01/api/videos/:id',(req:Request, res:Response)=>{
    const video = data.find(v => v.id === +req.params.id)
    let messages = [];
    if(!video)
        res.send(404)
    else{

        if(!req.body.title || !req.body.title.trim()){
            messages.push({"message": "Title не может быть пустым",
                "field": "title"})
        }
        if(req.body.title.length > 40){
            messages.push({"message": "Title не может больше 40 символов",
                "field": "title"})
        }
        if(!req.body.author || !req.body.author.trim()){
            messages.push({"message": "Author не может быть пустым",
                "field": "author"})
        }
        if(req.body.author.length > 20){
            messages.push({"message": "Author не может больше 20 символов",
                "field": "author"})
        }
        if(req.body.minAgeRestriction.length > 18 && req.body.minAgeRestriction.length < 1){
            messages.push({"message": "minAgeRestriction должно быть в диапазоне от 1 до 18",
                "field": "minAgeRestriction"})
        }

        video.title = req.body.title
            video.author = req.body.author
            video.availableResolutions= req.body.availableResolutions
            video.canBeDownloaded = req.body.canBeDownloaded
            video.minAgeRestriction = req.body.minAgeRestriction
            video.publicationDate = req.body.publicationDate

        res.send(204)
    }
})
app.post('/hometask_01/api/videos',(req:Request, res:Response)=>{
    const video:videoType = {
        id:+(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: req.body.availableResolutions
    }
    let messages = [];

        if(!req.body.title || !req.body.title.trim()){
            messages.push({"message": "Title не может быть пустым",
                "field": "title"})
        }
        if(req.body.title && req.body.title.length > 40){
            messages.push({"message": "Title не может больше 40 символов",
                "field": "title"})
        }
        if(!req.body.author || !req.body.author.trim()){
            messages.push({"message": "Author не может быть пустым",
                "field": "author"})
        }
        if(req.body.author && req.body.author.length > 20){
            messages.push({"message": "Author не может больше 20 символов",
                "field": "author"})
        }
        if(req.body.availableResolutions){
            if(req.body.availableResolutions.length <= 0){
                messages.push({"message": "availableResolutions должно иметь хотя бы 1 значение",
                    "field": "availableResolutions"})
            }
        }


    if(messages.length == 0){
        data.push(video);
        res.status(201).send(video);
    }
    else{
        res.status(400).send({
            "errorsMessages": messages})
    }

})
app.listen(port,()=>{
    console.log(`Listening port ${port}`);
})