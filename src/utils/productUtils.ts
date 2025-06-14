
import { bagsData } from "@/data/bagsData";
import { jewelryData } from "@/data/jewelryData";

export const getBagsWithTranslations = (t: (key: string) => string) => {
  return bagsData.map(bag => ({
    ...bag,
    category: bag.category === 'handmade' ? t('handmade') : t('evening')
  }));
};

export const getJewelryWithTranslations = () => {
  return jewelryData;
};
