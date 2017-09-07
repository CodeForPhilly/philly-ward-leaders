import petl as etl

def create_ward(row):
    # Get first 2 characters, trim leading zeros, convert to int
    return row['ward_div'][:2].lstrip('0')

def create_division(row):
    # Get last 2 characters, trim leading zeros, convert to int
    return int(row['ward_div'][2:].lstrip('0'))

def process_turnout(filepath):
    table = etl.fromcsv(filepath) \
        .rename({'Precinct Code': 'ward_div',
                 'Political Party': 'party',
                 'Voter Count': 'voters'}) \
        .cut('ward_div', 'party', 'voters') \
        .convert({'voters': int,
                  'party': 'lower'}) \
        .addfield('ward', create_ward, index=0) \
        .addfield('division', create_division, index=1) \
        .cutout('ward_div')

    total_turnout = table \
        .aggregate('ward', aggregation=sum, value='voters') \
        .rename('value', 'turnout_total')

    party_turnout = table \
        .select('{party} == "democratic" or {party} == "republican"') \
        .aggregate(key=('ward', 'party'), aggregation=sum, value='voters') \
        .rename('value', 'turnout_party')

    combined_turnout = party_turnout.leftjoin(total_turnout, key='ward')

    return combined_turnout
