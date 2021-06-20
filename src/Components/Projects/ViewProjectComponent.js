import {
  Button,
  EditIcon,
  ManualIcon,
  ManuallyEnteredDataIcon,
  Paragraph,
  RemoveColumnLeftIcon,
  RemoveIcon,
  Tooltip,
  TrashIcon,
  SideSheet,
  Dialog,
  Badge,
  AddIcon,
  TextInput,
  Textarea,
  SelectMenu,
  toaster,
  PeopleIcon,
  StopIcon,
  RadioGroup,
  Select,
} from "evergreen-ui";
import moment from "moment";
import React, { Component } from "react";
import { IoArrowBackOutline, IoPencil } from "react-icons/io5";
import { Col, Row, Input } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { SERVER_URL } from "../../constants/variables";

import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

class ViewProjectComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),

      //
      project: this.props.match.params.id,
      companyMembers: [],
      companyMembersNames: [],
      details: {},
      tasks: [],
      technologies: [],
      projectProgress: 0,
      isLoading: true,
      show_project_details: false,
      change_status_first_clicked: false,
      change_status_second_clicked: false,

      //
      create_task_clicked_first: false,
      //
      task_name: "",
      task_summary: "",
      start_date: "",
      end_date: "",
      status: "",
      assigned_to: [],

      taskSelected: "",
      taskProgress: "",
      task_progress_update_first_clicked: false,
      task_progress_update_second_clicked: false,

      //
      assignedToSelectedItems: [],
      assignedToSelectedItemsNames: [],

      //
      projectStatusOptions: [
        { label: "ongoing", value: "ongoing" },
        { label: "completed", value: "completed" },
        { label: "stopped", value: "stopped" },
      ],
      newProjectStatus: "",

      //
      teamLead: "",
      update_team_lead_first_clicked: false,
      update_team_lead_second_clicked: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  updateTeamLeadAPI = () => {
    this.setState({
      update_team_lead_second_clicked: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("project", this.state.project);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      team_lead: this.state.teamLead,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/project/updateTeamLead", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        if (result.success) {
          this.setState({
            update_team_lead_first_clicked: false,
            update_team_lead_second_clicked: false,
            teamLead: "",
          });
          toaster.success("Team Lead Updated");
          this.getProjectDetails();
          this.getCompanyEmployees();
        } else {
          this.setState({
            update_team_lead_second_clicked: false,
          });
          toaster.danger("Something went wrong. Please try again.");
          this.getProjectDetails();
          this.getCompanyEmployees();
        }
      })
      .catch((error) => console.log("error", error));
  };

  changeProjectStatusAPI = () => {
    this.setState({
      change_status_second_clicked: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("project", this.state.project);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      status: this.state.newProjectStatus,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/project/changeStatus", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.setState({
            change_status_first_clicked: false,
            change_status_second_clicked: false,
            newProjectStatus: "",
          });
          toaster.success("Project Status Updated");
          this.getProjectDetails();
          this.getCompanyEmployees();
        } else {
          this.setState({
            change_status_second_clicked: false,
          });
          toaster.danger("Something went wrong. Please try again.");
          this.getProjectDetails();
          this.getCompanyEmployees();
        }
      })
      .catch((error) => console.log("error", error));
  };

  handleTaskProgressUpdateOpen = (task) => {
    console.log("Selected task is: ", task);
    this.setState({
      task_progress_update_first_clicked: true,
      taskSelected: task,

      task_name: task.name,
      task_summary: task.summary,
      start_date: moment(task.start_date).format("YYYY-MM-DD"),
      end_date: moment(task.end_date).format("YYYY-MM-DD"),
      taskProgress: task.progress,
    });
  };

  handleTaskProgressUpdateClose = () => {
    this.setState({
      tasktaskSelected: "",
      taskProgress: "",
      task_progress_update_first_clicked: false,
      task_progress_update_second_clicked: false,

      //
      task_name: "",
      task_summary: "",
      start_date: "",
      end_date: "",
      status: "",
      assigned_to: [],
    });
    this.getProjectDetails();
    this.getCompanyEmployees();
  };

  updateTaskAPI = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      project: this.state.project,
      taskId: this.state.taskSelected._id,
      name: this.state.task_name,
      summary: this.state.task_summary,
      progress: Number(this.state.taskProgress),
      start_date: new Date(this.state.start_date).toISOString(),
      end_date: new Date(this.state.end_date).toISOString(),
      assigned_to: this.state.taskSelected.assigned_to,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/project/updateTask", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Task updated Successfully");
          this.handleTaskProgressUpdateClose();
        } else {
          toaster.danger("Something went wrong. Please try again");
        }
      })
      .catch((error) => console.log("error", error));
  };

  checkCanUpdateTaskProgress = (userId, taskId) => {
    var task = this.state.tasks.filter((item) => item._id == taskId)[0];
    console.log("task", task);
    for (var i = 0; i < task.assigned_to.length; i++) {
      console.log(task.assigned_to[i]._id);
      console.log("Cookie:", this.state.cookies.get("userDetails")._id);
      if (
        task.assigned_to[i]._id.toString() ==
          this.state.cookies.get("userDetails")._id.toString() ||
        this.state.cookies.get("userDetails").role === 3
      ) {
        return true;
      }
    }
    // task.assigned_to.forEach((user) => {
    //   console.log(user._id);
    //   console.log("Cookie:", this.state.cookies.get("userDetails")._id);
    //   if (
    //     user._id.toString() ==
    //     this.state.cookies.get("userDetails")._id.toString()
    //   ) {
    //     return true;
    //   }
    // });
    return false;
  };

  createTask = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      project: this.state.project,
      name: this.state.task_name,
      summary: this.state.task_summary,
      start_date: new Date(this.state.start_date).toISOString(),
      end_date: new Date(this.state.end_date).toISOString(),
      status: "ongoing",
      assigned_to: this.state.assignedToSelectedItems,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(SERVER_URL + "/project/createTask", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toaster.success("Task created successfully");
          this.handleCreateTaskModalClose();
          // window.location.reload();
        } else {
          toaster.danger("Something went wrong");
        }
      })
      .catch((error) => console.log("error", error));
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

  handleCreateTaskModalOpen = () => {
    this.setState({
      create_task_clicked_first: true,
    });
  };

  handleCreateTaskModalClose = () => {
    this.setState({
      create_task_clicked_first: false,
      task_name: "",
      task_summary: "",
      start_date: "",
      end_date: "",
      status: "",
      assigned_to: [],

      //
      assignedToSelectedItems: [],
      assignedToSelectedItemsNames: [],
    });
    this.getProjectDetails();
    this.getCompanyEmployees();
  };

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
          var tasks = result.data.tasks;
          var progress = 0;
          if (tasks.length > 0) {
            tasks.forEach((task) => {
              progress += task.progress;
            });
            progress = parseInt(progress / tasks.length);
          }
          this.setState({
            details: result.data,
            tasks: result.data.tasks,
            technologies: result.data.technologies,
            projectProgress: progress,
            newProjectStatus: result.data.status,
            teamLead:
              result.data.team_lead == null ? null : result.data.team_lead._id,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  getCompanyEmployees = () => {
    var myHeaders = new Headers();
    myHeaders.append("company", "60c5bd6a019bbe414c768da4");

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

          var membersNames = [];

          membersList.forEach((item) => {
            membersNames.push({ label: item.first_name, value: item._id });
          });
          console.log("Memberss:: ", membersList);
          this.setState({
            companyMembers: membersList,
            companyMembersNames: membersNames,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  componentDidMount() {
    this.getProjectDetails();
    this.getCompanyEmployees();
  }
  render() {
    return (
      <React.Fragment>
        {/* Update Team Lead */}
        <Dialog
          isShown={this.state.update_team_lead_first_clicked}
          title="Update Team Lead"
          onCloseComplete={() =>
            this.setState({
              update_team_lead_first_clicked: false,
              teamLead: "",
            })
          }
          confirmLabel="Update"
          isConfirmLoading={this.state.update_team_lead_second_clicked}
          onConfirm={() => this.updateTeamLeadAPI()}
        >
          <div>
            <Select
              value={this.state.teamLead}
              onChange={(event) => {
                this.setState({ teamLead: event.target.value });
                console.log("Valuee::", event.target.value);
              }}
            >
              {this.state.companyMembers.map((item) => (
                <option value={item._id}>
                  {item.first_name + " " + item.last_name}
                </option>
              ))}
            </Select>
          </div>
        </Dialog>
        {/* Update Task Progress */}
        <Dialog
          isShown={this.state.task_progress_update_first_clicked}
          title="Update Task"
          confirmLabel="Update"
          onConfirm={this.updateTaskAPI}
          onCloseComplete={this.handleTaskProgressUpdateClose}
        >
          <div>
            <TextInput
              placeholder="Task Name"
              name="task_name"
              onChange={this.handleInputChange}
              value={this.state.task_name}
              width="100%"
            />
            <br />
            <br />
            <Textarea
              placeholder="Task Summary"
              name="task_summary"
              onChange={this.handleInputChange}
              value={this.state.task_summary}
            />
            <br />
            <br />
            <Row>
              <Col sm>
                <div>
                  <p>Start date:</p>
                  <Input
                    type="date"
                    name="start_date"
                    onChange={this.handleInputChange}
                    value={this.state.start_date}
                  />
                </div>
              </Col>

              <Col sm>
                <div>
                  <p>End date:</p>
                  <Input
                    type="date"
                    name="end_date"
                    onChange={this.handleInputChange}
                    value={this.state.end_date}
                  />
                </div>
              </Col>
            </Row>
            <br />
            <TextInput
              type="number"
              placeholder="Task Progress: "
              name="taskProgress"
              onChange={this.handleInputChange}
              value={this.state.taskProgress}
              width="100%"
              min={0}
              max={100}
            />
          </div>
        </Dialog>
        <Dialog
          isShown={this.state.create_task_clicked_first}
          title="Create New Task for Project"
          confirmLabel="Create"
          onConfirm={this.createTask}
          onCloseComplete={this.handleCreateTaskModalClose}
        >
          <div>
            <TextInput
              placeholder="Task Name"
              name="task_name"
              onChange={this.handleInputChange}
              value={this.state.task_name}
              width="100%"
            />
            <br />
            <br />
            <Textarea
              placeholder="Task Summary"
              name="task_summary"
              onChange={this.handleInputChange}
              value={this.state.task_summary}
            />
            <br />
            <br />
            <Row>
              <Col sm>
                <div>
                  <p>Start date:</p>
                  <Input
                    type="date"
                    name="start_date"
                    onChange={this.handleInputChange}
                    value={this.state.start_date}
                  />
                </div>
              </Col>

              <Col sm>
                <div>
                  <p>End date:</p>
                  <Input
                    type="date"
                    name="end_date"
                    onChange={this.handleInputChange}
                    value={this.state.end_date}
                  />
                </div>
              </Col>
            </Row>
            <br />

            <p>Assign to:</p>
            <br />
            <SelectMenu
              isMultiSelect
              title="Select members"
              options={this.state.companyMembersNames}
              onSelect={(item) => {
                const selected = [
                  ...this.state.assignedToSelectedItems,
                  item.value,
                ];
                const selectedItems = selected;
                const selectedItemsLength = selectedItems.length;
                let selectedNames = "";
                if (selectedItemsLength === 0) {
                  selectedNames = "";
                } else if (selectedItemsLength === 1) {
                  selectedNames = selectedItems.toString();
                } else if (selectedItemsLength > 1) {
                  selectedNames =
                    selectedItemsLength.toString() + " selected...";
                }
                this.setState({
                  assignedToSelectedItems: selectedItems,
                  assignedToSelectedItemsNames: selectedNames,
                });
              }}
              onDeselect={(item) => {
                const deselectedItemIndex =
                  this.state.assignedToSelectedItems.indexOf(item.value);
                const selectedItems = this.state.assignedToSelectedItems.filter(
                  (_item, i) => i !== deselectedItemIndex
                );
                const selectedItemsLength = selectedItems.length;
                let selectedNames = "";
                if (selectedItemsLength === 0) {
                  selectedNames = "";
                } else if (selectedItemsLength === 1) {
                  selectedNames = selectedItems.toString();
                } else if (selectedItemsLength > 1) {
                  selectedNames = selectedItemsLength.toString();
                }
                this.setState({
                  assignedToSelectedItems: selectedItems,
                  assignedToSelectedItemsNames: selectedNames,
                });
              }}
            >
              <Button>
                {this.state.assignedToSelectedItemsNames || "Select members..."}
              </Button>
            </SelectMenu>
          </div>
        </Dialog>

        {/* Change Project Status Dialog */}
        <Dialog
          isShown={this.state.change_status_first_clicked}
          title="Change Project Status"
          onCloseComplete={() =>
            this.setState({ change_status_first_clicked: false })
          }
          confirmLabel="Update"
          isConfirmLoading={this.state.change_status_second_clicked}
          onConfirm={() => this.changeProjectStatusAPI()}
        >
          <RadioGroup
            label="Project Status"
            size={16}
            value={this.state.newProjectStatus}
            options={this.state.projectStatusOptions}
            onChange={(event) =>
              this.setState({ newProjectStatus: event.target.value })
            }
          />
        </Dialog>

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
                      <p
                        style={{ color: "#EC407A", cursor: "pointer" }}
                        onClick={() => (window.location.href = "/projects")}
                      >
                        <IoArrowBackOutline size={30} />
                        <span style={{ marginLeft: "12px" }}>
                          GO BACK TO PROJECTS
                        </span>
                      </p>
                      <Row>
                        <Col sm>
                          <div>
                            <h2
                              style={{ marginTop: "40px" }}
                              className="display-4"
                            >
                              <b>{this.state.details.name}</b>
                            </h2>
                            <h6 style={{ color: "#9E9E9E" }}>
                              {this.state.details.category}
                            </h6>
                            <h6>{this.state.details.summary}</h6>
                            <br />
                            <h6>
                              Team Lead:{" "}
                              {this.state.details.team_lead == null
                                ? "No Team Lead"
                                : this.state.details.team_lead.first_name +
                                  " " +
                                  this.state.details.team_lead.last_name}
                            </h6>
                          </div>
                        </Col>
                        <Col sm></Col>
                        <Col sm>
                          <div>
                            <div className="InProgressDiv">
                              <p>{this.state.details.status}</p>
                            </div>
                            <div style={{ marginTop: "40px" }}>
                              <h4>{this.state.projectProgress} % Completed</h4>
                            </div>
                            <hr />
                            <div>
                              <h4>Budget: ₹ 5000 </h4>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div>
                        <Button
                          marginY={8}
                          marginRight={12}
                          iconBefore={EditIcon}
                        >
                          Edit
                        </Button>

                        <Button
                          marginY={8}
                          marginRight={12}
                          iconBefore={PeopleIcon}
                          onClick={() =>
                            this.setState({
                              update_team_lead_first_clicked: true,
                            })
                          }
                        >
                          Update Team Lead
                        </Button>

                        <Button
                          marginY={8}
                          marginRight={12}
                          iconBefore={StopIcon}
                          onClick={() =>
                            this.setState({ change_status_first_clicked: true })
                          }
                        >
                          Change Project Status
                        </Button>
                      </div>
                      <div>
                        {this.state.technologies.map((technology) => (
                          <Badge color="neutral">
                            {technology.technology.name}{" "}
                            <span>
                              <RemoveIcon size={12} />{" "}
                            </span>
                          </Badge>
                        ))}
                        <Badge>{<AddIcon />}</Badge>
                      </div>

                      <div className="ViewProjectTopDiv">
                        <Row>
                          <Col sm className="ViewProjectTopDivItem">
                            <div>
                              <h5>
                                {moment(this.state.details.end_date).diff(
                                  moment(),
                                  "days"
                                )}
                              </h5>
                              <h6>Days till Deadline</h6>
                            </div>
                          </Col>

                          <Col sm className="ViewProjectTopDivItem">
                            <div>
                              <h5>
                                {moment(this.state.details.end_date).format(
                                  "DD MMM, YYYY"
                                )}
                              </h5>
                              <h6>Deadline</h6>
                            </div>
                          </Col>

                          <Col sm className="ViewProjectTopDivItem">
                            <div>
                              <h5>
                                {moment(this.state.details.start_date).format(
                                  "DD MMM, YYYY"
                                )}
                              </h5>
                              <h6>Day Started</h6>
                            </div>
                          </Col>

                          <Col sm className="ViewProjectTopDivItem">
                            <div>
                              <h5>{this.state.tasks.length}</h5>
                              <h6>Tasks</h6>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="ViewProjectsOpenTasksDiv">
                        <div className="ViewProjectsOpenTasksTitle">
                          <h3>Open Tasks</h3>
                        </div>
                        <Button
                          marginY={8}
                          marginRight={12}
                          iconBefore={AddIcon}
                          onClick={this.handleCreateTaskModalOpen}
                        >
                          Create New Task
                        </Button>

                        <div className="ViewProjectsOpenTasksItemsMainDiv">
                          <Row>
                            {this.state.tasks.length > 0 &&
                              this.state.tasks.map((task) => (
                                <Col
                                  sm="3"
                                  className="ViewProjectsOpenTasksItem"
                                >
                                  <div>
                                    <Row>
                                      <Col sm>
                                        <div>
                                          {task.status === "ongoing" && (
                                            <Badge color="blue">Ongoing</Badge>
                                          )}
                                          {task.status === "completed" && (
                                            <Badge color="green">
                                              Completed
                                            </Badge>
                                          )}
                                        </div>
                                      </Col>
                                      <Col sm>
                                        <div style={{ textAlign: "right" }}>
                                          {this.checkCanUpdateTaskProgress(
                                            this.state.cookies.get(
                                              "userDetails"
                                            )._id,
                                            task._id
                                          ) ? (
                                            <div>
                                              <EditIcon
                                                onClick={() =>
                                                  this.handleTaskProgressUpdateOpen(
                                                    task
                                                  )
                                                }
                                              />
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <br />

                                    <h5>
                                      <b>{task.name}</b>
                                    </h5>
                                    <p style={{ fontSize: "14px" }}>
                                      {task.summary}
                                    </p>
                                    <hr />
                                    <div style={{ color: "#9E9E9E" }}>
                                      <p style={{ fontSize: "14px" }}>
                                        Progress: {task.progress + " %"}
                                      </p>
                                      <p style={{ fontSize: "14px" }}>
                                        Start Date:{" "}
                                        {moment(task.start_date).format(
                                          "DD MMM, YYYY"
                                        )}
                                      </p>

                                      <p style={{ fontSize: "14px" }}>
                                        End Date:{" "}
                                        {moment(task.end_date).format(
                                          "DD MMM, YYYY"
                                        )}
                                      </p>
                                      <p style={{ fontSize: "14px" }}>
                                        Assigned to:{" "}
                                        {task.assigned_to.map((user, i) => (
                                          <span>{user.first_name}, </span>
                                        ))}
                                      </p>
                                      <hr />
                                    </div>

                                    {/* <div
                                      style={{
                                        textAlign: "center",
                                        marginBottom: "20px",
                                      }}
                                    >
                                      <Row>
                                        <Col sm>
                                          <div>
                                            <p style={{ fontSize: "14px" }}>
                                              Start Date:{" "}
                                              {moment(task.start_date).format(
                                                "DD MMM, YYYY"
                                              )}
                                            </p>
                                          </div>
                                        </Col>
                                        <Col sm>
                                          <div>
                                            <p style={{ fontSize: "14px" }}>
                                              End Date:{" "}
                                              {moment(task.end_date).format(
                                                "DD MMM, YYYY"
                                              )}
                                            </p>
                                          </div>
                                        </Col>
                                      </Row>
                                    </div> */}
                                  </div>
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
      </React.Fragment>
    );
  }
}

export default ViewProjectComponent;
