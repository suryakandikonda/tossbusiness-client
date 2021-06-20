import { Avatar, SettingsIcon } from "evergreen-ui";
import React, { Component } from "react";
import {
  IoBookOutline,
  IoSettings,
  IoFolderOpenOutline,
  IoDocumentTextOutline,
  IoNewspaperOutline,
} from "react-icons/io5";
import { Col, Container, Row } from "reactstrap";

class HeaderComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="HeaderMainDiv d-none d-sm-block">
          <Container>
            <Row>
              <Col sm>
                <Row>
                  <Col sm className="nopadding">
                    <div style={{ textAlign: "center", paddingTop: "10px" }}>
                      <IoDocumentTextOutline size={24} />
                      <h6>Notes</h6>
                    </div>
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
      </React.Fragment>
    );
  }
}

export default HeaderComponent;
