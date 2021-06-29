import React, { Component } from "react";

import TossLogo from "../assets/TossLogo.png";

class PreLoginHeader extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="PreLoginHeaderMainDiv d-none d-sm-block">
          <div>
            <img
              src={TossLogo}
              className="img-fluid"
              style={{ width: "120px" }}
            />
          </div>
        </div>


      {/* Mobile Header */}
        <div className="HeaderMobileMainDiv d-block d-sm-none">
          <div>
            <img
              src={TossLogo}
              className="img-fluid"
              style={{ width: "100px" }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PreLoginHeader;
