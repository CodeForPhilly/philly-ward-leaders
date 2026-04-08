import json

from contentful_management import Client
from tqdm import tqdm
from ratelimit import rate_limited

def process_import(filepath, space_id, content_type_id, api_key,
                   environment_id='master', update=False):
    client = Client(api_key)
    space = client.entries(space_id, environment_id)

    with open(filepath) as import_file:
        records = json.load(import_file)

        for record in tqdm(records):
            entry_id = None # tell server to auto-generate it
            if 'ID' in record.keys():
              entry_id = record['ID']
              record.pop('ID')
            fields = {key: {'en-US': value} for (key, value) in record.items()}
            entry_data = {
                'content_type_id': content_type_id,
                'fields': fields
            }

            try:
                if update and entry_id:
                    entry = space.find(entry_id)
                    for key, value in fields.items():
                        entry.fields()[key] = value
                    entry.save()
                else:
                    entry = space.create(entry_id, entry_data)
            except Exception as err:
                action = 'Update' if update and entry_id else 'Creation'
                print(f'{action} failed', json.dumps(record))
                print(err)
            else:
                try:
                    entry.publish()
                except Exception:
                    pass

@rate_limited(78)
def delete_entry(entry):
    if entry.is_published:
        entry.unpublish()

    entry.delete()

def process_fetch(space_id, content_type_id, api_key, environment_id='master'):
    """Fetches all entries for a content type and returns them as a list of dicts"""
    client = Client(api_key)
    content_type = client.content_types(space_id, environment_id).find(content_type_id)
    entries = content_type.entries().all({'limit': 1000})

    records = []
    for entry in entries:
        record = {}
        for field_name, field_value in entry.fields().items():
            record[field_name] = field_value
        records.append(record)
    return records

def process_drop(space_id, content_type_id, api_key):
    client = Client(api_key)
    content_type = client.content_types(space_id).find(content_type_id)
    entries = content_type.entries().all({ 'limit': 1000 })

    for entry in tqdm(entries):
        delete_entry(entry)
