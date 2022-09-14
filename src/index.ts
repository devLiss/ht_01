// @ts-ignore
import express,{Request, Response} from 'express'
import {data} from "./data"
import {resolutions} from "./data";
import {videoType} from "./types";
import bodyParser from "body-parser";
import {create} from "domain";
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
        if( !(+req.body.minAgeRestriction <= 18 && +req.body.minAgeRestriction > 1)){
            messages.push({"message": "minAgeRestriction должно быть в диапазоне от 1 до 18",
                "field": "minAgeRestriction"})
        }
        if(req.body.canBeDownloaded && typeof (req.body.canBeDownloaded) != 'boolean'){
            messages.push({"message": "canBeDownloaded должно быть логической переменной",
                "field": "canBeDownloaded"})
        }

        if(req.body.publicationDate){
            let valid = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))$/.test(req.body.publicationDate);
            console.log(valid)
            if(!valid){
                messages.push({"message": "publicationDate некорректная дата",
                    "field": "publicationDate"})
            }
        }
        if(messages.length == 0){
        video.title = req.body.title
            video.author = req.body.author
            video.availableResolutions= req.body.availableResolutions
            video.canBeDownloaded = req.body.canBeDownloaded
            video.minAgeRestriction = req.body.minAgeRestriction
            video.publicationDate = req.body.publicationDate
            res.send(204)
        }
        else{
            res.status(400).send({
                "errorsMessages": messages})
        }
    }
})
app.post('/hometask_01/api/videos',(req:Request, res:Response)=>{
    const createdAt = new Date();
    const pubDate = new Date(createdAt.getDate()+1);
    const video:videoType = {
        id:+(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: pubDate.toISOString(),
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
            for(let i = 0; i < req.body.availableResolutions.length; i++){
                if(!resolutions.includes(req.body.availableResolutions[i])){
                    messages.push({"message": "availableResolutions имеет некорректное значение",
                        "field": "availableResolutions"})
                    break;
                }
            }
        }
        console.log(typeof req.body.canBeDownloaded)
        if(req.body.canBeDownloaded && typeof (req.body.canBeDownloaded) != 'boolean'){
            messages.push({"message": "canBeDownloaded должно быть логической переменной",
                "field": "canBeDownloaded"})
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