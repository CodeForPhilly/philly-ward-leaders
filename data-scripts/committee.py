import petl as etl
from slugify import slugify

def clean_party(party):
    return 'democratic' if party == 'Democrat' else 'republican' if party == 'Republican' else None

def create_slug(row):
    url_string = '{} {} {}'.format(row['ward'],
        row['division'], row['fullName'])
    return slugify(url_string)

def process_committee(filepath):
    table = etl.fromcsv(filepath) \
        .rename({'name': 'fullName'}) \
        .cut('ward', 'division', 'party', 'fullName',
             'address', 'zip') \
        .convert({'ward': int,
                  'division': int,
                  'fullName': 'title',
                  'address': 'title'}) \
        .convert('party', clean_party) \
        .addfield('slug', create_slug)

    return table
