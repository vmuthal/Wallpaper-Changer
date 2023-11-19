import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createClient } from 'pexels';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import { getWallpaper, setWallpaper } from "wallpaper";
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const app = express()
const port = 7000

app.use(express.json());
async function savePhoto(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = await fileTypeFromBuffer(buffer);
    if (fileType.ext) {
        const outputFileName = `./image.${fileType.ext}`
        var stream = fs.createWriteStream(outputFileName);
        stream.write(buffer);
        stream.end();
        return outputFileName;
    } else {
        console.log('File type could not be reliably determined! The binary data may be malformed! No file saved!')
    }
    return null;
}



app.use('/', express.static(path.join(__dirname, '../dist/')));

/*
app.get('/', (req, res) => {
  res.send('Hello World!')
})*/
app.post('/api/images', async (req, res) => {
    const client = createClient(process.env.PEXELS_API);
    const body = req.body;
    const perPage = body.perPage;
    const page = body.page;
    const query = body.query;
    var response = await client.photos.search({ query: query, per_page: perPage, orientation: 'landscape', page: page });
    res.send(response);
});

app.post('/api/setwallpaper', async (req, res) => {
    var body = req.body;
    var fileSaved = await savePhoto(body.url);
    await setWallpaper(fileSaved);
    res.send({ status: "success" });
});


app.listen(port, () => {
    console.log(`Wallpaper Changer By Vivek Muthal is listening on port ${port}`)
});