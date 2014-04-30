var args = arguments[0] || {},
    measurement = require('alloy/measurement'),
    value = 0,
    defaults = {
      width: 100,
      color: '#000',
      progressWidth: false
    },
    rotation = Ti.UI.createAnimation();

function createView(_args){

  options = _.defaults(_args, defaults);

  $.container.setWidth(options.width);
  $.container.setHeight(options.width);
  $.container.setBorderRadius((OS_ANDROID ? measurement.dpToPX(options.width) : options.width) / 2);

  $.leftlayer.setWidth(options.width / 2);
  $.leftlayer.setHeight(options.height);

  $.rightlayer.setWidth(options.width / 2);
  $.rightlayer.setHeight(options.height);

  $.rotationlayer.setWidth(options.width / 2);

  if (options.progressWidth){

    var centerWidth = options.width - options.progressWidth;

    $.centerlayer.setWidth(centerWidth);
    $.centerlayer.setHeight(centerWidth);
    $.centerlayer.setBorderRadius((OS_ANDROID ? measurement.dpToPX(centerWidth) : centerWidth) / 2);
    $.centerlayer.setVisible(true);
  }

  $.background.setBackgroundColor(options.color);
  $.rightlayer.setBackgroundColor(options.color);

  $.container.setValue = setValue;

  return $.container;
}

function updateUi(){

  var angle = parseFloat(value / 100 * 360);

  if ( angle < 180 && $.rightlayer.getVisible() ){
    $.rightlayer.setVisible(false);
    $.leftlayer.setVisible(true);
  }

  if ( angle == 180 ){

    $.rightlayer.setVisible(true);
    $.leftlayer.setVisible(false);
  }

  rotation.transform = Ti.UI.create2DMatrix().rotate(angle);

  if (OS_ANDROID){
    rotation.anchorPoint = $.rotationlayer.anchorPoint;
  }

  $.rotationlayer.animate(rotation);

}

function getValue(){
  return value;
}

function setValue(_value){
  value = _value;
  updateUi();
}

exports.createView = createView;
