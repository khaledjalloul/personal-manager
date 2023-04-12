import React from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../types";
import { MdAccessTime, MdDateRange, MdLocationOn } from "react-icons/md";

export const EventCard = ({
  _id,
  title,
  eventLocation,
  dateTime: dateTimeStr,
  image,
}: Event) => {
  const navigate = useNavigate();
  const dateTime = new Date(dateTimeStr);

  return (
    <div
      className="cardDiv"
      onClick={() => {
        navigate("/event-planner_react/eventDetails", { state: { id: _id } });
      }}
    >
      <img src={image} className="cardImage" alt={title} />
      <div className="cardInfoDiv">
        <p style={{ fontWeight: "bold", alignSelf: "center" }}>{title}</p>
        <div
          style={{
            width: "70%",
            borderTop: "solid 2px black",
            alignSelf: "center",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        />
        <div className="cardInfoSubDiv">
          <p>
            <MdLocationOn style={{ marginRight: "4px" }} /> {eventLocation}
          </p>
          <p>
            <MdDateRange style={{ marginRight: "4px" }} />{" "}
            {dateTime.toLocaleDateString()}
          </p>
          <p>
            <MdAccessTime style={{ marginRight: "4px" }} />{" "}
            {dateTime.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};
