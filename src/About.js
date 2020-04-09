import React from "react";

const About = ({ setShowAbout }) => {
  return (
    <div className="about">
      <button onClick={() => setShowAbout(false)}>close</button>
      <div className="spacer" />
      <div style={{ fontSize: "x-large" }}>infection simulator v0.1β</div>
      <div style={{ fontSize: "x-small" }}>by brian kirkby</div>
      <div className="spacer" />
      <div>
        the infection simulator was conceived during the covid19 lockdown of
        2020. it's purpose is to give just a sense of what protective measures
        could do to "flatten the curve" on the spread of virii.
      </div>
      <div className="spacer" />
      <div>
        i think it's achieved that result even though it's a very basic
        simulator for both human and virii behaivor.
      </div>
      <div className="spacer" />
      <div>
        the people (i call them "pips") in this sim have very simple behavior
        about the environment around them. they are social creatures and will
        always feel a pull toward the mid point location of the people around
        them and will adjust accordingly to move there. there is also a pull for
        these pips to go toward the average trajectory of the pips around them.
      </div>
      <div className="spacer" />
      <div>
        they also have a limit to how fast they are able to change their
        direction.
      </div>
      <div className="spacer" />
      <div>
        the virii behavior is extremely simple in that when an infected pip gets
        close enough to another pip, it will infect that new pip.
      </div>
      <div className="spacer" />
      <div>d</div>
      <div className="spacer" />
      <div className="spacer" />
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.buymeacoffee.com/briankirkby"
        >
          support me
        </a>
      </div>
      <div className="spacer" />
    </div>
  );
};

export default About;
