import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "./react-components/input/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom";
import { WrappedIntlProvider } from "./react-components/wrapped-intl-provider";
import registerTelemetry from "./telemetry";
import Store from "./storage/store";
import "./utils/theme";
import { HomePage } from "./react-components/home/HomePage";
import "./assets/stylesheets/globals.scss";
import { AuthContextProvider } from "./react-components/auth/AuthContext";
import { FormattedMessage } from "react-intl";
import styles from "./assets/stylesheets/modal.scss";

registerTelemetry("/home", "Hubs Home Page");

const store = new Store();
window.APP = { store };

function Root() {
  const [showAgeRestriction, setShowAgeRestriction] = useState(true);
  const handleCloseAgeRestriction = () => setShowAgeRestriction(false);

  const onModalClose = () => {
    window.location.href = "http://coquetelmolotov.com.br/17edicao";
  };

  return (
    <WrappedIntlProvider>
      <AuthContextProvider store={store}>
        <HomePage />

        <Modal
          className={styles.modal}
          show={showAgeRestriction}
          onHide={onModalClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage id="age-restriction.title" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormattedMessage id="age-restriction.body" />
          </Modal.Body>
          <Modal.Footer>
            <Button className={styles.modal_button} variant="primary" onClick={handleCloseAgeRestriction}>
              <FormattedMessage id="age-restriction.button" />
            </Button>
          </Modal.Footer>
        </Modal>
      </AuthContextProvider>
    </WrappedIntlProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("home-root"));
