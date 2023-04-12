import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import Loader from "react-loader-spinner";
import { useAuth0 } from "@auth0/auth0-react";
import { useCreateEventMutation } from "../api";
import styled from "styled-components";

export const CreateEvent = () => {
  const { user } = useAuth0();
  const [title, setTitle] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [image, setImage] = useState("");
  const [items, setItems] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createEvent, isLoading } = useCreateEventMutation();

  return (
    <Wrapper
      id="createMainDiv"
      onSubmit={(e) => {
        e.preventDefault();
        createEvent({
          title,
          location: eventLocation,
          dateTime: dateTime.toISOString(),
          image: !image
            ? "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya3xlbnwwfHwwfHw%3D&w=1000&q=80"
            : image,
          items: items === "" ? [] : items.split(","),
          description,
          creatorName: user?.nickname!,
          creatorID: user?.sub!,
        });
      }}
    >
      <Label>
        Event Title
        <input
          type="text"
          placeholder="Event Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Label>
      <Label>
        Location
        <input
          type="text"
          placeholder={"Describe the event's location."}
          onChange={(e) => setEventLocation(e.target.value)}
          required
        />
      </Label>
      <Label>
        Date and Time
        <DateTimePicker id="dateTime" onChange={setDateTime} value={dateTime} />
      </Label>
      <Label>
        Image Link
        <InputField
          type="text"
          placeholder="Paste image URL here."
          onChange={(e) => setImage(e.target.value)}
        />
      </Label>
      <Label>
        Items to Bring Along
        <InputField
          type="text"
          placeholder="Separate items by a comma."
          onChange={(e) => setItems(e.target.value)}
        />
      </Label>
      <Label>
        Description
        <TextAreaField
          placeholder="Describe the plans for the event."
          onChange={(e) => setDescription(e.target.value)}
        />
      </Label>

      {isLoading ? (
        <LoadingDiv>
          <Loader type="TailSpin" color="#004b7d" height="40px" />
        </LoadingDiv>
      ) : (
        <CreateEventButton type="submit">Create Event!</CreateEventButton>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.form`
  width: 100vw;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Label = styled.label`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: SegoeUI;
  font-size: 1.3rem;

  & > input,
  & > textarea {
    height: 40px;
    width: 70vw;
    margin-top: 10px;
    border: solid 1px grey;
    background-color: rgba(100, 100, 100, 0.1);
    outline: none;
    opacity: 0.7;
    box-shadow: 5px 5px 5px 1px grey;
    font-family: SegoeUI;
    font-size: 1rem;
    text-align: center;
  }
  & > input:hover,
  & > textarea:hover,
  & > input:focus,
  & > textarea:focus {
    opacity: 1;
    transition-duration: 0.2s;
  }
`;
const InputField = styled.input`
  width: 70vw;
`;
const TextAreaField = styled.textarea`
  width: 70vw;
  height: 400px;
  text-align: left;
  resize: none;
  padding: 10px;
`;
const LoadingDiv = styled.div`
  margin-top: 30px;
`;
const CreateEventButton = styled.button`
  height: 40px;
  width: 30vw;
  margin-top: 30px;
  color: white;
  background-color: rgb(0, 125, 200);
  border: none;
  box-shadow: 3px 3px 7px 1px grey;
  font-family: SegoeUI;
  font-size: 1rem;
  cursor: pointer;
  transition-duration: 0.2s;

  &:hover {
    box-shadow: 1px 1px 2px 1px grey;
    transition-duration: 0.2s;
  }
`;
