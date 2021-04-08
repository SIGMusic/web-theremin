import { Position, Toaster } from '@blueprintjs/core';

/** The suggested amount of time (ms) for which the message should appear. */
export const kTimeout = 2000;

/** A toast positioned at the bottom of the screen. */
const Message = Toaster.create({
  position: Position.BOTTOM,
  usePortal: true,
  canEscapeKeyClear: true,
});

export default Message;