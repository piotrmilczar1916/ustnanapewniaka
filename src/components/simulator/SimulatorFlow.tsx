"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/ButtonLink";
import { Stamp } from "@/components/Stamp";
import { EXAMPLE_TRANSCRIPT } from "@/data/example-transcript";
import { drawQuestion, getJawneQuestionByNumber } from "@/data/mock-questions";
import { useAuth } from "@/lib/auth/AuthProvider";
import type {
  EvaluationResult,
  ExamSubject,
  FollowUpAnalysis,
  FollowUpQuestion,
  Question,
  QuestionKind,
  SimulatorStep,
} from "@/lib/types";

const PREP_SECONDS = 15 * 60;
const STEPS: SimulatorStep[] = [
  "exam",
  "draw",
  "prep",
  "record",
  "followup",
  "result",
];

const STEP_LABELS: Record<SimulatorStep, string> = {
  exam: "Egzamin",
  draw: "Losowanie",
  prep: "Przygotowanie",
  record: "Wypowiedź",
  followup: "Pytania",
  result: "Ocena",
};

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SimulatorFlow() {
  const searchParams = useSearchParams();
  const pytanieParam = searchParams.get("pytanie");

  const [step, setStep] = useState<SimulatorStep>("exam");
  const [subject, setSubject] = useState<ExamSubject | null>(null);
  const [questionKind, setQuestionKind] = useState<QuestionKind | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [prepLeft, setPrepLeft] = useState(PREP_SECONDS);
  const [prepRunning, setPrepRunning] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [micError, setMicError] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpQuestion[]>([]);
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [followUpAnswers, setFollowUpAnswers] = useState<string[]>([]);
  const [currentFollowUpAnswer, setCurrentFollowUpAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [preparingQuestions, setPreparingQuestions] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [followUpSkipReason, setFollowUpSkipReason] = useState<string | null>(
    null,
  );

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recordTimerRef = useRef<number | null>(null);

  // Start z konkretnym pytaniem jawnych: /symulacja?pytanie=42
  useEffect(() => {
    if (!pytanieParam) return;
    const number = Number.parseInt(pytanieParam, 10);
    if (!Number.isFinite(number)) return;
    const preset = getJawneQuestionByNumber(number);
    if (!preset) return;

    setSubject("polski");
    setQuestionKind("jawne");
    setQuestion(preset);
    setPrepLeft(PREP_SECONDS);
    setPrepRunning(false);
    setRecordSeconds(0);
    setRecording(false);
    setTranscript("");
    setMicError(null);
    setFollowUps([]);
    setFollowUpIndex(0);
    setFollowUpAnswers([]);
    setCurrentFollowUpAnswer("");
    setEvaluating(false);
    setEvaluation(null);
    setFollowUpSkipReason(null);
    setStep("prep");
  }, [pytanieParam]);

  const stepIndex = STEPS.indexOf(step);

  // Prep countdown
  useEffect(() => {
    if (step !== "prep" || !prepRunning) return;
    if (prepLeft <= 0) {
      setPrepRunning(false);
      setStep("record");
      return;
    }
    const id = window.setTimeout(() => setPrepLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(id);
  }, [step, prepRunning, prepLeft]);

  // Record timer up
  useEffect(() => {
    if (!recording) {
      if (recordTimerRef.current) {
        window.clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
      return;
    }
    recordTimerRef.current = window.setInterval(() => {
      setRecordSeconds((v) => v + 1);
    }, 1000);
    return () => {
      if (recordTimerRef.current) {
        window.clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
    };
  }, [recording]);

  const stopRecognition = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    setMicError(null);
    setTranscript("");
    setRecordSeconds(0);

    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognitionCtor) {
      setMicError(
        "Ta przeglądarka nie wspiera Web Speech API. Użyj trybu testowego z przykładową transkrypcją.",
      );
      setRecording(true);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicError(
        "Brak dostępu do mikrofonu. Możesz kontynuować w trybie testowym.",
      );
      setRecording(true);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "pl-PL";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalText = "";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result) continue;
        const piece = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalText = `${finalText} ${piece}`.trim();
          setTranscript(finalText);
        } else {
          interim += piece;
        }
      }
      if (interim) {
        setTranscript(`${finalText} ${interim}`.trim());
      }
    };

    recognition.onerror = () => {
      setMicError(
        "Rozpoznawanie mowy napotkało problem. Możesz wkleić tekst lub użyć trybu testowego.",
      );
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setRecording(false);
    stopRecognition();
  }, [stopRecognition]);

  useEffect(() => {
    return () => stopRecognition();
  }, [stopRecognition]);

  function handleDraw(kind: QuestionKind) {
    setQuestionKind(kind);
    setQuestion(drawQuestion(kind));
    setPrepLeft(PREP_SECONDS);
    setPrepRunning(false);
    setStep("prep");
  }

  async function finishRecording(useExample = false) {
    stopRecording();
    const text = useExample ? EXAMPLE_TRANSCRIPT : transcript.trim();
    if (useExample) {
      setTranscript(text);
    }

    setFollowUpIndex(0);
    setFollowUpAnswers([]);
    setCurrentFollowUpAnswer("");
    setFollowUpSkipReason(null);
    setPreparingQuestions(true);
    setStep("followup");

    try {
      const response = await fetch("/api/pytania-dodatkowe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionTitle: question?.title ?? "",
          questionKind: questionKind ?? "jawne",
          cultureTextHint: question?.cultureTextHint,
          transcript: text,
        }),
      });
      const data = (await response.json()) as FollowUpAnalysis;
      const questions = data.questions ?? [];

      if (!data.needsFollowUp) {
        const reason =
          data.skipReason ??
          "Wypowiedź wyczerpała wymagane elementy polecenia — komisja przechodzi do oceny.";
        setFollowUps([]);
        setFollowUpSkipReason(reason);
        setPreparingQuestions(false);
        void runEvaluation([], { skipped: true, skipReason: reason });
        return;
      }

      if (questions.length === 0) {
        setFollowUps([
          {
            id: "fu-1",
            text: "Proszę uzupełnić brakujący element wypowiedzi — odwołaj się do konkretnego fragmentu utworu.",
            targetsGap: "argumentacja",
          },
        ]);
        return;
      }

      setFollowUps(questions);
    } catch {
      setFollowUps([
        {
          id: "fu-1",
          text: "Rozwiń najważniejszy brakujący element swojej wypowiedzi i uzasadnij go odwołaniem do tekstu.",
          targetsGap: "argumentacja",
        },
      ]);
    } finally {
      setPreparingQuestions(false);
    }
  }

  async function runEvaluation(
    answers: string[],
    options?: { skipped?: boolean; skipReason?: string },
  ) {
    setEvaluating(true);
    setEvaluationError(null);
    try {
      const response = await fetch("/api/ocena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionCode: question?.code ?? "—",
          questionTitle: question?.title ?? "",
          questionKind: questionKind ?? "jawne",
          cultureTextHint: question?.cultureTextHint,
          transcript,
          dialogue: followUps.map((fu, i) => ({
            question: fu.text,
            answer: answers[i] ?? "",
          })),
          dialogueSkipped: options?.skipped ?? false,
          dialogueSkipReason: options?.skipReason,
        }),
      });
      if (!response.ok) throw new Error("Ocena nie powiodła się.");
      const data = (await response.json()) as EvaluationResult;
      setEvaluation(data);
      setStep("result");
    } catch {
      setEvaluationError(
        "Nie udało się pobrać oceny. Sprawdź połączenie i spróbuj ponownie.",
      );
    } finally {
      setEvaluating(false);
    }
  }

  function submitFollowUp() {
    const nextAnswers = [...followUpAnswers, currentFollowUpAnswer.trim()];
    setFollowUpAnswers(nextAnswers);
    setCurrentFollowUpAnswer("");

    if (followUpIndex + 1 < followUps.length) {
      setFollowUpIndex((i) => i + 1);
      return;
    }

    void runEvaluation(nextAnswers);
  }

  function resetFlow() {
    stopRecording();
    setStep("exam");
    setSubject(null);
    setQuestionKind(null);
    setQuestion(null);
    setPrepLeft(PREP_SECONDS);
    setPrepRunning(false);
    setRecordSeconds(0);
    setTranscript("");
    setMicError(null);
    setFollowUps([]);
    setFollowUpIndex(0);
    setFollowUpAnswers([]);
    setCurrentFollowUpAnswer("");
    setEvaluating(false);
    setPreparingQuestions(false);
    setEvaluation(null);
    setFollowUpSkipReason(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
            Symulator · ocena wg kryteriów CKE
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Matura ustna
          </h1>
        </div>
        <p className="font-mono text-sm text-stamp-red">
          Krok {stepIndex + 1}/{STEPS.length}
        </p>
      </div>

      {/* Progress */}
      <ol className="mb-8 flex gap-1 overflow-x-auto pb-1" aria-label="Postęp">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const current = i === stepIndex;
          return (
            <li
              key={s}
              className={[
                "min-w-[4.5rem] flex-1 border-2 px-2 py-2 text-center font-mono text-[10px] uppercase tracking-wide sm:text-xs",
                current
                  ? "border-ink bg-stamp-red text-paper"
                  : done
                    ? "border-ink bg-paper-dim text-ink"
                    : "border-ink/30 bg-paper text-graphite",
              ].join(" ")}
            >
              {STEP_LABELS[s]}
            </li>
          );
        })}
      </ol>

      <div className="border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)] sm:p-8">
        {step === "exam" && (
          <ExamStep
            subject={subject}
            onSelect={(s) => setSubject(s)}
            onContinue={() => subject === "polski" && setStep("draw")}
          />
        )}

        {step === "draw" && (
          <DrawStep
            onBack={() => setStep("exam")}
            onDraw={handleDraw}
          />
        )}

        {step === "prep" && question && (
          <PrepStep
            question={question}
            left={prepLeft}
            running={prepRunning}
            onStart={() => setPrepRunning(true)}
            onPause={() => setPrepRunning(false)}
            onSkip={() => {
              setPrepRunning(false);
              setStep("record");
            }}
          />
        )}

        {step === "record" && question && (
          <RecordStep
            question={question}
            recording={recording}
            seconds={recordSeconds}
            transcript={transcript}
            micError={micError}
            onTranscriptChange={setTranscript}
            onStart={startRecording}
            onStop={() => void finishRecording(false)}
            onUseMock={() => void finishRecording(true)}
          />
        )}

        {step === "followup" &&
          (preparingQuestions ? (
            <PreparingQuestions />
          ) : evaluating && followUps.length === 0 ? (
            <EvaluatingCommission skipReason={followUpSkipReason} />
          ) : !followUps[followUpIndex] ? (
            <PreparingQuestions />
          ) : (
            <FollowUpStep
              question={followUps[followUpIndex]!}
              index={followUpIndex}
              total={followUps.length}
              answer={currentFollowUpAnswer}
              evaluating={evaluating}
              error={evaluationError}
              onAnswerChange={setCurrentFollowUpAnswer}
              onSubmit={submitFollowUp}
              onRetry={() => void runEvaluation(followUpAnswers)}
            />
          ))}

        {step === "result" && evaluation && (
          <ResultStep
            evaluation={evaluation}
            question={question}
            questionKind={questionKind}
            transcript={transcript}
            followUpAnswers={followUpAnswers}
            followUps={followUps}
            followUpSkipReason={followUpSkipReason}
            onRestart={resetFlow}
          />
        )}
      </div>
    </div>
  );
}

