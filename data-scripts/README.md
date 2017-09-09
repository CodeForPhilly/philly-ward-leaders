# Data Scripts
Handy little python scripts to clean and merge voter turnout
and registration data. Also a script to migrate content.

```
Usage: cli.py [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  committee  Cleans committee person file
  divisions  Cleans and separates divisions file
  import     Imports a JSON file to a contentful.com space
  leaders    Cleans ward leaders CSV and converts to JSON...
  voters     Cleans and combines registry and turnout...
```

## committee persons
```
Usage: cli.py committee [OPTIONS] COMMITTEE_FILE

  Cleans committee person file

Options:
  --help  Show this message and exit.
```

## division boundaries
```
Usage: cli.py divisions [OPTIONS] DIVISIONS_FILE

  Cleans and separates divisions file

Options:
  -o, --out PATH  Output directory for individual .geojson files  [required]
  --help          Show this message and exit.
```

## contentful import
```
Usage: cli.py import [OPTIONS] IMPORT_FILE

  Imports a JSON file to a contentful.com space

Options:
  --space TEXT         Contentful.com Space ID  [required]
  --content-type TEXT  Contentful.com Content type ID  [required]
  --apikey TEXT        Contentful.com API key  [required]
  --help               Show this message and exit.
```

## ward leaders
```
Usage: cli.py leaders [OPTIONS] LEADERS_FILE

  Cleans ward leaders CSV and converts to JSON file

Options:
  --help  Show this message and exit.
```

## voter registry and turnout
```
Usage: cli.py voters [OPTIONS]

  Cleans and combines registry and turnout files

Options:
  -r, --registry PATH  Qualified voter registry file  [required]
  -t, --turnout PATH   Voter turnout file  [required]
  --help               Show this message and exit.
```
