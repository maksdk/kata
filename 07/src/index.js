// @ts-check

import _ from "lodash";
import i18next from 'i18next';
import { watch } from 'melanke-watchjs';
import resources from './locales';

// BEGIN (write your solution here)
//asc - прямой
//desc - обратный
//unsorted - несортированый
const mapBodies = {
    "name": (sortBy, sortOrder) => {
        if (sortBy !== "name") return "Name (Unsorted)";
        if (sortOrder === "asc") return "Name (Asc)";
        if (sortOrder === "desc") return "Name (Desc)";
        return "";
    },
    "value": (sortBy, sortOrder) => {
        if (sortBy !== "value") return "Value (Unsorted)";
        if (sortOrder === "asc") return "Value (Asc)";
        if (sortOrder === "desc") return "Value (Desc)";
        return "";
    }
};

const buildRowHead = (body) => {
    const tr = document.createElement("tr");

    const th = document.createElement("th");
    tr.appendChild(th);

    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.appendChild(document.createTextNode(body));
    th.appendChild(a);
    return tr;
};

const render = (state, container, handleClick) => {
    const { sortBy, sortOrder, list } = state;

    const table = document.createElement("table");
    table.setAttribute("class", "table");
    container.appendChild(table);
    
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    const headName = buildRowHead(mapBodies["name"](sortBy, sortOrder));
    headName.addEventListener("click", (e) => handleClick(e, "name"), false);
    tbody.appendChild(headName);
    
    const headValue = buildRowHead(mapBodies["value"](sortBy, sortOrder));
    headValue.addEventListener("click", (e) => handleClick(e, "value"), false);
    tbody.appendChild(headValue);

    list.forEach(l => {
        const { name, value } = l;

        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.appendChild(document.createTextNode(name));
        tr.appendChild(tdName);

        const tdValue = document.createElement("td");
        tdValue.appendChild(document.createTextNode(value));
        tr.appendChild(tdValue);

        tbody.appendChild(tr);
    });
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

    const state = { 
        sortBy, 
        sortOrder, 
        list 
    };

    const container = document.querySelector(".container");
    
    render(state, container, (e, currType) => {
        e && e.preventDefault();
        
        if (state.sortBy === currType) {
            state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
        }
        else {
            state.sortOrder = "asc";
        }
    
        state.sortBy = currType;
        state.list = sortOptionsByKey(localOptions, state.sortBy, state.sortOrder);

        // render(state, container);
    });
};
app();
export default app;
// END
