const router = require('express').Router();
const { json } = require('express');
const { number } = require('joi');
const song = require('../Model/song.schema');
const createSongValidator = require('../Midlleware/create_song.middleware').createValidator
const deleteValidator = require('../Midlleware/create_song.middleware').deletValidator
const updateValidator = require('../Midlleware/create_song.middleware').updateValidator
const genreValidator = require('../Midlleware/create_song.middleware').genreValidator
const songsController = require('../Controllers/songs.controller');
const getAllStats = require('../Controllers/songs.controller').getAllStats;

router.post('/', createSongValidator, songsController.addSong)

router.get('/', songsController.getSongs )

router.delete('/', deleteValidator, songsController.deleteSong )

router.put('/', deleteValidator, updateValidator, songsController.updateSong )






router.get('/filterByGenre',  genreValidator, songsController.fillterByGenre )

router.get('/stats',getAllStats)


module.exports = router;