# ReactBoids
A browser-based Covid infection simulator built on a boids flocking model.
Explore how social distancing and isolation affect the way an infection
spreads through a population of "pips". The simulation runs entirely in the
browser.

## development
* fork and clone this repo to your local machine
* open a console window and start the covid sim client by entering `yarn start`

the covid sim client should then start in your default browser on http://localhost:3000

## deployment
the bkirkby/ReactBoids repo is configured to deploy a build of the `master` branch
automatically to the publically available https://covidsim.now.sh host.

this means you should not merge into master unless you are sure the changes should
be made live in production.

for those of you forking the code, feel free to submit pull requests on any
changes you made.

## analytics
the app reports a handful of engagement events to Google Analytics 4 (gtag.js)
via `src/analytics.js`:
* `page_view` (automatic)
* `run_start` — when a user starts a run, with a `source` (play / preset name)
* `run_stop` — when a user stops a run
* `about_opened` — when the About screen is opened

analytics only send data in a **production build**; in development, events buffer
into `window.dataLayer` but nothing is sent to Google. the measurement id defaults
to the project's own but can be overridden with a `REACT_APP_GA_MEASUREMENT_ID`
environment variable. forkers should set their own id (or remove `src/analytics.js`).