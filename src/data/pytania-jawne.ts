export interface JawneQuestion {
  number: number;
  title: string;
  lektura: string;
}

export interface JawneGroup {
  lektura: string;
  questions: JawneQuestion[];
}

/**
 * Oficjalna lista 76 zadań jawnych CKE na maturę ustną z języka polskiego
 * (obowiązuje 2026–2028). Źródło: komunikat dyrektora CKE z 30.08.2024.
 */
export const PYTANIA_JAWNE_GROUPS: JawneGroup[] = [
  {
    lektura: "Biblia (fragmenty)",
    questions: [
      {
        number: 1,
        title: "Motyw cierpienia niezawinionego. Omów zagadnienie na podstawie znanych Ci fragmentów Księgi Hioba. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Biblia (fragmenty)",
      },
      {
        number: 2,
        title: "Człowiek wobec niestałości świata. Omów zagadnienie na podstawie znanych Ci fragmentów Księgi Koheleta. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Biblia (fragmenty)",
      },
      {
        number: 3,
        title: "Wizja końca świata. Omów zagadnienie na podstawie znanych Ci fragmentów Apokalipsy św. Jana. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Biblia (fragmenty)",
      },
    ],
  },
  {
    lektura: "Jan Parandowski, Mitologia (cz. I Grecja)",
    questions: [
      {
        number: 4,
        title: "Poświęcenie się w imię wyższych wartości. Omów zagadnienie na podstawie Mitologii (cz. I Grecja) Jana Parandowskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Jan Parandowski, Mitologia (cz. I Grecja)",
      },
      {
        number: 5,
        title: "Problematyka winy i kary. Omów zagadnienie na podstawie Mitologii (cz. I Grecja) Jana Parandowskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Jan Parandowski, Mitologia (cz. I Grecja)",
      },
      {
        number: 6,
        title: "Miłość silniejsza niż śmierć. Omów zagadnienie na podstawie Mitologii (cz. I Grecja) Jana Parandowskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Jan Parandowski, Mitologia (cz. I Grecja)",
      },
    ],
  },
  {
    lektura: "Homer, Iliada (fragmenty)",
    questions: [
      {
        number: 7,
        title: "Heroizm jako postawa człowieka w zmaganiu się z losem. Omów zagadnienie na podstawie znanych Ci fragmentów Iliady Homera. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Homer, Iliada (fragmenty)",
      },
    ],
  },
  {
    lektura: "Sofokles, Antygona",
    questions: [
      {
        number: 8,
        title: "Prawa boskie a prawa ludzkie. Omów zagadnienie na podstawie Antygony Sofoklesa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Sofokles, Antygona",
      },
      {
        number: 9,
        title: "Człowiek wobec przeznaczenia. Omów zagadnienie na podstawie Antygony Sofoklesa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Sofokles, Antygona",
      },
    ],
  },
  {
    lektura: "Lament świętokrzyski (fragmenty)",
    questions: [
      {
        number: 10,
        title: "Motyw cierpiącej matki. Omów zagadnienie na podstawie znanych Ci fragmentów Lamentu świętokrzyskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Lament świętokrzyski (fragmenty)",
      },
    ],
  },
  {
    lektura: "Rozmowa Mistrza Polikarpa ze Śmiercią (fragmenty)",
    questions: [
      {
        number: 11,
        title: "Motyw tańca śmierci. Omów zagadnienie na podstawie znanych Ci fragmentów Rozmowy Mistrza Polikarpa ze Śmiercią. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Rozmowa Mistrza Polikarpa ze Śmiercią (fragmenty)",
      },
    ],
  },
  {
    lektura: "Pieśń o Rolandzie (fragmenty)",
    questions: [
      {
        number: 12,
        title: "Średniowieczny wzorzec rycerza. Omów zagadnienie na podstawie znanych Ci fragmentów Pieśni o Rolandzie. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Pieśń o Rolandzie (fragmenty)",
      },
    ],
  },
  {
    lektura: "William Szekspir, Makbet",
    questions: [
      {
        number: 13,
        title: "Moralna odpowiedzialność za czyny. Omów zagadnienie na podstawie Makbeta Williama Szekspira. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "William Szekspir, Makbet",
      },
      {
        number: 14,
        title: "Czy człowiek decyduje o własnym losie? Omów zagadnienie na podstawie Makbeta Williama Szekspira. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "William Szekspir, Makbet",
      },
      {
        number: 15,
        title: "Jaki wpływ na człowieka ma sprawowanie przez niego władzy? Omów zagadnienie na podstawie Makbeta Williama Szekspira. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "William Szekspir, Makbet",
      },
    ],
  },
  {
    lektura: "Molier, Skąpiec",
    questions: [
      {
        number: 16,
        title: "Czy dobra materialne czynią człowieka szczęśliwym? Omów zagadnienie na podstawie Skąpca Moliera. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Molier, Skąpiec",
      },
      {
        number: 17,
        title: "Przyczyny nieporozumień między rodzicami a dziećmi. Omów zagadnienie na podstawie Skąpca Moliera. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Molier, Skąpiec",
      },
    ],
  },
  {
    lektura: "Ignacy Krasicki, wybrana satyra",
    questions: [
      {
        number: 18,
        title: "Wady ludzkie w krzywym zwierciadle satyry. Omów zagadnienie na podstawie znanych Ci satyr Ignacego Krasickiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Ignacy Krasicki, wybrana satyra",
      },
    ],
  },
  {
    lektura: "Adam Mickiewicz, Romantyczność oraz wybrane ballady",
    questions: [
      {
        number: 19,
        title: "Świat ducha a świat rozumu. Omów zagadnienie na podstawie Romantyczności Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Romantyczność oraz wybrane ballady",
      },
      {
        number: 20,
        title: "Na czym polega ludowa sprawiedliwość? Omów zagadnienie na podstawie znanych Ci ballad Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Romantyczność oraz wybrane ballady",
      },
    ],
  },
  {
    lektura: "Adam Mickiewicz, Dziady część III",
    questions: [
      {
        number: 21,
        title: "Losy młodzieży polskiej pod zaborami. Omów zagadnienie na podstawie Dziadów części III Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Dziady część III",
      },
      {
        number: 22,
        title: "Mesjanizm jako romantyczna idea poświęcenia. Omów zagadnienie na podstawie Dziadów części III Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Dziady część III",
      },
      {
        number: 23,
        title: "Postawy społeczeństwa polskiego wobec zaborcy. Omów zagadnienie na podstawie Dziadów części III Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Dziady część III",
      },
      {
        number: 24,
        title: "Różne postawy człowieka wobec Boga. Omów zagadnienie na podstawie Dziadów części III Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Dziady część III",
      },
      {
        number: 25,
        title: "Jakie prawdy o człowieku ujawniają jego sny albo widzenia? Omów zagadnienie na podstawie Dziadów części III Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Dziady część III",
      },
      {
        number: 26,
        title: "W jakim celu twórca nawiązuje do motywów biblijnych? Omów zagadnienie na podstawie Dziadów części III Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Dziady część III",
      },
      {
        number: 27,
        title: "Walka dobra ze złem o duszę ludzką. Omów zagadnienie na podstawie Dziadów części III Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Dziady część III",
      },
      {
        number: 28,
        title: "Czym dla człowieka może być wolność? Omów zagadnienie na podstawie Dziadów części III Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Dziady część III",
      },
      {
        number: 29,
        title: "Motyw samotności. Omów zagadnienie na podstawie Dziadów części III Adama Mickiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Adam Mickiewicz, Dziady część III",
      },
    ],
  },
  {
    lektura: "Bolesław Prus, Lalka",
    questions: [
      {
        number: 30,
        title: "Miłość – siła destrukcyjna czy motywująca do działania? Omów zagadnienie na podstawie Lalki Bolesława Prusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Bolesław Prus, Lalka",
      },
      {
        number: 31,
        title: "Praca jako pasja człowieka. Omów zagadnienie na podstawie Lalki Bolesława Prusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Bolesław Prus, Lalka",
      },
      {
        number: 32,
        title: "Jaką rolę w relacjach międzyludzkich odgrywają majątek i pochodzenie? Omów zagadnienie na podstawie Lalki Bolesława Prusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Bolesław Prus, Lalka",
      },
      {
        number: 33,
        title: "Konfrontacja marzeń z rzeczywistością. Omów zagadnienie na podstawie Lalki Bolesława Prusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Bolesław Prus, Lalka",
      },
      {
        number: 34,
        title: "Miasto – przestrzeń przyjazna czy wroga człowiekowi? Omów zagadnienie na podstawie Lalki Bolesława Prusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Bolesław Prus, Lalka",
      },
      {
        number: 35,
        title: "Czym dla człowieka mogą być wspomnienia? Omów zagadnienie na podstawie Lalki Bolesława Prusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Bolesław Prus, Lalka",
      },
    ],
  },
  {
    lektura: "Henryk Sienkiewicz, Potop (fragmenty)",
    questions: [
      {
        number: 36,
        title: "Postawy odwagi i tchórzostwa. Omów zagadnienie na podstawie znanych Ci fragmentów Potopu Henryka Sienkiewicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Henryk Sienkiewicz, Potop (fragmenty)",
      },
    ],
  },
  {
    lektura: "Fiodor Dostojewski, Zbrodnia i kara",
    questions: [
      {
        number: 37,
        title: "Walka człowieka ze swoimi słabościami. Omów zagadnienie na podstawie Zbrodni i kary Fiodora Dostojewskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Fiodor Dostojewski, Zbrodnia i kara",
      },
      {
        number: 38,
        title: "Motyw winy i kary. Omów zagadnienie na podstawie Zbrodni i kary Fiodora Dostojewskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Fiodor Dostojewski, Zbrodnia i kara",
      },
      {
        number: 39,
        title: "Ile człowiek jest gotów poświęcić dla innych? Omów zagadnienie na podstawie Zbrodni i kary Fiodora Dostojewskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Fiodor Dostojewski, Zbrodnia i kara",
      },
      {
        number: 40,
        title: "Co może determinować ludzkie postępowanie? Omów zagadnienie na podstawie Zbrodni i kary Fiodora Dostojewskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Fiodor Dostojewski, Zbrodnia i kara",
      },
      {
        number: 41,
        title: "Motyw przemiany bohatera. Omów zagadnienie na podstawie Zbrodni i kary Fiodora Dostojewskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Fiodor Dostojewski, Zbrodnia i kara",
      },
    ],
  },
  {
    lektura: "Stanisław Wyspiański, Wesele",
    questions: [
      {
        number: 42,
        title: "Co utrudnia porozumienie między przedstawicielami różnych grup społecznych? Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stanisław Wyspiański, Wesele",
      },
      {
        number: 43,
        title: "Rola chłopów i inteligencji w sprawie niepodległościowej. Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stanisław Wyspiański, Wesele",
      },
      {
        number: 44,
        title: "Sen o Polsce czy sąd nad Polską? Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stanisław Wyspiański, Wesele",
      },
      {
        number: 45,
        title: "Symboliczne znaczenie widm i zjaw. Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stanisław Wyspiański, Wesele",
      },
      {
        number: 46,
        title: "Motyw tańca. Omów zagadnienie na podstawie Wesela Stanisława Wyspiańskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stanisław Wyspiański, Wesele",
      },
    ],
  },
  {
    lektura: "Władysław Stanisław Reymont, Chłopi (fragmenty)",
    questions: [
      {
        number: 47,
        title: "Obyczaj i tradycja w życiu społeczeństwa. Omów zagadnienie na podstawie znanych Ci fragmentów Chłopów Władysława Stanisława Reymonta. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Władysław Stanisław Reymont, Chłopi (fragmenty)",
      },
    ],
  },
  {
    lektura: "Stefan Żeromski, Przedwiośnie",
    questions: [
      {
        number: 48,
        title: "Jakie znaczenie ma tytuł dla odczytania sensu utworu? Omów zagadnienie na podstawie Przedwiośnia Stefana Żeromskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stefan Żeromski, Przedwiośnie",
      },
      {
        number: 49,
        title: "Wojna i rewolucja jako źródła doświadczeń człowieka. Omów zagadnienie na podstawie Przedwiośnia Stefana Żeromskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stefan Żeromski, Przedwiośnie",
      },
      {
        number: 50,
        title: "Różne wizje odbudowy Polski po odzyskaniu niepodległości. Omów zagadnienie na podstawie Przedwiośnia Stefana Żeromskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stefan Żeromski, Przedwiośnie",
      },
      {
        number: 51,
        title: "Młodość jako czas kształtowania własnej tożsamości. Omów zagadnienie na podstawie Przedwiośnia Stefana Żeromskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stefan Żeromski, Przedwiośnie",
      },
      {
        number: 52,
        title: "Rola autorytetu w życiu człowieka. Omów zagadnienie na podstawie Przedwiośnia Stefana Żeromskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stefan Żeromski, Przedwiośnie",
      },
      {
        number: 53,
        title: "Utopijny i realny obraz rzeczywistości. Omów zagadnienie na podstawie Przedwiośnia Stefana Żeromskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Stefan Żeromski, Przedwiośnie",
      },
    ],
  },
  {
    lektura: "Witold Gombrowicz, Ferdydurke (fragmenty)",
    questions: [
      {
        number: 54,
        title: "Groteskowy obraz świata. Omów zagadnienie na podstawie znanych Ci fragmentów Ferdydurke Witolda Gombrowicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Witold Gombrowicz, Ferdydurke (fragmenty)",
      },
      {
        number: 55,
        title: "Człowiek wobec presji otoczenia. Omów zagadnienie na podstawie znanych Ci fragmentów Ferdydurke Witolda Gombrowicza. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Witold Gombrowicz, Ferdydurke (fragmenty)",
      },
    ],
  },
  {
    lektura: "Tadeusz Borowski, „Proszę państwa do gazu”",
    questions: [
      {
        number: 56,
        title: "„Człowiek zlagrowany” jako ofiara zbrodniczego systemu. Omów zagadnienie na podstawie opowiadania „Proszę państwa do gazu” Tadeusza Borowskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Tadeusz Borowski, „Proszę państwa do gazu”",
      },
    ],
  },
  {
    lektura: "Gustaw Herling-Grudziński, Inny świat (fragmenty)",
    questions: [
      {
        number: 57,
        title: "Jakie znaczenie ma tytuł dla odczytania sensu utworu? Omów zagadnienie na podstawie znanych Ci fragmentów Innego świata Gustawa Herlinga-Grudzińskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Gustaw Herling-Grudziński, Inny świat (fragmenty)",
      },
      {
        number: 58,
        title: "Konsekwencje zniewolenia człowieka. Omów zagadnienie na podstawie znanych Ci fragmentów Innego świata Gustawa Herlinga-Grudzińskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Gustaw Herling-Grudziński, Inny świat (fragmenty)",
      },
    ],
  },
  {
    lektura: "Hanna Krall, Zdążyć przed Panem Bogiem",
    questions: [
      {
        number: 59,
        title: "Czy możliwe jest zachowanie godności w skrajnych sytuacjach? Omów zagadnienie na podstawie Zdążyć przed Panem Bogiem Hanny Krall. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Hanna Krall, Zdążyć przed Panem Bogiem",
      },
      {
        number: 60,
        title: "Zagłada z perspektywy świadka i uczestnika wydarzeń w getcie. Omów zagadnienie na podstawie Zdążyć przed Panem Bogiem Hanny Krall. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Hanna Krall, Zdążyć przed Panem Bogiem",
      },
      {
        number: 61,
        title: "Walka o życie z perspektywy wojennej i powojennej. Omów zagadnienie na podstawie Zdążyć przed Panem Bogiem Hanny Krall. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Hanna Krall, Zdążyć przed Panem Bogiem",
      },
    ],
  },
  {
    lektura: "Albert Camus, Dżuma",
    questions: [
      {
        number: 62,
        title: "Co skłania człowieka do poświęceń? Omów zagadnienie na podstawie Dżumy Alberta Camusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Albert Camus, Dżuma",
      },
      {
        number: 63,
        title: "Człowiek wobec cierpienia i śmierci. Omów zagadnienie na podstawie Dżumy Alberta Camusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Albert Camus, Dżuma",
      },
      {
        number: 64,
        title: "Czy możliwa jest przyjaźń w sytuacjach skrajnych? Omów zagadnienie na podstawie Dżumy Alberta Camusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Albert Camus, Dżuma",
      },
      {
        number: 65,
        title: "Jakie postawy przyjmuje człowiek wobec zła? Omów zagadnienie na podstawie Dżumy Alberta Camusa. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Albert Camus, Dżuma",
      },
    ],
  },
  {
    lektura: "George Orwell, Rok 1984",
    questions: [
      {
        number: 66,
        title: "Czy możliwe jest zbudowanie doskonałego państwa? Omów zagadnienie na podstawie utworu Rok 1984 George’a Orwella. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "George Orwell, Rok 1984",
      },
      {
        number: 67,
        title: "Jak zachować wolność w państwie totalitarnym? Omów zagadnienie na podstawie utworu Rok 1984 George’a Orwella. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "George Orwell, Rok 1984",
      },
      {
        number: 68,
        title: "Znaczenie propagandy w państwie totalitarnym. Omów zagadnienie na podstawie utworu Rok 1984 George’a Orwella. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "George Orwell, Rok 1984",
      },
      {
        number: 69,
        title: "Nowomowa jako sposób na ograniczenie wolności człowieka. Omów zagadnienie na podstawie utworu Rok 1984 George’a Orwella. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "George Orwell, Rok 1984",
      },
    ],
  },
  {
    lektura: "Sławomir Mrożek, Tango",
    questions: [
      {
        number: 70,
        title: "Bunt przeciwko porządkowi społecznemu. Omów zagadnienie na podstawie Tanga Sławomira Mrożka. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Sławomir Mrożek, Tango",
      },
      {
        number: 71,
        title: "Konflikt pokoleń. Omów zagadnienie na podstawie Tanga Sławomira Mrożka. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Sławomir Mrożek, Tango",
      },
      {
        number: 72,
        title: "Normy społeczne – ograniczają człowieka czy porządkują życie? Omów zagadnienie na podstawie Tanga Sławomira Mrożka. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Sławomir Mrożek, Tango",
      },
    ],
  },
  {
    lektura: "Marek Nowakowski, Górą Edek",
    questions: [
      {
        number: 73,
        title: "W jakim celu autor nawiązuje w swoim tekście do innego utworu literackiego? Omów zagadnienie na podstawie opowiadania „Górą Edek” Marka Nowakowskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Marek Nowakowski, Górą Edek",
      },
    ],
  },
  {
    lektura: "Andrzej Stasiuk, Miejsce",
    questions: [
      {
        number: 74,
        title: "Miejsca ważne w życiu człowieka. Omów zagadnienie na podstawie Miejsca Andrzeja Stasiuka. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Andrzej Stasiuk, Miejsce",
      },
    ],
  },
  {
    lektura: "Olga Tokarczuk, „Profesor Andrews w Warszawie”",
    questions: [
      {
        number: 75,
        title: "Stan wojenny z perspektywy obcokrajowca. Omów zagadnienie na podstawie opowiadania „Profesor Andrews w Warszawie” Olgi Tokarczuk. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Olga Tokarczuk, „Profesor Andrews w Warszawie”",
      },
    ],
  },
  {
    lektura: "Ryszard Kapuściński, Podróże z Herodotem (fragmenty)",
    questions: [
      {
        number: 76,
        title: "Czym dla człowieka może być podróżowanie? Omów zagadnienie na podstawie znanych Ci fragmentów Podróży z Herodotem Ryszarda Kapuścińskiego. W swojej odpowiedzi uwzględnij również wybrany kontekst.",
        lektura: "Ryszard Kapuściński, Podróże z Herodotem (fragmenty)",
      },
    ],
  },
];

export const PYTANIA_JAWNE = PYTANIA_JAWNE_GROUPS.flatMap((g) => g.questions);

// total: 76
