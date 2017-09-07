import json

from contentful_management import Client

def process_import(filepath, space_id, api_key):
    client = Client(api_key)

    with open(filepath) as import_file:
        records = json.load(import_file)

        entries = client.entries(space_id).create(records)
