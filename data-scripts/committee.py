import petl as etl
import pprint

ab_track = {}

# This is not working - all are B
def create_id(row):
    # Append A or B like: "01-01-DEM-A"
    ab = 'B'
    wd = row['ward_div']
    if wd not in ab_track:
        ab = 'A'
        ab_track[wd] = 'B'
    id = row['ward_div'] + ' ' + ab
    # pprint.pprint(id)
    return id.replace(' ', '-')

def create_ward(row):
    # Incoming data like: "21-20 DEM"
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
                 'Address': 'address',
                 'Zip': 'zip'}) \
        .cut('ward_div', 'party', 'fullName',
             'address', 'zip') \
        .convert({'fullName': 'title',
                  'address': 'title'}) \
        .convert('party', 'lower') \
        .addfield('ID', create_id, index=0) \
        .addfield('ward', create_ward, index=1) \
        .addfield('division', create_division, index=2) \
        .cutout('ward_div')
    
    return table
