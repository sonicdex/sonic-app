export default () => {
  Number.prototype.toFixed = function (n) {
    if (n > 20 || n < 0) {
      throw new RangeError(
        'toFixed() digits argument must be between 0 and 20'
      );
    }

    const number = this;

    if (isNaN(number) || number >= Math.pow(10, 21)) {
      return number.toString();
    }

    if (typeof n == 'undefined' || n == 0) {
      return Math.round(number).toString();
    }

    let result = number.toString();
    const arr = result.split('.');

    // In the case of integers

    if (arr.length < 2) {
      result += '.';

      for (let i = 0; i < n; i += 1) {
        result += '0';
      }

      return result;
    }

    const integer = arr[0];
    const decimal = arr[1];

    if (decimal.length == n) {
      return result;
    }

    if (decimal.length < n) {
      for (let i = 0; i < n - decimal.length; i += 1) {
        result += '0';
      }

      return result;
    }

    result = integer + '.' + decimal.substr(0, n);
    const last = decimal.substr(n, 1);

    // Round, convert to integer and then process, avoid the loss of floating-point precision

    if (parseInt(last, 10) >= 5) {
      const x = Math.pow(10, n);
      result = (Math.round(parseFloat(result) * x) + 1) / x;
      result = result.toFixed(n);
    }

    return result;
  };
};
