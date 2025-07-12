import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';
import { User, Group } from '../types';
import { CreateGroupBody } from '../api';
import { groups, user } from './data';

export const authHandlers = [
    http.post<PathParams, DefaultBodyType, User>('/auth/signin', () => {
        return HttpResponse.json(user)
    })
];

export const groupHandlers = [
    http.get<PathParams, DefaultBodyType, Group[]>('/groups', () => {
        return HttpResponse.json(groups);
    }),
    http.post<PathParams, CreateGroupBody, Group>('/groups', async ({ request }) => {
        const reqBody = await request.json();
        const newGroup: Group = {
            id: 1,
            name: reqBody.name,
            subject: reqBody.subject,
            location: reqBody.location,
            time: new Date(),
            maxUsers: reqBody.maxUsers || 10,
            notes: reqBody.notes,
            admin: user,
            joinsGroups: [],
        }

        groups.push(newGroup);
        return HttpResponse.json(newGroup, { status: 201 });
    })
];