"use strict";

import React from "react";
import ReactDOM from "react-dom";
import "./search.less";
import m4 from "./images/m4.jpeg";
import '../../common';
import { a } from './tree-shaking';

if (false) {
  a();
}

class Search extends React.Component {
  render() {
    const funcA = a();
    return (
      <div className="search">
        Search Text 2222
        <img src={m4} />
      </div>
    );
  }
}











ReactDOM.render(<Search />, document.getElementById("root"));
