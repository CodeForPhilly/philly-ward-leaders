from collections import OrderedDict

import petl as etl

aggregation = OrderedDict()
aggregation['sum_democratic'] = 'democratic', sum
aggregation['sum_republican'] = 'republican', sum
aggregation['sum_total'] = 'total', sum

def rowgenerator(row):
    yield [row['ward'], 'democratic', row['sum_total'], row['sum_democratic']]
    yield [row['ward'], 'republican', row['sum_total'], row['sum_republican']]

def process_registry(filepath):
    table = etl.fromcsv(filepath) \
        .rename({'Ward': 'ward',
                 'Division': 'division',
                 'Dem': 'democratic',
                 'Rep': 'republican',
                 'Total': 'total'}) \
        .cut('ward', 'division', 'democratic', 'republican', 'total') \
        .convert({'ward': 'strip',
                  'division': int,
                  'democratic': int,
                  'republican': int,
                  'total': int}) \
        .aggregate('ward', aggregation) \
        .rowmapmany(rowgenerator, header=['ward', 'party', 'registered_total',
                                          'registered_party'])

    return table
