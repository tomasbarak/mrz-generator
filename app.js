const express = require('express')
const { generateMRZ } = require('./mrz-calculator')
var bodyParser = require('body-parser')



const app = express();


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.listen(process.env.PORT || 3000, () => {
    console.log('Server up')
});

app.get('/generate', (req, res) => {

    const code = generateMRZ(
        {
            doc_type: 'ID',
            dni_number: req.body.dni,
            nationality: 'ARG',
            expiration: req.body.expiration,
            sex: req.body.sex,
            birthdate: req.body.birthdate,
            names: req.body.names,
            surnames: req.body.surnames,
        }
    );

    res.status(200).send({ code: code.join("") });
})