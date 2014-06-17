var measurement = require('alloy/measurement'),
    init = false,
    value = 0, // current progress value (0 ... 100)
    options;

if (arguments[0]){
  createView(arguments[0]);
}

function createView(_args){
  options = _.defaults(_args, {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    progressColor: '#000',
    showText: false
  });
  
  // we need a square
  if (options.width !== options.height){
    options.height = options.width;
  }

  // container properties
  ["width", "height", "left", "right", "top", "bottom", "backgroundColor"].forEach(function(prop){
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
  $.leftlayer.backgroundColor = options.backgroundColor;
  $.innerrotationlayer.backgroundColor = options.backgroundColor;
  $.rightlayer.backgroundColor = options.progressColor;
  $.centerlayer.backgroundColor = options.backgroundColor;

  // squares become circles like
  options.radius = (OS_ANDROID ? measurement.dpToPX(options.width) : options.width) / 2;
  ["baselayer", "progresslayer", "centerlayer"].forEach(function(layer){
    $[layer].borderRadius = options.radius;
  });
  delete options.radius;

  // style label
  if (options.showText){
    $.label.font = options.font;
    $.label.color = options.color;
  }

  // we're ready to go
  init = true;

  // set initial value
  setValue(options.value || 0);

  // make this method public to the view
  $.container.setValue = setValue;

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
  options.showText && value > 0 && $.label.setText(value);

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

exports.createView = createView;
exports.setValue = setValue;
