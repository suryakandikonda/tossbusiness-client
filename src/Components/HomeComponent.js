import React, { Component } from "react";

import PreLoginHeader from "./PreLoginHeader";

import HomeBack from "../assets/homeback.jpg";

import TossLogo from "../assets/TossLogo.png";
import { Container, Row, Col, Input } from "reactstrap";
import {
  TextInput,
  Select,
  AddIcon,
  Dialog,
  Textarea,
  toaster,
} from "evergreen-ui";
import { projectCategories } from "../constants/projectCategories";
import { SERVER_URL } from "../constants/variables";
import LoadingComponent from "./LoadingComponent";
import Cookies from "universal-cookie";
import { validateLogin } from "../constants/functions";

class HomeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      companies: [],
      cookies: new Cookies(),
      userDetails: "",
      //
      ratingOptions: ["5", "4", "3", "2", "1"],

      name: "",
      location: "",
      category: "All",
      rating: "All",

      //
      assign_project_first_clicked: false,
      assign_project_second_clicked: false,
      selectedCompany: "",
      projectName: "",
      projectSummary: "",
      projectCategory: "",
      projectBudget: "",
      projectStartDate: "",
      projectEndDate: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  assignProjectAPI = () => {
    this.setState({
      assign_project_second_clicked: true,
    });

    var myHeaders = new Headers();
    myHeaders.append("company", this.state.selectedCompany);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: this.state.projectName,
      summary: this.state.projectSummary,
      category: this.state.projectCategory,
      start_date: this.state.projectStartDate,
      end_date: this.state.projectEndDate,
      budget: this.state.projectBudget,
      status: "ongoing",
      company: this.state.selectedCompany,
      client: new Cookies().get("userDetails")._id,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/project/assignProject", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Project Assigned Successfully");
          this.handleAssignProjectClose();
        } else {
          toaster.danger("Something went wrong. Please try again.");
          this.setState({
            assign_project_second_clicked: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  handleAssignProjectOpen = (company) => {
    this.setState({
      selectedCompany: company,
      assign_project_first_clicked: true,
    });
  };

  handleAssignProjectClose = () => {
    this.setState({
      assign_project_first_clicked: false,
      assign_project_second_clicked: false,
      selectedCompany: "",
      projectName: "",
      projectSummary: "",
      projectCategory: "",
      projectBudget: "",
      projectStartDate: "",
      projectEndDate: "",
    });
    this.getCompanies();
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "start_date") console.log(value);
    this.setState({
      [name]: value,
    });
  }

  getCompanies = () => {
    this.setState({
      isLoading: true,
    });
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(SERVER_URL + "/company/all", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.setState({
            isLoading: false,
            companies: result.data,
          });
        }
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => console.log("error", error));
  };

  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userDetails: this.state.cookies.get("userDetails"),
        });
        this.getCompanies();
      })
      .catch((err) => {
        toaster.notify("Please login to continue");
        window.location.href = "/login";
      });
  }
  render() {
    return (
      <React.Fragment>
        {/* Assign Project Dialog */}

        <Dialog
          isShown={this.state.assign_project_first_clicked}
          title="Assign Project to Company"
          onCloseComplete={this.handleAssignProjectClose}
          confirmLabel="Assign"
          isConfirmLoading={this.state.assign_project_second_clicked}
          onConfirm={() => this.assignProjectAPI()}
        >
          <div>
            <TextInput
              placeholder="Project Name"
              name="projectName"
              onChange={this.handleInputChange}
              value={this.state.projectName}
              width="100%"
            />
            <br />
            <br />
            <Select
              value={this.state.projectCategory}
              onChange={(event) => {
                this.setState({ projectCategory: event.target.value });
              }}
            >
              {projectCategories.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </Select>
            <br />
            <br />
            <Textarea
              placeholder="Project Summary"
              name="projectSummary"
              onChange={this.handleInputChange}
              value={this.state.projectSummary}
            />
            <br />
            <br />
            <Row>
              <Col sm>
                <div>
                  <p>Start date:</p>
                  <Input
                    type="date"
                    name="projectStartDate"
                    onChange={this.handleInputChange}
                    value={this.state.projectStartDate}
                  />
                </div>
              </Col>

              <Col sm>
                <div>
                  <p>End date:</p>
                  <Input
                    type="date"
                    name="projectEndDate"
                    onChange={this.handleInputChange}
                    value={this.state.projectEndDate}
                  />
                </div>
              </Col>
            </Row>
            <br />
            <br />
            <TextInput
              placeholder="Project Budget"
              name="projectBudget"
              onChange={this.handleInputChange}
              value={this.state.projectBudget}
              width="100%"
            />
          </div>
        </Dialog>

        <div>
          <PreLoginHeader />
        </div>

        <div className="HomeMainDiv">
          <div className="HomeBackImage"></div>
          <Container>
            <div className="HomeDiv">
              <div style={{ textAlign: "center" }}>
                <img src={TossLogo} style={{ width: "200px" }} />
                <h6>Find the best company for your project.</h6>
              </div>

              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <p>Filters: </p>
                <Row>
                  <Col sm style={{ marginTop: "20px" }}>
                    <div>
                      <TextInput placeholder="Company Name" />
                    </div>
                  </Col>

                  <Col sm style={{ marginTop: "20px" }}>
                    <div>
                      <TextInput placeholder="Location" />
                    </div>
                  </Col>
                  <Col sm style={{ marginTop: "20px" }}>
                    <div>
                      <Select
                        defaultValue={this.state.category}
                        width="95%"
                        value={this.state.category}
                        onChange={(event) => {
                          this.setState({ category: event.target.value });
                        }}
                      >
                        <option value="All">All</option>
                        {projectCategories.map((item) => (
                          <option value={item}>{item}</option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Col sm style={{ marginTop: "20px" }}>
                    <div>
                      <Select
                        placeholder="Rating"
                        width="95%"
                        value={this.state.rating}
                        onChange={(event) => {
                          this.setState({ rating: event.target.value });
                        }}
                      >
                        <option value="All">All</option>
                        {this.state.ratingOptions.map((item) => (
                          <option value={item}>{item}</option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="HomeListingMainDiv">
                <p>Result: </p>
                {this.state.isLoading ? (
                  <div>
                    <LoadingComponent />
                  </div>
                ) : (
                  this.state.companies.reverse().map((company) => (
                    <div className="HomeListingItemDiv">
                      <h5>
                        <b>{company.name}</b>
                        <span style={{ float: "right" }}>
                          <AddIcon
                            size={20}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              this.handleAssignProjectOpen(company._id)
                            }
                          />
                        </span>
                      </h5>
                      <p>Rating: {company.rating} </p>
                      <p>Projects: {company.projects.length}</p>
                      <hr />
                      <p>{company.city}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default HomeComponent;
