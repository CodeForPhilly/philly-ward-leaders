import WardMap from '../../src/components/ward-map.vue'

describe('WardMap Component', () => {
  const geojsonData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          division: 3
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-75.1636291, 39.9523893],
              [-75.1536291, 39.9623893],
              [-75.1736291, 39.9623893],
              [-75.1636291, 39.9523893]
            ]
          ]
        }
      }
    ]
  };

  beforeEach(() => {
    cy.mount(WardMap, {
      props: {
        ward: '3rd Ward',
        boundaries: geojsonData,
        committeePersons: []
      }
    });
  });

  it('renders the map with the correct center and zoom level', () => {
    cy.get('.map').should('exist');
    cy.window().then((win) => {
      const map = win.L.map.instances[0];
      expect(map.getCenter().lat).to.be.closeTo(39.9523893, 0.0001);
      expect(map.getCenter().lng).to.be.closeTo(-75.1636291, 0.0001);
      expect(map.getZoom()).to.equal(14);
    });
  });

  it('renders the geojson layer with correct bounds', () => {
    cy.window().then((win) => {
      const map = win.L.map.instances[0];
      const bounds = map.getBounds();

      expect(bounds.getSouthWest().lat).to.be.lessThan(39.9523893);
      expect(bounds.getNorthEast().lat).to.be.greaterThan(39.9623893);
    });
  });

  it('binds tooltips to geojson features', () => {
    cy.window().then((win) => {
      const map = win.L.map.instances[0];
      const geojsonLayer = map.eachLayer((layer) => {
        if (layer.feature) {
          expect(layer.getTooltip().getContent()).to.contain('3rd Division');
        }
      });
    });
  });

  it('fits map bounds to geojson layer on boundaries update', () => {
    const newGeojsonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            division: 5
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-75.180000, 39.950000],
                [-75.170000, 39.960000],
                [-75.190000, 39.960000],
                [-75.180000, 39.950000]
              ]
            ]
          }
        }
      ]
    };

    cy.wrap({ boundaries: geojsonData }).as('props');

    cy.get('@props').then((props) => {
      props.boundaries = newGeojsonData;
    });

    cy.window().then((win) => {
      const map = win.L.map.instances[0];
      const bounds = map.getBounds();

      expect(bounds.getSouthWest().lng).to.be.lessThan(-75.180000);
      expect(bounds.getNorthEast().lng).to.be.greaterThan(-75.170000);
    });
  });
});
