import csv

import petl as etl

def remove_dash_lines(value):
    """Some social media values are '---------'"""
    return None if value[:2] == '--' else value

def expand_party(party):
    return 'democratic' if party == 'D' else 'republican' if party == 'R' else None

def expand_gender(gender):
    return 'Male' if gender == 'M' else 'Female' if gender == 'F' else None

def empty_to_none(value):
    return None if value == '' else value

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
                 'LinkedIn':    'linkedin',
                 'Facebook':    'facebook',
                 'Twitter':     'twitter',
                 'Email':       'email',
                 'Photo':       'photoUrl',
                 'Divisions':   'divisionCount',
                 'Committee People':    'committeePersonCount',
                 'Party Registered':    'registeredVotersParty',
                 'Total Registered':    'registeredVotersTotal',
                 'Party Turnout':       'turnoutParty',
                 'Total Turnout':       'turnoutTotal'}) \
        .cutout('Lat', 'Lng', 'Last Voted', 'Photo Offset',
                '2014 General Party Turnout', '2014 General Total Turnout') \
        .convert(('ward', 'wardOfResidence', 'yearOfBirth',
                  'divisionCount', 'committeePersonCount',
                  'registeredVotersParty', 'registeredVotersTotal',
                  'turnoutParty', 'turnoutTotal'), int) \
        .convert(('linkedin', 'facebook', 'twitter'), remove_dash_lines) \
        .convert('party', expand_party) \
        .convert('gender', expand_gender) \
        .convertall(empty_to_none)

    return table
