// @ts-check
const state = {
    currentListId: "1",
    lists:[
        {
            id: "1",
            title: "General"
        }
    ],
    tasks:[]
};

const handleAddList = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get("name");

    if (title) {
        const id = String(state.lists.length + 1);
        //@ts-ignore
        state.lists.push({ id, title });

        render(state);
    }
};

const handleAddTask = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get("name");

    if (title) {
        const id = String(state.lists.length + 1);
        //@ts-ignore
        state.tasks.push({ id, title, listId: state.currentListId });

        render(state);
    }
};

const buildTasksHtml = (tasks) => {
    const li = tasks.reduce((acc, task) => {
        const { title } = task;
        return `${acc}<li>${title}</li>`;
    }, "");

    if (li) return `<ul>${li}</ul>`;

    return "";
};

const buildListsHtml = (lists, currListId) => {
    const getCurrentLi = (body) => `<li><b>${body}</b></li>`;
    const getSimpleLi = (body) => `<li><a href="#${body.toLowerCase()}">${body}</a></li>`;

    const li = lists.reduce( (acc, list) => {
        const { id, title } = list;
        const li = id === currListId 
            ? getCurrentLi(title) 
            : getSimpleLi(title);

        return `${acc}${li}`;
    }, "");

    if (li) return `<ul>${li}</ul>`;

    return "";
};

const render = (state) => {
    const { tasks, currentListId, lists } = state;

    const currTasks = tasks.filter(task => task.listId === currentListId);
    const tasksContainer = document.querySelector('[data-container="tasks"]');
    tasksContainer.innerHTML = buildTasksHtml(currTasks); 

    const listsContainer = document.querySelector('[data-container="lists"]');;
    listsContainer.innerHTML = buildListsHtml(lists, currentListId);
};

const app = () => {
    const inputList = document.querySelector('[data-container="new-list-form"]');
    inputList.addEventListener("submit", handleAddList, false);

    const inputTask = document.querySelector('[data-container="new-task-form"]');
    inputTask.addEventListener("submit", handleAddTask, false);

    render(state);
};

app();
// END