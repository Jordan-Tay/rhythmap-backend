let lap;

helper = (data) => {
  if (!data) {
    return false;
  } else {
    return getScore(lap, data);
  }
}

errData = (err) => {
  console.log("Error");
  console.log(err);
}


getScore = (lap, data) => {
  var key = data.val();
  if (!key) {
    return false;
  }
  var keys = Object.keys(key);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var dataMapping = key[k].mapping;
    var dataLap = key[k].lap;
    var sumCoefs = [];
    var scales = [];
    var response = true;
  
    for (var m = 1; m < lap.length; m++) {
      var scale = lap[m] / dataLap[m];
      if (scale > 1.2 || scale < 0.8)
        response = false;
      scales.push(scale);
      var sumCoef = 0;
      for (var n = 1; n < lap.length; n++) {
        sumCoef += Math.abs((dataLap[n] * scale) - lap[n]);
      }
      if (sumCoef * lap[n] > Math.pow(lap.length - 1, 2) / 80)
        response = false;
      sumCoefs.push(sumCoef * lap[m]);
    }

    if (response)
      return (key[k].mapping);
  }
  return false;
}

errHandle = (e) => {
  console.log("ERROR: ");
  console.log(e);
}

module.exports = {
  check: function (arr, ref) {
    lap = arr;
    return ref.once('value').then(helper).catch(errHandle);
  },
}