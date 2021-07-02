import {
  Badge,
  Tooltip,
  Button,
  SelectMenu,
  Dialog,
  TextInput,
  RadioGroup,
  toaster,
  TrashIcon,
  StopIcon,
} from "evergreen-ui";
import React, { Component } from "react";
import { IoAddOutline, IoStopCircleOutline } from "react-icons/io5";
import { Row, Col, Container, Table } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { SERVER_URL } from "../../constants/variables";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";
import BottomBarMobileComponent from "../BottomBarMobileComponent";

import ForbiddenComponent from "../ForbiddenComponent";

class PeopleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userDetails: "",
      //
      data: [],
      original_data: [],

      //
      selectedFilter: "All",
      filterOptions: ["All", "Admins", "Inventory", "Tech"],
      roleOptions: [
        {
          label: "Tech",
          value: "Tech",
        },
        {
          label: "Admin",
          value: "Admin",
        },
        {
          label: "Inventory",
          value: "Inventory",
        },
      ],

      //
      add_first_clicked: false,
      add_second_clicked: false,

      //
      first_name: "",
      last_name: "",
      role: "Tech",
      email: "",
      mobile_number: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  getEmployees = () => {
    var myHeaders = new Headers();
    myHeaders.append("company", this.state.cookies.get("userDetails").company);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/company/employees", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Company Members", result);
        if (result.success) {
          var membersList = [];
          membersList = result.data.filter(
            (member) => member._id !== this.state.cookies.get("userDetails")._id
          );

          console.log("Memberss:: ", membersList);
          this.setState({
            data: membersList,
            original_data: membersList,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  addMemberAPI = (creds) => {
    this.setState({
      add_second_clicked: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("company", this.state.userDetails.company);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/users/employee/add", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Member added successfully");
          this.handleAddDialogClose();
        }
      })
      .catch((error) => console.log("error", error));
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleAddDialogOpen = () => {
    this.setState({
      add_first_clicked: true,
    });
  };

  handleAddDialogClose = () => {
    this.setState({
      first_name: "",
      last_name: "",
      role: 4,
      email: "",
      mobile_number: "",
      add_first_clicked: false,
      add_second_clicked: false,
    });
    this.getEmployees();
  };

  handleFilterChange = (option) => {
    this.setState({
      selectedFilter: option,
    });
  };

  blockUnblockAPI = (employee) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      employee: employee,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/users/employee/blockunblock", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Action Successful");
          this.getEmployees();
        } else {
          toaster.danger("Something went wrong. Please try again");
        }
      })
      .catch((error) => console.log("error", error));
  };

  componentDidMount() {
    var userDetails = this.state.cookies.get("userDetails");
    this.setState({
      userDetails: userDetails,
    });
    this.getEmployees();
  }
  render() {
    if (this.state.cookies.get("userDetails").role === 2) {
      return (
        <React.Fragment>
          <ForbiddenComponent selected="people" />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Dialog
          isShown={this.state.add_first_clicked}
          title="Add new member into organization"
          confirmLabel="Add"
          isConfirmLoading={this.state.add_second_clicked}
          onCloseComplete={this.handleAddDialogClose}
          onConfirm={() => {
            this.addMemberAPI({
              role:
                this.state.role === "Admin"
                  ? 3
                  : this.state.role === "Tech"
                  ? 4
                  : this.state.role === "Finance"
                  ? 5
                  : this.state.role === "Inventory"
                  ? 6
                  : 4,
              password: Date.now() + "",
              email: this.state.email,
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              company: this.state.userDetails.company,
              mobile_number: this.state.mobile_number,
            });
          }}
        >
          <div>
            <Container fluid>
              <Row>
                <Col sm>
                  <div>
                    <TextInput
                      placeholder="First name"
                      name="first_name"
                      onChange={this.handleInputChange}
                      value={this.state.first_name}
                      width="100%"
                    />
                  </div>
                </Col>
                <Col sm>
                  <div>
                    <TextInput
                      placeholder="Last name"
                      name="last_name"
                      onChange={this.handleInputChange}
                      value={this.state.last_name}
                      width="100%"
                    />
                  </div>
                </Col>
              </Row>
            </Container>
            <br />

            <RadioGroup
              label="Role: "
              value={this.state.role}
              options={this.state.roleOptions}
              onChange={(event) => this.setState({ role: event.target.value })}
            />
            <br />
            <TextInput
              placeholder="Email address"
              name="email"
              onChange={this.handleInputChange}
              value={this.state.email}
              width="100%"
            />
            <br />
            <br />
            <TextInput
              placeholder="Mobile Number"
              name="mobile_number"
              onChange={this.handleInputChange}
              value={this.state.mobile_number}
              width="100%"
            />
          </div>
        </Dialog>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent selected="people" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <h2>
                        <b>People</b>
                      </h2>
                      {this.state.userDetails.role === 3 && (
                        <div>
                          <Button
                            appearance="primary"
                            onClick={this.handleAddDialogOpen}
                          >
                            Add new member
                          </Button>
                        </div>
                      )}
                      {/* <div style={{ marginTop: "30px" }}>
                        <SelectMenu
                          title="Select name"
                          options={this.state.filterOptions.map((label) => ({
                            label,
                            value: label,
                          }))}
                          selected={this.state.selectedFilter}
                          onSelect={(item) =>
                            this.handleFilterChange(item.value)
                          }
                        >
                          <Button>
                            {this.state.selectedFilter || "Filter people..."}
                          </Button>
                        </SelectMenu>
                      </div> */}
                      <div className="PeopleTableMainDiv">
                        <Container>
                          <Table responsive hover>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                                <th>City</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.data.length > 0 &&
                                this.state.data.map((item) => (
                                  <tr>
                                    <th scope="row">
                                      {item.first_name + " " + item.last_name}
                                    </th>
                                    <td>
                                      {item.role === 3
                                        ? "Admin"
                                        : item.role === 4
                                        ? "Tech"
                                        : item.role === 5
                                        ? "Finance"
                                        : item.role === 6
                                        ? "Inventory"
                                        : ""}
                                    </td>
                                    <td>{item.email}</td>
                                    <td>{item.mobile_number}</td>
                                    <td>{item.city}</td>

                                    <td>
                                      {this.state.userDetails.role === 3 && (
                                        <IoStopCircleOutline
                                          size={20}
                                          color={
                                            item.is_blocked ? "green" : "red"
                                          }
                                          onClick={() =>
                                            this.blockUnblockAPI(item._id)
                                          }
                                        />
                                      )}
                                      <span></span>
                                      {/* <span>
                                        <TrashIcon
                                          onClick={() =>
                                            this.deleteVisitAPI(item._id)
                                          }
                                        />
                                      </span> */}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </Container>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-block d-sm-none">
          <BottomBarMobileComponent selected="people" />
        </div>
      </React.Fragment>
    );
  }
}

export default PeopleComponent;