function ExamStep({
  subject,
  onSelect,
  onContinue,
}: {
  subject: ExamSubject | null;
  onSelect: (s: ExamSubject) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold uppercase text-ink">
        Wybierz egzamin
      </h2>
      <p className="mt-2 text-sm text-graphite">
        Na start dostępny jest język polski. Angielski — w kolejnej iteracji.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect("polski")}
          className={[
            "min-h-24 border-2 border-ink p-4 text-left transition-colors",
            subject === "polski"
              ? "bg-stamp-red text-paper shadow-[4px_4px_0_var(--ink)]"
              : "bg-paper text-ink hover:bg-paper",
          ].join(" ")}
        >
          <span className="font-display text-xl font-bold uppercase">
            Polski
          </span>
          <span className="mt-1 block text-sm opacity-80">Dostępny teraz</span>
        </button>
        <button
          type="button"
          disabled
          className="min-h-24 cursor-not-allowed border-2 border-ink/25 bg-paper/50 p-4 text-left text-graphite opacity-60"
        >
          <span className="font-display text-xl font-bold uppercase">
            Angielski
          </span>
          <span className="mt-1 block text-sm">Wkrótce</span>
        </button>
      </div>
      <div className="mt-8 flex justify-end">
        <Button onClick={onContinue} disabled={subject !== "polski"}>
          Dalej
        </Button>
      </div>
    </div>
  );
}

