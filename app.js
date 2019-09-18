var app, express, request, bodyParser, path, mongoose;

path = require('path');
express = require('express');
app = express();
request = require('request');
bodyParser = require('body-parser');
mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('public'));

//Make MongoDB model
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

/*
Campground.create(
    {
        name: 'Granite Hill', 
        image: 'http://www.sapminature.com/wp-content/uploads/2017/06/SapmiNatureCamp_auroraslider.jpg',
        description: "This is an amazing camp!!"
    }, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            console.log('NEWLY CREATED CAMPGROUND:');
            console.log(campground);
        }
    });
*/

app.get('/', function(req, res) {
   res.render('landing'); 
});

app.get('/campgrounds', function(req, res) {
    var namer;
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {campgrounds: campgrounds, namer: namer});
        }
    });
});

app.post('/campgrounds', function(req, res) {
    var namer, campnamer, campsrcer, newCampground, campdescription;
    namer = req.body.name;
    campnamer = req.body.campname;
    campsrcer = req.body.campsrc;
    campdescription = req.body.description;
    newCampground = {name: campnamer, image: campsrcer, description: campdescription};
    if (newCampground.name != undefined) {
        Campground.create(newCampground, function(err, campground) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('NEWLY CREATED CAMPGROUND:');
                    console.log(campground);
                }
            });
    }
    if (namer) {
       Campground.find({}, function(err, campgrounds) {
            if(err) {
                console.log(err);
            } else {
                res.render('index', {namer: namer, campgrounds: campgrounds}); 
            }
    });
}
    
    if (campnamer != undefined && campsrcer != undefined && campnamer !== "" && campsrcer !== "") {
        Campground.find({}, function(err, campgrounds) {
            if(err) {
                console.log(err);
            } else {
                res.render('index', {campgrounds: campgrounds, campnamer: campnamer, campsrcer: campsrcer});
            }
        });
    }
});

app.get('/campgrounds/new', function(req, res) {
    res.render('new');
});

app.get('/campgrounds/:id', function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
       if(err) {
           console.log(err);
       } else {
           res.render('show', {campground: foundCampground});
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('server started');
});