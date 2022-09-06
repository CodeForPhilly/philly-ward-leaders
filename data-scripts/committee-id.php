#!/usr/bin/env php
<?php

/**
 * Script to process committee file to JSON, adding a unique ID per row.
 *
 * Example usage:
 * cat input_data/2022/COMMITTEEPEOPLE_WINNERS_REPUBLICAN.csv | ./committee-id.php > input_data/2022/COMMITTEEPEOPLE_WINNERS_REPUBLICAN.json
 */

/**
 *  UTF-8 BOM sequence
 */
const BOM_UTF8 = "\xEF\xBB\xBF";

$template = [
  'ID' => '',
  'ward' => 0,
  'division' => 0,
  'party' => '',
  'fullName' => '',
  'address' => '',
  'zip' => '',
];
$map = [];

if (($line = fgets(STDIN)) !== FALSE) {
  // Strip UTF8 BOM if present.
  if (strpos($line, BOM_UTF8) === 0) {
    $line = substr($line, 3);
    fwrite(STDERR, "UTF-8 BOM stripped\n");
  }
  else {
    fwrite(STDERR, "UTF-8 BOM not found\n");
  }
  $row = array_map('trim', str_getcsv($line));
  $expected_keys = ['Race', 'Party', 'Name', 'Add1', 'Add2', 'Zip'];
  if (count(array_intersect($row, $expected_keys)) != count($expected_keys)) {
    throw new \Exception('Missing expected header');
  } 
  $map = array_flip($row);
}

$rows = [];
// Track A/B per division.
$seat = [];

while (($raw = fgetcsv(STDIN)) !== FALSE) {
  $row = array_map('trim', $raw);
  $new_row = $template;
  // Race looks like "01-02 DEM".
  $ward_div = $row[$map['Race']];
  $ab = $seat[$ward_div] ?? 'A';
  $seat[$ward_div] = 'B';
  $new_row['ID'] = str_replace(' ', '-', "$ward_div $ab");
  $matches = [];
  preg_match('/([0-9]{2})-([0-9]{2})/', $ward_div, $matches);
  $new_row['ward'] = (int) $matches[1];
  $new_row['division'] = (int) $matches[2];
  $new_row['party'] = mb_strtolower($row[$map['Party']]);
  $new_row['zip'] = $row[$map['Zip']];
  $address = $row[$map['Add1']] . ($row[$map['Add2']] ? ', ' . $row[$map['Add2']] : '');
  $new_row['address'] = mb_convert_case($address, MB_CASE_TITLE);
  $new_row['fullName'] = mb_convert_case($row[$map['Name']], MB_CASE_TITLE);
  $rows[] = $new_row;
}

echo json_encode($rows, JSON_PRETTY_PRINT);
