var Song = require('../models/Song');
var User = require('../models/user');
var Playlist = require('../models/Playlist');
var NodeID3 = require('node-id3');
var fs = require('fs');

exports.add_new_song = function(req,res){
    res.render('upload');
};

exports.upload_song = function(req,res){
    //console.log(req.file);
    NodeID3.read(req.file.path,function(err,tags){
        if(err) throw err;
        //console.log(tags);
        var song = new Song({
            title:tags.title,
            album:tags.album,
            artist:tags.artist,
            image:new Buffer(tags.image.imageBuffer,'hex').toString('base64'),
            filepath:req.file.path
        });

        song.save((err)=>{
            if(err) throw err;
            console.log("New song added");
        });
    });
    res.redirect('/');
};

exports.song_list = function(req,res){
    Song.find().exec(function(err,songs){
        if(err) throw err;
        res.render('songs',{songs:songs});
    });
};

exports.view_song = function(req,res){
    Song.findById(req.params.id).exec(function(err,song){
        if(err) throw err;
        res.render('view_song',{song:song});
    });   
};

exports.play_song = function(req,res){
    var id = req.params.id;
    Song.findById(id).exec(function(err,song){
        if(err) throw err;
        var readable = fs.createReadStream(song.filepath);
        var stat = fs.statSync(song.filepath);
        res.writeHead(200,{'Content-Type':'audio/mpeg','Content-Length':stat.size});
        readable.pipe(res);
    });
};
//create favorite songs
//app.get('/userinfo',
 exports.user_info=(req, res)=>{
    User.find({email: req.body.email})
        .populate("favorites")
        .populate("playlists")
        //.populate("songs")
        .then(u=>{
            //console.log(u);
            res.json(u[0]);
        })
        .catch(err=>{
            console.log(err);
            res.status(403).json({error: err});
        });
};

// search song by name and artist
/*app.get('/search', (req, res)=>{
    let songName = req.query.songName;

    let songInfo = {
        name : "",
        artist : "",
        thumbnail : "",
        video : "",
        lyrics : ""
    };

    let youtubeURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${artist}+${songName}&type=video&key=${youtubeAPI}`;

    let lyricsURL = `https://orion.apiseeds.com/api/music/lyric/${artist}/${songName}?apikey=${lyricsAPI}`;
    // console.log(youtubeURL);
    // console.log(lyricsURL);
    fetch(youtubeURL)
        .then(res => res.json())
        .then(response => {
            let result = response.items[0];
            songInfo.video = `https://www.youtube.com/embed/${result.id.videoId}`;
            songInfo.thumbnail = result.snippet.thumbnails.medium.url;

            fetch(lyricsURL)
                .then(res => res.json())
                .then(response => {
                    let info = response.result;
                    let lyrics = info.track.text;

                    songInfo.name = info.track.name;
                    songInfo.artist = info.artist.name;
                    songInfo.lyrics = lyrics;
                    res.json(songInfo);
                }).catch(err=>{
                    console.log("lyricsURL: lyrics not found. ",err);
                    res.status(404).json({error: "Lyrics not found."});
                });
        }).catch(error => {
            console.log("youtubeURL: music video not found. "+error);
            res.status(404).json({error: "Music Video not found."});
        });
});

// show all songs from favorite
// app.post('/favorite', verifyToken, (req, res)=>{

//     db.User.find({name: req.decoded.username})
//         .populate("favorites")
//         .then(user=>{
//             res.json(user[0]);
//         })
//         .catch(err=>{
//             console.log(err);
//             res.json(err);
//         });
// });

// find user and populate Favorite
// function findUserAndPopulateFavorite(res, username){
//     return db.User.find({name: username})
//         .populate("favorites")
//         .then(user=>{
//             res.json(user[0]);
//         })
//         .catch(err=>{
//             console.log("Error find user: ", err);
//             res.status(404).json({error: "Error in finding user's info."});
//         });
// }*/

// add song to favorite
//app.put('/favorite/song', verifyToken, 
exports.favorite_song=(req, res)=>{
    Song.find(req.body.title)
        .then(result=>{
            if(result.length > 0){
                //$addToSet adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array
                User.findOneAndUpdate({email: req.body.email}, {"$addToSet": {"favorites": result[0]._id}}, { "new": true })
                    .then(user=>{
                        // findUserAndPopulateFavorite(res, req.decoded.username);
                        res.status(200).json({message: result[0]._id});
                    })
                    .catch(err=>{
                        console.log("Error update user's favorite songs:", err);
                        res.status(404).json({error: "Error in updating user's Favorite songs."});
                    });
            }
            if(result.length == 0){
                Song.create(req.body.title)
                    .then(songInfo=>{
                        return User.findOneAndUpdate({email: req.body.email}, {"$push": {"favorites": title._id}}, { "new": true })
                        .then(user=>{
                            res.status(200).json({message: title._id});
                        });
                    })
                    .catch(err=>{
                        console.log("Error create new song:", err);
                        res.status(404).json({error: "Error in adding new song to Favorite."});
                    });
            }
        })
        .catch(error=>{
            console.log("Error finding song info: ",error);
            res.status(404).json({error: "Error in finding song info."});
        });
};

