import { Avatar, LogOutIcon, Dialog, PersonIcon } from "evergreen-ui";
import React, { Component } from "react";
import {
  IoBookOutline,
  IoSettings,
  IoFolderOpenOutline,
  IoDocumentTextOutline,
  IoNewspaperOutline,
  IoHomeOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import Cookies from "universal-cookie/es6";

import TossLogo from "../assets/TossLogo.png";
import { logOutUser } from "../constants/functions";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cookies: new Cookies(),
      selected: this.props.selected,
      profile_icon_clicked: false,
    };
  }
  render() {
    return (
      <React.Fragment>
        <Dialog
          isShown={this.state.profile_icon_clicked}
          hasFooter={false}
          onCloseComplete={() => this.setState({ profile_icon_clicked: false })}
        >
          <div>
            <Link to="/home" id="NoHoverLink">
              <div className="HeaderProfileIconItem">
                <h4>
                  <span>
                    <IoHomeOutline size={28} />
                  </span>
                  <span style={{ marginLeft: "20px" }}>Home</span>
                </h4>
              </div>
            </Link>

            <Link to="/account" id="NoHoverLink">
              <div className="HeaderProfileIconItem">
                <h4>
                  <span>
                    <IoSettingsOutline size={28} />
                  </span>
                  <span style={{ marginLeft: "20px" }}>Account</span>
                </h4>
              </div>
            </Link>

            <div className="HeaderProfileIconItem" onClick={() => logOutUser()}>
              <h4>
                <span>
                  <LogOutIcon size={28} />
                </span>
                <span
                  style={{ marginLeft: "20px" }}
                  onClick={() => logOutUser()}
                >
                  Logout
                </span>
              </h4>
            </div>
          </div>
        </Dialog>
        <div className="HeaderMainDiv d-none d-sm-block">
          <Container>
            <Row>
              <Col sm>
                <Row>
                  <Col sm className="nopadding">
                    <Link to="/notes" id="NoHoverLink">
                      <div style={{ textAlign: "center", paddingTop: "10px" }}>
                        <IoDocumentTextOutline size={24} />
                        <h6>Notes</h6>
                      </div>
                    </Link>
                  </Col>
                  <Col sm className="nopadding">
                    <Link to="/posts" id="NoHoverLink">
                      <div style={{ textAlign: "center", paddingTop: "10px" }}>
                        <IoNewspaperOutline size={24} />
                        <h6>Posts</h6>
                      </div>
                    </Link>
                  </Col>
                </Row>
              </Col>
              <Col sm>
                <div className="HeaderItemDiv" style={{ textAlign: "center" }}>
                  {/* <h4>Sun Technologies</h4> */}
                </div>
              </Col>
              <Col sm>
                <div style={{ paddingTop: "14px", textAlign: "right" }}>
                  {/* <span style={{ marginRight: "20px" }}>
                    <IoSettings />
                  </span> */}

                  <span>
                    <Avatar
                      name={
                        this.state.cookies.get("userDetails").first_name +
                        this.state.cookies.get("userDetails").last_name
                      }
                      size={40}
                      onClick={() =>
                        this.setState({ profile_icon_clicked: true })
                      }
                    />
                  </span>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Mobile Header */}
        <div className="HeaderMobileMainDiv d-block d-sm-none">
          <div>
            <img
              src={TossLogo}
              className="img-fluid"
              style={{ width: "100px" }}
            />
            <span
              style={{ float: "right", marginTop: "8px", marginRight: "4px" }}
            >
              <Avatar
                name={
                  this.state.cookies.get("userDetails").first_name +
                  this.state.cookies.get("userDetails").last_name
                }
                size={40}
                onClick={() => this.setState({ profile_icon_clicked: true })}
              />
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default HeaderComponent;
