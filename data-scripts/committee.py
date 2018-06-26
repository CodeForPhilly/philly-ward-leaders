import petl as etl

def expand_zip(zip):
    return '191' + zip


def create_ward(row):
    # Get characters before -, trim leading zeros, convert to int
    return int(row['ward_div'].split('-')[0].lstrip('0'))

def create_division(row):
    # Get characters after -, trim leading zeros, convert to int
    return int(row['ward_div'].split('-')[1].lstrip('0'))

def process_committee(filepath):
    table = etl.fromcsv(filepath) \
        .rename({'PRECINCT': 'ward_div',
                 'PARTY': 'party',
                 'SELECTION': 'fullName',
                 'STREET': 'address',
                 'ZIP': 'zip'}) \
        .cut('ward_div', 'party', 'fullName',
             'address', 'zip') \
        .convert({'fullName': 'title',
                  'address': 'title'}) \
        .convert('party', 'lower') \
        .convert('zip', expand_zip) \
        .addfield('ward', create_ward, index=0) \
        .addfield('division', create_division, index=1) \
        .cutout('ward_div')

    return table
