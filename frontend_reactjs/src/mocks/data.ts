import { User, Group } from '../types';

export const user: User = {
    id: 1,
    name: 'John Doe',
    email: 'jdoe@hotmail.com',
    token: 'fake-jwt-token'
};

export const groups: Group[] = [{
    id: 1,
    name: 'Group 1',
    subject: 'Subject 1',
    location: 'Location 1',
    time: new Date(),
    maxUsers: 10,
    notes: 'Notes for Group 1',
    admin: user,
    joinsGroups: []
}];