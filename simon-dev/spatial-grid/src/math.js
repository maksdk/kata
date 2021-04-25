const math = {
    sat: (x) => Math.min(Math.max(x, 0), 1),
    randRange: (a, b) => Math.random() * (b - a) + a
  };
  
  export default math;
  