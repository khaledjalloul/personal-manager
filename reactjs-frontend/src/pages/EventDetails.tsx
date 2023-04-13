import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
import styled, { css } from "styled-components";

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

    return <Attendee key={attendee.id}>{displayAttendee}</Attendee>;
  });

  const itemsList = event?.items.map((item) => (
    <Item key={item.name}>
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
    </Item>
  ));

  return isLoading ? (
    <LoadingDiv>
      <Loader type="TailSpin" color="#004b7d" height="10vh" width="15vw" />
    </LoadingDiv>
  ) : (
    <Wrapper>
      <EventImage src={event?.image} alt={event?.title} />
      <Header>
        <TitleDiv>
          <Title>{event?.title}</Title>
          <ActionsDiv>
            <ShareIcon
              color="green"
              size={20}
              onClick={() => {
                if (event) {
                  navigator.clipboard.writeText(event._id);
                  NotificationManager.info("Event ID copied to clipboard.", "", 1000);
                }
              }}
            />
            {event?.creatorID === userID && (
              <DeleteIcon
                id="deleteButton"
                color="red"
                size={20}
                onClick={(e) => {
                  setConfirmDelete(!confirmDelete);
                }}
              />
            )}
            <ConfirmDeleteButton
              style={!confirmDelete ? { visibility: "hidden" } : undefined}
              type="button"
              value="Confirm Delete"
              onClick={() => deleteEvent()}
            />
          </ActionsDiv>
        </TitleDiv>
        <HeaderContent>
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
        </HeaderContent>
      </Header>
      <DetailsDiv>
        <Attendees>
          <SectionTitle>Attendees ({event?.attendees.length})</SectionTitle>
          <AttendeeList>{attendeesList}</AttendeeList>
          {attendLoading ? (
            <Loader type="TailSpin" color="#004b7d" height="30px" />
          ) : !event?.attendees.some((attendee) => attendee.id === userID) ? (
            <AttendButton
              type="button"
              value="Attend Event"
              onClick={() =>
                attendEvent({
                  userID,
                  username,
                })
              }
            />
          ) : (
            <AttendButton
              type="button"
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
        </Attendees>
        <DescriptionDiv>
          <SectionTitle>Description</SectionTitle>
          <EventDescription>{event?.description}</EventDescription>
        </DescriptionDiv>
        <ItemsDiv>
          <SectionTitle>Bring Along</SectionTitle>
          <ItemList>{itemsList}</ItemList>
        </ItemsDiv>
      </DetailsDiv>
      <NotificationContainer />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
`;
const Header = styled.div`
  height: 120px;
  width: calc(100% - 100px);
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 5px 5px 10px 2px grey;
  font-family: SegoeUI;
`;
const HeaderContent = styled.div`
  height: 70%;
  min-width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 1rem;
`;
const TitleDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const LoadingDiv = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Title = styled.p`
  font-size: clamp(25px, 3vw, 40px);
`;
const SectionTitle = styled.p`
  font-family: "SegoeUI";
  font-size: 20px;
  padding-bottom: 20px;
`;
const ActionsDiv = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
`;
const EventDescription = styled.p`
  font-family: "SegoeUI";
  width: 95%;
  flex: 1 1 auto;
  overflow-y: auto;
`;
const AttendButton = styled.input`
  margin-top: auto;
  min-height: 35px;
  width: 100%;
  border: none;
  color: white;
  background-color: rgba(0, 75, 125, 0.8);
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 75, 125, 1);
    transition-duration: 0.3s;
  }
`;
const infoIcon = css`
  padding: 3px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: rgba(100, 100, 100, 0.2);
    transition-duration: 0.2s;
  }
`;
const ShareIcon = styled(MdShare)`
  ${infoIcon}
`;
const DeleteIcon = styled(MdOutlineDelete)`
  ${infoIcon}
  margin-left: 10px;
`;
const EventImage = styled.img`
  height: 100%;
  width: 100%;
  position: absolute;
  object-fit: cover;
  opacity: 0.9;
  z-index: -1;
`;
const DetailsDiv = styled.div`
  width: calc(100% - 40px);
  flex: 1 1 auto;
  padding: 20px;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;
const Attendees = styled.div`
  min-height: 250px;
  min-width: 350px;
  flex: 1 1 auto;
  margin: 10px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 5px 5px 10px 2px grey;
`;
const AttendeeList = styled.div`
  width: 100%;
  flex: 1 1 auto;
  direction: rtl;
  overflow-y: auto;
  font-size: 1rem;
`;
const Attendee = styled.div`
  min-height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 75, 125, 0.1);
  font-family: SegoeUI;
  cursor: default;

  &:hover {
    background-color: rgba(0, 75, 125, 0.2);
    transition-duration: 0.3s;
  }
`;
const DescriptionDiv = styled.div`
  min-height: 380px;
  min-width: 45%;
  flex: 1 1 auto;
  margin: 10px;
  padding-top: 20px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 5px 5px 10px 2px grey;
  font-size: 1rem;
`;
const ItemsDiv = styled.div`
  min-height: 250px;
  min-width: 350px;
  flex: 1 1 auto;
  margin: 10px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 5px 5px 10px 2px grey;
  font-size: 1rem;
`;
const ItemList = styled.div`
  width: 100%;
  flex: 1 1 auto;
  overflow-y: auto;
`;
const Item = styled.label`
  min-height: 30px;
  width: 80%;
  padding-right: 10%;
  padding-left: 10%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 75, 125, 0.1);
  font-family: SegoeUI;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 75, 125, 0.2);
    transition-duration: 0.3s;
  }
`;
const ConfirmDeleteButton = styled.input`
  margin-left: 10px;
  padding: 5px;
  border: none;
  color: white;
  background-color: rgb(255, 50, 50);
  box-shadow: 3px 3px 5px 1px grey;
  cursor: pointer;
  transition-duration: 0.2s;

  &:hover {
    box-shadow: 1px 1px 3px 1px grey;
    transition-duration: 0.2s;
  }
`;
