const express = require('express')
const fs = require('fs')


var app = express()
const port = 3000


app.set('views', path.join(__dirname))

app.set('view engine', 'hbs')
