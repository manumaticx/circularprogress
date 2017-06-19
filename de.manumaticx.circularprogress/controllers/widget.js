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
  progressBackgroundGradient: undefined,
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
  $.progresslayer.backgroundGradient = options.progressGradient;
  $.leftlayer.backgroundColor = options.progressBackgroundColor || options.backgroundColor;
  $.leftlayer.backgroundGradient = options.progressBackgroundGradient;
  $.innerrotationlayer.backgroundColor = options.progressBackgroundColor || options.backgroundColor;
  $.innerrotationlayer.backgroundGradient = options.progressBackgroundGradient;
  $.rightlayer.backgroundColor = options.progressColor;
  $.rightlayer.backgroundGradient = options.progressGradient;
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
  $.label.visible = options.showText;

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
 * dynamically set the text
 * @param {String} _text
 */
function setText(_text){
    options.showText && ($.label.text = _text);
    updateUi();
}

/**
 * get the label text
 */
function getText(){
    return $.label.text;
}

/**
 * dynamically set the progress color
 * @param {String} _color
 */
function setProgressColor(_color){
    $.progresslayer.backgroundColor = _color;
    $.rightlayer.backgroundColor = _color;
}

/**
 * dynamically set the progress backgroundColor
 * @param {String} _color
 */
function setProgressBackgroundColor(_color){
    $.leftlayer.backgroundColor = _color;
    $.innerrotationlayer.backgroundColor = _color;
}

/**
 * dynamically set the visibility of text
 * @param {Boolean} _flag
 */
function setShowText(_flag){
    options.showText = !!_flag;
    updateUi();
}

/**
 * animate to a given value
 * @param {Object} _args
 */
function animate(_args, _callback){
  var value = _args.value || 0;
  var duration = _args.duration || 100;
  var angle = parseFloat(value / 100 * 360);
  var callback = _callback || function(){};

  // create the animation
  var animation = Ti.UI.createAnimation({
    duration: duration,
    transform: Ti.UI.create2DMatrix().rotate(angle)
  });
  
  animation.addEventListener("complete", function onAnimationComplete(e){
    callback();
    animation.removeEventListener("complete", onAnimationComplete);
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

function hide(){
    $.container.hide();
}
function show(){
    $.container.show();
}

exports.createView = createView;
exports.setValue = setValue;
exports.getValue = getValue;
exports.animate = animate;
exports.setText = setText;
exports.getText = getText;
exports.setProgressColor = setProgressColor;
exports.setProgressBackgroundColor = setProgressBackgroundColor;
exports.setShowText = setShowText;
exports.hide = hide;
exports.show = show;
