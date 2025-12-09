
import { ProcessingOptions } from "../types";

// --- Data Dictionaries ---

const STOPWORDS_EN = new Set([
  "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "with", 
  "it", "this", "that", "these", "those", "he", "she", "they", "we", "you", "i", "me", "him", "her", "us", "them",
  "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "should", "could", "can"
]);

const STOPWORDS_ID = new Set([
  "yang", "dan", "di", "ke", "dari", "ini", "itu", "pada", "untuk", "adalah", "dengan", "saya", "aku", "kita", "kami",
  "kamu", "dia", "mereka", "juga", "akan", "sudah", "bisa", "saat", "oleh", "tapi", "tetapi", "namun", "karena",
  "jika", "kalau", "agar", "supaya", "seperti", "sebagai", "bagi", "pada", "tentang", "atau", "pun", "apakah"
]);

const TYPO_MAP_EN: Record<string, string> = {
  // Common Misspellings
  "teh": "the", "adn": "and", "thatn": "than", "waht": "what", "thier": "their", "wierd": "weird",
  "definately": "definitely", "seperate": "separate", "alot": "a lot", "achive": "achieve",
  "adress": "address", "advertisment": "advertisement", "advice": "advice", "advise": "advise",
  "agression": "aggression", "allready": "already", "amature": "amateur", "anual": "annual",
  "aparent": "apparent", "aquire": "acquire", "arguement": "argument", "athiest": "atheist",
  "awfull": "awful", "becuase": "because", "becomeing": "becoming", "begining": "beginning",
  "beleive": "believe", "benifit": "benefit", "bizzare": "bizarre", "buisness": "business",
  "calender": "calendar", "camaflouge": "camouflage", "catagory": "category", "cemetery": "cemetery",
  "collegue": "colleague", "comming": "coming", "commitee": "committee", "completly": "completely",
  "concious": "conscious", "curiousity": "curiosity", "decieve": "deceive", "definate": "definite",
  "desparate": "desperate", "diffrence": "difference", "dilema": "dilemma", "dissapear": "disappear",
  "dissapoint": "disappoint", "ecstacy": "ecstasy", "embarass": "embarrass", "enviroment": "environment",
  "existance": "existence", "facinating": "fascinating", "familar": "familiar", "finally": "finally",
  "fluorescent": "fluorescent", "foriegn": "foreign", "forseeable": "foreseeable", "fourty": "forty",
  "forward": "forward", "freind": "friend", "further": "further", "gist": "gist", "glamourous": "glamorous",
  "goverment": "government", "guard": "guard", "happen": "happen", "harrass": "harass", "humourous": "humorous",
  "idiosyncracy": "idiosyncrasy", "immediatly": "immediately", "incidently": "incidentally", "independant": "independent",
  "interupt": "interrupt", "irresistable": "irresistible", "knowledge": "knowledge", "liason": "liaison",
  "lollipop": "lollipop", "millennium": "millennium", "miniture": "miniature", "mischevious": "mischievous",
  "missspell": "misspell", "neccessary": "necessary", "neice": "niece", "nieghbor": "neighbor",
  "noticable": "noticeable", "ocassion": "occasion", "occur": "occur", "occured": "occurred",
  "occurence": "occurrence", "pavillion": "pavilion", "persistant": "persistent", "peice": "piece",
  "politican": "politician", "possession": "possession", "prefered": "preferred", "propaganda": "propaganda",
  "publically": "publicly", "really": "really", "recieve": "receive", "refered": "referred",
  "religous": "religious", "rember": "remember", "resistence": "resistance", "sence": "sense",
  "sieze": "seize", "shoudl": "should", "siege": "siege", "succesful": "successful",
  "supercede": "supersede", "suprise": "surprise", "tatoo": "tattoo", "tendancy": "tendency",
  "therefore": "therefore", "threshold": "threshold", "tommorow": "tomorrow", "tounge": "tongue",
  "truly": "truly", "unforseen": "unforeseen", "unfortunatly": "unfortunately", "untill": "until",
  "wether": "whether", "which": "which", "wich": "which", "whitch": "which"
};

