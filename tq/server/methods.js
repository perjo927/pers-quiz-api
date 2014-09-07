



Meteor.methods({
    map_location: function() {
	quiz_api.map_location();
    },
    px: function(statType) {
        
        var statType = "population";
        // Folkmängd efter ålder, år, kön
        quiz_api.createStatQuestion(statType);
        
        return "success";
    }
});