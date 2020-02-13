const express = require('express');
const cors = require('cors');

const config = require('./config');
const fileDb = require('./fileDb');

const app = express();

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
   res.send('1132123');
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