const TYPO_MAP_ID: Record<string, string> = {
  // Non-Standard to Standard (Baku)
  "aktip": "aktif", "aktifitas": "aktivitas", "amandemen": "amendemen", "analisa": "analisis", 
  "antri": "antre", "antrian": "antrean", "apotik": "apotek", "azas": "asas", 
  "atlit": "atlet", "atm": "anjungan tunai mandiri", 
  "bosen": "bosan", "bis": "bus", "besok": "esok", 
  "cabe": "cabai", "cidera": "cedera", "coklat": "cokelat", "capek": "capai", "cape": "capai",
  "daptar": "daftar", "debet": "debit", "diagnosa": "diagnosis", "duren": "durian",
  "efektip": "efektif", "ekstrim": "ekstrem", "elit": "elite", 
  "faham": "paham", "fikir": "pikir", "frekwensi": "frekuensi", "foto": "foto", "photo": "foto",
  "gubug": "gubuk", "guncang": "guncang", "goncang": "guncang",
  "hafal": "hapal", "hakekat": "hakikat", "handal": "andal", "hembus": "embus", "himbau": "imbau", "hutang": "utang",
  "ijasah": "ijazah", "ijin": "izin", "iklas": "ikhlas", "indera": "indra", "isteri": "istri",
  "jadual": "jadwal", "jaman": "zaman", "jendral": "jenderal", 
  "kadaluarsa": "kedaluwarsa", "kalo": "kalau", "karir": "karier", "kawatir": "khawatir", 
  "kongkrit": "konkret", "kreatifitas": "kreativitas", "kwalitas": "kualitas", "kwitansi": "kuitansi",
  "lobang": "lubang", 
  "maap": "maaf", "macem": "macam", "managemen": "manajemen", "menejemen": "manajemen", 
  "merubah": "mengubah", "mesjid": "masjid", "metoda": "metode", "milyar": "miliar", "musium": "museum",
  "nampak": "tampak", "nasehat": "nasihat", "negri": "negeri", "nomer": "nomor",
  "obyek": "objek", "olahraga": "olahraga", "omset": "omzet",
  "paham": "paham", "pebruari": "februari", "perduli": "peduli", "praktek": "praktik", 
  "propinsi": "provinsi", "prosen": "persen", "prosentase": "persentase", "putera": "putra", "puteri": "putri",
  "rame": "ramai", "rapot": "rapor", "realita": "realitas", "relijius": "religius", 
  "resiko": "risiko", "rejeki": "rezeki", "rubah": "ubah", "rubuh": "roboh",
  "sate": "satai", "sekedar": "sekadar", "sekretaris": "sekretaris", "seprei": "seprai", 
  "sistim": "sistem", "sopir": "sopir", "supir": "sopir", "standar": "standar", "standard": "standar",
  "subyek": "subjek", "surga": "surga", "syah": "sah", "syaraf": "saraf",
  "telor": "telur", "teoritis": "teoretis", "terampil": "terampil", "trampil": "terampil",
  "terlantar": "telantar", "tauladan": "teladan", "tobat": "tobat", 
  "ustad": "ustaz", "utang": "utang", 
  "varitas": "varietas", 
  "walikota": "wali kota", 
  "zona": "zona"
};

