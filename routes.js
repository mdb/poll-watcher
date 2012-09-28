var pollster = require('pollster');

module.exports = function(app) {
  app.get('/', function(req, res){
    console.log(__dirname)
    getPollData(function (data) {
      res.render('index', {
        title: '2012 PollWatcher',
        polls: data
      });
    });
  });
};

// helpers
var getPollData = function(callback) {
  pollster.charts({state: 'pa'}, function(resp) {
    var data = [];
    var respLength = resp.length;
    var i;

    for (i=0; i<respLength; i++) {
      var item = {};
      var choiceLength = resp[i].estimates.length;
      var j;

      if (resp[i].estimates.length > 0) {
        item.title = resp[i].title;
        item.url = resp[i].url;
        item.raw_last_updated = resp[i].last_updated;
        item.formatted_last_updated = 'TODO';
        item.slug = resp[i].slug;
        item.estimates = getFormattedChoices(resp[i].estimates);
        data.push(item);
      }
    }

    callback(data);
  });
};

var getFormattedChoices = function(choices) {
  var i;
  var choiceLength = choices.length;
  var choiceArray = [];
  
  for (i=0; i<choiceLength; i++) {
    choiceArray.push(getFormattedChoice(choices[i]));
  }

  return choiceArray;
};

var getFormattedChoice = function(choice) {
  var choiceObj = {};

  choiceObj.formatted_name = getFormattedName(choice);
  choiceObj.value = choice.value;
  choiceObj.integer_value = Math.ceil(choice.value);
  choiceObj.party = getFormattedParty(choice.party);
  choiceObj.lower_party = choiceObj.party !== null ? choiceObj.party.toLowerCase() : 'null';

  return choiceObj;
};

var getFormattedParty = function(party) {
  var partyName;
  var lowerParty = party !== null ? party.toLowerCase() : '';

  if (lowerParty.indexOf('dem') !== -1) {
    partyName = "Democrat";
  } else if (lowerParty.indexOf('rep') !== -1) {
    partyName = "Republican";
  } else {
    partyName = party;
  }

  return partyName;
};

var getFormattedName = function(choice) {
  var formattedName;

  if (choice.first_name && choice.last_name) {
    formattedName = choice.first_name + ' ' + choice.last_name;
  } else {
    formattedName = choice.choice;
  }

  return formattedName;
};
