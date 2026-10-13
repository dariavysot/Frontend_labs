"use strict";
/* ==========================================================================
   Лабораторна робота №3: ОСНОВИ, ФУНКЦІОНАЛЬНЕ ТА ОБ’ЄКТНО-ОРІЄНТОВАНЕ
   ПРОГРАМУВАННЯ МОВОЮ JAVASCRIPT (Варіант 1)
   Завдання 1: масиви та функції. Завдання 2: класи, об'єкт Date та методи.
   ========================================================================== */

const assert = require("node:assert/strict");

// ======================= ЗАВДАННЯ 1. ТОВАРИ =======================

// price1 і price2 — попередні (недіючі) ціни; price3 — чинна ціна.
const products = [
  { article: "UA1001", id: 101, name: "Ноутбук", country: "Україна", price1: 30000, price2: 28000, price3: 26000, stock: 5 },
  { article: "DE1002", id: 102, name: "Навушники", country: "Німеччина", price1: 3200, price2: 3500, price3: 3900, stock: 18 },
  { article: "PL1003", id: 103, name: "Мишка", country: "Польща", price1: 800, price2: 700, price3: 850, stock: 24 },
  { article: "UA1004", id: 104, name: "Клавіатура", country: "Україна", price1: 1500, price2: 1500, price3: 1400, stock: 12 },
  { article: "DE1005", id: 105, name: "Монітор", country: "Німеччина", price1: 9000, price2: 8500, price3: 8000, stock: 7 },
  { article: "PL1006", id: 106, name: "Вебкамера", country: "Польща", price1: 2100, price2: 2300, price3: 2600, stock: 9 },
  { article: "FR1007", id: 107, name: "Лампа", country: "Франція", price1: 1200, price2: 1400, price3: 1300, stock: 16 },
  { article: "UA1008", id: 108, name: "Колонка", country: "Україна", price1: 4000, price2: 4300, price3: 4700, stock: 11 },
  { article: "FR1009", id: 109, name: "Зарядний пристрій", country: "Франція", price1: 1800, price2: 1600, price3: 1450, stock: 20 },
  { article: "DE1010", id: 110, name: "Роутер", country: "Німеччина", price1: 2700, price2: 2500, price3: 2400, stock: 6 },
];

const compareUkrainian = (a, b) => a.localeCompare(b, "uk");

// 1.1. Сортування за країною та середня ЧИННА ціна в кожній країні.
function analyzeProductsByCountry(items) {
  const sorted = [...items].sort((a, b) => compareUkrainian(a.country, b.country));
  const groups = new Map();

  for (const product of sorted) {
    const group = groups.get(product.country) ?? { sum: 0, count: 0 };
    group.sum += product.price3;
    group.count += 1;
    groups.set(product.country, group);
  }

  const averages = [...groups].map(([country, { sum, count }]) => ({
    country,
    count,
    averageCurrentPrice: sum / count,
  }));
  return { sorted, averages };
}

// 1.2. Товар із мінімальною другою (недіючою) ціною.
function findLowestSecondPrice(items) {
  return items.reduce(
    (lowest, product) => (lowest === null || product.price2 < lowest.price2 ? product : lowest),
    null
  );
}

const productFields = ["article", "id", "name", "country", "price1", "price2", "price3", "stock"];

function hasCompleteProductInfo(product) {
  if (product === null || typeof product !== "object") return false;
  return productFields.every((field) => {
    const value = product[field];
    return (
      value !== undefined &&
      value !== null &&
      !(typeof value === "string" && value.trim() === "") &&
      !(typeof value === "number" && !Number.isFinite(value))
    );
  });
}

// 1.3. Повний запис — на початок; запис з відсутнім полем — у кінець.
// Значення 0 (наприклад, нуль на складі) є наявною інформацією.
function addProduct(items, product) {
  const result = [...items];
  if (hasCompleteProductInfo(product)) {
    result.unshift(product);
  } else {
    result.push(product);
  }
  return result;
}

