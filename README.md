# ReactBoids
This is the Covid Sim User Client for the covid simulator system.

## development
* fork and clone this repo to your local machine
* create a .env file in the root of the project that contains the following:
  * REACT_APP_API_SERVER=http://localhost:8081
* open a console window and start the covid sim client by entering `yarn start`

the covid sim client should then start in your default browser on http://localhost:3000

## deployment
the bkirkby/ReactBoids repo is configured to deploy a build of the `master` branch
automatically to the publically available https://covidsim.now.sh host.

this means you should not merge into master unless you are sure the changes should
be made live in production.

for those of you forking the code, feel free to submit pull requests on any
changes you made.