const express = require('express')
const { generateMRZ } = require('./mrz-calculator')
var bodyParser = require('body-parser')
var cors = require('cors')

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(process.env.PORT ||  3000, () => {
    console.log('Server up')
});

app.get('/generate', (req, res) => {

    const code = generateMRZ(
        {
            doc_type: 'ID',
            dni_number: req.body.dni || '12345678',
            nationality: 'ARG',
            expiration: req.body.expiration || '22122022',
            sex: req.body.sex || 'M',
            birthdate: req.body.birthdate || '22012022',
            names: req.body.names || 'NAME NAME',
            surnames: req.body.surnames || 'SURNAME',
        }
    );

    res.status(200).send({ code: code.join('\n') });
})