import type { NextApiRequest, NextApiResponse } from "next";

export interface ILangData {
  pairs: string[][];
  langA: {
    code: string;
    name: string;
  };
  langB: {
    code: string;
    name: string;
  };
}

export interface IData {
  [key: string]: ILangData;
}

const data: IData = {
  es: {
    pairs: [
      ["the bank", "el banco"],
      ["the restaurant", "el restaurante"],
      ["a potato", "una papa"],
      ["cow", "vaca"],
      ["chair", "silla"],
      ["I'm beautiful", "soy hermoso"],
    ],
    langA: { code: "en", name: "English" },
    langB: { code: "es", name: "Spanish" },
  },
  fr: {
    pairs: [
      ["a car", "une voiture"],
      ["the glass", "le verre"],
      ["the station", "la gare"],
      ["we are", "nous sommes"],
      ["egg", "œuf"],
      ["goodbye", "au revoir"],
      ["spain", "espagne"],
      ["to work", "travailler"],
    ],
    langA: { code: "en", name: "English" },
    langB: { code: "fr", name: "French" },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const lang = req.query.lang as "es" | "fr";
  const responseData = data[lang];
  res.json(responseData);
};
