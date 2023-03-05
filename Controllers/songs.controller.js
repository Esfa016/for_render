const song = require('../Model/song.schema')

const addSong = async function(req,res){
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
}
const getSongs = async function(req,res){
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
}
const updateSong = async function(req,res){
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


}

const deleteSong = async function(req,res){
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
}

const getAllStats = async function(req,res){
    try{
        const data = await song.aggregate([
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }


                }
            }
        ]);
        const numberOfSongs =  data[0].count

        const totalArtist = await song.aggregate([
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
        const totalAlbums = await song.aggregate([
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
          

        const totalGenre = await song.aggregate([
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

        const totalSongsInGenre = await song.aggregate([
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
        const songsAndAlbums = await song.aggregate([
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
            numberOfSongs: numberOfSongs,
            totalArtist:totalArtist,
            totalAlbums:totalAlbums,
            totalGenre:totalGenre,
            totalSongsInGenre:totalSongsInGenre,
            songsAndAlbums:songsAndAlbums
        })

      

    }
    catch(e){
        return res.status(500).send(e.message)
    }


}

const fillterByGenre = async function(req,res){
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
}

module.exports = {
    getAllStats,
    addSong,
    getSongs,
    deleteSong,
    updateSong,
    fillterByGenre
    
};