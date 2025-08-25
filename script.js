'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    const html = `      
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
        </div>
        <div class="movements__value">${mov}€</div>
      </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov));
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const sumIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.innerHTML = `${sumIn}€`;
  const sumOut = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.innerHTML = `${sumOut}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(dep => (dep * acc.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.innerHTML = `${interest}€`;
  console.log(acc.interestRate);
};

const createUsernames = accs => {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  //  Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', e => {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style = 'opacity:1';

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc.username &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
    // Clear input fields
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  console.log('log');
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);
      // Update UI
      updateUI(currentAccount);
    }, 5000);
  } else {
    alert('Insufficient funds');
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  console.log('delete');
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (currentAccount.username === username && currentAccount.pin === pin) {
    containerApp.style = 'opacity:0';
    labelWelcome.textContent = 'Log in to get started';
    // Clear input fields
    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
  const index = accounts.findIndex(
    currentAccount => currentAccount.username === username
  );
  accounts.splice(index, 1);
});
// Stage var
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  sorted === false
    ? displayMovements(currentAccount.movements, true)
    : displayMovements(currentAccount.movements, false);
  sorted = !sorted;
});

// console.log(accounts);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

// // SPLICE
// // console.log(arr.splice(2));
// // arr.splice(-1);
// // arr.splice(1, 2);
// // console.log(arr);

// //  REVERSE
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT
// const letters = arr.concat(arr2);
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join(' - '));

// // PUSH , SHIFT , UNSHIFT , POP , INCLUDES , INDEXOF , LASTINDEXOF . FINDINDEX  , FINDLASTINDEXOF, FIND

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // getting last array element
// console.log(arr[arr.length - 1]);
// // console.log(...arr.slice(-1));
// // console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
// console.log(arr.at(-2));

// console.log('Ado'.at(0));
// console.log('Ado'.at(-1));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('---- FOREACH ----');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
//   // console.log(arr);
// });

// // MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // SET
// const currenciesUnique = new Set(['USD', 'EUR', 'GBP']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${_}: ${value}`);
// });

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2, 2);
//   const allDogs = dogsJuliaCorrected.concat(dogsKate);
//   console.log(allDogs);
//   allDogs.forEach(function (Age, i) {
//     const dog = `Dog number ${i + 1} is ${
//       Age >= 3 ? 'an adult' : 'still a puppy 🐶'
//     }`;
//     console.log(dog);
//   });
// };
// let dogsJulia = [3, 5, 2, 12, 7];
// let dogsKate = [4, 1, 15, 8, 3];
// checkDogs(dogsJulia, dogsKate);

// const euroToUSD = 11;
// const movementsUSD = movements.map(mov => (mov * euroToUSD) / 10);
// console.log(movementsUSD);
// console.log(movements);

// const movementsUSDFor = [];
// for (const mov of movements) movementsUSDFor.push((mov * euroToUSD) / 10);

// console.log(movementsUSDFor);

// const movementsDiscription = movements.map((mov, i) => {
//   const type = mov > 0 ? `deposit` : `withdrawal`;
//   return `Movement ${i + 1} : ${type} of ${Math.abs(mov)} euros`;
// });

// console.log(movementsDiscription);

// const deposits = movements.filter(function (mov, i, arr) {
//   return mov > 0;
// });
// console.log(deposits);
// const depositsFor = [];
// for (const mov of movements) {
//   mov > 0 ? depositsFor.push(mov) : null;
// }
// console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov < 0).map(mov => Math.abs(mov));
// console.log(withdrawals);

// accumulator -> SNOWBALL
// const balance = movements.reduce((acc, cur, i, arr) => {
//   console.log(`Itteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// let sum = 0;
// for (const [i, cur] of movements.entries()) {
//   console.log(`Itteration ${i}: ${sum}`);
//   sum += cur;
// }
// console.log(sum);

// let sumFor = 0;
// const balanceFor = movements.forEach((mov, i, array) => {
//   console.log(`Itteration ${i}: ${sumFor}`);
//   return (sumFor += mov);
// });
// console.log(balanceFor);

// // Maximum value
// const max = movements.reduce(
//   (acc, mov, i) => (acc = acc < mov ? mov : acc),
//   movements[0]
// );
// console.log(max);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const calcAverageHumanAge = ages => {
//   const humanAges = ages.map(age => (age >= 2 ? 16 + age * 4 : 2 * age));
//   console.log(humanAges);
//   const adultDogs = humanAges.filter(age => age >= 18);
//   console.log(adultDogs);
//   // const average = Math.round(
//   //   adultDogs.reduce((acc, age) => acc + age, 0) / adultDogs.length
//   // );
//   const average = Math.round(
//     adultDogs.reduce((acc, age, i, arr) => acc + age / arr.length, 0)
//   );
//   console.log(average);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// const euroToUSD = 11;

