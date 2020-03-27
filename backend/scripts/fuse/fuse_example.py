#!/usr/bin/env python

"""
example
"""
import csv
from pathlib import Path
from shutil import unpack_archive
from sys import stderr, stdout


SRC_DIR = Path('backend', 'data', 'collected', 'example')
DEST_DIR = Path('backend', 'data', 'fused', 'example')


def census_extract():
    """
    unpacks zip file, extracts the original file minus a meta row
    adds 'year' column
    """
    src_zippath = SRC_DIR.joinpath('census-2010-dp1.zip')
    src_fname = 'DEC_10_DP_DPDP1_with_ann.csv'
    srcpath = SRC_DIR.joinpath(src_zippath.stem, src_fname)
    unpack_archive(src_zippath, extract_dir=srcpath.parent)

    outdata = []
    with open(srcpath) as src:
        for i, row in enumerate(csv.DictReader(src)):
            # basically skip the 1st meta row
            if i == 0:
                pass
            else:
                d = row.copy()
                d['year'] = '2010'
                outdata.append(d)

    destpath = DEST_DIR.joinpath('census-2010-dp1.csv')
    return (outdata, destpath)




def legislators_merge():
    """
    put historical and current congress into one list, with
        an in_office field to distinguish between the two groups
    """

    outdata = []
    for slug in ('current', 'historical'):
        srcpath = SRC_DIR.joinpath(f'congress-legislators-{slug}.csv')
        with open(srcpath) as src:
            for row in csv.DictReader(src):
                d = row.copy()
                d['in_office'] = slug == 'current'
                outdata.append(d)

    destpath = DEST_DIR.joinpath('congress-legislators.csv')

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
    for foo in (census_extract, legislators_merge):
        data, dest = foo()
        writeout(data, dest)

if __name__ == '__main__':
    main()
