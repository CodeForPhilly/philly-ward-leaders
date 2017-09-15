import petl as etl

def has_ward_and_division(row):
    return row['ward'] != '' and row['division'] != ''

def clean_party(party):
    return 'democratic' if party == 'Democrat' else 'republican' if party == 'Republican' else None

def process_committee(filepath):
    table = etl.fromcsv(filepath) \
        .rename({'name': 'fullName'}) \
        .cut('ward', 'division', 'party', 'fullName',
             'address', 'zip') \
        .select(has_ward_and_division) \
        .convert({'ward': int,
                  'division': int,
                  'fullName': 'title',
                  'address': 'title'}) \
        .convert('party', clean_party)

    return table
