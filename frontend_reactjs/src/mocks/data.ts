import {
    User,
    Expense,
    Income,
    ExpensesCategory,
    Hike,
    PianoPiece,
    PianoPieceStatus,
    NoteCategory,
    DiaryEntry,
    Note,
    VideoGame,
    VideoGameType,
    ExpensesCategoryKeyword
} from '../types';


export const user: User = {
    id: 1,
    name: 'John Doe',
    email: 'jdoe@hotmail.com',
    token: 'fake-jwt-token'
};

export const expensesCategories: ExpensesCategory[] = [
    { id: 1, name: 'Groceries', color: 'green' },
    { id: 2, name: 'Tools/Services', color: 'yellow' },
    { id: 3, name: 'Entertainment', color: 'purple' },
    { id: 4, name: 'Housing', color: 'orange' },
    { id: 5, name: 'One-time', color: 'blue' },
    { id: 6, name: 'Tuition', color: 'red' },
];

export const expensesCategoryKeywords: ExpensesCategoryKeyword[] = [
    { id: 1, keyword: 'groceries', category: expensesCategories[0] },
    { id: 2, keyword: 'tools', category: expensesCategories[1] },
    { id: 3, keyword: 'services', category: expensesCategories[1] },
    { id: 4, keyword: 'entertainment', category: expensesCategories[2] },
    { id: 5, keyword: 'housing', category: expensesCategories[3] },
    { id: 6, keyword: 'one-time', category: expensesCategories[4] },
    { id: 7, keyword: 'tuition', category: expensesCategories[5] },
    { id: 8, keyword: 'ETH', category: expensesCategories[5] }
];

export const expenses: Expense[] = [
    {
        id: 1,
        date: new Date("2025-07-01"),
        category: expensesCategories[0],
        description: 'Lunch at the cafe',
        vendor: 'Cafe XYZ',
        amount: 15.99,
        tags: ['lunch', 'cafe'],
        type: 'manual'
    },
    {
        id: 2,
        date: new Date("2025-07-05"),
        category: expensesCategories[1],
        description: 'Bus ticket',
        vendor: 'City Bus',
        amount: 2.50,
        tags: ['transport', 'bus'],
        type: 'auto'
    },
    {
        id: 3,
        date: new Date("2024-12-20"),
        category: expensesCategories[2],
        description: 'Movie ticket',
        vendor: 'Cinema ABC',
        amount: 12.00,
        tags: ['movie', 'entertainment'],
        type: 'manual'
    },
    {
        id: 4,
        date: new Date("2025-02-10"),
        category: expensesCategories[3],
        description: 'Electricity bill',
        vendor: 'Power Company',
        amount: 45.00,
        tags: ['utilities', 'electricity'],
        type: 'auto'
    }
];

export const incomes: Income[] = [
    {
        id: 1,
        date: new Date("2025-01-01"),
        source: 'Salary',
        amount: 3000.00
    },
    {
        id: 2,
        date: new Date("2025-02-01"),
        source: 'Freelance Work',
        amount: 1500.00
    }
];

export const hikes: Hike[] = [
    {
        id: 1,
        date: new Date("2025-07-01"),
        description: 'Morning hike in the mountains',
        distance: 5.0,
        ascent: 300,
        descent: 200,
        duration: 3.4,
        durationWithBreaks: 3.9,
        coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMuRviGmuOIjiaBd9elsOJ9lthIA9hKV6JGQ&s",
        images: [],
        googleMapsUrl: "https://maps.app.goo.gl/LvpaPxcWUFwdnNvF9"
    },
    {
        id: 2,
        date: new Date("2025-07-05"),
        description: 'Evening walk in the park',
        distance: 2.0,
        ascent: 50,
        descent: 30,
        duration: 5.1,
        durationWithBreaks: 6.8,
        coverImage: "https://8515463.fs1.hubspotusercontent-na1.net/hubfs/8515463/Impact%20of%20trees%20on%20the%20world.jpg",
        images: [],
        googleMapsUrl: "https://maps.app.goo.gl/LvpaPxcWUFwdnNvF9"
    }
];

