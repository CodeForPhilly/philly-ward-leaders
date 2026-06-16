import petl as etl


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
        .addfield('ward', create_ward, index=0) \
        .addfield('division', create_division, index=1)

    # Assign the A/B suffix in a single deterministic pass over the
    # materialized rows. petl re-invokes row functions an unspecified number
    # of times (tables are lazy and re-iterable), so the first-seen suffix
    # cannot be derived from mutable state inside a petl transform -- doing so
    # makes every row 'B'. Build the IDs here instead.
    seen = set()
    rows = []
    for rec in etl.dicts(table):
        wd = rec['ward_div']
        suffix = 'A' if wd not in seen else 'B'
        seen.add(wd)
        rec['ID'] = (wd + ' ' + suffix).replace(' ', '-')
        rows.append(rec)

    return etl.fromdicts(rows) \
        .cut('ID', 'ward', 'division', 'party', 'fullName', 'address', 'zip')
