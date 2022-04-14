const filler = '<';

var NUMERIC_REGEXP = /[0-9]/g;
var NUMERIC_VALUE_BASE = 10;
var ALPHABET_REGEXP = /[a-z]/g;
var ALPHABET_START = 'a'.charCodeAt(0);
var ALPHABET_VALUE_START = 10;
var WEIGHTS = [7, 3, 1];
var FILLER = '<';
var DOCUMENT_TYPE = 'P';
var MAX_LINE_LENGTH = 44;


const calculateCheckDigit = function (str) {
    var arr = str.split('');
    var valArr = arr.map(function (character, index) {
        var char = character.toLowerCase();
        var weight = WEIGHTS[index % 3];
        var value = 0;
        if (char.match(ALPHABET_REGEXP) != null) {
            value = char.charCodeAt(0) - ALPHABET_START + ALPHABET_VALUE_START;
        }
        if (char.match(NUMERIC_REGEXP) != null) {
            value = parseInt(char, NUMERIC_VALUE_BASE);
        }
        if (char === FILLER) {
            value = 0;
        }
        return value * weight;
    });
    return valArr.reduce(function (acc, value) { return acc + value; }, 0) % NUMERIC_VALUE_BASE;
};

const calculateFirstRow = (doc_type, nationality, dni_number) => {
    let line = new Array(30).fill(filler)
    doc_type = Array.from(String(doc_type))
    nationality = Array.from(String(nationality))
    dni_number = Array.from(String(dni_number))

    Array.prototype.splice.apply(line, [0, 1].concat(doc_type))
    Array.prototype.splice.apply(line, [2, 5].concat(nationality))
    Array.prototype.splice.apply(line, [5, 15].concat(dni_number))

    for(let i = 0; i < 30; i++){
        if(line[i] === '<' || line[i] === undefined){
            line[i] = filler;
        }
    }

    const checkDigit = calculateCheckDigit(dni_number.join(""))

    line[14] = checkDigit.toString();

    return line;
}

const calculateSecondRow = (birthdate, sex, expiration, nationality) => {
    let line = new Array(30).fill(filler)
    birthdate = Array.from(String(birthdate))
    sex = Array.from(String(sex))
    expiration = Array.from(String(expiration))
    nationality = Array.from(String(nationality))

    Array.prototype.splice.apply(line, [0, 5].concat(birthdate))
    Array.prototype.splice.apply(line, [7, 7].concat(sex))
    Array.prototype.splice.apply(line, [8, 13].concat(expiration))
    Array.prototype.splice.apply(line, [15, 17].concat(nationality))

    for(let i = 0; i < 30; i++){
        if(line[i] === '<' || line[i] === undefined){
            line[i] = filler;
        }
    }

    const checkDigit_1 = calculateCheckDigit(birthdate.join(""))
    const checkDigit_2 = calculateCheckDigit(expiration.join(""))

    line[6] = checkDigit_1.toString();
    line[14] = checkDigit_2.toString();

    return line;
}

const calculateThirdRow = (names, surnames) => {
    let line = new Array(30).fill(filler)

    surnames = surnames.replace(' ', '<');
    names = names.replace(' ', '<');
    let result = surnames + '<<' + names

    result = Array.from(result);

    Array.prototype.splice.apply(line, [0, 29].concat(result))

    for(let i = 0; i < 30; i++){
        if(line[i] === '<' || line[i] === undefined){
            line[i] = filler;
        }
    }

    return line;
}

const generateMRZ = ({ doc_type, dni_number, nationality, expiration, sex, birthdate, names, surnames }) => {
    let mrz = [
        [],
        [],
        []
    ]
    
    mrz[0] = calculateFirstRow(doc_type, nationality, dni_number).join("")
    mrz[1] = calculateSecondRow(birthdate, sex, expiration, nationality).join("")
    mrz[2] = calculateThirdRow(names, surnames).join("")
    
    let parts = [
        mrz[0].slice(5, 29).join(""),
        mrz[1].slice(0, 6).join(""),
        mrz[1].slice(8, 14).join(""),
        mrz[1].slice(18, 28).join(""),
    ]

    console.log(parts.join(""))
    const compositeCheckDigit = calculateCheckDigit(parts.join(""))

    mrz[1][29] = compositeCheckDigit.toString();

    return mrz;
}

module.exports = { generateMRZ }