function DrawStep({
  onBack,
  onDraw,
}: {
  onBack: () => void;
  onDraw: (kind: QuestionKind) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold uppercase text-ink">
        Losowanie pytania
      </h2>
      <p className="mt-2 text-sm text-graphite">
        {/* TODO: zastąpić realną bazą CKE */}
        Dane testowe — ostateczna baza 76 pytań CKE zostanie wgrana osobno.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onDraw("jawne")}
          className="min-h-28 border-2 border-ink bg-paper p-4 text-left shadow-[4px_4px_0_var(--ink)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          <span className="font-mono text-xs text-stamp-red">JAWNE</span>
          <span className="mt-2 block font-display text-xl font-bold uppercase text-ink">
            Pytanie jawne
          </span>
          <span className="mt-1 block text-sm text-graphite">
            Z listy CKE (mock)
          </span>
        </button>
        <button
          type="button"
          onClick={() => onDraw("niejawne")}
          className="min-h-28 border-2 border-ink bg-paper p-4 text-left shadow-[4px_4px_0_var(--ink)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          <span className="font-mono text-xs text-gold">NIEJAWNE</span>
          <span className="mt-2 block font-display text-xl font-bold uppercase text-ink">
            Pytanie niejawne
          </span>
          <span className="mt-1 block text-sm text-graphite">
            Nieznany tekst kultury
          </span>
        </button>
      </div>
      <div className="mt-8">
        <Button variant="ghost" onClick={onBack}>
          Wróć
        </Button>
      </div>
    </div>
  );
}

