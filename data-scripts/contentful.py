import json

from contentful_management import Client

def process_import(filepath, space_id, content_type, api_key):
    client = Client(api_key)
    space = client.entries(space_id)

    with open(filepath) as import_file:
        records = json.load(import_file)

        for record in records:
            entry_id = None # tell server to auto-generate it
            entry_data = {
                'content_type_id': content_type,
                'fields': {key: {'en-US': value} for (key, value) in record.items()}
            }

            try:
                entry = space.create(entry_id, entry_data)
            except Exception:
                print('Creation failed', json.dumps(record))
            else:
                try:
                    entry.publish()
                except Exception:
                    pass
