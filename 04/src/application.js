// @ts-check
let state = {};

const handleAddList = (e) => {
    e.preventDefault();

    const { target } = e;
    const formData = new FormData(target);
    const title = formData.get("name");
    target.reset();
    
    if (title) {
        const id = String(state.lists.length + 1);
        state.lists.push({ id, title });
        render(state);
    }
};

const handleAddTask = (e) => {
    e.preventDefault();
    
    const { target } = e;
    const formData = new FormData(target);
    const title = formData.get("name");
    target.reset();

    if (title) {
        const id = String(state.lists.length + 1);
        state.tasks.push({ id, title, listId: state.currentListId });
        render(state);
    }
};

const handleSelectList = (e, listId) => {
    state.currentListId = listId;
    render(state);
};

const buildTasksHtml = (tasks) => {
    const li = tasks.reduce((acc, task) => {
        const { title } = task;
        return `${acc}<li>${title}</li>`;
    }, "");

    if (li) return `<ul>${li}</ul>`;

    return "";
};

const buildListHtml = (lists, currListId) => {
    const getCurrentLi = (body) => {
        const li = document.createElement("li");
        const b = document.createElement("b");
        const nodeText = document.createTextNode(body);
        b.appendChild(nodeText);
        li.appendChild(b);
        return li;
    };

    const getSimpleLi = (body, id) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        const aText = document.createTextNode(body);
        a.setAttribute("href", `#${body.toLowerCase()}`);
        a.appendChild(aText);
        li.appendChild(a);

        a.addEventListener("click", (e) => handleSelectList(e, id), false);

        return li;
    };

    const ul = document.createElement("ul");
    lists.forEach(list => {
        const { id, title } = list;
        const li = id === currListId 
            ? getCurrentLi(title) 
            : getSimpleLi(title, id);

        ul.appendChild(li);
    });

    return ul;
};

const render = (state) => {
    const { tasks, currentListId, lists } = state;

    const currTasks = tasks.filter(task => task.listId === currentListId);
    const tasksContainer = document.querySelector('[data-container="tasks"]');
    tasksContainer.innerHTML = buildTasksHtml(currTasks); 

    const listsContainer = document.querySelector('[data-container="lists"]');
    const ul = buildListHtml(lists, currentListId);
    listsContainer.innerHTML = "";
    listsContainer.appendChild(ul);
};

const app = () => {
    state = {
        currentListId: "1",
        lists:[
            {
                id: "1",
                title: "General"
            }
        ],
        tasks:[]
    };
    
    const inputList = document.querySelector('[data-container="new-list-form"]');
    inputList.addEventListener("submit", handleAddList, false);
    
    const inputTask = document.querySelector('[data-container="new-task-form"]');
    inputTask.addEventListener("submit", handleAddTask, false);
    
    render(state);
};
// app();
export default app;