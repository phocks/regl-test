import React from "react";
import styles from "./styles.scss";

// Import other components
import PulsatingBall from "../PulsatingBall";
import TestCanvas from "../TestCanvas";

export default class App extends React.Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={styles.root} ref={el => (this.node = el)}>
        {/* <PulsatingBall /> */}
        <TestCanvas />
      </div>
    );
  }
}
