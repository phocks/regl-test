import React from "react";
import styles from "./styles.scss";

// Import other components
// import PulsatingBall from "../PulsatingBall";
import TestCanvas from "../TestCanvas";
// import DotStream from "../DotStream";

export default class App extends React.Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={styles.root}>
        {/* <PulsatingBall /> */}
        <TestCanvas />
        {/* <DotStream /> */}
      </div>
    );
  }
}
