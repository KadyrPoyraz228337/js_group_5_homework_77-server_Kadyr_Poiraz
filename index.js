const path = require('path');

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nanoid = require('nanoid');

const config = require('./config');
const fileDb = require('./fileDb');

const storage = multer.diskStorage({
    destination: (req, file, cd) => cd(null, config.uploadPath),
    filename: (req, file, cd) => cd(null, nanoid() + path.extname(file.originalname))
});

const upload = multer({storage});

const app = express();

app.use(cors());
app.use(express.static('public'));

app.get('/messages', (req, res) => {
   res.send(fileDb.getMessages());
});

app.post('/messages', upload.single('image') ,async (req, res)=> {
   let message = req.body;

    if(!message.description) {
        res.status(400).send({error: 'dont have description'});
        return;
    }

    if(req.file) {
        message.image = req.file.filename;
    }

    await fileDb.addNewMessage(message);

    res.send(message.id);
});

const run = async () => {
    await fileDb.init();
    app.listen(config.port, () => {
        console.log(`server start on ${config.port}`);
    });
};

run().catch(e => {
    console.log(e);
});