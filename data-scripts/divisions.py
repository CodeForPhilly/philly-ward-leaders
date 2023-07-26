import json
from collections import defaultdict
from os import path


def process_divisions(filepath, output_dir):
    with open(filepath) as file:
        geojson = json.load(file)

    features = geojson['features']
    wards = defaultdict(list)
    sub_wards = defaultdict(list)
    # Dictionary with division data for split wards
    split_wards_config = {
        "39":
            {
                "A": [[25, 46]],
                "B": [[1, 24]]
            }
            ,
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
    
    # For split wards, create additional geojson files for each sub division
    for split_ward in split_wards_config.keys():
        ward_data = wards[split_ward]
        # Generate division data for sub wards in split wards
        for sub_ward in split_wards_config[split_ward].keys():
            a = split_wards_config.get(split_ward).get(sub_ward)
            divisions = []
            for x in a:
                if len(x) == 1:
                    divisions.append(x[0])
                    continue
                else:
                    for y in range(x[0],x[1]+1):
                        divisions.append(y)
            
            # Filter out divisions not in sub ward A
            div_data = list(filter(
                        lambda x: (x["properties"]["division"]) in divisions,
                        ward_data)
                    )
             
            sub_wards[f"{split_ward}{sub_ward}"] = div_data
            
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

    for ward, features in sub_wards.items():
        features.sort(key=lambda ele: ele['properties']['ward_div'])
        out_filename = ward + '.geojson'
        out_filepath = path.join(output_dir, out_filename)
        out_data = {'type': 'FeatureCollection', 'features': features}

        with open(out_filepath, 'w') as out_file:
            # Pretty-print the JSON so we can compare changes over time.
            # The separators argument prevents trailing whitespace per
            # https://stackoverflow.com/a/35013643
            json.dump(out_data, out_file, indent=2, sort_keys=True, separators=(',', ': '))


if __name__ == "__main__":
    dirname = path.dirname(__file__)
    filepath = path.join(dirname, "input_data/2022/Political_Divisions.geojson")
    out_path = path.join(dirname, "test_output")
    process_divisions(filepath, out_path)
