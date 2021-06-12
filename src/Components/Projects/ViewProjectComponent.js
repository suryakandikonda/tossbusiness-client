import {
  Button,
  EditIcon,
  ManualIcon,
  ManuallyEnteredDataIcon,
  Paragraph,
  RemoveColumnLeftIcon,
  RemoveIcon,
  Tooltip,
  TrashIcon,
  SideSheet,
  Dialog,
  Badge,
} from "evergreen-ui";
import React, { Component } from "react";
import { IoArrowBackOutline, IoPencil } from "react-icons/io5";
import { Col, Row } from "reactstrap";

import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

class ViewProjectComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_project_details: false,
      delete_clicked_first: false,
    };
  }
  render() {
    return (
      <React.Fragment>
        <Dialog
          isShown={this.state.delete_clicked_first}
          title="Delete Project"
          intent="danger"
          onCloseComplete={() => this.setState({ delete_clicked_first: false })}
          confirmLabel="Delete"
          onConfirm={() => console.log("Delete Clicked")}
        >
          Are you sure you want to delete project?
        </Dialog>
        <SideSheet
          isShown={this.state.show_project_details}
          onCloseComplete={() => this.setState({ show_project_details: false })}
        >
          <Paragraph margin={40}>Basic Example</Paragraph>
        </SideSheet>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <p
                        style={{ color: "#EC407A", cursor: "pointer" }}
                        onClick={() => (window.location.href = "/projects")}
                      >
                        <IoArrowBackOutline size={30} />
                        <span style={{ marginLeft: "12px" }}>
                          GO BACK TO PROJECTS
                        </span>
                      </p>
                      <Row>
                        <Col sm>
                          <div>
                            <h2
                              style={{ marginTop: "40px" }}
                              className="display-4"
                            >
                              <b>PWA App</b>
                            </h2>
                            <h6 style={{ color: "#9E9E9E" }}>
                              WEB APPLICATION
                            </h6>
                          </div>
                        </Col>
                        <Col sm></Col>
                        <Col sm>
                          <div>
                            <div className="InProgressDiv">
                              <p>In Progress</p>
                            </div>
                            <div style={{ marginTop: "40px" }}>
                              <h4>63% completed</h4>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div>
                        <Button
                          marginY={8}
                          marginRight={12}
                          iconBefore={ManualIcon}
                          onClick={() =>
                            this.setState({ show_project_details: true })
                          }
                        >
                          Details
                        </Button>
                        <Button
                          marginY={8}
                          marginRight={12}
                          iconBefore={EditIcon}
                        >
                          Edit
                        </Button>

                        <Button
                          marginY={8}
                          marginRight={12}
                          iconBefore={TrashIcon}
                          intent="danger"
                          onClick={() =>
                            this.setState({ delete_clicked_first: true })
                          }
                        >
                          Delete...
                        </Button>
                      </div>
                      <div>
                        <Badge color="neutral">Python</Badge>
                        <Badge color="neutral">JavaScript</Badge>
                        <Badge color="neutral">ReactJs</Badge>
                      </div>

                      <div className="ViewProjectTopDiv">
                        <Row>
                          <Col sm className="ViewProjectTopDivItem">
                            <div>
                              <h5>26</h5>
                              <h6>Days till Deadline</h6>
                            </div>
                          </Col>

                          <Col sm className="ViewProjectTopDivItem">
                            <div>
                              <h5>28, June 2021</h5>
                              <h6>Deadline</h6>
                            </div>
                          </Col>

                          <Col sm className="ViewProjectTopDivItem">
                            <div>
                              <h5>20, May 2021</h5>
                              <h6>Day Started</h6>
                            </div>
                          </Col>

                          <Col sm className="ViewProjectTopDivItem">
                            <div>
                              <h5>6</h5>
                              <h6>Tasks</h6>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="ViewProjectsOpenTasksDiv">
                        <div className="ViewProjectsOpenTasksTitle">
                          <h3>Open Tasks</h3>
                        </div>

                        <div className="ViewProjectsOpenTasksItemsMainDiv">
                          <Row>
                            <Col sm="5" className="ViewProjectsOpenTasksItem">
                              <div>
                                <h4 style={{ textAlign: "center" }}>
                                  <b>Login Form</b>
                                </h4>
                                <p style={{ textAlign: "center" }}>
                                  Progress: 50%
                                </p>
                                <hr />
                                <div
                                  style={{
                                    textAlign: "center",
                                    marginBottom: "20px",
                                  }}
                                >
                                  <Row>
                                    <Col sm>
                                      <div>
                                        <p>Start Date: 24 July 2021</p>
                                      </div>
                                    </Col>
                                    <Col sm>
                                      <div>
                                        <p>End Date: 26 July 2021</p>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>

                                <p
                                  style={{
                                    textAlign: "center",
                                    marginTop: "50px",
                                  }}
                                >
                                  Assigned to: Surya
                                </p>
                              </div>
                            </Col>

                            <Col sm="5" className="ViewProjectsOpenTasksItem">
                              <div>
                                <h4 style={{ textAlign: "center" }}>
                                  <b>Login Form</b>
                                </h4>
                                <p style={{ textAlign: "center" }}>
                                  Progress: 50%
                                </p>
                                <hr />
                                <div
                                  style={{
                                    textAlign: "center",
                                    marginBottom: "20px",
                                  }}
                                >
                                  <Row>
                                    <Col sm>
                                      <div>
                                        <p>Start Date: 24 July 2021</p>
                                      </div>
                                    </Col>
                                    <Col sm>
                                      <div>
                                        <p>End Date: 26 July 2021</p>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>

                                <p
                                  style={{
                                    textAlign: "center",
                                    marginTop: "50px",
                                  }}
                                >
                                  Assigned to: Surya
                                </p>
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
        </div>
      </React.Fragment>
    );
  }
}

export default ViewProjectComponent;
