import { Avatar, SettingsIcon } from "evergreen-ui";
import React, { Component } from "react";
import {
  IoBookOutline,
  IoSettings,
  IoFolderOpenOutline,
  IoDocumentTextOutline,
  IoNewspaperOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import TossLogo from "../assets/TossLogo.png";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected,
    };
  }
  render() {
    return (
      <React.Fragment>
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
                    <div style={{ textAlign: "center", paddingTop: "10px" }}>
                      <IoNewspaperOutline size={24} />
                      <h6>Posts</h6>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col sm>
                <div className="HeaderItemDiv" style={{ textAlign: "center" }}>
                  <h4>Sun Technologies</h4>
                </div>
              </Col>
              <Col sm>
                <div style={{ paddingTop: "14px", textAlign: "right" }}>
                  {/* <span style={{ marginRight: "20px" }}>
                    <IoSettings />
                  </span> */}
                  <span>
                    <Avatar name="Surya Kandikonda" size={40} />
                  </span>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="HeaderMobileMainDiv d-block d-sm-none">
          <div>
            <img
              src={TossLogo}
              className="img-fluid"
              style={{ width: "100px" }}
            />
            <span style={{ float: "right", marginTop: "8px" }}>
              <Avatar name="Surya Kandikonda" size={40} />
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default HeaderComponent;
