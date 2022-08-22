import petl as etl

def create_ward(row):
    return int(row['ward_div'].split('-')[0].lstrip('0'))

def create_division(row):
    # Delete "DEM" or "REP" from the end of the name
    # Get characters after -, trim leading zeros, convert to int
    return int(row['ward_div'].split('-')[1].lstrip('0').strip('DEM').strip('REP'))

def process_committee(filepath):
    table = etl.fromcsv(filepath) \
        .rename({'Race': 'ward_div',
                 'Party': 'party',
                 'Name': 'fullName',
                 'Add1': 'address',
                 'Zip': 'zip'}) \
        .cut('ward_div', 'party', 'fullName',
             'address', 'zip') \
        .convert({'fullName': 'title',
                  'address': 'title'}) \
        .convert('party', 'lower') \
        .addfield('ward', create_ward, index=0) \
        .addfield('division', create_division, index=1) \
        .cutout('ward_div')
    
    return table
