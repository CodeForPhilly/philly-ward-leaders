import json
from collections import defaultdict
from os import path

def process_divisions(filepath, output_dir):
    with open(filepath) as file:
        geojson = json.load(file)

    features = geojson['features']
    wards = defaultdict(list)

    for feature in features:
        ward_div = feature['properties']['DIVISION_NUM']
        ward = ward_div[:2].lstrip('0')
        division = int(ward_div[2:].lstrip('0'))

        wards[ward].append({
            'type': 'Feature',
            'properties': {
                'ward_div': ward_div,
                'ward': ward,
                'division': division,
            },
            'geometry': feature['geometry']
        })

    for ward, features in wards.items():
        features.sort(key=lambda ele: ele['properties']['ward_div'])
        out_filename = ward + '.geojson'
        out_filepath = path.join(output_dir, out_filename)
        out_data = {'type': 'FeatureCollection', 'features': features}

        with open(out_filepath, 'w') as out_file:
            # Pretty-print the JSON so we can compare changes over time.
            # The separators argument prevents trailing whitespace per
            # https://stackoverflow.com/a/35013643
            json.dump(out_data, out_file, indent=2, sort_keys=True, separators=(',', ': '))
