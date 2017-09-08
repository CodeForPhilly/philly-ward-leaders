import csv

import petl as etl

def remove_dash_lines(value):
    """Some social media values are '---------'"""
    return None if value[:2] == '--' else value

def expand_party(party):
    return 'Democratic' if party == 'D' else 'Republican' if party == 'R' else None

def expand_gender(gender):
    return 'Male' if gender == 'M' else 'Female' if gender == 'F' else None

def process_leaders(filepath):
    table = etl.fromcsv(filepath) \
        .rename({'Name':        'fullName',
                 'Ward':        'ward',
                 'Sub-Ward':    'subWard',
                 'Party':       'party',
                 'Nickname':    'nickname',
                 'Phones':      'phone',
                 'Address':     'address',
                 'Gender':      'gender',
                 'Ward of Residence':   'wardOfResidence',
                 'Year of Birth':       'yearOfBirth',
                 'Occupation':          'occupation',
                 'Photo':       'photo',
                 'LinkedIn':    'linkedin',
                 'Facebook':    'facebook',
                 'Twitter':     'twitter',
                 'Email':       'email'}) \
        .cutout('Lat', 'Lng', 'Last Voted', 'Photo Offset',
                'Divisions', 'Committee People', 'Party Registered',
                'Total Registered', 'Party Turnout', 'Total Turnout',
                '2014 General Party Turnout', '2014 General Total Turnout',
                'Total Turnout', 'photo') \
        .convert({'ward': int, 'wardOfResidence': int, 'yearOfBirth': int}) \
        .convert(('linkedin', 'facebook', 'twitter'), remove_dash_lines) \
        .convert('party', expand_party) \
        .convert('gender', expand_gender)

    return table