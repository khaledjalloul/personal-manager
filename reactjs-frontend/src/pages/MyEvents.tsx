import React, { Dispatch, SetStateAction, useState } from "react";
import Loader from "react-loader-spinner";
import { useAuth0 } from "@auth0/auth0-react";
import { Event } from "../types";
import { EventCard } from "../components/EventCard";
import { useGetEventByIdQuery, useGetEventsQuery } from "../api";
import styled from "styled-components";

const SearchForEvent = ({
  fullHeight = false,
  searchForEvent,
  setSearchID,
  searchLoading,
}: {
  fullHeight?: boolean;
  searchForEvent: Function;
  setSearchID: Dispatch<SetStateAction<string | undefined>>;
  searchLoading: boolean;
}) => {
  return (
    <SearchWrapper fullHeight={fullHeight}>
      {fullHeight ? (
        <SearchInfo>
          <span>You're not attending any events.</span>
          <span style={{ marginTop: "5px" }}>
            Join one by pasting its ID below.
          </span>
        </SearchInfo>
      ) : (
        <MiniSearchInfo>
          Join an existing event by pasting its ID below.
        </MiniSearchInfo>
      )}
      <SearchForm
        onSubmit={(e) => {
          e.preventDefault();
          searchForEvent();
        }}
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
      </SearchForm>
    </SearchWrapper>
  );
};
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
      <LoadingDiv>
        <Loader type="TailSpin" color="#004b7d" height="10vh" width="15vw" />
      </LoadingDiv>
    );

  if (!eventCards || eventCards.length === 0)
    return (
      <Wrapper>
        <SearchForEvent
          searchForEvent={searchForEvent}
          setSearchID={setSearchID}
          searchLoading={searchLoading}
          fullHeight
        />
      </Wrapper>
    );
  else
    return (
      <Wrapper>
        <EventCardList>{eventCards}</EventCardList>
        <SearchForEvent
          searchForEvent={searchForEvent}
          setSearchID={setSearchID}
          searchLoading={searchLoading}
        />
      </Wrapper>
    );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LoadingDiv = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const EventCardList = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
const SearchWrapper = styled.div<{ fullHeight: boolean }>`
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "100px")};
  width: ${({ fullHeight }) => (fullHeight ? "100vw" : "auto")};
  margin-top: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const SearchInfo = styled.p`
  font-family: "SegoeUI";
  display: flex;
  flex-direction: column;
`;
const MiniSearchInfo = styled.p`
  font-family: "SegoeUI";
  color: grey;
  font-size: 14px;
`;
const SearchForm = styled.form`
  margin-top: 20px;
  display: flex;
  align-items: center;

  & > input[type="text"] {
    height: 28px;
    width: 230px;
    margin-right: 10px;
    padding: 5px;
    border: solid 1px grey;
    outline: none;
    box-shadow: 3px 3px 7px 1px grey;
    font-size: 1rem;
  }
  & > input[type="submit"] {
    padding: 11px;
    border: none;
    border-radius: 0px;
    color: white;
    background-color: rgb(0, 125, 200);
    box-shadow: 3px 3px 7px 1px grey;
    font-family: SegoeUI;
    font-size: 1rem;
    cursor: pointer;
    transition-duration: 0.2s;
  }
  & > input[type="submit"]:hover {
    box-shadow: 1px 1px 7px 1px grey;
    transition-duration: 0.2s;
  }
`;
