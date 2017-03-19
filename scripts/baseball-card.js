(function (Snap) {
  var cardNodeList = document.querySelectorAll('.flip-container')
  var cards = [].slice.call(cardNodeList)
  cards.forEach(function (card) {
    var frontEl = card.querySelector('.front')
    var backEl = card.querySelector('.back')
    var contentsEl = card.querySelector('.contents')
    var data = {
      ward: card.getAttribute('data-ward'),
      name: card.getAttribute('data-name'),
      photoUrl: card.getAttribute('data-photo'),
      photoOffset: card.getAttribute('data-photo-offset')
    }
    createFront(frontEl, data)
    createBack(backEl, contentsEl)
  })

  function createFront (el, data) {
    var config = {
      cardWidth: 300,
      cardHeight: 450,
      cardBorderWidth: 15,
      cardBorderColor: '#2284a1',
      topLeftCut: 65,
      bottomRightCut: 95
    }

    var svg = Snap(el)
    svg.attr({
      viewBox: [0, 0, config.cardWidth, config.cardHeight]
    })

    // Card
    svg.rect(5, 5, config.cardWidth - 10, config.cardHeight - 10, 2)
      .attr({
        fill: config.cardBorderColor,
        stroke: config.cardBorderColor,
        strokeWidth: 10
      })

    var photoX = 0
    var photoY = config.cardBorderWidth
    var photoWidth = config.cardWidth - config.cardBorderWidth + data.photoOffset
    var photoHeight = config.cardHeight - config.cardBorderWidth
    var photoRatio = (data.photoOffset !== '' ? 'xMaxYMid' : 'xMidYMid') + ' slice'
    var photo = svg.image(data.photoUrl, photoX, photoY, photoWidth, photoHeight)
      .attr({ preserveAspectRatio: photoRatio })

    var photoPattern = photo.toPattern()
      .attr({
        viewBox: [ photoX, photoY, photoWidth, photoHeight ]
      })

    // Photo container
    svg.polygon([
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
    })

    // Ward circle
    svg.circle(45, 45, 25)
      .attr({
        fill: '#fff',
        stroke: '#000'
      })

    // Ward text line 1
    svg.text(45, 45, data.ward)
      .attr({
        'text-anchor': 'middle',
        'font-family': 'arial',
        'font-weight': 'bold',
        'font-size': 18,
        'fill': config.cardBorderColor
      })

    // Ward text line 2
    svg.text(45, 58, 'Ward')
      .attr({
        'text-anchor': 'middle',
        'font-family': 'arial',
        'font-size': 12,
        'fill': config.cardBorderColor
      })

    var nameWidth = config.cardWidth - 19
    var nameHeight = config.cardHeight - 17
    var nameText = svg.text(nameWidth, nameHeight, data.name)
      .attr({
        'text-anchor': 'end',
        'fill': config.cardBorderColor,
        'font-size': 22,
        'font-family': 'Arial'
      })

    // Name container
    var nameBBox = nameText.getBBox()
    var nameCtrX = nameBBox.x - 10
    var nameCtrY = nameBBox.y - 5
    var nameCtrWidth = nameBBox.width + 20
    var nameCtrHeight = nameBBox.height + 10
    svg.rect(nameCtrX, nameCtrY, nameCtrWidth, nameCtrHeight)
      .attr({
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 1
      })
      .after(nameText)
  }

  function createBack (el, contentsEl) {
    var config = {
      cardWidth: 250,
      cardHeight: 375,
      cardBorderWidth: 15,
      cardBorderColor: '#2284a1',
      cardInsideColor: '#CDD8DB'
    }

    var svg = Snap(el)
    svg.attr({
      viewBox: [0, 0, config.cardWidth, config.cardHeight]
    })

    // Card
    svg.rect(5, 5, config.cardWidth - 10, config.cardHeight - 10, 2)
      .attr({
        fill: config.cardBorderColor,
        stroke: config.cardBorderColor,
        strokeWidth: 10
      })

    // Inside
    var insideX = config.cardBorderWidth
    var insideY = config.cardBorderWidth
    var insideWidth = config.cardWidth - config.cardBorderWidth * 2
    var insideHeight = config.cardHeight - config.cardBorderWidth * 2
    svg.rect(insideX, insideY, insideWidth, insideHeight)
      .attr({
        fill: config.cardInsideColor,
        stroke: '#000',
        strokeWidth: 1
      })

    svg.group().append(contentsEl)
  }
})(window.Snap)
