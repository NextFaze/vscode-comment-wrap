import { window, workspace } from "vscode";

const leadingCommentRe = /^(\/\/\/|\/\/|\s*\*\/?|\/\*)/;

export function reWrapSelected() {
  let configuration = workspace.getConfiguration();
  const width = configuration.get<number>("commentWrap.printWidth", 80);

  const selected = getSelectedText();

  if (!selected || !selected.trim()) {
    window.showInformationMessage("Select a comment block");
    return;
  }

  const isCommentLine = (line: string): boolean =>
    leadingCommentRe.test(line.trim());
  const lines = selected.split("\n");
  const commentLines = lines.filter((line) => isCommentLine(line.trim()));

  if (commentLines.length !== lines.length) {
    window.showInformationMessage("Please only select only a comment block");
  }

  try {
    replaceSelectedText(reWrapComments(selected, width));
  } catch (ex) {
    console.log(ex);
    window.showInformationMessage("Failed to reformat comment");
  }
}

/**
 * Given a block of text, re-wrap it to the given line length:
 *
 * ```
 * // this
 * // is my comment
 * ```
 *
 * ->
 *
 * ```
 * // this is my comment
 * ```
 *
 * Code here is pretty sketchy as was hacked together in about 15 minutes.
 * Could use a refactor later.
 */
export function reWrapComments(commentBlock: string, wrap: number = 80) {
  const newCommentLines: string[] = [];

  enum CommentStyle {
    normal,
    dartDoc,
    // Just the middle of a block comment
    midBlock,
    block,
  }

  const commentStyle = commentBlock.trim().startsWith("///")
    ? CommentStyle.dartDoc
    : commentBlock.trim().startsWith("/*")
    ? CommentStyle.block
    : commentBlock.trim().startsWith("*")
    ? CommentStyle.midBlock
    : CommentStyle.normal;

  let commentText = commentBlock
    .split("\n")
    .map((line) => line.replace(leadingCommentRe, "").trim())
    .join(" ");

  let nextCommentLine = "";
  while (commentText.length > 0) {
    const nextLength = nextWordLength(commentText.trim());
    nextCommentLine += ` ${peekNextWord(commentText.trim())}`;
    commentText = commentText.trim().substr(nextLength);
    if (
      nextCommentLine.length + nextWordLength(commentText.trim()) + 3 >
      wrap
    ) {
      newCommentLines.push(nextCommentLine);
      nextCommentLine = "";
    }
  }

  newCommentLines.push(nextCommentLine);

  const commentLead = (_line: string) => {
    switch (commentStyle) {
      case CommentStyle.dartDoc:
        return "///";
      case CommentStyle.normal:
        return "//";
      case CommentStyle.midBlock:
      case CommentStyle.block: {
        return " *";
      }
    }
  };

  const newBlock = newCommentLines
    .map((line, idx) => `${commentLead(line)} ${line.trim()}`)
    .join("\n");
  return commentStyle === CommentStyle.block
    ? `/*\n${newBlock}\n */`
    : newBlock;
}

/**
 * Get the currently selected block of text in the editor
 */
function getSelectedText(editor = window.activeTextEditor) {
  if (!editor) {
    return;
  }
  const selectedText = editor.document.getText(editor.selection);
  return selectedText;
}

/**
 * Replace the currently selected text in the editor with the provided value
 */
function replaceSelectedText(value: string, editor = window.activeTextEditor) {
  if (!editor) {
    return;
  }
  editor.edit((builder) => {
    builder.replace(editor.selection, value);
  });
}

/**
 * Give the next word of a line e.g. ' my line ' -> 'my'
 */
function peekNextWord(line: string) {
  let index = 0;
  while (index < line.length && line[index] !== " ") {
    index++;
  }
  return line.slice(0, index).trim();
}

/**
 * Give the length of the next word in a line e.g. ' my line ' -> 2
 */
function nextWordLength(line: string) {
  let index = 0;
  while (index < line.length && line[index] !== " ") {
    index++;
  }
  return index;
}
