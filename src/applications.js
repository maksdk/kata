//@ts-check
const notebooks = [
   {
      model: 'v1',
      processor: 'intel',
      frequency: 1.7,
      memory: 16,
   },
   {
      model: 'd3',
      processor: 'intel',
      frequency: 3.5,
      memory: 8,
   },
   {
      model: 'd2',
      processor: 'amd',
      frequency: 2.5,
      memory: 16,
   }
];

const app = () => {
   let state = {
      list: notebooks.map(elem => elem)
   };

   const frequencyMinInput = [...document.querySelectorAll("input")];
   const selects = [...document.querySelectorAll("select")];
   const resultContainer = document.querySelector(".result");

   const mapFiltersValues = {};

   const mapFilters = {
      "frequency_gt": (value, list) => {
         value = Number(value);
         if (value === "") return list;
         return list.filter(({
            frequency
         }) => frequency >= value);
      },
      "frequency_lt": (value, list) => {
         value = Number(value);
         if (value === "") return list;
         return list.filter(({
            frequency
         }) => frequency <= value);
      },
      "processor_eq": (value, list) => {
         value = String(value);
         if (value === "") return list;
         return list.filter(({
            processor
         }) => processor === value);
      },
      "memory_eq": (value, list) => {
         value = Number(value);
         if (value === "") return list;
         return list.filter(({
            memory
         }) => memory === value);
      }
   };

   const updateState = () => {
      debugger;
      const objects = Object.keys(mapFiltersValues)
         .map((key) => {
            const list = mapFilters[key](mapFiltersValues[key], notebooks);
            return list;
         })
      const objects2 =    objects.reduce((acc, list) => {
         if (acc.length === 0) return list;

         const result = acc.filter( obj1 => 
            // list.find( obj2 => JSON.stringify(obj1) === JSON.stringify(obj2))
            list.find( obj2 => _.isEqual(obj1, obj2))
         );
            
         return result;
      }, []);

      state = {
         ...state,
         list: objects2
      };
   };

   const render = (state) => {
      while (resultContainer.firstChild) {
         resultContainer.removeChild(resultContainer.firstChild);
      }

      const {
         list
      } = state;

      if (list.length === 0) return;

      const ui = document.createElement("ui");

      list.forEach( props => {
         const { model } = props;

         const li = document.createElement("li");
         const textnode = document.createTextNode(model);
 
         li.appendChild(textnode);
         ui.appendChild(li);
      });

      resultContainer.appendChild(ui);
   };

   frequencyMinInput.forEach(input => {
      input.addEventListener("input", (event) => {
         const {
            target
         } = event;
         //@ts-ignore
         const {
            name: nameTarget,
            value
         } = target;

         mapFiltersValues[nameTarget] = value;

         updateState();
         render(state);
      });
   });

   selects.forEach(select => {
      select.addEventListener("change", (event) => {
         const {
            target
         } = event;
         //@ts-ignore
         const {
            name: nameTarget,
            value
         } = target;

         mapFiltersValues[nameTarget] = value;

         updateState();
         render(state);
      });
   });

   render(state);
};
app();
// END