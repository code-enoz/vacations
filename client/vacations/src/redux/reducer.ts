import { appState} from "./app-state";
import { ActionType } from "./action-type"
import { Action } from "./action"
import socketIOClient from 'socket.io-client'

export function reduce(oldAppState: appState, action: Action) : appState
{ 

const newStore = {...oldAppState}
switch(action.type) {
    case ActionType.updateIsUserLoggedIn: 
    newStore.isUserLoggedIn = !newStore.isUserLoggedIn
    break;

    case ActionType.updateIsAdminLoggedIn:
    newStore.isAdminLoggedIn = !newStore.isAdminLoggedIn
    break;

    case ActionType.connectToSocket:
        newStore.socket = socketIOClient('http://localhost:3002/', { query: "token=" + action.payload.authToken }).connect();
    break
} 
return newStore
}