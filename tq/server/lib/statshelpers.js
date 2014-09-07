Stats = {}

Stats.parsePxData = function(input) {
    var pxData = input['PXFileData']['Data'][0];
    var pxStr = decode64(pxData);
    var px = new Px(pxStr);
    return px;
};

Stats.fakeAnAnswer = function(answer) {
    answer = parseInt(answer);
    var distribution = (Math.random() * answer);
    var fakeAnswer = 0;
    
    coinFlip = Math.random();
    if (coinFlip<0.5){
        // add random interval as percentage of answer
        fakeAnswer = answer + distribution;
    } else {
        // subtract random interval and add to questionset
        fakeAnswer = answer - distribution;
    }
    return Math.floor(fakeAnswer);
};

Stats.choosePopulationQuestionType = function	() {
	// Randomize and stuff
    return "age_year";
};

Stats.populationStats = function(px){
    var values = px.keyword('VALUES');
    var keys = px.keywords();
    var vars = px.variables();
    var entries = px.entries();
    var category = px.keyword('CONTENTS');
    
    var age = {}, year = {}, gender = {};
    age.index = 0;
    age.keyword = px.variable(age.index);
    var ageValues = values[age.keyword];
    //age.values = values[age.keyword];
    
    year.index = 1;
    year.keyword = px.variable(year.index);
    var yearValues = values[year.keyword];
    //year.values = values[year.keyword];
    
    gender.index = 2;
    gender.keyword = px.variable(gender.index);
    gender.values = ['män', 'kvinnor'];


    var qType = this.choosePopulationQuestionType();
    switch(qType){
        case "age_year":
            break;
        default:
            break;
    }
    
    var desiredAge = Math.floor(Math.random() * 100) + 1; 
    var desiredYear = Math.floor(Math.random() * yearValues.length) ; //
    var desiredGender = Math.floor(Math.random());

    var actualYear = yearValues[desiredYear];
	var actualGender = gender.values[desiredGender];

    answerFacts = {}
    var answer = px.datum([desiredAge, desiredYear, desiredGender]);
    

    answerFacts.title = "Hur många " + actualGender + " i åldern " +
        desiredAge + " fanns det i Linköping år" + actualYear ;
    answerFacts.category = category;
    answerFacts.year = actualYear;
    answerFacts.gender = actualGender;
    answerFacts.age = desiredAge;
    answerFacts.answer = answer;
    return answerFacts;
};