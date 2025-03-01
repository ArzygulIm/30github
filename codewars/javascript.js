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