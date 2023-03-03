const createSongSchema = require('../Validators/body.validator').createSongSchema;
const validateQueryParams = require('../Validators/body.validator').validateQueryParams;
const updateSongSchema = require('../Validators/body.validator').updateSongSchema;
const validateGenere = require('../Validators/body.validator').validateGenere;
const createValidator= (req,res,next)=>{
    const {error,value} = createSongSchema.validate(req.body);
    if(error){
        return res.status(400).send(error.message)
    }
    next();
}

const deleteValidator = (req,res,next)=>{
    const {error,value} = validateQueryParams.validate(req.query)
    if(error){
        return res.status(400).send(error.message)
    }
    next()
}

const updateValidator = (req,res,next)=>{
    const {error,value} = updateSongSchema.validate(req.body)
    if(error){
        
        return res.status(400).send(error.message)
    }
    next()
}

const genreValidator = (req,res,next)=>{
    const {error,value} =  validateGenere.validate(req.query);
    if(error){
        return res.status(400).send(error.message)
    }
    next()
}
module.exports = {
    createValidator:createValidator,
    deletValidator:deleteValidator,
    updateValidator:updateValidator,
    genreValidator:genreValidator
}


