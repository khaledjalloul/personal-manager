import React from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../types";
import { MdAccessTime, MdDateRange, MdLocationOn } from "react-icons/md";
import styled from "styled-components";

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
    <Wrapper
      onClick={() => {
        navigate("/event-planner_react/eventDetails", { state: { id: _id } });
      }}
    >
      <EventImage src={image} alt={title} />
      <ContentDiv>
        <Title>{title}</Title>
        <Divider />
        <ContentDetails>
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
        </ContentDetails>
      </ContentDiv>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-height: 330px;
  display: flex;
  flex-direction: column;
  background-color: rgba(200, 200, 200, 0.1);
  box-shadow: 5px 5px 10px 0px grey;
  cursor: pointer;
  border-radius: 7px;
  transition-duration: 0.25s;

  &:hover {
    box-shadow: 2px 2px 5px 0px grey;
    transition-duration: 0.25s;
  }
  @media (max-width: 599px) {
    width: 65%;
    margin-top: clamp(15px, 2%, 20px);
  }

  @media (min-width: 599px) {
    width: clamp(200px, 23%, 400px);
    margin: 2%;
  }
`;
const EventImage = styled.img`
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  height: 60%;
  object-fit: cover;
`;
const ContentDiv = styled.div`
  margin: 4%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1rem;
  font-family: SegoeUI;
`;
const Title = styled.p`
  font-weight: bold;
  align-self: center;
`;
const Divider = styled.div`
  width: 70%;
  border-top: solid 2px black;
  align-self: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const ContentDetails = styled.div`
  margin-left: 15%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
