quiz_api = {};

/********/
// POI //
quiz_api.poi = {};
quiz_api.poi.url = 'http://kartan.linkoping.se/isms/poi';
quiz_api.poi.args = {
    service: 'wfs',
    request: 'getfeature',
    version: '1.1.0',
}
quiz_api.poi.types = ['simhall_bassang','bad_ute','bibliotek','domstol','flygplatser','golf','konsthall','kyrka','museum','parkomraden','resecentrum','sjukhus','slott','teatrar','universitet'];


// Fetches XML data from url+args as JSON
quiz_api.get_data = function(url, args, callback) 
{
    HTTP.call('GET', url, {params:args},
	function(err, res) {
	    if (err) {
		callback(err);
	    } else {
		// Parse XML data to JSON
		xml2js.parseString(res.content, callback);
	    }
	}
    );
}

// Fetches POI data for all typenames in types
quiz_api.get_poi_data = function(types,callback) 
{
    // GET request arguments
    var args = {};
    for (var a in this.poi.args)
    {
	args[a] = this.poi.args[a];
    }
    args.typename = types.join(',');

    this.get_data(this.poi.url, args,
		  function a(err, result) 
		  {
		      if (!err) {
			  // Extract collection of POIs
			  callback(result['wfs:FeatureCollection']['gml:featureMember']);
		      }
		  });
}

quiz_api.map_location = function() {
    var callback = function(result) {
	var question = {};
	question.answers = [];

	// Pick 4 random locations as answers
	for (var i = 0; i < 4; ++i)
	{
	    // Pick and remove random location
	    var temp = result.splice(Math.floor(Math.random()*result.length), 1)[0];
	    temp = temp[Object.keys(temp)[0]][0];
	    
	    // Extract info from location
	    var poi = {};
	    poi.name = temp['ms:NAMN'][0];
	    poi.category = temp['ms:KATEGORI'][0];
	    //poi.address = temp['ms:ADRESS'][0];

	    // Add location to answers
	    question.answers.push(poi);	    

	    // Pick the first location as the correct answer
	    if (i == 0) {
		var bounds = temp['gml:boundedBy'][0]['gml:Envelope'][0];
		var lower = bounds['gml:lowerCorner'][0].split(' ').reverse();
		var upper = bounds['gml:upperCorner'][0].split(' ').reverse();
	
		// Extract geolocation for the correct answer
		question.loc = {};
		question.loc.lower_corner = proj4(proj4.defs["EPSG:3009"],proj4.defs["EPSG:4326"],lower).reverse();
		question.loc.uppper_corner = proj4(proj4.defs["EPSG:3009"],proj4.defs["EPSG:4326"],upper).reverse();
	    }	    
	}
	coll.insert(question);
    }
    this.get_poi_data(this.poi.types, callback);
}



/*********/
// STATS //

quiz_api.stats = {};
quiz_api.stats.url = 'http://opendata.linkoping.se/ws_opendata/main.asmx/GetFile';
quiz_api.stats.args = {
    CustomKey: '5f9931b807ac47c2bb2375d4cb35e239',
    filename: 'statistik_linkoping_befolkning_be01.px' // dependency 
}
quiz_api.stats.types = ['population'];
quiz_api.stats.filenames = {population: 'statistik_linkoping_befolkning_be01.px'};

quiz_api.stats.getData = function(url,args, callback) {
    // 
    //args.filename = this.filenames[statType];
    // 
    HTTP.call("GET", url, {
        params: args
    }, 
        // callback
        function(err, res) {
	    if (err) {
			callback(err);
        }
        else {
            var xml = res.content;
            xml2js.parseString(xml, callback);
        }
    });
};

quiz_api.getStatData = function(statType, callback){
    this.stats.getData(this.stats.url, this.stats.args, callback);
};

quiz_api.createStatQuestion = function(statType) {
    var callback = function(error, result) {
        var question = {};
        
        if(error) {
            console.log(error);
        } else {

            var px = Stats.parsePxData(result);
            switch(statType) {
                case "population":
                    var answerFacts = Stats.populationStats(px);
                    question.category = answerFacts.category;
                    question.title = answerFacts.title;
                    question.answers = [];

                    correctAnswer = Math.floor(Math.random()*4)+1;
                    
                    for(var i = 0; i < 4; ++i) {
                        var stat = {}
                        if (i === correctAnswer) {
                            stat.value = answerFacts.answer
	                        stat.true = true;   
                        } else {
                            stat.value = Stats.fakeAnAnswer(answerFacts.answer);
                            stat.true = false;
                        }
                        question.answers.push(stat);
                    }
                    break;
                default:
                    break;
            }

        }
        //console.log(question);
        coll.insert(question);
    };
    this.getStatData(statType, callback);
};