// remove song from favorite
//app.delete('/favorite/song', verifyToken, 
exports.delete_favorite_song=(req, res)=>{

    User.findOneAndUpdate({email: req.body.email}, {"$pull": {"favorites": req.body.id}}, { "new": true })
        .then(user=>{
            // findUserAndPopulateFavorite(res, req.decoded.username);
            res.status(200).json({message: "Delete request completed."});
        })
        .catch(err=>{
            console.log("Error deleting song from favorite:", err);
            res.status(404).json({error: "Error in deleting song from favorite."});
        });
};

// create new playlist
//app.post('/createPlaylist', verifyToken, 
exports.createPlaylist=(req, res)=>{
    let plName = req.body.plName;
    let email = req.body.email;
    Playlist.create({name: plName})
        .then(pl=>{
            //console.log(pl);
            User.findOneAndUpdate({email: email}, {"$push": {"playlists": pl._id}}, { "new": true })
                .then(()=>{
                    res.json(pl);
                });
        })
        .catch(err => {
            console.log("Error in creating new playlist: ", err);
            res.status(404).json({error: "Error in creating new playlist."});
        });
};

// select playlist and show songs
//app.post('/playlist', verifyToken, 
exports.playlist=(req, res)=>{
    let plID = req.body.plID;
    Playlist.find({_id: plID})
        .populate("songs")
        .then(playlist=>{
            res.json(playlist);
        })
        .catch(err=>{
            console.log("Error in finding playlist:", err);
            res.status(404).json({error: "Error in finding playlist."});
        });
};

// delete playlist
//app.delete('/playlist', verifyToken, 
exports.delete_playlist=(req, res)=>{
    let plID = req.body.plID;
    let email = req.body.email;
    User.findOneAndUpdate({email: user}, {"$pull": {"playlists": plID}}, { "new": true })
        .populate("playlists")
        .then(user => {
            Playlist.findOneAndRemove({_id: plID}, err=> {
                if (err) res.json(err);

                res.json(user);
            });
        })
        .catch(err=>{
            console.log("Error deleting playlist:", err);
            res.status(404).json({error: "Error in deleting playlist."});
        });
};

// find playlist and populate songs
// function findPlaylistAndPopulateSongs(res, plID){
//     return db.Playlist.find({_id: plID})
//         .populate("songs")
//         .then(playlist=>{
//             res.json(playlist[0]);
//         })
//         .catch(err=>{
//             //res.json(err);
//             console.log("Error in finding playlist:", err);
//             res.status(404).json({error: "Error in finding playlist."});
//         });
// }

// add song to playlist
//app.put('/playlist/song', verifyToken, 
exports.playlist_songs=(req, res)=>{
    let plID = req.body.plID;
    let song = req.body.song;

    Song.find(song)
        .then(result=>{
            if(result.length > 0){
                //$addToSet adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array
                Playlist.findOneAndUpdate({_id: plID}, {"$addToSet": {"songs": result[0]._id}}, { "new": true })
                    .then(playlist=>{
                        // findPlaylistAndPopulateSongs(res, plID);
                        // console.log("result[0]._id", result[0]._id);
                        res.status(200).json({message: result[0]._id});
                    })
                    .catch(err=>{
                        console.log("Error in finding and updating playlist:", err);
                        res.status(404).json({error: "Error in finding and updating playlist."});
                    });
            }
            else{
                Song.create(song)
                    .then(song=>{
                        Playlist.findOneAndUpdate({_id: plID}, {"$push": {"songs": song._id}}, { "new": true })
                        .then(()=>{
                            res.status(200).json({message: song._id});
                        })
                        .catch(err=>{
                            console.log("Error create new song:", err);
                            res.status(404).json({error: "Error in adding new song to playlist."});
                        });
                    })
                    .catch(err=>{
                        console.log("Error create new song:", err);
                        res.status(404).json({error: "Error in adding new song to playlist."});
                    });
            }
        })
        .catch(error=>{
            console.log("Error finding song info: ",error);
            res.status(404).json({error: "Error in finding song info."});
        });
};

/*// remove song from playlist
//app.delete('/playlist/song', verifyToken, 
exports.delete_playlist=(req, res)=>{
    let plID = req.body.plID;
    let songID = req.body.songID;

    Playlist.findOneAndUpdate({_id: plID}, {"$pull": {"songs": songID}}, { "new": true })
        .then(playlist=>{
            // findPlaylistAndPopulateSongs(res, plID);
            res.status(200).json({message: "Deleting song completed."});
        })
        .catch(err=>{
            console.log("Error deleting song from playlist:", err);
            res.status(404).json({error: "Error in deleting song from playlist."});
        });
};

// get all users info
//app.get('/users', 
exports.user=(req, res)=>{
    User.find({}, 'name')
        .then(users=>{
            res.send(users);
        })
        .catch(err=>{
            console.log(err);
            res.status(404).json({error: err});
        })
};*/