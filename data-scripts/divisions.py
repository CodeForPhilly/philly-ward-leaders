import json
import sys
from collections import defaultdict
from os import path


def process_divisions(filepath, output_dir):
    with open(filepath) as file:
        geojson = json.load(file)

    features = geojson['features']
    wards = defaultdict(list)
    all_ward_divs = defaultdict(list)

    # Dictionary with division config for split wards
    split_wards_config = {
        "39":
            {
                "A": [[25, 46]],
                "B": [[1, 24]]
            },
        "40":
            {
                "A": [[22], [29, 38], [40, 51]],
                "B": [[1, 21], [23, 28], [39]]
            },
        "66":
            {
                "A": [[19, 33], [35, 40], [42, 46]],
                "B": [[1, 18], [24], [41]]
            },
        }
    
    # Dictionary with division data for split wards
    split_wards_data = {}

    # Loop through split ward config to create list of divisions in each split ward
    for w, wd in split_wards_config.items():
        # Convert divsision ranges to lists. Append single divisions
        split_wards_data[w] = {}
        for spw, spwd in wd.items():
            divs_list = []
            for r in spwd:
                if len(r) == 1:
                    divs_list.append(r[0])
                else:
                    divs_list.extend(list(range(r[0], r[1]+1)))
            split_wards_data[w][spw] = divs_list

    for feature in features:
        ward_div = feature['properties']['DIVISION_NUM']
        ward = ward_div[:2].lstrip('0')
        division = int(ward_div[2:].lstrip('0'))
        ward_data = {
            'type': 'Feature',
            'properties': {
                'ward_div': ward_div,
                'ward': ward,
                'division': division,
            },
            'geometry': feature['geometry']
        }
        # Add entry for split wards
        if ward in split_wards_data.keys():
            sub_ward = "A" if (
                            division in split_wards_data[ward]["A"]
                        ) else "B"
            sp_ward = f"{ward}{sub_ward}"
            wards[sp_ward].append(ward_data)
            all_ward_divs[sp_ward].append(division)

        wards[ward].append(ward_data)
        all_ward_divs[ward].append(division)

    for ward, features in wards.items():
        features.sort(key=lambda ele: ele['properties']['ward_div'])
        out_filename = ward + '.geojson'
        out_filepath = path.join(output_dir, out_filename)
        out_data = {'type': 'FeatureCollection', 'features': features}

        with open(out_filepath, 'w') as out_file:
            # Pretty-print the JSON so we can compare changes over time.
            # The separators argument prevents trailing whitespace per
            # https://stackoverflow.com/a/35013643
            json.dump(out_data, out_file, indent=2, sort_keys=True, separators= (',', ': '))

    for ward, divisions in all_ward_divs.items():
        divisions.sort()
    sorted_ward_divs = dict(sorted(all_ward_divs.items(), key=lambda item: int(item[0].rstrip("AB"))))    
    with open(path.join(output_dir, 'all_wards_divs.json'), 'w') as out_file:
      json.dump(sorted_ward_divs, out_file, indent=2, separators= (',', ': '))     