function PrepStep({
  question,
  left,
  running,
  onStart,
  onPause,
  onSkip,
}: {
  question: Question;
  left: number;
  running: boolean;
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-stamp-red">
            {question.code} · {question.kind === "jawne" ? "jawne" : "niejawne"}
            {question.isTestData ? " · TEST" : ""}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink">
            Przygotowanie
          </h2>
        </div>
        <p
          className="font-mono text-3xl font-semibold tabular-nums text-ink sm:text-4xl"
          aria-live="polite"
        >
          {formatTime(left)}
        </p>
      </div>

      <blockquote className="mt-6 border-2 border-ink bg-paper p-4 text-base leading-relaxed text-ink">
        {question.title}
      </blockquote>
      {question.cultureTextHint ? (
        <p className="mt-3 border border-dashed border-ink/40 bg-paper/60 p-3 text-sm text-graphite">
          {question.cultureTextHint}
        </p>
      ) : null}

      <p className="mt-4 text-sm text-graphite">
        Masz 15 minut na przygotowanie. W trybie testowym możesz pominąć timer.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!running ? (
          <Button onClick={onStart}>
            {left < PREP_SECONDS ? "Wznów timer" : "Start 15 min"}
          </Button>
        ) : (
          <Button variant="secondary" onClick={onPause}>
            Pauza
          </Button>
        )}
        <Button variant="secondary" onClick={onSkip}>
          Pomiń (tryb testowy)
        </Button>
      </div>
    </div>
  );
}

