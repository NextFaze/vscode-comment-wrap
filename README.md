**IMPORTANT:** While you're welcome to submit PR's for this (or I may if I get some time) - I actually ended up finding a more feature-full extension for wrapping comments after publishing this. I suggest you check out [Rewrap](https://marketplace.visualstudio.com/items?itemName=stkb.rewrap) for better comment auto-wrapping support.

<center>

## Comment Wrap

<img width=200 src="icon.png">

Easily re-wrap comments to a given line width.

</center>

<img width=600 src="demo.gif">

Turns this:

```js
// this is
// my comment that
// does not wrap properly
```

Into this:

```js
// this is my comment that does not wrap
// properly
```

Supports:

- ✅ Standard (JavaScript/TypeScript/Java etc.) style comments ( `//` )
- ✅ Block comments ( `/* */` )
- ✅ Dart-doc comments ( `///` )
- ❌ Anything else (Python, bash etc.) **yet**

### Settings

The default wrap length is `80` - it can be customized with user setting `commentWrap.printWidth`:

```json
{
  "commentWrap.printWidth": 120
}
```

### **Disclaimer**

This extension is in the very early stages of development (mostly a proof-of-concept at this stage, put together in about 15 minutes) so may not be fully functional.

**Checkout our other extension**

- [JSON Parse & Stringify](https://marketplace.visualstudio.com/items?itemName=nextfaze.json-parse-stringify)
