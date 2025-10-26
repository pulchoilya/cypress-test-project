const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');

const expenseCar = {
  carId: 2,
  reportedAt: `${year}-${month}-${day}`,
  mileage: 20000,
  liters: 80,
  totalCost: 9000,
  forceMileage: false,
};

export default expenseCar;
