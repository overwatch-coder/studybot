export const getAnonymousId = () => {
  let anonymousId = localStorage.getItem('anonymousId');
  if (!anonymousId) {
    anonymousId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('anonymousId', anonymousId);
  }
  return anonymousId;
};