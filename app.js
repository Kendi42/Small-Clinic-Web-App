const express = require('express')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')


app.use(express.json())
app.use(express.urlencoded({extended: true}))

const app = express()
const port = 3000

app.use(express.static(__dirname))
app.use(cookieParser())
app.set('views', path.join(__dirname))

app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    session=req.session
    if(session.userid) {
        res.send("Welcome User")
    } else {
        res.sendFile('views/index.html', {root: __dirname})
    }
})


app.post('/login', (req, res) => {
    if (req.body.username == receptionUsername && req.body.password == receptionPassword) {
        session=req.session;
        session.userid=req.body.username 
        console.log(req.session)
        res.send('Hey there, welcome')
    } else {
        res.send('Invalid username or password')
    }
})

app.listen(PORT, () => console.log(`Server Running at port ${PORT}`))

