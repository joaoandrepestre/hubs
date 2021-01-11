import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./MediaGrid.scss";

export function MediaGrid({ children, className, ...rest }) {
  const big_rooms = children.filter(child => {
    return child.props.room.room_size === 15;
  });
  const medium_rooms = children.filter(child => {
    return child.props.room.room_size === 5;
  });
  const small_rooms = children.filter(child => {
    return child.props.room.room_size === 1;
  });
  return (
    <>
      <h2 style={{ textAlign: "center", color: "white" }}>
        <b>⇊ ESCOLHA UMA SALA ⇊</b>
      </h2>
      <br />
      {big_rooms.length > 0 && (
        <div>
          <h3 style={{ textAlign: "center", color: "white" }}>SALAS até 15 PESSOAS</h3>
          <div className={classNames(styles.mediaGrid, className)} {...rest}>
            {big_rooms}
          </div>
        </div>
      )}
      {medium_rooms.length > 0 && (
        <div>
          <h3 style={{ textAlign: "center", color: "white" }}>SALAS até 5 PESSOAS</h3>
          <div className={classNames(styles.mediaGrid, className)} {...rest}>
            {medium_rooms}
          </div>
        </div>
      )}
      {small_rooms.length > 0 && (
        <div>
          <h3 style={{ textAlign: "center", color: "white" }}>SALAS PARTICULARES</h3>
          <div className={classNames(styles.mediaGrid, className)} {...rest}>
            {small_rooms}
          </div>
        </div>
      )}
    </>
  );
}

MediaGrid.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};
