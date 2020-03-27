#!/usr/bin/env python

"""
example
"""

import csv
import json
from pathlib import Path
from sys import stderr, stdout


SRC_DIR = Path('backend', 'data', 'wrangled', 'example')
DEST_DIR = Path('backend', 'data', 'wrapped', 'example')


FIPS_PATH = Path('backend', 'data', 'lookups', 'fips.csv')

def load_fips():
    return list(csv.DictReader(FIPS_PATH.open()))

def census_wrap():
    """
    creates a dict of lists, with the keys corresponding to postal code, which
        must be grabbed from a lookup table
    """
    srcpath = SRC_DIR.joinpath('census.csv')
    destpath = DEST_DIR.joinpath('census.json')
    fipsmap = load_fips()

    outdata = {}
    with open(srcpath) as src:
        for row in csv.DictReader(src):
            fmap = next(s for s in fipsmap if s['fips'] == row['fips'])
            abbr = row['postal_code'] = fmap['postal_code']
            outdata[abbr] = row

    jtxt = json.dumps(outdata, indent=2)
    destpath.write_text(jtxt)

    return destpath

def main():
    DEST_DIR.mkdir(exist_ok=True, parents=True)
    for foo in (census_wrap, ):
        destpath = foo()
        stderr.write(f"Wrapped: {destpath}\n")



if __name__ == '__main__':
    main()
