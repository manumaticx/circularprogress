exports.createView = function (_args){
  var measurement = require('alloy/measurement'),
  value = 0, // current progress value (0 ... 100)
  options = _.defaults(_args, {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    progressColor: '#000'
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
  ["baselayer", "progresslayer", "rotationlayer", "textlayer"].forEach(function(layer){
    $[layer].width = options.width;
    $[layer].height = options.height;
  });

  // layer positioning
  $.leftlayer.left = 0;
  $.rightlayer.left = 0;
  $.rotationlayer.left = 0;
  $.innerrotationlayer.right = 0;

  alert(options.backgroundColor);
  // layer colors
  $.progresslayer.backgroundColor = options.progressColor;
  $.leftlayer.backgroundColor = options.backgroundColor;
  $.innerrotationlayer.backgroundColor = options.backgroundColor;
  $.rightlayer.backgroundColor = options.progressColor;
  $.textlayer.backgroundColor = options.backgroundColor;

  // squares become circles like
  options.radius = (OS_ANDROID ? measurement.dpToPX(options.width) : options.width) / 2;
  ["baselayer", "progresslayer", "textlayer"].forEach(function(layer){
    $[layer].borderRadius = options.radius;
  });
  delete options.radius;

  // define getter and setter for value property
  Object.defineProperty($.container, "value", {
    get : getValue,
    set : setValue
  });

  setValue(options.value || 0);

  /**
   * Updates the progress view
  **/
  function updateUi(){

    var angle = parseFloat(value / 100 * 360);

    if ( angle < 180 && $.rightlayer.visible ){
      $.rightlayer.setVisible(false);
      $.leftlayer.setVisible(true);
    }

    if ( angle == 180 ){

      $.rightlayer.setVisible(true);
      $.leftlayer.setVisible(false);
    }

    $.rotationlayer.transform = Ti.UI.create2DMatrix().rotate(angle);

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
    }
  }

  return $.container;
};
