#!/usr/bin/env python

"""
example
"""


from pathlib import Path
import requests
from sys import stderr, stdout

DEST_DIR = Path('data/collected/')
URLS = {
    'states.topo.json': 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json'
}
