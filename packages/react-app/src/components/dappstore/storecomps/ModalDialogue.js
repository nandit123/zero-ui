import { Modal, Button } from "react-bootstrap";
import React, { Component } from "react";
import { SPACE_NAME } from "../Constants";

export default class ModalDialogue extends Component {
  state = {
    show: false,
    handleClose: () => this.setState({ show: false }),
    handleShow: () => this.setState({ show: true })
  };

  componentWillUnmount(){
    this.props.space.unsubscribeThread(this.props.app.name)
  }

  render() {
    return (
      <>
        <Button variant="primary" onClick={this.state.handleShow} style={{width : '100%', margin: '10px'}}>
          Comments
        </Button>

        <Modal show={this.state.show} onHide={this.state.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.app.name}</Modal.Title>
          </Modal.Header>
          <img alt="aap logo"
            style={{
              width: "200px",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "40px"
            }}
            src={
              this.props.app.appImage
                ? this.props.app.appImage
                : "https://via.placeholder.com/200"
            }
            onError={ev =>
              (ev.target.src =
                "http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png")
            }
          />
          <Modal.Body>{this.props.app.description}</Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={this.state.handleClose} >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}