import { useState, useRef } from 'react';

import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror";
import "codemirror/mode/javascript/javascript";

import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/javascript-lint";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/addon/lint/lint.css";

import { JSHINT } from "jshint";

import PopupAlert from './PopupAlert';

import {
  checkFormat,
  parsedCode,
  unsortedCode,
  sortFunction,
  sortCallStack,
  callStackParser,
  unhighlightAllText,
} from '../functions'
import { markup1, markup2 } from '../markups'
import { getInterval } from '../utils';

window.JSHINT = JSHINT;

const HomePage = () => {
  let editorRef = useRef(null);
  let callStackPlaygroundRef = useRef(null);
  let webApiPlaygroundRef = useRef(null);
  let callbackQueuePlaygroundRef = useRef(null);
  const dropdownSpeedRef = useRef(null);
  const dropdownExampleRef = useRef(null);

  const [state, setState] = useState({
    popupAlert: false,
    code: markup1,
    unsortedCallStack: [],
    unsortedFunction: [],
    isCallStack: [],
    isFunction: [],
    isWebApi: [],
    isCallbackQueue: [],
    speed: "Very Slow",
    example: 1,
    isSpeedOpen: false,
    isExampleOpen: false,
  });

  const clearState = () => {
    setState(prevState => ({ ...prevState,
      unsortedCallStack: [],
      unsortedFunction: [],
      isCallStack: [],
      isFunction: [],
      isWebApi: [],
      isCallbackQueue: [],
    }));

    callStackPlaygroundRef.current.innerHTML = "";
    webApiPlaygroundRef.current.innerHTML = "";
    callbackQueuePlaygroundRef.current.innerHTML = "";

    // UNHIGHLIGHTING ALL TEXT
    unhighlightAllText(editorRef.current.editor.doc.size, editorRef.current.editor);
  };

  const onClick = () => {
    // STATE VARIABLES
    let {
      code,
      unsortedCallStack,
      unsortedFunction,
      isCallStack,
      isFunction,
      isWebApi,
      isCallbackQueue,
      speed,
    } = state;

    // CLEAR STATE
    clearState();

    document.documentElement.style.setProperty(
      "--interval",
      `${getInterval(speed) - 100}ms`
    );

    // CHECK FORMAT SPELLING
    const success = checkFormat(JSHINT, code);

    // IF NO FORMAT ERROR
    if (success) {
      // PARSING CODE TREE
      const parsedCodeTree = parsedCode(code);

      // UNSORTING CODE
      unsortedCode(parsedCodeTree, unsortedCallStack, unsortedFunction);

      // SORTING FUNCTION
      sortFunction(unsortedFunction, isFunction);

      // SORTING CALL STACK
      sortCallStack(unsortedCallStack, isCallStack, isFunction);

      // PARSE CALL STACK
      callStackParser(
        editorRef.current.editor,
        getInterval(speed),
        unsortedCallStack,
        unsortedFunction,
        isCallStack,
        isFunction,
        isWebApi,
        isCallbackQueue,
        callStackPlaygroundRef.current,
        webApiPlaygroundRef.current,
        callbackQueuePlaygroundRef.current
      );
    } else if (!success) {
      setState(prevState => ({ ...prevState, popupAlert: true }));
    }
  };

  const clearPlayground = () => {
    setState(prevState => ({ ...prevState, code: "" }));
    clearState();
  };

  // DROPDOWN
  const dropdownToggleSpeed = () => {
    let { isSpeedOpen } = state;

    if (!isSpeedOpen) {
      dropdownSpeedRef.current.style.display = "block";
      dropdownSpeedRef.current.parentNode.classList.add("dropdown__active");
      setState(prevState => ({ ...prevState, isSpeedOpen: true }));
    } else if (isSpeedOpen) {
      dropdownSpeedRef.current.style.display = "none";
      dropdownSpeedRef.current.parentNode.classList.remove("dropdown__active");
      setState(prevState => ({ ...prevState, isSpeedOpen: false }));
    }

    const array = Array.from(dropdownSpeedRef.current.children[0].children);

    const eventHandle = (event) => {
      let childElement = true;

      array.forEach((child) => {
        if (event.target === child) {
          childElement = false;
        }
      });

      if (event.target === dropdownSpeedRef.current.parentNode && childElement) {
        document.documentElement.removeEventListener("click", eventHandle);
      }

      if (event.target !== dropdownSpeedRef.current.parentNode && childElement) {
        dropdownSpeedRef.current.style.display = "none";
        dropdownSpeedRef.current.parentNode.classList.remove("dropdown__active");
        setState(prevState => ({ ...prevState, isSpeedOpen: false }));

        document.documentElement.removeEventListener("click", eventHandle);
      }
    };

    document.documentElement.addEventListener("click", eventHandle);
  };

  const dropdownToggleExample = () => {
    let { isExampleOpen } = state;

    if (!isExampleOpen) {
      dropdownExampleRef.current.style.display = "block";
      dropdownExampleRef.current.parentNode.classList.add("dropdown__active");
      setState(prevState => ({ ...prevState, isExampleOpen: true }));
    } else if (isExampleOpen) {
      dropdownExampleRef.current.style.display = "none";
      dropdownExampleRef.current.parentNode.classList.remove("dropdown__active");
      setState(prevState => ({ ...prevState, isExampleOpen: false }));
    }

    const array = Array.from(dropdownExampleRef.current.children[0].children);

    const eventHandle = (event) => {
      let childElement = true;

      array.forEach((child) => {
        if (event.target === child) {
          childElement = false;
        }
      });

      if (event.target === dropdownExampleRef.current.parentNode && childElement) {
        document.documentElement.removeEventListener("click", eventHandle);
      }

      if (event.target !== dropdownExampleRef.current.parentNode && childElement) {
        dropdownExampleRef.current.style.display = "none";
        dropdownExampleRef.current.parentNode.classList.remove("dropdown__active");
        setState(prevState => ({ ...prevState, isExampleOpen: false }));

        document.documentElement.removeEventListener("click", eventHandle);
      }
    };

    document.documentElement.addEventListener("click", eventHandle);
  };

  // SPEED
  const speedVeryFast = () => {
    setState(prevState => ({ ...prevState, speed: "Very Fast" }));
  };

  const speedFast = () => {
    setState(prevState => ({ ...prevState,speed: "Fast" }));
  };

  const speedAverage = () => {
    setState(prevState => ({ ...prevState, speed: "Average" }));
  };

  const speedSlow = () => {
    setState(prevState => ({ ...prevState, speed: "Slow" }));
  };

  const verySlow = () => {
    setState(prevState => ({ ...prevState, speed: "Very Slow" }));
  };

  // EXAMPLE
  const example1 = () => {
    setState(prevState => ({ ...prevState, example: 1, code: markup1 }));
    clearState();
  };

  const example2 = () => {
    setState(prevState => ({ ...prevState, example: 2, code: markup2 }));
    clearState();
  };

  // const example3 = () => {
  //   setState(prevState => ({ ...prevState, example: 3, code: markup3 }));
  //   clearState();
  // };

  const closePopupAlert = () => {
    setState(prevState => ({ ...prevState, popupAlert: false }));
  };

  let { speed, popupAlert, example } = state;

  return (
    <div className="homepage">
      {popupAlert ? (
          <PopupAlert JSHINT={JSHINT} closePopup={closePopupAlert} />
        ) : null}
      <div className="navbar">
        <div className="left">
          <div className="btn">
            <button className="visualize" onClick={onClick}>
              Visualize
            </button>
          </div>
          <div
            onClick={dropdownToggleSpeed}
            className="nav secondary select speed"
          >
            Speed: {speed}
            <div
              ref={dropdownSpeedRef}
              className="speed__dropdown dropdown"
            >
              <ul>
                <li onClick={speedVeryFast}>Very Fast</li>
                <li onClick={speedFast}>Fast</li>
                <li onClick={speedAverage}>Average</li>
                <li onClick={speedSlow}>Slow</li>
                <li onClick={verySlow}>Very Slow</li>
              </ul>
            </div>
          </div>
          <div
            onClick={dropdownToggleExample}
            className="nav secondary select example"
          >
            Example: {example}
            <div
              ref={dropdownExampleRef}
              className="speed__dropdown dropdown"
            >
              <ul>
                <li onClick={example1}>Demo: 1</li>
                <li onClick={example2}>Demo: 2</li>
                {/* <li onClick={example3}>Demo: 3</li> */}
              </ul>
            </div>
          </div>
          <div onClick={clearPlayground} className="nav secondary">
            Clear playground
          </div>
        </div>

        <div className="right">
          <div
            className="nav title"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/kamronbekshodmonov/JELoop-Visualizer"
          >
            Event Loop Visualizer for NodeJS
          </div>
        </div>
      </div>
      <div className="main">
        <div className="main__left">
          <div className="playground_wrapper">
            <CodeMirror
              ref={editorRef}
              className="playground"
              value={state.code}
              options={{
                lineNumbers: true,
                firstLineNumber: 1,
                lineWrapping: true,
                mode: "javascript",
                theme: "dracula",
                styleActiveLine: true,
                autoCloseBrackets: true,
                tabSize: 2,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-lint-markers"],
                lint: true,
              }}
              onBeforeChange={(editor, data, code) => {
                setState(prevState => ({ ...prevState, code }));

                // CLEAR STATE
                if (data.origin) {
                  clearState();
                }
              }}
              onChange={(editor, data, code) => {}}
            />
          </div>
        </div>
        <div className="main__right">
          <div className="call-stack event">
            <div className="event__title">Call Stack</div>

            <div className="event__border">
              <div
                ref={callStackPlaygroundRef}
                className="call-stack__content event__content"
              ></div>
            </div>
          </div>

          <div className="web-api event">
            <div className="event__title">Libuv</div>

            <div className="event__border">
              <div
                ref={webApiPlaygroundRef}
                className="web-api__content event__content"
              ></div>
            </div>
          </div>

          <div className="callback-queue event">
            <div className="event__title">Callback Queue</div>

            <div className="event__border">
              <div
                ref={callbackQueuePlaygroundRef}
                className="callback-queue__content event__content"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
