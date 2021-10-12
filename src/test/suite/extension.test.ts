import * as assert from "assert";
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { reWrapComments } from "../../lib/wrap-comment";

// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");
  suite("reWrapComments", () => {
    test("folds normal comments if the line is too short", () => {
      const original = `// this is
// my comment`;
      const formatted = reWrapComments(original);
      assert.strictEqual(formatted, `// this is my comment`);
    });

    test("wraps comments if the line is too long", () => {
      const original = `// this is my super long comment that should wrap onto the next line because it is too long`;
      const formatted = reWrapComments(original);
      assert.strictEqual(
        formatted,
        `// this is my super long comment that should wrap onto the next line because it
// is too long`
      );
    });

    test("allows for a custom width", () => {
      const original = `// this is my super long comment that should wrap onto the next line because it is too long`;
      const formatted = reWrapComments(original, 40);
      assert.strictEqual(
        formatted,
        `// this is my super long comment that
// should wrap onto the next line
// because it is too long`
      );
    });

    test("wraps dart-doc style comments", () => {
      const original = `/// this is my super long comment that should wrap onto the next line because it is too long`;
      const formatted = reWrapComments(original);
      assert.strictEqual(
        formatted,
        `/// this is my super long comment that should wrap onto the next line because it
/// is too long`
      );
    });

    test("wraps multi-line dart-doc style comments", () => {
      const original = `  /// this is my super long comment that will wrap onto
  /// multiple lines because it is in fact that long`;
      const formatted = reWrapComments(original);
      assert.strictEqual(
        formatted,
        `/// this is my super long comment that will wrap onto multiple lines because it
/// is in fact that long`
      );
    });

    test("wraps block style comments when the middle of the block is used", () => {
      const original = `* this is my super long comment that should wrap onto the next line because it is too long`;
      const formatted = reWrapComments(original);
      assert.strictEqual(
        formatted,
        ` * this is my super long comment that should wrap onto the next line because it
 * is too long`
      );
    });

    test("wraps block comments", () => {
      const original = `/* this
			* is my super long comment that should wrap onto the next line because it
			*/ is too long`;
      const formatted = reWrapComments(original);
      assert.strictEqual(
        formatted,
        `/*
 * this is my super long comment that should wrap onto the next line because it
 * is too long
 */`
      );
    });
  });
});
