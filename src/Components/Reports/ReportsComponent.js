import { Badge, Tooltip, Button, SelectMenu } from "evergreen-ui";
import moment from "moment";
import React, { Component } from "react";
import { IoAddOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { generateRandomColor } from "../../constants/functions";
import { SERVER_URL } from "../../constants/variables";
import BottomBarMobileComponent from "../BottomBarMobileComponent";
import HeaderComponent from "../HeaderComponent";
import LoadingComponent from "../LoadingComponent";
import SidebarComponent from "../SidebarComponent";

class ReportsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.match.params.id,
      cookies: new Cookies(),
      isLoading: true,

      details: {},

      relatedProjects: [],
      avgBudget: 0,
      prevDaysValue: 0,
      ratingValue: 0,
    };
  }

  componentDidMount() {
    var userDetails = this.state.cookies.get("userDetails");

    if (userDetails.role === 3) {
      this.getProjectDetails();
    } else {
      window.location.href = "/projects";
    }
  }

  getProjectDetails = () => {
    var myHeaders = new Headers();
    myHeaders.append("project", this.state.project);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/project/getProjectByID", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Result", result);
        if (result.success) {
          this.setState({
            details: result.data,
          });
          this.getProjectByCompnayID(result.data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  getProjectByCompnayID = (details) => {
    var myHeaders = new Headers();
    myHeaders.append("company", this.state.cookies.get("userDetails").company);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/project/getProjectsByCompanyID", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          var data = result.data;

          var relatedProjects = data.filter(
            (item) =>
              item.category === details.category &&
              item._id !== this.state.project
          );

          var avgBudget = 0;

          var prevDays = [];
          relatedProjects.forEach((item) => {
            var diff = moment(item.end_date).diff(
              moment(item.start_date),
              "days"
            );
            prevDays.push(diff);
          });

          var ratingArray = [];

          relatedProjects.forEach((item) => {
            var rating = 0;
            item.technologies.forEach((tech) => {
              if (tech.rating !== null || tech.rating !== undefined) {
                rating += tech.rating;
              }
            });
            ratingArray.push(rating);
          });

          relatedProjects.forEach((item) => {
            avgBudget += item.budget;
          });

          var prevDaysValue = 0;
          var ratingValue = 0;

          if (relatedProjects.length > 0) {
            avgBudget = avgBudget / relatedProjects.length;
            prevDays.forEach((item) => (prevDaysValue += item));
            ratingArray.forEach((item) => (ratingValue += item));
            prevDaysValue = prevDaysValue / relatedProjects.length;
            ratingValue = ratingValue / relatedProjects.length;
          } else {
            avgBudget = 0;
            prevDaysValue = 0;
          }

          console.log("Related Projects:: ", avgBudget);

          this.setState({
            relatedProjects: relatedProjects,
            avgBudget: avgBudget,
            isLoading: false,
            prevDaysValue: prevDaysValue,
            ratingValue: ratingValue,
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
                        <b>Report</b>
                      </h2>
                      <hr />

                      <div className="ReportContentDiv">
                        <h1>{this.state.details.name}</h1>
                        <p>{this.state.details.category}</p>
                        <br />

                        <p>{this.state.details.summary}</p>

                        <div className="ReportsBudgetMainDiv">
                          <Container fluid>
                            <Row>
                              <Col sm className="ReportsBudgetItem">
                                <div>
                                  <h2 className="display-6">
                                    Given budget: <br />₹{" "}
                                    {this.state.details.budget}
                                  </h2>
                                </div>
                              </Col>

                              <Col sm className="ReportsBudgetItem">
                                <div>
                                  <h2 className="display-6">
                                    Avg. budget: <br />
                                    <span style={{ fontSize: "14px" }}>
                                      (based on previous related projects)
                                    </span>
                                    <br />₹ {this.state.avgBudget}
                                  </h2>
                                </div>
                              </Col>
                            </Row>
                          </Container>
                        </div>

                        <div className="ReportsBudgetMainDiv">
                          <Container fluid>
                            <Row>
                              <Col sm className="ReportsBudgetItem">
                                <div>
                                  <h2 className="display-6">
                                    Days to Complete Project: <br />
                                    {moment(this.state.details.end_date).diff(
                                      moment(this.state.details.start_date),
                                      "days"
                                    )}
                                  </h2>
                                </div>
                              </Col>

                              <Col sm className="ReportsBudgetItem">
                                <div>
                                  <h2 className="display-6">
                                    Avg. Days: <br />
                                    <span style={{ fontSize: "14px" }}>
                                      (based on previous related projects)
                                    </span>
                                    <br />
                                    {this.state.prevDaysValue}
                                  </h2>
                                </div>
                              </Col>
                            </Row>
                          </Container>
                        </div>

                        <div className="ReportsBudgetMainDiv">
                          <Container fluid>
                            <Row>
                              <Col sm className="ReportsBudgetItem">
                                <div>
                                  <h2 className="display-6">
                                    Avg. rating: <br />
                                    {this.state.ratingValue}
                                  </h2>
                                </div>
                              </Col>

                              <Col sm></Col>
                            </Row>
                          </Container>
                        </div>

                        <div className="ProjectsItemsMainDiv">
                          <p>Related projects: </p>
                          <Row>
                            {this.state.relatedProjects.length > 0 &&
                              this.state.relatedProjects.map((item) => (
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
                                      <div>
                                        <p>
                                          <b>Budget: </b>
                                          {"₹ " + item.budget}
                                        </p>
                                      </div>
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
        </div>
        <div className="d-block d-sm-none">
          <BottomBarMobileComponent selected="projects" />
        </div>
      </React.Fragment>
    );
  }
}

export default ReportsComponent;
