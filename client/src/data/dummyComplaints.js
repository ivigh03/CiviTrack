const dummyComplaints = [
  {
    _id: "1",
    title: "Road damage near market",
    description: "Huge potholes causing accidents",
    category: "road",
    area: "Downtown",
    status: "open",
    votes: 10,
    downvotes: 2,
    images: ["https://via.placeholder.com/150"],
    comments: [
      { text: "Very dangerous!", user: "Aman" },
      { text: "Needs urgent fix", user: "Riya" }
    ],
    createdAt: "2026-01-01",
  },
];
export default dummyComplaints;