import express from "express";
import ht from "http"
import path from "path";
import { fileURLToPath } from 'url';

const app = express()
const http = ht.createServer(app);
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/src/index.html');
})

app.use(express.static('public'))

http.listen(process.env.PORT || 2000, () => {
    console.log('listening on port: 3000');
    console.log(" "+ new Date);
})
