/* eslint-disable no-console */
const delay = func => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(func());
  }, 1000);
});

console.log('a');
delay(() => {
  console.log('c');
}).then(() => {
  return delay(() => console.log('d'));
}).then(() => {
  return delay(() => console.log('e'));
});
console.log('b');
