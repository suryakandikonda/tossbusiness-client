import React, { Component } from "react";

import TossLogo from "../assets/TossLogo.png";

class PreLoginHeader extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="PreLoginHeaderMainDiv">
          <div>
            <img src={TossLogo} className="img-fluid" style={{width: "120px"}} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PreLoginHeader;
