import React from "react";

const About = ({ setShowAbout }) => {
  return (
    <div className="about">
      <div
        style={{
          width: "100%",
          marginRight: "5px"
        }}
      >
        <button style={{ width: "100%" }} onClick={() => setShowAbout(false)}>
          close
        </button>
      </div>
      <div className="scrollable">
        <p />
        <div style={{ textAlign: "center" }}>
          <span style={{ paddingBottom: "0px", fontSize: "xx-large" }}>
            infection simulator
          </span>
          <span style={{ paddingTop: "0px", fontSize: "small" }}>
            by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.buymeacoffee.com/briankirkby"
            >
              kirkby
            </a>
          </span>
        </div>
        <p />
        tl;dr the menu items will run simulations based on the specified
        constraints. to run a sim select one with the params you want to
        run with. play around with the sliders to see how they affect the
        simulation params.

        <p style={{ borderTop: "1px solid black" }} />
        the covid infection simulator was conceived during the covid19 lockdown
        of 2020. i wondered if even simple simulations would show the mitigation
        measures that society was taking during lockdown. specifically social
        distancing and isolation.
        <p />
        social distancing is achieved in this simulation by having the people (i
        call them "pips") pay attention to the other pip's location around them
        and adjust their trajectory away from the middle of the crowd. the
        larger the social distancing factor, the large the radius where the pip
        will look to get away from other pips.
        <p />
        isolation is achieved in this simulation by having people stay where
        they start and not travel around. the factor on the isolation slide is
        the percentage of the number of pips in the population that will stay
        put.
        <p />
        pips have very simple behavior based on the immediate environment around
        them. they are social creatures and will always feel a pull toward the
        mid point location of the people around them and will adjust accordingly
        to move there. there is also a pull for these pips to go toward the
        average trajectory of the pips around them.
        <p />
        pips also have a limit to how fast they are able to change their
        direction which creates a constant strain on competing desires, much
        like real life. the pip's social desires to go where other pips are and
        in the same direction as other pips conflict with their constraints of
        staying put and/or staying away from other pips.
        <p />
        the virii behavior is extremely simple in that when an infected pip gets
        close enough to another pip, it will transfer the infection.
        <p />
      </div>
    </div>
  );
};

export default About;
