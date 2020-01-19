// @ts-check

import _ from "lodash";
import i18next from 'i18next';
import { watch } from 'melanke-watchjs';
import resources from './locales';

// BEGIN (write your solution here)
//asc - прямой
//desc - обратный
//unsorted - несортированый
const render = (state) => {
    const { sortBy, sortOrder, list } = state;

    const container = document.querySelector(".container");
    container.addEventListener("click", () => console.log("click"));
    
    const table = document.createElement("table");
    container.appendChild(table);
    
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    const tr = document.createElement("tr");
    tbody.appendChild(tr);

    const th = document.createElement("th");
    tr.appendChild(th);

    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.appendChild(document.createTextNode("Name"));
    th.appendChild(a);
};

const sortOptionsByKey = (options, key="name", sortOrder="asc") => {
    //@ts-ignore
    return _.orderBy(options, [key], sortOrder);
};

const app = () => {
    const localOptions = Object.entries(window.location)
        .reduce((acc, [name, value]) => {
            if (!value || _.isObject(value)) return acc;
            return [...acc, { name, value }];
        }, []);

    const sortBy = "name";
    const sortOrder = "asc";
    const list = sortOptionsByKey(localOptions, sortBy, sortOrder);

    const state = { sortBy, sortOrder, list };
    
    render(state);
};
app();
export default app;
// END
