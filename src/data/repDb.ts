export interface Representative {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    teamId: number;
}

// const representatives = [];



// function getRandomTeamId() {
//     // Generate a random number between 1 and 12 (inclusive)
//     return Math.floor(Math.random() * 12) + 1;
// }

// // Function to generate random names
// function generateRandomName() {
//     const names = [
//         "Oliver", "Emma", "Liam", "Ava", "Noah", "Sophia", "Ethan", "Isabella", "Muhammad", "Mia",
//         "Olivia", "Jackson", "Aiden", "Charlotte", "Lucas", "Amelia", "Elijah", "Harper", "Alexander", "Evelyn",
//         "James", "Abigail", "Benjamin", "Emily", "Henry", "Elizabeth", "Michael", "Mila", "Daniel", "Ella",
//         "Logan", "Sofia", "Sebastian", "Avery", "Carter", "Scarlett", "Matthew", "Grace", "Samuel", "Chloe",
//         "Joseph", "Victoria", "David", "Penelope", "Luke", "Luna", "John", "Layla", "Dylan", "Riley",
//         "Christopher", "Zoey", "Isaac", "Nora", "Ryan", "Lily", "Nathan", "Hannah", "Caleb", "Camila",
//         "Andrew", "Addison", "Joshua", "Aria", "Eli", "Eliana", "Grayson", "Gabriella", "Levi", "Bella",
//         "Isaiah", "Alexa", "Jonathan", "Savannah", "Charles", "Stella", "Aaron", "Zoe", "Ezequiel", "Natalie",
//         "Thomas", "Ellie", "Connor", "Aubrey", "Jeremiah", "Aurora", "Josiah", "Claire", "Jordan", "Julia",
//         "Nicholas", "Paisley", "Evan", "Brooklyn", "Angel", "Skylar", "Adam", "Samantha", "Jaxon", "Audrey",
//         "Leo", "Aaliyah", "Austin", "Ariana"
//     ];

//     const surnames = [
//         "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Martinez",
//         "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
//         "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
//         "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
//         "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
//         "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
//         "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
//         "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
//         "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
//         "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez"
//     ];
//     ;
//     const randomName = names[Math.floor(Math.random() * names.length)];
//     const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
//     return `${randomName} ${randomSurname}`;
// }

// // Function to generate random email
// function generateRandomEmail(name) {
//     return `${name.toLowerCase().replace(" ", ".")}@example.com`;
// }


// // Generate representatives

// export const run = () => {

//     const teamReps = [];
//     for (let j = 0; j < 40; j++) {
//         const fullName = generateRandomName();
//         const email = generateRandomEmail(fullName);
//         representatives.push({
//             id: representatives.length + 1,
//             firstName: fullName.split(" ")[0],
//             lastName: fullName.split(" ")[1],
//             email: email,
//             teamId: getRandomTeamId(),
//         });
//     }
//     console.log(representatives);
// }


