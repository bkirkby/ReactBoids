import React from "react";

const About = ({ setShowAbout }) => {
  return (
    <div className="about">
      <button onClick={() => setShowAbout(false)}>close</button>
      <div className="spacer" />
      <div>infection simulator v0.1β</div>
      <div>by brian kirkby</div>
      <div className="spacer" />
      <div>
        this is a test of this here system. lets see how big this can get and
        when it will flow
      </div>
      <div className="spacer" />
      <div>only a test</div>
      <div className="spacer" />
      {/*<button>support this app</button>*/}
      <div>
        <a
          class="bmc-button"
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
