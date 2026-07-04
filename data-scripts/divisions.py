import json
from collections import defaultdict
from os import path


SPLIT_WARDS_CONFIG = {
    "39": {
        "A": [[25, 46]],
        "B": [[1, 24]]
    },
    "40": {
        "A": [[22], [29, 38], [40, 51]],
        "B": [[1, 21], [23, 28], [39]]
    },
    "66": {
        "A": [[19, 33], [35, 40], [42, 46]],
        "B": [[1, 18], [24], [41]]
    },
}


def _build_split_wards_data():
    """Build a lookup structure for split ward divisions.

    Converts the SPLIT_WARDS_CONFIG ranges into flat lists of division numbers
    for each sub-ward (A/B).

    Returns:
        dict: A dictionary mapping ward numbers to sub-wards to division lists.
              Example: {"39": {"A": [25, 26, ...], "B": [1, 2, ...]}}
    """
    split_wards_data = {}
    for w, wd in SPLIT_WARDS_CONFIG.items():
        split_wards_data[w] = {}
        for spw, spwd in wd.items():
            divs_list = []
            for r in spwd:
                if len(r) == 1:
                    divs_list.append(r[0])
                else:
                    divs_list.extend(list(range(r[0], r[1] + 1)))
            split_wards_data[w][spw] = divs_list
    return split_wards_data


def calculate_ward_stats(features):
    """Calculate division counts for each ward and sub-ward.

    Counts the number of unique divisions per ward from GeoJSON features.
    For split wards (39, 40, 66), creates separate entries for sub-wards A and B.

    Args:
        features (list): List of GeoJSON feature dictionaries from the divisions file.

    Returns:
        dict: A dictionary mapping ward keys to division counts.
              Example: {"1": {"divisionCount": 21}, "39A": {"divisionCount": 22}}
    """
    split_wards_data = _build_split_wards_data()
    ward_divisions = defaultdict(set)

    for feature in features:
        ward_div = feature['properties']['DIVISION_NUM']
        ward = ward_div[:2].lstrip('0')
        division = int(ward_div[2:].lstrip('0'))

        if ward in split_wards_data:
            for sub_ward, divs in split_wards_data[ward].items():
                if division in divs:
                    ward_divisions[f"{ward}{sub_ward}"].add(division)
        else:
            ward_divisions[ward].add(division)

    stats = {}
    for ward_key, divisions in ward_divisions.items():
        stats[ward_key] = {"divisionCount": len(divisions)}

    return stats


def count_committee_persons(committee_file, party):
    """Count committee persons per ward from a JSON file.

    Reads committee person data and counts entries per ward/sub-ward.
    For split wards, assigns each person to the correct sub-ward based on division.

    Args:
        committee_file (str): Path to JSON file containing committee person data.
                             Each entry should have 'ward' and 'division' fields.
        party (str): Party name ('democratic' or 'republican').

    Returns:
        dict: A dictionary mapping ward keys to party counts.
              Example: {"1": {"democratic": 42}, "39A": {"democratic": 40}}
    """
    with open(committee_file) as f:
        committee_data = json.load(f)

    split_wards_data = _build_split_wards_data()
    counts = defaultdict(int)

    for person in committee_data:
        ward = str(person['ward']).lstrip('0')
        division = person['division']

        if ward in split_wards_data:
            for sub_ward, divs in split_wards_data[ward].items():
                if division in divs:
                    counts[f"{ward}{sub_ward}"] += 1
                    break
        else:
            counts[ward] += 1

    return {ward_key: {party: count} for ward_key, count in counts.items()}


def generate_ward_stats_json(divisions_file, committee_files, output_path):
    """Generate a JSON file with division counts, committee person counts, and vacancies.

    Combines division data from GeoJSON with committee person data to calculate
    vacancies for each ward/sub-ward and party.

    Args:
        divisions_file (str): Path to the GeoJSON file containing political divisions.
        committee_files (list): List of tuples (file_path, party_name).
                               Example: [("dem.json", "democratic"), ("rep.json", "republican")]
        output_path (str): Path where the output JSON file will be written.

    Returns:
        None: Writes JSON file to output_path with structure:
              {
                "1": {
                  "divisionCount": 21,
                  "democraticCount": 42,
                  "democraticVacancies": 0,
                  "republicanCount": 7,
                  "republicanVacancies": 35
                }
              }
    """
    with open(divisions_file) as f:
        geojson = json.load(f)

    features = geojson['features']
    ward_stats = calculate_ward_stats(features)

    for committee_file, party in committee_files:
        committee_counts = count_committee_persons(committee_file, party)
        for ward_key, party_data in committee_counts.items():
            if ward_key not in ward_stats:
                ward_stats[ward_key] = {"divisionCount": 0}
            count = party_data[party]
            ward_stats[ward_key][f'{party}Count'] = count

    for ward_key, ward_data in ward_stats.items():
        division_count = ward_data.get('divisionCount', 0)
        for party in ['democratic', 'republican']:
            count_key = f'{party}Count'
            committee_count = ward_data.get(count_key, 0)
            ward_data[count_key] = committee_count
            ward_data[f'{party}Vacancies'] = (division_count * 2) - committee_count

    output_data = dict(sorted(ward_stats.items(), key=lambda x: (
        int(''.join(filter(str.isdigit, x[0]))),
        x[0]
    )))

    with open(output_path, 'w') as f:
        json.dump(output_data, f, indent=2, separators=(',', ': '))


def process_divisions(filepath, output_dir):
    """Split a political divisions GeoJSON file into individual ward files.

    Reads a GeoJSON file containing all political divisions and creates separate
    GeoJSON files for each ward. For split wards (39, 40, 66), also creates
    separate files for sub-wards A and B.

    Args:
        filepath (str): Path to the input GeoJSON file with all divisions.
        output_dir (str): Directory where individual ward GeoJSON files will be written.

    Returns:
        None: Writes ward-specific GeoJSON files to output_dir (e.g., "1.geojson", "39A.geojson").
    """
    with open(filepath) as file:
        geojson = json.load(file)

    features = geojson['features']
    wards = defaultdict(list)
    split_wards_data = _build_split_wards_data()

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
        if ward in split_wards_data.keys():
            sub_ward = "A" if (
                            division in split_wards_data[ward]["A"]
                        ) else "B"
            sp_ward = f"{ward}{sub_ward}"
            wards[sp_ward].append(ward_data)

        wards[ward].append(ward_data)

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
