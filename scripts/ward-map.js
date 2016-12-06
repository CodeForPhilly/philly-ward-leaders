(function (L, reqwest) {
  var mapEl = document.querySelector('.ward-map-container')
  var boundariesPath = mapEl.getAttribute('data-boundaries')
  var map = L.map(mapEl).setView([39.9523893, -75.1636291], 10)

  L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map)

  // Fetch ward division boundaries
  reqwest({
    url: boundariesPath,
    type: 'json',
    success: function (response) {
      var divisionsLayer = L.geoJson(response, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup('Division: ' + feature.properties.division)
        }
      }).addTo(map)

      var divisionsBounds = divisionsLayer.getBounds()
      map.fitBounds(divisionsBounds)
    }
  })
})(window.L, window.reqwest)
