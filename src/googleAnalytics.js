import ReactGA from "react-ga";

ReactGA.initialize("UA-153214291-2");

export const pageView = page => {
  ReactGA.pageview(page);
};