const SLANG_MAP_EN: Record<string, string> = {
  // Pronouns & Basic verbs
  "u": "you", "ya": "you", "yu": "you", "uu": "you", "yer": "your",
  "r": "are", 
  "ur": "your", "urs": "yours", 
  "im": "i am", "ive": "i have", "ill": "i will", "id": "i would",
  "ure": "you are", 
  "theres": "there is", "thats": "that is", "whts": "what is",
  
  // Common contractions
  "aint": "is not", "arent": "are not", "cant": "cannot", "couldnt": "could not", 
  "didnt": "did not", "doesnt": "does not", "dont": "do not", "hadnt": "had not", 
  "hasnt": "has not", "havent": "have not", "isnt": "is not", "mightnt": "might not", 
  "mustnt": "must not", "neednt": "need not", "shant": "shall not", "shouldnt": "should not", 
  "wasnt": "was not", "werent": "were not", "wont": "will not", "wouldnt": "would not",
  "yall": "you all", 
  
  // Internet Slang
  "brb": "be right back", 
  "btw": "by the way", 
  "idk": "i do not know", "dunno": "i do not know", 
  "tbh": "to be honest", 
  "imho": "in my humble opinion", "imo": "in my opinion",
  "lol": "laughing out loud", "lmao": "laughing my ass off", "rofl": "rolling on the floor laughing", 
  "thx": "thanks", "thnx": "thanks", "tnx": "thanks", "ty": "thank you", 
  "pls": "please", "plz": "please", "plis": "please", 
  "gr8": "great", 
  "cuz": "because", "bc": "because", "coz": "because", "cos": "because",
  "dm": "direct message", "pm": "private message",
  "nvm": "never mind", 
  "irl": "in real life", 
  "jk": "just kidding", 
  "w/": "with", "wit": "with", 
  "w/o": "without", 
  "ppl": "people", "peeps": "people",
  "gonna": "going to", "gon": "going to",
  "wanna": "want to", "wan": "want to",
  "gotta": "got to", 
  "kinda": "kind of", "sorta": "sort of",
  "lemme": "let me", "gimme": "give me", 
  "innit": "is it not", 
  "sup": "what is up", "wusup": "what is up", "wassup": "what is up",
  "nm": "nothing much", 
  "atm": "at the moment", 
  "rn": "right now", 
  "asap": "as soon as possible", 
  "fyi": "for your information", 
  "gtg": "got to go", "g2g": "got to go",
  "msg": "message", 
  "omg": "oh my god", 
  "ttyl": "talk to you later", 
  "b4": "before", 
  "afk": "away from keyboard",
  "faq": "frequently asked questions",
  "aka": "also known as",
  "diy": "do it yourself",
  "np": "no problem",
  "yw": "you are welcome",
  "gl": "good luck", "hf": "have fun", "gg": "good game",
  "wp": "well played",
  "rip": "rest in peace",
  "pic": "picture", "pics": "pictures",
  "sec": "second", "min": "minute", "hr": "hour",
  "fav": "favorite", "fave": "favorite",
  "avg": "average",
  "approx": "approximately",
  "vs": "versus",
  "temp": "temperature",
  "info": "information",
  "diff": "difference",
  "max": "maximum",
  "vol": "volume",
};