export const reps: Representative[] = [
    {
        "id": 1,
        "firstName": "Michael",
        "lastName": "Chavez",
        "email": "michael.chavez@example.com",
        "teamId": 5
    },
    {
        "id": 2,
        "firstName": "Ellie",
        "lastName": "Lopez",
        "email": "ellie.lopez@example.com",
        "teamId": 5
    },
    {
        "id": 3,
        "firstName": "Ezequiel",
        "lastName": "Ramos",
        "email": "ezequiel.ramos@example.com",
        "teamId": 10
    },
    {
        "id": 4,
        "firstName": "Adam",
        "lastName": "Walker",
        "email": "adam.walker@example.com",
        "teamId": 8
    },
    {
        "id": 5,
        "firstName": "Evan",
        "lastName": "Edwards",
        "email": "evan.edwards@example.com",
        "teamId": 12
    },
    {
        "id": 6,
        "firstName": "Nathan",
        "lastName": "Mitchell",
        "email": "nathan.mitchell@example.com",
        "teamId": 3
    },
    {
        "id": 7,
        "firstName": "Aubrey",
        "lastName": "Jimenez",
        "email": "aubrey.jimenez@example.com",
        "teamId": 5
    },
    {
        "id": 8,
        "firstName": "Aiden",
        "lastName": "Evans",
        "email": "aiden.evans@example.com",
        "teamId": 3
    },
    {
        "id": 9,
        "firstName": "Alexander",
        "lastName": "Hall",
        "email": "alexander.hall@example.com",
        "teamId": 11
    },
    {
        "id": 10,
        "firstName": "Zoe",
        "lastName": "Brooks",
        "email": "zoe.brooks@example.com",
        "teamId": 8
    },
    {
        "id": 11,
        "firstName": "Ezequiel",
        "lastName": "Jones",
        "email": "ezequiel.jones@example.com",
        "teamId": 9
    },
    {
        "id": 12,
        "firstName": "Samuel",
        "lastName": "Morales",
        "email": "samuel.morales@example.com",
        "teamId": 11
    },
    {
        "id": 13,
        "firstName": "Lily",
        "lastName": "Wilson",
        "email": "lily.wilson@example.com",
        "teamId": 1
    },
    {
        "id": 14,
        "firstName": "Luna",
        "lastName": "Evans",
        "email": "luna.evans@example.com",
        "teamId": 5
    },
    {
        "id": 15,
        "firstName": "Elijah",
        "lastName": "Reed",
        "email": "elijah.reed@example.com",
        "teamId": 8
    },
    {
        "id": 16,
        "firstName": "Michael",
        "lastName": "Diaz",
        "email": "michael.diaz@example.com",
        "teamId": 10
    },
    {
        "id": 17,
        "firstName": "Eliana",
        "lastName": "Foster",
        "email": "eliana.foster@example.com",
        "teamId": 10
    },
    {
        "id": 18,
        "firstName": "Sophia",
        "lastName": "Gomez",
        "email": "sophia.gomez@example.com",
        "teamId": 2
    },
    {
        "id": 19,
        "firstName": "Matthew",
        "lastName": "Clark",
        "email": "matthew.clark@example.com",
        "teamId": 5
    },
    {
        "id": 20,
        "firstName": "Avery",
        "lastName": "Clark",
        "email": "avery.clark@example.com",
        "teamId": 9
    },
    {
        "id": 21,
        "firstName": "Elizabeth",
        "lastName": "Ward",
        "email": "elizabeth.ward@example.com",
        "teamId": 6
    },
    {
        "id": 22,
        "firstName": "Gabriella",
        "lastName": "Thomas",
        "email": "gabriella.thomas@example.com",
        "teamId": 2
    },
    {
        "id": 23,
        "firstName": "Riley",
        "lastName": "Price",
        "email": "riley.price@example.com",
        "teamId": 3
    },
    {
        "id": 24,
        "firstName": "Caleb",
        "lastName": "Adams",
        "email": "caleb.adams@example.com",
        "teamId": 4
    },
    {
        "id": 25,
        "firstName": "Christopher",
        "lastName": "Long",
        "email": "christopher.long@example.com",
        "teamId": 5
    },
    {
        "id": 26,
        "firstName": "Oliver",
        "lastName": "Lewis",
        "email": "oliver.lewis@example.com",
        "teamId": 10
    },
    {
        "id": 27,
        "firstName": "Aria",
        "lastName": "Ramos",
        "email": "aria.ramos@example.com",
        "teamId": 7
    },
    {
        "id": 28,
        "firstName": "Brooklyn",
        "lastName": "Hernandez",
        "email": "brooklyn.hernandez@example.com",
        "teamId": 8
    },
    {
        "id": 29,
        "firstName": "Liam",
        "lastName": "Perez",
        "email": "liam.perez@example.com",
        "teamId": 1
    },
    {
        "id": 30,
        "firstName": "Gabriella",
        "lastName": "Green",
        "email": "gabriella.green@example.com",
        "teamId": 3
    },
    {
        "id": 31,
        "firstName": "James",
        "lastName": "Castillo",
        "email": "james.castillo@example.com",
        "teamId": 5
    },
    {
        "id": 32,
        "firstName": "Christopher",
        "lastName": "Carter",
        "email": "christopher.carter@example.com",
        "teamId": 4
    },
    {
        "id": 33,
        "firstName": "Brooklyn",
        "lastName": "Rogers",
        "email": "brooklyn.rogers@example.com",
        "teamId": 2
    },
    {
        "id": 34,
        "firstName": "Eli",
        "lastName": "Alvarez",
        "email": "eli.alvarez@example.com",
        "teamId": 7
    },
    {
        "id": 35,
        "firstName": "Evan",
        "lastName": "Sanders",
        "email": "evan.sanders@example.com",
        "teamId": 1
    },
    {
        "id": 36,
        "firstName": "Ezequiel",
        "lastName": "Lopez",
        "email": "ezequiel.lopez@example.com",
        "teamId": 8
    },
    {
        "id": 37,
        "firstName": "Benjamin",
        "lastName": "Wood",
        "email": "benjamin.wood@example.com",
        "teamId": 10
    },
    {
        "id": 38,
        "firstName": "Henry",
        "lastName": "Johnson",
        "email": "henry.johnson@example.com",
        "teamId": 5
    },
    {
        "id": 39,
        "firstName": "Ethan",
        "lastName": "Reed",
        "email": "ethan.reed@example.com",
        "teamId": 2
    },
    {
        "id": 40,
        "firstName": "Aria",
        "lastName": "Green",
        "email": "aria.green@example.com",
        "teamId": 3
    },
    {
        "id": 41,
        "firstName": "Caleb",
        "lastName": "Hernandez",
        "email": "caleb.hernandez@example.com",
        "teamId": 1
    },
    {
        "id": 42,
        "firstName": "Jonathan",
        "lastName": "Parker",
        "email": "jonathan.parker@example.com",
        "teamId": 5
    },
    {
        "id": 43,
        "firstName": "Julia",
        "lastName": "Flores",
        "email": "julia.flores@example.com",
        "teamId": 4
    },
    {
        "id": 44,
        "firstName": "Noah",
        "lastName": "Rodriguez",
        "email": "noah.rodriguez@example.com",
        "teamId": 9
    },
    {
        "id": 45,
        "firstName": "Oliver",
        "lastName": "Walker",
        "email": "oliver.walker@example.com",
        "teamId": 2
    },
    {
        "id": 46,
        "firstName": "Evan",
        "lastName": "Johnson",
        "email": "evan.johnson@example.com",
        "teamId": 12
    },
    {
        "id": 47,
        "firstName": "Savannah",
        "lastName": "Kim",
        "email": "savannah.kim@example.com",
        "teamId": 3
    },
    {
        "id": 48,
        "firstName": "Savannah",
        "lastName": "Hall",
        "email": "savannah.hall@example.com",
        "teamId": 8
    },
    {
        "id": 49,
        "firstName": "Natalie",
        "lastName": "Smith",
        "email": "natalie.smith@example.com",
        "teamId": 3
    },
    {
        "id": 50,
        "firstName": "Emma",
        "lastName": "Hall",
        "email": "emma.hall@example.com",
        "teamId": 1
    },
    {
        "id": 51,
        "firstName": "Ella",
        "lastName": "Rodriguez",
        "email": "ella.rodriguez@example.com",
        "teamId": 8
    },
    {
        "id": 52,
        "firstName": "Aubrey",
        "lastName": "Hernandez",
        "email": "aubrey.hernandez@example.com",
        "teamId": 7
    },
    {
        "id": 53,
        "firstName": "Dylan",
        "lastName": "Martin",
        "email": "dylan.martin@example.com",
        "teamId": 4
    },
    {
        "id": 54,
        "firstName": "Chloe",
        "lastName": "Castillo",
        "email": "chloe.castillo@example.com",
        "teamId": 7
    },
    {
        "id": 55,
        "firstName": "Isaiah",
        "lastName": "Stewart",
        "email": "isaiah.stewart@example.com",
        "teamId": 3
    },
    {
        "id": 56,
        "firstName": "Daniel",
        "lastName": "Brooks",
        "email": "daniel.brooks@example.com",
        "teamId": 8
    },
    {
        "id": 57,
        "firstName": "Zoe",
        "lastName": "Ortiz",
        "email": "zoe.ortiz@example.com",
        "teamId": 1
    },
    {
        "id": 58,
        "firstName": "Nathan",
        "lastName": "Richardson",
        "email": "nathan.richardson@example.com",
        "teamId": 4
    },
    {
        "id": 59,
        "firstName": "Audrey",
        "lastName": "Perez",
        "email": "audrey.perez@example.com",
        "teamId": 5
    },
    {
        "id": 60,
        "firstName": "Daniel",
        "lastName": "Ramirez",
        "email": "daniel.ramirez@example.com",
        "teamId": 4
    },
    {
        "id": 61,
        "firstName": "Nora",
        "lastName": "Gray",
        "email": "nora.gray@example.com",
        "teamId": 1
    },
    {
        "id": 62,
        "firstName": "Audrey",
        "lastName": "Diaz",
        "email": "audrey.diaz@example.com",
        "teamId": 8
    },
    {
        "id": 63,
        "firstName": "Brooklyn",
        "lastName": "Diaz",
        "email": "brooklyn.diaz@example.com",
        "teamId": 3
    },
    {
        "id": 64,
        "firstName": "Jaxon",
        "lastName": "Stewart",
        "email": "jaxon.stewart@example.com",
        "teamId": 5
    },
    {
        "id": 65,
        "firstName": "Elizabeth",
        "lastName": "Torres",
        "email": "elizabeth.torres@example.com",
        "teamId": 10
    },
    {
        "id": 66,
        "firstName": "Aubrey",
        "lastName": "Lopez",
        "email": "aubrey.lopez@example.com",
        "teamId": 7
    },
    {
        "id": 67,
        "firstName": "Caleb",
        "lastName": "Moore",
        "email": "caleb.moore@example.com",
        "teamId": 9
    },
    {
        "id": 68,
        "firstName": "Abigail",
        "lastName": "Allen",
        "email": "abigail.allen@example.com",
        "teamId": 7
    },
    {
        "id": 69,
        "firstName": "Julia",
        "lastName": "Rivera",
        "email": "julia.rivera@example.com",
        "teamId": 6
    },
    {
        "id": 70,
        "firstName": "Eliana",
        "lastName": "Cox",
        "email": "eliana.cox@example.com",
        "teamId": 12
    },
    {
        "id": 71,
        "firstName": "Michael",
        "lastName": "Green",
        "email": "michael.green@example.com",
        "teamId": 1
    },
    {
        "id": 72,
        "firstName": "Zoe",
        "lastName": "Bennett",
        "email": "zoe.bennett@example.com",
        "teamId": 7
    },
    {
        "id": 73,
        "firstName": "Henry",
        "lastName": "Torres",
        "email": "henry.torres@example.com",
        "teamId": 1
    },
    {
        "id": 74,
        "firstName": "Sebastian",
        "lastName": "Cruz",
        "email": "sebastian.cruz@example.com",
        "teamId": 11
    },
    {
        "id": 75,
        "firstName": "Addison",
        "lastName": "Morgan",
        "email": "addison.morgan@example.com",
        "teamId": 9
    },
    {
        "id": 76,
        "firstName": "Hannah",
        "lastName": "Johnson",
        "email": "hannah.johnson@example.com",
        "teamId": 8
    },
    {
        "id": 77,
        "firstName": "Luna",
        "lastName": "Brooks",
        "email": "luna.brooks@example.com",
        "teamId": 6
    },
    {
        "id": 78,
        "firstName": "Sofia",
        "lastName": "Foster",
        "email": "sofia.foster@example.com",
        "teamId": 12
    },
    {
        "id": 79,
        "firstName": "Ava",
        "lastName": "Collins",
        "email": "ava.collins@example.com",
        "teamId": 8
    },
    {
        "id": 80,
        "firstName": "Audrey",
        "lastName": "Allen",
        "email": "audrey.allen@example.com",
        "teamId": 11
    }
]