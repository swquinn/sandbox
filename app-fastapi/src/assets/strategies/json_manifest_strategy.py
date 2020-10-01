import json
from urllib.parse import urljoin

def read_manifest(path):
    data = dict()
    with open(path) as f:
        data = json.load(f)
    return data


def get_asset(asset):
    print("in this function")
    base_url = "http://cdn-dev.sandbox.com"  # TODO: this should come from env
    json_manifest_path = "./public/build/manifest.json"    # TODO: this should come from config

    assets_data = read_manifest(json_manifest_path)
    return urljoin(base_url, assets_data[asset])