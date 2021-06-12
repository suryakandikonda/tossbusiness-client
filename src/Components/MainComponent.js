import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import PeopleComponent from "./People/PeopleComponent";
import LoginComponent from "./PreLogin/LoginComponent";
import RegisterComponent from "./PreLogin/RegisterComponent";
import ProjectsComponent from "./Projects/ProjectsComponent";
import ViewProjectComponent from "./Projects/ViewProjectComponent";

class MainComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/login" component={LoginComponent} />
          <Route path="/register" component={RegisterComponent} />
          <Route path="/projects" component={ProjectsComponent} />
          <Route path="/viewproject" component={ViewProjectComponent} />

          {/* People */}
          <Route path="/people" component={PeopleComponent} />

          <Redirect to="/login" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default MainComponent;
