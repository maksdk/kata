export default () => {
   const state = {
      menu: {
         currentHeaderId: 'list-home-list',
         previousHeaderId: null,
         currentTabPaneId: 'list-home',
         previousTabPaneId: null,
      },
   };

   watch(state, 'menu', () => {
      if (state.menu.currentHeaderId === state.menu.previousHeaderId) {
         return;
      }
      const currentBodyEl = document.getElementById(state.menu.currentTabPaneId);
      currentBodyEl.classList.add('active', 'show');
      const prevousBodyEl = document.getElementById(state.menu.previousTabPaneId);
      prevousBodyEl.classList.remove('active', 'show');

      const currentHeaderEl = document.getElementById(state.menu.currentHeaderId);
      currentHeaderEl.classList.add('active');
      const prevousHeaderEl = document.getElementById(state.menu.previousHeaderId);
      prevousHeaderEl.classList.remove('active');
   });

   const elements = document.querySelectorAll('[data-toggle="list"]');
   elements.forEach((element) => {
      element.addEventListener('click', (e) => {
         state.menu = {
            previousTabPaneId: state.menu.currentTabPaneId,
            currentTabPaneId: e.target.hash.slice(1),
            previousHeaderId: state.menu.currentHeaderId,
            currentHeaderId: e.target.id,
         };
      });
   });
};