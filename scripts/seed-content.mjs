// Seeds the `entries` table with all static content (info, apps, food, transport,
// sos, tickets, plan, map, packing, shopping). Run after creating the entries table:
//   node --env-file=.env.local scripts/seed-content.mjs
// Idempotent: clears each scope before inserting.
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } },
);

const data = {
  info: [
    { emoji: "🚰", title: "Woda z fontann (nasoni)", body: "Rzymskie żeliwne fontanny 'nasoni' lejące wodę to darmowa, zdatna do picia woda. Bierzmy butelkę wielorazową - w lipcu oszczędzimy fortunę i się nie odwodnimy." },
    { emoji: "⛪", title: "Dress code w kościołach", body: "Bazylika św. Piotra i Watykan: zakryte ramiona i kolana - inaczej nie wpuszczą. Weźmy lekki szal lub koszulkę z rękawkiem na te wejścia." },
    { emoji: "💶", title: "Napiwki", body: "Napiwki nie są obowiązkowe. Często doliczają 'coperto' (opłata za nakrycie). Zaokrąglenie rachunku w górę wystarcza." },
    { emoji: "🕐", title: "Godziny i sjesta", body: "Wiele sklepów i mniejszych restauracji robi przerwę po południu (~13-16). Kolacje zaczynają się późno - kuchnie często otwierają o 19:30-20:00." },
    { emoji: "🥵", title: "Upał w lipcu", body: "Bywa 30-35°C+. Planujmy zwiedzanie na rano i późne popołudnie, w południe szukajmy cienia/klimatyzacji. Filtr, woda, kapelusz - must have." },
    { emoji: "👜", title: "Bezpieczeństwo i kieszonkowcy", body: "W zatłoczonych miejscach (Termini, metro, okolice Koloseum) uważajmy na kieszonkowców. Plecak z przodu, telefon w bezpiecznej kieszeni." },
    { emoji: "🔌", title: "Gniazdka", body: "Włochy: typ F/L, 230V. Polskie wtyczki zazwyczaj pasują, ale część gniazd jest węższa - drobny adapter potrafi uratować." },
    { emoji: "💳", title: "Płatności", body: "Karty akceptowane niemal wszędzie, ale w małych barach/trattoriach miejmy trochę gotówki. Bankomaty to 'bancomat'." },
  ],
  apps: [
    { emoji: "🗺️", name: "Google Maps", what: "Nawigacja pieszo + pobierzmy mapy Rzymu/Pizy offline przed wyjazdem." },
    { emoji: "🚄", name: "Trenitalia", what: "Bilety i rozkład pociągów krajowych (Roma → Pisa, regionale do Lukki)." },
    { emoji: "🚅", name: "Italo Treno", what: "Druga sieć szybkich pociągów - czasem taniej niż Trenitalia." },
    { emoji: "🚕", name: "FreeNow / Uber", what: "Zamawianie taksówek w dużych miastach (Uber działa ograniczenie - często to taxi)." },
    { emoji: "🚌", name: "Moovit", what: "Komunikacja miejska Rzymu - trasy autobusów, metra i tramwajów." },
    { emoji: "💳", name: "Revolut / Curve", what: "Płatności bez prowizji za przewalutowanie, podział kosztów w grupie." },
    { emoji: "🌐", name: "Google Translate", what: "Tłumacz z aparatem (menu, tabliczki) - pobierzmy włoski offline." },
    { emoji: "🍽️", name: "TheFork", what: "Rezerwacje stolików w restauracjach, czasem ze zniżkami." },
    { emoji: "💬", name: "WhatsApp", what: "Podstawowy komunikator we Włoszech - przyda się do kontaktu z noclegiem." },
  ],
  "jedzenie:rzym": [
    { emoji: "🧀", name: "Cacio e pepe", desc: "Makaron z pecorino i pieprzem - klasyk rzymski." },
    { emoji: "🍳", name: "Carbonara", desc: "Prawdziwa: jajko, guanciale, pecorino - bez śmietany!" },
    { emoji: "🍙", name: "Supplì", desc: "Smażone ryżowe kuleczki z mozzarellą w środku." },
    { emoji: "🍕", name: "Pizza al taglio", desc: "Pizza na kawałki sprzedawana na wagę - szybki street food." },
    { emoji: "🌿", name: "Carciofi alla romana", desc: "Karczochy po rzymsku - sezonowo, ale warto." },
    { emoji: "🍦", name: "Gelato", desc: "Szukajmy 'gelateria artigianale' - prawdziwe, rzemieślnicze lody." },
    { emoji: "🍹", name: "Aperol Spritz", desc: "Obowiązkowy aperitivo o zachodzie słońca. 🧡" },
  ],
  "jedzenie:toskania": [
    { emoji: "🍪", name: "Cantucci + Vin Santo", desc: "Migdałowe ciasteczka maczane w słodkim winie." },
    { emoji: "🍝", name: "Pici", desc: "Grube, ręcznie robione toskańskie makarony." },
    { emoji: "🫓", name: "Cecìna / Torta di ceci", desc: "Placek z mąki z ciecierzycy - specjalność Pizy." },
    { emoji: "🥟", name: "Tordelli lucchesi", desc: "Nadziewane mięsem pierożki z Lukki w sosie mięsnym." },
    { emoji: "🥩", name: "Bistecca / dania mięsne", desc: "Toskania słynie z mięs i prostych, wyrazistych smaków." },
    { emoji: "🍞", name: "Buccellato", desc: "Słodki chleb z Lukki z rodzynkami i anyżem." },
  ],
  transport: [
    { emoji: "🚝", title: "Z lotniska w Rzymie (Fiumicino, FCO) do centrum", body: "Leonardo Express jedzie non-stop FCO → Roma Termini w ~32 min. Bilet kupimy w automacie lub w apce Trenitalia. Tańsza alternatywa: autobusy (Terravision/SIT) za kilka euro.", linkLabel: "Trenitalia", linkUrl: "https://www.trenitalia.com/en.html" },
    { emoji: "🚄", title: "Pociąg Roma → Pisa Centrale (29.07, 12:00)", body: "Bezpośrednie Intercity/Frecce jadą z Roma Termini do Pisa Centrale w ~2,5-3 h. Kupmy bilety wcześniej dla całej ekipy - w godzinach szczytu drożeją. Na stację bądźmy ~30 min przed odjazdem.", linkLabel: "Trenitalia / Italo", linkUrl: "https://www.italotreno.com/en" },
    { emoji: "🛤️", title: "Z lotniska w Pizie (PSA) do miasta", body: "PisaMover to automatyczna kolejka lotnisko ↔ Pisa Centrale, ~5 min. Lotnisko w Pizie jest bardzo blisko centrum - wielki plus przy porannych wylotach 31.07.", linkLabel: "", linkUrl: "" },
    { emoji: "🚲", title: "Piza ↔ Lucca (wycieczka 30.07)", body: "Pociąg regionalny (regionale) jedzie ~30 min i kursuje często. Bilet kupujemy na bieżąco; skasujmy go przed wejściem do pociągu, jeśli papierowy.", linkLabel: "", linkUrl: "" },
    { emoji: "🚫", title: "ZTL - strefy ograniczonego ruchu", body: "Centra Rzymu, Pizy i Lukki mają strefy ZTL z kamerami. Jeśli ktokolwiek planuje auto - NIE wjeżdżajmy w oznaczone strefy bez zezwolenia, bo mandaty przychodzą pocztą. Po miastach poruszamy się pieszo i komunikacją.", linkLabel: "", linkUrl: "" },
    { emoji: "🎫", title: "Bilety komunikacji miejskiej w Rzymie", body: "Bilet 100 min (BIT) ważny na metro/autobus/tramwaj. Są też bilety dzienne i Roma Pass (transport + wejścia do atrakcji). Kasujmy bilet przy wejściu.", linkLabel: "", linkUrl: "" },
  ],
  "sos:numbers": [
    { emoji: "🆘", number: "112", label: "Numer alarmowy (ogólny, UE)" },
    { emoji: "🚑", number: "118", label: "Pogotowie ratunkowe" },
    { emoji: "👮", number: "112", label: "Policja (Carabinieri)" },
    { emoji: "🚒", number: "115", label: "Straż pożarna" },
  ],
  "sos:contacts": [
    { label: "Adres noclegu w Rzymie", value: "do uzupełnienia" },
    { label: "Adres noclegu w Pizie", value: "do uzupełnienia" },
    { label: "Ambasada RP w Rzymie", value: "Via Pietro Paolo Rubens 20, Rzym - tel. +39 06 36 204 200" },
    { label: "Numer do ekipy (kontakt awaryjny)", value: "do uzupełnienia" },
  ],
  "sos:tips": [
    { text: "Zapiszmy sobie nawzajem numery telefonów i ustalmy punkt zbiórki na wypadek zgubienia się." },
    { text: "Zróbmy zdjęcia dokumentów i trzymajmy je w chmurze + offline w telefonie." },
    { text: "Karta EKUZ uprawnia do publicznej opieki zdrowotnej na takich zasadach jak Włosi." },
    { text: "W razie zgubienia/kradzieży dokumentów: zgłoś na policji (Carabinieri) i skontaktuj się z ambasadą." },
  ],
  bilety: [
    { name: "Koloseum + Forum Romanum + Palatyn", city: "Rzym", why: "Wejście na godzinę, potrafi wyprzedać się na kilka dni do przodu. Rozważmy bilet z wejściem na areny.", officialUrl: "https://colosseo.it/en/", assignedTo: "", bookedFor: "", status: "do-rezerwacji" },
    { name: "Muzea Watykańskie + Kaplica Sykstyńska", city: "Rzym", why: "Obowiązkowa rezerwacja slotu czasowego - inaczej gigantyczne kolejki.", officialUrl: "https://tickets.museivaticani.va/", assignedTo: "", bookedFor: "", status: "do-rezerwacji" },
    { name: "Bazylika św. Piotra - wejście na kopułę", city: "Rzym", why: "Wstęp do bazyliki darmowy, ale kopuła (taras widokowy) płatna; bilet na miejscu lub online.", officialUrl: "https://www.basilicasanpietro.va/", assignedTo: "", bookedFor: "", status: "do-rezerwacji" },
    { name: "Krzywa Wieża w Pizie", city: "Piza", why: "Limit osób i sloty czasowe; plecaki trzeba zostawić w depozycie. Kupmy razem z katedrą.", officialUrl: "https://www.opapisa.it/en/", assignedTo: "", bookedFor: "", status: "do-rezerwacji" },
  ],
  "plan:2026-07-25": [
    { time: "10:35", text: "Wylot Dawid + Karolina z Krakowa" },
    { time: "13:05", text: "Ląduje Wiktoria (z Edynburga)" },
    { time: "", text: "Zakwaterowanie, zostawienie bagaży" },
    { time: "", text: "Lekki spacer - Trastevere, pierwsza pizza/aperol" },
  ],
  "plan:2026-07-26": [
    { time: "", text: "Panteon" },
    { time: "", text: "Fontanna di Trevi (wrzućmy monetę!)" },
    { time: "", text: "Piazza Navona, Schody Hiszpańskie" },
    { time: "wieczór", text: "Przylatuje Banan - wspólna kolacja, ekipa w komplecie 🎉" },
  ],
  "plan:2026-07-27": [
    { time: "", text: "Bazylika św. Piotra (wejście za darmo, ale kolejki - rano!)" },
    { time: "", text: "Muzea Watykańskie + Kaplica Sykstyńska - BILETY na godzinę z wyprzedzeniem" },
    { time: "", text: "Zakryte ramiona i kolana - dress code obowiązkowy" },
    { time: "", text: "Ew. wejście na kopułę bazyliki (taras widokowy)" },
  ],
  "plan:2026-07-28": [
    { time: "", text: "Koloseum - BILET na godzinę (warto z wejściem na areny)" },
    { time: "", text: "Forum Romanum + Palatyn (zwykle wspólny bilet)" },
    { time: "", text: "Vittoriano / Kapitol, Piazza Venezia" },
    { time: "", text: "Wieczór: ostatnia kolacja w Rzymie" },
  ],
  "plan:2026-07-29": [
    { time: "", text: "Rano: śniadanie, spakowanie, wymeldowanie" },
    { time: "12:00", text: "Pociąg Roma → Pisa Centrale (bądźmy na stacji ~30 min wcześniej)" },
    { time: "", text: "Zakwaterowanie w Pizie" },
    { time: "", text: "Po południu: Piazza dei Miracoli - Krzywa Wieża, katedra, baptysterium" },
  ],
  "plan:2026-07-30": [
    { time: "", text: "Pociąg regionalny Piza → Lucca (~30 min, kursuje często)" },
    { time: "", text: "Przejażdżka rowerem po renesansowych murach miejskich" },
    { time: "", text: "Piazza dell'Anfiteatro, wieża Torre Guinigi z dębami na szczycie" },
    { time: "", text: "Powrót do Pizy na wieczór - ostatni wspólny aperol" },
  ],
  "plan:2026-07-31": [
    { time: "~06:00", text: "Wiktoria - wylot (wcześnie rano)" },
    { time: "09:25", text: "Dawid + Karolina + Banan - wylot, ląd. 11:20" },
    { time: "", text: "Dzień wylotowy - bez zwiedzania, dojazd na lotnisko z zapasem" },
  ],
  places: [
    { name: "Nocleg w Rzymie", city: "Rzym", type: "nocleg", lat: 41.8967, lng: 12.4822, note: "do uzupełnienia po rezerwacji" },
    { name: "Koloseum", city: "Rzym", type: "atrakcja", lat: 41.8902, lng: 12.4922, note: "" },
    { name: "Forum Romanum", city: "Rzym", type: "atrakcja", lat: 41.8925, lng: 12.4853, note: "" },
    { name: "Panteon", city: "Rzym", type: "atrakcja", lat: 41.8986, lng: 12.4769, note: "" },
    { name: "Fontanna di Trevi", city: "Rzym", type: "atrakcja", lat: 41.9009, lng: 12.4833, note: "" },
    { name: "Piazza Navona", city: "Rzym", type: "atrakcja", lat: 41.8992, lng: 12.4731, note: "" },
    { name: "Bazylika św. Piotra (Watykan)", city: "Rzym", type: "atrakcja", lat: 41.9022, lng: 12.4539, note: "" },
    { name: "Muzea Watykańskie", city: "Rzym", type: "atrakcja", lat: 41.9065, lng: 12.4534, note: "" },
    { name: "Trastevere", city: "Rzym", type: "jedzenie", lat: 41.889, lng: 12.469, note: "dzielnica pełna trattorii" },
    { name: "Nocleg w Pizie", city: "Piza", type: "nocleg", lat: 43.716, lng: 10.396, note: "do uzupełnienia po rezerwacji" },
    { name: "Krzywa Wieża", city: "Piza", type: "atrakcja", lat: 43.723, lng: 10.3966, note: "" },
    { name: "Piazza dei Miracoli", city: "Piza", type: "atrakcja", lat: 43.7232, lng: 10.3936, note: "" },
    { name: "Borgo Stretto", city: "Piza", type: "jedzenie", lat: 43.7185, lng: 10.4015, note: "uliczka z barami i lodami" },
    { name: "Mury miejskie", city: "Lucca", type: "atrakcja", lat: 43.843, lng: 10.502, note: "spacer/rower wokół miasta" },
    { name: "Piazza dell'Anfiteatro", city: "Lucca", type: "atrakcja", lat: 43.8447, lng: 10.5065, note: "" },
    { name: "Torre Guinigi", city: "Lucca", type: "atrakcja", lat: 43.8432, lng: 10.5048, note: "wieża z dębami na szczycie" },
  ],
  "packing:Dokumenty i pieniądze": [
    { text: "Dowód osobisty / paszport", detail: "" },
    { text: "Karta EKUZ", detail: "" },
    { text: "Karta płatnicza + trochę gotówki EUR", detail: "" },
    { text: "Bilety lotnicze i pociągowe (offline w telefonie)", detail: "" },
    { text: "Potwierdzenia rezerwacji noclegów", detail: "" },
  ],
  "packing:Ubrania (lipiec, upał ~30-35°C)": [
    { text: "Lekkie, przewiewne ubrania", detail: "" },
    { text: "Coś z zakrytymi ramionami i kolanami (kościoły/Watykan!)", detail: "" },
    { text: "Wygodne buty na dużo chodzenia", detail: "" },
    { text: "Klapki / sandały", detail: "" },
    { text: "Strój kąpielowy (na wszelki wypadek)", detail: "" },
    { text: "Lekka kurtka / bluza na wieczór", detail: "" },
    { text: "Nakrycie głowy + okulary przeciwsłoneczne", detail: "" },
  ],
  "packing:Apteczka i kosmetyki": [
    { text: "Krem z wysokim filtrem SPF", detail: "" },
    { text: "Leki własne + podstawowa apteczka", detail: "" },
    { text: "Plastry na odciski (dużo chodzenia!)", detail: "" },
    { text: "Środek na komary", detail: "" },
    { text: "Kosmetyki podróżne (do 100 ml w bagażu podręcznym)", detail: "" },
  ],
  "packing:Elektronika": [
    { text: "Ładowarka + kabel do telefonu", detail: "" },
    { text: "Powerbank", detail: "" },
    { text: "Słuchawki", detail: "" },
    { text: "Adapter (Włochy mają gniazda typu F/L - polskie wtyczki zwykle pasują)", detail: "" },
  ],
  "shopping:Nocleg": [
    { text: "Nocleg w Rzymie (25-29.07, 4 noce)", detail: "do uzupełnienia: nazwa, adres, kto rezerwuje" },
    { text: "Nocleg w Pizie (29-31.07, 2 noce)", detail: "do uzupełnienia: nazwa, adres" },
  ],
  "shopping:Transport": [
    { text: "Loty tam i z powrotem", detail: "Dawid+Karolina i Banan: powrót 9:25; Wiktoria osobno" },
    { text: "Bilet pociąg Roma → Pisa Centrale (29.07, 12:00)", detail: "kupmy wcześniej dla całej ekipy" },
    { text: "Transfer z lotniska w Rzymie do centrum", detail: "Leonardo Express z FCO lub bus" },
  ],
  "shopping:Wejściówki / atrakcje": [
    { text: "Koloseum / Forum (slot czasowy)", detail: "patrz: Bilety czasowe" },
    { text: "Muzea Watykańskie (slot czasowy)", detail: "patrz: Bilety czasowe" },
    { text: "Krzywa Wieża + katedra w Pizie", detail: "patrz: Bilety czasowe" },
  ],
  "shopping:Formalności": [
    { text: "Ważny dowód osobisty / paszport", detail: "sprawdź datę ważności każdego z ekipy" },
    { text: "Karta EKUZ (darmowa, z NFZ)", detail: "europejska karta ubezpieczenia zdrowotnego" },
    { text: "Ubezpieczenie turystyczne", detail: "opcjonalnie, ponad EKUZ" },
    { text: "Karta wielowalutowa / gotówka EUR", detail: "Revolut/Curve działają świetnie we Włoszech" },
  ],
};

let total = 0;
for (const [scope, items] of Object.entries(data)) {
  await sb.from("entries").delete().eq("scope", scope);
  const rows = items.map((d, i) => ({ scope, sort: i, data: d }));
  const { error } = await sb.from("entries").insert(rows);
  if (error) {
    console.log(`${scope}: ERROR -> ${error.message}`);
  } else {
    total += rows.length;
    console.log(`${scope}: OK (${rows.length})`);
  }
}
console.log(`\nTotal entries: ${total}`);
