// mock events for testing without backend
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Fall Concert",
    description: "Live bands and food trucks on the quad.",
    date: "2025-10-21T18:00:00Z",
    location: "Student Center",
    category: "Music",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop"
  },
  {
    id: 2,
    title: "Career Fair",
    description: "Meet recruiters from top companies.",
    date: "2025-11-05T18:00:00Z",
    location: "Lane Stadium",
    category: "Career",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
  },
  {
    id: 3,
    title: "Hackathon",
    description: "24-hour campus-wide hackathon.",
    date: "2025-10-30T15:30:00Z",
    location: "Goodwin Hall 190",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop"
  },
  {
    id: 4,
    title: "Charity Run",
    description: "5K run to raise funds for local shelters.",
    date: "2025-10-28T08:00:00Z",
    location: "Duck Pond Trail",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop"
  },
  {
    id: 5,
    title: "Cultural Night",
    description: "An evening celebrating global food, music, and dance.",
    date: "2025-11-12T19:00:00Z",
    location: "Burruss Auditorium",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop"
  },
  {
    id: 6,
    title: "Entrepreneurship Panel",
    description: "Startup founders discuss how they built their companies.",
    date: "2025-11-20T17:00:00Z",
    location: "Newman Library Multipurpose Room",
    category: "Business",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
  }
];

// listing all events
export async function listEvents() {
  return { items: MOCK_EVENTS };
}

// getting event by ID
export async function getEvent(id) {
  const e = MOCK_EVENTS.find(ev => ev.id === Number(id));
  if (!e) throw new Error("Event not found");
  return e;
}
