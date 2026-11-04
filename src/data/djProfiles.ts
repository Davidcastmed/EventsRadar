import { DJProfile } from '../types/index.ts';

export const SAMPLE_USER_DJ: DJProfile = {
  id: "dj-ellen-allien",
  artistName: "Ellen Allien",
  realName: "Ellen Fraatz",
  role: "dj_producer",
  city: "berlin",
  genres: [
    "Acid Techno",
    "Electro",
    "Peak Time Techno"
  ],
  bio: "Berliner Techno-Pionierin, BPitch Control und UFO Inc. Gründerin. Berühmt für energetische Acid-Sets und analoge Synthesizer.",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=EllenAllien",
  bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
  soundCloudUrl: "https://soundcloud.com/ellen-allien",
  spotifyUrl: "https://open.spotify.com/artist/ellenallien",
  instagramUrl: "https://instagram.com/ellen.allien",
  residentClubs: [
    "Tresor",
    "Nitsa Club",
    "Circoloco"
  ],
  gearEquipment: "Pioneer CDJ-3000, Roland TB-303, Elektron Octatrack",
  bookingEmail: "booking@bpitch.de",
  isVerified: true,
  releases: [
    {
      title: "Alientronic",
      label: "BPitch Control",
      year: 2019,
      link: "https://bpitch.de"
    },
    {
      title: "Auraaa",
      label: "BPitch Control",
      year: 2020,
      link: "https://bpitch.de"
    }
  ],
  upcomingGigs: [
    {
      title: "We Are Not Alone",
      date: "2026-11-20",
      venue: "RSO Berlin",
      city: "berlin"
    },
    {
      title: "UFO Night",
      date: "2026-12-05",
      venue: "Tresor",
      city: "berlin"
    }
  ],
  createdBy: "system_seed",
  createdAt: "2026-10-15T10:00:00.000Z"
};

