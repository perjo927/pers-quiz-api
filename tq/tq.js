if(Meteor.isClient) {
    Template.hello.events({
        'click button': function() {
            Meteor.call("px", "population", function(err, res) {
                console.log("err", err);
                console.log("res", res);
            });
            Meteor.call('map_location');
        }
    });
}
if(Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
        //ConsoleMe.enabled = true;
        proj4.defs["EPSG:3009"] = "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    });
}