// Lesson: Writing your first tests
export function max(a, b) {
  if (a > b) return a;
  else if (b > a) return b;
  return a;
}

// Exercise
export function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return n.toString();
}

export function calculateAverage(arr) {
  if (arr.length >= 1) {
    return arr.reduce((acc, el) => acc + el, 0) / arr.length;
  }
  return NaN;
}

export function factorial(n) {
  if (n < 0) return undefined;
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
