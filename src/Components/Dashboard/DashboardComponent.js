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

class DashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userDetails: "",

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

  render() {
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
                              <h4>20</h4>
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
                              <h4>85</h4>
                            </div>
                          </Col>
                          <Col sm xs="5" className="DashboardTopDivItem">
                            <div>
                              <IoPeopleOutline size={60} />
                              <br />
                              <br />
                              <h6 style={{ color: "#9E9E9E" }}>Clients</h6>
                              <h4>40</h4>
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
                              <h4>₹ 3000</h4>
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
