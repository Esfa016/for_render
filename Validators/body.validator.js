const { object } = require('joi');
const joi = require('joi');
const allowedGenres = require('../Reusables/genreTypes');
const createSongSchema = joi.object({
    title: joi.string()
    .required(),
    artist: joi.string()
    .required(),
    album: joi.string()
    .required(),
    genre: joi.string().required().valid(...Object.values(allowedGenres))
    
});

const updateSongSchema = joi.object({
    title: joi.string()
    .optional(),
    artist: joi.string()
    .optional(),
    album: joi.string()
    .optional(),
    genre: joi.string().optional().valid(...Object.values(allowedGenres))
    
});

const validateQueryParams = joi.object({
    id: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('invalid id'))
})

const validateGenere = joi.object({
     genre: joi.string().required().valid(...Object.values(allowedGenres))
})

module.exports = {
    createSongSchema : createSongSchema,
    validateQueryParams:validateQueryParams,
    updateSongSchema:updateSongSchema,
    validateGenere:validateGenere
}