export const INITIAL_DJS: DJProfile[] = [
  SAMPLE_USER_DJ,
  {
    id: "dj-helena-hauff",
    artistName: "Helena Hauff",
    realName: "Helena Hauff",
    role: "dj_producer",
    city: "hamburg",
    genres: ["Acid Techno", "Electro", "EBM", "Industrial"],
    bio: "Hamburger Underground-Ikone und Resident im Golden Pudel Club. Bekannt für strikte Vinyl-only Sets und rohe, unkomprimierte analoge Drum-Machines.",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=HelenaHauff",
    bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    soundCloudUrl: "https://soundcloud.com/helena-hauff",
    spotifyUrl: "https://open.spotify.com/artist/helenahauff",
    instagramUrl: "https://instagram.com/helena_hauff",
    residentClubs: ["Golden Pudel Club", "Südpol"],
    gearEquipment: "Technics SL-1210 MK2, Roland TR-808, Roland TB-303",
    bookingEmail: "booking@ninja-tune.net",
    isVerified: true,
    releases: [
      { title: "Discreet Desires", label: "Werkdiscs / Ninja Tune", year: 2015, link: "https://ninjatune.net" },
      { title: "Qualm", label: "Ninja Tune", year: 2018, link: "https://ninjatune.net" }
    ],
    upcomingGigs: [
      { title: "Pudel Resident All-Nighter", date: "2026-11-13", venue: "Golden Pudel Club", city: "hamburg" },
      { title: "Billebecken Bass", date: "2026-11-28", venue: "Südpol", city: "hamburg" }
    ],
    createdBy: "Na,Helle.de (Live Sync)",
    createdAt: "2026-10-18T14:20:00.000Z"
  },
  {
    id: "dj-marcel-dettmann",
    artistName: "Marcel Dettmann",
    realName: "Marcel Dettmann",
    role: "dj_producer",
    city: "berlin",
    genres: ["Raw Techno", "Berghain Sound", "Minimal Techno"],
    bio: "Langjähriger Resident im Berghain seit der Eröffnung 2004. Produzent auf Ostgut Ton und Gründer von MDR Records.",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=MarcelDettmann",
    bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    soundCloudUrl: "https://soundcloud.com/marceldettmann",
    spotifyUrl: "https://open.spotify.com/artist/marceldettmann",
    instagramUrl: "https://instagram.com/marceldettmann",
    residentClubs: ["Berghain", "Panorama Bar"],
    gearEquipment: "Allen & Heath Xone:96, Pioneer CDJ-3000, Roland TR-909",
    bookingEmail: "booking@ostgut.de",
    isVerified: true,
    releases: [
      { title: "Dettmann II", label: "Ostgut Ton", year: 2013, link: "https://ostgut.berlin" },
      { title: "Fear of Programming", label: "Dekmantel", year: 2022, link: "https://dekmantel.com" }
    ],
    upcomingGigs: [
      { title: "Klubnacht", date: "2026-11-14", venue: "Berghain", city: "berlin" }
    ],
    createdBy: "system_seed",
    createdAt: "2026-10-16T12:00:00.000Z"
  },
  {
    id: "dj-boris",
    artistName: "Boris",
    realName: "", // Intentionally empty for Zero-Hallucination verification
    role: "resident_dj",
    city: "berlin",
    genres: ["Techno", "House", "Dub Techno"],
    bio: "Klangarchitekt der ersten Stunde des Berliner Ostgut und Berghain. Bekannt für vielseitige, marathonartige Closing-Sets.",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=BorisBerlin",
    bannerUrl: "",
    soundCloudUrl: "https://soundcloud.com/boris-berghain",
    spotifyUrl: "",
    instagramUrl: "https://instagram.com/boris_berlin",
    residentClubs: ["Berghain", "Panorama Bar"],
    gearEquipment: "", // Unverified
    bookingEmail: "", // Unverified
    isVerified: true,
    releases: [
      { title: "Remikse", label: "Ostgut Ton", year: 2017 }
    ],
    upcomingGigs: [
      { title: "Sunday Afternoon Marathon", date: "2026-11-15", venue: "Berghain", city: "berlin" }
    ],
    missingAttributes: ["realName", "bannerUrl", "spotifyUrl", "gearEquipment", "bookingEmail"],
    missingNotice: "⚠️ ZERO-HALLUZINATION: Folgende DJ-Attribute fehlen im Web: realName, bannerUrl, spotifyUrl, gearEquipment, bookingEmail. Es wurden keine Daten erfunden.",
    searchSuggestions: [
      "Discogs-Profil nach bürgerlichem Namen von DJ Boris (Berghain) durchsuchen",
      "Resident Advisor Künstlerprofil nach offizieller Booking-Agentur prüfen",
      "Interview-Archiv nach verwendetem DJ-Equipment/Setup abfragen"
    ],
    createdBy: "KRAFTWERK Radar",
    createdAt: "2026-10-22T09:30:00.000Z"
  },
  {
    id: "dj-subpolar-resonance",
    artistName: "Südelbe Resonanz",
    realName: "", // Underground alias
    role: "resident_dj",
    city: "hamburg",
    genres: ["Hypnotic Techno", "Modular Ambient", "Dark Wave"],
    bio: "Geheimnisvoller Resident-Kollektiv-DJ im Hamburger Südpol. Spezialisiert auf hypnotische Klangreisen in den Morgenstunden.",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Suedelbe",
    bannerUrl: "",
    soundCloudUrl: "https://soundcloud.com/suedpol-hamburg",
    spotifyUrl: "",
    instagramUrl: "",
    residentClubs: ["Südpol"],
    gearEquipment: "Doepfer A-100 Eurorack Modular, Make Noise Maths",
    bookingEmail: "",
    isVerified: false,
    releases: [],
    upcomingGigs: [
      { title: "Bille Closing Ritual", date: "2026-11-08", venue: "Südpol", city: "hamburg" }
    ],
    missingAttributes: ["realName", "bannerUrl", "spotifyUrl", "instagramUrl", "bookingEmail", "releases"],
    missingNotice: "⚠️ ZERO-HALLUZINATION: Folgende DJ-Attribute fehlen im Web: realName, bannerUrl, spotifyUrl, instagramUrl, bookingEmail, releases. Es wurden keine Daten erfunden.",
    searchSuggestions: [
      "Südpol Programmflyer nach Kollektivmitgliedern durchsuchen",
      "SoundCloud-Uploads nach Veröffentlichungen prüfen"
    ],
    createdBy: "Na,Helle.de (Live Sync)",
    createdAt: "2026-10-25T11:15:00.000Z"
  },
  {
    id: "dj-wolfram-wien",
    artistName: "Wolfram",
    realName: "Wolfram Eckert",
    role: "dj_producer",
    city: "wien",
    genres: ["Italo Disco", "Electro", "Acid House", "Club Sound"],
    bio: "Wiener Elektronik-Ikone, Produzent und DJ. International bekannt für Kollaborationen mit Hercules and Love Affair, Pamela Anderson und Moby. Regelmäßiger Gast in Grelle Forelle und am Donaukanal.",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=WolframWien",
    bannerUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    soundCloudUrl: "https://soundcloud.com/wolfram",
    spotifyUrl: "https://open.spotify.com/artist/06iO1Qj8QhM1oD24P1d9V0",
    instagramUrl: "https://instagram.com/wolfram_wien",
    residentClubs: ["Grelle Forelle", "FLEX"],
    gearEquipment: "Roland Juno-106, Pioneer CDJ-3000, Roland TB-303",
    bookingEmail: "booking@wolfram.at",
    isVerified: true,
    releases: [
      { title: "Amadeus", label: "Gomma", year: 2019, link: "https://gomma.de" },
      { title: "Automatic", label: "Permanent Vacation", year: 2021, link: "https://perm-vac.com" }
    ],
    upcomingGigs: [
      { title: "Donaukanal Waveforms", date: "2026-11-20", venue: "Grelle Forelle", city: "wien" },
      { title: "Wiener Silvester Rave", date: "2026-12-31", venue: "Das WERK", city: "wien" }
    ],
    createdBy: "Oazis.app (Live Sync)",
    createdAt: "2026-10-28T09:00:00.000Z"
  },
  {
    id: "dj-patrick-pulsinger",
    artistName: "Patrick Pulsinger",
    realName: "Patrick Pulsinger",
    role: "dj_producer",
    city: "wien",
    genres: ["Modular Techno", "Dub Techno", "Analog Electronica", "Acid"],
    bio: "Pionier der Wiener Elektronikszene, Gründer von Cheap Records und analoger Sound-Alchemist. Seine Live-Sets mit Modularsystemen an der Spittelau sind legendär.",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=PatrickPulsinger",
    bannerUrl: "",
    soundCloudUrl: "https://soundcloud.com/patrickpulsinger",
    spotifyUrl: "https://open.spotify.com/artist/patrickpulsinger",
    instagramUrl: "",
    residentClubs: ["Das WERK", "Grelle Forelle"],
    gearEquipment: "Buchla 200e Modular, Roland TR-808, Moog Model D",
    bookingEmail: "office@feedback-studio.at",
    isVerified: true,
    releases: [
      { title: "Porno", label: "Cheap Records", year: 1995, link: "https://cheap.at" },
      { title: "Impart", label: "Disko B", year: 2010 }
    ],
    upcomingGigs: [
      { title: "Spittelau Analog Night", date: "2026-11-28", venue: "Das WERK", city: "wien" }
    ],
    missingAttributes: ["bannerUrl", "instagramUrl"],
    missingNotice: "⚠️ ZERO-HALLUZINATION: Folgende DJ-Attribute fehlen im Web: bannerUrl, instagramUrl. Es wurden keine Daten erfunden.",
    searchSuggestions: [
      "Offizielle Feedback Studio Seite nach hochauflösendem Pressebanner prüfen",
      "Künstleragentur nach aktuellem Instagram-Kanal abfragen"
    ],
    createdBy: "Oazis.app (Live Sync)",
    createdAt: "2026-10-29T10:15:00.000Z"
  },
  {
    id: "dj-lena-willikens",
    artistName: "Lena Willikens",
    realName: "Lena Willikens",
    role: "dj_producer",
    city: "köln",
    genres: ["Dark Wave", "Electro", "Experimental Techno", "Industrial"],
    bio: "Prägende Gestalt des rheinischen Undergrounds, langjährige Resident im Düsseldorfer Salon des Amateurs und feste Größe im Kölner Gewölbe. Unberechenbare, genreübergreifende Sets auf Weltklasse-Niveau.",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=LenaWillikens",
    bannerUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    soundCloudUrl: "https://soundcloud.com/lena-willikens",
    spotifyUrl: "https://open.spotify.com/artist/lenawillikens",
    instagramUrl: "https://instagram.com/lena_willikens",
    residentClubs: ["Gewölbe", "Salon des Amateurs"],
    gearEquipment: "Technics SL-1210 MK7, Pioneer DJM-900NXS2, Boss Space Echo RE-20",
    bookingEmail: "booking@cómeme.com",
    isVerified: true,
    releases: [
      { title: "Phantom Delia", label: "Cómeme", year: 2015, link: "https://musicocomeme.com" }
    ],
    upcomingGigs: [
      { title: "Weststadt Hypnosis", date: "2026-11-21", venue: "Gewölbe", city: "köln" },
      { title: "Schrottplatz Rave", date: "2026-12-12", venue: "Odonien", city: "köln" }
    ],
    createdBy: "ohschonhell.de (Live Sync)",
    createdAt: "2026-10-30T14:00:00.000Z"
  },
  {
    id: "dj-michael-mayer",
    artistName: "Michael Mayer",
    realName: "Michael Mayer",
    role: "dj_producer",
    city: "köln",
    genres: ["Melodic Techno", "Kompakt Sound", "Minimal House"],
    bio: "Mitgründer des Kölner Kult-Labels Kompakt, Produzent und weltweiter Botschafter des eleganten, melodischen Kölner Techno-Sounds. Regelmäßige Residenz im Gewölbe.",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=MichaelMayer",
    bannerUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    soundCloudUrl: "https://soundcloud.com/michael-mayer-kompakt",
    spotifyUrl: "https://open.spotify.com/artist/michaelmayer",
    instagramUrl: "https://instagram.com/michaelmayerkompakt",
    residentClubs: ["Gewölbe", "Kompakt HQ"],
    gearEquipment: "Pioneer CDJ-3000, Allen & Heath Xone:96",
    bookingEmail: "booking@kompakt.fm",
    isVerified: true,
    releases: [
      { title: "Touch", label: "Kompakt", year: 2004, link: "https://kompakt.fm" },
      { title: "&", label: "K7 Records", year: 2016, link: "https://k7.com" }
    ],
    upcomingGigs: [
      { title: "Kompakt Nacht Köln", date: "2026-12-05", venue: "Gewölbe", city: "köln" },
      { title: "Silvester am Schrottplatz", date: "2026-12-31", venue: "Odonien", city: "köln" }
    ],
    createdBy: "ohschonhell.de (Live Sync)",
    createdAt: "2026-10-31T11:00:00.000Z"
  }
];
