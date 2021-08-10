const passes = (target, compare) => {
  const threshold = (compare.length - 1) / 18;
  const scaleThreshold = 1.3;

  console.log(threshold);
  for (let i = 1; i < target.length; i++) {
    let scale = target[i] / compare[i];
    if (scale < 1/scaleThreshold || scale > scaleThreshold) {
      return false;
    }
    let sumCoef = 0;
    for (let j = 1; j < target.length; j++) {
      sumCoef += Math.abs((compare[j] * scale) - target[j]);
    }
    console.log(sumCoef * target[i]);
    if (sumCoef * target[i] > threshold) {
      return false;
    }
  }

  return true;
}

const getMapping = (lap, data) => {
  let key = data.val();
  if (!key)
    return false;
  let keys = Object.keys(data.val());
  for (let i = 0; i < keys.length; i++) {
    if (passes(lap, key[keys[i]].lap)) {
      return key[keys[i]].spotify;
    }
  }
  return false;
}

module.exports = {
  getMapping: (lap, ref) => {
    return ref.once("value").then((data) => {
      if (!data)
        return false;
      return getMapping(lap, data);
    }).catch();
  }
}
