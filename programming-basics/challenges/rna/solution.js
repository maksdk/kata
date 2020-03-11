const mapTransions = {
  "G": "C",
  "C": "G",
  "T": "A",
  "A": "U"
};

export default (dnaStr) => {
  if (dnaStr.length === 0) return "";

  const acc = [];

  for (const dna of dnaStr) {
    const rna = mapTransions[dna];
    if (!rna) return null;
    acc.push(rna);
  }

  return acc.join("");
};