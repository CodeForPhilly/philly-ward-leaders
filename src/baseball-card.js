var Snap = require('snapsvg'),
  _ = require('underscore');

module.exports = {
  front: function(selector, options) {

    var defaultConfig = {
      cardWidth: 350,
      cardHeight: 500,
      cardBorderWidth: 15,
      cardBorderColor: '#2284a1',
      topLeftCut: 65,
      bottomRightCut: 95,
      photoUrl: '',
      photoOffsetX: 0,
      name: '',
      ward: ''
    };

    var config = _.defaults(options, defaultConfig);

    var s = Snap(selector);
    s.attr({
      viewBox: [0, 0, config.cardWidth, config.cardHeight]
    });

    var card = s.rect(5, 5, config.cardWidth - 10, config.cardHeight - 10, 2)
    .attr({
      fill: config.cardBorderColor,
      stroke: config.cardBorderColor,
      strokeWidth: 10
    });

    var photo = s.image(config.photoUrl,
    	0, // x
    	config.cardBorderWidth, // y
    	config.cardWidth - config.cardBorderWidth + config.photoOffsetX, // width
    	config.cardHeight - config.cardBorderWidth // height
    )
    .attr({
      preserveAspectRatio: 'xMaxYMid slice'
    });
    var photoPattern = photo.toPattern()
    .attr({
      viewBox: [
        0,
        config.cardBorderWidth,
        config.cardWidth - config.cardBorderWidth + config.photoOffsetX,
        config.cardHeight - config.cardBorderWidth
      ]
    });

    var photoContainer = s.polygon([
      config.cardWidth - config.cardBorderWidth, config.cardBorderWidth,
      config.topLeftCut, config.cardBorderWidth,
      config.cardBorderWidth, config.topLeftCut,
      config.cardBorderWidth, config.cardHeight - config.cardBorderWidth,
      config.cardWidth - config.bottomRightCut, config.cardHeight - config.cardBorderWidth,
      config.cardWidth - config.cardBorderWidth, config.cardHeight - config.bottomRightCut
    ]).attr({
      fill: photoPattern,
      stroke: '#000',
      strokeWidth: 1
    });

    /* Ward Circle */
    var wardContainer = s.circle(45, 45, 25)
    .attr({
      fill: '#fff',
      stroke: '#000'
    });

    var wardTextLine1 = s.text(45, 45, config.ward).
    attr({
      'text-anchor': 'middle',
      'font-family': 'arial',
      'font-weight': 'bold',
      'font-size': 18,
      'fill': config.cardBorderColor
    });

    var wardTextLine2 = s.text(45, 58, 'Ward').
    attr({
      'text-anchor': 'middle',
      'font-family': 'arial',
      'font-size': 12,
      'fill': config.cardBorderColor
    });

    /* Name Box */
    var nameText = s.text(config.cardWidth-19, config.cardHeight-17, config.name)
    .attr({
      'text-anchor': 'end',
      fill: config.cardBorderColor,
      'font-size': 22,
      'font-family': 'Arial'
    });
    var nameBBox = nameText.getBBox();
    var nameContainer = s.rect(nameBBox.x-10, nameBBox.y-5, nameBBox.width+20, nameBBox.height+10)
    .attr({
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1
    }).after(nameText);

    return s;
  },

  back: function(selector, options) {

    var defaultConfig = {
      cardWidth: 350,
      cardHeight: 500,
      cardBorderWidth: 15,
      cardBorderColor: '#2284a1',
      cardInsideColor: '#CDD8DB',
      topLeftCut: 65,
      bottomRightCut: 95,
      photoUrl: '',
      photoOffsetX: 0,
      name: '',
      ward: ''
    };

    var config = _.defaults(options, defaultConfig);

    var s = Snap(selector);
    s.attr({
      viewBox: [0, 0, config.cardWidth, config.cardHeight]
    });
  }
};
