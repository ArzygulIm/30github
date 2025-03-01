// 1
// An isogram is a word that has no repeating letters, consecutive or non-consecutive. Implement a function that determines whether a string that contains only letters is an isogram. Assume the empty string is an isogram. Ignore letter case.

const isIsogram = (str) => new Set(str.toLowerCase()).size === str.length;

function isIsogram(str) {
  return !/(\w).*\1/i.test(str);
}

function isIsogram(str) {
  return !str.match(/([a-z]).*\1/i);
}

function isIsogram(str) {
  return (
    !str ||
    str
      .toLowerCase()
      .split("")
      .every(function (v, i, arr) {
        return arr.indexOf(v) == i;
      })
  );
}

//2

Welcome. In this kata, you are asked to square every digit of a number and concatenate them.

For example, if we run 9119 through the function, 811181 will come out, because 92 is 81 and 12 is 1. (81-1-1-81)
function squareDigits(n) {
  return +([...String(n)].map(d => d ** 2).join(''));
}

console.log(squareDigits(9119)); // Вывод: 811181
