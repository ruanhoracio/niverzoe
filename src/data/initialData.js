export const EVENT = {
  childName: "Zoe",
  age: "1º Aninho",
  title: "Zoe faz 1 aninho",
  subtitle: "O nosso maior amor completa seu primeiro aninho de muitas alegrias.",
  date: "15 de Novembro de 2026",
  time: "15:30",
  iso: "2026-11-15T15:30:00-03:00",
  venue: "Espaço Be Happy",
  address: "Buffet Infantil Be Happy",
  mapUrl: "https://share.google/agWdG7gIuHJGdevKS",
  dress: "Tons claros & confortável",
  password: "zoe"
};

// All photos from /fotos folder
export const ALL_PHOTOS = [
  "_MG_7363.jpg",
  "_MG_7395.jpg",
  "_MG_7343.jpg",
  "_MG_7334.jpg",
  "_MG_7132.jpg",
  "_MG_7124.jpg",
  "_MG_7121.jpg",
  "_MG_7091.jpg",
  "_MG_7044.jpg",
  "_MG_7036.jpg",
  "_MG_6954.jpg",
  "_MG_6934.jpg",
  "_MG_6755.jpg",
  "_MG_6642.jpg",
  "_MG_6615.jpg",
  "_MG_6551.jpg",
  "_MG_6499.jpg",
  "_MG_6478.jpg"
];

// Best picks for hero carousel (first ~12)
export const HERO_PHOTOS = ALL_PHOTOS.slice(0, 12);

// Gallery picks
export const GALLERY_PHOTOS = ALL_PHOTOS;

export const INITIAL_GUESTS = [
  { id: "g1", name: "Vovô Roberto & Vovó Maria", group: "Família", status: "pending", adults: 2, kids: 0, diet: "", msg: "" },
  { id: "g2", name: "Tia Camila & Família", group: "Família", status: "pending", adults: 2, kids: 1, diet: "", msg: "" },
  { id: "g3", name: "Lucas & Mariana", group: "Amigos", status: "confirmed", adults: 2, kids: 1, diet: "Sem amendoim", msg: "Mal podemos esperar para celebrar com a princesinha Zoe!" },
  { id: "g4", name: "Tio Rodrigo", group: "Família", status: "pending", adults: 1, kids: 0, diet: "", msg: "" },
  { id: "g5", name: "Juliana & Família", group: "Família", status: "confirmed", adults: 2, kids: 1, diet: "", msg: "Parabéns Zoezinha! Que Deus te abençoe sempre!" },
  { id: "g6", name: "Gabriel & Amanda", group: "Amigos", status: "pending", adults: 2, kids: 0, diet: "", msg: "" },
];

export const INITIAL_MESSAGES = [
  { id: "m1", author: "Lucas & Mariana", text: "Mal podemos esperar para celebrar com a princesinha Zoe! Muita saúde e luz! ❤️", date: "Hoje" },
  { id: "m2", author: "Juliana", text: "Parabéns Zoezinha linda! Que seu primeiro aninho seja inesquecível! 🎂", date: "Hoje" },
  { id: "m3", author: "Vovô e Vovó", text: "Nossa maior bênção completa um aninho! Amamos você infinitamente.", date: "Ontem" },
];
