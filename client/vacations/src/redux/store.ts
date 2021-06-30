import { createStore } from "redux";

import { appState } from "./app-state";
import { reduce } from "./reducer";


export const store = createStore(reduce, new appState());
