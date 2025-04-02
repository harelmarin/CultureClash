import { User } from '../types/userTypes';

const BASE_URL = 'http://localhost:3000';


export const getUserById = async (id:number): Promise<User | boolean> => {
    try {
        const user = await fetch(`{$BASE_URL}/user{$id}`, {
            method: 'GET',
            credentials: 'include'
        })
    } catch(error) {
        console.log(`Erreur récupération du joueur avec id : {$id}`)
    }

}
