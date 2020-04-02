const duplicateValues = (items) => items.map((item) => [item, item]).flat();

const enlargeArrayImage = (items) => {
  const horizontallyStretched = items.map(duplicateValues);
  return duplicateValues(horizontallyStretched);
};

export default enlargeArrayImage;