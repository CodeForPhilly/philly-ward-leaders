import json

import click
import petl as etl

from registry import process_registry
from turnout import process_turnout
from committee import process_committee
from divisions import process_divisions
from leaders import process_leaders

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
    process_committee(committee_file).tocsv()

@cli.command()
@click.option('--out', '-o', 'output_dir', type=click.Path(),
              required=True, help='Output directory for individual .geojson files')
@click.argument('divisions_file', type=click.Path())
def divisions(divisions_file, output_dir):
    """Cleans and separates divisions file"""
    process_divisions(divisions_file, output_dir)

@cli.command()
@click.option('--out', '-o', 'output_dir', type=click.Path(),
              required=True, help='Output directory for individual .md files')
@click.argument('leaders_file', type=click.Path())
def leaders(leaders_file, output_dir):
    """Splits ward leaders CSV into individual YAML front-matter files"""
    process_leaders(leaders_file, output_dir)

if __name__ == '__main__':
    cli()
