export const PRODUCTS = [
  {
    id: "f7f3a340-4e47-4a87-b72b-4479f989b9b4",
    name: "Product 1",
    description: "A cool product",
    price: 29.99,
    tags: ["tag1", "tag2"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "be7f0178-5c7f-47c7-b50a-eaff1f4a1eb8",
    name: "Product 2",
    description: "Another awesome product",
    price: 49.99,
    tags: ["tag3", "tag4"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const ARTICLES = [
  {
    id: "1f8b1e58-6f50-4003-bb66-25e9e31e71ff",
    title: "First Article",
    content: "Content of the first article",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "d28e3c11-93e6-42ac-bf56-d1fcb7391d73",
    title: "Second Article",
    content: "Content of the second article",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const COMMENTS = [
  {
    id: "1b30d3c8-dabe-48c5-b5a0-b7efcc8f529e",
    content: "Great product!",
    createdAt: new Date(),
    productId: "f7f3a340-4e47-4a87-b72b-4479f989b9b4", // Referencing Product
    articleId: null, // No article for this comment
  },
  {
    id: "3e2a8bc5-5f74-4a8c-b60f-b6d155f2a39c",
    content: "Very informative article.",
    createdAt: new Date(),
    productId: null, // No product for this comment
    articleId: "1f8b1e58-6f50-4003-bb66-25e9e31e71ff", // Referencing Article
  },
  {
    id: "a62f8f96-6f82-4423-91d3-460b92880f0b",
    content: "Nice features.",
    createdAt: new Date(),
    productId: "be7f0178-5c7f-47c7-b50a-eaff1f4a1eb8", // Referencing Product
    articleId: null, // No article for this comment
  },
];
