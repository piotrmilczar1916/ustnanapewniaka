import type { CriterionId } from "@/lib/types";

/**
 * Kryteria oceniania części ustnej egzaminu maturalnego z języka polskiego
 * (Formuła 2023) wg Informatora CKE.
 *
 * Pełny egzamin: 2 zadania monologowe, łącznie 30 pkt.
 * Symulator obsługuje jedno zadanie, więc maksima kryteriów 1 i 2 są
 * połówkowe (8 pkt i 2 pkt) — dokładnie tak, jak punktuje się pojedyncze
 * zadanie w karcie oceny.
 */

export const CKE_PASS_THRESHOLD = 0.3;

export interface CriterionDefinition {
  id: CriterionId;
  label: string;
  shortLabel: string;
  /** Maksimum dla pojedynczego zadania w symulatorze */
  maxPoints: number;
  /** Maksimum na pełnym egzaminie (2 zadania) */
  fullExamMaxPoints: number;
  /** Rubryka przekazywana modelowi — dosłownie z informatora CKE */
  rubric: string;
}

export const CKE_CRITERIA: CriterionDefinition[] = [
  {
    id: "meritum",
    label: "Aspekt merytoryczny wypowiedzi monologowej",
    shortLabel: "Meritum",
    maxPoints: 8,
    fullExamMaxPoints: 16,
    rubric: `Oceniasz łącznie DWIE osie: (A) liczbę zrealizowanych elementów, (B) jakość argumentacji i liczbę poważnych błędów rzeczowych.

Elementy dla zadania jawnego: zagadnienie z polecenia + lektura wskazana w poleceniu + kontekst przywołany przynajmniej częściowo funkcjonalnie.
Elementy dla zadania niejawnego: zagadnienie z polecenia + dołączony tekst + drugi tekst kultury lub własne doświadczenia.

Jakość argumentacji:
- bogata = pogłębiona, poparta trafnymi przykładami, wieloaspektowa, z elementami refleksji
- zadowalająca = pogłębiona, poparta trafnymi przykładami
- powierzchowna = oparta na uogólnieniach, pobieżna, czasem bez przykładów

Punktacja gdy zrealizowano TEMAT + 2 ELEMENTY:
8 — bogata argumentacja, bez poważnych błędów rzeczowych
7 — bogata z 1–2 poważnymi błędami ALBO zadowalająca bez błędów
6 — zadowalająca z 1–2 poważnymi błędami ALBO powierzchowna bez błędów
5 — powierzchowna z 1–2 poważnymi błędami

Punktacja gdy zrealizowano TEMAT + 1 ELEMENT:
4 — bogata argumentacja, bez poważnych błędów rzeczowych
3 — bogata z 1–2 poważnymi błędami ALBO zadowalająca bez błędów
2 — zadowalająca z 1–2 poważnymi błędami ALBO powierzchowna bez błędów
1 — powierzchowna z 1–2 poważnymi błędami

0 — brak wypowiedzi; wypowiedź nie na temat; błąd kardynalny; 3 lub więcej poważnych błędów rzeczowych; brak odniesienia do lektury wskazanej w poleceniu.

Błąd kardynalny = błąd świadczący o nieznajomości fabuły, głównych wątków lub losów głównych bohaterów lektury obowiązkowej omawianej w całości.
Poważny błąd rzeczowy = np. błędne autorstwo, błędne imię/nazwisko bohatera, błąd dotyczący wątków pobocznych, błąd w przywołanym kontekście.
Ten sam błąd powtórzony kilkakrotnie liczy się jako jeden.`,
  },
  {
    id: "kompozycja",
    label: "Kompozycja wypowiedzi monologowej",
    shortLabel: "Kompozycja",
    maxPoints: 2,
    fullExamMaxPoints: 4,
    rubric: `2 — kompozycja spójna: wypowiedź zawiera wstęp, część zasadniczą i zakończenie, które składają się na logiczną i uporządkowaną całość.
1 — kompozycja częściowo spójna: brakuje wstępu i/lub zakończenia ALBO połączenie między dwoma z trzech elementów jest nielogiczne ALBO zawarto treści zbędne, bez związku z zagadnieniem.
0 — kompozycja niespójna: brak części zasadniczej ALBO połączenia między wszystkimi trzema elementami są nielogiczne ALBO zawarto nieuzasadnione wnioski lub sprzeczne stwierdzenia.

ZASADA WIĄŻĄCA: jeżeli w kryterium „meritum” przyznano 0 pkt, tutaj również przyznaj 0 pkt.`,
  },
  {
    id: "rozmowa",
    label: "Aspekt merytoryczny wypowiedzi podczas rozmowy",
    shortLabel: "Rozmowa",
    maxPoints: 6,
    fullExamMaxPoints: 6,
    rubric: `Wypowiedź „na temat” = adekwatna do pytania ORAZ poprawna merytorycznie.
Wypowiedź „częściowo na temat” = nieadekwatna do pytania ALBO niepoprawna merytorycznie.
Właściwe uszczegółowienie = wypowiedź nie ogranicza się do ogólników, zawiera rozwinięcie.

6 — wszystkie wypowiedzi na temat, właściwy stopień uszczegółowienia
5 — wszystkie wypowiedzi na temat, zaburzenia w stopniu uszczegółowienia
4 — część wypowiedzi na temat, pozostałe częściowo na temat; właściwe uszczegółowienie
3 — część wypowiedzi na temat, pozostałe częściowo na temat; zaburzenia w uszczegółowieniu
2 — wszystkie wypowiedzi częściowo na temat; właściwe uszczegółowienie
1 — wszystkie wypowiedzi częściowo na temat; zaburzenia w uszczegółowieniu
0 — wypowiedzi nie na temat; wszystkie wypowiedzi zdawkowe; błąd kardynalny; niezachowanie zasad dialogu`,
  },
  {
    id: "jezyk",
    label: "Zakres i poprawność środków językowych",
    shortLabel: "Język",
    maxPoints: 4,
    fullExamMaxPoints: 4,
    rubric: `Oceniasz łącznie wypowiedź monologową i odpowiedzi w rozmowie.

Zadowalający zakres środków językowych (bogata leksyka, synonimy, precyzyjne słownictwo, terminologia):
4 — zachowano poprawność językową i płynność właściwą dla języka mówionego (dopuszczalne sporadyczne błędy/usterki)
3 — częściowo zachowano poprawność i płynność (liczne błędy językowe i/lub usterki płynności)

Wąski zakres środków językowych (leksyka i składnia proste/ograniczone, utrudniają odbiór):
2 — zachowano poprawność językową i płynność
1 — częściowo zachowano poprawność i płynność

0 — wypowiedź niekomunikatywna ALBO bardzo liczne błędy językowe i/lub usterki płynności.

WAŻNE: oceniasz transkrypcję mowy. Nie karz za brak interpunkcji, wielkich liter ani za zapis fonetyczny — to artefakty transkrypcji, nie błędy zdającego. Nie każde nieprecyzyjne sformułowanie jest błędem — nieporadność językowa to błąd tylko wtedy, gdy jest oczywistym naruszeniem normy.`,
  },
];

export const CKE_MAX_POINTS = CKE_CRITERIA.reduce(
  (sum, c) => sum + c.maxPoints,
  0,
);

export function getCriterion(id: CriterionId): CriterionDefinition {
  const found = CKE_CRITERIA.find((c) => c.id === id);
  if (!found) throw new Error(`Nieznane kryterium CKE: ${id}`);
  return found;
}
