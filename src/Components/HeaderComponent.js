import { Avatar, SettingsIcon } from "evergreen-ui";
import React, { Component } from "react";
import { IoSettings } from "react-icons/io5";
import { Col, Container, Row } from "reactstrap";

class HeaderComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="HeaderMainDiv d-none d-sm-block">
          <Container>
            <Row>
              <Col sm>
                <div></div>
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
      </React.Fragment>
    );
  }
}

export default HeaderComponent;
