<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/heading.png">
    <img src="images/heading-dark.png" width="80%">
  </picture>
</p>

<p align="center">
  KoInsight is a web-based tool that helps visualizing your KoReader reading statistics and more.
</p>

<p align="center">
   <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/screenshots/stats_1_d.png">
    <img src="images/screenshots/stats_1_l.png" width="100%">
  </picture>
</p>

## Features

- Import & Visualize KoReader reading statistics
- Keep track of your reading habits
- Act as a KoReader Sync Server
- Custom KoReader plugin for easier sync



## Screenshots
<table>
  <tr>
    <td><strong>Home page</strong></td>
    <td><strong>Book view</strong></td>
  </tr>
  <tr>
    <td><img src="images/screenshots/book_ld.png" width="300"/></td>
    <td><img src="images/screenshots/home_ld.png" width="300"/></td>
  </tr>
  <tr>
    <td><strong>Statistics</strong></td>
    <td><strong>Statistics</strong></td>
  </tr>
  <tr>
    <td><img src="images/screenshots/stats_1_ld.png" width="300"/></td>
    <td><img src="images/screenshots/stats_2_ld.png" width="300"/></td>
  </tr>
</table>

See all [screenshots](/images/screenshots/)


## Installation
Using [Docker](https://docker.com) and [Docker Compose](https://docs.docker.com/compose/)

Add the following to your `compose.yaml` file:

```yaml
name: koinsight
services:
  koinsight:
    image: ghcr.io/georgesg/koinsight:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
```
Run `docker compose up -d`.

## Usage

In order to start seeing data in KoInsight, you need to upload your statistics data.
Currently, there are 2 ways to do that:
1. Extract your `statistics.sqlite` from Koreader and upload it to KoInsight using the "Upload Statistics DB" button.
1. Install, configure, and use the KoInsight plugin for KoReader to sync your data from the KoReader app.

## KoReader Plugin
The KoReader plugin is a simple plugin that syncs your reading statistics to KoInsight.
To install it:
1. Download the zip bundle from the "KoReader Plugin" button in the main menu.
1. Extract it in your `koreader/plugins/` folder.

To use it:
1. Open the KoReader app.
1. Open the KoInsight plugin from the tools menu (should be below the "More tools" submenu).
1. Click "Configure KoInsight" and enter the URL of your KoInsight server (e.g. `http://server-ip:3000`).
  1. NOTE: Keep in mind your KoReader needs to have network access to the server to sync.
1. Click "Sync" in the KoInsight plugin menu.

Reload your KoInsight web dashboard. If everything went well (🤞), you should see your data

## Uploading Statistics SQLite
1. Open a file manager on the device you use KoReader on.
1. Navigate to the KoReader folder.
1. Open the "settings" folder.
1. There should be a `statistics.sqlite` file there. Copy it to your computer and upload it to KoInsight using the "Upload Statistics DB" button.
1. Reload the KoInsight web dashboard.

Every time you need to reupload data, you would need to upload the statistics database file again.
