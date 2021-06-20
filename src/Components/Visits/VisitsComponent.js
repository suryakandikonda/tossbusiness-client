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
  TrashIcon,
  DownloadIcon,
} from "evergreen-ui";
import moment from "moment";
import React, { Component } from "react";
import { IoAddOutline } from "react-icons/io5";
import { Row, Col, Input } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { SERVER_URL } from "../../constants/variables";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import { TossLogoBase64 } from "../../constants/strings";

import TossLogo from "../../assets/TossLogo.png";

class VisitsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userDetails: "",
      selectedFilter: "All",
      filterOptions: ["All", "Customer", "Investor", "Other"],
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
      //

      data: [],
      original_data: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  deleteVisitAPI = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      visitId: id,
    });

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/visit/delete", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Visit entry deleted");
        } else {
          toaster.danger("Something went wrong. Please try again.");
        }
        this.getVisits();
      })
      .catch((error) => console.log("error", error));
  };

  downloadPDF = () => {
    toaster.notify("Downloading PDF...");
    var tableColumns = [
      "#",
      "Name",
      "Type",
      "Mobile Number",
      "Address",
      "Remarks",
      "Next followup date",
    ];

    var tableRows = [];
    var i = 1;
    tableRows.push(tableColumns);
    this.state.data.forEach((item) => {
      var sampArr = [
        i,
        item.name,
        item.contact_person_type,
        item.mobile_number,
        item.address,
        item.remarks,
        moment(item.next_followup_date).format("DD MMM, YYYY"),
      ];
      tableRows.push(sampArr);
      console.log(sampArr);
      i += 1;
    });

    var dd = {
      content: [
        {
          alignment: "justify",
          columns: [
            {
              image: TossLogoBase64,
              width: 100,
              height: 50,
            },
            {
              text: "Date: " + moment().format("DD MMM, YYYY"),
              bold: true,
              alignment: "right",
            },
          ],
        },

        {
          text: "Visits Report",
          alignment: "center",
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          text:
            "Report of: " +
            this.state.userDetails.first_name +
            " " +
            this.state.userDetails.last_name +
            "\n\n\n",
          alignment: "center",
        },
        {
          table: {
            widths: "auto",
            headerRows: 1,
            body: tableRows,
          },
          layout: "lightHorizontalLines",
        },
      ],
    };
    window.pdfMake
      .createPdf(dd)
      .download(
        "VisitsReport " +
          this.state.userDetails.first_name +
          " " +
          this.state.userDetails.last_name +
          Date.now() +
          ".pdf"
      );
  };

  getVisits = () => {
    var myHeaders = new Headers();
    myHeaders.append("created_by", this.state.cookies.get("userDetails")._id);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/visit/get", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.setState({
            data: result.data,
            original_data: result.data,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

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
    this.getVisits();
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

  handleSearchQuery = (value) => {
    var new_data = this.state.original_data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    this.setState({
      data: new_data,
    });
  };

  handleFilterChange = (option) => {
    this.setState({
      selectedFilter: option,
    });
    if (option == "All") {
      this.setState({
        data: this.state.original_data,
      });
    } else {
      var new_data = this.state.original_data.filter(
        (item) => item.contact_person_type == option
      );
      this.setState({
        data: new_data,
      });
    }
  };

  componentDidMount() {
    this.setState({
      userDetails: this.state.cookies.get("userDetails"),
    });
    this.getVisits();
  }
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
                        <Button
                          marginY={8}
                          marginLeft={12}
                          iconBefore={DownloadIcon}
                          onClick={this.downloadPDF}
                        >
                          Download PDF
                        </Button>
                      </div>

                      <div></div>

                      <div className="PeopleTableMainDiv">
                        <Table>
                          <Table.Head>
                            <Table.SearchHeaderCell
                              onChange={(value) =>
                                this.handleSearchQuery(value)
                              }
                              placeholder="Search by name"
                            />

                            <Table.TextHeaderCell>Type</Table.TextHeaderCell>
                            <Table.TextHeaderCell>
                              Mobile Number
                            </Table.TextHeaderCell>
                            <Table.TextHeaderCell>Address</Table.TextHeaderCell>
                            <Table.TextHeaderCell>Remarks</Table.TextHeaderCell>
                            <Table.TextHeaderCell>
                              Next followup date
                            </Table.TextHeaderCell>
                            <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
                          </Table.Head>
                          <Table.Body>
                            {this.state.data.length > 0 &&
                              this.state.data.map((item) => (
                                <Table.Row>
                                  <Table.TextCell>{item.name}</Table.TextCell>
                                  <Table.TextCell>
                                    {item.contact_person_type}
                                  </Table.TextCell>
                                  <Table.TextCell>
                                    {item.mobile_number}
                                  </Table.TextCell>
                                  <Table.TextCell>
                                    {item.address}
                                  </Table.TextCell>
                                  <Table.TextCell>
                                    {item.remarks}
                                  </Table.TextCell>
                                  <Table.TextCell>
                                    {moment(item.next_followup_date).format(
                                      "DD MMM, YYYY"
                                    )}
                                  </Table.TextCell>
                                  <Table.TextCell>
                                    <TrashIcon
                                      onClick={() =>
                                        this.deleteVisitAPI(item._id)
                                      }
                                    />
                                  </Table.TextCell>
                                </Table.Row>
                              ))}
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
