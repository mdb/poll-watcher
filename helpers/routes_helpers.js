var pollster = require('pollster');
var madison = require('madison');

// helpers
exports.getChartData = function(params, callback) {
  pollster.charts(params, function(resp) {
    var data = [];
    var respLength = resp.length;
    var i;

    for (i=0; i<respLength; i++) {
      var item = {};
      var choiceLength = resp[i].estimates.length;
      var j;

      if (resp[i].estimates.length > 0 && !isPrimary(resp[i])) {
        item.title = resp[i].title;
        item.url = resp[i].url;
        item.raw_last_updated = resp[i].last_updated;
        item.formatted_last_updated = getFormattedDate(item.raw_last_updated);
        item.slug = resp[i].slug;
        item.estimates = getFormattedChoices(resp[i].estimates);
        data.push(item);
      }
    }

    callback(data);
  });
};

exports.getStatePath = function(stateNameOrAbbrev) {
  var statePath;

  if (stateNameOrAbbrev.length === 2) {
    statePath = stateNameOrAbbrev.toLowerCase();
  } else {
    statePath = typeof madison.getStateAbbrev(stateNameOrAbbrev) !== 'undefined' ? madison.getStateAbbrev(stateNameOrAbbrev).toLowerCase() : undefined;
  }

  return statePath;
};

exports.inThreeChunks = function(array) {
  var splitArr = [];
  var subListLength = Math.ceil(array.length/3);
  var i;

  for (i=0; i<subListLength; i++) {
    var sublist = array.slice(i*subListLength, i*subListLength+subListLength);

    if (sublist.length > 0) {
      splitArr.push(array.slice(i*subListLength, i*subListLength+subListLength));
    }
  }
  
  return splitArr;
};

// private helpers
function getFormattedDate(dateStr) {
  var date = new Date(dateStr);
  var month = date.getMonth();
  var day = date.getDate();
  var year = date.getFullYear();
  var hours = date.getHours();
  var mins = date.getMinutes();
  
  return month + '/' + day + '/' + year;// + ' ' + hours + ':' + mins;
}

function order(a, b, desc) {
  return desc ? b.value - a.value : a.value - b.value;
}

function descendingEstimates(a, b) {
  return order(a, b, true);
}

function isPrimary(chart) {
  var title = chart.title.toLowerCase();

  return title.indexOf('primary') !== -1
}

function getFormattedChoices(choices) {
  var i;
  var choiceLength = choices.length;
  var choiceArray = [];
  
  for (i=0; i<choiceLength; i++) {
    choiceArray.push(getFormattedChoice(choices[i]));
  }

  return choiceArray.sort(descendingEstimates);
}

function getFormattedChoice(choice) {
  var choiceObj = {};

  choiceObj.formatted_name = getFormattedName(choice);
  choiceObj.value = choice.value;
  choiceObj.integer_value = Math.ceil(choice.value);
  choiceObj.party = getFormattedParty(choice.party);
  choiceObj.lower_party = choiceObj.party !== null ? choiceObj.party.toLowerCase() : 'null';

  return choiceObj;
}

function getFormattedParty(party) {
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
}

function getFormattedName(choice) {
  var formattedName;

  if (choice.first_name && choice.last_name) {
    formattedName = choice.first_name + ' ' + choice.last_name;
  } else {
    formattedName = choice.choice;
  }

  return formattedName;
}