// 1.4. «Стабільно» означає строго спадну / строго зростаючу послідовність.
// Рівні сусідні ціни належать до класу «не стабільні зміни».
function getPriceDynamics(items) {
  return items.map(({ id, name, price1, price2, price3 }) => {
    let dynamics = "не стабільні зміни";
    if (price1 > price2 && price2 > price3) {
      dynamics = "стабільно дешевшає";
    } else if (price1 < price2 && price2 < price3) {
      dynamics = "стабільно дорожчає";
    }
    return { id, name, price1, price2, price3, dynamics };
  });
}

// ===================== ЗАВДАННЯ 2. КОРИСТУВАЧІ =====================

class User {
  constructor(surname, firstName, age, education, purpose, dateStr, timeStr) {
    this.surname = surname;
    this.firstName = firstName;
    this.age = age;
    this.education = education;
    this.purpose = purpose;
    // Використання вбудованого класу Date для дати й часу звернення
    this.registrationDate = new Date(`${dateStr}T${timeStr}:00`);
  }

  get fullName() {
    return `${this.surname} ${this.firstName}`;
  }

  get dateString() {
    const year = this.registrationDate.getFullYear();
    const month = String(this.registrationDate.getMonth() + 1).padStart(2, "0");
    const day = String(this.registrationDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  get timeString() {
    const hours = String(this.registrationDate.getHours()).padStart(2, "0");
    const minutes = String(this.registrationDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Робочий інтервал за методичкою (з 09:00 до 18:00): 09:00 включно, 18:00 вже поза межами
  isDuringWorkHours() {
    const hours = this.registrationDate.getHours();
    const minutes = this.registrationDate.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes >= 9 * 60 && totalMinutes < 18 * 60;
  }

  get category() {
    if (this.isDuringWorkHours() && this.purpose === "претензія") {
      return "Звернулись з претензією у робочий час";
    }
    if (this.isDuringWorkHours() && this.purpose === "побажання") {
      return "Звернулись з побажанням у робочий час";
    }
    return "Інші";
  }
}

class UserRegistry {
  constructor(users) {
    this.users = [...users];
  }

  // 2.1. Заданий рік, номер місяця (1–12) та точний час у форматі "ГГ:ХХ" через методи Date.
  findByMonthAndTime(year, monthNumber, targetTime) {
    return this.users.filter((user) => {
      const d = user.registrationDate;
      const matchesYear = d.getFullYear() === year;
      const matchesMonth = d.getMonth() + 1 === monthNumber;
      return matchesYear && matchesMonth && user.timeString === targetTime;
    });
  }

  // 2.2. Повертає середній вік і всіх користувачів, вік яких із ним збігається.
  getAverageAgeAndEducationMatches() {
    if (this.users.length === 0) return { averageAge: null, matches: [] };
    const averageAge = this.users.reduce((sum, user) => sum + user.age, 0) / this.users.length;
    const matches = this.users
      .filter((user) => user.age === averageAge)
      .map((user) => ({
        surname: user.surname,
        firstName: user.firstName,
        age: user.age,
        education: user.education,
      }));
    return { averageAge, matches };
  }

  // 2.3. Кількість користувачів у кожному з трьох класів.
  countCategories() {
    const counts = {
      "Звернулись з претензією у робочий час": 0,
      "Звернулись з побажанням у робочий час": 0,
      Інші: 0,
    };
    this.users.forEach((user) => {
      counts[user.category] += 1;
    });
    return counts;
  }

  // 2.4. Сортування: за спаданням віку та за алфавітом (без мутації оригінального списку).
  sortByAgeDescending() {
    return [...this.users].sort(
      (a, b) => b.age - a.age || compareUkrainian(a.fullName, b.fullName)
    );
  }

  sortAlphabetically() {
    return [...this.users].sort((a, b) => compareUkrainian(a.fullName, b.fullName));
  }
}

const registry = new UserRegistry([
  new User("Петренко", "Анна", 20, "середня", "претензія", "2026-09-03", "09:00"),
  new User("Іваненко", "Богдан", 22, "бакалавр", "побажання", "2026-09-03", "10:30"),
  new User("Шевченко", "Віра", 24, "магістр", "запитання", "2026-09-05", "10:30"),
  new User("Коваль", "Ганна", 26, "фахова передвища", "претензія", "2026-09-06", "17:59"),
  new User("Бондаренко", "Дмитро", 28, "бакалавр", "побажання", "2026-09-07", "18:00"),
  new User("Мельник", "Єва", 30, "магістр", "претензія", "2026-09-08", "12:15"),
  new User("Ткаченко", "Жанна", 32, "бакалавр", "побажання", "2026-08-09", "11:00"),
  new User("Олійник", "Зоряна", 34, "магістр", "претензія", "2026-09-10", "08:59"),
  new User("Савченко", "Ігор", 36, "фахова передвища", "побажання", "2026-09-11", "15:20"),
  new User("Гриценко", "Ірина", 48, "магістр", "запитання", "2026-09-12", "21:10"),
]);

function userRows(users) {
  return users.map((user) => ({
    прізвище: user.surname,
    "ім’я": user.firstName,
    вік: user.age,
    освіта: user.education,
    мета: user.purpose,
    дата: user.dateString,
    час: user.timeString,
  }));
}

function runDemo() {
  console.log("\n=== ЗАВДАННЯ 1. ТОВАРИ ===");
  const { sorted, averages } = analyzeProductsByCountry(products);
  console.log("1. Товари за країною походження:");
  console.table(
    sorted.map(({ id, name, country, price3 }) => ({
      id,
      назва: name,
      країна: country,
      "чинна ціна, грн": price3,
    }))
  );
  console.log("Середня чинна вартість у межах країни:");
  console.table(
    averages.map(({ country, count, averageCurrentPrice }) => ({
      країна: country,
      кількість: count,
      "середня ціна, грн": averageCurrentPrice.toFixed(2),
    }))
  );

  const cheapest = findLowestSecondPrice(products);
  console.log(`2. Мінімальна друга ціна: ${cheapest.price2} грн; внутрішній id: ${cheapest.id} (${cheapest.name}).`);

  const completeProduct = {
    article: "IT1111",
    id: 111,
    name: "Планшет",
    country: "Італія",
    price1: 10000,
    price2: 9500,
    price3: 9000,
    stock: 0,
  };
  const incompleteProduct = { ...completeProduct, id: 112, article: "IT1112", name: "" };
  const withComplete = addProduct(products, completeProduct);
  const withIncomplete = addProduct(products, incompleteProduct);
  console.log(`3. Повний запис: ${withComplete[0].article} на початку (${withComplete.length} записів).`);
  console.log(`   Неповний запис: ${withIncomplete.at(-1).article} у кінці (${withIncomplete.length} записів).`);

  console.log("4. Динаміка цін для кожного товару:");
  console.table(getPriceDynamics(products));

  console.log("\n=== ЗАВДАННЯ 2. КОРИСТУВАЧІ ===");
  console.log("1. Звернулись у вересні 2026 року о 10:30:");
  console.table(userRows(registry.findByMonthAndTime(2026, 9, "10:30")));

  const { averageAge, matches } = registry.getAverageAgeAndEducationMatches();
  console.log(`2. Середній вік: ${averageAge.toFixed(1)} року/років.`);
  if (matches.length > 0) {
    console.log("Користувачі такого віку та їхня освіта:");
    console.table(matches);
  } else {
    console.log("Користувачів із віком, рівним середньому, немає.");
  }

  console.log("3. Кількість користувачів у кожному класі:");
  console.table(
    Object.entries(registry.countCategories()).map(([клас, кількість]) => ({
      клас,
      кількість,
    }))
  );
  console.log("4а. Сортування за спаданням віку:");
  console.table(userRows(registry.sortByAgeDescending()));
  console.log("4б. Сортування за алфавітом (прізвище, ім’я):");
  console.table(userRows(registry.sortAlphabetically()));
}

function runTests() {
  console.log("\n=== ТЕСТУВАННЯ ОБОХ ЗАВДАНЬ ===");
  const check = (description, action) => {
    action();
    console.log(`✓ ${description}`);
  };

  check("Завдання 1: рівно 10 товарів із різними id", () => {
    assert.equal(products.length, 10);
    assert.equal(new Set(products.map(({ id }) => id)).size, 10);
  });

  check("Завдання 1: країни впорядковані, середня обчислена за чинною ціною", () => {
    const { sorted, averages } = analyzeProductsByCountry(products);
    assert.ok(sorted.every((p, i) => i === 0 || compareUkrainian(sorted[i - 1].country, p.country) <= 0));
    assert.equal(averages.find(({ country }) => country === "Україна").averageCurrentPrice, 10700);
    assert.equal(averages.find(({ country }) => country === "Німеччина").averageCurrentPrice, 14300 / 3);
  });

  check("Завдання 1: мінімальна друга ціна та її id", () => {
    assert.equal(findLowestSecondPrice(products).id, 103);
    assert.equal(findLowestSecondPrice(products).price2, 700);
  });

  check("Завдання 1: повний запис на початку, неповний у кінці; нуль на складі допустимий", () => {
    const full = { article: "ZZ111", id: 111, name: "Тест", country: "Україна", price1: 1, price2: 1, price3: 0, stock: 0 };
    const incomplete = { ...full, id: 112, country: "   " };
    assert.equal(addProduct(products, full)[0].id, 111);
    assert.equal(addProduct(products, incomplete).at(-1).id, 112);
    assert.equal(products.length, 10);
  });

  check("Завдання 1: спадання, зростання, рівні ціни і зміна напряму", () => {
    const trends = new Map(getPriceDynamics(products).map(({ id, dynamics }) => [id, dynamics]));
    assert.equal(trends.get(101), "стабільно дешевшає");
    assert.equal(trends.get(102), "стабільно дорожчає");
    assert.equal(trends.get(104), "не стабільні зміни");
    assert.equal(trends.get(103), "не стабільні зміни");
  });

  check("Завдання 2: екземпляри User використовують об'єкт Date", () => {
    assert.equal(registry.users.length, 10);
    assert.ok(registry.users.every((user) => user instanceof User));
    assert.ok(registry.users.every((user) => user.registrationDate instanceof Date));
  });

  check("Завдання 2: точний час у заданому місяці й році через методи Date", () => {
    assert.deepEqual(registry.findByMonthAndTime(2026, 9, "10:30").map((user) => user.surname), ["Іваненко", "Шевченко"]);
    assert.equal(registry.findByMonthAndTime(2025, 9, "10:30").length, 0);
    assert.equal(registry.findByMonthAndTime(2026, 9, "10:31").length, 0);
  });

  check("Завдання 2: середній вік і збіг із віком користувача", () => {
    assert.equal(registry.getAverageAgeAndEducationMatches().averageAge, 30);
    assert.deepEqual(registry.getAverageAgeAndEducationMatches().matches, [
      { surname: "Мельник", firstName: "Єва", age: 30, education: "магістр" },
    ]);
  });

  check("Завдання 2: категорії та межі робочого часу 09:00 і 18:00", () => {
    assert.deepEqual(registry.countCategories(), {
      "Звернулись з претензією у робочий час": 3,
      "Звернулись з побажанням у робочий час": 3,
      Інші: 4,
    });
    assert.equal(registry.users.find((user) => user.timeString === "09:00").isDuringWorkHours(), true);
    assert.equal(registry.users.find((user) => user.timeString === "17:59").isDuringWorkHours(), true);
    assert.equal(registry.users.find((user) => user.timeString === "18:00").isDuringWorkHours(), false);
  });

  check("Завдання 2: сортування зберігають усі записи та не мутують оригінальний реєстр", () => {
    assert.deepEqual(registry.sortByAgeDescending().map((user) => user.age), [48, 36, 34, 32, 30, 28, 26, 24, 22, 20]);
    const alphabetical = registry.sortAlphabetically();
    assert.ok(alphabetical.every((user, i) => i === 0 || compareUkrainian(alphabetical[i - 1].fullName, user.fullName) <= 0));
    assert.equal(registry.users[0].surname, "Петренко");
  });

  console.log("Усі 10 перевірок пройдено успішно.");
}

runDemo();
runTests();