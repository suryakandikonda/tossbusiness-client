import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import PeopleComponent from "./People/PeopleComponent";
import LoginComponent from "./PreLogin/LoginComponent";
import RegisterComponent from "./PreLogin/RegisterComponent";
import ProjectsComponent from "./Projects/ProjectsComponent";
import ViewProjectComponent from "./Projects/ViewProjectComponent";
import VisitsComponent from "./Visits/VisitsComponent";

class MainComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/login" component={LoginComponent} />
          <Route path="/register" component={RegisterComponent} />
          <Route path="/projects" component={ProjectsComponent} />

          <Route
            exact
            path="/project/:id"
            render={(routerProps) => (
              <ViewProjectComponent match={routerProps.match} />
            )}
          />

          {/* People */}
          <Route path="/people" component={PeopleComponent} />

          {/* Visits */}
          <Route path="/visits" component={VisitsComponent} />

          <Redirect to="/login" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default MainComponent;
