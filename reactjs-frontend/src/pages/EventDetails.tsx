import React, { ChangeEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdLocationOn,
  MdDateRange,
  MdAccessTime,
  MdShare,
  MdOutlineDelete,
} from "react-icons/md";
import Loader from "react-loader-spinner";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useAuth0 } from "@auth0/auth0-react";
import {
  useAttendEventMutation,
  useCheckItemMutation,
  useDeleteEventMutation,
  useGetEventByIdQuery,
} from "../api";

export const EventDetails = () => {
  const { user } = useAuth0();
  const userID = user?.sub;
  const username = user?.nickname;

  const location = useLocation();
  const id = (location.state as { id: string }).id;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [attendingButton, setAttendingButton] = useState(true);

  const { data: event, isLoading } = useGetEventByIdQuery(id);
  const { mutate: attendEvent, isLoading: attendLoading } =
    useAttendEventMutation(id);
  const { mutate: checkItem } = useCheckItemMutation(event);
  const { mutate: deleteEvent } = useDeleteEventMutation(id);

  const dateTimeFormat = event ? new Date(event.dateTime) : new Date();

  const attendeesList = event?.attendees.map((attendee) => {
    var displayAttendee = attendee.username;
    if (attendee.id === event?.creatorID)
      displayAttendee = displayAttendee + " (Host)";
    if (attendee.id === userID) displayAttendee = displayAttendee + " (You)";

    return (
      <div className="detailsAttendee" key={attendee.id}>
        {displayAttendee}
      </div>
    );
  });

  const itemsList = event?.items.map((item) => (
    <label className="detailsItem" key={item.name}>
      {item.name}
      <input
        type="checkbox"
        value={item.name}
        checked={item.available}
        onChange={(e) => {
          checkItem({
            item: e.target.value,
            available: e.target.checked,
          });
        }}
        disabled={!event.attendees.some((attendee) => attendee.id === userID)}
      />
    </label>
  ));

  return isLoading ? (
    <div
      style={{
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader type="TailSpin" color="#004b7d" height="10vh" width="15vw" />
    </div>
  ) : (
    <div id="detailsMainDiv">
      <img src={event?.image} id="detailsImage" alt={event?.title} />
      <div id="detailsHeader">
        <div id="detailsTitle">
          <p style={{ fontSize: "clamp(25px, 3vw, 40px)" }}>{event?.title}</p>
          <div
            style={{ marginTop: "5px", display: "flex", alignItems: "center" }}
          >
            <MdShare
              className="infoIcon"
              color="green"
              size={20}
              onClick={() => {
                if (event) {
                  navigator.clipboard.writeText(event._id);
                  NotificationManager.info("Copied to clipboard.", "", 1000);
                }
              }}
            />
            <MdOutlineDelete
              className="infoIcon"
              id="deleteButton"
              color="red"
              size={20}
              style={{
                marginLeft: "10px",
                display: userID === event?.creatorID ? "block" : "none",
              }}
              onClick={(e) => {
                setConfirmDelete(!confirmDelete);
              }}
            />
            <input
              id={
                confirmDelete
                  ? "confirmDeleteButton"
                  : "confirmDeleteButtonHidden"
              }
              type="button"
              value="Confirm Delete"
              onClick={() => deleteEvent()}
            />
          </div>
        </div>
        <div id="detailsInfo">
          <p>
            {event?.eventLocation}
            <MdLocationOn style={{ marginLeft: "10px" }} />
          </p>
          <p>
            {dateTimeFormat.toLocaleDateString()}
            <MdDateRange style={{ marginLeft: "10px" }} />
          </p>
          <p>
            {dateTimeFormat.toLocaleTimeString()}
            <MdAccessTime style={{ marginLeft: "10px" }} />
          </p>
        </div>
      </div>
      <div id="detailsContent">
        <div id="detailsAttendees">
          <p
            style={{
              fontFamily: "SegoeUI",
              fontSize: "20px",
              paddingBottom: "20px",
            }}
          >
            Attendees ({event?.attendees.length})
          </p>
          <div id="detailsSubAttendees">{attendeesList}</div>
          {attendLoading ? (
            <Loader type="TailSpin" color="#004b7d" height="30px" />
          ) : !event?.attendees.some((attendee) => attendee.id === userID) ? (
            <input
              type="button"
              id="attendButton"
              value="Attend Event"
              style={{ marginTop: "auto" }}
              onClick={() =>
                attendEvent({
                  userID,
                  username,
                })
              }
            />
          ) : (
            <input
              type="button"
              id="attendButton"
              value={attendingButton ? "Attending" : "Leave Event"}
              style={{
                marginTop: "auto",
                backgroundColor: attendingButton
                  ? "rgba(0, 200, 75, 0.8)"
                  : "rgb(255, 50, 50)",
              }}
              onMouseEnter={() => setAttendingButton(false)}
              onMouseLeave={() => setAttendingButton(true)}
              onClick={() =>
                attendEvent({
                  userID,
                  unAttend: true,
                })
              }
            />
          )}
        </div>
        <div id="detailsDescription">
          <p
            style={{
              fontFamily: "SegoeUI",
              fontSize: "20px",
              paddingBottom: "20px",
            }}
          >
            Description
          </p>
          <p
            style={{
              fontFamily: "SegoeUI",
              width: "95%",
              flex: "1 1 auto",
              overflowY: "auto",
            }}
          >
            {event?.description}
          </p>
        </div>
        <div id="detailsItems">
          <p
            style={{
              fontFamily: "SegoeUI",
              fontSize: "20px",
              paddingBottom: "20px",
            }}
          >
            Bring Along
          </p>
          <div id="detailsSubItems">{itemsList}</div>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default EventDetails;
