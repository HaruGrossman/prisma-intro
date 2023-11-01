const prisma = require("../prisma");

// Seed 20 authors into the database. Each author should have 3 corresponding books.
const seed = async (singleAuthors = 20, booksPerAuthor = 3) => { // because we use async we need an await at the end
    //.from() creates an array from an array-like object (looks like a double loop)
    const createAuthorPromises = Array.from({ length: singleAuthors }, (_, index) => {
        const books = Array.from({ length: booksPerAuthor }, (_, jindex) => ({
            title: `Book ${index}${jindex}` // for each singleAuthor, for each book create this title
        }));
        return prisma.author.create({
            data: {
                name: `Author ${index}`,
                books: {
                    create: books,
                },
            },
        });
    });
    // Promise.all allows us to start all the 'create' requests at the same time, rather that awaiting for each one to finish. we then wait for all of them to finish with 'await'
    await Promise.all(createAuthorPromises)
} //this whole const is just creating our seed

seed()// calling our function to create out seed
    .then(async () => await prisma.$disconnect())
    .catch(async (event) => {
        console.error(event);
        await prisma.$disconnect();
        process.exit(1);
    })//This is pulled from the Prisma docs. Since we are using the Prisma Client directly, we need to disconnect from it manually.
//We are also using "then" and "catch" instead of async/await because async/await doesn't work at the top level of a file