function RecordStep({
  question,
  recording,
  seconds,
  transcript,
  micError,
  onTranscriptChange,
  onStart,
  onStop,
  onUseMock,
}: {
  question: Question;
  recording: boolean;
  seconds: number;
  transcript: string;
  micError: string | null;
  onTranscriptChange: (v: string) => void;
  onStart: () => void;
  onStop: () => void;
  onUseMock: () => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-stamp-red">{question.code}</p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink">
            Wypowiedź
          </h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs uppercase tracking-wider text-graphite">
            Czas
          </p>
          <p className="font-mono text-3xl font-semibold tabular-nums text-ink">
            {formatTime(seconds)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-graphite">{question.title}</p>

      <div className="mt-6 flex items-center gap-3">
        <span
          className={[
            "inline-block h-3 w-3 rounded-full",
            recording ? "bg-stamp-red animate-pulse" : "bg-graphite/40",
          ].join(" ")}
          aria-hidden
        />
        <span className="font-mono text-sm text-ink">
          {recording ? "Nagrywanie…" : "Mikrofon gotowy"}
        </span>
      </div>

      {micError ? (
        <p className="mt-3 border-2 border-stamp-red/40 bg-paper p-3 text-sm text-stamp-red">
          {micError}
        </p>
      ) : null}

      <label className="mt-6 block">
        <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">
          Transkrypcja na żywo
        </span>
        <textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          rows={7}
          className="mt-2 w-full resize-y border-2 border-ink bg-paper p-3 font-sans text-sm leading-relaxed text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp-red"
          placeholder="Tu pojawi się rozpoznany tekst… możesz też wpisać lub wkleić wypowiedź ręcznie."
        />
      </label>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!recording ? (
          <Button onClick={onStart}>Start nagrania</Button>
        ) : (
          <Button onClick={onStop}>Zakończ wypowiedź</Button>
        )}
        <Button variant="secondary" onClick={onUseMock}>
          Wstaw przykładową wypowiedź
        </Button>
      </div>
    </div>
  );
}

function EvaluatingCommission({
  skipReason,
}: {
  skipReason: string | null;
}) {
  return (
    <div className="py-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
        Komisja AI
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold uppercase text-ink">
        {skipReason
          ? "Wypowiedź kompletna — przechodzę do oceny"
          : "Przygotowuję ocenę…"}
      </h2>
      {skipReason ? (
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-graphite">
          {skipReason}
        </p>
      ) : null}
    </div>
  );
}

