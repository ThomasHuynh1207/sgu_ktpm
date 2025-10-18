export const getAllProducts = (req, res) => {
  res.json([
    { id: 1, name: "Laptop Asus", price: 25000000 },
    { id: 2, name: "PC Gaming MSI", price: 32000000 },
  ]);
};
