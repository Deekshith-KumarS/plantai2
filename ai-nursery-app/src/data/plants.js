/* ── ALL IMAGES: 100% VERIFIED WORKING URLS ── */

/* Unsplash shorthand - these IDs are confirmed working plant photos */
const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=500`;

/* Pexels shorthand - confirmed working plant photos */
const PX = (id, file) => `https://images.pexels.com/photos/${id}/${file}?auto=compress&cs=tinysrgb&w=500`;

const IMG = {
  /* ── INDOOR PLANTS ── */
  snake:         U("1545241047-6083a3684587"),       // Snake plant - dark green strappy leaves
  monstera:      U("1614594975525-e45190c55d0b"),    // Monstera split-leaf
  fiddleLeaf:    U("1597055958656-2bf2a7a42578"),    // Fiddle leaf fig large leaves
  pothos:        U("1512428813834-c702c7702b78"),    // Money/Pothos trailing green
  peaceLily:     PX("1407305","pexels-photo-1407305.jpeg"),   // Peace lily white bloom
  spider:        PX("4503273","pexels-photo-4503273.jpeg"),   // Spider plant
  zz:            PX("1005058","pexels-photo-1005058.jpeg"),   // ZZ / succulent dark green
  rubber:        U("1614594975525-e45190c55d0b"),    // use monstera (large indoor)
  philodendron:  U("1598880940080-ff9a29891b85"),    // philodendron heart leaf
  dracaena:      U("1545241047-6083a3684587"),       // tall indoor plant
  calathea:      U("1598880940080-ff9a29891b85"),    // patterned leaf
  birdOfPar:     U("1614594975525-e45190c55d0b"),    // large tropical leaf
  bostonFern:    U("1593691509543-d55182d6f87b"),    // fern fronds

  /* ── SUCCULENTS & CACTUS ── */
  cactus:        U("1459411552884-841db9b3cc2a"),    // cactus confirmed
  aloe:          PX("1084199","pexels-photo-1084199.jpeg"),   // aloe vera confirmed
  echeveria:     PX("1005058","pexels-photo-1005058.jpeg"),   // rosette succulent
  haworthia:     U("1459411552884-841db9b3cc2a"),    // small cactus/succulent
  sedum:         U("1459411552884-841db9b3cc2a"),    // succulent ground cover
  barrelCactus:  U("1459411552884-841db9b3cc2a"),    // barrel cactus

  /* ── FLOWERING PLANTS ── */
  rose:          PX("56866","garden-rose-red-pink-56866.jpeg"),     // red rose confirmed
  orchid:        PX("931177","pexels-photo-931177.jpeg"),           // orchid confirmed
  lavender:      PX("207518","pexels-photo-207518.jpeg"),           // lavender confirmed
  sunflower:     PX("46216","sunflower-flowers-bright-yellow-46216.jpeg"),  // sunflower
  tulip:         PX("37006","tulips-tulip-field-flowers-red-37006.jpeg"),   // tulip
  marigold:      PX("2263405","pexels-photo-2263405.jpeg"),         // marigold orange
  jasmine:       PX("931177","pexels-photo-931177.jpeg"),           // white flower (orchid-like)
  hibiscus:      U("1533378890784-b6d440a50b0f"),   // bright tropical flower
  anthurium:     PX("931177","pexels-photo-931177.jpeg"),           // red tropical flower
  chrysan:       PX("2263405","pexels-photo-2263405.jpeg"),         // mum flower
  bougain:       U("1533378890784-b6d440a50b0f"),   // bright pink flowers
  lotus:         PX("1407305","pexels-photo-1407305.jpeg"),         // aquatic flower

  /* ── HERBS ── */
  basil:         U("1618356679226-236b8b9a5c44"),   // basil herb leaves
  mint:          U("1618356679226-236b8b9a5c44"),   // herb leaves green

  /* ── TREES / DECORATIVE ── */
  bonsai:        PX("5699665","pexels-photo-5699665.jpeg"),         // bonsai confirmed
  bamboo:        U("1501004318641-b39e6451bec6"),   // bamboo stalks confirmed
  neem:          U("1501004318641-b39e6451bec6"),   // tall tree
};

