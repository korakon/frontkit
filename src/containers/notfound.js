import { DOM } from 'react';

export default function NotFound() {
  const {h1} = DOM;
  return h1(null, '404 - Not Found');
}
