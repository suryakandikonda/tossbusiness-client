import {
  Badge,
  Tooltip,
  Button,
  Table,
  SelectMenu,
  Dialog,
  TextInput,
  RadioGroup,
  toaster,
} from "evergreen-ui";
import React, { Component } from "react";
import {
  IoAddOutline,
  IoBusinessOutline,
  IoCalculatorOutline,
  IoLaptopOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { Row, Col, Container } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { SERVER_URL } from "../../constants/variables";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import { Bar, Doughnut } from "react-chartjs-2";
import BottomBarMobileComponent from "../BottomBarMobileComponent";
import { validateLogin } from "../../constants/functions";
import LoadingComponent from "../LoadingComponent";

class DashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userDetails: "",
      isLoading: true,

      //
      projects: [],
      employees: [],
      clients: [],
      projectsWorth: 0,

      //Tech Stat
      techData: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },

      //
      projectsData: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  getDashboardDetails = () => {
    var myHeaders = new Headers();
    myHeaders.append("company", this.state.cookies.get("userDetails").company);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/company/dashboard", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          var projects = result.data.projects;
          var clients = [];
          var projectsWorth = 0;
          projects.forEach((item) => {
            if (!clients.includes(item.client._id)) {
              clients.push(item.client._id);
            }
            if (item.budget !== undefined) projectsWorth += Number(item.budget);
          });
          this.setState({
            projects: result.data.projects,
            employees: result.data.employees,
            clients: clients,
            projectsWorth: projectsWorth,
            isLoading: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userDetails: this.state.cookies.get("userDetails"),
        });
        if (this.state.cookies.get("userDetails").role >= 3)
          this.getDashboardDetails();
      })
      .catch((err) => {
        window.location.href = "/login";
      });
  }

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
              <SidebarComponent selected="home" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <h2>
                        <b>Dashboard</b>
                      </h2>
                      <p style={{ color: "#9E9E9E" }}>
                        Complete glance of your account in Single page
                      </p>

                      <div className="DashboardTopDiv">
                        <Row>
                          <Col sm xs="5" className="DashboardTopDivItem">
                            <div>
                              <IoLaptopOutline size={60} />
                              <br />
                              <br />
                              <h6 style={{ color: "#9E9E9E" }}>Projects</h6>
                              <h4>{this.state.projects.length}</h4>
                            </div>
                          </Col>
                          <Col sm xs="5" className="DashboardTopDivItem">
                            <div>
                              <IoBusinessOutline size={60} />
                              <br />
                              <br />
                              <h6 style={{ color: "#9E9E9E" }}>
                                People in organization
                              </h6>
                              <h4>{this.state.employees.length}</h4>
                            </div>
                          </Col>
                          <Col sm xs="5" className="DashboardTopDivItem">
                            <div>
                              <IoPeopleOutline size={60} />
                              <br />
                              <br />
                              <h6 style={{ color: "#9E9E9E" }}>Clients</h6>
                              <h4>{this.state.clients.length}</h4>
                            </div>
                          </Col>
                          <Col sm xs="5" className="DashboardTopDivItem">
                            <div>
                              <IoCalculatorOutline size={60} />
                              <br />
                              <br />
                              <h6 style={{ color: "#9E9E9E" }}>
                                Projects worth
                              </h6>
                              <h4>₹ {this.state.projectsWorth}</h4>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="DashboardSecondDiv">
                        <div>
                          <Row>
                            <Col sm>
                              <div>
                                <h5>Projects</h5>
                                <Bar
                                  data={this.state.projectsData}
                                  options={this.state.options}
                                />
                              </div>
                            </Col>
                            <Col sm>
                              <div>
                                <h5>Technologies</h5>
                                <Doughnut data={this.state.techData} />
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
        <div className="d-block d-sm-none">
          <BottomBarMobileComponent selected="dashboard" />
        </div>
      </React.Fragment>
    );
  }
}

export default DashboardComponent;
