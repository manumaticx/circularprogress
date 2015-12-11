var measurement = require('alloy/measurement'),
    init = false,
    value = 0, // current progress value (0 ... 100)
    options;

var defaults = {
  width: 100,
  height: 100,
  backgroundColor: '#fff',
  progressColor: '#000',
  progressBackgroundColor: '#666',
  formatValue: function(v){return v;},
  showText: false
};

if (arguments[0]){
  createView(arguments[0]);
}

function createView(_args){
  options = _.defaults(_args, defaults);

  // we need a square
  if (options.width !== options.height){
    options.height = options.width;
  }

  // container properties
  ["width", "height", "left", "right", "top", "bottom", "zIndex", "backgroundColor"].forEach(function(prop){
    _.has(options, prop) && ($.container[prop] = options[prop]);
  });

  // add margin
  if (_.has(options, "margin")){
    $.container.width += options.margin;
    $.container.height += options.margin;
  }

  // make it a circle
  $.container.setBorderRadius((OS_ANDROID ? measurement.dpToPX($.container.width) : $.container.width) / 2);

  // adjust the layers dimensions (half width)
  ["leftlayer", "innerrotationlayer", "rightlayer"].forEach(function(layer){
    $[layer].width = options.width / 2;
    $[layer].height = options.height;
  });

  // adjust the layers dimensions (full width)
  ["baselayer", "progresslayer", "rotationlayer"].forEach(function(layer){
    $[layer].width = options.width;
    $[layer].height = options.height;
  });

  if (options.progressWidth){
    // the wider the progressWidth, the narrower the centerlayer
    $.centerlayer.width = options.width - options.progressWidth;
    $.centerlayer.height = options.height - options.progressWidth;
  } else {
    $.centerlayer.visible = false;
  }

  // layer positioning
  $.leftlayer.left = 0;
  $.rightlayer.right = 0;
  $.rotationlayer.left = 0;
  $.innerrotationlayer.right = 0;

  // layer colors
  $.progresslayer.backgroundColor = options.progressColor;
  $.leftlayer.backgroundColor = options.progressBackgroundColor || options.backgroundColor;
  $.innerrotationlayer.backgroundColor = options.progressBackgroundColor || options.backgroundColor;
  $.rightlayer.backgroundColor = options.progressColor;
  $.centerlayer.backgroundColor = options.backgroundColor;

  // squares become circles like
  ["baselayer", "progresslayer", "centerlayer"].forEach(function(layer){
    var layerwidth = OS_ANDROID ? measurement.dpToPX($[layer].width) : $[layer].width;
    $[layer].borderRadius = layerwidth / 2;
  });

  // style label
  if (options.showText){
    $.label.font = options.font;
    $.label.color = options.color;
  }

  // we're ready to go
  init = true;

  // set initial value
  setValue(options.value || 0);

  // make this methods public to the view
  $.container.setValue = setValue;
  $.container.getValue = getValue;
  $.container.animate = animate;

  return $.container;
};

/**
 * Updates the progress view
**/
function updateUi(){

  if (!init) return;

  // get the angle from percentage value
  var angle = parseFloat(value / 100 * 360);

  $.rightlayer.setVisible( angle > 180 );
  $.leftlayer.setVisible( angle <= 180 );

  // rotation
  $.rotationlayer.transform = Ti.UI.create2DMatrix().rotate(angle);

  // update label
  options.showText && value > 0 && $.label.setText(options.formatValue(value));

}

/**
 * returns the current value
 * @return {Number} value
**/
function getValue(){
  return value;
}

/**
 * sets the current value
 * @param {Number} value
**/
function setValue(_value){
  if (_.isNumber(_value) && _value >= 0 && _value <= 100){
    value = _value;
    updateUi();
  } else {
    Ti.API.error("[circularprogress]: value (was "+_value+") must be a number between 0 and 100");
  }
}

/**
 * animate to a given value
 * @param {Object} _args
 */
function animate(_args){
  var value = _args.value || 0;
  var duration = _args.duration || 0;
  var angle = parseFloat(value / 100 * 360);

  // create the animation
  var animation = Ti.UI.createAnimation({
    duration: duration,
    transform: Ti.UI.create2DMatrix().rotate(angle)
  });

  if (value > 50){
    // find the timeout to switch the layers
    // as we can't listen to the animation progress
    var switchTimeout = duration * 100 / (value * 2);
    setTimeout(function(){
      $.rightlayer.setVisible(true);
      $.leftlayer.setVisible(false);
    }, switchTimeout);
  }

  // workaround https://jira.appcelerator.org/browse/TIMOB-17260
  JSON.stringify($.rotationlayer.size);

  // animate it
  $.rotationlayer.animate(animation);

  // update label
  options.showText && $.label.setText(options.formatValue(value));
}

Object.keys(defaults).forEach(function(key){
  Object.defineProperty($, key, {
    get: function(){ return options[key]; },
    set: function(value){ options[key] = value; }
  });
});

exports.createView = createView;
exports.setValue = setValue;
exports.getValue = getValue;
exports.animate = animate;
