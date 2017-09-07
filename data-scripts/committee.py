import petl as etl

def clean_party(party):
    if party == 'Democrat':
        return 'democratic'
    else:
        return party.lower()

def process_committee(filepath):
    table = etl.fromcsv(filepath) \
        .rename({'DISTRICT': 'division',
                 'WARD': 'ward',
                 'NAME': 'name',
                 'ADDRESS': 'address',
                 'ZIP': 'zip',
                 'PARTY': 'party',}) \
        .cut('ward', 'division', 'party', 'name', 'address', 'zip') \
        .convert({'ward': int,
                  'division': int,
                  'name': 'title',
                  'address': 'title'}) \
        .convert('party', clean_party)

    return table
