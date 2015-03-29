# Philly Ward Leaders

## Data source
The data for this application is pulled on-demand from a
[google spreadsheet](https://docs.google.com/spreadsheets/d/1nkkFQUaxcGa0oDPWl1Vr1cknToIq8FxfJ7CILQrFgBM/edit?usp=sharing).
If you spot something we got wrong, or want to add information, right-click on a cell to add a comment to submit information,
or create an issue on this repository if you'd like to dive in with edit access.

## Installation
Clone the repo using:
```bash
$ git clone https://github.com/timwis/philly-ward-leaders.git
```

The repository already includes all dependencies (since it's also serving the web page via the `gh-pages` branch),
but if you'd like to *add* dependencies, use bower. To install bower, use:
```bash
$ sudo npm install -g bower
```
Then to install a dependency, use:
```bash
$ bower install --save <dependency-name>
```
