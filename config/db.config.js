const mongoose = require('mongoose')
const connectMongoose = async function (){
    mongoose.connect(process.env.MOGOOSE_URL)
    .then((conn)=>{
        console.log('server up an running')
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = connectMongoose()