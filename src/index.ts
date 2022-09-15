// @ts-ignore
import express,{Request, Response} from 'express'
import bodyParser from "body-parser";
import {videoRouter} from "./routes/videoRouter";
import {testingRouter} from "./routes/testingRouter";
const app = express()
const port = process.env.PORT || 5000
const parserMiddleware = bodyParser({})
app.use(parserMiddleware);
app.use('/hometask_01/api/', testingRouter)
app.use('/hometask_01/api/videos', videoRouter)
app.get('/',(req:Request, res:Response)=>{
    res.send('Hello!')
})



app.listen(port,()=>{
    console.log(`Listening port ${port}`);
})