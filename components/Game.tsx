import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getVerbsForGame } from "../lib/getVerbsForGame";
import { Mode, Verb } from "../types";

type Props = {
  mode: Mode;
  exit: () => void;
};

const Game = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [index, setIndex] = useState(0);
  const [verbs, setVerbs] = useState<Verb[]>(getVerbsForGame(props.mode));

  const [answer, setAnswer] = useState(["", ""]);
  const [isCheck, setIsCheck] = useState(false);

  const verb = useMemo<[string, string, string]>(() => {
    return verbs[index];
  }, [index, verbs]);

  const correctAnswers = useMemo(() => {
    if (!isCheck) return [];

    return answer.map((word, index) => {
      const currentVerb = verb[index + 1];
      const currentVerbs = currentVerb.replace(",", "").split(" ");

      return {
        correct: currentVerbs.some(
          (verb) => word.trim().toLowerCase() === verb.trim().toLowerCase()
        ),
        word: currentVerb,
      };
    });
  }, [isCheck]);

  const Status = (index: number) => {
    const { word, correct } = correctAnswers[index];

    return (
      <span
        className={clsx("font-bold", {
          "text-green-500": correct,
          "text-red-500": !correct,
        })}
      >
        {word}
      </span>
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsCheck(true);
    }
  };

  const handleMoveNext = () => {
    if (props.mode !== Mode.infinite && index === verbs.length - 1) {
      props.exit();
      return;
    }

    setAnswer(["", ""]);
    setIsCheck(false);
    setIndex(index + 1);

    inputRef.current?.focus();
  };

  useEffect(() => {
    const h = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setIsCheck(true);
      }
      if (event.key === "Enter" && isCheck) {
        handleMoveNext();
      }
    };

    window.addEventListener("keypress", h);
    return () => window.removeEventListener("keypress", h);
  }, [isCheck]);

  const handleNext = () => {
    if (isCheck) {
      handleMoveNext();
      if (timer) clearTimeout(timer);
      return;
    }

    setIsCheck(true);

    const t = setTimeout(() => {
      handleMoveNext();
    }, 1500);

    setTimer(t);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="bg-gray-700 p-4 rounded flex flex-col min-w-[300px]">
        <div className="flex items-center mb-4">
          <p className="mb-0 mr-auto text-xl font-bold">{verb[0]}</p>
          {props.mode !== Mode.infinite && (
            <span className="mr-2 text-green-100 ">
              {index + 1} / {props.mode}
            </span>
          )}
          <button onClick={props.exit}>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mb-1">
          <div className="flex flex-col mb-1">
            <input
              ref={inputRef}
              autoFocus
              value={answer[0]}
              onChange={(e) => setAnswer([e.target.value, answer[1]])}
              disabled={isCheck}
              className="p-2 px-4 bg-transparent border border-gray-500 rounded disabled:opacity-50 "
              type="text"
              placeholder="V2 Past Simple"
            />
            {isCheck ? Status(0) : <span> &nbsp;</span>}
          </div>
          <div className="flex flex-col mb-1">
            <input
              value={answer[1]}
              onChange={(e) => setAnswer([answer[0], e.target.value])}
              onKeyPress={handleKeyPress}
              disabled={isCheck}
              className="p-2 px-4 bg-transparent border border-gray-500 rounded disabled:opacity-50 "
              placeholder="V3 Past Participle"
              type="text"
            />
            {isCheck ? Status(1) : <span> &nbsp;</span>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleMoveNext()}
            className={clsx(
              {
                invisible: isCheck,
              },
              "p-2 px-6 text-indigo-200 border rounded border-indigo-200/20 hover:opacity-80"
            )}
          >
            skip
          </button>
          <div className="grow"></div>
          <button
            disabled={isCheck || answer.some((w) => !w)}
            onClick={() => setIsCheck(true)}
            className="px-6 py-2 text-indigo-200 rounded hover:opacity-80 disabled:opacity-5"
          >
            Check
          </button>
          <button
            onClick={handleNext}
            disabled={answer.some((w) => !w) && !isCheck}
            className="px-6 py-2 bg-indigo-500 rounded hover:opacity-80 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
