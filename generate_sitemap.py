#!/usr/bin/env python3
import os
import sys
import time
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_URL = "https://mallpreservation.org"
SITEMAP_PATH = os.path.join(ROOT_DIR, "sitemap.xml")
POLL_INTERVAL_SECONDS = 2


def get_html_files():
    return sorted(
        filename
        for filename in os.listdir(ROOT_DIR)
        if filename.endswith(".html")
    )


def build_sitemap():
    today = datetime.utcnow().strftime("%Y-%m-%d")
    html_files = get_html_files()

    url_entries = []
    for filename in html_files:
        if filename == "index.html":
            loc = f"{BASE_URL}/"
        else:
            loc = f"{BASE_URL}/{filename}"
        url_entries.append(
            "  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{today}</lastmod>\n"
            "  </url>"
        )

    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + ("\n".join(url_entries) if url_entries else "")
        + "\n</urlset>\n"
    )

    with open(SITEMAP_PATH, "w", encoding="utf-8") as file:
        file.write(sitemap)

    print(f"Updated sitemap.xml with {len(html_files)} URLs.")


def watch_for_changes():
    file_states = {
        filename: os.path.getmtime(os.path.join(ROOT_DIR, filename))
        for filename in get_html_files()
    }

    print("Watching for HTML changes...")
    while True:
        time.sleep(POLL_INTERVAL_SECONDS)
        current_files = get_html_files()
        current_states = {
            filename: os.path.getmtime(os.path.join(ROOT_DIR, filename))
            for filename in current_files
        }

        if current_states != file_states:
            build_sitemap()
            file_states = current_states


if __name__ == "__main__":
    if "--watch" in sys.argv:
        build_sitemap()
        watch_for_changes()
    else:
        build_sitemap()
