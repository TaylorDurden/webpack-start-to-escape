"use strict";

// import React from "react";
// import ReactDOM from "react-dom";
// import "./search.less";
// import m4 from "./images/m4.jpeg";
// import "../../common";
// import { a } from "./tree-shaking";

const React = require("react");
const m4 = require("./images/m4.jpeg");
require("./search.less");

class Search extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      TextComp: null,
    };
  }

  loadComponent() {
    import("./text.js").then((Text) => {
      this.setState({
        TextComp: Text.default,
      });
    });
  }

  render() {
    const { TextComp } = this.state;
    return (
      <div className="search">
        {TextComp ? <TextComp /> : null}
        Search Text 2222
        <img src={m4} onClick={this.loadComponent.bind(this)} />
      </div>
    );
  }
}

module.exports = <Search />;
