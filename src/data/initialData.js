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
  password: "2905"
};

// All photos from /fotos folder (nova seleção)
export const ALL_PHOTOS = [
  "_MG_7363.jpg",
  "_MG_7124.jpg",
  "_MG_7121.jpg",
  "_MG_7036.jpg",
  "_MG_6954.jpg",
  "_MG_6755.jpg",
  "_MG_6642.jpg",
  "_MG_6615.jpg",
  "_MG_6499.jpg"
];

// Best picks for hero carousel
export const HERO_PHOTOS = ALL_PHOTOS;

import importedGuestsList from './importedGuests.json';

// Lista oficial importada da planilha Zoe .xlsx
export const INITIAL_GUESTS = importedGuestsList;

export const INITIAL_MESSAGES = [];

// Sugestões de presentes personalizáveis
export const GIFT_SUGGESTIONS = {
  intro: "A sua presença é o nosso maior e mais precioso presente! Mas se desejar presentear a Zoe, aqui estão algumas referências e tamanhos:",
  items: [
    {
      category: "Roupas",
      icon: "Shirt",
      size: "Tamanho 1 a 2 anos (12 a 18 meses)",
      tip: "Vestidinhos, macacõezinhos ou conjuntinhos confortáveis"
    },
    {
      category: "Calçados",
      icon: "Footprints",
      size: "Tamanho 19 / 20",
      tip: "Sandálias macias ou tênis flexíveis"
    },
    {
      category: "Brinquedos & Livros",
      icon: "Gift",
      size: "Primeira infância (1+ anos)",
      tip: "Brinquedos educativos de encaixe, sensoriais ou livrinhos de historinhas"
    },
    {
      category: "Mimo via PIX",
      icon: "HeartHandshake",
      size: "Poupança da Zoe",
      tip: "Chave PIX para quem preferir contribuir com a poupancinha da aniversariante",
      pixKey: "karolayne.silveiraka@gmail.com"
    }
  ]
};
