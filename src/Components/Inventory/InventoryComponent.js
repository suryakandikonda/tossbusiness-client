import {
  Badge,
  Tooltip,
  Button,
  SelectMenu,
  Dialog,
  TextInput,
  RadioGroup,
  Select,
  toaster,
  AddIcon,
  EditIcon,
} from "evergreen-ui";
import React, { Component } from "react";
import {
  IoAddOutline,
  IoBusinessOutline,
  IoCalculatorOutline,
  IoLaptopOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { Row, Col, Container, Table } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { SERVER_URL } from "../../constants/variables";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import { Bar, Doughnut } from "react-chartjs-2";
import BottomBarMobileComponent from "../BottomBarMobileComponent";
import { validateLogin } from "../../constants/functions";
import LoadingComponent from "../LoadingComponent";
import ForbiddenComponent from "../ForbiddenComponent";

class InventoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userDetails: "",
      isLoading: true,

      //
      items: [],
      zeroStockItems: [],

      //
      item_name: "",
      item_brought_quantity: "",
      item_price: "",

      //
      add_item_first_clicked: false,
      add_item_second_clicked: false,

      assign_item_first_clicked: false,
      assign_item_second_clicked: false,

      update_item_first_clicked: false,
      update_item_second_clicked: false,

      itemQuantity: "",

      selectedItem: {},
      selectedProject: {},

      //
      projects: [],
      employees: [],
      clients: [],
      projectsWorth: 0,
      projectProgressData: {},

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
        labels: [""],
        datasets: [
          {
            label: "Progress in %",
            data: [""],
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
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,

                min: 0,
                max: 100,
              },
            },
          ],
        },
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleUpdateDialogOpen = (item) => {
    this.setState({
      selectedItem: item,
      update_item_first_clicked: true,
    });
  };

  handleUpdateDialogClose = () => {
    this.setState({
      update_item_first_clicked: false,
      update_item_second_clicked: false,
      itemQuantity: "",

      selectedItem: {},
      selectedProject: {},
    });
    this.getInventoryDetails();
  };

  handleAssignDialogOpen = (item) => {
    this.setState({
      selectedItem: item,
      assign_item_first_clicked: true,
    });
  };

  handleAssignDialogClose = () => {
    this.setState({
      assign_item_first_clicked: false,
      assign_item_second_clicked: false,
      itemQuantity: "",

      selectedItem: {},
      selectedProject: {},
    });
    this.getInventoryDetails();
  };

  handleAddDialogOpen = () => {
    this.setState({
      add_item_first_clicked: true,
    });
  };

  handleAddDialogClose = () => {
    this.setState({
      item_name: "",
      item_brought_quantity: "",
      item_price: "",

      //
      add_item_first_clicked: false,
      add_item_second_clicked: false,
    });
    this.getInventoryDetails();
  };

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
          var projectProgressData = {};
          var technologiesData = {};
          projects.forEach((item) => {
            if (!clients.includes(item.client._id)) {
              clients.push(item.client._id);
            }
            if (item.budget !== undefined) projectsWorth += Number(item.budget);

            // Progress
            var tasks = item.tasks;
            var progress = 0;
            if (tasks.length > 0) {
              tasks.forEach((task) => {
                progress += task.progress;
              });
              progress = parseInt(progress / tasks.length);
              projectProgressData[item.name] = progress;
            }

            // Technologies
            var technologies = item.technologies;
            technologies.forEach((item) => {
              if (technologiesData[item.technology.name] === undefined) {
                technologiesData[item.technology.name] = 1;
              } else {
                technologiesData[item.technology.name] += 1;
              }
            });
          });

          console.log("Tech Data:: ", technologiesData);

          var projectData = this.state.projectsData;
          projectData.labels = Object.keys(projectProgressData);
          projectData.datasets[0].data = Object.values(projectProgressData);

          var techData = this.state.techData;
          techData.labels = Object.keys(technologiesData);
          techData.datasets[0].data = Object.values(technologiesData);

          this.setState({
            projects: result.data.projects,
            employees: result.data.employees,
            clients: clients,
            projectsWorth: projectsWorth,
            projectProgressData: projectProgressData,
            projectData: projectData,
            techData: techData,
            isLoading: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  getProjects = () => {
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
          this.setState({
            projects: result.data,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  getInventoryDetails = () => {
    var myHeaders = new Headers();
    myHeaders.append("company", this.state.cookies.get("userDetails").company);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,

      redirect: "follow",
    };

    fetch(SERVER_URL + "/inventory/get", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          var data = result.data;
          var zeroStockData = [];
          zeroStockData = data.filter((item) => item.item_stock === 0);
          this.setState({
            items: data,
            zeroStockItems: zeroStockData,
            isLoading: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  addItemAPI = () => {
    this.setState({
      add_item_second_clicked: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      company: this.state.cookies.get("userDetails").company,
      item_name: this.state.item_name,
      item_brought_quantity: Number(this.state.item_brought_quantity),
      item_stock: Number(this.state.item_brought_quantity),
      item_price: Number(this.state.item_price),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/inventory/add", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Item Added Successfully");
          this.handleAddDialogClose();
        } else {
          toaster.danger("Something went wrong. Please try again");
        }
      })
      .catch((error) => console.log("error", error));
  };

  updateItemStockAPI = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      item: this.state.selectedItem._id,
      item_stock: this.state.itemQuantity,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/inventory/update", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Item Updated Successfully");
          this.handleUpdateDialogClose();
        } else {
          toaster.danger("Something went wrong. Please try again");
        }
      })
      .catch((error) => console.log("error", error));
  };

  assignItemAPI = () => {
    this.setState({
      assign_item_second_clicked: true,
    });
    console.log("PROOJECTTT:: ", this.state.selectedItem._id);

    if (
      Number(this.state.itemQuantity) >
      Number(this.state.selectedItem.item_stock)
    ) {
      toaster.danger("Entered quantity is greater than the available stock.");
      this.setState({
        assign_item_second_clicked: false,
      });
    } else {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        item: this.state.selectedItem._id,
        project: this.state.selectedProject,
        quantity: Number(this.state.itemQuantity),
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(SERVER_URL + "/inventory/assign", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
            toaster.success("Item assigned to project successfully");
            this.handleAssignDialogClose();
          } else {
            toaster.danger("Something went wrong. Please try again.");
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userDetails: this.state.cookies.get("userDetails"),
        });
        if (
          this.state.cookies.get("userDetails").role === 3 ||
          this.state.cookies.get("userDetails").role === 5
        ) {
          this.getInventoryDetails();
          this.getProjects();
        }
      })
      .catch((err) => {
        window.location.href = "/login";
      });
  }

  render() {
    if (
      this.state.cookies.get("userDetails").role === 2 ||
      this.state.cookies.get("userDetails").role === 4
    ) {
      return (
        <React.Fragment>
          <ForbiddenComponent selected="inventory" />
        </React.Fragment>
      );
    }
    if (this.state.isLoading) {
      return (
        <React.Fragment>
          <LoadingComponent />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {/* Update Item */}
        <Dialog
          isShown={this.state.update_item_first_clicked}
          title="Update Item"
          confirmLabel="Update"
          onConfirm={this.updateItemStockAPI}
          isConfirmLoading={this.state.update_item_second_clicked}
          onCloseComplete={this.handleUpdateDialogClose}
        >
          <div>
            <p>Item: {this.state.selectedItem.item_name}</p>
            <p>Stock available: {this.state.selectedItem.item_stock} </p>
            <br />

            <TextInput
              placeholder="Enter Quantity"
              name="itemQuantity"
              onChange={this.handleInputChange}
              value={this.state.itemQuantity}
              width="100%"
            />
          </div>
        </Dialog>

        {/* Assign Item */}
        <Dialog
          isShown={this.state.assign_item_first_clicked}
          title="Assign Item to Project"
          confirmLabel="Assign"
          onConfirm={this.assignItemAPI}
          isConfirmLoading={this.state.assign_item_second_clicked}
          onCloseComplete={this.handleAssignDialogClose}
        >
          <div>
            <p>Item: {this.state.selectedItem.item_name}</p>
            <p>Stock available: {this.state.selectedItem.item_stock} </p>
            <br />
            <Select
              value={this.state.selectedProject.name}
              onChange={(event) => {
                console.log("Selected Project:: ", event.target.value);
                this.setState({ selectedProject: event.target.value });
              }}
            >
              <option value="">
                Select Project
              </option>
              {this.state.projects.map((item) => (
                <option value={item._id}>{item.name}</option>
              ))}
            </Select>
            <br />
            <br />
            <TextInput
              placeholder="Quantity to assign"
              name="itemQuantity"
              onChange={this.handleInputChange}
              value={this.state.itemQuantity}
              width="100%"
            />
          </div>
        </Dialog>

        {/* Add Item Dialog */}
        <Dialog
          isShown={this.state.add_item_first_clicked}
          title="Add New Item"
          confirmLabel="Add"
          onConfirm={this.addItemAPI}
          isConfirmLoading={this.state.add_item_second_clicked}
          onCloseComplete={this.handleAddDialogClose}
        >
          <div>
            <TextInput
              placeholder="Item Name"
              name="item_name"
              onChange={this.handleInputChange}
              value={this.state.item_name}
              width="100%"
            />
            <br />
            <br />

            <TextInput
              placeholder="Quantity"
              name="item_brought_quantity"
              onChange={this.handleInputChange}
              value={this.state.item_brought_quantity}
              width="100%"
            />
            <br />
            <br />
            <TextInput
              placeholder="Price per item"
              name="item_price"
              onChange={this.handleInputChange}
              value={this.state.item_price}
              width="100%"
            />
            <br />
            <br />
          </div>
        </Dialog>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent selected="inventory" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="PageMainDiv">
                    <div className="PageMainDivContent">
                      <h2>
                        <b>Inventory</b>
                      </h2>
                      <Button onClick={this.handleAddDialogOpen}>
                        Add Item
                      </Button>

                      <div className="DashboardTopDiv">
                        <Row>
                          <Col sm xs="5" className="DashboardTopDivItem">
                            <div>
                              <h6 className="display-6">Total Items</h6>
                              <br />
                              <h3>{this.state.items.length}</h3>
                            </div>
                          </Col>
                          <Col sm xs="5" className="DashboardTopDivItem">
                            <div>
                              <h6 className="display-6">
                                Items with zero stock
                              </h6>
                              <br />
                              <h3>{this.state.zeroStockItems.length}</h3>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="DashboardSecondDiv">
                        <h4>Items in Inventory</h4>
                        <hr />
                        <br />
                        <Table responsive hover>
                          <thead>
                            <tr>
                              <th>Item Name</th>
                              <th>Initially Brought</th>
                              <th>Price per item</th>
                              <th>Current stock</th>
                              <th>No.of projects using</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.items.length > 0 &&
                              this.state.items.reverse().map((item) => (
                                <tr>
                                  <th scope="row">{item.item_name}</th>
                                  <td>{item.item_brought_quantity}</td>
                                  <td>{"₹ " + item.item_price}</td>
                                  <td>{item.item_stock}</td>
                                  <td>{item.used_in_projects.length}</td>

                                  <td>
                                    <span>
                                      <AddIcon
                                        size={20}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          this.handleAssignDialogOpen(item)
                                        }
                                      />
                                    </span>
                                    <span style={{ marginLeft: "4px" }}>
                                      <EditIcon
                                        size={20}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          this.handleUpdateDialogOpen(item)
                                        }
                                      />
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
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
          <BottomBarMobileComponent selected="dashboard" />
        </div>
      </React.Fragment>
    );
  }
}

export default InventoryComponent;
