//@ts-check
const notebooks = [{
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
   },
];

const app = () => {
   
   const resultContainer = document.querySelector(".result");
   const render = (state) => {
      while (resultContainer.firstChild) {
         resultContainer.removeChild(resultContainer.firstChild);
      }
      
      const { list } = state;
      
      if (list.lenght === 0) return;
      
      const ui = document.createElement("ui");
      
      list.forEach(function({model: text}) {
         const li = document.createElement("ui");
         const textnode = document.createTextNode(text);
         li.appendChild(textnode);
         ui.appendChild(li);
      });
      
      resultContainer.appendChild(ui);
   };
   
   let state = { list: notebooks.map(elem => elem) };
   
   const frequencyMinInput = [...document.querySelectorAll("input")];
   const selects = [...document.querySelectorAll("select")];

   const mapFilters = {
      "frequency_gt": (value, list) => {
         value = Number(value);
         if (value === "" ) return list;
         return list.filter(({ frequency }) => frequency >= value);
      },
      "frequency_lt": (value, list) => {
         value = Number(value);
         if (value === "" ) return list;
         return list.filter(({ frequency }) => frequency <= value);
      },
      "processor_eq": (value, list) => {
         value = String(value);
         if (value === "" ) return list;
         return list.filter(({ processor }) => processor === value);
      },
      "memory_eq": (value, list) => {
         value = Number(value);
         if (value === "" ) return list;
         return list.filter(({ memory }) => memory === value);
      }
   };


   frequencyMinInput.forEach(input => {
      input.addEventListener("input", (event) => {
         const { target } = event;
         //@ts-ignore
         const { name: nameTarget, value } = target;
         const list = mapFilters[nameTarget](value, state.list);
         state = { ...state, list };

        render(state);
      });
   });

   selects.forEach(select => {
      select.addEventListener("change", (event) => {
        const { target } = event;
        //@ts-ignore
        const { name: nameTarget, value } = target;
        const list = mapFilters[nameTarget](value, state.list);
        debugger;
        state = { ...state, list };

        render(state);
      });
   });

   render(state);
};

// END