import Snap from 'snapsvg'

export function createFront (el, data) {
  const isRepublican = (data.party === 'republican')
  const config = {
    cardWidth: 300,
    cardHeight: 450,
    cardBorderWidth: 15,
    cardBorderColor: isRepublican ? '#a12222' : '#2284a1',
    topLeftCut: 65,
    bottomRightCut: 95
  }

  const svg = Snap(el)
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

  const photoX = 0
  const photoY = config.cardBorderWidth
  const photoWidth = config.cardWidth - config.cardBorderWidth // + data.photoOffset
  const photoHeight = config.cardHeight - config.cardBorderWidth
  const photoRatio = 'xMidYMid slice'
  const photo = svg.image(data.photo, photoX, photoY, photoWidth, photoHeight)
    .attr({ preserveAspectRatio: photoRatio })

  const photoPattern = photo.toPattern()
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
  svg.text(45, 40, 'Ward')
    .attr({
      'text-anchor': 'middle',
      'font-family': 'arial',
      'font-size': 12,
      'fill': config.cardBorderColor
    })

  // Ward text line 2
  svg.text(45, 58, data.ward + data.subWard)
    .attr({
      'text-anchor': 'middle',
      'font-family': 'arial',
      'font-weight': 'bold',
      'font-size': 18,
      'fill': config.cardBorderColor
    })

  const nameWidth = config.cardWidth - 19
  const nameHeight = config.cardHeight - 17
  const nameText = svg.text(nameWidth, nameHeight, data.name)
    .attr({
      'text-anchor': 'end',
      'fill': config.cardBorderColor,
      'font-size': 22,
      'font-family': 'Arial'
    })

  // Name container
  const nameBBox = nameText.getBBox()
  const nameCtrX = nameBBox.x - 10
  const nameCtrY = nameBBox.y - 5
  const nameCtrWidth = nameBBox.width + 20
  const nameCtrHeight = nameBBox.height + 10
  svg.rect(nameCtrX, nameCtrY, nameCtrWidth, nameCtrHeight)
    .attr({
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1
    })
    .after(nameText)
}

export function createBack (el, contentsEl, data) {
  const isRepublican = (data.party === 'republican')
  const config = {
    cardWidth: 250,
    cardHeight: 375,
    cardBorderWidth: 15,
    cardBorderColor: isRepublican ? '#a12222' : '#2284a1',
    cardInsideColor: '#CDD8DB'
  }

  const svg = Snap(el)
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
  const insideX = config.cardBorderWidth
  const insideY = config.cardBorderWidth
  const insideWidth = config.cardWidth - config.cardBorderWidth * 2
  const insideHeight = config.cardHeight - config.cardBorderWidth * 2
  svg.rect(insideX, insideY, insideWidth, insideHeight)
    .attr({
      fill: config.cardInsideColor,
      stroke: '#000',
      strokeWidth: 1
    })

  svg.group().append(contentsEl)
}