const SLANG_MAP_ID: Record<string, string> = {
  // Pronouns
  "gw": "saya", "gue": "saya", "gua": "saya", "gwe": "saya", "aku": "saya", "aq": "saya", 
  "lu": "kamu", "lo": "kamu", "elo": "kamu", "luh": "kamu", "km": "kamu", "kmu": "kamu",
  "dy": "dia", "dee": "dia", "mrk": "mereka", "kt": "kita", "qt": "kita", 
  "sy": "saya", "sya": "saya",
  
  // Negation
  "gk": "tidak", "gak": "tidak", "ga": "tidak", "nggak": "tidak", "ngak": "tidak", 
  "g": "tidak", "tdk": "tidak", "tak": "tidak",
  
  // Common Conjunctions/Prepositions
  "yg": "yang", "iyg": "yang", 
  "dgn": "dengan", "dg": "dengan", 
  "dr": "dari", "dri": "dari", 
  "dlm": "dalam", 
  "utk": "untuk", "untk": "untuk", 
  "pd": "pada", "pda": "pada",
  "krn": "karena", "karna": "karena", "coz": "karena", "cz": "karena",
  "tp": "tapi", "tpi": "tapi", "ttg": "tentang", 
  "ato": "atau", "atw": "atau", 
  "kl": "kalau", "klo": "kalau", "kalo": "kalau", 
  "jika": "kalau", 
  "spt": "seperti", "sprti": "seperti",
  "bwt": "buat", 
  "sm": "sama", 
  
  // Adverbs/Time
  "bgt": "banget", "bngt": "banget", "kali": "banget",
  "skrg": "sekarang", "skrng": "sekarang", 
  "bsk": "besok", 
  "kpn": "kapan", 
  "sdh": "sudah", "udah": "sudah", "udh": "sudah", "da": "sudah", "dah": "sudah", 
  "blm": "belum", "lom": "belum", "lum": "belum",
  "trs": "terus", "trus": "terus", 
  "juga": "juga", "jg": "juga", "jga": "juga", "jug": "juga",
  "mgkn": "mungkin", "mngkin": "mungkin", "mungkin": "mungkin",
  "cpt": "cepat", "cepet": "cepat",
  "bhy": "bahaya", 
  "smpe": "sampai", "sampe": "sampai", "nyampe": "sampai",
  "aja": "saja", "aj": "saja", "ja": "saja",
  "emang": "memang", "emg": "memang", "mang": "memang",
  
  // Verbs/Actions
  "tahu": "tahu", "tau": "tahu", "taw": "tahu",
  "blg": "bilang", 
  "mn": "mana", "dimana": "di mana", "dimn": "di mana",
  "cb": "coba", "cba": "coba",
  "bs": "bisa", "bisa", "bisa",
  "mw": "mau", "mo": "mau",
  "lg": "lagi", "lgi": "lagi", 
  "ngapain": "sedang apa", 
  "knp": "kenapa", "napa": "kenapa", "np": "kenapa",
  "dtg": "datang", "dtng": "datang",
  "plg": "pulang", 
  "tdr": "tidur",
  "mkn": "makan", 
  "minum": "minum", "mnm": "minum",
  "liat": "lihat", "lht": "lihat",
  "baca": "baca", "bc": "baca",
  "tulis": "tulis", "nulis": "menulis",
  "kasih": "beri", "ksih": "beri", "ksh": "beri", 
  "mksh": "terima kasih", "makasih": "terima kasih", "tks": "terima kasih", "thx": "terima kasih", "maacih": "terima kasih",
  "mhn": "mohon", 
  "minta": "minta", "mnta": "minta",
  "suka": "suka", 
  "sayang": "sayang", "syg": "sayang", "syng": "sayang",
  "cinta": "cinta", "luv": "cinta",
  
  // Nouns/People
  "org": "orang", "orng": "orang", 
  "tmn": "teman", "temen": "teman", 
  "bpk": "bapak", 
  "ibu": "ibu", "nyokap": "ibu", 
  "ayah": "ayah", "bokap": "ayah", 
  "adek": "adik", "adk": "adik", 
  "kakak": "kakak", "kaka": "kakak", "kk": "kakak",
  "tmpt": "tempat", 
  "rmh": "rumah", 
  "sklh": "sekolah", 
  "univ": "universitas", "kampus": "universitas",
  "indo": "indonesia", "ina": "indonesia",
  "jkt": "jakarta", 
  "jogja": "yogyakarta",
  "sby": "surabaya",
  "bdg": "bandung",
  
  // Expressions
  "ok": "oke", "oke": "oke", "sip": "oke", "y": "ya", "iya": "ya", 
  "gpp": "tidak apa-apa", "gapapa": "tidak apa-apa", 
  "wkwk": "tertawa", "wkwkwk": "tertawa", "wk": "tertawa", "haha": "tertawa", "huhu": "menangis",
  "lol": "tertawa", 
  "omg": "astaga", 
  "anjir": "astaga", "njir": "astaga",
  
  // Misc
  "dll": "dan lain-lain", 
  "dsb": "dan sebagainya", 
  "dst": "dan seterusnya", 
  "kpgn": "kepengin", "pengen": "ingin", 
  "lbh": "lebih", 
  "krg": "kurang", 
  "dikit": "sedikit", "skt": "sakit", 
  "bbrp": "beberapa",
  "skali": "sekali",
  "gini": "begini", "gni": "begini",
  "gitu": "begitu", "gtu": "begitu", "gt": "begitu",
  "nie": "ini", "nih": "ini", "ni": "ini",
  "tu": "itu", "tuh": "itu", 
  "donk": "dong", "dong": "dong",
  "deh": "deh", 
  "gan": "juragan", "sis": "kakak", "bro": "kakak", "sob": "sobat", "guys": "teman-teman"
};

// --- Helper Algorithms ---

/**
 * Porter Stemmer for English
 */
