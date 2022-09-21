// From: https://stackoverflow.com/a/69383227
import React, { InputHTMLAttributes, ClipboardEvent, KeyboardEvent } from 'react';

export const RestrictedInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {

    const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {

      if (props.pattern) {
        const pattern = new RegExp(props.pattern);

        // if the currently typed character is not in the regular expression, do not allow it (to be rendered)
        // if the length of the input will exceed, do not allow
        if (!pattern.test(e.key)) { // || e.target.value.length + 1 > (props.max || Infinity)) {
          e.preventDefault();
        }
      }

      // if also has "onKeyPress" prop, fire it now
      props.onKeyPress && props.onKeyPress(e);
    }

    // prevent invalid content pasting
    const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {

      if (props.pattern) {
        // get the pattern with midifications for testig a whole string rather than a single character
        const pattern = new RegExp(`^${props.pattern}+$`);

        // get pasted content as string
        const paste = (e.clipboardData).getData('Text'); //  || window.clipboardData

        // validate
        if (!pattern.test(paste) || paste.length > (props.max || Infinity)) {
          e.preventDefault();
        }
      }

      // if also has "onPaste" prop, fire it now
      props.onPaste && props.onPaste(e);
    }

    return <input ref={ref} {...props} onKeyPress={onKeyPress} onPaste={onPaste} />;
  }
);

RestrictedInput.displayName = 'RestrictedInput';
