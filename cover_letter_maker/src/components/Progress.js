import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class Progreess extends Component {
  state = {size: 0}
  render() {
    return (
      <div className="ProgressBar">
        <Row>
          { window.innerWidth > 768 && (
            <>
          <Col>Personal Details</Col>
          <Col>Education</Col>
          <Col>Experience</Col>
          <Col>Skills</Col>
          <Col>Position Info</Col>
          <Col>Name letter</Col>
          </>
          ) }
        </Row>
        <ProgressBar now={this.props.size} />
      </div>
    );
  }
}

export default Progreess;