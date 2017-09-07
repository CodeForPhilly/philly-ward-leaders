import csv
from collections import OrderedDict
from os import path

from slugify import slugify

def process_leaders(filepath, output_dir):
    with open(filepath) as input_file:
        reader = csv.DictReader(input_file)

        for row in reader:
            lines = [
                'ward: ' + row['Ward'],
                'sub_ward: ' + row['Sub-Ward'],
                'party: ' + row['Party'],
                'name: ' + row['Name'],
                'nickname: ' + row['Nickname'],
                'phones: ' + row['Phones'],
                'address: ' + row['Address'],
                'lat: ' + row['Lat'],
                'lng: ' + row['Lng'],
                'ward_of_residence: ' + row['Ward of Residence'],
                'year_of_birth: ' + row['Year of Birth'],
                'gender: ' + row['Gender'],
                'photo: ' + row['Photo'],
                'photo_offset: ' + row['Photo Offset'],
                'occupation: ' + row['Occupation'],
                'linkedin: ' + row['LinkedIn'],
                'facebook: ' + row['Facebook'],
                'twitter: ' + row['Twitter'],
                'email: ' + row['Email'],
                'divisions: ' + row['Divisions'],
            ]
            contents = '---\n' + '\n'.join(lines) + '\n---'

            slug = slugify('{}{}-{}'.format(row['Ward'], row['Sub-Ward'], row['Name']))
            output_filename = slug + '.md'
            output_filepath = path.join(output_dir, output_filename)

            with open(output_filepath, 'w') as output_file:
                output_file.write(contents)
