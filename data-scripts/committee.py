import petl as etl

def clean_party(party):
    return 'Democratic' if party == 'Democrat' else party

def process_committee(filepath):
    table = etl.fromcsv(filepath) \
        .rename({'name': 'fullName'}) \
        .cut('ward', 'division', 'party', 'fullName',
             'address', 'zip') \
        .convert({'ward': int,
                  'division': int,
                  'fullName': 'title',
                  'address': 'title'}) \
        .convert('party', clean_party)

    return table
