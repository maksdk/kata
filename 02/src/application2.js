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
   }
];

const predicates = {
   eq: (value) => (el) => String(el) === String(value),
   gt: (value) => (el) => (el) >= Number(value),
   lt: (value) => (el) => (el) <= Number(value),
};

const filterItems = (query, items) => {
   const fields = Object.keys(query);
   const activeFields = fields.filter((field) => query[field]);
   const result = activeFields.reduce((acc, field) => {
      const [name, predicateName] = field.split('_');
      const match = predicates[predicateName];
      return acc.filter((item) => match(query[field])(item[name]));
   }, items);
   return result;
};

const render = (state) => {
   const resultElement = document.querySelector('.result');
   const filteredNotebooks = filterItems(state.filter, notebooks);
   if (filteredNotebooks.length === 0) {
      resultElement.innerHTML = '';
      return;
   }
   const html = `<ul>${filteredNotebooks.map((n) => `<li>${n.model}</li>`).join('')}</ul>`;
   resultElement.innerHTML = html;
};

export default () => {
   const state = {
      filter: {
         processor_eq: null,
         memory_eq: null,
         frequency_gt: null,
         frequency_lt: null,
      },
   };

   const items = [{
         name: 'processor_eq',
         eventType: 'change'
      },
      {
         name: 'memory_eq',
         eventType: 'change'
      },
      {
         name: 'frequency_gt',
         eventType: 'input'
      },
      {
         name: 'frequency_lt',
         eventType: 'input'
      },
   ];
   items.forEach(({
      name,
      eventType
   }) => {
      const element = document.querySelector(`[name="${name}"]`);
      element.addEventListener(eventType, ({
         target
      }) => {
         state.filter[target.name] = target.value === '' ? null : target.value;
         render(state);
      });
   });
   render(state);
};