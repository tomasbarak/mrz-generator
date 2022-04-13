const express = require('express')
const { generate } = require('mrz-gen')
var bodyParser = require('body-parser')



const app = express();


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.listen(process.env.PORT || 3000, () => {
    console.log('Server up')
});

app.get('/generate', (req, res) => {

    const code = generate({
        user: {
            firstName: req.body.firstName + ' ' + req.body.secondName || "",
            lastName: req.body.lastName || "",
            passportNumber: req.body.dni || "",
            countryCode: 'ARG',
            nationality: 'ARG',
            birthday: req.body.birthday || "",
            gender: req.body.sex || "",
            validUntilDay: req.body.expiration || "",
            personalNumber: req.body.identificationNumber || ""
        },
    });

    res.status(200).send({ code: String(code) });
})