function FollowUpStep({
  question,
  index,
  total,
  answer,
  evaluating,
  error,
  onAnswerChange,
  onSubmit,
  onRetry,
}: {
  question: FollowUpQuestion;
  index: number;
  total: number;
  answer: string;
  evaluating: boolean;
  error: string | null;
  onAnswerChange: (v: string) => void;
  onSubmit: () => void;
  onRetry: () => void;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
        Komisja AI · pytanie {index + 1}/{total}
      </p>
      <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink">
        Pytanie dodatkowe
      </h2>
      <p className="mt-2 text-sm text-graphite">
        Komisja wykryła lukę w wypowiedzi i dopytuje tylko o to, czego brakuje
        — tak jak na prawdziwym egzaminie.
      </p>

      {question.targetsGap ? (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-stamp-red">
          Brakuje: {question.targetsGap}
        </p>
      ) : null}

      {question.basedOnQuote ? (
        <div className="mt-6 border-l-4 border-gold bg-paper/60 py-2 pl-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-graphite">
            Komisja odnosi się do Twoich słów
          </p>
          <p className="mt-1 text-sm italic text-ink">
            „{question.basedOnQuote}”
          </p>
        </div>
      ) : null}

      <blockquote className="mt-4 border-2 border-ink bg-paper p-4 text-base leading-relaxed text-ink">
        {question.text}
      </blockquote>

      <label className="mt-6 block">
        <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">
          Twoja odpowiedź
        </span>
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          rows={5}
          disabled={evaluating}
          className="mt-2 w-full resize-y border-2 border-ink bg-paper p-3 text-sm leading-relaxed text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stamp-red disabled:opacity-60"
          placeholder="Odpowiedz tak, jak przed komisją…"
        />
      </label>

      {error ? (
        <p className="mt-4 border-2 border-stamp-red bg-paper p-3 text-sm text-stamp-red">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={error ? onRetry : onSubmit} disabled={evaluating}>
          {evaluating
            ? "Komisja analizuje wypowiedź…"
            : error
              ? "Spróbuj ponownie"
              : index + 1 < total
                ? "Następne pytanie"
                : "Przejdź do oceny"}
        </Button>
      </div>
    </div>
  );
}

function PreparingQuestions() {
  return (
    <div className="py-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
        Komisja AI
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold uppercase text-ink">
        Analizuję Twoją wypowiedź…
      </h2>
      <p className="mt-2 text-sm text-graphite">
        Komisja sprawdza, czy wyczerpałeś zagadnienie, lekturę i kontekst —
        i decyduje, czy w ogóle zadawać pytania dodatkowe.
      </p>
    </div>
  );
}

function ResultStep({
  evaluation,
  question,
  questionKind,
  transcript,
  followUpAnswers,
  followUps,
  followUpSkipReason,
  onRestart,
}: {
  evaluation: EvaluationResult;
  question: Question | null;
  questionKind: QuestionKind | null;
  transcript: string;
  followUpAnswers: string[];
  followUps: FollowUpQuestion[];
  followUpSkipReason: string | null;
  onRestart: () => void;
}) {
  const { user, addSessionResult } = useAuth();
  const savedRef = useRef(false);
  const cleanTranscript = transcript.trim();

  useEffect(() => {
    if (!user || !question || !questionKind || savedRef.current) return;
    savedRef.current = true;
    addSessionResult({
      questionCode: question.code,
      questionKind,
      questionTitle: question.title,
      totalPoints: evaluation.totalPoints,
      maxPoints: evaluation.maxPoints,
      percentage: evaluation.percentage,
      criteria: evaluation.criteria.map((c) => ({
        id: c.id,
        label: c.label,
        points: c.points,
        maxPoints: c.maxPoints,
      })),
    });
  }, [user, question, questionKind, evaluation, addSessionResult]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
            {evaluation.source === "ai"
              ? "Wynik · kryteria CKE"
              : "Wynik orientacyjny · tryb offline"}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase text-ink">
            Ocena komisji
          </h2>
          {question ? (
            <p className="mt-2 font-mono text-xs text-stamp-red">
              {question.code}
              {questionKind ? ` · ${questionKind}` : ""}
            </p>
          ) : null}
          {user ? (
            <p className="mt-2 text-xs text-success">
              Wynik zapisany w Twoim panelu.
            </p>
          ) : (
            <p className="mt-2 text-xs text-graphite">
              <Link href="/logowanie" className="font-medium text-ink underline">
                Zaloguj się
              </Link>
              , aby zapisywać wyniki w panelu.
            </p>
          )}
        </div>
        <div className="text-center">
          <Stamp
            size={96}
            label={`${evaluation.percentage}%`}
            sublabel="WYNIK"
            tone={evaluation.percentage >= 60 ? "success" : "red"}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <p className="font-mono text-3xl font-semibold text-ink">
          {evaluation.totalPoints}/{evaluation.maxPoints} pkt
        </p>
        <span
          className={[
            "border-2 border-ink px-2 py-1 font-mono text-xs uppercase tracking-wider",
            evaluation.passed
              ? "bg-success text-paper"
              : "bg-stamp-red text-paper",
          ].join(" ")}
        >
          {evaluation.passed ? "Zdane (próg 30%)" : "Poniżej progu 30%"}
        </span>
      </div>
      <p className="mt-2 font-mono text-[11px] text-graphite">
        Skala CKE dla jednego zadania: meritum 8 · kompozycja 2 · rozmowa 6 ·
        język 4. Pełny egzamin to dwa zadania i 30 pkt.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-graphite">
        {evaluation.summary}
      </p>

      {followUpSkipReason && followUps.length === 0 ? (
        <p className="mt-4 border-l-4 border-success bg-paper/60 py-2 pl-3 text-sm leading-relaxed text-ink">
          Komisja nie zadawała pytań dodatkowych: {followUpSkipReason}
        </p>
      ) : null}

      {evaluation.requirements.length > 0 ? (
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {evaluation.requirements.map((req) => (
            <li
              key={req.label}
              className="border-2 border-ink/20 bg-paper p-3 text-sm"
            >
              <div className="flex items-start gap-2">
                <span
                  className={[
                    "mt-0.5 font-mono text-xs",
                    req.met ? "text-success" : "text-stamp-red",
                  ].join(" ")}
                >
                  {req.met ? "✓" : "✕"}
                </span>
                <div>
                  <p className="font-medium text-ink">{req.label}</p>
                  {req.evidence ? (
                    <p className="mt-1 text-xs leading-relaxed text-graphite">
                      {req.evidence}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <section className="mt-8 border-2 border-ink bg-paper p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold uppercase text-ink">
          Twoja wypowiedź
        </h3>
        <p className="mt-1 font-mono text-xs text-graphite">
          {cleanTranscript
            ? `${cleanTranscript.split(/\s+/).filter(Boolean).length} słów`
            : "Brak nagranej treści"}
        </p>
        {cleanTranscript ? (
          <blockquote className="mt-4 max-h-64 overflow-y-auto border-l-4 border-stamp-red pl-4 text-sm leading-relaxed text-ink sm:text-base">
            {cleanTranscript}
          </blockquote>
        ) : (
          <p className="mt-4 text-sm italic text-graphite">
            Nie zarejestrowano wypowiedzi.
          </p>
        )}

        {followUps.length > 0 ? (
          <div className="mt-6 space-y-4 border-t-2 border-ink/15 pt-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
              Odpowiedzi na pytania dodatkowe
            </h4>
            {followUps.map((fu, i) => (
              <div key={fu.id}>
                <p className="font-mono text-xs text-stamp-red">
                  Pytanie {i + 1}
                </p>
                <p className="mt-1 text-sm text-graphite">{fu.text}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  {followUpAnswers[i]?.trim()
                    ? followUpAnswers[i]
                    : "(brak odpowiedzi)"}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <ul className="mt-8 space-y-4">
        {evaluation.criteria.map((c) => (
          <li key={c.id} className="border-2 border-ink bg-paper p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-bold uppercase text-ink">
                {c.label}
              </h3>
              <p className="font-mono text-sm text-stamp-red">
                {c.points}/{c.maxPoints}
              </p>
            </div>
            {c.levelLabel ? (
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-graphite">
                Poziom CKE: {c.levelLabel}
              </p>
            ) : null}

            {c.quotes.length > 0 ? (
              <div className="mt-3 space-y-3">
                {c.quotes.map((q, i) => (
                  <div key={i} className="border-l-4 border-gold pl-3">
                    <p className="text-sm italic text-ink">„{q.text}”</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-graphite">
                      {q.source === "rozmowa" ? "Z rozmowy" : "Z monologu"}
                    </p>
                    {q.comment ? (
                      <p className="mt-1 text-sm leading-relaxed text-graphite">
                        {q.comment}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            <p className="mt-3 text-sm leading-relaxed text-graphite">
              {c.justification}
            </p>

            {c.strengths.length > 0 || c.improvements.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {c.strengths.length > 0 ? (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-success">
                      Mocne strony
                    </p>
                    <ul className="mt-1 space-y-1 text-sm text-ink">
                      {c.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {c.improvements.length > 0 ? (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-stamp-red">
                      Na wyższy próg
                    </p>
                    <ul className="mt-1 space-y-1 text-sm text-ink">
                      {c.improvements.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {evaluation.factualErrors.length > 0 ? (
        <section className="mt-8 border-2 border-stamp-red bg-paper p-4 sm:p-5">
          <h3 className="font-display text-lg font-bold uppercase text-stamp-red">
            Błędy rzeczowe
          </h3>
          <ul className="mt-3 space-y-3">
            {evaluation.factualErrors.map((e, i) => (
              <li key={i}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-stamp-red">
                  Błąd {e.type}
                </p>
                <p className="mt-1 text-sm italic text-ink">„{e.quote}”</p>
                <p className="mt-1 text-sm leading-relaxed text-graphite">
                  {e.explanation}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {evaluation.languageIssues.length > 0 ? (
        <section className="mt-6 border-2 border-ink bg-paper p-4 sm:p-5">
          <h3 className="font-display text-lg font-bold uppercase text-ink">
            Poprawki językowe
          </h3>
          <ul className="mt-3 space-y-3">
            {evaluation.languageIssues.map((e, i) => (
              <li key={i}>
                <p className="text-sm italic text-ink">„{e.quote}”</p>
                <p className="mt-1 text-sm text-graphite">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stamp-red">
                    {e.issue}
                  </span>{" "}
                  → {e.suggestion}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onRestart}>Kolejna symulacja</Button>
        {user ? (
          <ButtonLink href="/panel" variant="secondary">
            Mój panel
          </ButtonLink>
        ) : (
          <ButtonLink href="/cennik" variant="secondary">
            Odblokuj Max
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
