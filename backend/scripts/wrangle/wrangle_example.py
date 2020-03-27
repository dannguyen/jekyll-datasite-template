#!/usr/bin/env python

"""
example
"""
import csv
from pathlib import Path
import re
from shutil import unpack_archive
from sys import stderr, stdout


SRC_DIR = Path('backend', 'data', 'fused', 'example')
DEST_DIR = Path('backend', 'data', 'wrangled', 'example')

CENSUS_HEADERS = {
        'year': 'year',
        'GEO.id': 'uid',
        'GEO.id2': 'fips',
        'GEO.display-label': 'name',
        'HD01_S150': 'households',
        'HD01_S001': 'population',
        'HD02_S078': 'white_pct',
        'HD02_S079': 'black_pct',
        'HD02_S106': 'hispanic_pct',
        'HD02_S081': 'asian_pct',
        'HD02_S080': 'native_pct',
    }

LEGISLATORS_HEADERS = {
    'type': 'title',
    'in_office': 'in_office',
    'last_name': 'last_name',
    'first_name': 'first_name',
    'middle_name': 'middle_name',
    'suffix': 'suffix',
    'nickname': 'nickname',
    'full_name': 'full_name',
    'birthday': 'birthdate',
    'gender': 'gender',
    'state': 'state',
    'district': 'district',
    'senate_class': 'senate_class',
    'party': 'party',
    'url': 'official_url',
    'wikipedia_id': 'wikipedia_id',
    'lis_id': 'lis_id',
    'govtrack_id': 'govtrack_id',
    'thomas_id': 'thomas_id',
    'bioguide_id': 'bioguide_id',
    'fec_ids': 'fec_ids',
}



def _mapfields(data, headermap):
    for i, row in enumerate(data):
        d = {}
        for xh, yh in headermap.items():
            d[yh] = row[xh]
        yield d


def census_wrangle():
    outdata = []
    destpath = DEST_DIR.joinpath('census.csv')
    srcpath = SRC_DIR.joinpath('census-2010-dp1.csv')

    with open(srcpath) as src:
        for d in _mapfields(csv.DictReader(src), CENSUS_HEADERS):
            d['population'] = re.match(r'^\d+', d['population']).group()
            d['households'] = re.match(r'^\d+', d['households']).group()
            outdata.append(d)
    return (outdata, destpath)

def legislators_wrangle():
    """
    only include people born 1900 or after
    change rep/sen to "Sen.", "Rep."
    zero-pad district

    """
    outdata = []
    destpath = DEST_DIR.joinpath('legislators.csv')
    srcpath = SRC_DIR.joinpath('congress-legislators.csv')

    with open(srcpath) as src:
        for d in _mapfields(csv.DictReader(src), LEGISLATORS_HEADERS):
            if d['birthdate'] >= '1900-01-01':
                if d['title'] == 'rep':
                    d['title'] = 'Rep.'
                elif d['title'] == 'sen':
                    d['title'] = 'Sen'

                if d['district']:
                    d['district'] = d['district'].rjust(2, '0')

                outdata.append(d)
    return (outdata, destpath)



def writeout(data, destpath):
    headers = data[0].keys()
    with open(destpath, 'w') as dest:
        outs = csv.DictWriter(dest, fieldnames=headers)
        outs.writeheader()
        outs.writerows(data)
        stderr.write(f"Wrote {len(data)} rows to: {destpath}\n")


def main():
    DEST_DIR.mkdir(exist_ok=True, parents=True)
    for foo in (census_wrangle, legislators_wrangle):
        data, dest = foo()
        writeout(data, dest)

if __name__ == '__main__':
    main()
