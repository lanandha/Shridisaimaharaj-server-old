var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

  var upload = multer({ storage: storage });
mongoose.connect("mongodb://localhost:27017/music", { useNewUrlParser: true,useUnifiedTopology: true });

var musicController = require('../controllers/musicController');

router.get('/addsong',musicController.add_new_song);
router.post('/upload',upload.single('song'),musicController.upload_song);
router.get('/songs',musicController.song_list);
router.get('/songs/:id',musicController.view_song);
router.get('/songs/:id/play',musicController.play_song);
router.get('/songs/user-info',musicController.user_info);
router.put('/songs/favorite-song',musicController.favorite_song);
router.delete('/songs/delete-favorite-song',musicController.delete_favorite_song);
router.post('/songs/createplaylist',musicController.createPlaylist);
router.post('/songs/playlist',musicController.playlist);
router.delete('/songs/delete-playlist',musicController.delete_playlist);
router.put('/songs/playlist-songs',musicController.playlist_songs);


module.exports = router;