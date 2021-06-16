import { Spinner } from "evergreen-ui";
import React, { Component } from "react";

class LoadingComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <Spinner marginX="auto" marginY={120} />
      </React.Fragment>
    );
  }
}

export default LoadingComponent;
