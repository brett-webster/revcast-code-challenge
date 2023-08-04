import { reps, teams, salesOpps } from '../data'
import type { Representative, Team, SalesOpportunity } from '../data'

function asyncRequest(data: Representative[] | Team[] | SalesOpportunity[]): Promise<any[]> {
    const delay = Math.floor(Math.random() * (1500)) + 2000;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
}

export const fetchReps = async (): Promise<Representative[]> => {
    return await asyncRequest(reps)
}

export const fetchTeams = async (): Promise<Team[]> => {
    return await asyncRequest(teams)
}

export const fetchSalesOpps = async (): Promise<SalesOpportunity[]> => {
    return await asyncRequest(salesOpps)
}
