const express = require('express')
const config = require('config')
const mongoose = require('mongoose')


const app = express()

app.use(express.json())
app.use('/api/payment', require('./routes/pay.routes'))

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useUnifiedTopology: true
        })
    } catch (e) {
        console.log('Sever Error', e.message)
        process.exit(1)
    }
}

start()

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`))
