import React, { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

import TitleBar from "./component/TitleBar";

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // get content from localstorage
  useEffect(() => {
    const savedContent = localStorage.getItem("content");
    if (savedContent !== null) {
      const updateState = EditorState.createWithContent(
        convertFromRaw(JSON.parse(savedContent))
      );
      setEditorState(updateState);
    }
  }, []);

  // function for focus on editor
  const editor = useRef(null);
  const focusEditor = () => {
    editor.current?.focus();
  };

  // custom style object
  const customStyleMap = {
    HEADING: {
      fontSize: "32px",
    },
    RED_FONT: {
      color: "red",
    },
  };

  const toggleInlineStyle = (inlineStyle) => {
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
    const newState2 = RichUtils.toggleBlockType(newState, "header-one");
    setEditorState(newState2);
  };

  // function for handeling editor change
  const handleEditorChange = (newState) => {
    setEditorState(newState);
    const rawContentState = convertToRaw(newState.getCurrentContent());
    let text = rawContentState.blocks[0].text;
    let subString, subString2, subString3;
    if (text.length > 1) {
      subString = text.substring(text.length - 2, text.length);
      subString2 = text.substring(text.length - 3, text.length);
      subString3 = text.substring(text.length - 4, text.length);

      if (subString3 === "*** ") {
        deleteLastCharacters(4, text, "UNDERLINE");
      } else if (subString2 === "** ") {
        deleteLastCharacters(3, text, "RED_FONT");
      } else {
        if (subString === "* ") deleteLastCharacters(2, text, "BOLD");
        else if (subString === "# ") deleteLastCharacters(2, text, "HEADING");
      }
    }
  };

  const deleteLastCharacters = (len, text, style) => {
    toggleInlineStyle(style);
    text = `${text.slice(0, text.length - len)}`;
    console.log(text);

    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const newSelection = selectionState.merge({
      anchorOffset: selectionState.getFocusOffset() - len + 1,
      focusOffset: selectionState.getFocusOffset(),
    });

    const newContentState = Modifier.replaceText(
      contentState,
      newSelection,
      ""
    );

    // Create a new EditorState with the new ContentState and selection
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "remove-range"
    );

    let updatedEditorState = EditorState.forceSelection(
      newEditorState,
      newContentState.getSelectionAfter()
    );

    const newState = RichUtils.toggleInlineStyle(updatedEditorState, style);
    const newState2 = RichUtils.toggleBlockType(newState, "header-one");
    setEditorState(newState2);
  };

  return (
    <main>
      <TitleBar text={editorState} />

      <div className="m-1 editor" onClick={focusEditor}>
        <Editor
          ref={editor}
          customStyleMap={customStyleMap}
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="Write Something here..."
        />
      </div>
    </main>
  );
}

export default App;
