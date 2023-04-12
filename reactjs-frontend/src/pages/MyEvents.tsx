import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Event } from "../types";
import { EventCard } from "../components/EventCard";
import { useGetEventByIdQuery, useGetEventsQuery } from "../api";

export const MyEvents = () => {
  const { user } = useAuth0();
  const [searchID, setSearchID] = useState<string>();
  const { data: events, isLoading } = useGetEventsQuery(user?.sub);
  const { isLoading: searchLoading, refetch: searchForEvent } =
    useGetEventByIdQuery(searchID, true);

  var eventCards = events?.map((event: Event, index) => (
    <EventCard key={index} {...event} />
  ));

  if (isLoading)
    return (
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
    );

  if (!eventCards || eventCards.length === 0)
    return (
      <div>
        <div
          className="searchEventDiv"
          style={{ width: "100vw", height: "100%" }}
        >
          <p
            style={{
              fontFamily: "SegoeUI",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>You're not attending any events.</span>
            <span style={{ marginTop: "5px" }}>
              Join one by pasting its ID below.
            </span>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchForEvent();
            }}
            className="searchEventSubDiv"
            style={{ marginTop: "20px" }}
          >
            <input
              type="text"
              placeholder="Event ID"
              onChange={(e) => setSearchID(e.target.value)}
              required
            />
            {searchLoading ? (
              <Loader type="TailSpin" color="#004b7d" height="20px" />
            ) : (
              <input type="submit" value="Search" />
            )}
          </form>
        </div>
      </div>
    );
  else
    return (
      <div id="homeMainDiv">
        <div id="homeCardListDiv">{eventCards}</div>
        <div className="searchEventDiv">
          <p style={{ fontFamily: "SegoeUI", color: "grey", fontSize: "14px" }}>
            Join an existing event by pasting its ID below.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchForEvent();
            }}
            className="searchEventSubDiv"
          >
            <input
              type="text"
              placeholder="Event ID"
              onChange={(e) => setSearchID(e.target.value)}
              required
            />
            {searchLoading ? (
              <Loader type="TailSpin" color="#004b7d" height="20px" />
            ) : (
              <input type="submit" value="Search" />
            )}
          </form>
        </div>
      </div>
    );
};

export default MyEvents;