const porterStemmer = (w: string): string => {
  if (w.length < 3) return w;
  const step2list: Record<string, string> = {
    "ational": "ate", "tional": "tion", "enci": "ence", "anci": "ance", "izer": "ize", 
    "bli": "ble", "alli": "al", "entli": "ent", "eli": "e", "ousli": "ous", 
    "ization": "ize", "ation": "ate", "ator": "ate", "alism": "al", "iveness": "ive", 
    "fulness": "ful", "ousness": "ous", "aliti": "al", "iviti": "ive", "biliti": "ble", "logi": "log"
  };
  const step3list: Record<string, string> = {
    "icate": "ic", "ative": "", "alize": "al", "iciti": "ic", "ical": "ic", "ful": "", "ness": ""
  };
  const c = "[^aeiou]"; const v = "[aeiouy]"; const C = c + "[^aeiouy]*"; const V = v + "[aeiou]*";
  const mgr0 = "^(" + C + ")?" + V + C;
  const s_v = "^(" + C + ")?" + v;
  let stem = w;

  if (/sses$/.test(stem)) stem = stem.replace(/sses$/, "ss");
  else if (/ies$/.test(stem)) stem = stem.replace(/ies$/, "i");
  else if (/ss$/.test(stem)) stem = stem.replace(/ss$/, "ss");
  else if (/s$/.test(stem)) stem = stem.replace(/s$/, "");

  let re = new RegExp("eed$");
  if (re.test(stem)) {
    var fp = re.exec(stem);
    if (fp && new RegExp(mgr0).test(fp.input.substr(0, fp.index))) stem = stem.replace(/eed$/, "ee");
  } else {
    re = new RegExp("ed$");
    let re2 = new RegExp("ing$");
    if (re.test(stem) && new RegExp(s_v).test(stem.replace(/ed$/, ""))) stem = stem.replace(/ed$/, "");
    else if (re2.test(stem) && new RegExp(s_v).test(stem.replace(/ing$/, ""))) stem = stem.replace(/ing$/, "");
  }
  
  // Simplified Step 2 & 3 for brevity in this single-file implementation
  if (/y$/.test(stem) && new RegExp(s_v).test(stem.replace(/y$/, ""))) stem = stem.replace(/y$/, "i");
  for (const suffix in step2list) {
    if (stem.endsWith(suffix) && new RegExp(mgr0).test(stem.substring(0, stem.length - suffix.length))) {
      stem = stem.substring(0, stem.length - suffix.length) + step2list[suffix]; break; 
    }
  }
  return stem;
};

/**
 * Lightweight Indonesian Stemmer (Rule-based)
 * Removes common prefixes (meng-, ber-, di-) and suffixes (-kan, -an, -lah)
 */
const indonesianStemmer = (word: string): string => {
  let stem = word;
  if (stem.length <= 3) return stem;

  // 1. Remove particles (-lah, -kah, -tah, -pun)
  stem = stem.replace(/([km]u|nya|[lk]ah|pun)$/, '');
  
  // 2. Remove Possessive Pronouns (-ku, -mu, -nya) - done again for combination cases
  stem = stem.replace(/([km]u|nya)$/, '');

  // 3. Remove Suffixes (-kan, -an, -i)
  if (stem.endsWith('kan')) stem = stem.slice(0, -3);
  else if (stem.endsWith('an') && stem.length > 4) stem = stem.slice(0, -2);
  else if (stem.endsWith('i') && !stem.endsWith('ki') && !stem.endsWith('di')) stem = stem.slice(0, -1);

  // 4. Remove Prefixes
  // Simple check to avoid over-stemming
  if (/^(meng|peng|per|mem|pem|men|pen)/.test(stem)) {
     stem = stem.replace(/^(meng|peng)/, 'k')
                .replace(/^(mem|pem)/, 'p')
                .replace(/^(men|pen)/, 't')
                .replace(/^(per|ber|ter|bel)/, '') // simplified
                .replace(/^di/, '')
                .replace(/^ke/, '')
                .replace(/^se/, '');
  } else if (/^(ber|ter|di|ke|se)/.test(stem)) {
    stem = stem.replace(/^(ber|ter|di|ke|se)/, '');
  }
  
  return stem;
};

// --- Cleaning Functions ---