// PIPELINE
// const totalDepositsUSD = movements
//   .filter((mov, i) => mov > 0)
//   .map((mov, i, arr) => {
//     // console.log(arr);
//     return (mov * euroToUSD) / 10;
//   })
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

// const totalWithdrawalsUSD = Math.abs(
//   movements
//     .filter(mov => mov < 0)
//     .map(mov => mov * euroToUSD)
//     .reduce((acc, mov) => acc + mov, 0)
// );
// console.log(totalWithdrawalsUSD);

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, avg, i, arr) => acc + avg / arr.length, 0);

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// console.log(avg1);

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// // console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(account);

// let firstDeposit;
// for (const dep of movements) {
//   if (dep > 0) {
//     firstDeposit = dep;
//     break;
//   } else {
//     continue;
//   }
// }
// console.log(firstDeposit);

// console.log(movements);
// const lastWithdrawal = movements.findLast(mov => mov < 0);

// console.log(lastWithdrawal);
// const lastLargeMovIndex = movements.findLastIndex(mov => mov >= Math.abs(2000));
// const str = `Your latest larg movement was ${
//   movements[lastLargeMovIndex]
// } was ${movements.length - lastLargeMovIndex} movements ago`;
// console.log(str);

// console.log(movements);

// // EQUALITY
// console.log(movements.includes(-130));

// // SOME: CONDITION
// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(deposits);

// // EVERY: CONDITION
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Seperate callback
// const deposit = mov => mov >= 0;

// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 9];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [[4, 5], 6], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// // flat
// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 1);
// console.log(overallBalance);

// // flatMap
// const overallBalance = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 1);
// console.log(overallBalance);

// ///////////////////////////////////////
// // Coding Challenge #4

// /*
// This time, Julia and Kate are studying the activity levels of different dog breeds.

// YOUR TASKS:
// 1. Store the the average weight of a "Husky" in a variable "huskyWeight"
// 2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
// 3. Create an array "allActivities" of all the activities of all the dog breeds
// 4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
// 5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
// 6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
// 7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

// BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

// TEST DATA:
// */

// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];

// // 1 . Store the the average weight of a "Husky" in a variable "huskyWeight
// const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;
// console.log(huskyWeight);

// // 2 . Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
// const dogBothActivities = breeds.find(
//   breeds =>
//     breeds.activities.includes('swimming') &&
//     breeds.activities.includes('fetch')
// ).breed;
// console.log(dogBothActivities);

// // 3. Create an array "allActivities" of all the activities of all the dog breeds
// const allActivities = breeds.flatMap(breed => breed.activities);
// console.log(allActivities);

// // 4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
// const uniqueActivities = [...new Set(allActivities)];
// console.log(uniqueActivities);

// // 5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
// const swimmingAdjacent = [
//   ...new Set(
//     breeds
//       .filter(breed => breed.activities.includes('swimming'))
//       .flatMap(breed => breed.activities)
//       .filter(activity => activity !== 'swimming')
//   ),
// ];
// console.log(swimmingAdjacent);

// // 6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
// const allBreedsWeight = breeds.every(breed => breed.averageWeight >= 10);
// console.log(allBreedsWeight);

// // 7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".
// const activeBreeds = breeds.some(breed => breed.activities.length >= 3);
// console.log(activeBreeds);

// // Bonus
// const heaviestBreadThatLikesToFetch = breeds
//   .filter(breed => breed.activities.includes('fetch'))
//   .reduce(
//     (acc, breed, _, arr) =>
//       (acc = acc.averageWeight > breed.averageWeight ? acc : breed),
//     breeds[0]
//   ).breed;
// console.log(heaviestBreadThatLikesToFetch);

// // Strings
// const owners = ['jonas', 'zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// // Numbers
// console.log(movements);
// console.log(movements.sort());
// // Return < 0, A, B (keep order)
// // Return > 0, B, A (swap order)

// // const sortedMovements = movements.sort((a, b) => {
// //   if (a > b) {
// //     return 1;
// //   } else {
// //     return -1;
// //   }
// // });
// const sortedMovements = movements.sort((a, b) => a - b);
// console.log(sortedMovements);
// // const sortedMovements2 = movements.sort((a, b) => {
// //   if (a > b) {
// //     return -1;
// //   } else {
// //     return -1;
// //   }
// // });
// const sortedMovements2 = movements.sort((a, b) => b - a);
// console.log(sortedMovements2);
