
export interface DeliveryRate {
  wilaya: string;
  home: number;
  office?: number;
}

export const deliveryRates: DeliveryRate[] = [
  { wilaya: "Adrar", home: 1400, office: 900 },
  { wilaya: "Chlef", home: 800, office: 450 },
  { wilaya: "Laghouat", home: 950, office: 600 },
  { wilaya: "Oum El Bouaghi", home: 800, office: 450 },
  { wilaya: "Batna", home: 800, office: 450 },
  { wilaya: "Béjaïa", home: 800, office: 450 },
  { wilaya: "Biskra", home: 950, office: 600 },
  { wilaya: "Béchar", home: 1100, office: 650 },
  { wilaya: "Blida", home: 750, office: 450 },
  { wilaya: "Bouira", home: 800, office: 450 },
  { wilaya: "Tamanrasset", home: 1600, office: 1050 },
  { wilaya: "Tébessa", home: 900, office: 450 },
  { wilaya: "Tlemcen", home: 500, office: 300 },
  { wilaya: "Tiaret", home: 750, office: 450 },
  { wilaya: "Tizi Ouzou", home: 800, office: 450 },
  { wilaya: "Alger", home: 650, office: 400 },
  { wilaya: "Djelfa", home: 950, office: 600 },
  { wilaya: "Jijel", home: 800, office: 450 },
  { wilaya: "Sétif", home: 800, office: 450 },
  { wilaya: "Saïda", home: 750 },
  { wilaya: "Skikda", home: 800, office: 450 },
  { wilaya: "Sidi Bel Abbès", home: 700, office: 450 },
  { wilaya: "Annaba", home: 850, office: 450 },
  { wilaya: "Guelma", home: 850, office: 450 },
  { wilaya: "Constantine", home: 800, office: 450 },
  { wilaya: "Médéa", home: 750, office: 450 },
  { wilaya: "Mostaganem", home: 700, office: 450 },
  { wilaya: "MSila", home: 900, office: 600 },
  { wilaya: "Mascara", home: 700, office: 450 },
  { wilaya: "Ouargla", home: 1000, office: 650 },
  { wilaya: "Oran", home: 700, office: 450 },
  { wilaya: "El Bayadh", home: 1000, office: 600 },
  { wilaya: "Bordj Bou Arréridj", home: 800, office: 450 },
  { wilaya: "Boumerdès", home: 800, office: 450 },
  { wilaya: "El Tarf", home: 850, office: 450 },
  { wilaya: "Tissemsilt", home: 750, office: 520 },
  { wilaya: "El Oued", home: 1000, office: 650 },
  { wilaya: "Khenchela", home: 800 },
  { wilaya: "Souk Ahras", home: 800, office: 450 },
  { wilaya: "Tipaza", home: 800, office: 450 },
  { wilaya: "Mila", home: 800, office: 450 },
  { wilaya: "Aïn Defla", home: 750, office: 450 },
  { wilaya: "Naâma", home: 1000, office: 600 },
  { wilaya: "Aïn Témouchent", home: 650, office: 450 },
  { wilaya: "Ghardaïa", home: 1000, office: 600 },
  { wilaya: "Relizane", home: 750, office: 450 },
  { wilaya: "Timimoun", home: 1400 },
  { wilaya: "Ouled Djellal", home: 950, office: 600 },
  { wilaya: "Béni Abbès", home: 1000 },
  { wilaya: "In Salah", home: 1600 },
  { wilaya: "In Guezzam", home: 1600 },
  { wilaya: "Touggourt", home: 1000, office: 650 },
  { wilaya: "M'Ghair", home: 1000 },
  { wilaya: "Meniaa", home: 1000 }
];

export const getDeliveryRate = (wilaya: string): DeliveryRate | undefined => {
  return deliveryRates.find(rate => rate.wilaya === wilaya);
};
