import { Badge, Tooltip } from "evergreen-ui";
import React, { Component } from "react";
import { IoAddOutline } from "react-icons/io5";
import { Row, Col } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

class ProjectsComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent selected="projects" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <h2>
                        <b>Projects</b>
                        <span style={{ float: "right" }}>
                          <Tooltip content="Create Project">
                            <IoAddOutline />
                          </Tooltip>
                        </span>
                      </h2>
                      <div className="ProjectsTopDiv">
                        <Row>
                          <Col sm>
                            <div>
                              <h4>
                                <b>5</b>
                              </h4>
                              <p>Ongoing</p>
                            </div>
                          </Col>
                          <Col sm>
                            <div>
                              <h4>
                                <b>6</b>
                              </h4>
                              <p>Completed</p>
                            </div>
                          </Col>
                          <Col sm>
                            <div>
                              <h4>
                                <b>2</b>
                              </h4>
                              <p>Stopped</p>
                            </div>
                          </Col>
                          <Col sm>
                            <div>
                              <h4>
                                <b>1</b>
                              </h4>
                              <p>Paused</p>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="ProjectsItemsMainDiv">
                        <Row>
                          <Col sm="6">
                            <div className="ProjectsItemDiv">
                              <p>June 4th 2021 </p>
                              <div className="ProjectsItemTitle">
                                <h5>
                                  <b>Web Designing</b>
                                </h5>
                                <p>CRM Tool</p>
                              </div>
                              <div>
                                <p>
                                  <b>Progress: </b>73%
                                </p>
                              </div>
                              <hr />
                              <Row>
                                <Col sm>
                                  <div>
                                    <p>
                                      <b>Team: </b> 4
                                    </p>
                                  </div>
                                </Col>
                                <Col sm>
                                  <div>
                                    <p>
                                      <b>Tasks: </b> 6
                                    </p>
                                  </div>
                                </Col>
                                <Col sm>
                                  <div>
                                    <Badge color="green">3 weeks left</Badge>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProjectsComponent;