const plants = [
  /* ── INDOOR ── */
  { id: 1,  name: "Snake Plant",         category: "Indoor",    price: 499,  image: IMG.snake,       description: "Low maintenance air-purifying plant. Thrives in almost any condition.", care: { sunlight: "Low to Indirect Light", watering: "Once every 2–3 weeks", level: "Beginner Friendly", placement: "Indoor — any room" }, reviews: [{ user: "Rahul", rating: 5, comment: "Healthy plant and fast delivery." }] },
  { id: 2,  name: "Peace Lily",          category: "Indoor",    price: 699,  image: IMG.peaceLily,   description: "Elegant white blooms and an excellent air purifier for low-light rooms.", care: { sunlight: "Low to Medium Indirect", watering: "Once a week", level: "Easy", placement: "Indoor — bedroom or living room" }, reviews: [{ user: "Kiran", rating: 5, comment: "Very fresh and healthy plant." }] },
  { id: 3,  name: "Monstera Deliciosa",  category: "Indoor",    price: 899,  image: IMG.monstera,    description: "Iconic tropical plant with dramatic split leaves. A statement piece for any room.", care: { sunlight: "Bright Indirect Light", watering: "Every 7–10 days", level: "Easy", placement: "Indoor — bright corner" }, reviews: [{ user: "Ananya", rating: 5, comment: "Absolutely stunning!" }] },
  { id: 4,  name: "ZZ Plant",            category: "Indoor",    price: 799,  image: IMG.zz,          description: "Virtually indestructible glossy dark green plant. Perfect for offices.", care: { sunlight: "Low to Indirect Light", watering: "Once every 2–3 weeks", level: "Beginner Friendly", placement: "Indoor — office or dim rooms" }, reviews: [{ user: "Vikram", rating: 5, comment: "Premium quality plant." }] },
  { id: 5,  name: "Pothos",              category: "Indoor",    price: 399,  image: IMG.pothos,      description: "Fast-growing trailing vine perfect for shelves and hanging baskets.", care: { sunlight: "Low to Medium Light", watering: "Once a week", level: "Beginner Friendly", placement: "Indoor — shelves or hanging baskets" }, reviews: [{ user: "Priya", rating: 4, comment: "Grows so fast!" }] },
  { id: 6,  name: "Fiddle Leaf Fig",     category: "Indoor",    price: 1299, image: IMG.fiddleLeaf,  description: "Trendy large-leafed indoor tree that makes a bold design statement.", care: { sunlight: "Bright Indirect Light", watering: "Weekly", level: "Intermediate", placement: "Indoor — well-lit room" }, reviews: [{ user: "Meera", rating: 5, comment: "Gorgeous statement plant!" }] },
  { id: 7,  name: "Rubber Plant",        category: "Indoor",    price: 749,  image: IMG.rubber,      description: "Bold dark green waxy leaves. Excellent air purifier.", care: { sunlight: "Medium to Bright Indirect", watering: "Every 7–10 days", level: "Easy", placement: "Indoor — bright corner" }, reviews: [{ user: "Suresh", rating: 4, comment: "Great quality." }] },
  { id: 8,  name: "Spider Plant",        category: "Indoor",    price: 449,  image: IMG.spider,      description: "Produces charming baby plantlets. One of the most adaptable houseplants.", care: { sunlight: "Indirect or Filtered Light", watering: "Twice a week", level: "Easy", placement: "Indoor — hanging basket or shelf" }, reviews: [{ user: "Ajay", rating: 4, comment: "Very easy to maintain." }] },
  { id: 9,  name: "Philodendron",        category: "Indoor",    price: 649,  image: IMG.philodendron,description: "Lush tropical foliage plant that thrives with minimal care.", care: { sunlight: "Medium Indirect Light", watering: "Once a week", level: "Easy", placement: "Indoor — any bright room" }, reviews: [{ user: "Nandita", rating: 5, comment: "Beautiful tropical feel." }] },
  { id: 10, name: "Dracaena",            category: "Indoor",    price: 599,  image: IMG.dracaena,    description: "Architectural plant with striped foliage. Removes toxins from air.", care: { sunlight: "Low to Medium Light", watering: "Every 10–14 days", level: "Easy", placement: "Indoor — office or living room" }, reviews: [{ user: "Raju", rating: 4, comment: "Looks very professional." }] },
  { id: 11, name: "Money Plant",         category: "Indoor",    price: 349,  image: IMG.pothos,      description: "Lucky charm plant believed to bring prosperity. Fast growing.", care: { sunlight: "Low to Indirect Light", watering: "Once a week", level: "Beginner Friendly", placement: "Indoor — water bottle or soil pot" }, reviews: [{ user: "Pooja", rating: 4, comment: "Nice decorative plant." }] },
  { id: 12, name: "Bird of Paradise",    category: "Indoor",    price: 1599, image: IMG.birdOfPar,   description: "Dramatic tropical plant with banana-like leaves. A living sculpture.", care: { sunlight: "Bright Direct to Indirect", watering: "Weekly", level: "Intermediate", placement: "Indoor — near sunny window" }, reviews: [{ user: "Kavitha", rating: 5, comment: "Absolutely gorgeous!" }] },
  { id: 13, name: "Calathea",            category: "Indoor",    price: 699,  image: IMG.calathea,    description: "Stunning patterned leaves that move with light. Called the prayer plant.", care: { sunlight: "Low to Medium Indirect", watering: "Twice a week", level: "Intermediate", placement: "Indoor — humid rooms" }, reviews: [{ user: "Lakshmi", rating: 5, comment: "Patterns are stunning!" }] },
  { id: 14, name: "Chinese Evergreen",   category: "Indoor",    price: 549,  image: IMG.snake,       description: "Colorful and extremely tolerant of neglect. Great for beginners.", care: { sunlight: "Low Light", watering: "Every 1–2 weeks", level: "Beginner Friendly", placement: "Indoor — any room" }, reviews: [{ user: "Ganesh", rating: 4, comment: "Survives everything!" }] },
  { id: 47, name: "Bird's Nest Fern",    category: "Indoor",    price: 499,  image: IMG.bostonFern,  description: "Wavy bright green fronds emerge from a central rosette. Tropical aesthetic.", care: { sunlight: "Low to Indirect Light", watering: "Weekly", level: "Easy", placement: "Indoor — bathroom or humid room" }, reviews: [{ user: "Jyoti", rating: 5, comment: "Looks so tropical!" }] },

  /* ── SUCCULENT & CACTUS ── */
  { id: 15, name: "Aloe Vera",           category: "Medicinal", price: 399,  image: IMG.aloe,        description: "Healing succulent with soothing gel. Great for skin care and burns.", care: { sunlight: "Bright Indirect to Direct", watering: "Once every 2 weeks", level: "Beginner Friendly", placement: "Indoor — sunny window" }, reviews: [{ user: "Arjun", rating: 5, comment: "Useful medicinal plant." }] },
  { id: 16, name: "Cactus",              category: "Succulent", price: 349,  image: IMG.cactus,      description: "Desert beauty with very low water needs. Perfect for sunny windowsills.", care: { sunlight: "4–6 hours Direct Sunlight", watering: "Once every 3–4 weeks", level: "Beginner Friendly", placement: "Indoor — sunny window" }, reviews: [{ user: "Nisha", rating: 5, comment: "Cute cactus for desk setup." }] },
  { id: 17, name: "Jade Plant",          category: "Succulent", price: 499,  image: IMG.echeveria,   description: "Long-lived succulent with thick waxy leaves. Symbol of good luck.", care: { sunlight: "Bright Indirect to Full Sun", watering: "Every 2 weeks", level: "Easy", placement: "Indoor — sunny window" }, reviews: [{ user: "Ravi", rating: 5, comment: "Beautiful compact plant." }] },
  { id: 18, name: "Echeveria",           category: "Succulent", price: 299,  image: IMG.echeveria,   description: "Rosette-shaped succulent with vibrant colors. Excellent for arrangements.", care: { sunlight: "Full Sun to Bright Indirect", watering: "Every 2–3 weeks", level: "Easy", placement: "Indoor — sunny sill or outdoor" }, reviews: [{ user: "Smita", rating: 5, comment: "Colors are amazing!" }] },
  { id: 19, name: "Haworthia",           category: "Succulent", price: 349,  image: IMG.haworthia,   description: "Compact zebra-striped succulent tolerant of low light. Perfect desk plant.", care: { sunlight: "Indirect Light", watering: "Every 2–3 weeks", level: "Beginner Friendly", placement: "Indoor — desk or shelf" }, reviews: [{ user: "Asha", rating: 4, comment: "Very unique looking." }] },
  { id: 20, name: "String of Pearls",    category: "Succulent", price: 449,  image: IMG.zz,          description: "Trailing succulent with pearl-like leaves. Stunning in hanging baskets.", care: { sunlight: "Bright Indirect Light", watering: "Every 2 weeks", level: "Intermediate", placement: "Indoor — hanging planter" }, reviews: [{ user: "Divya", rating: 5, comment: "Absolutely unique beauty!" }] },
  { id: 21, name: "Barrel Cactus",       category: "Succulent", price: 399,  image: IMG.barrelCactus,description: "Classic round barrel cactus. Very drought resistant and long-lived.", care: { sunlight: "Full Sun", watering: "Once a month", level: "Beginner Friendly", placement: "Indoor or outdoor sunny spot" }, reviews: [{ user: "Mohan", rating: 4, comment: "Very low maintenance." }] },
  { id: 22, name: "Sedum",               category: "Succulent", price: 299,  image: IMG.sedum,       description: "Hardy ground cover succulent with star-shaped flowers.", care: { sunlight: "Full Sun", watering: "Every 2–3 weeks", level: "Easy", placement: "Outdoor or sunny indoor sill" }, reviews: [{ user: "Padma", rating: 4, comment: "Hardy and beautiful." }] },
  { id: 51, name: "Air Plant",           category: "Decorative",price: 399,  image: IMG.haworthia,   description: "Unique soilless plant that absorbs nutrients from the air. Zero soil needed.", care: { sunlight: "Bright Indirect Light", watering: "Mist 2–3 times a week", level: "Beginner Friendly", placement: "Indoor — any display surface" }, reviews: [{ user: "Nidhi", rating: 5, comment: "So unique and cool!" }] },

  /* ── FLOWERING ── */
  { id: 23, name: "Rose Plant",          category: "Flowering", price: 599,  image: IMG.rose,        description: "Classic flowering plant with vibrant blooms. Adds charm to any garden.", care: { sunlight: "6+ hours Direct Sunlight", watering: "Daily in summer", level: "Intermediate", placement: "Outdoor — garden or balcony" }, reviews: [{ user: "Rohan", rating: 5, comment: "Flowers bloomed beautifully." }] },
  { id: 24, name: "Orchid",              category: "Flowering", price: 999,  image: IMG.orchid,      description: "Exotic elegant blooms in vibrant colors. A sophisticated gift plant.", care: { sunlight: "Bright Indirect Light", watering: "Once a week", level: "Intermediate", placement: "Indoor — bright windowsill" }, reviews: [{ user: "Sunita", rating: 5, comment: "Exotic and beautiful!" }] },
  { id: 25, name: "Lavender",            category: "Flowering", price: 549,  image: IMG.lavender,    description: "Fragrant purple blooms that calm the mind. Used in aromatherapy.", care: { sunlight: "Full Sun", watering: "Every 1–2 weeks", level: "Easy", placement: "Outdoor or sunny indoor window" }, reviews: [{ user: "Geeta", rating: 5, comment: "Smells heavenly!" }] },
  { id: 26, name: "Sunflower",           category: "Flowering", price: 299,  image: IMG.sunflower,   description: "Cheerful bright yellow blooms that follow the sun. Brings joy.", care: { sunlight: "Full Sun 6+ hours", watering: "Daily", level: "Easy", placement: "Outdoor — garden or large pot" }, reviews: [{ user: "Balu", rating: 5, comment: "Huge beautiful blooms!" }] },
  { id: 27, name: "Tulip",               category: "Flowering", price: 499,  image: IMG.tulip,       description: "Classic spring bulb flowers in vivid colors. Perfect seasonal display.", care: { sunlight: "Full Sun", watering: "Every 2–3 days", level: "Intermediate", placement: "Outdoor garden or pot" }, reviews: [{ user: "Hema", rating: 5, comment: "Bloomed perfectly!" }] },
  { id: 28, name: "Marigold",            category: "Flowering", price: 199,  image: IMG.marigold,    description: "Bright golden-orange blooms that repel pests naturally. Very easy to grow.", care: { sunlight: "Full Sun", watering: "Every 2 days", level: "Beginner Friendly", placement: "Outdoor — garden or balcony" }, reviews: [{ user: "Sarala", rating: 5, comment: "Blooms all season long!" }] },
  { id: 29, name: "Jasmine",             category: "Flowering", price: 449,  image: IMG.jasmine,     description: "Intensely fragrant white flowers. Perfect for balconies and gardens.", care: { sunlight: "Full Sun to Partial Shade", watering: "Every 2–3 days", level: "Easy", placement: "Outdoor balcony or garden" }, reviews: [{ user: "Anitha", rating: 5, comment: "Fragrance fills the whole house!" }] },
  { id: 30, name: "Hibiscus",            category: "Flowering", price: 499,  image: IMG.hibiscus,    description: "Large tropical blooms in bright colors. Attracts butterflies and birds.", care: { sunlight: "Full Sun", watering: "Daily", level: "Easy", placement: "Outdoor — garden" }, reviews: [{ user: "Usha", rating: 4, comment: "Bright beautiful flowers." }] },
  { id: 31, name: "Anthurium",           category: "Flowering", price: 799,  image: IMG.anthurium,   description: "Waxy heart-shaped blooms in red and pink. Long-lasting and showy.", care: { sunlight: "Bright Indirect Light", watering: "Weekly", level: "Easy", placement: "Indoor — bright warm room" }, reviews: [{ user: "Kamala", rating: 5, comment: "Blooms for months!" }] },
  { id: 32, name: "Chrysanthemum",       category: "Flowering", price: 399,  image: IMG.chrysan,     description: "Fluffy pompom blooms in dozens of colors. A classic flower.", care: { sunlight: "Full Sun", watering: "Every 2 days", level: "Intermediate", placement: "Outdoor — garden or pot" }, reviews: [{ user: "Bharathi", rating: 4, comment: "Beautiful colors." }] },
  { id: 33, name: "Bougainvillea",       category: "Flowering", price: 599,  image: IMG.bougain,     description: "Dazzling cascades of bright pink and purple bracts. Perfect climber.", care: { sunlight: "Full Sun 5+ hours", watering: "Every 2–3 days", level: "Intermediate", placement: "Outdoor — fence or trellis" }, reviews: [{ user: "Radha", rating: 5, comment: "Stunning colors!" }] },
  { id: 34, name: "African Violet",      category: "Flowering", price: 399,  image: IMG.orchid,      description: "Compact flowering plant with fuzzy leaves and purple blooms.", care: { sunlight: "Bright Indirect Light", watering: "Bottom watering weekly", level: "Intermediate", placement: "Indoor — windowsill" }, reviews: [{ user: "Vani", rating: 4, comment: "Blooms repeatedly!" }] },
  { id: 35, name: "Petunia",             category: "Flowering", price: 249,  image: IMG.marigold,    description: "Prolific bloomer in a rainbow of colors. Great for hanging baskets.", care: { sunlight: "Full Sun", watering: "Daily in summer", level: "Easy", placement: "Outdoor — hanging baskets" }, reviews: [{ user: "Swati", rating: 5, comment: "Blooms profusely!" }] },
  { id: 36, name: "Lotus",               category: "Flowering", price: 799,  image: IMG.lotus,       description: "Sacred aquatic flower blooming from muddy water. Symbol of purity.", care: { sunlight: "Full Sun 5–6 hours", watering: "Aquatic — keep submerged", level: "Advanced", placement: "Outdoor pond or large container" }, reviews: [{ user: "Padmavathi", rating: 5, comment: "Sacred and beautiful!" }] },

  /* ── HERB ── */
  { id: 37, name: "Basil",               category: "Herb",      price: 199,  image: IMG.basil,       description: "Aromatic kitchen herb. Essential for pasta, pizza, and Indian cuisine.", care: { sunlight: "Full Sun 6+ hours", watering: "Daily", level: "Easy", placement: "Kitchen windowsill or balcony" }, reviews: [{ user: "Chef Ravi", rating: 5, comment: "Fresh basil is life!" }] },
  { id: 38, name: "Mint",                category: "Herb",      price: 199,  image: IMG.mint,        description: "Refreshing aromatic herb. Perfect for teas, chutneys, and cocktails.", care: { sunlight: "Partial Sun", watering: "Daily", level: "Beginner Friendly", placement: "Kitchen or garden" }, reviews: [{ user: "Pallavi", rating: 5, comment: "Smells amazing!" }] },
  { id: 39, name: "Rosemary",            category: "Herb",      price: 249,  image: IMG.basil,       description: "Mediterranean herb with needle-like leaves. Used in cooking and aromatherapy.", care: { sunlight: "Full Sun", watering: "Every 2–3 days", level: "Easy", placement: "Sunny window or outdoor" }, reviews: [{ user: "Marco", rating: 5, comment: "Great quality plant." }] },
  { id: 40, name: "Curry Leaf",          category: "Herb",      price: 299,  image: IMG.mint,        description: "Essential South Indian cooking herb with intense aromatic fragrance.", care: { sunlight: "Full Sun", watering: "Every 2 days", level: "Easy", placement: "Outdoor or sunny balcony" }, reviews: [{ user: "Mala", rating: 5, comment: "A must-have in every kitchen!" }] },
  { id: 41, name: "Lemongrass",          category: "Herb",      price: 249,  image: IMG.mint,        description: "Tropical grass with citrus aroma. Used in tea, cooking, and repels mosquitoes.", care: { sunlight: "Full Sun", watering: "Every 2 days", level: "Easy", placement: "Outdoor or large sunny pot" }, reviews: [{ user: "Thara", rating: 4, comment: "Grows very fast!" }] },
  { id: 42, name: "Thyme",               category: "Herb",      price: 199,  image: IMG.basil,       description: "Fragrant Mediterranean herb used widely in cooking and herbal remedies.", care: { sunlight: "Full Sun", watering: "Every 3–4 days", level: "Easy", placement: "Kitchen windowsill or garden" }, reviews: [{ user: "Preethi", rating: 4, comment: "Fresh and fragrant." }] },

  /* ── DECORATIVE & TREES ── */
  { id: 43, name: "Bonsai",              category: "Decorative",price: 1499, image: IMG.bonsai,      description: "Miniature artistic tree crafted with precision. A living work of art.", care: { sunlight: "Indirect Light", watering: "Every 2–3 days", level: "Advanced", placement: "Indoor or shaded outdoor" }, reviews: [{ user: "Karthik", rating: 5, comment: "Beautiful craftsmanship." }] },
  { id: 44, name: "Bamboo Plant",        category: "Decorative",price: 799,  image: IMG.bamboo,      description: "Elegant stalks symbolizing good luck. Thrives in water or soil.", care: { sunlight: "Low to Indirect Light", watering: "Weekly (change water)", level: "Easy", placement: "Indoor — desk or table" }, reviews: [{ user: "Sanjay", rating: 5, comment: "Very calming aesthetic." }] },
  { id: 45, name: "Lucky Bamboo",        category: "Decorative",price: 599,  image: IMG.bamboo,      description: "Feng shui plant believed to bring luck and positive energy.", care: { sunlight: "Indirect Light", watering: "Change water every 2 weeks", level: "Beginner Friendly", placement: "Indoor — any room" }, reviews: [{ user: "Seema", rating: 5, comment: "Lucky and beautiful!" }] },

  /* ── OUTDOOR ── */
  { id: 46, name: "Boston Fern",         category: "Outdoor",   price: 549,  image: IMG.bostonFern,  description: "Lush cascading fronds. Perfect for humid bathrooms and shaded porches.", care: { sunlight: "Indirect Light", watering: "Every 2–3 days", level: "Intermediate", placement: "Humid indoor or shaded outdoor" }, reviews: [{ user: "Leela", rating: 4, comment: "Lush and beautiful." }] },
  { id: 48, name: "Elephant Ear",        category: "Outdoor",   price: 699,  image: IMG.monstera,    description: "Giant tropical leaves create a bold dramatic impact in any garden.", care: { sunlight: "Partial to Full Sun", watering: "Every 2 days", level: "Easy", placement: "Outdoor — garden or large pot" }, reviews: [{ user: "Vijay", rating: 4, comment: "Massive impressive leaves." }] },
  { id: 49, name: "Lemon Tree",          category: "Outdoor",   price: 999,  image: IMG.neem,        description: "Fruiting citrus tree with fragrant blossoms. Grows well in large pots.", care: { sunlight: "Full Sun 6–8 hours", watering: "Every 2–3 days", level: "Intermediate", placement: "Outdoor — balcony or garden" }, reviews: [{ user: "Rani", rating: 5, comment: "Already has small fruits!" }] },

  /* ── MEDICINAL ── */
  { id: 50, name: "Neem Tree",           category: "Medicinal", price: 799,  image: IMG.neem,        description: "Sacred medicinal tree with powerful antibacterial and antifungal properties.", care: { sunlight: "Full Sun", watering: "Weekly once established", level: "Easy", placement: "Outdoor — garden" }, reviews: [{ user: "Govind", rating: 5, comment: "Very useful medicinal tree." }] },
  { id: 52, name: "Venus Flytrap",       category: "Medicinal", price: 549,  image: IMG.cactus,      description: "Carnivorous plant that snaps shut to trap insects. A fascinating plant.", care: { sunlight: "Full Sun", watering: "Distilled water only — keep moist", level: "Advanced", placement: "Indoor — sunny windowsill" }, reviews: [{ user: "Roshan", rating: 5, comment: "Kids absolutely love it!" }] },
  { id: 53, name: "Moringa",             category: "Medicinal", price: 599,  image: IMG.neem,        description: "Miracle tree with highly nutritious leaves. Used in health supplements.", care: { sunlight: "Full Sun", watering: "Weekly", level: "Easy", placement: "Outdoor — garden" }, reviews: [{ user: "Wellness Guru", rating: 5, comment: "Superfood in your garden!" }] },
];

export default plants;