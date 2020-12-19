const express = require('express')
var path = require('path');
const app = express()
const port = 8081

var router = express.Router();





var compression = require('compression')

router.use(compression());

router.use(express.static('../public'))

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname+'/../public/index.html'));
})

app.use('/fe', router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})