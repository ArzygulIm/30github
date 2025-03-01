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

//3
Alex just got a new hula hoop, he loves it but feels discouraged because his little brother is better than him.

Write a program where Alex can input (n) how many times the hoop goes round and it will return him an encouraging message:

If Alex gets 10 or more hoops, return the string "Great, now move on to tricks".
If he doesn't get 10 hoops, return the string "Keep at it until you get it".

const hoopCount = (n) => n >= 10
     ? 'Great, now move on to tricks'
     : 'Keep at it until you get it';

//4

Complete the function that takes a non-negative integer n as input, and returns a list of all the powers of 2 with the exponent ranging from 0 to n ( inclusive ).

function powersOfTwo(n){
  let arr=[]
  for (let i =0; i<=n; i++){
    arr.push(2**i)
  }
  return arr
}

function powersOfTwo(n) {
  return [...Array(n + 1)].map((_, i) => 2 ** i)
}

function powersOfTwo(n) {
  return Array.from({length: n + 1}, (v, k) => 2 ** k);
}

