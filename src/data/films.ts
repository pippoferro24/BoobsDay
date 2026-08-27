import type { Film } from "@/types";

/**
 * Watchlist ufficiale Marvel/Disney da vedere prima di Avengers: Doomsday
 * (18 dicembre 2026). Ordine cronologico di uscita.
 */
export const FILMS: Film[] = [
  {
    slug: "x-men",
    title: "X-Men",
    year: 2000,
    releaseDate: "2000-07-14",
    kind: "film",
    duration: "104 min",
    lead: { character: "Mystica", actress: "Rebecca Romijn" },
    accent: ["#1b3a5c", "#0a1220"],
    synopsis:
      "Il film che ha aperto l'era moderna del cinecomic: Xavier e Magneto ai due lati della stessa domanda sulla convivenza tra mutanti e umani.",
    whyDoomsday:
      "Marvel lo mette in lista perché diversi X-Men della saga Fox tornano in Doomsday: qui c'è la loro presentazione al cinema.",
    trivia: [
      "Il trucco integrale di Mystica richiedeva a Rebecca Romijn circa nove ore di applicazione.",
      "Hugh Jackman fu scelto a riprese già iniziate, dopo l'abbandono di Dougray Scott.",
      "Uscito due anni prima dello Spider-Man di Sam Raimi, è il film che ha convinto gli studios a puntare sui supereroi.",
      "Ian McKellen e Patrick Stewart, già amici sul palco teatrale, portarono in scena il rapporto Magneto-Xavier.",
    ],
  },
  {
    slug: "x2",
    title: "X2: X-Men United",
    year: 2003,
    releaseDate: "2003-05-02",
    kind: "film",
    duration: "134 min",
    lead: { character: "Jean Grey", actress: "Famke Janssen" },
    accent: ["#7a2230", "#180a12"],
    synopsis:
      "Un'operazione militare contro i mutanti costringe X-Men e Confraternita a una tregua. Il sacrificio finale di Jean Grey chiude il film.",
    whyDoomsday:
      "Il seguito che definisce l'universo Fox e pianta il seme della Fenice: contesto diretto per i mutanti che arrivano in Doomsday.",
    trivia: [
      "La sagoma di uccello che si forma nell'acqua nel finale anticipa la saga della Fenice Nera.",
      "La trama è ispirata alla graphic novel God Loves, Man Kills di Chris Claremont.",
      "Alan Cumming passava circa quattro ore al giorno in trucco per interpretare Nightcrawler.",
      "Famke Janssen ha lavorato come modella in Europa prima di dedicarsi alla recitazione.",
    ],
  },
  {
    slug: "captain-america-the-first-avenger",
    title: "Captain America: Il primo Vendicatore",
    year: 2011,
    releaseDate: "2011-07-22",
    kind: "film",
    duration: "124 min",
    lead: { character: "Peggy Carter", actress: "Hayley Atwell" },
    accent: ["#1f4d3a", "#0b1a14"],
    synopsis:
      "Steve Rogers da recluta rifiutata a simbolo di guerra, con Peggy Carter come vera architetta della sua trasformazione.",
    whyDoomsday:
      "L'origine di Steve Rogers, che torna in Doomsday: qui nascono lo scudo, l'HYDRA e il legame con Bucky.",
    trivia: [
      "Hayley Atwell ha ripreso il ruolo di Peggy al cinema, nella serie Agent Carter e in What If...?.",
      "Il fisico gracile di Steve prima del siero è stato ottenuto combinando effetti visivi e una controfigura.",
      "La regia è di Joe Johnston, che aveva già diretto l'avventura retro Rocketeer.",
      "Le scene ambientate a New York negli anni Quaranta furono girate in gran parte a Manchester.",
    ],
  },
  {
    slug: "the-avengers",
    title: "The Avengers",
    year: 2012,
    releaseDate: "2012-05-04",
    kind: "film",
    duration: "143 min",
    lead: { character: "Vedova Nera", actress: "Scarlett Johansson" },
    accent: ["#2b2f7a", "#0a0c1c"],
    synopsis:
      "Sei eroi che non si sopportano diventano una squadra durante la battaglia di New York. Il crossover che ha inventato il modello MCU.",
    whyDoomsday:
      "Il primo raduno: definisce cosa significa Avengers e il tono che Doomsday andrà a ribaltare.",
    trivia: [
      "Scarlett Johansson aveva debuttato come Natasha Romanoff in Iron Man 2, nel 2010.",
      "L'inquadratura circolare sulla squadra è diventata l'immagine simbolo dell'intero MCU.",
      "Joss Whedon ha diretto il film e riscritto la sceneggiatura.",
      "Ha superato 1,5 miliardi di dollari di incasso globale, terzo film di sempre all'epoca.",
    ],
  },
  {
    slug: "avengers-infinity-war",
    title: "Avengers: Infinity War",
    year: 2018,
    releaseDate: "2018-04-27",
    kind: "film",
    duration: "149 min",
    lead: { character: "Gamora", actress: "Zoe Saldana" },
    accent: ["#5b2470", "#140a1c"],
    synopsis:
      "Thanos raccoglie le Gemme dell'Infinito. Il film è costruito attorno al suo punto di vista, e Gamora ne è il centro emotivo.",
    whyDoomsday:
      "Stabilisce il modello del cattivo che tiene insieme un cast enorme, lo stesso ruolo che in Doomsday avrà il Dottor Destino.",
    trivia: [
      "I registi hanno dichiarato che il film è raccontato dal punto di vista di Thanos: è lui il protagonista.",
      "Zoe Saldana ha recitato in più di uno dei film con i maggiori incassi di sempre, tra la saga di Avatar e quella degli Avengers.",
      "Girato back to back con Endgame, in un'unica lunghissima produzione.",
      "Il trucco verde di Gamora richiedeva ore di applicazione a ogni giornata di riprese.",
    ],
  },
  {
    slug: "avengers-endgame",
    title: "Avengers: Endgame",
    year: 2019,
    releaseDate: "2019-04-26",
    kind: "film",
    duration: "181 min",
    lead: { character: "Capitan Marvel", actress: "Brie Larson" },
    accent: ["#b3521a", "#1c0d06"],
    synopsis:
      "Cinque anni dopo lo schiocco, i sopravvissuti tentano il viaggio nel tempo. La chiusura della Saga dell'Infinito.",
    whyDoomsday:
      "Il punto di arrivo che Doomsday deve superare: chi è morto, chi si è ritirato e chi è rimasto in gioco parte da qui.",
    trivia: [
      "Brie Larson aveva già vinto l'Oscar come miglior attrice per Room, nel 2016.",
      "Con 181 minuti è il film più lungo dell'MCU.",
      "La sequenza in cui le eroine si schierano insieme sul campo di battaglia è diventata uno dei momenti più discussi del film.",
      "Ha superato Avatar diventando temporaneamente il film con il maggiore incasso di sempre.",
    ],
  },
  {
    slug: "loki",
    title: "Loki",
    year: 2021,
    releaseDate: "2021-06-09",
    kind: "serie",
    duration: "2 stagioni, 12 episodi",
    lead: { character: "Sylvie", actress: "Sophia Di Martino" },
    accent: ["#2f6b4f", "#0a1712"],
    synopsis:
      "La TVA, le linee temporali potate e la variante Sylvie. La serie che ha materialmente aperto il Multiverso dell'MCU.",
    whyDoomsday:
      "Senza Loki non esiste il Multiverso di Doomsday: qui cade Colui che Rimane e le realtà iniziano a moltiplicarsi.",
    trivia: [
      "Sylvie è una variante creata per la serie, non la trasposizione diretta di un personaggio dei fumetti.",
      "Loki è stata la prima serie Marvel Studios a ottenere il rinnovo per una seconda stagione.",
      "Natalie Holt è stata la prima compositrice donna a firmare le musiche di una serie Marvel Studios.",
      "Il finale della prima stagione fa cadere il vincolo temporale e apre ufficialmente le realtà alternative.",
    ],
  },
  {
    slug: "shang-chi",
    title: "Shang-Chi e la leggenda dei Dieci Anelli",
    year: 2021,
    releaseDate: "2021-09-03",
    kind: "film",
    duration: "132 min",
    lead: { character: "Xialing", actress: "Meng'er Zhang" },
    accent: ["#8a2c1f", "#1a0907"],
    synopsis:
      "Un figlio in fuga dall'eredità del padre. Arti marziali, mitologia cinese e la sorella Xialing che si prende ciò che le spetta.",
    whyDoomsday:
      "Gli Anelli lanciano un segnale verso qualcosa fuori dalla nostra realtà: un filo aperto che punta al Multiverso.",
    trivia: [
      "Meng'er Zhang era al debutto cinematografico: veniva dal teatro musicale in Cina.",
      "Tony Leung, leggenda del cinema di Hong Kong, ha girato qui il suo primo film hollywoodiano.",
      "Le coreografie sono di Brad Allan, allievo di Jackie Chan: il film è dedicato alla sua memoria.",
      "Nella scena post-credit Xialing prende il comando dell'organizzazione dei Dieci Anelli.",
    ],
  },
  {
    slug: "spider-man-no-way-home",
    title: "Spider-Man: No Way Home",
    year: 2021,
    releaseDate: "2021-12-17",
    kind: "film",
    duration: "148 min",
    lead: { character: "MJ", actress: "Zendaya" },
    accent: ["#8c1c2b", "#160709"],
    synopsis:
      "Un incantesimo sbagliato spalanca le porte tra universi. Villain e Spider-Man di altre realtà arrivano nel mondo di Peter.",
    whyDoomsday:
      "La prima volta che il pubblico vede un vero attraversamento tra universi in live action: il precedente diretto di Doomsday.",
    trivia: [
      "Il personaggio di Zendaya si chiama Michelle Jones-Watson: non è la Mary Jane dei film precedenti.",
      "Il film riunisce sullo schermo i tre attori che hanno interpretato Spider-Man al cinema.",
      "Nel finale l'identità di Peter viene cancellata dalla memoria di tutti, MJ compresa.",
      "Zendaya ha vinto due Emmy come miglior attrice protagonista per Euphoria.",
    ],
  },
  {
    slug: "doctor-strange-multiverse-of-madness",
    title: "Doctor Strange nel Multiverso della Follia",
    year: 2022,
    releaseDate: "2022-05-06",
    kind: "film",
    duration: "126 min",
    lead: { character: "Scarlet Witch", actress: "Elizabeth Olsen" },
    accent: ["#6d1730", "#170610"],
    synopsis:
      "Strange attraversa realtà alternative inseguito da una Wanda devastata dal lutto. Horror soprannaturale in chiave Marvel.",
    whyDoomsday:
      "Mostra le regole del Multiverso, le incursioni e cosa succede quando due universi si toccano: la meccanica di Doomsday.",
    trivia: [
      "Alla regia c'è Sam Raimi, di ritorno al cinecomic dopo la sua trilogia di Spider-Man.",
      "Elizabeth Olsen arriva qui direttamente da WandaVision, che le è valsa una candidatura agli Emmy.",
      "Le musiche sono di Danny Elfman, storico collaboratore di Raimi.",
      "Il film porta al centro il concetto di incursione tra universi, decisivo per il finale della Saga del Multiverso.",
    ],
  },
  {
    slug: "black-panther-wakanda-forever",
    title: "Black Panther: Wakanda Forever",
    year: 2022,
    releaseDate: "2022-11-11",
    kind: "film",
    duration: "161 min",
    lead: { character: "Shuri", actress: "Letitia Wright" },
    accent: ["#4a2178", "#0f0818"],
    synopsis:
      "Il Wakanda piange il suo re e affronta Namor. Shuri passa dal laboratorio al manto di Black Panther.",
    whyDoomsday:
      "Assetti geopolitici, vibranio e la nuova Black Panther: lo stato del Wakanda con cui Doomsday dovrà fare i conti.",
    trivia: [
      "Letitia Wright eredita il manto di Black Panther nel finale del film.",
      "Marvel ha scelto di non ricastare T'Challa dopo la morte di Chadwick Boseman, riscrivendo il film come un omaggio.",
      "Angela Bassett è stata la prima interprete candidata all'Oscar per una recitazione in un film Marvel Studios.",
      "Rihanna è tornata alla musica dopo anni scrivendo Lift Me Up per la colonna sonora.",
    ],
  },
  {
    slug: "deadpool-and-wolverine",
    title: "Deadpool & Wolverine",
    year: 2024,
    releaseDate: "2024-07-26",
    kind: "film",
    duration: "128 min",
    lead: { character: "Vanessa", actress: "Morena Baccarin" },
    accent: ["#a01523", "#170608"],
    synopsis:
      "Wade Wilson entra nell'MCU passando per la TVA e trascina con sé un Logan di un'altra realtà. Il Vuoto e i resti dell'universo Fox.",
    whyDoomsday:
      "Cuce ufficialmente il mondo Fox dentro l'MCU: il ponte narrativo che permette agli X-Men di comparire in Doomsday.",
    trivia: [
      "Morena Baccarin torna nel ruolo di Vanessa dopo i due film precedenti del franchise.",
      "È il primo film di Deadpool prodotto da Marvel Studios all'interno dell'MCU.",
      "È diventato il film vietato ai minori con il maggiore incasso di sempre.",
      "Hugh Jackman indossa per la prima volta il costume giallo e blu classico di Wolverine.",
    ],
  },
  {
    slug: "captain-america-brave-new-world",
    title: "Captain America: Brave New World",
    year: 2025,
    releaseDate: "2025-02-14",
    kind: "film",
    duration: "118 min",
    lead: { character: "Ruth Bat-Seraph", actress: "Shira Haas" },
    accent: ["#1d4f6b", "#08151c"],
    synopsis:
      "Sam Wilson porta lo scudo dentro un thriller politico, contro un presidente Ross che ha molto da nascondere.",
    whyDoomsday:
      "Definisce chi è Captain America oggi e in che rapporti è il governo americano con i super: contesto diretto per Doomsday.",
    trivia: [
      "Shira Haas è nota internazionalmente per Unorthodox, che le è valsa una candidatura agli Emmy.",
      "È il primo film in cui Anthony Mackie è protagonista assoluto nel ruolo di Captain America.",
      "Harrison Ford subentra nel ruolo di Thaddeus Ross, già interpretato da William Hurt.",
      "Il film recupera trame lasciate aperte da L'incredibile Hulk del 2008.",
    ],
  },
  {
    slug: "thunderbolts",
    title: "Thunderbolts*",
    year: 2025,
    releaseDate: "2025-05-02",
    kind: "film",
    duration: "127 min",
    lead: { character: "Yelena Belova", actress: "Florence Pugh" },
    accent: ["#8a5a12", "#1a1105"],
    synopsis:
      "Un gruppo di antieroi mandati allo sbaraglio scopre di essere usato. Yelena è il cuore di una squadra che non voleva esistere.",
    whyDoomsday:
      "Assembla la squadra che entra in Doomsday: il titolo stesso nasconde chi diventeranno davvero.",
    trivia: [
      "Florence Pugh è stata candidata all'Oscar come attrice non protagonista per Piccole donne.",
      "Yelena Belova aveva debuttato nell'MCU in Black Widow, nel 2021.",
      "L'asterisco nel titolo è parte di un colpo di scena rivelato solo nel finale.",
      "Alla regia c'è Jake Schreier, arrivato al film dopo la serie Beef.",
    ],
  },
  {
    slug: "fantastic-four-first-steps",
    title: "I Fantastici 4: Gli inizi",
    year: 2025,
    releaseDate: "2025-07-25",
    kind: "film",
    duration: "115 min",
    lead: { character: "Donna Invisibile", actress: "Vanessa Kirby" },
    accent: ["#1a4f8a", "#07121e"],
    synopsis:
      "Una New York retrofuturista anni Sessanta, la Prima Famiglia Marvel e una minaccia cosmica su scala planetaria.",
    whyDoomsday:
      "I Fantastici Quattro sono uno dei tre universi che collidono in Doomsday, e Sue Storm ne è la figura centrale.",
    trivia: [
      "Vanessa Kirby è stata candidata all'Oscar come miglior attrice per Pieces of a Woman.",
      "È il primo film dei Fantastici Quattro prodotto da Marvel Studios.",
      "L'ambientazione è una realtà alternativa dall'estetica retrofuturista anni Sessanta.",
      "Pedro Pascal interpreta Reed Richards accanto alla Sue Storm di Kirby.",
    ],
  },
];

export const DOOMSDAY_RELEASE = "2026-12-18";

export function getFilm(slug: string): Film | undefined {
  return FILMS.find((f) => f.slug === slug);
}
