/* CENÍK KALKULAČKY – jediné místo, kde se upravují ceny.
   Všechny ceny jsou v Kč BEZ DPH. Hodnoty jsou výchozí odhad (viz README.md), před ostrým nasazením je přepište. */
window.KALK_CENY = {
  dph: 0.21,

  // Množstevní sleva na textil: [od kolika ks celkem, sleva v %]
  sleva: [[10, 5], [25, 10], [50, 15], [100, 20]],

  velikosti: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],

  barvy: [
    { id: "bila", n: "Bílá", hex: "#ffffff" },
    { id: "cerna", n: "Černá", hex: "#1a1a1a" },
    { id: "tmave-modra", n: "Tmavě modrá", hex: "#1b2a49" },
    { id: "kralovska", n: "Královská modrá", hex: "#1f4fa8" },
    { id: "cervena", n: "Červená", hex: "#c0262d" },
    { id: "seda", n: "Šedý melír", hex: "#9a9fa5" },
    { id: "zelena", n: "Lahvově zelená", hex: "#14532d" },
    { id: "zluta", n: "Žlutá", hex: "#f2c200" },
    { id: "oranzova", n: "Oranžová", hex: "#ee7d11" }
  ],

  // cena = za kus ve velikostech S–XXL, priplatek = příplatek za větší velikosti
  produkty: {
    tricko: [
      { id: "tr-1", n: "Tričko Basic", popis: "Základní tričko, unisex střih", cena: 100, priplatek: { "3XL": 15, "4XL": 25 } },
      { id: "tr-2", n: "Tričko Standard", popis: "Pevnější materiál na každodenní nošení", cena: 190, priplatek: { "3XL": 20, "4XL": 30 } },
      { id: "tr-3", n: "Dámské tričko Premium", popis: "Přiléhavý dámský střih, kvalitní materiál", cena: 300, priplatek: { "3XL": 25, "4XL": 40 } },
      { id: "tr-4", n: "Funkční tričko", popis: "Rychleschnoucí, pro sport a práci venku", cena: 450, priplatek: { "3XL": 30, "4XL": 50 } },
      { id: "tr-5", n: "Tričko Exclusive", popis: "Nejkvalitnější materiál a zpracování", cena: 600, priplatek: { "3XL": 40, "4XL": 60 } }
    ],
    mikina: [
      { id: "mi-1", n: "Mikina Basic", popis: "Klasická mikina bez kapuce", cena: 100, priplatek: { "3XL": 20, "4XL": 35 } },
      { id: "mi-2", n: "Mikina Standard", popis: "Hustší materiál, bez kapuce", cena: 220, priplatek: { "3XL": 30, "4XL": 50 } },
      { id: "mi-3", n: "Mikina s kapucí", popis: "Kapuce, kapsa vpředu", cena: 350, priplatek: { "3XL": 35, "4XL": 55 } },
      { id: "mi-4", n: "Mikina na zip", popis: "Celorozepínací, s kapucí", cena: 480, priplatek: { "3XL": 40, "4XL": 60 } },
      { id: "mi-5", n: "Mikina s kapucí Premium", popis: "Těžký materiál, nejkvalitnější zpracování", cena: 600, priplatek: { "3XL": 50, "4XL": 75 } }
    ]
  },

  vysivani: {
    // velikost výšivky: stehy = typický počet stehů, program = jednorázová cena vyšívacího programu
    // (orientačně 500 Kč za každou výšivku; u stejné výšivky se už znovu neplatí)
    velikosti: {
      s: { n: "Malé – do 6 cm", stehy: 2500, program: 500 },
      m: { n: "Střední – do 10 cm", stehy: 4500, program: 500 },
      l: { n: "Velké – do 18 cm", stehy: 8000, program: 500 },
      xl: { n: "Velké na záda – do 28 cm", stehy: 16500, program: 500 }
    },
    // kam lze vyšívat a jaké velikosti tam dávají smysl
    umisteni: {
      "prso-l": { n: "Levé prso", velikosti: ["s", "m"] },
      "prso-p": { n: "Pravé prso", velikosti: ["s", "m"] },
      zada: { n: "Záda", velikosti: ["l", "xl"] },
      rukav: { n: "Rukáv", velikosti: ["s"] },
      zatylek: { n: "Zátylek (pod límcem)", velikosti: ["s"] }
    },
    maxPozic: 4,
    // sazba za kus: [od kolika ks celkem, Kč za 1 000 stehů, minimální cena za kus]
    sazba: [[1, 16, 60], [10, 12, 45], [25, 10, 35], [50, 8, 30], [100, 6.5, 25]]
  }
};
