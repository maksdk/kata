// @ts-check
/* eslint-disable no-param-reassign */

// BEGIN (write your solution here)
function getForm(type) {
    return [...document.forms].find(form => {
      const { elements } = form;
      if (elements[type]) return true;
      return false;
    });
  }
  
  function setTargetEventByName(name, event, cb) {
    const target = document.querySelector(`[data-editable-target=${name}]`);
    target.addEventListener(event, cb, false);
  }
  
  const render = (state) => {
    const { currentTarget } = state;
  
    if (state[currentTarget].state === "focus") {
      const { currentValue } = state[currentTarget];
      const template = `<form><input type=text name=${currentTarget} value=${currentValue}><input type=submit value=Save></form>`;
  
      const target = document.querySelector(`[data-editable-target=${currentTarget}]`);
      target.innerHTML = template;
    }
  
    if (state[currentTarget].state === "submit") {
      const { currentValue, defaultValue } = state[currentTarget];
      const html = currentValue 
        ? `${currentValue}`
        : `<i>${defaultValue}</i>`;
  
      const target = document.querySelector(`[data-editable-target=${currentTarget}]`);
      target.innerHTML = html;
    }
  };
  
  const app = () => {
    const state = { 
      currentTarget: null,
      name: {
        state: "idle",
        defaultValue: "name",
        currentValue: ""
      },
      email: {
        state: "idle",
        defaultValue: "email",
        currentValue: ""
      }
    };
  
    const handleOnSubmit = (event, targetType) => {
      const input = document.querySelector(`input[name=${targetType}]`);
      const value = input.getAttribute("value");
  
      state.currentTarget = targetType;
      state[targetType].state = "submit";
      state[targetType].currentValue = value;
  
      setTargetEventByName(targetType, "click", handleOnClick);
      
      render(state);
  
      event.preventDefault();
    };
      
    const handleOnClick = (e) => {
      const { currentTarget } = e;
      const currentTargetType = currentTarget.getAttribute("data-editable-target");
  
      state[currentTargetType].state = "focus";
      state.currentTarget = currentTargetType;
  
      render(state);
      
      const form = getForm(currentTargetType);
      if (form) {
        const input = document.querySelector(`input[name=${currentTargetType}]`);
        //@ts-ignore
        input.focus();
        //@ts-ignore
        input.select();
  
        form.addEventListener("submit", (e) => handleOnSubmit(e, currentTargetType), false);
      }
  
      currentTarget.removeEventListener("click", handleOnClick);
    };
  
    ["name", "email"]
      .forEach(name => 
        setTargetEventByName(name, "click", handleOnClick)
      );
  };
  
  export default app;
  // END
  