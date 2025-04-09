// src/mocks/mockData.ts
import { 
  Product, ProductCategory, CoverType, DiscType, 
  User, UserRole, Order, OrderStatus
} from '../types';

// Mock Products
export const mockProducts: Product[] = [
  // BOOKS
  {
    id: 'book-001',
    title: 'The Great Gatsby',
    category: ProductCategory.BOOK,
    value: 150000, // 150,000 VND
    price: 180000, // 180,000 VND
    barcode: '9780743273565',
    description: 'New, mint condition, eligible for return within 30 days',
    quantity: 25,
    warehouseEntryDate: '2024-10-15',
    dimensions: {
      width: 13,
      height: 21,
      depth: 1.5
    },
    weight: 0.3, // 0.3kg
    authors: ['F. Scott Fitzgerald'],
    coverType: CoverType.PAPERBACK,
    publisher: 'Scribner',
    publicationDate: '2004-09-30',
    pages: 180,
    language: 'English',
    genre: 'Classic Fiction'
  },
  {
    id: 'book-002',
    title: 'Đắc Nhân Tâm',
    category: ProductCategory.BOOK,
    value: 100000,
    price: 120000,
    barcode: '8935086838137',
    description: 'New, Vietnamese translation, hardcover',
    quantity: 50,
    warehouseEntryDate: '2024-11-01',
    dimensions: {
      width: 14.5,
      height: 20.5,
      depth: 2
    },
    weight: 0.5,
    authors: ['Dale Carnegie'],
    coverType: CoverType.HARDCOVER,
    publisher: 'First News',
    publicationDate: '2020-01-01',
    pages: 320,
    language: 'Vietnamese',
    genre: 'Self-help'
  },
  {
    id: 'book-003',
    title: 'To Kill a Mockingbird',
    category: ProductCategory.BOOK,
    value: 160000,
    price: 195000,
    barcode: '9780061120084',
    description: 'New, special anniversary edition',
    quantity: 30,
    warehouseEntryDate: '2024-09-05',
    dimensions: {
      width: 13.5,
      height: 20.3,
      depth: 1.7
    },
    weight: 0.35,
    authors: ['Harper Lee'],
    coverType: CoverType.PAPERBACK,
    publisher: 'Harper Perennial',
    publicationDate: '2005-07-05',
    pages: 336,
    language: 'English',
    genre: 'Classic Fiction'
  },
  {
    id: 'book-004',
    title: 'Sapiens: A Brief History of Humankind',
    category: ProductCategory.BOOK,
    value: 220000,
    price: 250000,
    discount: 15, // 15% discount
    barcode: '9780062316097',
    description: 'New, illustrated hardcover edition',
    quantity: 18,
    warehouseEntryDate: '2024-08-12',
    dimensions: {
      width: 15.2,
      height: 22.9,
      depth: 3.8
    },
    weight: 0.68,
    authors: ['Yuval Noah Harari'],
    coverType: CoverType.HARDCOVER,
    publisher: 'Harper',
    publicationDate: '2015-02-10',
    pages: 464,
    language: 'English',
    genre: 'Non-fiction'
  },
  {
    id: 'book-005',
    title: 'Nhà Giả Kim',
    category: ProductCategory.BOOK,
    value: 85000,
    price: 109000,
    barcode: '8935235228320',
    description: 'New, Vietnamese translation of The Alchemist',
    quantity: 65,
    warehouseEntryDate: '2024-10-02',
    dimensions: {
      width: 13,
      height: 20,
      depth: 1.2
    },
    weight: 0.28,
    authors: ['Paulo Coelho'],
    coverType: CoverType.PAPERBACK,
    publisher: 'NXB Hội Nhà Văn',
    publicationDate: '2020-03-01',
    pages: 224,
    language: 'Vietnamese',
    genre: 'Fiction'
  },
  {
    id: 'book-006',
    title: '1984',
    category: ProductCategory.BOOK,
    value: 140000,
    price: 165000,
    barcode: '9780451524935',
    description: 'New, classic dystopian novel',
    quantity: 22,
    warehouseEntryDate: '2024-09-18',
    dimensions: {
      width: 13,
      height: 19.8,
      depth: 1.9
    },
    weight: 0.32,
    authors: ['George Orwell'],
    coverType: CoverType.PAPERBACK,
    publisher: 'Signet Classic',
    publicationDate: '1961-01-01',
    pages: 328,
    language: 'English',
    genre: 'Dystopian Fiction'
  },
  {
    id: 'book-007',
    title: 'Atomic Habits',
    category: ProductCategory.BOOK,
    value: 190000,
    price: 230000,
    discount: 5, // 5% discount
    barcode: '9780735211292',
    description: 'New, bestselling self-improvement book',
    quantity: 35,
    warehouseEntryDate: '2024-10-25',
    dimensions: {
      width: 14,
      height: 21,
      depth: 2.3
    },
    weight: 0.45,
    authors: ['James Clear'],
    coverType: CoverType.HARDCOVER,
    publisher: 'Avery',
    publicationDate: '2018-10-16',
    pages: 320,
    language: 'English',
    genre: 'Self-help'
  },
  {
    id: 'book-008',
    title: 'Harry Potter và Hòn Đá Phù Thủy',
    category: ProductCategory.BOOK,
    value: 125000,
    price: 150000,
    barcode: '8934974170617',
    description: 'New, Vietnamese translation of Harry Potter and the Philosopher\'s Stone',
    quantity: 28,
    warehouseEntryDate: '2024-11-10',
    dimensions: {
      width: 14.5,
      height: 20.5,
      depth: 2.5
    },
    weight: 0.4,
    authors: ['J.K. Rowling'],
    coverType: CoverType.PAPERBACK,
    publisher: 'NXB Trẻ',
    publicationDate: '2022-05-01',
    pages: 366,
    language: 'Vietnamese',
    genre: 'Fantasy'
  },
  {
    id: 'book-009',
    title: 'The Hobbit',
    category: ProductCategory.BOOK,
    value: 175000,
    price: 200000,
    barcode: '9780261102217',
    description: 'New, illustrated edition',
    quantity: 15,
    warehouseEntryDate: '2024-09-28',
    dimensions: {
      width: 13,
      height: 19.7,
      depth: 2.8
    },
    weight: 0.38,
    authors: ['J.R.R. Tolkien'],
    coverType: CoverType.PAPERBACK,
    publisher: 'HarperCollins',
    publicationDate: '1991-03-01',
    pages: 400,
    language: 'English',
    genre: 'Fantasy'
  },
  {
    id: 'book-010',
    title: 'Thinking, Fast and Slow',
    category: ProductCategory.BOOK,
    value: 210000,
    price: 245000,
    barcode: '9780374533557',
    description: 'New, Nobel Prize winner\'s work on behavioral economics',
    quantity: 12,
    warehouseEntryDate: '2024-10-05',
    dimensions: {
      width: 14,
      height: 21.3,
      depth: 3.3
    },
    weight: 0.55,
    authors: ['Daniel Kahneman'],
    coverType: CoverType.PAPERBACK,
    publisher: 'Farrar, Straus and Giroux',
    publicationDate: '2013-04-02',
    pages: 499,
    language: 'English',
    genre: 'Psychology'
  },
  
  // CDs
  {
    id: 'cd-001',
    title: 'Thriller',
    category: ProductCategory.CD,
    value: 200000,
    price: 220000,
    discount: 20, // 20% discount
    barcode: '074643811224',
    description: 'New, sealed in original packaging',
    quantity: 15,
    warehouseEntryDate: '2024-09-20',
    dimensions: {
      width: 12.5,
      height: 12.5,
      depth: 1
    },
    weight: 0.1,
    artists: ['Michael Jackson'],
    recordLabel: 'Epic',
    tracklist: [
      'Wanna Be Startin\' Somethin\'',
      'Baby Be Mine',
      'The Girl Is Mine',
      'Thriller',
      'Beat It',
      'Billie Jean',
      'Human Nature',
      'P.Y.T. (Pretty Young Thing)',
      'The Lady in My Life'
    ],
    genre: 'Pop',
    releaseDate: '1982-11-30'
  },
  {
    id: 'cd-002',
    title: 'Back in Black',
    category: ProductCategory.CD,
    value: 180000,
    price: 210000,
    barcode: '696998020627',
    description: 'New, remastered edition',
    quantity: 20,
    warehouseEntryDate: '2024-10-10',
    dimensions: {
      width: 12.5,
      height: 12.5,
      depth: 1
    },
    weight: 0.1,
    artists: ['AC/DC'],
    recordLabel: 'Atlantic',
    tracklist: [
      'Hells Bells',
      'Shoot to Thrill',
      'What Do You Do for Money Honey',
      'Given the Dog a Bone',
      'Let Me Put My Love into You',
      'Back in Black',
      'You Shook Me All Night Long',
      'Have a Drink on Me',
      'Shake a Leg',
      'Rock and Roll Ain\'t Noise Pollution'
    ],
    genre: 'Rock',
    releaseDate: '1980-07-25'
  },
  {
    id: 'cd-003',
    title: 'The Dark Side of the Moon',
    category: ProductCategory.CD,
    value: 190000,
    price: 215000,
    barcode: '724349691704',
    description: 'New, deluxe edition with bonus tracks',
    quantity: 18,
    warehouseEntryDate: '2024-09-15',
    dimensions: {
      width: 12.5,
      height: 12.5,
      depth: 1
    },
    weight: 0.1,
    artists: ['Pink Floyd'],
    recordLabel: 'Harvest',
    tracklist: [
      'Speak to Me',
      'Breathe',
      'On the Run',
      'Time',
      'The Great Gig in the Sky',
      'Money',
      'Us and Them',
      'Any Colour You Like',
      'Brain Damage',
      'Eclipse'
    ],
    genre: 'Progressive Rock',
    releaseDate: '1973-03-01'
  },
  {
    id: 'cd-004',
    title: 'Rumours',
    category: ProductCategory.CD,
    value: 175000,
    price: 195000,
    barcode: '081227980139',
    description: 'New, classic album reissue',
    quantity: 12,
    warehouseEntryDate: '2024-10-05',
    dimensions: {
      width: 12.5,
      height: 12.5,
      depth: 1
    },
    weight: 0.1,
    artists: ['Fleetwood Mac'],
    recordLabel: 'Warner Bros.',
    tracklist: [
      'Second Hand News',
      'Dreams',
      'Never Going Back Again',
      'Don\'t Stop',
      'Go Your Own Way',
      'Songbird',
      'The Chain',
      'You Make Loving Fun',
      'I Don\'t Want to Know',
      'Oh Daddy',
      'Gold Dust Woman'
    ],
    genre: 'Rock',
    releaseDate: '1977-02-04'
  },
  {
    id: 'cd-005',
    title: 'Emotion',
    category: ProductCategory.CD,
    value: 160000,
    price: 185000,
    barcode: '602547384553',
    description: 'New, pop album with critical acclaim',
    quantity: 22,
    warehouseEntryDate: '2024-11-01',
    dimensions: {
      width: 12.5,
      height: 12.5,
      depth: 1
    },
    weight: 0.1,
    artists: ['Carly Rae Jepsen'],
    recordLabel: 'Interscope',
    tracklist: [
      'Run Away with Me',
      'Emotion',
      'I Really Like You',
      'Gimmie Love',
      'All That',
      'Boy Problems',
      'Making the Most of the Night',
      'Your Type',
      'Let\'s Get Lost',
      'LA Hallucinations',
      'Warm Blood',
      'When I Needed You'
    ],
    genre: 'Pop',
    releaseDate: '2015-06-24'
  },
  {
    id: 'cd-006',
    title: 'Kind of Blue',
    category: ProductCategory.CD,
    value: 195000,
    price: 225000,
    barcode: '886976222727',
    description: 'New, essential jazz album remastered',
    quantity: 10,
    warehouseEntryDate: '2024-09-25',
    dimensions: {
      width: 12.5,
      height: 12.5,
      depth: 1
    },
    weight: 0.1,
    artists: ['Miles Davis'],
    recordLabel: 'Columbia',
    tracklist: [
      'So What',
      'Freddie Freeloader',
      'Blue in Green',
      'All Blues',
      'Flamenco Sketches'
    ],
    genre: 'Jazz',
    releaseDate: '1959-08-17'
  },
  
  // LP Records
  {
    id: 'lp-001',
    title: 'Dark Side of the Moon',
    category: ProductCategory.LP,
    value: 500000,
    price: 600000,
    barcode: '5099902987613',
    description: 'New, 180g vinyl, gatefold sleeve',
    quantity: 10,
    warehouseEntryDate: '2024-10-10',
    dimensions: {
      width: 31,
      height: 31,
      depth: 0.5
    },
    weight: 0.3,
    artists: ['Pink Floyd'],
    recordLabel: 'Harvest',
    tracklist: [
      'Speak to Me',
      'Breathe',
      'On the Run',
      'Time',
      'The Great Gig in the Sky',
      'Money',
      'Us and Them',
      'Any Colour You Like',
      'Brain Damage',
      'Eclipse'
    ],
    genre: 'Progressive Rock',
    releaseDate: '1973-03-01'
  },
  {
    id: 'lp-002',
    title: 'Abbey Road',
    category: ProductCategory.LP,
    value: 550000,
    price: 650000,
    barcode: '094638246817',
    description: 'New, 50th anniversary edition, 180g vinyl',
    quantity: 8,
    warehouseEntryDate: '2024-11-05',
    dimensions: {
      width: 31,
      height: 31,
      depth: 0.5
    },
    weight: 0.35,
    artists: ['The Beatles'],
    recordLabel: 'Apple Records',
    tracklist: [
      'Come Together',
      'Something',
      'Maxwell\'s Silver Hammer',
      'Oh! Darling',
      'Octopus\'s Garden',
      'I Want You (She\'s So Heavy)',
      'Here Comes the Sun',
      'Because',
      'You Never Give Me Your Money',
      'Sun King',
      'Mean Mr. Mustard',
      'Polythene Pam',
      'She Came in Through the Bathroom Window',
      'Golden Slumbers',
      'Carry That Weight',
      'The End',
      'Her Majesty'
    ],
    genre: 'Rock',
    releaseDate: '1969-09-26'
  },
  {
    id: 'lp-003',
    title: 'Rumours',
    category: ProductCategory.LP,
    value: 520000,
    price: 620000,
    discount: 25, // 25% discount
    barcode: '603497846214',
    description: 'New, audiophile pressing, 45rpm',
    quantity: 5,
    warehouseEntryDate: '2024-10-20',
    dimensions: {
      width: 31,
      height: 31,
      depth: 0.5
    },
    weight: 0.4,
    artists: ['Fleetwood Mac'],
    recordLabel: 'Warner Bros.',
    tracklist: [
      'Second Hand News',
      'Dreams',
      'Never Going Back Again',
      'Don\'t Stop',
      'Go Your Own Way',
      'Songbird',
      'The Chain',
      'You Make Loving Fun',
      'I Don\'t Want to Know',
      'Oh Daddy',
      'Gold Dust Woman'
    ],
    genre: 'Rock',
    releaseDate: '1977-02-04'
  },
  {
    id: 'lp-004',
    title: 'Purple Rain',
    category: ProductCategory.LP,
    value: 480000,
    price: 580000,
    barcode: '081227962654',
    description: 'New, deluxe reissue, purple vinyl',
    quantity: 12,
    warehouseEntryDate: '2024-09-18',
    dimensions: {
      width: 31,
      height: 31,
      depth: 0.5
    },
    weight: 0.3,
    artists: ['Prince and the Revolution'],
    recordLabel: 'Warner Bros.',
    tracklist: [
      'Let\'s Go Crazy',
      'Take Me with U',
      'The Beautiful Ones',
      'Computer Blue',
      'Darling Nikki',
      'When Doves Cry',
      'I Would Die 4 U',
      'Baby I\'m a Star',
      'Purple Rain'
    ],
    genre: 'Pop/Rock',
    releaseDate: '1984-06-25'
  },
  {
    id: 'lp-005',
    title: 'Blue Train',
    category: ProductCategory.LP,
    value: 600000,
    price: 700000,
    barcode: '602547091659',
    description: 'New, Blue Note Classic Series, 180g vinyl',
    quantity: 6,
    warehouseEntryDate: '2024-10-15',
    dimensions: {
      width: 31,
      height: 31,
      depth: 0.5
    },
    weight: 0.35,
    artists: ['John Coltrane'],
    recordLabel: 'Blue Note',
    tracklist: [
      'Blue Train',
      'Moment\'s Notice',
      'Locomotion',
      'I\'m Old Fashioned',
      'Lazy Bird'
    ],
    genre: 'Jazz',
    releaseDate: '1958-01-15'
  },
  
  // DVDs
  {
    id: 'dvd-001',
    title: 'The Shawshank Redemption',
    category: ProductCategory.DVD,
    value: 180000,
    price: 200000,
    barcode: '5051892045605',
    description: 'New, special edition with director commentary',
    quantity: 20,
    warehouseEntryDate: '2024-11-05',
    dimensions: {
      width: 13.5,
      height: 19,
      depth: 1.5
    },
    weight: 0.15,
    discType: DiscType.BLURAY,
    director: 'Frank Darabont',
    runtime: 142,
    studio: 'Castle Rock Entertainment',
    language: ['English', 'French'],
    subtitles: ['English', 'French', 'Vietnamese', 'Chinese'],
    releaseDate: '1994-09-23',
    genre: 'Drama'
  },
  {
    id: 'dvd-002',
    title: 'The Godfather Collection',
    category: ProductCategory.DVD,
    value: 350000,
    price: 400000,
    discount: -100, // 30% discount
    barcode: '097361386645',
    description: 'New, trilogy box set, remastered',
    quantity: 8,
    warehouseEntryDate: '2024-10-10',
    dimensions: {
      width: 15,
      height: 21,
      depth: 3.5
    },
    weight: 0.5,
    discType: DiscType.BLURAY,
    director: 'Francis Ford Coppola',
    runtime: 539, // Total for all 3 films
    studio: 'Paramount Pictures',
    language: ['English', 'Italian'],
    subtitles: ['English', 'French', 'Spanish', 'Vietnamese'],
    releaseDate: '1972-03-24',
    genre: 'Crime/Drama'
  },
  {
    id: 'dvd-003',
    title: 'Inception',
    category: ProductCategory.DVD,
    value: 190000,
    price: 220000,
    barcode: '5051890045201',
    description: 'New, 4K UHD + Blu-ray combo',
    quantity: 15,
    warehouseEntryDate: '2024-09-28',
    dimensions: {
      width: 13.5,
      height: 17,
      depth: 1.5
    },
    weight: 0.18,
    discType: DiscType.BLURAY,
    director: 'Christopher Nolan',
    runtime: 148,
    studio: 'Warner Bros.',
    language: ['English', 'French', 'Spanish'],
    subtitles: ['English', 'French', 'Spanish', 'Vietnamese', 'Chinese'],
    releaseDate: '2010-07-16',
    genre: 'Sci-Fi/Action'
  },
  {
    id: 'dvd-004',
    title: 'Parasite',
    category: ProductCategory.DVD,
    value: 210000,
    price: 240000,
    barcode: '8809658313426',
    description: 'New, Academy Award winner, Criterion Collection',
    quantity: 12,
    warehouseEntryDate: '2024-10-18',
    dimensions: {
      width: 13.5,
      height: 19,
      depth: 1.5
    },
    weight: 0.16,
    discType: DiscType.BLURAY,
    director: 'Bong Joon-ho',
    runtime: 132,
    studio: 'CJ Entertainment',
    language: ['Korean'],
    subtitles: ['English', 'French', 'Spanish', 'Vietnamese', 'Chinese'],
    releaseDate: '2019-05-30',
    genre: 'Drama/Thriller'
  },
  {
    id: 'dvd-005',
    title: 'Breaking Bad: The Complete Series',
    category: ProductCategory.DVD,
    value: 580000,
    price: 650000,
    barcode: '043396439375',
    description: 'New, complete box set, all seasons',
    quantity: 6,
    warehouseEntryDate: '2024-11-02',
    dimensions: {
      width: 17,
      height: 22,
      depth: 5
    },
    weight: 1.2,
    discType: DiscType.BLURAY,
    director: 'Various',
    runtime: 3000, // Approximate total runtime
    studio: 'Sony Pictures',
    language: ['English'],
    subtitles: ['English', 'French', 'Spanish', 'Vietnamese'],
    releaseDate: '2013-11-26',
    genre: 'Drama/Crime'
  },
  {
    id: 'dvd-006',
    title: 'The Lord of the Rings: Extended Edition Trilogy',
    category: ProductCategory.DVD,
    value: 620000,
    price: 700000,
    barcode: '5051892242172',
    description: 'New, extended editions, bonus features',
    quantity: 5,
    warehouseEntryDate: '2024-10-25',
    dimensions: {
      width: 16,
      height: 22,
      depth: 6
    },
    weight: 1.5,
    discType: DiscType.BLURAY,
    director: 'Peter Jackson',
    runtime: 682, // Extended editions total
    studio: 'New Line Cinema',
    language: ['English', 'French', 'Spanish'],
    subtitles: ['English', 'French', 'Spanish', 'Vietnamese', 'Chinese', 'Korean'],
    releaseDate: '2001-12-19',
    genre: 'Fantasy/Adventure'
  },
  {
    id: 'dvd-007',
    title: 'The Matrix Trilogy',
    category: ProductCategory.DVD,
    value: 280000,
    price: 320000,
    barcode: '5051892075206',
    description: 'New, 4K remastered collection',
    quantity: 15,
    warehouseEntryDate: '2024-09-15',
    dimensions: {
      width: 15,
      height: 21,
      depth: 3
    },
    weight: 0.45,
    discType: DiscType.BLURAY,
    director: 'The Wachowskis',
    runtime: 415, // Total for all 3 films
    studio: 'Warner Bros.',
    language: ['English', 'French', 'German'],
    subtitles: ['English', 'French', 'Spanish', 'German', 'Vietnamese'],
    releaseDate: '1999-03-31',
    genre: 'Sci-Fi/Action'
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'admin',
    email: 'admin@aims.com',
    roles: [UserRole.ADMIN],
    isBlocked: false
  },
  {
    id: 'user-002',
    username: 'product_manager',
    email: 'pm@aims.com',
    roles: [UserRole.PRODUCT_MANAGER],
    isBlocked: false
  },
  {
    id: 'user-003',
    username: 'super_user',
    email: 'super@aims.com',
    roles: [UserRole.ADMIN, UserRole.PRODUCT_MANAGER],
    isBlocked: false
  },
  {
    id: 'user-004',
    username: 'inventory_admin',
    email: 'inventory@aims.com',
    roles: [UserRole.PRODUCT_MANAGER],
    isBlocked: false
  },
  {
    id: 'user-005',
    username: 'system_admin',
    email: 'system@aims.com',
    roles: [UserRole.ADMIN],
    isBlocked: false
  },
  {
    id: 'user-006',
    username: 'john_manager',
    email: 'john@aims.com',
    roles: [UserRole.PRODUCT_MANAGER],
    isBlocked: true // Example of a blocked user
  },
  {
    id: 'user-007',
    username: 'sarah_admin',
    email: 'sarah@aims.com',
    roles: [UserRole.ADMIN],
    isBlocked: false
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-001',
    items: [
      {
        product: mockProducts[0], // The Great Gatsby
        quantity: 2,
        price: mockProducts[0].price
      },
      {
        product: mockProducts[2], // Thriller
        quantity: 1,
        price: mockProducts[2].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Nguyen Van A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      province: 'Hanoi',
      address: '123 Cau Giay Street, Cau Giay District',
      isRushDelivery: true,
      rushDeliveryTime: '2025-03-05T14:00:00',
      rushDeliveryInstructions: 'Please call before delivering'
    },
    status: OrderStatus.PENDING_PROCESSING,
    subtotal: 580000, // 2*180000 + 1*220000
    vat: 58000, // 10% of subtotal
    deliveryFee: 22000, // Base fee for Hanoi
    totalAmount: 660000, // subtotal + vat + deliveryFee
    transactionId: 'VNP1234567890',
    transactionContent: 'Payment for order #order-001',
    transactionDatetime: '2025-03-04T10:15:30',
    createdAt: '2025-03-04T10:15:30'
  },
  {
    id: 'order-002',
    items: [
      {
        product: mockProducts[3], // Dark Side of the Moon LP
        quantity: 1,
        price: mockProducts[3].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Tran Thi B',
      email: 'tranthib@example.com',
      phone: '0909876543',
      province: 'Ho Chi Minh City',
      address: '456 Le Loi Street, District 1',
      isRushDelivery: false
    },
    status: OrderStatus.APPROVED,
    subtotal: 600000,
    vat: 60000,
    deliveryFee: 0, // Free shipping as order > 100,000 VND
    totalAmount: 660000,
    transactionId: 'VNP0987654321',
    transactionContent: 'Payment for order #order-002',
    transactionDatetime: '2025-03-03T15:45:22',
    createdAt: '2025-03-03T15:45:22'
  },
  {
    id: 'order-003',
    items: [
      {
        product: mockProducts[9], // Thinking, Fast and Slow book
        quantity: 1,
        price: mockProducts[9].price
      },
      {
        product: mockProducts[12], // Kind of Blue CD
        quantity: 2,
        price: mockProducts[12].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Le Van C',
      email: 'levanc@example.com',
      phone: '0912345678',
      province: 'Da Nang',
      address: '789 Bach Dang Street',
      isRushDelivery: false
    },
    status: OrderStatus.APPROVED,
    subtotal: 695000, // 1*245000 + 2*225000
    vat: 69500,
    deliveryFee: 0, // Free shipping as order > 100,000 VND
    totalAmount: 764500,
    transactionId: 'VNP2468135790',
    transactionContent: 'Payment for order #order-003',
    transactionDatetime: '2025-03-02T09:30:15',
    createdAt: '2025-03-02T09:30:15'
  },
  {
    id: 'order-004',
    items: [
      {
        product: mockProducts[21], // Parasite DVD
        quantity: 1,
        price: mockProducts[21].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Pham Thi D',
      email: 'phamthid@example.com',
      phone: '0978123456',
      province: 'Hai Phong',
      address: '246 Lach Tray Street',
      isRushDelivery: false
    },
    status: OrderStatus.CANCELLED,
    subtotal: 240000,
    vat: 24000,
    deliveryFee: 0, // Free shipping as order > 100,000 VND
    totalAmount: 264000,
    transactionId: 'VNP1357924680',
    transactionContent: 'Payment for order #order-004',
    transactionDatetime: '2025-03-01T14:20:45',
    createdAt: '2025-03-01T14:20:45'
  },
  {
    id: 'order-005',
    items: [
      {
        product: mockProducts[14], // Back in Black CD
        quantity: 1,
        price: mockProducts[14].price
      },
      {
        product: mockProducts[5], // 1984 book
        quantity: 1,
        price: mockProducts[5].price
      },
      {
        product: mockProducts[22], // Breaking Bad DVD set
        quantity: 1,
        price: mockProducts[22].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Hoang Van E',
      email: 'hoangvane@example.com',
      phone: '0961234567',
      province: 'Hanoi',
      address: '135 Tran Duy Hung Street, Cau Giay District',
      isRushDelivery: true,
      rushDeliveryTime: '2025-03-06T16:30:00',
      rushDeliveryInstructions: 'Leave with security guard if not home'
    },
    status: OrderStatus.PENDING_PROCESSING,
    subtotal: 1025000, // 1*210000 + 1*165000 + 1*650000
    vat: 102500,
    deliveryFee: 32000, // Base fee for Hanoi + rush fee
    totalAmount: 1159500,
    transactionId: 'VNP9876543210',
    transactionContent: 'Payment for order #order-005',
    transactionDatetime: '2025-03-05T12:10:55',
    createdAt: '2025-03-05T12:10:55'
  },
  {
    id: 'order-006',
    items: [
      {
        product: mockProducts[7], // Harry Potter book
        quantity: 3,
        price: mockProducts[7].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Nguyen Thi F',
      email: 'nguyenthif@example.com',
      phone: '0932145678',
      province: 'Can Tho',
      address: '357 Nguyen Van Cu Street',
      isRushDelivery: false
    },
    status: OrderStatus.REJECTED,
    subtotal: 450000, // 3*150000
    vat: 45000,
    deliveryFee: 0, // Free shipping as order > 100,000 VND
    totalAmount: 495000,
    transactionId: 'VNP0246813579',
    transactionContent: 'Payment for order #order-006',
    transactionDatetime: '2025-02-28T08:45:30',
    createdAt: '2025-02-28T08:45:30'
  },
  {
    id: 'order-007',
    items: [
      {
        product: mockProducts[16], // Abbey Road LP
        quantity: 1,
        price: mockProducts[16].price
      },
      {
        product: mockProducts[17], // Rumours LP
        quantity: 1,
        price: mockProducts[17].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Tran Van G',
      email: 'tranvang@example.com',
      phone: '0945678123',
      province: 'Ho Chi Minh City',
      address: '468 Nguyen Hue Boulevard, District 1',
      isRushDelivery: false
    },
    status: OrderStatus.APPROVED,
    subtotal: 1270000, // 1*650000 + 1*620000
    vat: 127000,
    deliveryFee: 0, // Free shipping as order > 100,000 VND
    totalAmount: 1397000,
    transactionId: 'VNP1029384756',
    transactionContent: 'Payment for order #order-007',
    transactionDatetime: '2025-03-04T16:35:20',
    createdAt: '2025-03-04T16:35:20'
  },
  {
    id: 'order-008',
    items: [
      {
        product: mockProducts[23], // Lord of the Rings DVD set
        quantity: 1,
        price: mockProducts[23].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Le Thi H',
      email: 'lethih@example.com',
      phone: '0957812346',
      province: 'Hanoi',
      address: '579 Kim Ma Street, Ba Dinh District',
      isRushDelivery: false
    },
    status: OrderStatus.APPROVED,
    subtotal: 700000,
    vat: 70000,
    deliveryFee: 0, // Free shipping as order > 100,000 VND
    totalAmount: 770000,
    transactionId: 'VNP5647382910',
    transactionContent: 'Payment for order #order-008',
    transactionDatetime: '2025-03-03T11:25:40',
    createdAt: '2025-03-03T11:25:40'
  },
  {
    id: 'order-009',
    items: [
      {
        product: mockProducts[8], // The Hobbit book
        quantity: 1,
        price: mockProducts[8].price
      },
      {
        product: mockProducts[4], // Nhà Giả Kim book
        quantity: 2,
        price: mockProducts[4].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Pham Van I',
      email: 'phamvani@example.com',
      phone: '0968135792',
      province: 'Hai Phong',
      address: '681 Lach Tray Street',
      isRushDelivery: false
    },
    status: OrderStatus.PENDING_PROCESSING,
    subtotal: 418000, // 1*200000 + 2*109000
    vat: 41800,
    deliveryFee: 0, // Free shipping as order > 100,000 VND
    totalAmount: 459800,
    transactionId: 'VNP1472583690',
    transactionContent: 'Payment for order #order-009',
    transactionDatetime: '2025-03-05T09:15:35',
    createdAt: '2025-03-05T09:15:35'
  },
  {
    id: 'order-010',
    items: [
      {
        product: mockProducts[24], // The Matrix Trilogy DVD
        quantity: 1,
        price: mockProducts[24].price
      },
      {
        product: mockProducts[6], // Atomic Habits book
        quantity: 1,
        price: mockProducts[6].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Nguyen Van J',
      email: 'nguyenvanj@example.com',
      phone: '0921456789',
      province: 'Da Nang',
      address: '792 Nguyen Van Linh Street',
      isRushDelivery: false
    },
    status: OrderStatus.PENDING_PROCESSING,
    subtotal: 550000, // 1*320000 + 1*230000
    vat: 55000,
    deliveryFee: 0, // Free shipping as order > 100,000 VND
    totalAmount: 605000,
    transactionId: 'VNP3692581470',
    transactionContent: 'Payment for order #order-010',
    transactionDatetime: '2025-03-05T14:50:25',
    createdAt: '2025-03-05T14:50:25'
  }
];