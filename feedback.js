class UserAccount {
    constructor(lastName, firstName, age, education, purpose, date, time) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.age = Number(age);
        this.education = education;
        this.purpose = purpose;
        this.date = date;
        this.time = time;
    }

    getFullName() {
        return `${this.lastName} ${this.firstName}`;
    }

    getAppealDateInfo() {
        const parsedDate = new Date(this.date);
        return {
            month: parsedDate.getMonth() + 1,
            year: parsedDate.getFullYear(),
            day: parsedDate.getDate()
        };
    }

    getAppealClass() {
        const timeParts = this.time.split(":");
        const hours = Number(timeParts[0]);
        const minutes = Number(timeParts[1]);
        const normalizedPurpose = this.purpose.trim().toLowerCase();

        const isWorkingHours = hours >= 9 && (hours < 18 || (hours === 18 && minutes === 0));

        if (isWorkingHours && normalizedPurpose === "претензія") {
            return "звернулись з претензією у робочий час";
        } else if (isWorkingHours && normalizedPurpose === "побажання") {
            return "звернулись з побажанням у робочий час";
        } else {
            return "Інші";
        }
    }
}

class UserRegistry {
    constructor(users) {
        this.users = users;
    }

    findByMonthAndTime(targetMonth, targetTime) {
        return this.users.filter((user) => {
            const dateInfo = user.getAppealDateInfo();
            return dateInfo.month === targetMonth && user.time === targetTime;
        });
    }

    analyzeAverageAge() {
        let totalAge = 0;
        for (let i = 0; i < this.users.length; i++) {
            totalAge += this.users[i].age;
        }
        const averageAge = Math.round(totalAge / this.users.length);
        const matchedUsers = this.users.filter((user) => user.age === averageAge);

        return { averageAge, matchedUsers };
    }

    classifyUsers() {
        const counts = {
            "звернулись з претензією у робочий час": 0,
            "звернулись з побажанням у робочий час": 0,
            "Інші": 0
        };

        for (let i = 0; i < this.users.length; i++) {
            const category = this.users[i].getAppealClass();
            switch (category) {
                case "звернулись з претензією у робочий час":
                    counts["звернулись з претензією у робочий час"]++;
                    break;
                case "звернулись з побажанням у робочий час":
                    counts["звернулись з побажанням у робочий час"]++;
                    break;
                default:
                    counts["Інші"]++;
            }
        }

        return counts;
    }

    sortByAgeDesc() {
        return [...this.users].sort((a, b) => b.age - a.age);
    }

    sortAlphabetically() {
        return [...this.users].sort((a, b) => a.getFullName().localeCompare(b.getFullName(), "uk"));
    }
}

const accountsList = [
    new UserAccount("Коваленко", "Олександр", 22, "Неповна", "побажання", "2026-03-10", "11:30"),
    new UserAccount("Шевченко", "Марина", 35, "Вища", "претензія", "2026-03-14", "10:15"),
    new UserAccount("Петренко", "Василь", 30, "Вища", "побажання", "2026-03-18", "11:30"),
    new UserAccount("Бондаренко", "Ірина", 41, "Професійна", "претензія", "2026-04-02", "14:45"),
    new UserAccount("Ткаченко", "Дмитро", 27, "Вища", "співпраця", "2026-03-21", "16:00"),
    new UserAccount("Мельник", "Анна", 19, "Повна", "побажання", "2026-05-05", "19:20"),
    new UserAccount("Кравченко", "Сергій", 38, "Вища", "претензія", "2026-03-25", "09:40"),
    new UserAccount("Олійник", "Наталія", 25, "Вища", "побажання", "2026-04-11", "15:10"),
    new UserAccount("Савченко", "Андрій", 34, "Професійна", "претензія", "2026-05-12", "20:05"),
    new UserAccount("Лисенко", "Олена", 29, "Вища", "побажання", "2026-03-29", "12:00")
];

const registry = new UserRegistry(accountsList);

console.log("=== 2.1. Звернення у березні (місяць 3) о 11:30 ===");
console.table(registry.findByMonthAndTime(3, "11:30"));

console.log("\n=== 2.2. Середній вік та дані про освіту при збігу ===");
const ageResult = registry.analyzeAverageAge();
console.log(`Середній вік користувачів: ${ageResult.averageAge} років`);
if (ageResult.matchedUsers.length > 0) {
    ageResult.matchedUsers.forEach((u) => {
        console.log(`Збіг знайдено: ${u.getFullName()}, вік: ${u.age}, освіта: ${u.education}`);
    });
} else {
    console.log("Користувачів із віком, рівним середньому, не знайдено.");
}

console.log("\n=== 2.3. Розподіл користувачів на 3 класи ===");
console.table(registry.classifyUsers());

console.log("\n=== 2.4.1. Сортування у порядку спадання віку ===");
console.table(registry.sortByAgeDesc(), ["lastName", "firstName", "age", "education"]);

console.log("\n=== 2.4.2. Сортування в алфавітному порядку ===");
console.table(registry.sortAlphabetically(), ["lastName", "firstName", "age", "purpose"]);