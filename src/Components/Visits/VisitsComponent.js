import {
  Badge,
  Tooltip,
  Button,
  Table,
  SelectMenu,
  Dialog,
  TextInput,
  RadioGroup,
  Textarea,
  toaster,
} from "evergreen-ui";
import React, { Component } from "react";
import { IoAddOutline } from "react-icons/io5";
import { Row, Col, Input } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { SERVER_URL } from "../../constants/variables";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

class VisitsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      selectedFilter: "All",
      filterOptions: ["All", "Admins", "Finance", "Tech"],
      personTypeOptions: [
        {
          label: "Customer",
          value: "Customer",
        },
        {
          label: "Investor",
          value: "Investor",
        },
        {
          label: "Other",
          value: "Other",
        },
      ],

      //
      create_visits_first_clicked: false,
      create_visits_second_clicked: false,

      //
      name: "",
      contact_person_type: "",
      mobile_number: "",
      address: "",
      remarks: "",
      next_followup_date: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  createVisitAPI = (creds) => {
    this.setState({
      create_visits_second_clicked: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/visit/create", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Visit created successfully");
          this.handleCreateVisitModalClose();
        } else {
          toaster.danger("Something went wrong. Please try again");
        }
      })
      .catch((error) => {
        console.log("error", error);
        toaster.danger("Something went wrong. Please try again");
      });
  };

  handleCreateVisitModalOpen = () => {
    this.setState({
      create_visits_first_clicked: true,
    });
  };

  handleCreateVisitModalClose = () => {
    this.setState({
      create_visits_first_clicked: false,
      create_visits_second_clicked: false,

      name: "",
      contact_person_type: "",
      mobile_number: "",
      address: "",
      remarks: "",
      next_followup_date: "",
    });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "next_followup_date")
      console.log(new Date(value).toISOString());
    this.setState({
      [name]: value,
    });
  }

  handleFilterChange = (option) => {
    this.setState({
      selectedFilter: option,
    });
  };
  render() {
    return (
      <React.Fragment>
        <Dialog
          isShown={this.state.create_visits_first_clicked}
          title="Create New Visit"
          confirmLabel="Create"
          onCloseComplete={this.handleCreateVisitModalClose}
          isConfirmLoading={this.state.create_visits_second_clicked}
          onConfirm={() =>
            this.createVisitAPI({
              created_by: this.state.cookies.get("userDetails")._id,
              name: this.state.name,
              contact_person_type: this.state.contact_person_type,
              mobile_number: this.state.mobile_number,
              address: this.state.address,
              remarks: this.state.remarks,
              next_followup_date: new Date(
                this.state.next_followup_date
              ).toISOString(),
            })
          }
        >
          <div>
            <TextInput
              placeholder="Name"
              name="name"
              onChange={this.handleInputChange}
              value={this.state.name}
              width="100%"
            />
            <br />
            <br />

            <RadioGroup
              label="Contact Person Type"
              value={this.state.contact_person_type}
              options={this.state.personTypeOptions}
              onChange={(event) =>
                this.setState({ contact_person_type: event.target.value })
              }
            />
            <br />
            <TextInput
              placeholder="Mobile Number"
              name="mobile_number"
              onChange={this.handleInputChange}
              value={this.state.mobile_number}
              width="100%"
            />
            <br />
            <br />
            <TextInput
              placeholder="Address"
              name="address"
              onChange={this.handleInputChange}
              value={this.state.address}
              width="100%"
            />
            <br />
            <br />
            <Textarea
              placeholder="Remarks"
              name="remarks"
              onChange={this.handleInputChange}
              value={this.state.remarks}
            />
            <br />
            <br />
            <p>Next Followup date: </p>
            <Input
              type="date"
              name="next_followup_date"
              onChange={this.handleInputChange}
              value={this.state.next_followup_date}
            />
          </div>
        </Dialog>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent selected="visits" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <h2>
                        <b>Visits</b>
                      </h2>
                      <div>
                        <Button
                          appearance="primary"
                          onClick={this.handleCreateVisitModalOpen}
                        >
                          Add New
                        </Button>
                      </div>
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
      </React.Fragment>
    );
  }
}

export default VisitsComponent;
