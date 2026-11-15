const products = [
    { article: "AS-ZB1401", id: 101, name: "Ноутбук ASUS ZenBook 14 OLED", country: "Тайвань", price1: 48000, price2: 46500, price3: 44999, stock: 12 },
    { article: "LN-LG502", id: 102, name: "Ноутбук Lenovo Legion Slim 5", country: "Китай", price1: 52000, price2: 54000, price3: 56500, stock: 7 },
    { article: "DL-U2724", id: 103, name: "Монітор 27 Dell UltraSharp", country: "США", price1: 21000, price2: 19800, price3: 20500, stock: 15 },
    { article: "AS-RG160", id: 104, name: "Ноутбук ASUS ROG Strix G16", country: "Тайвань", price1: 68000, price2: 65000, price3: 62999, stock: 5 },
    { article: "LN-TP14X", id: 105, name: "Ноутбук Lenovo ThinkPad X1", country: "Китай", price1: 59000, price2: 61000, price3: 63500, stock: 9 },
    { article: "DL-XPS13", id: 106, name: "Ноутбук Dell XPS 13", country: "США", price1: 55000, price2: 53000, price3: 51000, stock: 6 },
    { article: "LG-27GP8", id: 107, name: "Монітор 27 LG UltraGear", country: "Південна Корея", price1: 16500, price2: 15900, price3: 16200, stock: 18 },
    { article: "SM-G732", id: 108, name: "Монітор 32 Samsung Odyssey G7", country: "Південна Корея", price1: 24000, price2: 22500, price3: 21500, stock: 10 },
    { article: "HP-OM16", id: 109, name: "Ноутбук HP Omen 16", country: "США", price1: 47000, price2: 48500, price3: 49900, stock: 8 },
    { article: "AC-NT51", id: 110, name: "Ноутбук Acer Nitro 5", country: "Тайвань", price1: 36000, price2: 34500, price3: 35000, stock: 14 }
];

console.log("=== ТИПИ ДАНИХ (typeof) ===");
console.log("string:", typeof products[0].name);
console.log("number:", typeof products[0].price3);
console.log("boolean:", typeof true);
console.log("object (об'єкт):", typeof products[0]);
console.log("object (масив):", typeof products);
console.log("function:", typeof analyzePriceDynamics);

const sortAndAverageByCountry = (items) => {
    const sorted = [...items].sort((a, b) => a.country.localeCompare(b.country, "uk"));

    const countries = [];
    let i = 0;
    while (i < sorted.length) {
        if (!countries.includes(sorted[i].country)) {
            countries.push(sorted[i].country);
        }
        i++;
    }

    const averages = countries.map((country) => {
        const countryItems = sorted.filter((item) => item.country === country);
        const sum = countryItems.reduce((acc, item) => {
            acc += item.price3;
            return acc;
        }, 0);

        return {
            country: country,
            count: countryItems.length,
            averagePrice: Math.round(sum / countryItems.length)
        };
    });

    return { sorted, averages };
};

const findMinPrice2Id = function (items) {
    const minPrice = Math.min(...items.map((item) => item.price2));
    const foundProduct = items.find((item) => item.price2 === minPrice);
    return {
        id: String(foundProduct.id),
        name: foundProduct.name,
        minPrice2: foundProduct.price2
    };
};

function addProductRecord(items, newProduct) {
    const requiredFields = ["article", "id", "name", "country", "price1", "price2", "price3", "stock"];
    let isComplete = true;

    for (let i = 0; i < requiredFields.length; i++) {
        const value = newProduct[requiredFields[i]];
        if (!Boolean(value) && value !== 0) {
            isComplete = false;
            break;
        }
        if (typeof value === "string" && value.trim() === "") {
            isComplete = false;
            break;
        }
    }

    if (isComplete) {
        items.unshift(newProduct);
        return "Вся інформація наявна - товар додано на ПОЧАТОК списку.";
    } else {
        items.push(newProduct);
        return "Відсутня частина інформації - товар додано в КІНЕЦЬ списку.";
    }
}

function analyzePriceDynamics(items) {
    return items.map((item) => {
        let status = "";

        if (item.price1 > item.price2 && item.price2 > item.price3) {
            status = "стабільно дешевшає";
        } else if (item.price1 < item.price2 && item.price2 < item.price3) {
            status = "стабільно дорожчає";
        } else {
            status = "не стабільні зміни";
        }

        let marker = "";
        switch (status) {
            case "стабільно дешевшає":
                marker = "\\/";
                break;
            case "стабільно дорожчає":
                marker = "/\\";
                break;
            default:
                marker = "~";
        }

        return {
            id: item.id,
            name: item.name,
            dynamics: `${marker} ${status}`,
            totalDiff: Math.abs(item.price3 - item.price1)
        };
    });
}

console.log("\n=== 1.1. Впорядкування за країною та середня вартість ===");
const countryStats = sortAndAverageByCountry(products);
console.table(countryStats.sorted, ["id", "name", "country", "price3"]);
console.table(countryStats.averages);

console.log("\n=== 1.2. Товар з мінімальною «вартість2_недіюча» ===");
console.log(findMinPrice2Id(products));

console.log("\n=== 1.3. Додавання нового товару ===");
const incompleteProduct = { article: "MS-GF63", id: 111, name: "Ноутбук MSI Thin GF63", country: "Тайвань" };
const completeProduct = { article: "AP-MB14", id: 100, name: "Ноутбук Apple MacBook Pro 14", country: "США", price1: 78000, price2: 75000, price3: 72999, stock: 4 };

console.log(addProductRecord(products, incompleteProduct));
console.log(addProductRecord(products, completeProduct));
console.log("Оновлений порядок ID:", products.map((p) => p.id).join(" -> ").toUpperCase());

console.log("\n=== 1.4. Динаміка зміни ціни товарів ===");
console.table(analyzePriceDynamics(products));