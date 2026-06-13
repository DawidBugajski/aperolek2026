export type EmergencyNumber = {
  label: string;
  number: string;
  emoji: string;
};

export const emergencyNumbers: EmergencyNumber[] = [
  { label: "Numer alarmowy (ogólny, UE)", number: "112", emoji: "🆘" },
  { label: "Pogotowie ratunkowe", number: "118", emoji: "🚑" },
  { label: "Policja (Carabinieri)", number: "112", emoji: "👮" },
  { label: "Straż pożarna", number: "115", emoji: "🚒" },
];

export const importantContacts: { label: string; value: string }[] = [
  { label: "Adres noclegu w Rzymie", value: "Silvano's Home In Rome — Via Costantino Morin 12, Vaticano Prati, 00195 Rzym" },
  { label: "Adres noclegu w Pizie", value: "Via Pasquale Landi 9, 56124 Piza" },
  { label: "Ambasada RP w Rzymie", value: "Via Pietro Paolo Rubens 20, Rzym - tel. +39 06 36 204 200" },
  { label: "Numer do ekipy (kontakt awaryjny)", value: "do uzupełnienia" },
];

export const sosTips: string[] = [
  "Zapiszmy sobie nawzajem numery telefonów i ustalmy punkt zbiórki na wypadek zgubienia się.",
  "Zróbmy zdjęcia dokumentów i trzymajmy je w chmurze + offline w telefonie.",
  "Karta EKUZ uprawnia do publicznej opieki zdrowotnej na takich zasadach jak Włosi.",
  "W razie zgubienia/kradzieży dokumentów: zgłoś na policji (Carabinieri) i skontaktuj się z ambasadą.",
];
