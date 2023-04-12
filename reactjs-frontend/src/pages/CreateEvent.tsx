import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import Loader from "react-loader-spinner";
import { useAuth0 } from "@auth0/auth0-react";
import { useCreateEventMutation } from "../api";

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
    <form
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
      <label>
        Event Title
        <input
          type="text"
          placeholder="Event Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Location
        <input
          type="text"
          placeholder={"Describe the event's location."}
          onChange={(e) => setEventLocation(e.target.value)}
          required
        />
      </label>
      <label>
        Date and Time
        <DateTimePicker id="dateTime" onChange={setDateTime} value={dateTime} />
      </label>
      <label>
        Image Link
        <input
          type="text"
          style={{ width: "70vw" }}
          placeholder="Paste image URL here."
          onChange={(e) => setImage(e.target.value)}
        />
      </label>
      <label>
        Items to Bring Along
        <input
          type="text"
          style={{ width: "70vw" }}
          placeholder="Separate items by a comma."
          onChange={(e) => setItems(e.target.value)}
        />
      </label>
      <label>
        Description
        <textarea
          style={{
            width: "70vw",
            height: "400px",
            textAlign: "left",
            resize: "none",
            padding: "10px",
          }}
          placeholder="Describe the plans for the event."
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      {isLoading ? (
        <div style={{ marginTop: "30px" }}>
          <Loader type="TailSpin" color="#004b7d" height="40px" />
        </div>
      ) : (
        <button id="createEventButton" type="submit">
          Create Event!
        </button>
      )}
    </form>
  );
};

export default CreateEvent;
