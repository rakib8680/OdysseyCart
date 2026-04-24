export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  shortDesc: string;
  fullDesc: string;
  image: string;
  status: 'Active' | 'Draft';
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "odyssey-concept-1",
    name: "Odyssey Concept I",
    category: "Tech",
    price: 299.99,
    shortDesc: "Limited Edition geometric tech piece for your desk.",
    fullDesc: "The Odyssey Concept I redefines minimalist desk setups. Forged from premium materials with rigorous geometric balance, this limited piece stands as a testament to modern engineering.",
    image: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=800&q=80",
    status: 'Active'
  },
  {
    id: "geometric-base",
    name: "Geometric Base",
    category: "Furniture",
    price: 149.00,
    shortDesc: "A perfectly balanced structural stand.",
    fullDesc: "Elevate your essentials. The Geometric Base uses striking lines and aerospace-grade aluminum to hold monitors, laptops, or art pieces securely.",
    image: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=800&q=80",
    status: 'Active'
  },
  {
    id: "horizon-lamp",
    name: "Horizon Ambient Lamp",
    category: "Tech",
    price: 189.50,
    shortDesc: "Sleek, temperature-adjustable accent lighting.",
    fullDesc: "Cast the perfect glow. The Horizon Lamp mimics natural dusk and dawn lighting perfectly encapsulated within a sleek matte-black monolith.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    status: 'Active'
  },
  {
    id: "aero-backpack",
    name: "Aero Modular Pack",
    category: "Accessories",
    price: 220.00,
    shortDesc: "Weatherproof carry for your daily operations.",
    fullDesc: "Navigate the concrete jungle without compromising on form. The Aero Modular Pack features an adaptive strap system and watertight zippers.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    status: 'Active'
  },
  {
    id: "prism-keyboard",
    name: "Prism Mechanical",
    category: "Tech",
    price: 340.00,
    shortDesc: "Custom tactile layout with deep sound profile.",
    fullDesc: "A typist's dream. The Prism Mechanical is gasket-mounted and comes pre-lubricated to deliver an incredibly deep, resonant auditory thock.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    status: 'Active'
  },
  {
    id: "void-mug",
    name: "Obsidian Void Mug",
    category: "Accessories",
    price: 45.00,
    shortDesc: "Double-walled absolute black ceramic.",
    fullDesc: "Your coffee stays hot while the mug stays cool. Fired in extreme heat to achieve absolute black coverage, it's the only mug you'll ever need.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    status: 'Active'
  }
];