const removeMentions = (text: string): string => text.replace(/@[a-zA-Z0-9_]+/g, '');
const removeHashtags = (text: string): string => text.replace(/#[a-zA-Z0-9_]+/g, '');

const removeRepeatedChars = (text: string): string => {
  // Reduces 3+ repeated characters to 1 (e.g., "sooooo" -> "so")
  return text.replace(/(.)\1{2,}/g, '$1');
};

const normalizeSlangWords = (
  text: string, 
  lang: 'en' | 'id', 
  useDefault: boolean,
  useCustom: boolean,
  customRaw: string
): string => {
  let mergedMap: Record<string, string> = {};

  if (useDefault) {
    const defaultMap = lang === 'id' ? SLANG_MAP_ID : SLANG_MAP_EN;
    mergedMap = { ...defaultMap };
  }

  if (useCustom && customRaw) {
    const customMap: Record<string, string> = {};
    customRaw.split('\n').forEach(line => {
      // Split by first equals sign only
      const idx = line.indexOf('=');
      if (idx !== -1) {
        const key = line.substring(0, idx).trim().toLowerCase();
        const val = line.substring(idx + 1).trim();
        if (key && val) {
           customMap[key] = val;
        }
      }
    });
    // Custom overwrites default
    mergedMap = { ...mergedMap, ...customMap };
  }

  // If map is empty, return original
  if (Object.keys(mergedMap).length === 0) return text;

  // Perform replacement
  return text.split(/\s+/).map(word => {
    // Basic punctuation stripping for lookup (e.g. "word," -> "word")
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    const replacement = mergedMap[cleanWord];
    return replacement || word;
  }).join(" ");
};

const fixTypos = (text: string, lang: 'en' | 'id'): string => {
  const map = lang === 'id' ? TYPO_MAP_ID : TYPO_MAP_EN;
  
  return text.split(/\s+/).map(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    const replacement = map[cleanWord];
    return replacement || word;
  }).join(" ");
};

const applyStemming = (text: string, lang: 'en' | 'id'): string => {
  if (lang === 'id') {
    return text.split(/\s+/).map(indonesianStemmer).join(" ");
  }
  return text.split(/\s+/).map(porterStemmer).join(" ");
};

// --- Main Processor ---

export const processText = async (
  text: string, 
  options: ProcessingOptions
): Promise<string> => {
  let processed = text;

  // 1. Structural Removal
  if (options.removeUrls) processed = processed.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
  if (options.removeEmails) processed = processed.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
  if (options.removeMentions) processed = removeMentions(processed);
  if (options.removeHashtags) processed = removeHashtags(processed);
  if (options.removeEmoji) processed = processed.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  
  // 2. Normalization
  if (options.lowercase) processed = processed.toLowerCase();
  if (options.removeRepeatedChars) processed = removeRepeatedChars(processed);
  
  // Typo Correction (Standardization) - Run BEFORE slang for safety
  if (options.fixTypos) {
    processed = fixTypos(processed, options.language);
  }

  // Slang Normalization (Built-in OR Custom OR Both)
  if (options.normalizeSlang || (options.useCustomSlang && options.customSlangRaw)) {
    processed = normalizeSlangWords(
      processed, 
      options.language, 
      options.normalizeSlang, 
      options.useCustomSlang,
      options.customSlangRaw
    );
  }

  // 3. Noise Removal
  if (options.removePunctuation) processed = processed.replace(/[^\w\s]|_/g, " ").replace(/\s+/g, " ");
  if (options.removeNumbers) processed = processed.replace(/\d+/g, "");
  
  if (options.removeStopwords) {
    const stopSet = options.language === 'id' ? STOPWORDS_ID : STOPWORDS_EN;
    processed = processed.split(/\s+/).filter(word => !stopSet.has(word.toLowerCase())).join(" ");
  }
  
  // 4. Advanced Transformation (Stemming)
  if (options.stemming) processed = applyStemming(processed, options.language);

  // 5. Custom Regex
  if (options.customCleaning && options.customFind) {
    try {
      const regex = new RegExp(options.customFind, 'gi');
      processed = processed.replace(regex, options.customReplace || '');
    } catch (e) {
      console.warn("Invalid Custom Regex");
    }
  }

  // 6. Final Cleanup
  if (options.removeWhitespace) processed = processed.replace(/\s+/g, " ").trim();

  return processed;
};
