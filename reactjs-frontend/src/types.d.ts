export interface Attendee {
  id: string;
  username: string;
}

export interface EventItem {
  name: string;
  available: boolean;
}

export interface Event {
  _id: string;
  title: string;
  eventLocation: string;
  dateTime: Date;
  description: string;
  attendees: Attendee[];
  items: EventItem[];
  image: string;
  creatorID: string;
}
