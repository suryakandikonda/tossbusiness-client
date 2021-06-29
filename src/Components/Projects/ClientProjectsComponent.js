import { Badge, Tooltip, Button, SelectMenu } from "evergreen-ui";
import moment from "moment";
import React, { Component } from "react";
import { IoAddOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { generateRandomColor } from "../../constants/functions";
import { SERVER_URL } from "../../constants/variables";
import BottomBarMobileComponent from "../BottomBarMobileComponent";
import HeaderComponent from "../HeaderComponent";
import LoadingComponent from "../LoadingComponent";
import SidebarComponent from "../SidebarComponent";

class ClientProjectsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      isLoading: true,

      data: [],
      onGoingProjects: [],
      completedProjects: [],
      stoppedProjects: [],
      displayData: [],

      //
      selectedFilter: "Ongoing",
      filterOptions: ["ongoing", "completed", "stopped"],
    };
  }

  handleFilterChange = (option) => {
    var displayData = [];

    var op = option.toLowerCase();
    if (op == "ongoing") {
      displayData = this.state.onGoingProjects;
    }
    if (op == "stopped") {
      displayData = this.state.stoppedProjects;
    }
    if (op == "completed") {
      displayData = this.state.completedProjects;
    }
    this.setState({
      selectedFilter: option,
      displayData: displayData,
    });
  };

  componentDidMount() {
    var userDetails = this.state.cookies.get("userDetails");

    this.getProjectByClientID();
  }

  getProjectByClientID = () => {
    var myHeaders = new Headers();
    myHeaders.append("client", this.state.cookies.get("userDetails")._id);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/project/getProjectsByClientID", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          var data = result.data;
          var onGoingProjects = [];
          var stoppedProjects = [];
          var completedProjects = [];

          onGoingProjects = data.filter((item) => item.status === "ongoing");

          stoppedProjects = data.filter((item) => item.status === "stopped");

          completedProjects = data.filter(
            (item) => item.status === "completed"
          );
          this.setState({
            data: result.data,
            onGoingProjects: onGoingProjects,
            stoppedProjects: stoppedProjects,
            completedProjects: completedProjects,
            displayData: onGoingProjects,
            isLoading: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };
  render() {
    if (this.state.isLoading) {
      return (
        <React.Fragment>
          <LoadingComponent />
        </React.Fragment>
      );
    }
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
                        <b>Projects assigned by you</b>
                        <span style={{ float: "right" }}>
                          <Tooltip content="Create Project">
                            <IoAddOutline />
                          </Tooltip>
                        </span>
                      </h2>
                      <div className="ProjectsTopDiv">
                        <Row>
                          <Col sm xs="6">
                            <div>
                              <h4>
                                <b>{this.state.onGoingProjects.length}</b>
                              </h4>
                              <p>Ongoing</p>
                            </div>
                          </Col>
                          <Col sm xs="6">
                            <div>
                              <h4>
                                <b>{this.state.completedProjects.length}</b>
                              </h4>
                              <p>Completed</p>
                            </div>
                          </Col>
                          <Col sm xs>
                            <div>
                              <h4>
                                <b>{this.state.stoppedProjects.length}</b>
                              </h4>
                              <p>Stopped</p>
                            </div>
                          </Col>
                          <Col sm xs>
                            <div>
                              <h4>
                                <b>{this.state.data.length}</b>
                              </h4>
                              <p>Total</p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <hr />

                      <div style={{ marginTop: "30px" }}>
                        <p>Filter Projects by Status: </p>
                        <br />
                        <SelectMenu
                          title="Filter Projects by Status"
                          options={this.state.filterOptions.map((label) => ({
                            label,
                            value:
                              label.charAt(0).toUpperCase() + label.slice(1),
                          }))}
                          selected={this.state.selectedFilter}
                          onSelect={(item) =>
                            this.handleFilterChange(item.value)
                          }
                        >
                          <Button>
                            {this.state.selectedFilter || "Filter... "}
                          </Button>
                        </SelectMenu>
                      </div>

                      <div className="ProjectsItemsMainDiv">
                        <Row>
                          {this.state.data.length > 0 &&
                            this.state.displayData.map((item) => (
                              <Col sm="6">
                                <Link
                                  to={`/project/${item._id}`}
                                  id="NoHoverLink"
                                >
                                  <div
                                    className="ProjectsItemDiv"
                                    style={{
                                      backgroundColor: generateRandomColor(),
                                    }}
                                  >
                                    <p>
                                      Start Date:{" "}
                                      {moment(item.start_date).format(
                                        "MMM DD, YYYY"
                                      )}{" "}
                                    </p>
                                    <div className="ProjectsItemTitle">
                                      <h5>
                                        <b>{item.name}</b>
                                      </h5>
                                      <p
                                        style={{
                                          color: "#9E9E9E",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {item.category.toUpperCase()}
                                      </p>
                                    </div>
                                    {/* <div>
                                      <p>
                                        <b>Progress: </b>
                                        {item.progress + " %"}
                                      </p>
                                    </div> */}
                                    <hr />
                                    <Row>
                                      <Col sm>
                                        <div>
                                          <p>
                                            <b>Client: </b>{" "}
                                            {item.client.first_name}
                                          </p>
                                        </div>
                                      </Col>
                                      <Col sm>
                                        <div>
                                          <p>
                                            <b>Tasks: </b> {item.tasks.length}
                                          </p>
                                        </div>
                                      </Col>
                                      <Col sm>
                                        <div>
                                          <Badge color="green">
                                            {moment().to(item.end_date)}
                                          </Badge>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                </Link>
                              </Col>
                            ))}
                        </Row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-block d-sm-none">
          <BottomBarMobileComponent selected="projects" />
        </div>
      </React.Fragment>
    );
  }
}

export default ClientProjectsComponent;
