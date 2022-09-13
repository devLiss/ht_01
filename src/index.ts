// @ts-ignore
import express,{Request, Response} from 'express'
import {data} from "./data"
const app = express()
const port = process.env.PORT || 5000

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
app.listen(port,()=>{
    console.log(`Listening port ${port}`);
})