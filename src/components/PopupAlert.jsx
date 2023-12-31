import React, { useEffect, useRef } from 'react';

function PopupAlert({ JSHINT, closePopup }) {
  const typos = useRef(null);

  useEffect(() => {
    const typosCurrent = typos.current;

    let outputArray = [];
    let output = "Check format error:\n\n";

    for (let i in JSHINT.errors) {
      let err = JSHINT.errors[i];

      if (err !== null) {
        output = `${err.line}[${err.character}]: ${err.reason}\n`;
        outputArray.unshift(output);
      } else {
        output = "Check format unknown error:\n";
        outputArray.push(output);
      }
    }

    outputArray.forEach((output) => {
      const markup = `<p>${output}</p>`;
      typosCurrent.insertAdjacentHTML("afterbegin", markup);
    });
  }, [JSHINT.errors]);

  return (
    <div className="popup">
      <div className="popup__content popup__alert">
        <h1 className="title">Alert!</h1>
        <h2 className="description">
          Please, make sure you don't have any typos.
        </h2>

        <div ref={typos} className="typos"></div>

        <div onClick={closePopup} className="close">
          &#10005;
        </div>
      </div>
    </div>
  );
}

export default PopupAlert;
