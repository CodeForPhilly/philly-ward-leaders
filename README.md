# Philly Ward Leaders
Shining a spotlight on the powerful players behind Philadelphia elections.

Had you heard of all the candidates for judge last time you voted? How about
City Council at-Large? When you voted, a neighbor of yours likely handed you a
ballot of candidates endorsed by your ward. If you haven’t heard of the
candidates, why not take your neighbor’s advice?

These endorsements are determined by Ward Leaders, and have a huge influence
over who gets elected in Philadelphia. As powerful and few as they are (69),
ward leaders tend to remain behind the scenes and most voters don’t even know
who theirs is. This transparency web site aims to bring a level of spotlight
to ward leaders that is more proportional to the power they wield.

## Data source
The data for this application is pulled on-demand from a
[google spreadsheet](https://docs.google.com/spreadsheets/d/1nkkFQUaxcGa0oDPWl1Vr1cknToIq8FxfJ7CILQrFgBM/edit?usp=sharing).
If you spot something we got wrong, or want to add information, right-click on
a cell to add a comment to submit information, or create an issue on this
repository if you'd like to dive in with edit access.

## Installation
Clone the repo using:
```bash
$ git clone https://github.com/CodeForPhilly/philly-ward-leaders.git
```
Install dependencies using:
```bash
$ npm install
```

This application uses [browserify](http://browserify.org) to compile JavaScript.
To run a local development server and automatically recompile when changes are
detected, use:
```bash
npm start
```
Note: This command will compile the CSS, but it won't detect any changes. To
recompile the CSS, either run `npm start` again, or use:
```bash
npm run build:css
```

To compile CSS and JavaScript for production, run:
```bash
npm run build
```
