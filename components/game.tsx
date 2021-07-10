import { useState, useEffect, useRef } from "react";
import random from "utils/random";
import { ILangData } from "pages/api/data";

interface IProps {
  data: ILangData;
}
type ChoiceType = {
  lang: string;
  value: string;
};
type ChoicesType = ChoiceType[];

function Game(props: IProps) {
  const { pairs, langA, langB } = props.data;
  const synthRef = useRef(window.speechSynthesis);
  const [langAVoices, setLangAVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [langBVoices, setLangBVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [langAVoice, setLangAVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );
  const [langBVoice, setLangBVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );
  const [current, setCurrent] = useState<ChoiceType | null>(null);
  const [choices, setChoices] = useState<ChoicesType>([]);
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setTimeout(() => {
      const voices = synthRef.current
        .getVoices()
        .filter((voice) => !voice.name.includes("Google"));

      const filteredA = voices.filter(
        (voice) => voice.lang.substr(0, 2) === langA.code
      );
      setLangAVoices(filteredA);
      setLangAVoice(random(filteredA));

      const filteredB = voices.filter(
        (voice) => voice.lang.substr(0, 2) === langB.code
      );
      setLangBVoices(filteredB);
      setLangBVoice(random(filteredB));
    }, 100);
  }, []);

  useEffect(() => {
    const all = pairs.flatMap(([valueA, valueB]) => [
      { lang: langA.code, value: valueA },
      { lang: langB.code, value: valueB },
    ]);
    const sorted = all.sort(() => Math.random() - 0.5);
    setChoices(sorted);
  }, [pairs]);

  const isMatch = (valueA: string, valueB: string) =>
    pairs.some(
      ([choiceA, choiceB]) =>
        (choiceA === valueA && choiceB === valueB) ||
        (choiceA === valueB && choiceB === valueA)
    );

  const correct = () => {
    const words = ["Nice one!", "You did it!", "Impressive"];
    const utterThis = new SpeechSynthesisUtterance(random(words));
    utterThis.rate = 1.2;
    setTimeout(() => {
      synthRef.current.speak(utterThis);
    }, 500);
  };

  const incorrect = () => {
    const words = ["Next time", "Oops", "Not quite", "Don't give up"];
    const utterThis = new SpeechSynthesisUtterance(random(words));
    utterThis.rate = 1.2;
    setTimeout(() => {
      synthRef.current.speak(utterThis);
    }, 500);
  };

  const choose = (choice: { value: string; lang: string }) => {
    const utterThis = new SpeechSynthesisUtterance(choice.value);
    utterThis.voice = choice.lang === langA.code ? langAVoice : langBVoice;
    synthRef.current.speak(utterThis);

    if (current) {
      if (isMatch(current.value, choice.value)) {
        correct();
        setSelected((val) => ({ ...val, [choice.value]: true }));
      } else {
        incorrect();
        setSelected((val) => ({ ...val, [current.value]: false }));
      }
      setCurrent(null);
    } else {
      setSelected((val) => ({ ...val, [choice.value]: true }));
      setCurrent(choice);
    }
  };

  const reset = () => {
    setCurrent(null);
    setSelected({});
  };

  return (
    <div>
      <h2>Choose your accent</h2>
      <div className="languages">
        <ul className="voices">
          <li>{langA.name}:</li>
          {langAVoices.map((voice) => (
            <li key={voice.name}>
              <button
                onClick={() => {
                  setLangAVoice(voice);
                }}
                className={
                  langAVoice && langAVoice.name === voice.name ? "selected" : ""
                }
              >
                {voice.name}
              </button>
            </li>
          ))}
        </ul>
        <ul className="voices">
          <li>{langB.name}:</li>
          {langBVoices.map((voice) => (
            <li key={voice.name}>
              <button
                onClick={() => {
                  setLangBVoice(voice);
                }}
                className={
                  langBVoice && langBVoice.name === voice.name ? "selected" : ""
                }
              >
                {voice.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <h2>Choose the pairs</h2>

      <ul className="choices">
        {choices.map((choice) => (
          <li key={`${choice.lang}-${choice.value}`}>
            <button
              onClick={() => {
                choose(choice);
              }}
              className={
                current && current.value === choice.value ? "selected" : ""
              }
              disabled={!!selected[choice.value]}
            >
              {choice.value}
            </button>
          </li>
        ))}
      </ul>

      <button className="reset" onClick={() => reset()}>
        reset
      </button>
    </div>
  );
}

export default Game;
