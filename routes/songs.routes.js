const router = require('express').Router();
const { json } = require('express');
const { number } = require('joi');
const song = require('../Model/song.schema');
const createSongValidator = require('../Midlleware/create_song.middleware').createValidator
const deleteValidator = require('../Midlleware/create_song.middleware').deletValidator
const updateValidator = require('../Midlleware/create_song.middleware').updateValidator
const genreValidator = require('../Midlleware/create_song.middleware').genreValidator

router.post('/', createSongValidator, async (req, res) => {
    try {
        const data = await song.create(req.body)
        return res.status(200).json({
            success: true,
            data: data
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while creating data'
        })
    }

})

router.get('/', async (req, res) => {
    try {
        const data = await song.find()
        return res.status(200).json({
            success: true,
            data: data
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while loading data'
        })
    }
})

router.delete('/', deleteValidator, async (req, res) => {
    const id = req.query.id;
    try {
        const data = await song.deleteOne({ _id: id });
        if (data.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                data: 'there is no song by this id'
            })
        }
        return res.status(200).json({
            success: true,
            data: 'deleted   '
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while deleting data'
        })
    }
})

router.put('/', deleteValidator, updateValidator, async (req, res) => {
    const id = req.query.id;
    try {
        const data = await song.updateOne({ _id: id }, req.body)
        if (data.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                data: 'there is no song by this id'
            })
        }
        return res.status(200).json({
            success: true,
            data: 'successfully updated'
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while updating data'
        })
    }

})


router.get('/getTotalNumbers', async (req, res) => {
    try {
        const data = await song.aggregate([
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }


                }
            }
        ])
        return res.status(200).json({
            success: true,
            data: data[0].count
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while loading data'
        })
    }
})

router.get('/getTotalArtists', async (req, res) => {

    try {
        const data = await song.aggregate([
            {
                $group: {
                    _id: null,
                    uniqueValues: { $addToSet: "$artist" }
                }
            },

            {
                $project: {
                    _id: 0,
                    totalArtists: { $size: "$uniqueValues" }
                }
            }
        ])
        return res.status(200).json({
            success: true,
            data: data
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while loading data'
        })
    }
})

router.get('/getTotalAlbums', async(req,res)=>{
    try{
        const data = await song.aggregate([
            {
                $group:{
                    _id:null,
                    uniqueAlbums:{$addToSet:"$album"}
                },
                
            },
            {
                $project:{
                    _id:0,
                    totalAlubms:{$size:"$uniqueAlbums"}

                }
            }
        ])

        return res.status(200).json({
            success: true,
            data: data
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while loading data'
        })
    }
})


router.get('/getTotalGenre', async(req,res)=>{
    try{
      const data = await song.aggregate([
        {
            $group:{
                _id:0,
                uniqueGenre:{$addToSet:"$genre"}
            },
        },
        {
            $project:{
                _id:0,
                totalGenre:{$size:"$uniqueGenre"}
            }
        }
      ])
      return res.status(200).json({
        success:true,
        data:data
      })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while loading data'
        })
    }
})

router.get('/getTotalSongsInGenre',async(req,res)=>{
    try{
        const data = await song.aggregate([
            {
                $group:{
                    _id:"$genre",
                    songs:{$sum:1}
                }
            },
            {
                $project:{
                    genre:"$_id",
                    songs:1,
                    _id:0
                }
            }
        ])
        return res.status(200).json({
            success:true,
            data:data
        })
    }
    
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while loading data'
        })
    }
})
router.get('/getSongsAndAlbums',async (req,res)=>{
    try{
      const data =await song.aggregate([
        {
            $group:{
              _id:"$artist",
              albums:{$addToSet:"$album"},
              songs:{$sum:  1}
            }
        },
        {
            $project:{
                artist:"$_id",
                albums:{$size:"$albums"},
                songs:"$songs",
                _id:0,
                
            }
        }
      ])
      return res.status(200).json({
        success:true,
        data:data
      })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while loading data'
        })
    }
})

router.get('/filterByGenre',  genreValidator, async(req,res)=>{
    const genre = req.query.genre
    try{
          const data = await song.aggregate([
            {
                $match:{
                    genre:genre
                }
            },
           
            {
                $project:{
                    _id:0,
                    genre:0
                   
                }
            }
          ])
          if(data.length ===0){return res.status(404).json({
            success:false,
            data:'no songs corrsponds to the genre specified'
          })}
          return res.status(200).json({
            success:true,
            data:data
          })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            data:'error while loading data'
        })
    }
})


module.exports = router;