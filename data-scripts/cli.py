import json

import click
import petl as etl

from registry import process_registry
from turnout import process_turnout
from committee import process_committee
from divisions import process_divisions
from leaders import process_leaders
from contentful import process_import, process_drop

@click.group()
def cli():
    pass

@cli.command()
@click.option('--registry', '-r', 'registry_file', type=click.Path(),
              required=True, help='Qualified voter registry file')
@click.option('--turnout', '-t', 'turnout_file', type=click.Path(),
              required=True, help='Voter turnout file')
def voters(registry_file, turnout_file):
    """Cleans and combines registry and turnout files"""
    registry = process_registry(registry_file)
    turnout = process_turnout(turnout_file)

    registry.leftjoin(turnout, key=['ward', 'party']) \
        .tocsv()

@cli.command()
@click.argument('committee_file', type=click.Path())
def committee(committee_file):
    """Cleans committee person file"""
    process_committee(committee_file).tojson()

@cli.command()
@click.option('--out', '-o', 'output_dir', type=click.Path(),
              required=True, help='Output directory for individual .geojson files')
@click.argument('divisions_file', type=click.Path())
def divisions(divisions_file, output_dir):
    """Cleans and separates divisions file"""
    process_divisions(divisions_file, output_dir)

@cli.command()
@click.argument('leaders_file', type=click.Path())
def leaders(leaders_file):
    """Cleans ward leaders CSV and converts to JSON file"""
    process_leaders(leaders_file).tojson()

@cli.command('import')
@click.argument('import_file')
@click.option('--space', 'space_id', required=True,
              help='Contentful.com Space ID')
@click.option('--content-type', 'content_type', required=True,
              help='Contentful.com Content type ID')
@click.option('--apikey', 'api_key', required=True,
              help='Contentful.com API key')
def import_contentful(import_file, space_id, content_type, api_key):
    """Imports a JSON file to a contentful.com space"""
    process_import(import_file, space_id, content_type, api_key)

@cli.command('drop')
@click.option('--space', 'space_id', required=True,
              help='Contentful.com Space ID')
@click.option('--content-type', 'content_type', required=True,
              help='Contentful.com Content type ID')
@click.option('--apikey', 'api_key', required=True,
              help='Contentful.com API key')
def drop_contentful(space_id, content_type, api_key):
    """Drops all entries from a contentful.com content type.
       Processes 1,000 records at a time."""
    process_drop(space_id, content_type, api_key)

if __name__ == '__main__':
    cli()
