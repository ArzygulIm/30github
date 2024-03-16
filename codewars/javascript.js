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

// Welcome. In this kata, you are asked to square every digit of a number and concatenate them.

// For example, if we run 9119 through the function, 811181 will come out, because 92 is 81 and 12 is 1. (81-1-1-81)
function squareDigits(n) {
  return +([...String(n)].map(d => d ** 2).join(''));
}

//3
// Alex just got a new hula hoop, he loves it but feels discouraged because his little brother is better than him.

// Write a program where Alex can input (n) how many times the hoop goes round and it will return him an encouraging message:
// If Alex gets 10 or more hoops, return the string "Great, now move on to tricks".
// If he doesn't get 10 hoops, return the string "Keep at it until you get it".

const hoopCount = (n) => n >= 10
     ? 'Great, now move on to tricks'
     : 'Keep at it until you get it';

//4

// Complete the function that takes a non-negative integer n as input, and returns a list of all the powers of 2 with the exponent ranging from 0 to n ( inclusive ).

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

//5

// Simple, given a string of words, return the length of the shortest word(s).
// String will never be empty and you do not need to account for different data types.

function findShort(s){
  let arr=s.split(' ')
  let min=s.length
  for( i of arr){
    if( i.length<min){
      min=i.length
    }
  }
  return min
}

function findShort(s){
    return Math.min(...s.split(" ").map (s => s.length));
}

function findShort(s){
  return Math.min.apply(null, s.split(' ').map(w => w.length));
}

const findShort = (s) => s
  .split(' ')
  .sort((a, b) => b.length - a.length)
  .pop()
  .length;

//6
// Create a function finalGrade, which calculates the final grade of a student depending on two parameters: a grade for the exam and a number of completed projects.
// This function should take two arguments: exam - grade for exam (from 0 to 100); projects - number of completed projects (from 0 and above);
// This function should return a number (final grade). There are four types of final grades:
// 100, if a grade for the exam is more than 90 or if a number of completed projects more than 10.
// 90, if a grade for the exam is more than 75 and if a number of completed projects is minimum 5.
// 75, if a grade for the exam is more than 50 and if a number of completed projects is minimum 2.
// 0, in other cases


function finalGrade(exam, projects) {
  if (exam > 90 || projects > 10) return 100;  
  if (exam > 75 && projects >= 5) return 90;  
  if (exam > 50 && projects >= 2) return 75;  
  return 0;                                    
}

//7
// You will be given a number and you will need to return it as a string in Expanded Form. For example:
//    12 --> "10 + 2"
//    45 --> "40 + 5"
// 70304 --> "70000 + 300 + 4"
// NOTE: All numbers will be whole numbers greater than 0.

function expandedForm(num) {
  return String(num)
    .split('')
    .map((digit, index, arr) => digit !== '0' ? digit + '0'.repeat(arr.length - index - 1) : '')
    .filter(Boolean)
    .join(' + ');
}

//8
// Complete the solution so that it reverses the string passed into it.

// 'world'  =>  'dlrow'
// 'word'   =>  'drow'

function solution(str){
  return str.split('').reverse().join('')
}

//9
// The number 89 is the first integer with more than one digit that fulfills the property partially introduced in the title of this kata. What's the use of saying "Eureka"? Because this sum gives the same number: 
// 89 = 8^1 + 9^2
// The next number in having this property is 135
// See this property again: 
// 135 =1^1+3^2+5^3

function sumDigPow(a, b) {
  let arr = [];
  for (let i = a; i <= b; i++) {
    if (i === i.toString().split('').reduce((sum, digit, index) => sum + Math.pow(Number(digit), index + 1), 0)) {
      arr.push(i);
    }
  }
  return arr;
}


function filterFunc(n) {
  return `${n}`.split("").map((x, i) => x ** (i+1)).reduce((a, b) => a+b) == n;
}

function *range(a, b) {
  for (var i = a; i <= b; ++i) yield i;
}

function sumDigPow(a, b) {
  return Array.from(range(a, b)).filter(filterFunc);
}

