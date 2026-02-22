const axios = require('axios');

const API_BASE_URL = 'https://libraryapp-3hqg.onrender.com/api/v1';

async function seed() {
    try {
        console.log('Seeding data...');

        // 1. Publishers
        const pubs = [
            { name: 'İş Bankası Kültür Yayınları', establishmentYear: 1956, address: 'İstanbul, Türkiye' },
            { name: 'Can Yayınları', establishmentYear: 1981, address: 'İstanbul, Türkiye' },
            { name: 'Yapı Kredi Yayınları', establishmentYear: 1945, address: 'İstanbul, Türkiye' },
            { name: 'Metis Yayınları', establishmentYear: 1982, address: 'İstanbul, Türkiye' },
            { name: 'İletişim Yayınları', establishmentYear: 1983, address: 'İstanbul, Türkiye' }
        ];
        const createdPubs = [];
        for (const p of pubs) {
            const res = await axios.post(`${API_BASE_URL}/publishers`, p);
            createdPubs.push(res.data);
        }
        console.log('Publishers seeded');

        // 2. Authors
        const authors = [
            { name: 'Sabahattin Ali', birthDate: '1907-02-25', country: 'Türkiye' },
            { name: 'Yaşar Kemal', birthDate: '1923-10-06', country: 'Türkiye' },
            { name: 'Franz Kafka', birthDate: '1883-07-03', country: 'Çekoslovakya' },
            { name: 'Stefan Zweig', birthDate: '1881-11-28', country: 'Avusturya' },
            { name: 'Albert Camus', birthDate: '1913-11-07', country: 'Cezayir' }
        ];
        const createdAuthors = [];
        for (const a of authors) {
            const res = await axios.post(`${API_BASE_URL}/authors`, a);
            createdAuthors.push(res.data);
        }
        console.log('Authors seeded');

        // 3. Categories
        const categories = [
            { name: 'Roman', description: 'Uzun anlatı türü' },
            { name: 'Klasik', description: 'Edebi değerini koruyan eserler' },
            { name: 'Modern', description: 'Yakın dönem eserleri' },
            { name: 'Felsefe', description: 'Düşünce dünyası' },
            { name: 'Tarih', description: 'Geçmişin incelenmesi' }
        ];
        const createdCats = [];
        for (const c of categories) {
            const res = await axios.post(`${API_BASE_URL}/categories`, c);
            createdCats.push(res.data);
        }
        console.log('Categories seeded');

        // 4. Books
        const books = [
            {
                name: 'Kürk Mantolu Madonna',
                publicationYear: 1943,
                stock: 10,
                author: { id: createdAuthors[0].id },
                publisher: { id: createdPubs[0].id },
                categories: [{ id: createdCats[0].id }, { id: createdCats[1].id }]
            },
            {
                name: 'İnce Memed',
                publicationYear: 1955,
                stock: 5,
                author: { id: createdAuthors[1].id },
                publisher: { id: createdPubs[1].id },
                categories: [{ id: createdCats[0].id }]
            },
            {
                name: 'Dönüşüm',
                publicationYear: 1915,
                stock: 8,
                author: { id: createdAuthors[2].id },
                publisher: { id: createdPubs[2].id },
                categories: [{ id: createdCats[1].id }]
            },
            {
                name: 'Satranç',
                publicationYear: 1941,
                stock: 15,
                author: { id: createdAuthors[3].id },
                publisher: { id: createdPubs[0].id },
                categories: [{ id: createdCats[2].id }]
            },
            {
                name: 'Yabancı',
                publicationYear: 1942,
                stock: 12,
                author: { id: createdAuthors[4].id },
                publisher: { id: createdPubs[4].id },
                categories: [{ id: createdCats[3].id }]
            }
        ];
        const createdBooks = [];
        for (const b of books) {
            const res = await axios.post(`${API_BASE_URL}/books`, b);
            createdBooks.push(res.data);
        }
        // 5. Book Borrowings
        const borrowings = [
            {
                borrowerName: 'Kaan Nalbant',
                borrowerMail: 'kaan@example.com',
                borrowingDate: '2024-03-01',
                bookForBorrowingRequest: { id: createdBooks[0].id }
            },
            {
                borrowerName: 'Mehmet Yılmaz',
                borrowerMail: 'mehmet@example.com',
                borrowingDate: '2024-03-05',
                bookForBorrowingRequest: { id: createdBooks[1].id }
            },
            {
                borrowerName: 'Ayşe Demir',
                borrowerMail: 'ayse@example.com',
                borrowingDate: '2024-03-10',
                bookForBorrowingRequest: { id: createdBooks[2].id }
            },
            {
                borrowerName: 'Fatma Şahin',
                borrowerMail: 'fatma@example.com',
                borrowingDate: '2024-03-12',
                bookForBorrowingRequest: { id: createdBooks[3].id }
            },
            {
                borrowerName: 'Ali Öztürk',
                borrowerMail: 'ali@example.com',
                borrowingDate: '2024-03-15',
                bookForBorrowingRequest: { id: createdBooks[4].id }
            }
        ];
        for (const br of borrowings) {
            await axios.post(`${API_BASE_URL}/borrows`, br);
        }
        console.log('Borrowings seeded');

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Seeding failed:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

seed();