export const pianoPieces: PianoPiece[] = [
    {
        id: 1,
        name: 'Fur Elise',
        composer: 'Beethoven',
        origin: 'Classical',
        status: PianoPieceStatus.Learned,
        monthLearned: new Date("2025-01-01"),
        sheetMusicUrl: 'https://example.com/fur-elise-sheet-music',
        youtubeUrl: 'https://www.youtube.com/watch?v=4Tr0otuiQuo'
    },
    {
        id: 2,
        name: 'Clair de Lune',
        composer: 'Debussy',
        origin: 'Impressionist',
        status: PianoPieceStatus.Learning,
        monthLearned: undefined,
        sheetMusicUrl: 'https://example.com/clair-de-lune-sheet-music',
        youtubeUrl: 'https://www.youtube.com/watch?v=CvFH_9DNRC4'
    },
    {
        id: 3,
        name: 'Prelude in C Major',
        composer: 'Bach',
        origin: 'Baroque',
        status: PianoPieceStatus.Planned,
        monthLearned: undefined,
        sheetMusicUrl: 'https://example.com/moonlight-sonata-sheet-music',
        youtubeUrl: 'https://www.youtube.com/watch?v=4Tr0otuiQuo'
    },
    {
        id: 4,
        name: 'Moonlight Sonata',
        composer: 'Beethoven',
        origin: 'Classical',
        status: PianoPieceStatus.Learned_Forgotten,
        monthLearned: new Date("2025-04-01"),
        sheetMusicUrl: 'https://example.com/prelude-in-c-major-sheet-music',
        youtubeUrl: 'https://www.youtube.com/watch?v=4Tr0otuiQuo'
    }
];

export const noteCategories: NoteCategory[] = [
    { id: 1, name: 'Personal' },
    { id: 2, name: 'Work' },
    { id: 3, name: 'Ideas' },
    { id: 4, name: 'Reminders' }
];

export const notes: Note[] = [
    {
        id: 1,
        category: noteCategories[0],
        title: 'Grocery List',
        content: 'Milk, Eggs, Bread',
        dateCreated: new Date("2025-07-01"),
        dateModified: new Date("2025-07-02"),
        tags: ['shopping', 'groceries']
    },
    {
        id: 2,
        category: noteCategories[1],
        title: 'Project Update',
        content: 'Completed the first phase of the project.',
        dateCreated: new Date("2025-07-05"),
        dateModified: new Date("2025-07-06"),
        tags: ['work', 'project']
    },
    {
        id: 3,
        category: noteCategories[2],
        title: 'New App Idea',
        content: 'An app that helps track daily habits.',
        dateCreated: new Date("2025-07-10"),
        dateModified: new Date("2025-07-11"),
        tags: ['ideas', 'app']
    },
    {
        id: 4,
        category: noteCategories[3],
        title: 'Doctor Appointment',
        content: 'Check-up on July 15th at 10 AM.',
        dateCreated: new Date("2025-07-15"),
        dateModified: new Date("2025-07-16"),
        tags: ['reminder', 'health']
    },
    {
        id: 5,
        category: noteCategories[0],
        title: 'Book Recommendations',
        content: '1. The Great Gatsby\n2. To Kill a Mockingbird',
        dateCreated: new Date("2025-07-20"),
        dateModified: new Date("2025-07-21"),
        tags: ['books', 'reading']
    },
    {
        id: 6,
        category: noteCategories[1],
        title: 'Meeting Notes',
        content: 'Discussed project timelines and deliverables.',
        dateCreated: new Date("2025-07-25"),
        dateModified: new Date("2025-07-26"),
        tags: ['meeting', 'notes']
    }
];

export const diaryEntries: DiaryEntry[] = [
    {
        id: 1,
        date: new Date("2025-07-01"),
        content: 'Had a productive day at work.',
        workContent: 'Completed the project presentation.'
    },
    {
        id: 2,
        date: new Date("2025-07-02"),
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        workContent: 'Duis aute irure dolor in reprehenderit in voluptate'
    },
    {
        id: 3,
        date: new Date("2025-06-03"),
        content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
        workContent: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.'
    }
];

export const videoGames: VideoGame[] = [
    {
        id: 1,
        name: 'The Legend of Zelda: Breath of the Wild',
        platform: 'Nintendo Switch',
        type: VideoGameType.Both,
        completionCount: 2,
        firstPlayed: new Date("2025-01-01"),
        price: "59.99 $",
        extraPurchases: "DLC Pack - 19.99 $",
        coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT8XEMG4EYPrDFtsYlOqoIWqLw14e7eNwVpA&s',
        storeUrl: 'https://www.zelda.com/breath-of-the-wild/'
    },
    {
        id: 2,
        name: 'Stardew Valley',
        platform: 'PC',
        type: VideoGameType.Single_Player,
        completionCount: 0,
        firstPlayed: new Date("2025-02-01"),
        price: "14.99 CHF",
        extraPurchases: "",
        coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkeLlFQDTHsYjSHtbBsInAYl2aIF54Qz_8zQ&s',
        storeUrl: 'https://www.stardewvalley.net/'
    },
    {
        id: 3,
        name: 'Call of Duty: Warzone',
        platform: 'PC',
        type: VideoGameType.Online,
        completionCount: 0,
        firstPlayed: new Date("2025-03-01"),
        price: "Free",
        extraPurchases: 'Battle Pass - 9.99 $',
        coverImage: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/311210/header.jpg?t=1748022663',
        storeUrl: 'https://www.callofduty.com/warzone'
    }
];