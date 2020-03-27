#!/usr/bin/env python


from pathlib import Path
import requests
from sys import stderr, stdout

DEST_DIR = Path('backend/data/collected/example')
URLS = {
    'census-2010-dp1.zip': 'https://github.com/dannguyen/smalldata/raw/master/randos/aff_download_2010_dp1_states.zip',
    'congress-legislators-current.csv': 'https://raw.githubusercontent.com/dannguyen/smalldata/master/randos/congress-legislators-current.csv',
    'congress-legislators-historical.csv': 'https://raw.githubusercontent.com/dannguyen/smalldata/master/randos/congress-legislators-historical.csv',
}


def fetch(url):
    stderr.write(f"Fetching from: {url}\n")
    resp = requests.get(url)
    if not resp.status_code == 200:
        raise ValueError(f"Unexpected status code: {resp.status_code} for url {url}")
    else:
        stderr.write(f"\tDownloaded {len(resp.content)} bytes\n")
        return resp.content


def main():
    DEST_DIR.mkdir(exist_ok=True, parents=True)
    for slug, url in URLS.items():
        data = fetch(url)
        dest_path = DEST_DIR.joinpath(slug)
        with open(dest_path, 'wb') as outs:
            stderr.write(f"Writing {len(data)} bytes to: {dest_path}\n")
            outs.write(data)



if __name__ == '__main__':
    main()

