import React, { Component } from "react";

import ForbiddenIcon from "../assets/403.png";

import HeaderComponent from "./HeaderComponent";
import SidebarComponent from "./SidebarComponent";

import BottomBarMobileComponent from "./BottomBarMobileComponent";

class ForbiddenComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent selected={this.props.selected} />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <React.Fragment>
                        <div style={{ marginTop: "40px", textAlign: "center" }}>
                          <img
                            src={ForbiddenIcon}
                            className="img-fluid"
                            style={{ width: "120px" }}
                          />
                          <h5 style={{ marginTop: "20px" }}>
                            You cannot access this page
                          </h5>
                        </div>
                      </React.Fragment>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-block d-sm-none">
          <BottomBarMobileComponent selected={this.props.selected} />
        </div>
      </React.Fragment>
    );
  }
}

export default ForbiddenComponent;
