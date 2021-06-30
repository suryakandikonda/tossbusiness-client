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
import { IoAddOutline } from "react-icons/io5";
import { Row, Col, Container } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { SERVER_URL } from "../../constants/variables";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";
import BottomBarMobileComponent from "../BottomBarMobileComponent";

class PeopleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userDetails: "",
      selectedFilter: "All",
      filterOptions: ["All", "Admins", "Finance", "Tech"],
      roleOptions: [
        {
          label: "Tech",
          value: "Tech",
        },
        {
          label: "Finance",
          value: "Finance",
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
  };

  handleFilterChange = (option) => {
    this.setState({
      selectedFilter: option,
    });
  };

  componentDidMount() {
    var userDetails = this.state.cookies.get("userDetails");
    this.setState({
      userDetails: userDetails,
    });
  }
  render() {
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
                      <div style={{ marginTop: "30px" }}>
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
                      </div>
                      <div className="PeopleTableMainDiv">
                        <Table>
                          <Table.Head>
                            <Table.SearchHeaderCell />

                            <Table.TextHeaderCell>Role</Table.TextHeaderCell>
                          </Table.Head>
                          <Table.Body height={240}>
                            <Table.Row isSelectable>
                              <Table.TextCell>Surya</Table.TextCell>
                              <Table.TextCell>Admin</Table.TextCell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
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
