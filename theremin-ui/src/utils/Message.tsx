import { Position, Toaster } from '@blueprintjs/core';


export const TIMEOUT = 2000;

const Message = Toaster.create({
  position: Position.BOTTOM,
  usePortal: true,
  canEscapeKeyClear: true,
});

export default Message;