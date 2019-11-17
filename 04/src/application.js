//@ts-check
import { watch } from 'melanke-watchjs';

const initialState = {
   "home": { active: false },
   "profile": { active: false},
   "messages": { active: false},
   "settings": { active: false}
};

export default () => {
   const state = {
      elems: {...initialState, home: { active: true }}
   };

   const listTab = document.querySelector("#list-tab");
   const tabs = [...listTab.children];

   const viewTabs = document.querySelector("#nav-tabContent");
   const views = [...viewTabs.children];
   
   const render = (state) => {
      const { elems } = state;
      
      Object.keys(elems)
         .forEach(key => {
            const { active } = elems[key];
            
            const tab = tabs.find(elem =>  elem.id.includes(key));
            
            if (tab) {
               const activeTabClass = active ? "active" : "";
               tab.classList.remove("active");
               activeTabClass && tab.classList.add(activeTabClass);
            }

            const view = views.find(elem => elem.id.includes(key));
            
            if (view) {
               const activeViewClass = active ? ["active", "show"] : "";
               view.classList.remove("active", "show");
               activeViewClass && view.classList.add(...activeViewClass);
            }
         });
   };
      
   tabs.forEach(child => {
      child.addEventListener("click", (event) => {
         const { target } = event;
         const { id } = target;
         const childName = id.split("-")[1];
         state.elems = { ...initialState, [childName]: { active: true }};
      });
   });

   watch(state, 'elems', () => render(state));

   render(state);
}