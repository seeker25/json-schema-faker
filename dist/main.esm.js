import $RefParser from 'json-schema-ref-parser';
import { JSONPath } from 'jsonpath-plus';

/**
 * This class defines a registry for custom formats used within JSF.
 */
var Registry = function Registry() {
  // empty by default
  this.data = {};
};

/**
 * Unregisters custom format(s)
 * @param name
 */
Registry.prototype.unregister = function unregister (name) {
  if (!name) {
    this.data = {};
  } else {
    delete this.data[name];
  }
};

/**
 * Registers custom format
 */
Registry.prototype.register = function register (name, callback) {
  this.data[name] = callback;
};

/**
 * Register many formats at one shot
 */
Registry.prototype.registerMany = function registerMany (formats) {
    var this$1 = this;

  Object.keys(formats).forEach(function (name) {
    this$1.data[name] = formats[name];
  });
};

/**
 * Returns element by registry key
 */
Registry.prototype.get = function get (name) {
  var format = this.data[name];

  return format;
};

/**
 * Returns the whole registry content
 */
Registry.prototype.list = function list () {
  return this.data;
};

var defaults = {};

defaults.defaultInvalidTypeProduct = undefined;
defaults.defaultRandExpMax = 10;

defaults.ignoreProperties = [];
defaults.ignoreMissingRefs = false;
defaults.failOnInvalidTypes = true;
defaults.failOnInvalidFormat = true;

defaults.alwaysFakeOptionals = false;
defaults.optionalsProbability = null;
defaults.fixedProbabilities = false;
defaults.useExamplesValue = false;
defaults.useDefaultValue = false;
defaults.requiredOnly = false;

defaults.minItems = 0;
defaults.maxItems = null;
defaults.minLength = 0;
defaults.maxLength = null;

defaults.resolveJsonPath = false;
defaults.reuseProperties = false;
defaults.fillProperties = true;
defaults.replaceEmptyByRandomValue = false;

defaults.random = Math.random;

defaults.renderTitle = true;
defaults.renderDescription = true;
defaults.renderComment = false;

/**
 * This class defines a registry for custom settings used within JSF.
 */
var OptionRegistry = /*@__PURE__*/(function (Registry) {
  function OptionRegistry() {
    Registry.call(this);
    this.data = Object.assign({}, defaults);
    this._defaults = defaults;
  }

  if ( Registry ) OptionRegistry.__proto__ = Registry;
  OptionRegistry.prototype = Object.create( Registry && Registry.prototype );
  OptionRegistry.prototype.constructor = OptionRegistry;

  var prototypeAccessors = { defaults: { configurable: true } };

  prototypeAccessors.defaults.get = function () {
    return Object.assign({}, this._defaults);
  };

  Object.defineProperties( OptionRegistry.prototype, prototypeAccessors );

  return OptionRegistry;
}(Registry));

// instantiate
var registry = new OptionRegistry();

/**
 * Custom option API
 *
 * @param nameOrOptionMap
 * @returns {any}
 */
function optionAPI(nameOrOptionMap, optionalValue) {
  if (typeof nameOrOptionMap === 'string') {
    if (typeof optionalValue !== 'undefined') {
      return registry.register(nameOrOptionMap, optionalValue);
    }

    return registry.get(nameOrOptionMap);
  }

  return registry.registerMany(nameOrOptionMap);
}

optionAPI.getDefaults = function () { return registry.defaults; };

var ALLOWED_TYPES = ['integer', 'number', 'string', 'boolean'];
var SCALAR_TYPES = ALLOWED_TYPES.concat(['null']);
var ALL_TYPES = ['array', 'object'].concat(SCALAR_TYPES);

var MOST_NEAR_DATETIME = 2524608000000;

var MIN_INTEGER = -100000000;
var MAX_INTEGER = 100000000;

var MIN_NUMBER = -100;
var MAX_NUMBER = 100;

var env = {
  ALLOWED_TYPES: ALLOWED_TYPES,
  SCALAR_TYPES: SCALAR_TYPES,
  ALL_TYPES: ALL_TYPES,
  MIN_NUMBER: MIN_NUMBER,
  MAX_NUMBER: MAX_NUMBER,
  MIN_INTEGER: MIN_INTEGER,
  MAX_INTEGER: MAX_INTEGER,
  MOST_NEAR_DATETIME: MOST_NEAR_DATETIME,
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var types = {
  ROOT       : 0,
  GROUP      : 1,
  POSITION   : 2,
  SET        : 3,
  RANGE      : 4,
  REPETITION : 5,
  REFERENCE  : 6,
  CHAR       : 7,
};

const INTS = () => [{ type: types.RANGE , from: 48, to: 57 }];

const WORDS = () => {
  return [
    { type: types.CHAR, value: 95 },
    { type: types.RANGE, from: 97, to: 122 },
    { type: types.RANGE, from: 65, to: 90 }
  ].concat(INTS());
};

const WHITESPACE = () => {
  return [
    { type: types.CHAR, value: 9 },
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 11 },
    { type: types.CHAR, value: 12 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 32 },
    { type: types.CHAR, value: 160 },
    { type: types.CHAR, value: 5760 },
    { type: types.RANGE, from: 8192, to: 8202 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 },
    { type: types.CHAR, value: 8239 },
    { type: types.CHAR, value: 8287 },
    { type: types.CHAR, value: 12288 },
    { type: types.CHAR, value: 65279 }
  ];
};

const NOTANYCHAR = () => {
  return [
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 },
  ];
};

// Predefined class objects.
var words = () => ({ type: types.SET, set: WORDS(), not: false });
var notWords = () => ({ type: types.SET, set: WORDS(), not: true });
var ints = () => ({ type: types.SET, set: INTS(), not: false });
var notInts = () => ({ type: types.SET, set: INTS(), not: true });
var whitespace = () => ({ type: types.SET, set: WHITESPACE(), not: false });
var notWhitespace = () => ({ type: types.SET, set: WHITESPACE(), not: true });
var anyChar = () => ({ type: types.SET, set: NOTANYCHAR(), not: true });

var sets = {
	words: words,
	notWords: notWords,
	ints: ints,
	notInts: notInts,
	whitespace: whitespace,
	notWhitespace: notWhitespace,
	anyChar: anyChar
};

var util = createCommonjsModule(function (module, exports) {
const CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?';
const SLSH = { '0': 0, 't': 9, 'n': 10, 'v': 11, 'f': 12, 'r': 13 };

/**
 * Finds character representations in str and convert all to
 * their respective characters
 *
 * @param {String} str
 * @return {String}
 */
exports.strToChars = function(str) {
  /* jshint maxlen: false */
  var chars_regex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
  str = str.replace(chars_regex, function(s, b, lbs, a16, b16, c8, dctrl, eslsh) {
    if (lbs) {
      return s;
    }

    var code = b ? 8 :
      a16   ? parseInt(a16, 16) :
      b16   ? parseInt(b16, 16) :
      c8    ? parseInt(c8,   8) :
      dctrl ? CTRL.indexOf(dctrl) :
      SLSH[eslsh];

    var c = String.fromCharCode(code);

    // Escape special regex characters.
    if (/[[\]{}^$.|?*+()]/.test(c)) {
      c = '\\' + c;
    }

    return c;
  });

  return str;
};


/**
 * turns class into tokens
 * reads str until it encounters a ] not preceeded by a \
 *
 * @param {String} str
 * @param {String} regexpStr
 * @return {Array.<Array.<Object>, Number>}
 */
exports.tokenizeClass = (str, regexpStr) => {
  /* jshint maxlen: false */
  var tokens = [];
  var regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;
  var rs, c;


  while ((rs = regexp.exec(str)) != null) {
    if (rs[1]) {
      tokens.push(sets.words());

    } else if (rs[2]) {
      tokens.push(sets.ints());

    } else if (rs[3]) {
      tokens.push(sets.whitespace());

    } else if (rs[4]) {
      tokens.push(sets.notWords());

    } else if (rs[5]) {
      tokens.push(sets.notInts());

    } else if (rs[6]) {
      tokens.push(sets.notWhitespace());

    } else if (rs[7]) {
      tokens.push({
        type: types.RANGE,
        from: (rs[8] || rs[9]).charCodeAt(0),
        to: rs[10].charCodeAt(0),
      });

    } else if ((c = rs[12])) {
      tokens.push({
        type: types.CHAR,
        value: c.charCodeAt(0),
      });

    } else {
      return [tokens, regexp.lastIndex];
    }
  }

  exports.error(regexpStr, 'Unterminated character class');
};


/**
 * Shortcut to throw errors.
 *
 * @param {String} regexp
 * @param {String} msg
 */
exports.error = (regexp, msg) => {
  throw new SyntaxError('Invalid regular expression: /' + regexp + '/: ' + msg);
};
});
util.strToChars;
util.tokenizeClass;
util.error;

var wordBoundary = () => ({ type: types.POSITION, value: 'b' });
var nonWordBoundary = () => ({ type: types.POSITION, value: 'B' });
var begin = () => ({ type: types.POSITION, value: '^' });
var end = () => ({ type: types.POSITION, value: '$' });

var positions = {
	wordBoundary: wordBoundary,
	nonWordBoundary: nonWordBoundary,
	begin: begin,
	end: end
};

var lib = (regexpStr) => {
  var i = 0, l, c,
    start = { type: types.ROOT, stack: []},

    // Keep track of last clause/group and stack.
    lastGroup = start,
    last = start.stack,
    groupStack = [];


  var repeatErr = (i) => {
    util.error(regexpStr, `Nothing to repeat at column ${i - 1}`);
  };

  // Decode a few escaped characters.
  var str = util.strToChars(regexpStr);
  l = str.length;

  // Iterate through each character in string.
  while (i < l) {
    c = str[i++];

    switch (c) {
      // Handle escaped characters, inclues a few sets.
      case '\\':
        c = str[i++];

        switch (c) {
          case 'b':
            last.push(positions.wordBoundary());
            break;

          case 'B':
            last.push(positions.nonWordBoundary());
            break;

          case 'w':
            last.push(sets.words());
            break;

          case 'W':
            last.push(sets.notWords());
            break;

          case 'd':
            last.push(sets.ints());
            break;

          case 'D':
            last.push(sets.notInts());
            break;

          case 's':
            last.push(sets.whitespace());
            break;

          case 'S':
            last.push(sets.notWhitespace());
            break;

          default:
            // Check if c is integer.
            // In which case it's a reference.
            if (/\d/.test(c)) {
              last.push({ type: types.REFERENCE, value: parseInt(c, 10) });

            // Escaped character.
            } else {
              last.push({ type: types.CHAR, value: c.charCodeAt(0) });
            }
        }

        break;


      // Positionals.
      case '^':
        last.push(positions.begin());
        break;

      case '$':
        last.push(positions.end());
        break;


      // Handle custom sets.
      case '[':
        // Check if this class is 'anti' i.e. [^abc].
        var not;
        if (str[i] === '^') {
          not = true;
          i++;
        } else {
          not = false;
        }

        // Get all the characters in class.
        var classTokens = util.tokenizeClass(str.slice(i), regexpStr);

        // Increase index by length of class.
        i += classTokens[1];
        last.push({
          type: types.SET,
          set: classTokens[0],
          not,
        });

        break;


      // Class of any character except \n.
      case '.':
        last.push(sets.anyChar());
        break;


      // Push group onto stack.
      case '(':
        // Create group.
        var group = {
          type: types.GROUP,
          stack: [],
          remember: true,
        };

        c = str[i];

        // If if this is a special kind of group.
        if (c === '?') {
          c = str[i + 1];
          i += 2;

          // Match if followed by.
          if (c === '=') {
            group.followedBy = true;

          // Match if not followed by.
          } else if (c === '!') {
            group.notFollowedBy = true;

          } else if (c !== ':') {
            util.error(regexpStr,
              `Invalid group, character '${c}'` +
              ` after '?' at column ${i - 1}`);
          }

          group.remember = false;
        }

        // Insert subgroup into current group stack.
        last.push(group);

        // Remember the current group for when the group closes.
        groupStack.push(lastGroup);

        // Make this new group the current group.
        lastGroup = group;
        last = group.stack;
        break;


      // Pop group out of stack.
      case ')':
        if (groupStack.length === 0) {
          util.error(regexpStr, `Unmatched ) at column ${i - 1}`);
        }
        lastGroup = groupStack.pop();

        // Check if this group has a PIPE.
        // To get back the correct last stack.
        last = lastGroup.options ?
          lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
        break;


      // Use pipe character to give more choices.
      case '|':
        // Create array where options are if this is the first PIPE
        // in this clause.
        if (!lastGroup.options) {
          lastGroup.options = [lastGroup.stack];
          delete lastGroup.stack;
        }

        // Create a new stack and add to options for rest of clause.
        var stack = [];
        lastGroup.options.push(stack);
        last = stack;
        break;


      // Repetition.
      // For every repetition, remove last element from last stack
      // then insert back a RANGE object.
      // This design is chosen because there could be more than
      // one repetition symbols in a regex i.e. `a?+{2,3}`.
      case '{':
        var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)), min, max;
        if (rs !== null) {
          if (last.length === 0) {
            repeatErr(i);
          }
          min = parseInt(rs[1], 10);
          max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
          i += rs[0].length;

          last.push({
            type: types.REPETITION,
            min,
            max,
            value: last.pop(),
          });
        } else {
          last.push({
            type: types.CHAR,
            value: 123,
          });
        }
        break;

      case '?':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 0,
          max: 1,
          value: last.pop(),
        });
        break;

      case '+':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 1,
          max: Infinity,
          value: last.pop(),
        });
        break;

      case '*':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 0,
          max: Infinity,
          value: last.pop(),
        });
        break;


      // Default is a character that is not `\[](){}?+*^$`.
      default:
        last.push({
          type: types.CHAR,
          value: c.charCodeAt(0),
        });
    }

  }

  // Check if any groups have not been closed.
  if (groupStack.length !== 0) {
    util.error(regexpStr, 'Unterminated group');
  }

  return start;
};

var types_1 = types;
lib.types = types_1;

/* eslint indent: 4 */


// Private helper class
class SubRange {
    constructor(low, high) {
        this.low = low;
        this.high = high;
        this.length = 1 + high - low;
    }

    overlaps(range) {
        return !(this.high < range.low || this.low > range.high);
    }

    touches(range) {
        return !(this.high + 1 < range.low || this.low - 1 > range.high);
    }

    // Returns inclusive combination of SubRanges as a SubRange.
    add(range) {
        return new SubRange(
            Math.min(this.low, range.low),
            Math.max(this.high, range.high)
        );
    }

    // Returns subtraction of SubRanges as an array of SubRanges.
    // (There's a case where subtraction divides it in 2)
    subtract(range) {
        if (range.low <= this.low && range.high >= this.high) {
            return [];
        } else if (range.low > this.low && range.high < this.high) {
            return [
                new SubRange(this.low, range.low - 1),
                new SubRange(range.high + 1, this.high)
            ];
        } else if (range.low <= this.low) {
            return [new SubRange(range.high + 1, this.high)];
        } else {
            return [new SubRange(this.low, range.low - 1)];
        }
    }

    toString() {
        return this.low == this.high ?
            this.low.toString() : this.low + '-' + this.high;
    }
}


class DRange {
    constructor(a, b) {
        this.ranges = [];
        this.length = 0;
        if (a != null) this.add(a, b);
    }

    _update_length() {
        this.length = this.ranges.reduce((previous, range) => {
            return previous + range.length;
        }, 0);
    }

    add(a, b) {
        var _add = (subrange) => {
            var i = 0;
            while (i < this.ranges.length && !subrange.touches(this.ranges[i])) {
                i++;
            }
            var newRanges = this.ranges.slice(0, i);
            while (i < this.ranges.length && subrange.touches(this.ranges[i])) {
                subrange = subrange.add(this.ranges[i]);
                i++;
            }
            newRanges.push(subrange);
            this.ranges = newRanges.concat(this.ranges.slice(i));
            this._update_length();
        };

        if (a instanceof DRange) {
            a.ranges.forEach(_add);
        } else {
            if (b == null) b = a;
            _add(new SubRange(a, b));
        }
        return this;
    }

    subtract(a, b) {
        var _subtract = (subrange) => {
            var i = 0;
            while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
                i++;
            }
            var newRanges = this.ranges.slice(0, i);
            while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
                newRanges = newRanges.concat(this.ranges[i].subtract(subrange));
                i++;
            }
            this.ranges = newRanges.concat(this.ranges.slice(i));
            this._update_length();
        };

        if (a instanceof DRange) {
            a.ranges.forEach(_subtract);
        } else {
            if (b == null) b = a;
            _subtract(new SubRange(a, b));
        }
        return this;
    }

    intersect(a, b) {
        var newRanges = [];
        var _intersect = (subrange) => {
            var i = 0;
            while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
                i++;
            }
            while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
                var low = Math.max(this.ranges[i].low, subrange.low);
                var high = Math.min(this.ranges[i].high, subrange.high);
                newRanges.push(new SubRange(low, high));
                i++;
            }
        };

        if (a instanceof DRange) {
            a.ranges.forEach(_intersect);
        } else {
            if (b == null) b = a;
            _intersect(new SubRange(a, b));
        }
        this.ranges = newRanges;
        this._update_length();
        return this;
    }

    index(index) {
        var i = 0;
        while (i < this.ranges.length && this.ranges[i].length <= index) {
            index -= this.ranges[i].length;
            i++;
        }
        return this.ranges[i].low + index;
    }

    toString() {
        return '[ ' + this.ranges.join(', ') + ' ]';
    }

    clone() {
        return new DRange(this);
    }

    numbers() {
        return this.ranges.reduce((result, subrange) => {
            var i = subrange.low;
            while (i <= subrange.high) {
                result.push(i);
                i++;
            }
            return result;
        }, []);
    }

    subranges() {
        return this.ranges.map((subrange) => ({
            low: subrange.low,
            high: subrange.high,
            length: 1 + subrange.high - subrange.low
        }));
    }
}

var lib$1 = DRange;

const types$1  = lib.types;


var randexp = class RandExp {
  /**
   * @constructor
   * @param {RegExp|String} regexp
   * @param {String} m
   */
  constructor(regexp, m) {
    this._setDefaults(regexp);
    if (regexp instanceof RegExp) {
      this.ignoreCase = regexp.ignoreCase;
      this.multiline = regexp.multiline;
      regexp = regexp.source;

    } else if (typeof regexp === 'string') {
      this.ignoreCase = m && m.indexOf('i') !== -1;
      this.multiline = m && m.indexOf('m') !== -1;
    } else {
      throw new Error('Expected a regexp or string');
    }

    this.tokens = lib(regexp);
  }


  /**
   * Checks if some custom properties have been set for this regexp.
   *
   * @param {RandExp} randexp
   * @param {RegExp} regexp
   */
  _setDefaults(regexp) {
    // When a repetitional token has its max set to Infinite,
    // randexp won't actually generate a random amount between min and Infinite
    // instead it will see Infinite as min + 100.
    this.max = regexp.max != null ? regexp.max :
      RandExp.prototype.max != null ? RandExp.prototype.max : 100;

    // This allows expanding to include additional characters
    // for instance: RandExp.defaultRange.add(0, 65535);
    this.defaultRange = regexp.defaultRange ?
      regexp.defaultRange : this.defaultRange.clone();

    if (regexp.randInt) {
      this.randInt = regexp.randInt;
    }
  }


  /**
   * Generates the random string.
   *
   * @return {String}
   */
  gen() {
    return this._gen(this.tokens, []);
  }


  /**
   * Generate random string modeled after given tokens.
   *
   * @param {Object} token
   * @param {Array.<String>} groups
   * @return {String}
   */
  _gen(token, groups) {
    var stack, str, n, i, l;

    switch (token.type) {
      case types$1.ROOT:
      case types$1.GROUP:
        // Ignore lookaheads for now.
        if (token.followedBy || token.notFollowedBy) { return ''; }

        // Insert placeholder until group string is generated.
        if (token.remember && token.groupNumber === undefined) {
          token.groupNumber = groups.push(null) - 1;
        }

        stack = token.options ?
          this._randSelect(token.options) : token.stack;

        str = '';
        for (i = 0, l = stack.length; i < l; i++) {
          str += this._gen(stack[i], groups);
        }

        if (token.remember) {
          groups[token.groupNumber] = str;
        }
        return str;

      case types$1.POSITION:
        // Do nothing for now.
        return '';

      case types$1.SET:
        var expandedSet = this._expand(token);
        if (!expandedSet.length) { return ''; }
        return String.fromCharCode(this._randSelect(expandedSet));

      case types$1.REPETITION:
        // Randomly generate number between min and max.
        n = this.randInt(token.min,
          token.max === Infinity ? token.min + this.max : token.max);

        str = '';
        for (i = 0; i < n; i++) {
          str += this._gen(token.value, groups);
        }

        return str;

      case types$1.REFERENCE:
        return groups[token.value - 1] || '';

      case types$1.CHAR:
        var code = this.ignoreCase && this._randBool() ?
          this._toOtherCase(token.value) : token.value;
        return String.fromCharCode(code);
    }
  }


  /**
   * If code is alphabetic, converts to other case.
   * If not alphabetic, returns back code.
   *
   * @param {Number} code
   * @return {Number}
   */
  _toOtherCase(code) {
    return code + (97 <= code && code <= 122 ? -32 :
      65 <= code && code <= 90  ?  32 : 0);
  }


  /**
   * Randomly returns a true or false value.
   *
   * @return {Boolean}
   */
  _randBool() {
    return !this.randInt(0, 1);
  }


  /**
   * Randomly selects and returns a value from the array.
   *
   * @param {Array.<Object>} arr
   * @return {Object}
   */
  _randSelect(arr) {
    if (arr instanceof lib$1) {
      return arr.index(this.randInt(0, arr.length - 1));
    }
    return arr[this.randInt(0, arr.length - 1)];
  }


  /**
   * expands a token to a DiscontinuousRange of characters which has a
   * length and an index function (for random selecting)
   *
   * @param {Object} token
   * @return {DiscontinuousRange}
   */
  _expand(token) {
    if (token.type === lib.types.CHAR) {
      return new lib$1(token.value);
    } else if (token.type === lib.types.RANGE) {
      return new lib$1(token.from, token.to);
    } else {
      let drange = new lib$1();
      for (let i = 0; i < token.set.length; i++) {
        let subrange = this._expand(token.set[i]);
        drange.add(subrange);
        if (this.ignoreCase) {
          for (let j = 0; j < subrange.length; j++) {
            let code = subrange.index(j);
            let otherCaseCode = this._toOtherCase(code);
            if (code !== otherCaseCode) {
              drange.add(otherCaseCode);
            }
          }
        }
      }
      if (token.not) {
        return this.defaultRange.clone().subtract(drange);
      } else {
        return this.defaultRange.clone().intersect(drange);
      }
    }
  }


  /**
   * Randomly generates and returns a number between a and b (inclusive).
   *
   * @param {Number} a
   * @param {Number} b
   * @return {Number}
   */
  randInt(a, b) {
    return a + Math.floor(Math.random() * (1 + b - a));
  }


  /**
   * Default range of characters to generate from.
   */
  get defaultRange() {
    return this._range = this._range || new lib$1(32, 126);
  }

  set defaultRange(range) {
    this._range = range;
  }


  /**
   *
   * Enables use of randexp with a shorter call.
   *
   * @param {RegExp|String| regexp}
   * @param {String} m
   * @return {String}
   */
  static randexp(regexp, m) {
    var randexp;
    if(typeof regexp === 'string') {
      regexp = new RegExp(regexp, m);
    }

    if (regexp._randexp === undefined) {
      randexp = new RandExp(regexp, m);
      regexp._randexp = randexp;
    } else {
      randexp = regexp._randexp;
      randexp._setDefaults(regexp);
    }
    return randexp.gen();
  }


  /**
   * Enables sugary /regexp/.gen syntax.
   */
  static sugar() {
    /* eshint freeze:false */
    RegExp.prototype.gen = function() {
      return RandExp.randexp(this);
    };
  }
};

function getRandomInteger(min, max) {
  min = typeof min === 'undefined' ? env.MIN_INTEGER : min;
  max = typeof max === 'undefined' ? env.MAX_INTEGER : max;

  return Math.floor(optionAPI('random')() * ((max - min) + 1)) + min;
}

function _randexp(value) {
  // set maximum default, see #193
  randexp.prototype.max = optionAPI('defaultRandExpMax');

  // same implementation as the original except using our random
  randexp.prototype.randInt = function (a, b) { return a + Math.floor(optionAPI('random')() * (1 + (b - a))); };

  var re = new randexp(value);

  return re.gen();
}

/**
 * Returns random element of a collection
 *
 * @param collection
 * @returns {T}
 */
function pick(collection) {
  return collection[Math.floor(optionAPI('random')() * collection.length)];
}

/**
 * Returns shuffled collection of elements
 *
 * @param collection
 * @returns {T[]}
 */
function shuffle(collection) {
  var tmp;
  var key;
  var length = collection.length;

  var copy = collection.slice();

  for (; length > 0;) {
    key = Math.floor(optionAPI('random')() * length);
    // swap
    length -= 1;
    tmp = copy[length];
    copy[length] = copy[key];
    copy[key] = tmp;
  }

  return copy;
}


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * @see http://stackoverflow.com/a/1527820/769384
 */
function getRandom(min, max) {
  return (optionAPI('random')() * (max - min)) + min;
}

/**
 * Generates random number according to parameters passed
 *
 * @param min
 * @param max
 * @param defMin
 * @param defMax
 * @param hasPrecision
 * @returns {number}
 */
function number(min, max, defMin, defMax, hasPrecision) {
  if ( hasPrecision === void 0 ) hasPrecision = false;

  defMin = typeof defMin === 'undefined' ? env.MIN_NUMBER : defMin;
  defMax = typeof defMax === 'undefined' ? env.MAX_NUMBER : defMax;

  min = typeof min === 'undefined' ? defMin : min;
  max = typeof max === 'undefined' ? defMax : max;

  if (max < min) {
    max += min;
  }

  if (hasPrecision) {
    return getRandom(min, max);
  }

  return getRandomInteger(min, max);
}

function by(type) {
  switch (type) {
    case 'seconds':
      return number(0, 60) * 60;

    case 'minutes':
      return number(15, 50) * 612;

    case 'hours':
      return number(12, 72) * 36123;

    case 'days':
      return number(7, 30) * 86412345;

    case 'weeks':
      return number(4, 52) * 604812345;

    case 'months':
      return number(2, 13) * 2592012345;

    case 'years':
      return number(1, 20) * 31104012345;
  }
}

function date(step) {
  if (step) {
    return by(step);
  }

  var now = new Date();
  var days = number(-1000, env.MOST_NEAR_DATETIME);

  now.setTime(now.getTime() - days);

  return now;
}

var random = {
  pick: pick,
  date: date,
  shuffle: shuffle,
  number: number,
  randexp: _randexp,
};

function getLocalRef(obj, path) {
  var keyElements = path.replace(/^.*#\//, '').split('/');

  while (keyElements.length) {
    var prop = keyElements.shift();

    if (!obj[prop]) {
      throw new Error(("Prop '" + prop + "' not found in [" + (Object.keys(obj).join(', ')) + "] (" + path + ")"));
    }

    obj = obj[prop];
  }
  return obj;
}

/**
 * Returns true/false whether the object parameter has its own properties defined
 *
 * @param obj
 * @param properties
 * @returns {boolean}
 */
function hasProperties(obj) {
  var properties = [], len = arguments.length - 1;
  while ( len-- > 0 ) properties[ len ] = arguments[ len + 1 ];

  return properties.filter(function (key) {
    return typeof obj[key] !== 'undefined';
  }).length > 0;
}

/**
 * Returns typecasted value.
 * External generators (faker, chance, casual) may return data in non-expected formats, such as string, when you might expect an
 * integer. This function is used to force the typecast. This is the base formatter for all result values.
 *
 * @param type
 * @param schema
 * @param callback
 * @returns {any}
 */
function typecast(type, schema, callback) {
  var params = {};

  // normalize constraints
  switch (type || schema.type) {
    case 'integer':
    case 'number':
      if (typeof schema.minimum !== 'undefined') {
        params.minimum = schema.minimum;
      }

      if (typeof schema.maximum !== 'undefined') {
        params.maximum = schema.maximum;
      }

      if (schema.enum) {
        var min = Math.max(params.minimum || 0, 0);
        var max = Math.min(params.maximum || Infinity, Infinity);

        if (schema.exclusiveMinimum && min === schema.minimum) {
          min += schema.multipleOf || 1;
        }

        if (schema.exclusiveMaximum && max === schema.maximum) {
          max -= schema.multipleOf || 1;
        }

        // discard out-of-bounds enumerations
        if (min || max !== Infinity) {
          schema.enum = schema.enum.filter(function (x) {
            if (x >= min && x <= max) {
              return true;
            }

            return false;
          });
        }
      }

      break;

    case 'string': {
      params.minLength = optionAPI('minLength') || 0;
      params.maxLength = optionAPI('maxLength') || Number.MAX_SAFE_INTEGER;

      if (typeof schema.minLength !== 'undefined') {
        params.minLength = Math.max(params.minLength, schema.minLength);
      }

      if (typeof schema.maxLength !== 'undefined') {
        params.maxLength = Math.min(params.maxLength, schema.maxLength);
      }

      break;
    }
  }

  // execute generator
  var value = callback(params);

  // allow null values to be returned
  if (value === null || value === undefined) {
    return null;
  }

  // normalize output value
  switch (type || schema.type) {
    case 'number':
      value = parseFloat(value);
      break;

    case 'integer':
      value = parseInt(value, 10);
      break;

    case 'boolean':
      value = !!value;
      break;

    case 'string': {
      value = String(value);

      var min$1 = Math.max(params.minLength || 0, 0);
      var max$1 = Math.min(params.maxLength || Infinity, Infinity);

      var prev;

      while (value.length < min$1) {
        prev = value;

        if (!schema.pattern) {
          value += "" + (random.pick([' ', '/', '_', '-', '+', '=', '@', '^'])) + value;
        } else {
          value += random.randexp(schema.pattern);
        }

        // avoid infinite-loops while filling strings, if no changes
        // are made we just break the loop... see #540
        if (value === prev) { break; }
      }

      if (value.length > max$1) {
        value = value.substr(0, max$1);
      }

      switch (schema.format) {
        case 'date-time':
        case 'datetime':
          value = new Date(clampDate(value)).toISOString().replace(/([0-9])0+Z$/, '$1Z');
          break;

        case 'full-date':
        case 'date':
          value = new Date(clampDate(value)).toISOString().substr(0, 10);
          break;

        case 'time':
          value = new Date(("1969-01-01 " + value)).toISOString().substr(11);
          break;
      }
      break;
    }
  }

  return value;
}

function merge(a, b) {
  Object.keys(b).forEach(function (key) {
    if (typeof b[key] !== 'object' || b[key] === null) {
      a[key] = b[key];
    } else if (Array.isArray(b[key])) {
      a[key] = a[key] || [];
      // fix #292 - skip duplicated values from merge object (b)
      b[key].forEach(function (value) {
        if (Array.isArray(a[key]) && a[key].indexOf(value) === -1) {
          a[key].push(value);
        }
      });
    } else if (typeof a[key] !== 'object' || a[key] === null || Array.isArray(a[key])) {
      a[key] = merge({}, b[key]);
    } else {
      a[key] = merge(a[key], b[key]);
    }
  });

  return a;
}

function clone(obj, cache) {
  if ( cache === void 0 ) cache = new Map();

  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (cache.has(obj)) {
    return cache.get(obj);
  }

  if (Array.isArray(obj)) {
    var arr = [];
    cache.set(obj, arr);

    arr.push.apply(arr, obj.map(function (x) { return clone(x, cache); }));
    return arr;
  }

  var clonedObj = {};
  cache.set(obj, clonedObj);

  return Object.keys(obj).reduce(function (prev, cur) {
    prev[cur] = clone(obj[cur], cache);
    return prev;
  }, clonedObj);
}

function short(schema) {
  var s = JSON.stringify(schema);
  var l = JSON.stringify(schema, null, 2);

  return s.length > 400 ? ((l.substr(0, 400)) + "...") : l;
}

function anyValue() {
  return random.pick([
    false,
    true,
    null,
    -1,
    NaN,
    Math.PI,
    Infinity,
    undefined,
    [],
    {},
    // FIXME: use built-in random?
    Math.random(),
    Math.random().toString(36).substr(2) ]);
}

function notValue(schema, parent) {
  var copy = merge({}, parent);

  if (typeof schema.minimum !== 'undefined') {
    copy.maximum = schema.minimum;
    copy.exclusiveMaximum = true;
  }

  if (typeof schema.maximum !== 'undefined') {
    copy.minimum = schema.maximum > copy.maximum ? 0 : schema.maximum;
    copy.exclusiveMinimum = true;
  }

  if (typeof schema.minLength !== 'undefined') {
    copy.maxLength = schema.minLength;
  }

  if (typeof schema.maxLength !== 'undefined') {
    copy.minLength = schema.maxLength > copy.maxLength ? 0 : schema.maxLength;
  }

  if (schema.type) {
    copy.type = random.pick(env.SCALAR_TYPES.filter(function (x) {
      var types = Array.isArray(schema.type) ? schema.type : [schema.type];

      return types.every(function (type) {
        // treat both types as _similar enough_ to be skipped equal
        if (x === 'number' || x === 'integer') {
          return type !== 'number' && type !== 'integer';
        }

        return x !== type;
      });
    }));
  } else if (schema.enum) {
    var value;

    do {
      value = anyValue();
    } while (schema.enum.indexOf(value) !== -1);

    copy.enum = [value];
  }

  if (schema.required && copy.properties) {
    schema.required.forEach(function (prop) {
      delete copy.properties[prop];
    });
  }

  // TODO: explore more scenarios

  return copy;
}

function validateValueForSchema(value, schema) {
  var schemaHasMin = schema.minimum !== undefined;
  var schemaHasMax = schema.maximum !== undefined;

  return (
    (schemaHasMin || schemaHasMax)
    && (!schemaHasMin || value >= schema.minimum)
    && (!schemaHasMax || value <= schema.maximum)
  );
}

// FIXME: evaluate more constraints?
function validate(value, schemas) {
  return !schemas.every(function (schema) { return validateValueForSchema(value, schema); });
}

function validateValueForOneOf(value, oneOf) {
  var validCount = oneOf.reduce(function (count, schema) { return (count + ((validateValueForSchema(value, schema)) ? 1 : 0)); }, 0);
  return validCount === 1;
}

function isKey(prop) {
  return ['enum', 'const', 'default', 'examples', 'required', 'definitions', 'items', 'properties'].includes(prop);
}

function omitProps(obj, props) {
  return Object.keys(obj)
    .filter(function (key) { return !props.includes(key); })
    .reduce(function (copy, k) {
      if (Array.isArray(obj[k])) {
        copy[k] = obj[k].slice();
      } else {
        copy[k] = obj[k] instanceof Object
          ? merge({}, obj[k])
          : obj[k];
      }

      return copy;
    }, {});
}

function template(value, schema) {
  if (Array.isArray(value)) {
    return value.map(function (x) { return template(x, schema); });
  }

  if (typeof value === 'string') {
    value = value.replace(/#\{([\w.-]+)\}/g, function (_, $1) { return schema[$1]; });
  }

  return value;
}

/**
 * Checks if given object is empty (has no properties)
 *
 * @param value
 * @returns {boolean}
 */
function isEmpty(value) {
  return Object.prototype.toString.call(value) === '[object Object]' && !Object.keys(value).length;
}

/**
 * Checks given key is required or if source object was created by a subroutine (already cleaned)
 *
 * @param key
 * @param schema
 * @returns {boolean}
 */
function shouldClean(key, schema) {
  var isRequired = Array.isArray(schema.required) && schema.required.includes(key);
  var wasCleaned = typeof schema.thunk === 'function' || (schema.additionalProperties && typeof schema.additionalProperties.thunk === 'function');

  return !isRequired && !wasCleaned;
}

/**
 * Cleans up the source object removing empty objects and undefined values
 * Will not remove values which are specified as `required`
 *
 * @param obj
 * @param schema
 * @param isArray
 * @returns {any}
 */
function clean(obj, schema, isArray) {
  if ( isArray === void 0 ) isArray = false;

  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .map(function (value) { return clean(value, schema, true); })
      .filter(function (value) { return typeof value !== 'undefined'; });
  }

  Object.keys(obj).forEach(function (k) {
    if (isEmpty(obj[k])) ; else {
      var value = clean(obj[k], schema);

      if (!isEmpty(value)) {
        obj[k] = value;
      }
    }
    if (typeof obj[k] === 'undefined') {
      delete obj[k];
    }
  });

  if (!Object.keys(obj).length && isArray) {
    return undefined;
  }

  return obj;
}

/**
 * Normalize generated date YYYY-MM-DD to not have
 * out of range values
 *
 * @param value
 * @returns {string}
 */
function clampDate(value) {
  if (value.includes(' ')) {
    return new Date(value).toISOString().substr(0, 10);
  }

  var ref = value.split('T')[0].split('-');
  var year = ref[0];
  var month = ref[1];
  var day = ref[2];

  month = Math.max(1, Math.min(12, month));
  day = Math.max(1, Math.min(31, day));

  return (year + "-" + month + "-" + day);
}

var utils = {
  hasProperties: hasProperties,
  getLocalRef: getLocalRef,
  omitProps: omitProps,
  typecast: typecast,
  merge: merge,
  clone: clone,
  short: short,
  notValue: notValue,
  anyValue: anyValue,
  validate: validate,
  validateValueForSchema: validateValueForSchema,
  validateValueForOneOf: validateValueForOneOf,
  isKey: isKey,
  template: template,
  shouldClean: shouldClean,
  clean: clean,
  isEmpty: isEmpty,
  clampDate: clampDate,
};

// dynamic proxy for custom generators
function proxy(gen) {
  return function (value, schema, property, rootSchema) {
    var fn = value;
    var args = [];

    // support for nested object, first-key is the generator
    if (typeof value === 'object') {
      fn = Object.keys(value)[0];

      // treat the given array as arguments,
      if (Array.isArray(value[fn])) {
        // if the generator is expecting arrays they should be nested, e.g. `[[1, 2, 3], true, ...]`
        args = value[fn];
      } else {
        args.push(value[fn]);
      }
    }

    // support for keypaths, e.g. "internet.email"
    var props = fn.split('.');

    // retrieve a fresh dependency
    var ctx = gen();

    while (props.length > 1) {
      ctx = ctx[props.shift()];
    }

    // retrieve last value from context object
    value = typeof ctx === 'object' ? ctx[props[0]] : ctx;

    // invoke dynamic generators
    if (typeof value === 'function') {
      value = value.apply(ctx, args.map(function (x) { return utils.template(x, rootSchema); }));
    }

    // test for pending callbacks
    if (Object.prototype.toString.call(value) === '[object Object]') {
      Object.keys(value).forEach(function (key) {
        if (typeof value[key] === 'function') {
          throw new Error(("Cannot resolve value for '" + property + ": " + fn + "', given: " + value));
        }
      });
    }

    return value;
  };
}

/**
 * Container is used to wrap external generators (faker, chance, casual, etc.) and its dependencies.
 *
 * - `jsf.extend('faker')` will enhance or define the given dependency.
 * - `jsf.define('faker')` will provide the "faker" keyword support.
 *
 * RandExp is not longer considered an "extension".
 */
var Container = function Container() {
  // dynamic requires - handle all dependencies
  // they will NOT be included on the bundle
  this.registry = {};
  this.support = {};
};

/**
 * Unregister extensions
 * @param name
 */
Container.prototype.reset = function reset (name) {
  if (!name) {
    this.registry = {};
    this.support = {};
  } else {
    delete this.registry[name];
    delete this.support[name];
  }
};

/**
 * Override dependency given by name
 * @param name
 * @param callback
 */
Container.prototype.extend = function extend (name, callback) {
    var this$1 = this;

  this.registry[name] = callback(this.registry[name]);

  // built-in proxy (can be overridden)
  if (!this.support[name]) {
    this.support[name] = proxy(function () { return this$1.registry[name]; });
  }
};

/**
 * Set keyword support by name
 * @param name
 * @param callback
 */
Container.prototype.define = function define (name, callback) {
  this.support[name] = callback;
};

/**
 * Returns dependency given by name
 * @param name
 * @returns {Dependency}
 */
Container.prototype.get = function get (name) {
  if (typeof this.registry[name] === 'undefined') {
    throw new ReferenceError(("'" + name + "' dependency doesn't exist."));
  }
  return this.registry[name];
};

/**
 * Apply a custom keyword
 * @param schema
 */
Container.prototype.wrap = function wrap (schema) {
    var this$1 = this;

  if (!('generate' in schema)) {
    var keys = Object.keys(schema);
    var context = {};

    var length = keys.length;

    var loop = function () { // eslint-disable-line
      var fn = keys[length].replace(/^x-/, '');
      var gen = this$1.support[fn];

      if (typeof gen === 'function') {
        Object.defineProperty(schema, 'generate', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: function (rootSchema, key) { return gen.call(context, schema[keys[length]], schema, keys[length], rootSchema, key.slice()); }, // eslint-disable-line
        });
        return 'break';
      }
    };

      while (length--) {
        var returned = loop();

        if ( returned === 'break' ) break;
      }
  }
  return schema;
};

// instantiate
var registry$1 = new Registry();

/**
 * Custom format API
 *
 * @see https://github.com/json-schema-faker/json-schema-faker#custom-formats
 * @param nameOrFormatMap
 * @param callback
 * @returns {any}
 */
function formatAPI(nameOrFormatMap, callback) {
  if (typeof nameOrFormatMap === 'undefined') {
    return registry$1.list();
  }

  if (typeof nameOrFormatMap === 'string') {
    if (typeof callback === 'function') {
      registry$1.register(nameOrFormatMap, callback);
    } else if (callback === null || callback === false) {
      registry$1.unregister(nameOrFormatMap);
    } else {
      return registry$1.get(nameOrFormatMap);
    }
  } else {
    registry$1.registerMany(nameOrFormatMap);
  }
}

var ParseError = /*@__PURE__*/(function (Error) {
  function ParseError(message, path) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = 'ParseError';
    this.message = message;
    this.path = path;
  }

  if ( Error ) ParseError.__proto__ = Error;
  ParseError.prototype = Object.create( Error && Error.prototype );
  ParseError.prototype.constructor = ParseError;

  return ParseError;
}(Error));

var inferredProperties = {
  array: [
    'additionalItems',
    'items',
    'maxItems',
    'minItems',
    'uniqueItems' ],
  integer: [
    'exclusiveMaximum',
    'exclusiveMinimum',
    'maximum',
    'minimum',
    'multipleOf' ],
  object: [
    'additionalProperties',
    'dependencies',
    'maxProperties',
    'minProperties',
    'patternProperties',
    'properties',
    'required' ],
  string: [
    'maxLength',
    'minLength',
    'pattern',
    'format' ],
};

inferredProperties.number = inferredProperties.integer;

var subschemaProperties = [
  'additionalItems',
  'items',
  'additionalProperties',
  'dependencies',
  'patternProperties',
  'properties' ];

/**
 * Iterates through all keys of `obj` and:
 * - checks whether those keys match properties of a given inferred type
 * - makes sure that `obj` is not a subschema; _Do not attempt to infer properties named as subschema containers. The
 * reason for this is that any property name within those containers that matches one of the properties used for
 * inferring missing type values causes the container itself to get processed which leads to invalid output. (Issue 62)_
 *
 * @returns {boolean}
 */
function matchesType(obj, lastElementInPath, inferredTypeProperties) {
  return Object.keys(obj).filter(function (prop) {
    var isSubschema = subschemaProperties.indexOf(lastElementInPath) > -1;
    var inferredPropertyFound = inferredTypeProperties.indexOf(prop) > -1;

    if (inferredPropertyFound && !isSubschema) {
      return true;
    }

    return false;
  }).length > 0;
}

/**
 * Checks whether given `obj` type might be inferred. The mechanism iterates through all inferred types definitions,
 * tries to match allowed properties with properties of given `obj`. Returns type name, if inferred, or null.
 *
 * @returns {string|null}
 */
function inferType(obj, schemaPath) {
  var keys = Object.keys(inferredProperties);

  for (var i = 0; i < keys.length; i += 1) {
    var typeName = keys[i];
    var lastElementInPath = schemaPath[schemaPath.length - 1];

    if (matchesType(obj, lastElementInPath, inferredProperties[typeName])) {
      return typeName;
    }
  }
}

/**
 * Generates randomized boolean value.
 *
 * @returns {boolean}
 */
function booleanGenerator() {
  return optionAPI('random')() > 0.5;
}

var booleanType = booleanGenerator;

/**
 * Generates null value.
 *
 * @returns {null}
 */
function nullGenerator() {
  return null;
}

var nullType = nullGenerator;

// TODO provide types
function unique(path, items, value, sample, resolve, traverseCallback) {
  var tmp = [];
  var seen = [];

  function walk(obj) {
    var json = JSON.stringify(obj);

    if (seen.indexOf(json) === -1) {
      seen.push(json);
      tmp.push(obj);

      return true;
    }

    return false;
  }

  items.forEach(walk);

  // TODO: find a better solution?
  var limit = 100;

  while (tmp.length !== items.length) {
    if (!walk(traverseCallback(value.items || sample, path, resolve))) {
      limit -= 1;
    }

    if (!limit) {
      break;
    }
  }

  return tmp;
}

// TODO provide types
function arrayType(value, path, resolve, traverseCallback) {
  var items = [];

  if (!(value.items || value.additionalItems)) {
    if (utils.hasProperties(value, 'minItems', 'maxItems', 'uniqueItems')) {
      throw new ParseError(("missing items for " + (utils.short(value))), path);
    }
    return items;
  }

  if (Array.isArray(value.items)) {
    return value.items.map(function (item, key) {
      var itemSubpath = path.concat(['items', key]);

      return traverseCallback(item, itemSubpath, resolve);
    });
  }

  var minItems = value.minItems;
  var maxItems = value.maxItems;

  var defaultMinItems = optionAPI('minItems');
  var defaultMaxItems = optionAPI('maxItems');

  if (defaultMinItems) {
    // fix boundaries
    minItems = typeof minItems === 'undefined'
      ? defaultMinItems
      : Math.min(defaultMinItems, minItems);
  }

  if (defaultMaxItems) {
    maxItems = typeof maxItems === 'undefined'
      ? defaultMaxItems
      : Math.min(defaultMaxItems, maxItems);

    // Don't allow user to set max items above our maximum
    if (maxItems && maxItems > defaultMaxItems) {
      maxItems = defaultMaxItems;
    }

    // Don't allow user to set min items above our maximum
    if (minItems && minItems > defaultMaxItems) {
      minItems = maxItems;
    }
  }

  var optionalsProbability = optionAPI('alwaysFakeOptionals') === true ? 1.0 : optionAPI('optionalsProbability');
  var fixedProbabilities = optionAPI('alwaysFakeOptionals') || optionAPI('fixedProbabilities') || false;

  var length = random.number(minItems, maxItems, 1, 5);

  if (optionalsProbability !== null) {
    length = Math.max(fixedProbabilities
      ? Math.round((maxItems || length) * optionalsProbability)
      : Math.abs(random.number(minItems, maxItems) * optionalsProbability), minItems || 0);
  }

  // TODO below looks bad. Should additionalItems be copied as-is?
  var sample = typeof value.additionalItems === 'object' ? value.additionalItems : {};

  for (var current = items.length; current < length; current += 1) {
    var itemSubpath = path.concat(['items', current]);
    var element = traverseCallback(value.items || sample, itemSubpath, resolve);

    items.push(element);
  }

  if (value.contains && length > 0) {
    var idx = random.number(0, length - 1);
    items[idx] = traverseCallback(value.contains, path.concat(["items",idx]), resolve);
  }

  if (value.uniqueItems) {
    return unique(path.concat(['items']), items, value, sample, resolve, traverseCallback);
  }

  return items;
}

function numberType(value) {
  var min = typeof value.minimum === 'undefined' ? env.MIN_INTEGER : value.minimum;
  var max = typeof value.maximum === 'undefined' ? env.MAX_INTEGER : value.maximum;

  var multipleOf = value.multipleOf;

  if (multipleOf) {
    max = Math.floor(max / multipleOf) * multipleOf;
    min = Math.ceil(min / multipleOf) * multipleOf;
  }

  if (value.exclusiveMinimum && min === value.minimum) {
    min += multipleOf || 1;
  }

  if (value.exclusiveMaximum && max === value.maximum) {
    max -= multipleOf || 1;
  }

  if (min > max) {
    return NaN;
  }

  if (multipleOf) {
    if (String(multipleOf).indexOf('.') === -1) {
      var base = random.number(Math.floor(min / multipleOf), Math.floor(max / multipleOf)) * multipleOf;

      while (base < min) {
        base += value.multipleOf;
      }

      return base;
    }

    var boundary = (max - min) / multipleOf;

    var num;
    var fix;

    do {
      num = random.number(0, boundary) * multipleOf;
      fix = (num / multipleOf) % 1;
    } while (fix !== 0);

    // FIXME: https://github.com/json-schema-faker/json-schema-faker/issues/379

    return min + num;
  }

  return random.number(min, max, undefined, undefined, true);
}

// The `integer` type is just a wrapper for the `number` type. The `number` type
// returns floating point numbers, and `integer` type truncates the fraction
// part, leaving the result as an integer.

function integerType(value) {
  return numberType(Object.assign({ multipleOf: 1 }, value));
}

var LIPSUM_WORDS = "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore\net dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\ncommodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla\npariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est\nlaborum".split(/\W/);

/**
 * Generates randomized array of single lorem ipsum words.
 *
 * @param length
 * @returns {Array.<string>}
 */
function wordsGenerator(length) {
  var words = random.shuffle(LIPSUM_WORDS);

  return words.slice(0, length);
}

// fallback generator
var anyType = { type: env.ALLOWED_TYPES };

// TODO provide types
function objectType(value, path, resolve, traverseCallback) {
  var props = {};

  var properties = value.properties || {};
  var patternProperties = value.patternProperties || {};
  var requiredProperties = typeof value.required === 'boolean' ? [] : (value.required || []).slice();
  var allowsAdditional = value.additionalProperties !== false;

  var propertyKeys = Object.keys(properties);
  var patternPropertyKeys = Object.keys(patternProperties);
  var optionalProperties = propertyKeys.concat(patternPropertyKeys).reduce(function (_response, _key) {
    if (requiredProperties.indexOf(_key) === -1) { _response.push(_key); }
    return _response;
  }, []);
  var allProperties = requiredProperties.concat(optionalProperties);

  var additionalProperties = allowsAdditional // eslint-disable-line
    ? (value.additionalProperties === true ? anyType : value.additionalProperties)
    : value.additionalProperties;

  if (!allowsAdditional
    && propertyKeys.length === 0
    && patternPropertyKeys.length === 0
    && utils.hasProperties(value, 'minProperties', 'maxProperties', 'dependencies', 'required')
  ) {
    // just nothing
    return null;
  }

  if (optionAPI('requiredOnly') === true) {
    requiredProperties.forEach(function (key) {
      if (properties[key]) {
        props[key] = properties[key];
      }
    });

    return traverseCallback(props, path.concat(['properties']), resolve, value);
  }

  var optionalsProbability = optionAPI('alwaysFakeOptionals') === true ? 1.0 : optionAPI('optionalsProbability');
  var fixedProbabilities = optionAPI('alwaysFakeOptionals') || optionAPI('fixedProbabilities') || false;
  var ignoreProperties = optionAPI('ignoreProperties') || [];
  var reuseProps = optionAPI('reuseProperties');
  var fillProps = optionAPI('fillProperties');

  var max = value.maxProperties || (allProperties.length + (allowsAdditional ? random.number(1, 5) : 0));

  var min = Math.max(value.minProperties || 0, requiredProperties.length);
  var neededExtras = Math.max(0, allProperties.length - min);

  if (allProperties.length === 1 && !requiredProperties.length) {
    min = Math.max(random.number(fillProps ? 1 : 0, max), min);
  }

  if (optionalsProbability !== null) {
    if (fixedProbabilities === true) {
      neededExtras = Math.round((min - requiredProperties.length) + (optionalsProbability * (allProperties.length - min)));
    } else {
      neededExtras = random.number(min - requiredProperties.length, optionalsProbability * (allProperties.length - min));
    }
  }

  var extraPropertiesRandomOrder = random.shuffle(optionalProperties).slice(0, neededExtras);
  var extraProperties = optionalProperties.filter(function (_item) {
    return extraPropertiesRandomOrder.indexOf(_item) !== -1;
  });

  // properties are read from right-to-left
  var _limit = optionalsProbability !== null || requiredProperties.length === max ? max : random.number(0, max);
  var _props = requiredProperties.concat(random.shuffle(extraProperties).slice(0, _limit)).slice(0, max);
  var _defns = [];

  if (value.dependencies) {
    Object.keys(value.dependencies).forEach(function (prop) {
      var _required = value.dependencies[prop];

      if (_props.indexOf(prop) !== -1) {
        if (Array.isArray(_required)) {
          // property-dependencies
          _required.forEach(function (sub) {
            if (_props.indexOf(sub) === -1) {
              _props.push(sub);
            }
          });
        } else {
          _defns.push(_required);
        }
      }
    });

    // schema-dependencies
    if (_defns.length) {
      delete value.dependencies;

      return traverseCallback({
        allOf: _defns.concat(value),
      }, path.concat(['properties']), resolve, value);
    }
  }

  var skipped = [];

  _props.forEach(function (key) {
    for (var i = 0; i < ignoreProperties.length; i += 1) {
      if ((ignoreProperties[i] instanceof RegExp && ignoreProperties[i].test(key))
        || (typeof ignoreProperties[i] === 'string' && ignoreProperties[i] === key)
        || (typeof ignoreProperties[i] === 'function' && ignoreProperties[i](properties[key], key))) {
        skipped.push(key);
        return;
      }
    }

    if (additionalProperties === false) {
      if (requiredProperties.indexOf(key) !== -1) {
        props[key] = properties[key];
      }
    }

    if (properties[key]) {
      props[key] = properties[key];
    }

    var found;

    // then try patternProperties
    patternPropertyKeys.forEach(function (_key) {
      if (key.match(new RegExp(_key))) {
        found = true;

        if (props[key]) {
          utils.merge(props[key], patternProperties[_key]);
        } else {
          props[random.randexp(key)] = patternProperties[_key];
        }
      }
    });

    if (!found) {
      // try patternProperties again,
      var subschema = patternProperties[key] || additionalProperties;

      // FIXME: allow anyType as fallback when no subschema is given?

      if (subschema && additionalProperties !== false) {
        // otherwise we can use additionalProperties?
        props[patternProperties[key] ? random.randexp(key) : key] = properties[key] || subschema;
      }
    }
  });

  // discard already ignored props if they're not required to be filled...
  var current = Object.keys(props).length + (fillProps ? 0 : skipped.length);

  // generate dynamic suffix for additional props...
  var hash = function (suffix) { return random.randexp(("_?[_a-f\\d]{1,3}" + (suffix ? '\\$?' : ''))); };

  function get(from) {
    var one;

    do {
      if (!from.length) { break; }
      one = from.shift();
    } while (props[one]);

    return one;
  }

  var minProps = min;
  if (allowsAdditional && !requiredProperties.length) {
    minProps = Math.max(optionalsProbability === null || additionalProperties ? random.number(fillProps ? 1 : 0, max) : 0, min);
  }

  while (fillProps) {
    if (!(patternPropertyKeys.length || allowsAdditional)) {
      break;
    }

    if (current >= minProps) {
      break;
    }

    if (allowsAdditional) {
      if (reuseProps && ((propertyKeys.length - current) > minProps)) {
        var count = 0;
        var key = (void 0);

        do {
          count += 1;

          // skip large objects
          if (count > 1000) {
            break;
          }

          key = get(requiredProperties) || random.pick(propertyKeys);
        } while (typeof props[key] !== 'undefined');

        if (typeof props[key] === 'undefined') {
          props[key] = properties[key];
          current += 1;
        }
      } else if (patternPropertyKeys.length && !additionalProperties) {
        var prop = random.pick(patternPropertyKeys);
        var word = random.randexp(prop);

        if (!props[word]) {
          props[word] = patternProperties[prop];
          current += 1;
        }
      } else {
        var word$1 = get(requiredProperties) || (wordsGenerator(1) + hash());

        if (!props[word$1]) {
          props[word$1] = additionalProperties || anyType;
          current += 1;
        }
      }
    }

    for (var i = 0; current < min && i < patternPropertyKeys.length; i += 1) {
      var _key = patternPropertyKeys[i];
      var word$2 = random.randexp(_key);


      if (!props[word$2]) {
        props[word$2] = patternProperties[_key];
        current += 1;
      }
    }
  }

  // fill up-to this value and no more!
  if (requiredProperties.length === 0 && (!allowsAdditional || optionalsProbability === false)) {
    var maximum = random.number(min, max);

    for (; current < maximum;) {
      var word$3 = get(propertyKeys);

      if (word$3) {
        props[word$3] = properties[word$3];
      }

      current += 1;
    }
  }

  return traverseCallback(props, path.concat(['properties']), resolve, value);
}

/**
 * Helper function used by thunkGenerator to produce some words for the final result.
 *
 * @returns {string}
 */
function produce() {
  var length = random.number(1, 5);

  return wordsGenerator(length).join(' ');
}

/**
 * Generates randomized concatenated string based on words generator.
 *
 * @returns {string}
 */
function thunkGenerator(min, max) {
  if ( min === void 0 ) min = 0;
  if ( max === void 0 ) max = 140;

  var _min = Math.max(0, min);
  var _max = random.number(_min, max);

  var result = produce();

  // append until length is reached
  while (result.length < _min) {
    result += produce();
  }

  // cut if needed
  if (result.length > _max) {
    result = result.substr(0, _max);
  }

  return result;
}

/**
 * Generates randomized ipv4 address.
 *
 * @returns {string}
 */
function ipv4Generator() {
  return [0, 0, 0, 0].map(function () {
    return random.number(0, 255);
  }).join('.');
}

/**
 * Generates randomized date time ISO format string.
 *
 * @returns {string}
 */
function dateTimeGenerator() {
  return random.date().toISOString();
}

/**
 * Generates randomized date format string.
 *
 * @returns {string}
 */
function dateGenerator() {
  return dateTimeGenerator().slice(0, 10);
}

/**
 * Generates randomized time format string.
 *
 * @returns {string}
 */
function timeGenerator() {
  return dateTimeGenerator().slice(11);
}

var FRAGMENT = '[a-zA-Z][a-zA-Z0-9+-.]*';
var URI_PATTERN = "https?://{hostname}(?:" + FRAGMENT + ")+";
var PARAM_PATTERN = '(?:\\?([a-z]{1,7}(=\\w{1,5})?&){0,3})?';

/**
 * Predefined core formats
 * @type {[key: string]: string}
 */
var regexps = {
  email: '[a-zA-Z\\d][a-zA-Z\\d-]{1,13}[a-zA-Z\\d]@{hostname}',
  hostname: '[a-zA-Z]{1,33}\\.[a-z]{2,4}',
  ipv6: '[a-f\\d]{4}(:[a-f\\d]{4}){7}',
  uri: URI_PATTERN,
  slug: '[a-zA-Z\\d_-]+',

  // types from draft-0[67] (?)
  'uri-reference': ("" + URI_PATTERN + PARAM_PATTERN),
  'uri-template': URI_PATTERN.replace('(?:', '(?:/\\{[a-z][:a-zA-Z0-9-]*\\}|'),
  'json-pointer': ("(/(?:" + (FRAGMENT.replace(']*', '/]*')) + "|~[01]))+"),

  // some types from https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#data-types (?)
  uuid: '^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$',
};

regexps.iri = regexps['uri-reference'];
regexps['iri-reference'] = regexps['uri-reference'];

regexps['idn-email'] = regexps.email;
regexps['idn-hostname'] = regexps.hostname;

var ALLOWED_FORMATS = new RegExp(("\\{(" + (Object.keys(regexps).join('|')) + ")\\}"));

/**
 * Generates randomized string basing on a built-in regex format
 *
 * @param coreFormat
 * @returns {string}
 */
function coreFormatGenerator(coreFormat) {
  return random.randexp(regexps[coreFormat]).replace(ALLOWED_FORMATS, function (match, key) {
    return random.randexp(regexps[key]);
  });
}

function generateFormat(value, invalid) {
  var callback = formatAPI(value.format);

  if (typeof callback === 'function') {
    return callback(value);
  }

  switch (value.format) {
    case 'date-time':
    case 'datetime':
      return dateTimeGenerator();
    case 'date':
      return dateGenerator();
    case 'time':
      return timeGenerator();
    case 'ipv4':
      return ipv4Generator();
    case 'regex':
      // TODO: discuss
      return '.+?';
    case 'email':
    case 'hostname':
    case 'ipv6':
    case 'uri':
    case 'uri-reference':
    case 'iri':
    case 'iri-reference':
    case 'idn-email':
    case 'idn-hostname':
    case 'json-pointer':
    case 'slug':
    case 'uri-template':
    case 'uuid':
      return coreFormatGenerator(value.format);
    default:
      if (typeof callback === 'undefined') {
        if (optionAPI('failOnInvalidFormat')) {
          throw new Error(("unknown registry key " + (utils.short(value.format))));
        } else {
          return invalid();
        }
      }

      throw new Error(("unsupported format '" + (value.format) + "'"));
  }
}

function stringType(value) {
  // here we need to force type to fix #467
  var output = utils.typecast('string', value, function (opts) {
    if (value.format) {
      return generateFormat(value, function () { return thunkGenerator(opts.minLength, opts.maxLength); });
    }

    if (value.pattern) {
      return random.randexp(value.pattern);
    }

    return thunkGenerator(opts.minLength, opts.maxLength);
  });

  return output;
}

var typeMap = {
  boolean: booleanType,
  null: nullType,
  array: arrayType,
  integer: integerType,
  number: numberType,
  object: objectType,
  string: stringType,
};

function getMeta(ref) {
  var comment = ref.$comment;
  var title = ref.title;
  var description = ref.description;

  return Object.entries({ comment: comment, title: title, description: description })
      .filter(function (ref) {
        var value = ref[1];

        return value;
  })
      .reduce(function (memo, ref) {
        var k = ref[0];
        var v = ref[1];

        memo[k] = v;
        return memo;
      }, {});
}

// TODO provide types
function traverse(schema, path, resolve, rootSchema) {
  schema = resolve(schema, null, path);

  if (schema && (schema.oneOf || schema.anyOf || schema.allOf)) {
    schema = resolve(schema, null, path);
  }

  if (!schema) {
    return;
  }

  var context = getMeta(schema);

  // default values has higher precedence
  if (path[path.length - 1] !== 'properties') {
    // example values have highest precedence
    if (optionAPI('useExamplesValue') && Array.isArray(schema.examples)) {
      // include `default` value as example too
      var fixedExamples = schema.examples
        .concat('default' in schema ? [schema.default] : []);

      return { value: utils.typecast(null, schema, function () { return random.pick(fixedExamples); }), context: context };
    }

    if (optionAPI('useDefaultValue') && 'default' in schema) {
      if (schema.default !== '' || !optionAPI('replaceEmptyByRandomValue')) {
        return { value: schema.default, context: context };
      }
    }

    if ('template' in schema) {
      return { value: utils.template(schema.template, rootSchema), context: context };
    }

    if ('const' in schema) {
      return { value: schema.const, context: context };
    }
  }

  if (schema.not && typeof schema.not === 'object') {
    schema = utils.notValue(schema.not, utils.omitProps(schema, ['not']));

    // build new object value from not-schema!
    if (schema.type && schema.type === 'object') {
      var ref = traverse(schema, path.concat(['not']), resolve, rootSchema);
      var value = ref.value;
      var innerContext = ref.context;
      return { value: utils.clean(value, schema, false), context: Object.assign({}, context, {items: innerContext}) };
    }
  }

  // thunks can return sub-schemas
  if (typeof schema.thunk === 'function') {
    // result is already cleaned in thunk
    var ref$1 = traverse(schema.thunk(rootSchema), path, resolve);
    var value$1 = ref$1.value;
    var innerContext$1 = ref$1.context;
    return { value: value$1, context: Object.assign({}, context, {items: innerContext$1}) };
  }

  if (typeof schema.generate === 'function') {
    var retval = utils.typecast(null, schema, function () { return schema.generate(rootSchema, path); });
    var type$1 = retval === null ? 'null' : typeof retval;
    if (type$1 === schema.type
      || (Array.isArray(schema.type) && schema.type.includes(type$1))
      || (type$1 === 'number' && schema.type === 'integer')
      || (Array.isArray(retval) && schema.type === 'array')) {
      return { value: retval, context: context };
    }
  }

  if (typeof schema.pattern === 'string') {
    return { value: utils.typecast('string', schema, function () { return random.randexp(schema.pattern); }), context: context };
  }

  if (Array.isArray(schema.enum)) {
    return { value: utils.typecast(null, schema, function () { return random.pick(schema.enum); }), context: context };
  }

  // short-circuit as we don't plan generate more values!
  if (schema.jsonPath) {
    return { value: schema, context: context };
  }

  // TODO remove the ugly overcome
  var type = schema.type;

  if (Array.isArray(type)) {
    type = random.pick(type);
  } else if (typeof type === 'undefined') {
    // Attempt to infer the type
    type = inferType(schema, path) || type;

    if (type) {
      schema.type = type;
    }
  }

  if (typeof type === 'string') {
    if (!typeMap[type]) {
      if (optionAPI('failOnInvalidTypes')) {
        throw new ParseError(("unknown primitive " + (utils.short(type))), path.concat(['type']));
      } else {
        var value$2 = optionAPI('defaultInvalidTypeProduct');

        if (typeof value$2 === 'string' && typeMap[value$2]) {
          return { value: typeMap[value$2](schema, path, resolve, traverse), context: context };
        }

        return { value: value$2, context: context };
      }
    } else {
      try {
        var innerResult = typeMap[type](schema, path, resolve, traverse);
        if (type === 'array') {
          return {
            value: innerResult.map(function (ref) {
              var value = ref.value;

              return value;
          }),
            context: Object.assign({}, context,
              {items: innerResult.map(function (ref) {
                var c = ref.context;

                return c;
          })}),
          };
        } if (type === 'object') {
          return { value: innerResult.value, context: Object.assign({}, context, {items: innerResult.context}) };
        }
        return { value: innerResult, context: context };
      } catch (e) {
        if (typeof e.path === 'undefined') {
          throw new ParseError(e.stack, path);
        }
        throw e;
      }
    }
  }

  var valueCopy = {};
  var contextCopy = Object.assign({}, context);

  if (Array.isArray(schema)) {
    valueCopy = [];
  }

  Object.keys(schema).forEach(function (prop) {
    if (typeof schema[prop] === 'object' && prop !== 'definitions') {
      var ref = traverse(schema[prop], path.concat([prop]), resolve, valueCopy);
      var value = ref.value;
      var innerContext = ref.context;
      valueCopy[prop] = utils.clean(value, schema[prop], false);
      contextCopy[prop] = innerContext;
    } else {
      valueCopy[prop] = schema[prop];
    }
  });

  return { value: valueCopy, context: contextCopy };
}

var buildResolveSchema = function (ref) {
  var refs = ref.refs;
  var schema = ref.schema;
  var container = ref.container;
  var refDepthMax = ref.refDepthMax;
  var refDepthMin = ref.refDepthMin;

  var recursiveUtil = {};
  var seenRefs = {};

  var depth = 0;
  var lastRef;
  var lastPath;

  recursiveUtil.resolveSchema = function (sub, index, rootPath) {
    // prevent null sub from default/example null values to throw
    if (sub === null || sub === undefined) {
      return null;
    }

    if (typeof sub.generate === 'function') {
      return sub;
    }

    // cleanup
    var _id = sub.$id || sub.id;

    if (typeof _id === 'string') {
      delete sub.id;
      delete sub.$id;
      delete sub.$schema;
    }

    if (typeof sub.$ref === 'string') {
      var maxDepth = Math.max(refDepthMin, refDepthMax) - 1;

      // increasing depth only for repeated refs seems to be fixing #258
      if (sub.$ref === '#' || seenRefs[sub.$ref] < 0 || (lastRef === sub.$ref && ++depth > maxDepth)) {
        if (sub.$ref !== '#' && lastPath && lastPath.length === rootPath.length) {
          return utils.getLocalRef(schema, sub.$ref);
        }
        delete sub.$ref;
        return sub;
      }

      if (typeof seenRefs[sub.$ref] === 'undefined') {
        seenRefs[sub.$ref] = random.number(refDepthMin, refDepthMax) - 1;
      }

      lastPath = rootPath;
      lastRef = sub.$ref;

      var ref;

      if (sub.$ref.indexOf('#/') === -1) {
        ref = refs[sub.$ref] || null;
      } else {
        ref = utils.getLocalRef(schema, sub.$ref) || null;
      }

      if (typeof ref !== 'undefined') {
        if (!ref && optionAPI('ignoreMissingRefs') !== true) {
          throw new Error(("Reference not found: " + (sub.$ref)));
        }

        seenRefs[sub.$ref] -= 1;
        utils.merge(sub, ref || {});
      }

      // just remove the reference
      delete sub.$ref;
      return sub;
    }

    if (Array.isArray(sub.allOf)) {
      var schemas = sub.allOf;

      delete sub.allOf;

      // this is the only case where all sub-schemas
      // must be resolved before any merge
      schemas.forEach(function (subSchema) {
        var _sub = recursiveUtil.resolveSchema(subSchema, null, rootPath);

        // call given thunks if present
        utils.merge(sub, typeof _sub.thunk === 'function'
          ? _sub.thunk(sub)
          : _sub);
        if (Array.isArray(sub.allOf)) {
          recursiveUtil.resolveSchema(sub, index, rootPath);
        }
      });
    }

    if (Array.isArray(sub.oneOf || sub.anyOf)) {
      var mix = sub.oneOf || sub.anyOf;

      // test every value from the enum against each-oneOf
      // schema, only values that validate once are kept
      if (sub.enum && sub.oneOf) {
        sub.enum = sub.enum.filter(function (x) { return utils.validate(x, mix); });
      }

      return {
        thunk: function thunk(rootSchema) {
          var copy = utils.omitProps(sub, ['anyOf', 'oneOf']);
          var fixed = random.pick(mix);

          utils.merge(copy, fixed);

          // remove additional properties from merged schemas
          mix.forEach(function (omit) {
            if (omit.required && omit !== fixed) {
              omit.required.forEach(function (key) {
                var includesKey = copy.required && copy.required.includes(key);
                if (copy.properties && !includesKey) {
                  delete copy.properties[key];
                }

                if (rootSchema && rootSchema.properties) {
                  delete rootSchema.properties[key];
                }
              });
            }
          });

          return copy;
        },
      };
    }

    Object.keys(sub).forEach(function (prop) {
      if ((Array.isArray(sub[prop]) || typeof sub[prop] === 'object') && !utils.isKey(prop)) {
        sub[prop] = recursiveUtil.resolveSchema(sub[prop], prop, rootPath.concat(prop));
      }
    });

    // avoid extra calls on sub-schemas, fixes #458
    if (rootPath) {
      var lastProp = rootPath[rootPath.length - 1];

      if (lastProp === 'properties' || lastProp === 'items') {
        return sub;
      }
    }

    return container.wrap(sub);
  };

  return recursiveUtil;
};

function pick$1(data) {
  return Array.isArray(data)
    ? random.pick(data)
    : data;
}

function cycle(data, reverse) {
  if (!Array.isArray(data)) {
    return data;
  }

  var value = reverse
    ? data.pop()
    : data.shift();

  if (reverse) {
    data.unshift(value);
  } else {
    data.push(value);
  }

  return value;
}

function resolve(obj, data, values, property) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (!values) {
    values = {};
  }

  if (!data) {
    data = obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(function (x) { return resolve(x, data, values, property); });
  }

  if (obj.jsonPath) {
    var params = typeof obj.jsonPath !== 'object'
      ? { path: obj.jsonPath }
      : obj.jsonPath;

    params.group = obj.group || params.group || property;
    params.cycle = obj.cycle || params.cycle || false;
    params.reverse = obj.reverse || params.reverse || false;
    params.count = obj.count || params.count || 1;

    var key = (params.group) + "__" + (params.path);

    if (!values[key]) {
      if (params.count > 1) {
        values[key] = JSONPath(params.path, data).slice(0, params.count);
      } else {
        values[key] = JSONPath(params.path, data);
      }
    }

    if (params.cycle || params.reverse) {
      return cycle(values[key], params.reverse);
    }

    return pick$1(values[key]);
  }

  Object.keys(obj).forEach(function (k) {
    obj[k] = resolve(obj[k], data, values, k);
  });

  return obj;
}

// TODO provide types?
function run(refs, schema, container) {
  if (Object.prototype.toString.call(schema) !== '[object Object]') {
    throw new Error(("Invalid input, expecting object but given " + (typeof schema)));
  }

  var refDepthMin = optionAPI('refDepthMin') || 0;
  var refDepthMax = optionAPI('refDepthMax') || 3;

  try {
    var ref = buildResolveSchema({
      refs: refs,
      schema: schema,
      container: container,
      refDepthMin: refDepthMin,
      refDepthMax: refDepthMax,
    });
    var resolveSchema = ref.resolveSchema;
    var result = traverse(utils.clone(schema), [], resolveSchema);

    if (optionAPI('resolveJsonPath')) {
      return {
        value: resolve(result.value),
        context: result.context,
      };
    }

    return result;
  } catch (e) {
    if (e.path) {
      throw new Error(((e.message) + " in /" + (e.path.join('/'))));
    } else {
      throw e;
    }
  }
}

function renderJS(res) {
  return res.value;
}

const Char = {
  ANCHOR: '&',
  COMMENT: '#',
  TAG: '!',
  DIRECTIVES_END: '-',
  DOCUMENT_END: '.'
};
const Type = {
  ALIAS: 'ALIAS',
  BLANK_LINE: 'BLANK_LINE',
  BLOCK_FOLDED: 'BLOCK_FOLDED',
  BLOCK_LITERAL: 'BLOCK_LITERAL',
  COMMENT: 'COMMENT',
  DIRECTIVE: 'DIRECTIVE',
  DOCUMENT: 'DOCUMENT',
  FLOW_MAP: 'FLOW_MAP',
  FLOW_SEQ: 'FLOW_SEQ',
  MAP: 'MAP',
  MAP_KEY: 'MAP_KEY',
  MAP_VALUE: 'MAP_VALUE',
  PLAIN: 'PLAIN',
  QUOTE_DOUBLE: 'QUOTE_DOUBLE',
  QUOTE_SINGLE: 'QUOTE_SINGLE',
  SEQ: 'SEQ',
  SEQ_ITEM: 'SEQ_ITEM'
};
const defaultTagPrefix = 'tag:yaml.org,2002:';
const defaultTags = {
  MAP: 'tag:yaml.org,2002:map',
  SEQ: 'tag:yaml.org,2002:seq',
  STR: 'tag:yaml.org,2002:str'
};

function findLineStarts(src) {
  const ls = [0];
  let offset = src.indexOf('\n');

  while (offset !== -1) {
    offset += 1;
    ls.push(offset);
    offset = src.indexOf('\n', offset);
  }

  return ls;
}

function getSrcInfo(cst) {
  let lineStarts, src;

  if (typeof cst === 'string') {
    lineStarts = findLineStarts(cst);
    src = cst;
  } else {
    if (Array.isArray(cst)) cst = cst[0];

    if (cst && cst.context) {
      if (!cst.lineStarts) cst.lineStarts = findLineStarts(cst.context.src);
      lineStarts = cst.lineStarts;
      src = cst.context.src;
    }
  }

  return {
    lineStarts,
    src
  };
}
/**
 * @typedef {Object} LinePos - One-indexed position in the source
 * @property {number} line
 * @property {number} col
 */

/**
 * Determine the line/col position matching a character offset.
 *
 * Accepts a source string or a CST document as the second parameter. With
 * the latter, starting indices for lines are cached in the document as
 * `lineStarts: number[]`.
 *
 * Returns a one-indexed `{ line, col }` location if found, or
 * `undefined` otherwise.
 *
 * @param {number} offset
 * @param {string|Document|Document[]} cst
 * @returns {?LinePos}
 */


function getLinePos(offset, cst) {
  if (typeof offset !== 'number' || offset < 0) return null;
  const {
    lineStarts,
    src
  } = getSrcInfo(cst);
  if (!lineStarts || !src || offset > src.length) return null;

  for (let i = 0; i < lineStarts.length; ++i) {
    const start = lineStarts[i];

    if (offset < start) {
      return {
        line: i,
        col: offset - lineStarts[i - 1] + 1
      };
    }

    if (offset === start) return {
      line: i + 1,
      col: 1
    };
  }

  const line = lineStarts.length;
  return {
    line,
    col: offset - lineStarts[line - 1] + 1
  };
}
/**
 * Get a specified line from the source.
 *
 * Accepts a source string or a CST document as the second parameter. With
 * the latter, starting indices for lines are cached in the document as
 * `lineStarts: number[]`.
 *
 * Returns the line as a string if found, or `null` otherwise.
 *
 * @param {number} line One-indexed line number
 * @param {string|Document|Document[]} cst
 * @returns {?string}
 */

function getLine(line, cst) {
  const {
    lineStarts,
    src
  } = getSrcInfo(cst);
  if (!lineStarts || !(line >= 1) || line > lineStarts.length) return null;
  const start = lineStarts[line - 1];
  let end = lineStarts[line]; // undefined for last line; that's ok for slice()

  while (end && end > start && src[end - 1] === '\n') --end;

  return src.slice(start, end);
}
/**
 * Pretty-print the starting line from the source indicated by the range `pos`
 *
 * Trims output to `maxWidth` chars while keeping the starting column visible,
 * using `…` at either end to indicate dropped characters.
 *
 * Returns a two-line string (or `null`) with `\n` as separator; the second line
 * will hold appropriately indented `^` marks indicating the column range.
 *
 * @param {Object} pos
 * @param {LinePos} pos.start
 * @param {LinePos} [pos.end]
 * @param {string|Document|Document[]*} cst
 * @param {number} [maxWidth=80]
 * @returns {?string}
 */

function getPrettyContext({
  start,
  end
}, cst, maxWidth = 80) {
  let src = getLine(start.line, cst);
  if (!src) return null;
  let {
    col
  } = start;

  if (src.length > maxWidth) {
    if (col <= maxWidth - 10) {
      src = src.substr(0, maxWidth - 1) + '…';
    } else {
      const halfWidth = Math.round(maxWidth / 2);
      if (src.length > col + halfWidth) src = src.substr(0, col + halfWidth - 1) + '…';
      col -= src.length - maxWidth;
      src = '…' + src.substr(1 - maxWidth);
    }
  }

  let errLen = 1;
  let errEnd = '';

  if (end) {
    if (end.line === start.line && col + (end.col - start.col) <= maxWidth + 1) {
      errLen = end.col - start.col;
    } else {
      errLen = Math.min(src.length + 1, maxWidth) - col;
      errEnd = '…';
    }
  }

  const offset = col > 1 ? ' '.repeat(col - 1) : '';
  const err = '^'.repeat(errLen);
  return `${src}\n${offset}${err}${errEnd}`;
}

class Range {
  static copy(orig) {
    return new Range(orig.start, orig.end);
  }

  constructor(start, end) {
    this.start = start;
    this.end = end || start;
  }

  isEmpty() {
    return typeof this.start !== 'number' || !this.end || this.end <= this.start;
  }
  /**
   * Set `origStart` and `origEnd` to point to the original source range for
   * this node, which may differ due to dropped CR characters.
   *
   * @param {number[]} cr - Positions of dropped CR characters
   * @param {number} offset - Starting index of `cr` from the last call
   * @returns {number} - The next offset, matching the one found for `origStart`
   */


  setOrigRange(cr, offset) {
    const {
      start,
      end
    } = this;

    if (cr.length === 0 || end <= cr[0]) {
      this.origStart = start;
      this.origEnd = end;
      return offset;
    }

    let i = offset;

    while (i < cr.length) {
      if (cr[i] > start) break;else ++i;
    }

    this.origStart = start + i;
    const nextOffset = i;

    while (i < cr.length) {
      // if end was at \n, it should now be at \r
      if (cr[i] >= end) break;else ++i;
    }

    this.origEnd = end + i;
    return nextOffset;
  }

}

/** Root class of all nodes */

class Node {
  static addStringTerminator(src, offset, str) {
    if (str[str.length - 1] === '\n') return str;
    const next = Node.endOfWhiteSpace(src, offset);
    return next >= src.length || src[next] === '\n' ? str + '\n' : str;
  } // ^(---|...)


  static atDocumentBoundary(src, offset, sep) {
    const ch0 = src[offset];
    if (!ch0) return true;
    const prev = src[offset - 1];
    if (prev && prev !== '\n') return false;

    if (sep) {
      if (ch0 !== sep) return false;
    } else {
      if (ch0 !== Char.DIRECTIVES_END && ch0 !== Char.DOCUMENT_END) return false;
    }

    const ch1 = src[offset + 1];
    const ch2 = src[offset + 2];
    if (ch1 !== ch0 || ch2 !== ch0) return false;
    const ch3 = src[offset + 3];
    return !ch3 || ch3 === '\n' || ch3 === '\t' || ch3 === ' ';
  }

  static endOfIdentifier(src, offset) {
    let ch = src[offset];
    const isVerbatim = ch === '<';
    const notOk = isVerbatim ? ['\n', '\t', ' ', '>'] : ['\n', '\t', ' ', '[', ']', '{', '}', ','];

    while (ch && notOk.indexOf(ch) === -1) ch = src[offset += 1];

    if (isVerbatim && ch === '>') offset += 1;
    return offset;
  }

  static endOfIndent(src, offset) {
    let ch = src[offset];

    while (ch === ' ') ch = src[offset += 1];

    return offset;
  }

  static endOfLine(src, offset) {
    let ch = src[offset];

    while (ch && ch !== '\n') ch = src[offset += 1];

    return offset;
  }

  static endOfWhiteSpace(src, offset) {
    let ch = src[offset];

    while (ch === '\t' || ch === ' ') ch = src[offset += 1];

    return offset;
  }

  static startOfLine(src, offset) {
    let ch = src[offset - 1];
    if (ch === '\n') return offset;

    while (ch && ch !== '\n') ch = src[offset -= 1];

    return offset + 1;
  }
  /**
   * End of indentation, or null if the line's indent level is not more
   * than `indent`
   *
   * @param {string} src
   * @param {number} indent
   * @param {number} lineStart
   * @returns {?number}
   */


  static endOfBlockIndent(src, indent, lineStart) {
    const inEnd = Node.endOfIndent(src, lineStart);

    if (inEnd > lineStart + indent) {
      return inEnd;
    } else {
      const wsEnd = Node.endOfWhiteSpace(src, inEnd);
      const ch = src[wsEnd];
      if (!ch || ch === '\n') return wsEnd;
    }

    return null;
  }

  static atBlank(src, offset, endAsBlank) {
    const ch = src[offset];
    return ch === '\n' || ch === '\t' || ch === ' ' || endAsBlank && !ch;
  }

  static nextNodeIsIndented(ch, indentDiff, indicatorAsIndent) {
    if (!ch || indentDiff < 0) return false;
    if (indentDiff > 0) return true;
    return indicatorAsIndent && ch === '-';
  } // should be at line or string end, or at next non-whitespace char


  static normalizeOffset(src, offset) {
    const ch = src[offset];
    return !ch ? offset : ch !== '\n' && src[offset - 1] === '\n' ? offset - 1 : Node.endOfWhiteSpace(src, offset);
  } // fold single newline into space, multiple newlines to N - 1 newlines
  // presumes src[offset] === '\n'


  static foldNewline(src, offset, indent) {
    let inCount = 0;
    let error = false;
    let fold = '';
    let ch = src[offset + 1];

    while (ch === ' ' || ch === '\t' || ch === '\n') {
      switch (ch) {
        case '\n':
          inCount = 0;
          offset += 1;
          fold += '\n';
          break;

        case '\t':
          if (inCount <= indent) error = true;
          offset = Node.endOfWhiteSpace(src, offset + 2) - 1;
          break;

        case ' ':
          inCount += 1;
          offset += 1;
          break;
      }

      ch = src[offset + 1];
    }

    if (!fold) fold = ' ';
    if (ch && inCount <= indent) error = true;
    return {
      fold,
      offset,
      error
    };
  }

  constructor(type, props, context) {
    Object.defineProperty(this, 'context', {
      value: context || null,
      writable: true
    });
    this.error = null;
    this.range = null;
    this.valueRange = null;
    this.props = props || [];
    this.type = type;
    this.value = null;
  }

  getPropValue(idx, key, skipKey) {
    if (!this.context) return null;
    const {
      src
    } = this.context;
    const prop = this.props[idx];
    return prop && src[prop.start] === key ? src.slice(prop.start + (skipKey ? 1 : 0), prop.end) : null;
  }

  get anchor() {
    for (let i = 0; i < this.props.length; ++i) {
      const anchor = this.getPropValue(i, Char.ANCHOR, true);
      if (anchor != null) return anchor;
    }

    return null;
  }

  get comment() {
    const comments = [];

    for (let i = 0; i < this.props.length; ++i) {
      const comment = this.getPropValue(i, Char.COMMENT, true);
      if (comment != null) comments.push(comment);
    }

    return comments.length > 0 ? comments.join('\n') : null;
  }

  commentHasRequiredWhitespace(start) {
    const {
      src
    } = this.context;
    if (this.header && start === this.header.end) return false;
    if (!this.valueRange) return false;
    const {
      end
    } = this.valueRange;
    return start !== end || Node.atBlank(src, end - 1);
  }

  get hasComment() {
    if (this.context) {
      const {
        src
      } = this.context;

      for (let i = 0; i < this.props.length; ++i) {
        if (src[this.props[i].start] === Char.COMMENT) return true;
      }
    }

    return false;
  }

  get hasProps() {
    if (this.context) {
      const {
        src
      } = this.context;

      for (let i = 0; i < this.props.length; ++i) {
        if (src[this.props[i].start] !== Char.COMMENT) return true;
      }
    }

    return false;
  }

  get includesTrailingLines() {
    return false;
  }

  get jsonLike() {
    const jsonLikeTypes = [Type.FLOW_MAP, Type.FLOW_SEQ, Type.QUOTE_DOUBLE, Type.QUOTE_SINGLE];
    return jsonLikeTypes.indexOf(this.type) !== -1;
  }

  get rangeAsLinePos() {
    if (!this.range || !this.context) return undefined;
    const start = getLinePos(this.range.start, this.context.root);
    if (!start) return undefined;
    const end = getLinePos(this.range.end, this.context.root);
    return {
      start,
      end
    };
  }

  get rawValue() {
    if (!this.valueRange || !this.context) return null;
    const {
      start,
      end
    } = this.valueRange;
    return this.context.src.slice(start, end);
  }

  get tag() {
    for (let i = 0; i < this.props.length; ++i) {
      const tag = this.getPropValue(i, Char.TAG, false);

      if (tag != null) {
        if (tag[1] === '<') {
          return {
            verbatim: tag.slice(2, -1)
          };
        } else {
          // eslint-disable-next-line no-unused-vars
          const [_, handle, suffix] = tag.match(/^(.*!)([^!]*)$/);
          return {
            handle,
            suffix
          };
        }
      }
    }

    return null;
  }

  get valueRangeContainsNewline() {
    if (!this.valueRange || !this.context) return false;
    const {
      start,
      end
    } = this.valueRange;
    const {
      src
    } = this.context;

    for (let i = start; i < end; ++i) {
      if (src[i] === '\n') return true;
    }

    return false;
  }

  parseComment(start) {
    const {
      src
    } = this.context;

    if (src[start] === Char.COMMENT) {
      const end = Node.endOfLine(src, start + 1);
      const commentRange = new Range(start, end);
      this.props.push(commentRange);
      return end;
    }

    return start;
  }
  /**
   * Populates the `origStart` and `origEnd` values of all ranges for this
   * node. Extended by child classes to handle descendant nodes.
   *
   * @param {number[]} cr - Positions of dropped CR characters
   * @param {number} offset - Starting index of `cr` from the last call
   * @returns {number} - The next offset, matching the one found for `origStart`
   */


  setOrigRanges(cr, offset) {
    if (this.range) offset = this.range.setOrigRange(cr, offset);
    if (this.valueRange) this.valueRange.setOrigRange(cr, offset);
    this.props.forEach(prop => prop.setOrigRange(cr, offset));
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      range,
      value
    } = this;
    if (value != null) return value;
    const str = src.slice(range.start, range.end);
    return Node.addStringTerminator(src, range.end, str);
  }

}

class YAMLError extends Error {
  constructor(name, source, message) {
    if (!message || !(source instanceof Node)) throw new Error(`Invalid arguments for new ${name}`);
    super();
    this.name = name;
    this.message = message;
    this.source = source;
  }

  makePretty() {
    if (!this.source) return;
    this.nodeType = this.source.type;
    const cst = this.source.context && this.source.context.root;

    if (typeof this.offset === 'number') {
      this.range = new Range(this.offset, this.offset + 1);
      const start = cst && getLinePos(this.offset, cst);

      if (start) {
        const end = {
          line: start.line,
          col: start.col + 1
        };
        this.linePos = {
          start,
          end
        };
      }

      delete this.offset;
    } else {
      this.range = this.source.range;
      this.linePos = this.source.rangeAsLinePos;
    }

    if (this.linePos) {
      const {
        line,
        col
      } = this.linePos.start;
      this.message += ` at line ${line}, column ${col}`;
      const ctx = cst && getPrettyContext(this.linePos, cst);
      if (ctx) this.message += `:\n\n${ctx}\n`;
    }

    delete this.source;
  }

}
class YAMLReferenceError extends YAMLError {
  constructor(source, message) {
    super('YAMLReferenceError', source, message);
  }

}
class YAMLSemanticError extends YAMLError {
  constructor(source, message) {
    super('YAMLSemanticError', source, message);
  }

}
class YAMLSyntaxError extends YAMLError {
  constructor(source, message) {
    super('YAMLSyntaxError', source, message);
  }

}
class YAMLWarning extends YAMLError {
  constructor(source, message) {
    super('YAMLWarning', source, message);
  }

}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class PlainValue extends Node {
  static endOfLine(src, start, inFlow) {
    let ch = src[start];
    let offset = start;

    while (ch && ch !== '\n') {
      if (inFlow && (ch === '[' || ch === ']' || ch === '{' || ch === '}' || ch === ',')) break;
      const next = src[offset + 1];
      if (ch === ':' && (!next || next === '\n' || next === '\t' || next === ' ' || inFlow && next === ',')) break;
      if ((ch === ' ' || ch === '\t') && next === '#') break;
      offset += 1;
      ch = next;
    }

    return offset;
  }

  get strValue() {
    if (!this.valueRange || !this.context) return null;
    let {
      start,
      end
    } = this.valueRange;
    const {
      src
    } = this.context;
    let ch = src[end - 1];

    while (start < end && (ch === '\n' || ch === '\t' || ch === ' ')) ch = src[--end - 1];

    let str = '';

    for (let i = start; i < end; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        const {
          fold,
          offset
        } = Node.foldNewline(src, i, -1);
        str += fold;
        i = offset;
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (i < end && (next === ' ' || next === '\t')) {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    const ch0 = src[start];

    switch (ch0) {
      case '\t':
        {
          const msg = 'Plain value cannot start with a tab character';
          const errors = [new YAMLSemanticError(this, msg)];
          return {
            errors,
            str
          };
        }

      case '@':
      case '`':
        {
          const msg = `Plain value cannot start with reserved character ${ch0}`;
          const errors = [new YAMLSemanticError(this, msg)];
          return {
            errors,
            str
          };
        }

      default:
        return str;
    }
  }

  parseBlockValue(start) {
    const {
      indent,
      inFlow,
      src
    } = this.context;
    let offset = start;
    let valueEnd = start;

    for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
      if (Node.atDocumentBoundary(src, offset + 1)) break;
      const end = Node.endOfBlockIndent(src, indent, offset + 1);
      if (end === null || src[end] === '#') break;

      if (src[end] === '\n') {
        offset = end;
      } else {
        valueEnd = PlainValue.endOfLine(src, end, inFlow);
        offset = valueEnd;
      }
    }

    if (this.valueRange.isEmpty()) this.valueRange.start = start;
    this.valueRange.end = valueEnd;
    return valueEnd;
  }
  /**
   * Parses a plain value from the source
   *
   * Accepted forms are:
   * ```
   * #comment
   *
   * first line
   *
   * first line #comment
   *
   * first line
   * block
   * lines
   *
   * #comment
   * block
   * lines
   * ```
   * where block lines are empty or have an indent level greater than `indent`.
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar, may be `\n`
   */


  parse(context, start) {
    this.context = context;
    const {
      inFlow,
      src
    } = context;
    let offset = start;
    const ch = src[offset];

    if (ch && ch !== '#' && ch !== '\n') {
      offset = PlainValue.endOfLine(src, start, inFlow);
    }

    this.valueRange = new Range(start, offset);
    offset = Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);

    if (!this.hasComment || this.valueRange.isEmpty()) {
      offset = this.parseBlockValue(offset);
    }

    return offset;
  }

}

var Char_1 = Char;
var Node_1 = Node;
var PlainValue_1 = PlainValue;
var Range_1 = Range;
var Type_1 = Type;
var YAMLError_1 = YAMLError;
var YAMLReferenceError_1 = YAMLReferenceError;
var YAMLSemanticError_1 = YAMLSemanticError;
var YAMLSyntaxError_1 = YAMLSyntaxError;
var YAMLWarning_1 = YAMLWarning;
var _defineProperty_1 = _defineProperty;
var defaultTagPrefix_1 = defaultTagPrefix;
var defaultTags_1 = defaultTags;

var PlainValueEc8e588e = {
	Char: Char_1,
	Node: Node_1,
	PlainValue: PlainValue_1,
	Range: Range_1,
	Type: Type_1,
	YAMLError: YAMLError_1,
	YAMLReferenceError: YAMLReferenceError_1,
	YAMLSemanticError: YAMLSemanticError_1,
	YAMLSyntaxError: YAMLSyntaxError_1,
	YAMLWarning: YAMLWarning_1,
	_defineProperty: _defineProperty_1,
	defaultTagPrefix: defaultTagPrefix_1,
	defaultTags: defaultTags_1
};

class BlankLine extends PlainValueEc8e588e.Node {
  constructor() {
    super(PlainValueEc8e588e.Type.BLANK_LINE);
  }
  /* istanbul ignore next */


  get includesTrailingLines() {
    // This is never called from anywhere, but if it were,
    // this is the value it should return.
    return true;
  }
  /**
   * Parses a blank line from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first \n character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    this.range = new PlainValueEc8e588e.Range(start, start + 1);
    return start + 1;
  }

}

class CollectionItem extends PlainValueEc8e588e.Node {
  constructor(type, props) {
    super(type, props);
    this.node = null;
  }

  get includesTrailingLines() {
    return !!this.node && this.node.includesTrailingLines;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context;
    let {
      atLineStart,
      lineStart
    } = context;
    if (!atLineStart && this.type === PlainValueEc8e588e.Type.SEQ_ITEM) this.error = new PlainValueEc8e588e.YAMLSemanticError(this, 'Sequence items must not have preceding content on the same line');
    const indent = atLineStart ? start - lineStart : context.indent;
    let offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, start + 1);
    let ch = src[offset];
    const inlineComment = ch === '#';
    const comments = [];
    let blankLine = null;

    while (ch === '\n' || ch === '#') {
      if (ch === '#') {
        const end = PlainValueEc8e588e.Node.endOfLine(src, offset + 1);
        comments.push(new PlainValueEc8e588e.Range(offset, end));
        offset = end;
      } else {
        atLineStart = true;
        lineStart = offset + 1;
        const wsEnd = PlainValueEc8e588e.Node.endOfWhiteSpace(src, lineStart);

        if (src[wsEnd] === '\n' && comments.length === 0) {
          blankLine = new BlankLine();
          lineStart = blankLine.parse({
            src
          }, lineStart);
        }

        offset = PlainValueEc8e588e.Node.endOfIndent(src, lineStart);
      }

      ch = src[offset];
    }

    if (PlainValueEc8e588e.Node.nextNodeIsIndented(ch, offset - (lineStart + indent), this.type !== PlainValueEc8e588e.Type.SEQ_ITEM)) {
      this.node = parseNode({
        atLineStart,
        inCollection: false,
        indent,
        lineStart,
        parent: this
      }, offset);
    } else if (ch && lineStart > start + 1) {
      offset = lineStart - 1;
    }

    if (this.node) {
      if (blankLine) {
        // Only blank lines preceding non-empty nodes are captured. Note that
        // this means that collection item range start indices do not always
        // increase monotonically. -- eemeli/yaml#126
        const items = context.parent.items || context.parent.contents;
        if (items) items.push(blankLine);
      }

      if (comments.length) Array.prototype.push.apply(this.props, comments);
      offset = this.node.range.end;
    } else {
      if (inlineComment) {
        const c = comments[0];
        this.props.push(c);
        offset = c.end;
      } else {
        offset = PlainValueEc8e588e.Node.endOfLine(src, start + 1);
      }
    }

    const end = this.node ? this.node.valueRange.end : offset;
    this.valueRange = new PlainValueEc8e588e.Range(start, end);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    return this.node ? this.node.setOrigRanges(cr, offset) : offset;
  }

  toString() {
    const {
      context: {
        src
      },
      node,
      range,
      value
    } = this;
    if (value != null) return value;
    const str = node ? src.slice(range.start, node.range.start) + String(node) : src.slice(range.start, range.end);
    return PlainValueEc8e588e.Node.addStringTerminator(src, range.end, str);
  }

}

class Comment extends PlainValueEc8e588e.Node {
  constructor() {
    super(PlainValueEc8e588e.Type.COMMENT);
  }
  /**
   * Parses a comment line from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const offset = this.parseComment(start);
    this.range = new PlainValueEc8e588e.Range(start, offset);
    return offset;
  }

}

function grabCollectionEndComments(node) {
  let cnode = node;

  while (cnode instanceof CollectionItem) cnode = cnode.node;

  if (!(cnode instanceof Collection)) return null;
  const len = cnode.items.length;
  let ci = -1;

  for (let i = len - 1; i >= 0; --i) {
    const n = cnode.items[i];

    if (n.type === PlainValueEc8e588e.Type.COMMENT) {
      // Keep sufficiently indented comments with preceding node
      const {
        indent,
        lineStart
      } = n.context;
      if (indent > 0 && n.range.start >= lineStart + indent) break;
      ci = i;
    } else if (n.type === PlainValueEc8e588e.Type.BLANK_LINE) ci = i;else break;
  }

  if (ci === -1) return null;
  const ca = cnode.items.splice(ci, len - ci);
  const prevEnd = ca[0].range.start;

  while (true) {
    cnode.range.end = prevEnd;
    if (cnode.valueRange && cnode.valueRange.end > prevEnd) cnode.valueRange.end = prevEnd;
    if (cnode === node) break;
    cnode = cnode.context.parent;
  }

  return ca;
}
class Collection extends PlainValueEc8e588e.Node {
  static nextContentHasIndent(src, offset, indent) {
    const lineStart = PlainValueEc8e588e.Node.endOfLine(src, offset) + 1;
    offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, lineStart);
    const ch = src[offset];
    if (!ch) return false;
    if (offset >= lineStart + indent) return true;
    if (ch !== '#' && ch !== '\n') return false;
    return Collection.nextContentHasIndent(src, offset, indent);
  }

  constructor(firstItem) {
    super(firstItem.type === PlainValueEc8e588e.Type.SEQ_ITEM ? PlainValueEc8e588e.Type.SEQ : PlainValueEc8e588e.Type.MAP);

    for (let i = firstItem.props.length - 1; i >= 0; --i) {
      if (firstItem.props[i].start < firstItem.context.lineStart) {
        // props on previous line are assumed by the collection
        this.props = firstItem.props.slice(0, i + 1);
        firstItem.props = firstItem.props.slice(i + 1);
        const itemRange = firstItem.props[0] || firstItem.valueRange;
        firstItem.range.start = itemRange.start;
        break;
      }
    }

    this.items = [firstItem];
    const ec = grabCollectionEndComments(firstItem);
    if (ec) Array.prototype.push.apply(this.items, ec);
  }

  get includesTrailingLines() {
    return this.items.length > 0;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context; // It's easier to recalculate lineStart here rather than tracking down the
    // last context from which to read it -- eemeli/yaml#2

    let lineStart = PlainValueEc8e588e.Node.startOfLine(src, start);
    const firstItem = this.items[0]; // First-item context needs to be correct for later comment handling
    // -- eemeli/yaml#17

    firstItem.context.parent = this;
    this.valueRange = PlainValueEc8e588e.Range.copy(firstItem.valueRange);
    const indent = firstItem.range.start - firstItem.context.lineStart;
    let offset = start;
    offset = PlainValueEc8e588e.Node.normalizeOffset(src, offset);
    let ch = src[offset];
    let atLineStart = PlainValueEc8e588e.Node.endOfWhiteSpace(src, lineStart) === offset;
    let prevIncludesTrailingLines = false;

    while (ch) {
      while (ch === '\n' || ch === '#') {
        if (atLineStart && ch === '\n' && !prevIncludesTrailingLines) {
          const blankLine = new BlankLine();
          offset = blankLine.parse({
            src
          }, offset);
          this.valueRange.end = offset;

          if (offset >= src.length) {
            ch = null;
            break;
          }

          this.items.push(blankLine);
          offset -= 1; // blankLine.parse() consumes terminal newline
        } else if (ch === '#') {
          if (offset < lineStart + indent && !Collection.nextContentHasIndent(src, offset, indent)) {
            return offset;
          }

          const comment = new Comment();
          offset = comment.parse({
            indent,
            lineStart,
            src
          }, offset);
          this.items.push(comment);
          this.valueRange.end = offset;

          if (offset >= src.length) {
            ch = null;
            break;
          }
        }

        lineStart = offset + 1;
        offset = PlainValueEc8e588e.Node.endOfIndent(src, lineStart);

        if (PlainValueEc8e588e.Node.atBlank(src, offset)) {
          const wsEnd = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
          const next = src[wsEnd];

          if (!next || next === '\n' || next === '#') {
            offset = wsEnd;
          }
        }

        ch = src[offset];
        atLineStart = true;
      }

      if (!ch) {
        break;
      }

      if (offset !== lineStart + indent && (atLineStart || ch !== ':')) {
        if (offset < lineStart + indent) {
          if (lineStart > start) offset = lineStart;
          break;
        } else if (!this.error) {
          const msg = 'All collection items must start at the same column';
          this.error = new PlainValueEc8e588e.YAMLSyntaxError(this, msg);
        }
      }

      if (firstItem.type === PlainValueEc8e588e.Type.SEQ_ITEM) {
        if (ch !== '-') {
          if (lineStart > start) offset = lineStart;
          break;
        }
      } else if (ch === '-' && !this.error) {
        // map key may start with -, as long as it's followed by a non-whitespace char
        const next = src[offset + 1];

        if (!next || next === '\n' || next === '\t' || next === ' ') {
          const msg = 'A collection cannot be both a mapping and a sequence';
          this.error = new PlainValueEc8e588e.YAMLSyntaxError(this, msg);
        }
      }

      const node = parseNode({
        atLineStart,
        inCollection: true,
        indent,
        lineStart,
        parent: this
      }, offset);
      if (!node) return offset; // at next document start

      this.items.push(node);
      this.valueRange.end = node.valueRange.end;
      offset = PlainValueEc8e588e.Node.normalizeOffset(src, node.range.end);
      ch = src[offset];
      atLineStart = false;
      prevIncludesTrailingLines = node.includesTrailingLines; // Need to reset lineStart and atLineStart here if preceding node's range
      // has advanced to check the current line's indentation level
      // -- eemeli/yaml#10 & eemeli/yaml#38

      if (ch) {
        let ls = offset - 1;
        let prev = src[ls];

        while (prev === ' ' || prev === '\t') prev = src[--ls];

        if (prev === '\n') {
          lineStart = ls + 1;
          atLineStart = true;
        }
      }

      const ec = grabCollectionEndComments(node);
      if (ec) Array.prototype.push.apply(this.items, ec);
    }

    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.items.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      items,
      range,
      value
    } = this;
    if (value != null) return value;
    let str = src.slice(range.start, items[0].range.start) + String(items[0]);

    for (let i = 1; i < items.length; ++i) {
      const item = items[i];
      const {
        atLineStart,
        indent
      } = item.context;
      if (atLineStart) for (let i = 0; i < indent; ++i) str += ' ';
      str += String(item);
    }

    return PlainValueEc8e588e.Node.addStringTerminator(src, range.end, str);
  }

}

class Directive extends PlainValueEc8e588e.Node {
  constructor() {
    super(PlainValueEc8e588e.Type.DIRECTIVE);
    this.name = null;
  }

  get parameters() {
    const raw = this.rawValue;
    return raw ? raw.trim().split(/[ \t]+/) : [];
  }

  parseName(start) {
    const {
      src
    } = this.context;
    let offset = start;
    let ch = src[offset];

    while (ch && ch !== '\n' && ch !== '\t' && ch !== ' ') ch = src[offset += 1];

    this.name = src.slice(start, offset);
    return offset;
  }

  parseParameters(start) {
    const {
      src
    } = this.context;
    let offset = start;
    let ch = src[offset];

    while (ch && ch !== '\n' && ch !== '#') ch = src[offset += 1];

    this.valueRange = new PlainValueEc8e588e.Range(start, offset);
    return offset;
  }

  parse(context, start) {
    this.context = context;
    let offset = this.parseName(start + 1);
    offset = this.parseParameters(offset);
    offset = this.parseComment(offset);
    this.range = new PlainValueEc8e588e.Range(start, offset);
    return offset;
  }

}

class Document extends PlainValueEc8e588e.Node {
  static startCommentOrEndBlankLine(src, start) {
    const offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, start);
    const ch = src[offset];
    return ch === '#' || ch === '\n' ? offset : start;
  }

  constructor() {
    super(PlainValueEc8e588e.Type.DOCUMENT);
    this.directives = null;
    this.contents = null;
    this.directivesEndMarker = null;
    this.documentEndMarker = null;
  }

  parseDirectives(start) {
    const {
      src
    } = this.context;
    this.directives = [];
    let atLineStart = true;
    let hasDirectives = false;
    let offset = start;

    while (!PlainValueEc8e588e.Node.atDocumentBoundary(src, offset, PlainValueEc8e588e.Char.DIRECTIVES_END)) {
      offset = Document.startCommentOrEndBlankLine(src, offset);

      switch (src[offset]) {
        case '\n':
          if (atLineStart) {
            const blankLine = new BlankLine();
            offset = blankLine.parse({
              src
            }, offset);

            if (offset < src.length) {
              this.directives.push(blankLine);
            }
          } else {
            offset += 1;
            atLineStart = true;
          }

          break;

        case '#':
          {
            const comment = new Comment();
            offset = comment.parse({
              src
            }, offset);
            this.directives.push(comment);
            atLineStart = false;
          }
          break;

        case '%':
          {
            const directive = new Directive();
            offset = directive.parse({
              parent: this,
              src
            }, offset);
            this.directives.push(directive);
            hasDirectives = true;
            atLineStart = false;
          }
          break;

        default:
          if (hasDirectives) {
            this.error = new PlainValueEc8e588e.YAMLSemanticError(this, 'Missing directives-end indicator line');
          } else if (this.directives.length > 0) {
            this.contents = this.directives;
            this.directives = [];
          }

          return offset;
      }
    }

    if (src[offset]) {
      this.directivesEndMarker = new PlainValueEc8e588e.Range(offset, offset + 3);
      return offset + 3;
    }

    if (hasDirectives) {
      this.error = new PlainValueEc8e588e.YAMLSemanticError(this, 'Missing directives-end indicator line');
    } else if (this.directives.length > 0) {
      this.contents = this.directives;
      this.directives = [];
    }

    return offset;
  }

  parseContents(start) {
    const {
      parseNode,
      src
    } = this.context;
    if (!this.contents) this.contents = [];
    let lineStart = start;

    while (src[lineStart - 1] === '-') lineStart -= 1;

    let offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, start);
    let atLineStart = lineStart === start;
    this.valueRange = new PlainValueEc8e588e.Range(offset);

    while (!PlainValueEc8e588e.Node.atDocumentBoundary(src, offset, PlainValueEc8e588e.Char.DOCUMENT_END)) {
      switch (src[offset]) {
        case '\n':
          if (atLineStart) {
            const blankLine = new BlankLine();
            offset = blankLine.parse({
              src
            }, offset);

            if (offset < src.length) {
              this.contents.push(blankLine);
            }
          } else {
            offset += 1;
            atLineStart = true;
          }

          lineStart = offset;
          break;

        case '#':
          {
            const comment = new Comment();
            offset = comment.parse({
              src
            }, offset);
            this.contents.push(comment);
            atLineStart = false;
          }
          break;

        default:
          {
            const iEnd = PlainValueEc8e588e.Node.endOfIndent(src, offset);
            const context = {
              atLineStart,
              indent: -1,
              inFlow: false,
              inCollection: false,
              lineStart,
              parent: this
            };
            const node = parseNode(context, iEnd);
            if (!node) return this.valueRange.end = iEnd; // at next document start

            this.contents.push(node);
            offset = node.range.end;
            atLineStart = false;
            const ec = grabCollectionEndComments(node);
            if (ec) Array.prototype.push.apply(this.contents, ec);
          }
      }

      offset = Document.startCommentOrEndBlankLine(src, offset);
    }

    this.valueRange.end = offset;

    if (src[offset]) {
      this.documentEndMarker = new PlainValueEc8e588e.Range(offset, offset + 3);
      offset += 3;

      if (src[offset]) {
        offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);

        if (src[offset] === '#') {
          const comment = new Comment();
          offset = comment.parse({
            src
          }, offset);
          this.contents.push(comment);
        }

        switch (src[offset]) {
          case '\n':
            offset += 1;
            break;

          case undefined:
            break;

          default:
            this.error = new PlainValueEc8e588e.YAMLSyntaxError(this, 'Document end marker line cannot have a non-comment suffix');
        }
      }
    }

    return offset;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    context.root = this;
    this.context = context;
    const {
      src
    } = context;
    let offset = src.charCodeAt(start) === 0xfeff ? start + 1 : start; // skip BOM

    offset = this.parseDirectives(offset);
    offset = this.parseContents(offset);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.directives.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    if (this.directivesEndMarker) offset = this.directivesEndMarker.setOrigRange(cr, offset);
    this.contents.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    if (this.documentEndMarker) offset = this.documentEndMarker.setOrigRange(cr, offset);
    return offset;
  }

  toString() {
    const {
      contents,
      directives,
      value
    } = this;
    if (value != null) return value;
    let str = directives.join('');

    if (contents.length > 0) {
      if (directives.length > 0 || contents[0].type === PlainValueEc8e588e.Type.COMMENT) str += '---\n';
      str += contents.join('');
    }

    if (str[str.length - 1] !== '\n') str += '\n';
    return str;
  }

}

class Alias extends PlainValueEc8e588e.Node {
  /**
   * Parses an *alias from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */
  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = PlainValueEc8e588e.Node.endOfIdentifier(src, start + 1);
    this.valueRange = new PlainValueEc8e588e.Range(start + 1, offset);
    offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

const Chomp = {
  CLIP: 'CLIP',
  KEEP: 'KEEP',
  STRIP: 'STRIP'
};
class BlockValue extends PlainValueEc8e588e.Node {
  constructor(type, props) {
    super(type, props);
    this.blockIndent = null;
    this.chomping = Chomp.CLIP;
    this.header = null;
  }

  get includesTrailingLines() {
    return this.chomping === Chomp.KEEP;
  }

  get strValue() {
    if (!this.valueRange || !this.context) return null;
    let {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (this.valueRange.isEmpty()) return '';
    let lastNewLine = null;
    let ch = src[end - 1];

    while (ch === '\n' || ch === '\t' || ch === ' ') {
      end -= 1;

      if (end <= start) {
        if (this.chomping === Chomp.KEEP) break;else return ''; // probably never happens
      }

      if (ch === '\n') lastNewLine = end;
      ch = src[end - 1];
    }

    let keepStart = end + 1;

    if (lastNewLine) {
      if (this.chomping === Chomp.KEEP) {
        keepStart = lastNewLine;
        end = this.valueRange.end;
      } else {
        end = lastNewLine;
      }
    }

    const bi = indent + this.blockIndent;
    const folded = this.type === PlainValueEc8e588e.Type.BLOCK_FOLDED;
    let atStart = true;
    let str = '';
    let sep = '';
    let prevMoreIndented = false;

    for (let i = start; i < end; ++i) {
      for (let j = 0; j < bi; ++j) {
        if (src[i] !== ' ') break;
        i += 1;
      }

      const ch = src[i];

      if (ch === '\n') {
        if (sep === '\n') str += '\n';else sep = '\n';
      } else {
        const lineEnd = PlainValueEc8e588e.Node.endOfLine(src, i);
        const line = src.slice(i, lineEnd);
        i = lineEnd;

        if (folded && (ch === ' ' || ch === '\t') && i < keepStart) {
          if (sep === ' ') sep = '\n';else if (!prevMoreIndented && !atStart && sep === '\n') sep = '\n\n';
          str += sep + line; //+ ((lineEnd < end && src[lineEnd]) || '')

          sep = lineEnd < end && src[lineEnd] || '';
          prevMoreIndented = true;
        } else {
          str += sep + line;
          sep = folded && i < keepStart ? ' ' : '\n';
          prevMoreIndented = false;
        }

        if (atStart && line !== '') atStart = false;
      }
    }

    return this.chomping === Chomp.STRIP ? str : str + '\n';
  }

  parseBlockHeader(start) {
    const {
      src
    } = this.context;
    let offset = start + 1;
    let bi = '';

    while (true) {
      const ch = src[offset];

      switch (ch) {
        case '-':
          this.chomping = Chomp.STRIP;
          break;

        case '+':
          this.chomping = Chomp.KEEP;
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          bi += ch;
          break;

        default:
          this.blockIndent = Number(bi) || null;
          this.header = new PlainValueEc8e588e.Range(start, offset);
          return offset;
      }

      offset += 1;
    }
  }

  parseBlockValue(start) {
    const {
      indent,
      src
    } = this.context;
    const explicit = !!this.blockIndent;
    let offset = start;
    let valueEnd = start;
    let minBlockIndent = 1;

    for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
      offset += 1;
      if (PlainValueEc8e588e.Node.atDocumentBoundary(src, offset)) break;
      const end = PlainValueEc8e588e.Node.endOfBlockIndent(src, indent, offset); // should not include tab?

      if (end === null) break;
      const ch = src[end];
      const lineIndent = end - (offset + indent);

      if (!this.blockIndent) {
        // no explicit block indent, none yet detected
        if (src[end] !== '\n') {
          // first line with non-whitespace content
          if (lineIndent < minBlockIndent) {
            const msg = 'Block scalars with more-indented leading empty lines must use an explicit indentation indicator';
            this.error = new PlainValueEc8e588e.YAMLSemanticError(this, msg);
          }

          this.blockIndent = lineIndent;
        } else if (lineIndent > minBlockIndent) {
          // empty line with more whitespace
          minBlockIndent = lineIndent;
        }
      } else if (ch && ch !== '\n' && lineIndent < this.blockIndent) {
        if (src[end] === '#') break;

        if (!this.error) {
          const src = explicit ? 'explicit indentation indicator' : 'first line';
          const msg = `Block scalars must not be less indented than their ${src}`;
          this.error = new PlainValueEc8e588e.YAMLSemanticError(this, msg);
        }
      }

      if (src[end] === '\n') {
        offset = end;
      } else {
        offset = valueEnd = PlainValueEc8e588e.Node.endOfLine(src, end);
      }
    }

    if (this.chomping !== Chomp.KEEP) {
      offset = src[valueEnd] ? valueEnd + 1 : valueEnd;
    }

    this.valueRange = new PlainValueEc8e588e.Range(start + 1, offset);
    return offset;
  }
  /**
   * Parses a block value from the source
   *
   * Accepted forms are:
   * ```
   * BS
   * block
   * lines
   *
   * BS #comment
   * block
   * lines
   * ```
   * where the block style BS matches the regexp `[|>][-+1-9]*` and block lines
   * are empty or have an indent level greater than `indent`.
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this block
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = this.parseBlockHeader(start);
    offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    offset = this.parseBlockValue(offset);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    return this.header ? this.header.setOrigRange(cr, offset) : offset;
  }

}

class FlowCollection extends PlainValueEc8e588e.Node {
  constructor(type, props) {
    super(type, props);
    this.items = null;
  }

  prevNodeIsJsonLike(idx = this.items.length) {
    const node = this.items[idx - 1];
    return !!node && (node.jsonLike || node.type === PlainValueEc8e588e.Type.COMMENT && this.prevNodeIsJsonLike(idx - 1));
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context;
    let {
      indent,
      lineStart
    } = context;
    let char = src[start]; // { or [

    this.items = [{
      char,
      offset: start
    }];
    let offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, start + 1);
    char = src[offset];

    while (char && char !== ']' && char !== '}') {
      switch (char) {
        case '\n':
          {
            lineStart = offset + 1;
            const wsEnd = PlainValueEc8e588e.Node.endOfWhiteSpace(src, lineStart);

            if (src[wsEnd] === '\n') {
              const blankLine = new BlankLine();
              lineStart = blankLine.parse({
                src
              }, lineStart);
              this.items.push(blankLine);
            }

            offset = PlainValueEc8e588e.Node.endOfIndent(src, lineStart);

            if (offset <= lineStart + indent) {
              char = src[offset];

              if (offset < lineStart + indent || char !== ']' && char !== '}') {
                const msg = 'Insufficient indentation in flow collection';
                this.error = new PlainValueEc8e588e.YAMLSemanticError(this, msg);
              }
            }
          }
          break;

        case ',':
          {
            this.items.push({
              char,
              offset
            });
            offset += 1;
          }
          break;

        case '#':
          {
            const comment = new Comment();
            offset = comment.parse({
              src
            }, offset);
            this.items.push(comment);
          }
          break;

        case '?':
        case ':':
          {
            const next = src[offset + 1];

            if (next === '\n' || next === '\t' || next === ' ' || next === ',' || // in-flow : after JSON-like key does not need to be followed by whitespace
            char === ':' && this.prevNodeIsJsonLike()) {
              this.items.push({
                char,
                offset
              });
              offset += 1;
              break;
            }
          }
        // fallthrough

        default:
          {
            const node = parseNode({
              atLineStart: false,
              inCollection: false,
              inFlow: true,
              indent: -1,
              lineStart,
              parent: this
            }, offset);

            if (!node) {
              // at next document start
              this.valueRange = new PlainValueEc8e588e.Range(start, offset);
              return offset;
            }

            this.items.push(node);
            offset = PlainValueEc8e588e.Node.normalizeOffset(src, node.range.end);
          }
      }

      offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
      char = src[offset];
    }

    this.valueRange = new PlainValueEc8e588e.Range(start, offset + 1);

    if (char) {
      this.items.push({
        char,
        offset
      });
      offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset + 1);
      offset = this.parseComment(offset);
    }

    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.items.forEach(node => {
      if (node instanceof PlainValueEc8e588e.Node) {
        offset = node.setOrigRanges(cr, offset);
      } else if (cr.length === 0) {
        node.origOffset = node.offset;
      } else {
        let i = offset;

        while (i < cr.length) {
          if (cr[i] > node.offset) break;else ++i;
        }

        node.origOffset = node.offset + i;
        offset = i;
      }
    });
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      items,
      range,
      value
    } = this;
    if (value != null) return value;
    const nodes = items.filter(item => item instanceof PlainValueEc8e588e.Node);
    let str = '';
    let prevEnd = range.start;
    nodes.forEach(node => {
      const prefix = src.slice(prevEnd, node.range.start);
      prevEnd = node.range.end;
      str += prefix + String(node);

      if (str[str.length - 1] === '\n' && src[prevEnd - 1] !== '\n' && src[prevEnd] === '\n') {
        // Comment range does not include the terminal newline, but its
        // stringified value does. Without this fix, newlines at comment ends
        // get duplicated.
        prevEnd += 1;
      }
    });
    str += src.slice(prevEnd, range.end);
    return PlainValueEc8e588e.Node.addStringTerminator(src, range.end, str);
  }

}

class QuoteDouble extends PlainValueEc8e588e.Node {
  static endOfQuote(src, offset) {
    let ch = src[offset];

    while (ch && ch !== '"') {
      offset += ch === '\\' ? 2 : 1;
      ch = src[offset];
    }

    return offset + 1;
  }
  /**
   * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
   */


  get strValue() {
    if (!this.valueRange || !this.context) return null;
    const errors = [];
    const {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (src[end - 1] !== '"') errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, 'Missing closing "quote')); // Using String#replace is too painful with escaped newlines preceded by
    // escaped backslashes; also, this should be faster.

    let str = '';

    for (let i = start + 1; i < end - 1; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        if (PlainValueEc8e588e.Node.atDocumentBoundary(src, i + 1)) errors.push(new PlainValueEc8e588e.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));
        const {
          fold,
          offset,
          error
        } = PlainValueEc8e588e.Node.foldNewline(src, i, indent);
        str += fold;
        i = offset;
        if (error) errors.push(new PlainValueEc8e588e.YAMLSemanticError(this, 'Multi-line double-quoted string needs to be sufficiently indented'));
      } else if (ch === '\\') {
        i += 1;

        switch (src[i]) {
          case '0':
            str += '\0';
            break;
          // null character

          case 'a':
            str += '\x07';
            break;
          // bell character

          case 'b':
            str += '\b';
            break;
          // backspace

          case 'e':
            str += '\x1b';
            break;
          // escape character

          case 'f':
            str += '\f';
            break;
          // form feed

          case 'n':
            str += '\n';
            break;
          // line feed

          case 'r':
            str += '\r';
            break;
          // carriage return

          case 't':
            str += '\t';
            break;
          // horizontal tab

          case 'v':
            str += '\v';
            break;
          // vertical tab

          case 'N':
            str += '\u0085';
            break;
          // Unicode next line

          case '_':
            str += '\u00a0';
            break;
          // Unicode non-breaking space

          case 'L':
            str += '\u2028';
            break;
          // Unicode line separator

          case 'P':
            str += '\u2029';
            break;
          // Unicode paragraph separator

          case ' ':
            str += ' ';
            break;

          case '"':
            str += '"';
            break;

          case '/':
            str += '/';
            break;

          case '\\':
            str += '\\';
            break;

          case '\t':
            str += '\t';
            break;

          case 'x':
            str += this.parseCharCode(i + 1, 2, errors);
            i += 2;
            break;

          case 'u':
            str += this.parseCharCode(i + 1, 4, errors);
            i += 4;
            break;

          case 'U':
            str += this.parseCharCode(i + 1, 8, errors);
            i += 8;
            break;

          case '\n':
            // skip escaped newlines, but still trim the following line
            while (src[i + 1] === ' ' || src[i + 1] === '\t') i += 1;

            break;

          default:
            errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(i - 1, 2)}`));
            str += '\\' + src[i];
        }
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (next === ' ' || next === '\t') {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return errors.length > 0 ? {
      errors,
      str
    } : str;
  }

  parseCharCode(offset, length, errors) {
    const {
      src
    } = this.context;
    const cc = src.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;

    if (isNaN(code)) {
      errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(offset - 2, length + 2)}`));
      return src.substr(offset - 2, length + 2);
    }

    return String.fromCodePoint(code);
  }
  /**
   * Parses a "double quoted" value from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = QuoteDouble.endOfQuote(src, start + 1);
    this.valueRange = new PlainValueEc8e588e.Range(start, offset);
    offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

class QuoteSingle extends PlainValueEc8e588e.Node {
  static endOfQuote(src, offset) {
    let ch = src[offset];

    while (ch) {
      if (ch === "'") {
        if (src[offset + 1] !== "'") break;
        ch = src[offset += 2];
      } else {
        ch = src[offset += 1];
      }
    }

    return offset + 1;
  }
  /**
   * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
   */


  get strValue() {
    if (!this.valueRange || !this.context) return null;
    const errors = [];
    const {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (src[end - 1] !== "'") errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, "Missing closing 'quote"));
    let str = '';

    for (let i = start + 1; i < end - 1; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        if (PlainValueEc8e588e.Node.atDocumentBoundary(src, i + 1)) errors.push(new PlainValueEc8e588e.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));
        const {
          fold,
          offset,
          error
        } = PlainValueEc8e588e.Node.foldNewline(src, i, indent);
        str += fold;
        i = offset;
        if (error) errors.push(new PlainValueEc8e588e.YAMLSemanticError(this, 'Multi-line single-quoted string needs to be sufficiently indented'));
      } else if (ch === "'") {
        str += ch;
        i += 1;
        if (src[i] !== "'") errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, 'Unescaped single quote? This should not happen.'));
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (next === ' ' || next === '\t') {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return errors.length > 0 ? {
      errors,
      str
    } : str;
  }
  /**
   * Parses a 'single quoted' value from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = QuoteSingle.endOfQuote(src, start + 1);
    this.valueRange = new PlainValueEc8e588e.Range(start, offset);
    offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

function createNewNode(type, props) {
  switch (type) {
    case PlainValueEc8e588e.Type.ALIAS:
      return new Alias(type, props);

    case PlainValueEc8e588e.Type.BLOCK_FOLDED:
    case PlainValueEc8e588e.Type.BLOCK_LITERAL:
      return new BlockValue(type, props);

    case PlainValueEc8e588e.Type.FLOW_MAP:
    case PlainValueEc8e588e.Type.FLOW_SEQ:
      return new FlowCollection(type, props);

    case PlainValueEc8e588e.Type.MAP_KEY:
    case PlainValueEc8e588e.Type.MAP_VALUE:
    case PlainValueEc8e588e.Type.SEQ_ITEM:
      return new CollectionItem(type, props);

    case PlainValueEc8e588e.Type.COMMENT:
    case PlainValueEc8e588e.Type.PLAIN:
      return new PlainValueEc8e588e.PlainValue(type, props);

    case PlainValueEc8e588e.Type.QUOTE_DOUBLE:
      return new QuoteDouble(type, props);

    case PlainValueEc8e588e.Type.QUOTE_SINGLE:
      return new QuoteSingle(type, props);

    /* istanbul ignore next */

    default:
      return null;
    // should never happen
  }
}
/**
 * @param {boolean} atLineStart - Node starts at beginning of line
 * @param {boolean} inFlow - true if currently in a flow context
 * @param {boolean} inCollection - true if currently in a collection context
 * @param {number} indent - Current level of indentation
 * @param {number} lineStart - Start of the current line
 * @param {Node} parent - The parent of the node
 * @param {string} src - Source of the YAML document
 */


class ParseContext {
  static parseType(src, offset, inFlow) {
    switch (src[offset]) {
      case '*':
        return PlainValueEc8e588e.Type.ALIAS;

      case '>':
        return PlainValueEc8e588e.Type.BLOCK_FOLDED;

      case '|':
        return PlainValueEc8e588e.Type.BLOCK_LITERAL;

      case '{':
        return PlainValueEc8e588e.Type.FLOW_MAP;

      case '[':
        return PlainValueEc8e588e.Type.FLOW_SEQ;

      case '?':
        return !inFlow && PlainValueEc8e588e.Node.atBlank(src, offset + 1, true) ? PlainValueEc8e588e.Type.MAP_KEY : PlainValueEc8e588e.Type.PLAIN;

      case ':':
        return !inFlow && PlainValueEc8e588e.Node.atBlank(src, offset + 1, true) ? PlainValueEc8e588e.Type.MAP_VALUE : PlainValueEc8e588e.Type.PLAIN;

      case '-':
        return !inFlow && PlainValueEc8e588e.Node.atBlank(src, offset + 1, true) ? PlainValueEc8e588e.Type.SEQ_ITEM : PlainValueEc8e588e.Type.PLAIN;

      case '"':
        return PlainValueEc8e588e.Type.QUOTE_DOUBLE;

      case "'":
        return PlainValueEc8e588e.Type.QUOTE_SINGLE;

      default:
        return PlainValueEc8e588e.Type.PLAIN;
    }
  }

  constructor(orig = {}, {
    atLineStart,
    inCollection,
    inFlow,
    indent,
    lineStart,
    parent
  } = {}) {
    PlainValueEc8e588e._defineProperty(this, "parseNode", (overlay, start) => {
      if (PlainValueEc8e588e.Node.atDocumentBoundary(this.src, start)) return null;
      const context = new ParseContext(this, overlay);
      const {
        props,
        type,
        valueStart
      } = context.parseProps(start);
      const node = createNewNode(type, props);
      let offset = node.parse(context, valueStart);
      node.range = new PlainValueEc8e588e.Range(start, offset);
      /* istanbul ignore if */

      if (offset <= start) {
        // This should never happen, but if it does, let's make sure to at least
        // step one character forward to avoid a busy loop.
        node.error = new Error(`Node#parse consumed no characters`);
        node.error.parseEnd = offset;
        node.error.source = node;
        node.range.end = start + 1;
      }

      if (context.nodeStartsCollection(node)) {
        if (!node.error && !context.atLineStart && context.parent.type === PlainValueEc8e588e.Type.DOCUMENT) {
          node.error = new PlainValueEc8e588e.YAMLSyntaxError(node, 'Block collection must not have preceding content here (e.g. directives-end indicator)');
        }

        const collection = new Collection(node);
        offset = collection.parse(new ParseContext(context), offset);
        collection.range = new PlainValueEc8e588e.Range(start, offset);
        return collection;
      }

      return node;
    });

    this.atLineStart = atLineStart != null ? atLineStart : orig.atLineStart || false;
    this.inCollection = inCollection != null ? inCollection : orig.inCollection || false;
    this.inFlow = inFlow != null ? inFlow : orig.inFlow || false;
    this.indent = indent != null ? indent : orig.indent;
    this.lineStart = lineStart != null ? lineStart : orig.lineStart;
    this.parent = parent != null ? parent : orig.parent || {};
    this.root = orig.root;
    this.src = orig.src;
  }

  nodeStartsCollection(node) {
    const {
      inCollection,
      inFlow,
      src
    } = this;
    if (inCollection || inFlow) return false;
    if (node instanceof CollectionItem) return true; // check for implicit key

    let offset = node.range.end;
    if (src[offset] === '\n' || src[offset - 1] === '\n') return false;
    offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
    return src[offset] === ':';
  } // Anchor and tag are before type, which determines the node implementation
  // class; hence this intermediate step.


  parseProps(offset) {
    const {
      inFlow,
      parent,
      src
    } = this;
    const props = [];
    let lineHasProps = false;
    offset = this.atLineStart ? PlainValueEc8e588e.Node.endOfIndent(src, offset) : PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
    let ch = src[offset];

    while (ch === PlainValueEc8e588e.Char.ANCHOR || ch === PlainValueEc8e588e.Char.COMMENT || ch === PlainValueEc8e588e.Char.TAG || ch === '\n') {
      if (ch === '\n') {
        let inEnd = offset;
        let lineStart;

        do {
          lineStart = inEnd + 1;
          inEnd = PlainValueEc8e588e.Node.endOfIndent(src, lineStart);
        } while (src[inEnd] === '\n');

        const indentDiff = inEnd - (lineStart + this.indent);
        const noIndicatorAsIndent = parent.type === PlainValueEc8e588e.Type.SEQ_ITEM && parent.context.atLineStart;
        if (src[inEnd] !== '#' && !PlainValueEc8e588e.Node.nextNodeIsIndented(src[inEnd], indentDiff, !noIndicatorAsIndent)) break;
        this.atLineStart = true;
        this.lineStart = lineStart;
        lineHasProps = false;
        offset = inEnd;
      } else if (ch === PlainValueEc8e588e.Char.COMMENT) {
        const end = PlainValueEc8e588e.Node.endOfLine(src, offset + 1);
        props.push(new PlainValueEc8e588e.Range(offset, end));
        offset = end;
      } else {
        let end = PlainValueEc8e588e.Node.endOfIdentifier(src, offset + 1);

        if (ch === PlainValueEc8e588e.Char.TAG && src[end] === ',' && /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+,\d\d\d\d(-\d\d){0,2}\/\S/.test(src.slice(offset + 1, end + 13))) {
          // Let's presume we're dealing with a YAML 1.0 domain tag here, rather
          // than an empty but 'foo.bar' private-tagged node in a flow collection
          // followed without whitespace by a plain string starting with a year
          // or date divided by something.
          end = PlainValueEc8e588e.Node.endOfIdentifier(src, end + 5);
        }

        props.push(new PlainValueEc8e588e.Range(offset, end));
        lineHasProps = true;
        offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, end);
      }

      ch = src[offset];
    } // '- &a : b' has an anchor on an empty node


    if (lineHasProps && ch === ':' && PlainValueEc8e588e.Node.atBlank(src, offset + 1, true)) offset -= 1;
    const type = ParseContext.parseType(src, offset, inFlow);
    return {
      props,
      type,
      valueStart: offset
    };
  }
  /**
   * Parses a node from the source
   * @param {ParseContext} overlay
   * @param {number} start - Index of first non-whitespace character for the node
   * @returns {?Node} - null if at a document boundary
   */


}

// Published as 'yaml/parse-cst'
function parse(src) {
  const cr = [];

  if (src.indexOf('\r') !== -1) {
    src = src.replace(/\r\n?/g, (match, offset) => {
      if (match.length > 1) cr.push(offset);
      return '\n';
    });
  }

  const documents = [];
  let offset = 0;

  do {
    const doc = new Document();
    const context = new ParseContext({
      src
    });
    offset = doc.parse(context, offset);
    documents.push(doc);
  } while (offset < src.length);

  documents.setOrigRanges = () => {
    if (cr.length === 0) return false;

    for (let i = 1; i < cr.length; ++i) cr[i] -= i;

    let crOffset = 0;

    for (let i = 0; i < documents.length; ++i) {
      crOffset = documents[i].setOrigRanges(cr, crOffset);
    }

    cr.splice(0, cr.length);
    return true;
  };

  documents.toString = () => documents.join('...\n');

  return documents;
}

var parse_1 = parse;

var parseCst = {
	parse: parse_1
};

function addCommentBefore(str, indent, comment) {
  if (!comment) return str;
  const cc = comment.replace(/[\s\S]^/gm, `$&${indent}#`);
  return `#${cc}\n${indent}${str}`;
}
function addComment(str, indent, comment) {
  return !comment ? str : comment.indexOf('\n') === -1 ? `${str} #${comment}` : `${str}\n` + comment.replace(/^/gm, `${indent || ''}#`);
}

class Node$1 {}

function toJSON(value, arg, ctx) {
  if (Array.isArray(value)) return value.map((v, i) => toJSON(v, String(i), ctx));

  if (value && typeof value.toJSON === 'function') {
    const anchor = ctx && ctx.anchors && ctx.anchors.get(value);
    if (anchor) ctx.onCreate = res => {
      anchor.res = res;
      delete ctx.onCreate;
    };
    const res = value.toJSON(arg, ctx);
    if (anchor && ctx.onCreate) ctx.onCreate(res);
    return res;
  }

  if ((!ctx || !ctx.keep) && typeof value === 'bigint') return Number(value);
  return value;
}

class Scalar extends Node$1 {
  constructor(value) {
    super();
    this.value = value;
  }

  toJSON(arg, ctx) {
    return ctx && ctx.keep ? this.value : toJSON(this.value, arg, ctx);
  }

  toString() {
    return String(this.value);
  }

}

function collectionFromPath(schema, path, value) {
  let v = value;

  for (let i = path.length - 1; i >= 0; --i) {
    const k = path[i];

    if (Number.isInteger(k) && k >= 0) {
      const a = [];
      a[k] = v;
      v = a;
    } else {
      const o = {};
      Object.defineProperty(o, k, {
        value: v,
        writable: true,
        enumerable: true,
        configurable: true
      });
      v = o;
    }
  }

  return schema.createNode(v, false);
} // null, undefined, or an empty non-string iterable (e.g. [])


const isEmptyPath = path => path == null || typeof path === 'object' && path[Symbol.iterator]().next().done;
class Collection$1 extends Node$1 {
  constructor(schema) {
    super();

    PlainValueEc8e588e._defineProperty(this, "items", []);

    this.schema = schema;
  }

  addIn(path, value) {
    if (isEmptyPath(path)) this.add(value);else {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (node instanceof Collection$1) node.addIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }

  deleteIn([key, ...rest]) {
    if (rest.length === 0) return this.delete(key);
    const node = this.get(key, true);
    if (node instanceof Collection$1) return node.deleteIn(rest);else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
  }

  getIn([key, ...rest], keepScalar) {
    const node = this.get(key, true);
    if (rest.length === 0) return !keepScalar && node instanceof Scalar ? node.value : node;else return node instanceof Collection$1 ? node.getIn(rest, keepScalar) : undefined;
  }

  hasAllNullValues() {
    return this.items.every(node => {
      if (!node || node.type !== 'PAIR') return false;
      const n = node.value;
      return n == null || n instanceof Scalar && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }

  hasIn([key, ...rest]) {
    if (rest.length === 0) return this.has(key);
    const node = this.get(key, true);
    return node instanceof Collection$1 ? node.hasIn(rest) : false;
  }

  setIn([key, ...rest], value) {
    if (rest.length === 0) {
      this.set(key, value);
    } else {
      const node = this.get(key, true);
      if (node instanceof Collection$1) node.setIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  } // overridden in implementations

  /* istanbul ignore next */


  toJSON() {
    return null;
  }

  toString(ctx, {
    blockItem,
    flowChars,
    isMap,
    itemIndent
  }, onComment, onChompKeep) {
    const {
      indent,
      indentStep,
      stringify
    } = ctx;
    const inFlow = this.type === PlainValueEc8e588e.Type.FLOW_MAP || this.type === PlainValueEc8e588e.Type.FLOW_SEQ || ctx.inFlow;
    if (inFlow) itemIndent += indentStep;
    const allNullValues = isMap && this.hasAllNullValues();
    ctx = Object.assign({}, ctx, {
      allNullValues,
      indent: itemIndent,
      inFlow,
      type: null
    });
    let chompKeep = false;
    let hasItemWithNewLine = false;
    const nodes = this.items.reduce((nodes, item, i) => {
      let comment;

      if (item) {
        if (!chompKeep && item.spaceBefore) nodes.push({
          type: 'comment',
          str: ''
        });
        if (item.commentBefore) item.commentBefore.match(/^.*$/gm).forEach(line => {
          nodes.push({
            type: 'comment',
            str: `#${line}`
          });
        });
        if (item.comment) comment = item.comment;
        if (inFlow && (!chompKeep && item.spaceBefore || item.commentBefore || item.comment || item.key && (item.key.commentBefore || item.key.comment) || item.value && (item.value.commentBefore || item.value.comment))) hasItemWithNewLine = true;
      }

      chompKeep = false;
      let str = stringify(item, ctx, () => comment = null, () => chompKeep = true);
      if (inFlow && !hasItemWithNewLine && str.includes('\n')) hasItemWithNewLine = true;
      if (inFlow && i < this.items.length - 1) str += ',';
      str = addComment(str, itemIndent, comment);
      if (chompKeep && (comment || inFlow)) chompKeep = false;
      nodes.push({
        type: 'item',
        str
      });
      return nodes;
    }, []);
    let str;

    if (nodes.length === 0) {
      str = flowChars.start + flowChars.end;
    } else if (inFlow) {
      const {
        start,
        end
      } = flowChars;
      const strings = nodes.map(n => n.str);

      if (hasItemWithNewLine || strings.reduce((sum, str) => sum + str.length + 2, 2) > Collection$1.maxFlowStringSingleLineLength) {
        str = start;

        for (const s of strings) {
          str += s ? `\n${indentStep}${indent}${s}` : '\n';
        }

        str += `\n${indent}${end}`;
      } else {
        str = `${start} ${strings.join(' ')} ${end}`;
      }
    } else {
      const strings = nodes.map(blockItem);
      str = strings.shift();

      for (const s of strings) str += s ? `\n${indent}${s}` : '\n';
    }

    if (this.comment) {
      str += '\n' + this.comment.replace(/^/gm, `${indent}#`);
      if (onComment) onComment();
    } else if (chompKeep && onChompKeep) onChompKeep();

    return str;
  }

}

PlainValueEc8e588e._defineProperty(Collection$1, "maxFlowStringSingleLineLength", 60);

function asItemIndex(key) {
  let idx = key instanceof Scalar ? key.value : key;
  if (idx && typeof idx === 'string') idx = Number(idx);
  return Number.isInteger(idx) && idx >= 0 ? idx : null;
}

class YAMLSeq extends Collection$1 {
  add(value) {
    this.items.push(value);
  }

  delete(key) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') return false;
    const del = this.items.splice(idx, 1);
    return del.length > 0;
  }

  get(key, keepScalar) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') return undefined;
    const it = this.items[idx];
    return !keepScalar && it instanceof Scalar ? it.value : it;
  }

  has(key) {
    const idx = asItemIndex(key);
    return typeof idx === 'number' && idx < this.items.length;
  }

  set(key, value) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') throw new Error(`Expected a valid index, not ${key}.`);
    this.items[idx] = value;
  }

  toJSON(_, ctx) {
    const seq = [];
    if (ctx && ctx.onCreate) ctx.onCreate(seq);
    let i = 0;

    for (const item of this.items) seq.push(toJSON(item, String(i++), ctx));

    return seq;
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    return super.toString(ctx, {
      blockItem: n => n.type === 'comment' ? n.str : `- ${n.str}`,
      flowChars: {
        start: '[',
        end: ']'
      },
      isMap: false,
      itemIndent: (ctx.indent || '') + '  '
    }, onComment, onChompKeep);
  }

}

const stringifyKey = (key, jsKey, ctx) => {
  if (jsKey === null) return '';
  if (typeof jsKey !== 'object') return String(jsKey);
  if (key instanceof Node$1 && ctx && ctx.doc) return key.toString({
    anchors: Object.create(null),
    doc: ctx.doc,
    indent: '',
    indentStep: ctx.indentStep,
    inFlow: true,
    inStringifyKey: true,
    stringify: ctx.stringify
  });
  return JSON.stringify(jsKey);
};

class Pair extends Node$1 {
  constructor(key, value = null) {
    super();
    this.key = key;
    this.value = value;
    this.type = Pair.Type.PAIR;
  }

  get commentBefore() {
    return this.key instanceof Node$1 ? this.key.commentBefore : undefined;
  }

  set commentBefore(cb) {
    if (this.key == null) this.key = new Scalar(null);
    if (this.key instanceof Node$1) this.key.commentBefore = cb;else {
      const msg = 'Pair.commentBefore is an alias for Pair.key.commentBefore. To set it, the key must be a Node.';
      throw new Error(msg);
    }
  }

  addToJSMap(ctx, map) {
    const key = toJSON(this.key, '', ctx);

    if (map instanceof Map) {
      const value = toJSON(this.value, key, ctx);
      map.set(key, value);
    } else if (map instanceof Set) {
      map.add(key);
    } else {
      const stringKey = stringifyKey(this.key, key, ctx);
      const value = toJSON(this.value, stringKey, ctx);
      if (stringKey in map) Object.defineProperty(map, stringKey, {
        value,
        writable: true,
        enumerable: true,
        configurable: true
      });else map[stringKey] = value;
    }

    return map;
  }

  toJSON(_, ctx) {
    const pair = ctx && ctx.mapAsMap ? new Map() : {};
    return this.addToJSMap(ctx, pair);
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx || !ctx.doc) return JSON.stringify(this);
    const {
      indent: indentSize,
      indentSeq,
      simpleKeys
    } = ctx.doc.options;
    let {
      key,
      value
    } = this;
    let keyComment = key instanceof Node$1 && key.comment;

    if (simpleKeys) {
      if (keyComment) {
        throw new Error('With simple keys, key nodes cannot have comments');
      }

      if (key instanceof Collection$1) {
        const msg = 'With simple keys, collection cannot be used as a key value';
        throw new Error(msg);
      }
    }

    let explicitKey = !simpleKeys && (!key || keyComment || (key instanceof Node$1 ? key instanceof Collection$1 || key.type === PlainValueEc8e588e.Type.BLOCK_FOLDED || key.type === PlainValueEc8e588e.Type.BLOCK_LITERAL : typeof key === 'object'));
    const {
      doc,
      indent,
      indentStep,
      stringify
    } = ctx;
    ctx = Object.assign({}, ctx, {
      implicitKey: !explicitKey,
      indent: indent + indentStep
    });
    let chompKeep = false;
    let str = stringify(key, ctx, () => keyComment = null, () => chompKeep = true);
    str = addComment(str, ctx.indent, keyComment);

    if (!explicitKey && str.length > 1024) {
      if (simpleKeys) throw new Error('With simple keys, single line scalar must not span more than 1024 characters');
      explicitKey = true;
    }

    if (ctx.allNullValues && !simpleKeys) {
      if (this.comment) {
        str = addComment(str, ctx.indent, this.comment);
        if (onComment) onComment();
      } else if (chompKeep && !keyComment && onChompKeep) onChompKeep();

      return ctx.inFlow && !explicitKey ? str : `? ${str}`;
    }

    str = explicitKey ? `? ${str}\n${indent}:` : `${str}:`;

    if (this.comment) {
      // expected (but not strictly required) to be a single-line comment
      str = addComment(str, ctx.indent, this.comment);
      if (onComment) onComment();
    }

    let vcb = '';
    let valueComment = null;

    if (value instanceof Node$1) {
      if (value.spaceBefore) vcb = '\n';

      if (value.commentBefore) {
        const cs = value.commentBefore.replace(/^/gm, `${ctx.indent}#`);
        vcb += `\n${cs}`;
      }

      valueComment = value.comment;
    } else if (value && typeof value === 'object') {
      value = doc.schema.createNode(value, true);
    }

    ctx.implicitKey = false;
    if (!explicitKey && !this.comment && value instanceof Scalar) ctx.indentAtStart = str.length + 1;
    chompKeep = false;

    if (!indentSeq && indentSize >= 2 && !ctx.inFlow && !explicitKey && value instanceof YAMLSeq && value.type !== PlainValueEc8e588e.Type.FLOW_SEQ && !value.tag && !doc.anchors.getName(value)) {
      // If indentSeq === false, consider '- ' as part of indentation where possible
      ctx.indent = ctx.indent.substr(2);
    }

    const valueStr = stringify(value, ctx, () => valueComment = null, () => chompKeep = true);
    let ws = ' ';

    if (vcb || this.comment) {
      ws = `${vcb}\n${ctx.indent}`;
    } else if (!explicitKey && value instanceof Collection$1) {
      const flow = valueStr[0] === '[' || valueStr[0] === '{';
      if (!flow || valueStr.includes('\n')) ws = `\n${ctx.indent}`;
    } else if (valueStr[0] === '\n') ws = '';

    if (chompKeep && !valueComment && onChompKeep) onChompKeep();
    return addComment(str + ws + valueStr, ctx.indent, valueComment);
  }

}

PlainValueEc8e588e._defineProperty(Pair, "Type", {
  PAIR: 'PAIR',
  MERGE_PAIR: 'MERGE_PAIR'
});

const getAliasCount = (node, anchors) => {
  if (node instanceof Alias$1) {
    const anchor = anchors.get(node.source);
    return anchor.count * anchor.aliasCount;
  } else if (node instanceof Collection$1) {
    let count = 0;

    for (const item of node.items) {
      const c = getAliasCount(item, anchors);
      if (c > count) count = c;
    }

    return count;
  } else if (node instanceof Pair) {
    const kc = getAliasCount(node.key, anchors);
    const vc = getAliasCount(node.value, anchors);
    return Math.max(kc, vc);
  }

  return 1;
};

class Alias$1 extends Node$1 {
  static stringify({
    range,
    source
  }, {
    anchors,
    doc,
    implicitKey,
    inStringifyKey
  }) {
    let anchor = Object.keys(anchors).find(a => anchors[a] === source);
    if (!anchor && inStringifyKey) anchor = doc.anchors.getName(source) || doc.anchors.newName();
    if (anchor) return `*${anchor}${implicitKey ? ' ' : ''}`;
    const msg = doc.anchors.getName(source) ? 'Alias node must be after source node' : 'Source node not found for alias node';
    throw new Error(`${msg} [${range}]`);
  }

  constructor(source) {
    super();
    this.source = source;
    this.type = PlainValueEc8e588e.Type.ALIAS;
  }

  set tag(t) {
    throw new Error('Alias nodes cannot have tags');
  }

  toJSON(arg, ctx) {
    if (!ctx) return toJSON(this.source, arg, ctx);
    const {
      anchors,
      maxAliasCount
    } = ctx;
    const anchor = anchors.get(this.source);
    /* istanbul ignore if */

    if (!anchor || anchor.res === undefined) {
      const msg = 'This should not happen: Alias anchor was not resolved?';
      if (this.cstNode) throw new PlainValueEc8e588e.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
    }

    if (maxAliasCount >= 0) {
      anchor.count += 1;
      if (anchor.aliasCount === 0) anchor.aliasCount = getAliasCount(this.source, anchors);

      if (anchor.count * anchor.aliasCount > maxAliasCount) {
        const msg = 'Excessive alias count indicates a resource exhaustion attack';
        if (this.cstNode) throw new PlainValueEc8e588e.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
      }
    }

    return anchor.res;
  } // Only called when stringifying an alias mapping key while constructing
  // Object output.


  toString(ctx) {
    return Alias$1.stringify(this, ctx);
  }

}

PlainValueEc8e588e._defineProperty(Alias$1, "default", true);

function findPair(items, key) {
  const k = key instanceof Scalar ? key.value : key;

  for (const it of items) {
    if (it instanceof Pair) {
      if (it.key === key || it.key === k) return it;
      if (it.key && it.key.value === k) return it;
    }
  }

  return undefined;
}
class YAMLMap extends Collection$1 {
  add(pair, overwrite) {
    if (!pair) pair = new Pair(pair);else if (!(pair instanceof Pair)) pair = new Pair(pair.key || pair, pair.value);
    const prev = findPair(this.items, pair.key);
    const sortEntries = this.schema && this.schema.sortMapEntries;

    if (prev) {
      if (overwrite) prev.value = pair.value;else throw new Error(`Key ${pair.key} already set`);
    } else if (sortEntries) {
      const i = this.items.findIndex(item => sortEntries(pair, item) < 0);
      if (i === -1) this.items.push(pair);else this.items.splice(i, 0, pair);
    } else {
      this.items.push(pair);
    }
  }

  delete(key) {
    const it = findPair(this.items, key);
    if (!it) return false;
    const del = this.items.splice(this.items.indexOf(it), 1);
    return del.length > 0;
  }

  get(key, keepScalar) {
    const it = findPair(this.items, key);
    const node = it && it.value;
    return !keepScalar && node instanceof Scalar ? node.value : node;
  }

  has(key) {
    return !!findPair(this.items, key);
  }

  set(key, value) {
    this.add(new Pair(key, value), true);
  }
  /**
   * @param {*} arg ignored
   * @param {*} ctx Conversion context, originally set in Document#toJSON()
   * @param {Class} Type If set, forces the returned collection type
   * @returns {*} Instance of Type, Map, or Object
   */


  toJSON(_, ctx, Type) {
    const map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const item of this.items) item.addToJSMap(ctx, map);

    return map;
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);

    for (const item of this.items) {
      if (!(item instanceof Pair)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    }

    return super.toString(ctx, {
      blockItem: n => n.str,
      flowChars: {
        start: '{',
        end: '}'
      },
      isMap: true,
      itemIndent: ctx.indent || ''
    }, onComment, onChompKeep);
  }

}

const MERGE_KEY = '<<';
class Merge extends Pair {
  constructor(pair) {
    if (pair instanceof Pair) {
      let seq = pair.value;

      if (!(seq instanceof YAMLSeq)) {
        seq = new YAMLSeq();
        seq.items.push(pair.value);
        seq.range = pair.value.range;
      }

      super(pair.key, seq);
      this.range = pair.range;
    } else {
      super(new Scalar(MERGE_KEY), new YAMLSeq());
    }

    this.type = Pair.Type.MERGE_PAIR;
  } // If the value associated with a merge key is a single mapping node, each of
  // its key/value pairs is inserted into the current mapping, unless the key
  // already exists in it. If the value associated with the merge key is a
  // sequence, then this sequence is expected to contain mapping nodes and each
  // of these nodes is merged in turn according to its order in the sequence.
  // Keys in mapping nodes earlier in the sequence override keys specified in
  // later mapping nodes. -- http://yaml.org/type/merge.html


  addToJSMap(ctx, map) {
    for (const {
      source
    } of this.value.items) {
      if (!(source instanceof YAMLMap)) throw new Error('Merge sources must be maps');
      const srcMap = source.toJSON(null, ctx, Map);

      for (const [key, value] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key)) map.set(key, value);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
    }

    return map;
  }

  toString(ctx, onComment) {
    const seq = this.value;
    if (seq.items.length > 1) return super.toString(ctx, onComment);
    this.value = seq.items[0];
    const str = super.toString(ctx, onComment);
    this.value = seq;
    return str;
  }

}

const binaryOptions = {
  defaultType: PlainValueEc8e588e.Type.BLOCK_LITERAL,
  lineWidth: 76
};
const boolOptions = {
  trueStr: 'true',
  falseStr: 'false'
};
const intOptions = {
  asBigInt: false
};
const nullOptions = {
  nullStr: 'null'
};
const strOptions = {
  defaultType: PlainValueEc8e588e.Type.PLAIN,
  doubleQuoted: {
    jsonEncoding: false,
    minMultiLineLength: 40
  },
  fold: {
    lineWidth: 80,
    minContentWidth: 20
  }
};

function resolveScalar(str, tags, scalarFallback) {
  for (const {
    format,
    test,
    resolve
  } of tags) {
    if (test) {
      const match = str.match(test);

      if (match) {
        let res = resolve.apply(null, match);
        if (!(res instanceof Scalar)) res = new Scalar(res);
        if (format) res.format = format;
        return res;
      }
    }
  }

  if (scalarFallback) str = scalarFallback(str);
  return new Scalar(str);
}

const FOLD_FLOW = 'flow';
const FOLD_BLOCK = 'block';
const FOLD_QUOTED = 'quoted'; // presumes i+1 is at the start of a line
// returns index of last newline in more-indented block

const consumeMoreIndentedLines = (text, i) => {
  let ch = text[i + 1];

  while (ch === ' ' || ch === '\t') {
    do {
      ch = text[i += 1];
    } while (ch && ch !== '\n');

    ch = text[i + 1];
  }

  return i;
};
/**
 * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
 * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
 * terminated with `\n` and started with `indent`.
 *
 * @param {string} text
 * @param {string} indent
 * @param {string} [mode='flow'] `'block'` prevents more-indented lines
 *   from being folded; `'quoted'` allows for `\` escapes, including escaped
 *   newlines
 * @param {Object} options
 * @param {number} [options.indentAtStart] Accounts for leading contents on
 *   the first line, defaulting to `indent.length`
 * @param {number} [options.lineWidth=80]
 * @param {number} [options.minContentWidth=20] Allow highly indented lines to
 *   stretch the line width or indent content from the start
 * @param {function} options.onFold Called once if the text is folded
 * @param {function} options.onFold Called once if any line of text exceeds
 *   lineWidth characters
 */


function foldFlowLines(text, indent, mode, {
  indentAtStart,
  lineWidth = 80,
  minContentWidth = 20,
  onFold,
  onOverflow
}) {
  if (!lineWidth || lineWidth < 0) return text;
  const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
  if (text.length <= endStep) return text;
  const folds = [];
  const escapedFolds = {};
  let end = lineWidth - indent.length;

  if (typeof indentAtStart === 'number') {
    if (indentAtStart > lineWidth - Math.max(2, minContentWidth)) folds.push(0);else end = lineWidth - indentAtStart;
  }

  let split = undefined;
  let prev = undefined;
  let overflow = false;
  let i = -1;
  let escStart = -1;
  let escEnd = -1;

  if (mode === FOLD_BLOCK) {
    i = consumeMoreIndentedLines(text, i);
    if (i !== -1) end = i + endStep;
  }

  for (let ch; ch = text[i += 1];) {
    if (mode === FOLD_QUOTED && ch === '\\') {
      escStart = i;

      switch (text[i + 1]) {
        case 'x':
          i += 3;
          break;

        case 'u':
          i += 5;
          break;

        case 'U':
          i += 9;
          break;

        default:
          i += 1;
      }

      escEnd = i;
    }

    if (ch === '\n') {
      if (mode === FOLD_BLOCK) i = consumeMoreIndentedLines(text, i);
      end = i + endStep;
      split = undefined;
    } else {
      if (ch === ' ' && prev && prev !== ' ' && prev !== '\n' && prev !== '\t') {
        // space surrounded by non-space can be replaced with newline + indent
        const next = text[i + 1];
        if (next && next !== ' ' && next !== '\n' && next !== '\t') split = i;
      }

      if (i >= end) {
        if (split) {
          folds.push(split);
          end = split + endStep;
          split = undefined;
        } else if (mode === FOLD_QUOTED) {
          // white-space collected at end may stretch past lineWidth
          while (prev === ' ' || prev === '\t') {
            prev = ch;
            ch = text[i += 1];
            overflow = true;
          } // Account for newline escape, but don't break preceding escape


          const j = i > escEnd + 1 ? i - 2 : escStart - 1; // Bail out if lineWidth & minContentWidth are shorter than an escape string

          if (escapedFolds[j]) return text;
          folds.push(j);
          escapedFolds[j] = true;
          end = j + endStep;
          split = undefined;
        } else {
          overflow = true;
        }
      }
    }

    prev = ch;
  }

  if (overflow && onOverflow) onOverflow();
  if (folds.length === 0) return text;
  if (onFold) onFold();
  let res = text.slice(0, folds[0]);

  for (let i = 0; i < folds.length; ++i) {
    const fold = folds[i];
    const end = folds[i + 1] || text.length;
    if (fold === 0) res = `\n${indent}${text.slice(0, end)}`;else {
      if (mode === FOLD_QUOTED && escapedFolds[fold]) res += `${text[fold]}\\`;
      res += `\n${indent}${text.slice(fold + 1, end)}`;
    }
  }

  return res;
}

const getFoldOptions = ({
  indentAtStart
}) => indentAtStart ? Object.assign({
  indentAtStart
}, strOptions.fold) : strOptions.fold; // Also checks for lines starting with %, as parsing the output as YAML 1.1 will
// presume that's starting a new document.


const containsDocumentMarker = str => /^(%|---|\.\.\.)/m.test(str);

function lineLengthOverLimit(str, lineWidth, indentLength) {
  if (!lineWidth || lineWidth < 0) return false;
  const limit = lineWidth - indentLength;
  const strLen = str.length;
  if (strLen <= limit) return false;

  for (let i = 0, start = 0; i < strLen; ++i) {
    if (str[i] === '\n') {
      if (i - start > limit) return true;
      start = i + 1;
      if (strLen - start <= limit) return false;
    }
  }

  return true;
}

function doubleQuotedString(value, ctx) {
  const {
    implicitKey
  } = ctx;
  const {
    jsonEncoding,
    minMultiLineLength
  } = strOptions.doubleQuoted;
  const json = JSON.stringify(value);
  if (jsonEncoding) return json;
  const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
  let str = '';
  let start = 0;

  for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
      // space before newline needs to be escaped to not be folded
      str += json.slice(start, i) + '\\ ';
      i += 1;
      start = i;
      ch = '\\';
    }

    if (ch === '\\') switch (json[i + 1]) {
      case 'u':
        {
          str += json.slice(start, i);
          const code = json.substr(i + 2, 4);

          switch (code) {
            case '0000':
              str += '\\0';
              break;

            case '0007':
              str += '\\a';
              break;

            case '000b':
              str += '\\v';
              break;

            case '001b':
              str += '\\e';
              break;

            case '0085':
              str += '\\N';
              break;

            case '00a0':
              str += '\\_';
              break;

            case '2028':
              str += '\\L';
              break;

            case '2029':
              str += '\\P';
              break;

            default:
              if (code.substr(0, 2) === '00') str += '\\x' + code.substr(2);else str += json.substr(i, 6);
          }

          i += 5;
          start = i + 1;
        }
        break;

      case 'n':
        if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
          i += 1;
        } else {
          // folding will eat first newline
          str += json.slice(start, i) + '\n\n';

          while (json[i + 2] === '\\' && json[i + 3] === 'n' && json[i + 4] !== '"') {
            str += '\n';
            i += 2;
          }

          str += indent; // space after newline needs to be escaped to not be folded

          if (json[i + 2] === ' ') str += '\\';
          i += 1;
          start = i + 1;
        }

        break;

      default:
        i += 1;
    }
  }

  str = start ? str + json.slice(start) : json;
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx));
}

function singleQuotedString(value, ctx) {
  if (ctx.implicitKey) {
    if (/\n/.test(value)) return doubleQuotedString(value, ctx);
  } else {
    // single quoted string can't have leading or trailing whitespace around newline
    if (/[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
  }

  const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
  const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
  return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx));
}

function blockString({
  comment,
  type,
  value
}, ctx, onComment, onChompKeep) {
  // 1. Block can't end in whitespace unless the last line is non-empty.
  // 2. Strings consisting of only whitespace are best rendered explicitly.
  if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
    return doubleQuotedString(value, ctx);
  }

  const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? '  ' : '');
  const indentSize = indent ? '2' : '1'; // root is at -1

  const literal = type === PlainValueEc8e588e.Type.BLOCK_FOLDED ? false : type === PlainValueEc8e588e.Type.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, strOptions.fold.lineWidth, indent.length);
  let header = literal ? '|' : '>';
  if (!value) return header + '\n';
  let wsStart = '';
  let wsEnd = '';
  value = value.replace(/[\n\t ]*$/, ws => {
    const n = ws.indexOf('\n');

    if (n === -1) {
      header += '-'; // strip
    } else if (value === ws || n !== ws.length - 1) {
      header += '+'; // keep

      if (onChompKeep) onChompKeep();
    }

    wsEnd = ws.replace(/\n$/, '');
    return '';
  }).replace(/^[\n ]*/, ws => {
    if (ws.indexOf(' ') !== -1) header += indentSize;
    const m = ws.match(/ +$/);

    if (m) {
      wsStart = ws.slice(0, -m[0].length);
      return m[0];
    } else {
      wsStart = ws;
      return '';
    }
  });
  if (wsEnd) wsEnd = wsEnd.replace(/\n+(?!\n|$)/g, `$&${indent}`);
  if (wsStart) wsStart = wsStart.replace(/\n+/g, `$&${indent}`);

  if (comment) {
    header += ' #' + comment.replace(/ ?[\r\n]+/g, ' ');
    if (onComment) onComment();
  }

  if (!value) return `${header}${indentSize}\n${indent}${wsEnd}`;

  if (literal) {
    value = value.replace(/\n+/g, `$&${indent}`);
    return `${header}\n${indent}${wsStart}${value}${wsEnd}`;
  }

  value = value.replace(/\n+/g, '\n$&').replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
  //         ^ ind.line  ^ empty     ^ capture next empty lines only at end of indent
  .replace(/\n+/g, `$&${indent}`);
  const body = foldFlowLines(`${wsStart}${value}${wsEnd}`, indent, FOLD_BLOCK, strOptions.fold);
  return `${header}\n${indent}${body}`;
}

function plainString(item, ctx, onComment, onChompKeep) {
  const {
    comment,
    type,
    value
  } = item;
  const {
    actualString,
    implicitKey,
    indent,
    inFlow
  } = ctx;

  if (implicitKey && /[\n[\]{},]/.test(value) || inFlow && /[[\]{},]/.test(value)) {
    return doubleQuotedString(value, ctx);
  }

  if (!value || /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
    // not allowed:
    // - empty string, '-' or '?'
    // - start with an indicator character (except [?:-]) or /[?-] /
    // - '\n ', ': ' or ' \n' anywhere
    // - '#' not preceded by a non-space char
    // - end with ' ' or ':'
    return implicitKey || inFlow || value.indexOf('\n') === -1 ? value.indexOf('"') !== -1 && value.indexOf("'") === -1 ? singleQuotedString(value, ctx) : doubleQuotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
  }

  if (!implicitKey && !inFlow && type !== PlainValueEc8e588e.Type.PLAIN && value.indexOf('\n') !== -1) {
    // Where allowed & type not set explicitly, prefer block style for multiline strings
    return blockString(item, ctx, onComment, onChompKeep);
  }

  if (indent === '' && containsDocumentMarker(value)) {
    ctx.forceBlockIndent = true;
    return blockString(item, ctx, onComment, onChompKeep);
  }

  const str = value.replace(/\n+/g, `$&\n${indent}`); // Verify that output will be parsed as a string, as e.g. plain numbers and
  // booleans get parsed with those types in v1.2 (e.g. '42', 'true' & '0.9e-3'),
  // and others in v1.1.

  if (actualString) {
    const {
      tags
    } = ctx.doc.schema;
    const resolved = resolveScalar(str, tags, tags.scalarFallback).value;
    if (typeof resolved !== 'string') return doubleQuotedString(value, ctx);
  }

  const body = implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx));

  if (comment && !inFlow && (body.indexOf('\n') !== -1 || comment.indexOf('\n') !== -1)) {
    if (onComment) onComment();
    return addCommentBefore(body, indent, comment);
  }

  return body;
}

function stringifyString(item, ctx, onComment, onChompKeep) {
  const {
    defaultType
  } = strOptions;
  const {
    implicitKey,
    inFlow
  } = ctx;
  let {
    type,
    value
  } = item;

  if (typeof value !== 'string') {
    value = String(value);
    item = Object.assign({}, item, {
      value
    });
  }

  const _stringify = _type => {
    switch (_type) {
      case PlainValueEc8e588e.Type.BLOCK_FOLDED:
      case PlainValueEc8e588e.Type.BLOCK_LITERAL:
        return blockString(item, ctx, onComment, onChompKeep);

      case PlainValueEc8e588e.Type.QUOTE_DOUBLE:
        return doubleQuotedString(value, ctx);

      case PlainValueEc8e588e.Type.QUOTE_SINGLE:
        return singleQuotedString(value, ctx);

      case PlainValueEc8e588e.Type.PLAIN:
        return plainString(item, ctx, onComment, onChompKeep);

      default:
        return null;
    }
  };

  if (type !== PlainValueEc8e588e.Type.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f]/.test(value)) {
    // force double quotes on control characters
    type = PlainValueEc8e588e.Type.QUOTE_DOUBLE;
  } else if ((implicitKey || inFlow) && (type === PlainValueEc8e588e.Type.BLOCK_FOLDED || type === PlainValueEc8e588e.Type.BLOCK_LITERAL)) {
    // should not happen; blocks are not valid inside flow containers
    type = PlainValueEc8e588e.Type.QUOTE_DOUBLE;
  }

  let res = _stringify(type);

  if (res === null) {
    res = _stringify(defaultType);
    if (res === null) throw new Error(`Unsupported default string type ${defaultType}`);
  }

  return res;
}

function stringifyNumber({
  format,
  minFractionDigits,
  tag,
  value
}) {
  if (typeof value === 'bigint') return String(value);
  if (!isFinite(value)) return isNaN(value) ? '.nan' : value < 0 ? '-.inf' : '.inf';
  let n = JSON.stringify(value);

  if (!format && minFractionDigits && (!tag || tag === 'tag:yaml.org,2002:float') && /^\d/.test(n)) {
    let i = n.indexOf('.');

    if (i < 0) {
      i = n.length;
      n += '.';
    }

    let d = minFractionDigits - (n.length - i - 1);

    while (d-- > 0) n += '0';
  }

  return n;
}

function checkFlowCollectionEnd(errors, cst) {
  let char, name;

  switch (cst.type) {
    case PlainValueEc8e588e.Type.FLOW_MAP:
      char = '}';
      name = 'flow map';
      break;

    case PlainValueEc8e588e.Type.FLOW_SEQ:
      char = ']';
      name = 'flow sequence';
      break;

    default:
      errors.push(new PlainValueEc8e588e.YAMLSemanticError(cst, 'Not a flow collection!?'));
      return;
  }

  let lastItem;

  for (let i = cst.items.length - 1; i >= 0; --i) {
    const item = cst.items[i];

    if (!item || item.type !== PlainValueEc8e588e.Type.COMMENT) {
      lastItem = item;
      break;
    }
  }

  if (lastItem && lastItem.char !== char) {
    const msg = `Expected ${name} to end with ${char}`;
    let err;

    if (typeof lastItem.offset === 'number') {
      err = new PlainValueEc8e588e.YAMLSemanticError(cst, msg);
      err.offset = lastItem.offset + 1;
    } else {
      err = new PlainValueEc8e588e.YAMLSemanticError(lastItem, msg);
      if (lastItem.range && lastItem.range.end) err.offset = lastItem.range.end - lastItem.range.start;
    }

    errors.push(err);
  }
}
function checkFlowCommentSpace(errors, comment) {
  const prev = comment.context.src[comment.range.start - 1];

  if (prev !== '\n' && prev !== '\t' && prev !== ' ') {
    const msg = 'Comments must be separated from other tokens by white space characters';
    errors.push(new PlainValueEc8e588e.YAMLSemanticError(comment, msg));
  }
}
function getLongKeyError(source, key) {
  const sk = String(key);
  const k = sk.substr(0, 8) + '...' + sk.substr(-8);
  return new PlainValueEc8e588e.YAMLSemanticError(source, `The "${k}" key is too long`);
}
function resolveComments(collection, comments) {
  for (const {
    afterKey,
    before,
    comment
  } of comments) {
    let item = collection.items[before];

    if (!item) {
      if (comment !== undefined) {
        if (collection.comment) collection.comment += '\n' + comment;else collection.comment = comment;
      }
    } else {
      if (afterKey && item.value) item = item.value;

      if (comment === undefined) {
        if (afterKey || !item.commentBefore) item.spaceBefore = true;
      } else {
        if (item.commentBefore) item.commentBefore += '\n' + comment;else item.commentBefore = comment;
      }
    }
  }
}

// on error, will return { str: string, errors: Error[] }
function resolveString(doc, node) {
  const res = node.strValue;
  if (!res) return '';
  if (typeof res === 'string') return res;
  res.errors.forEach(error => {
    if (!error.source) error.source = node;
    doc.errors.push(error);
  });
  return res.str;
}

function resolveTagHandle(doc, node) {
  const {
    handle,
    suffix
  } = node.tag;
  let prefix = doc.tagPrefixes.find(p => p.handle === handle);

  if (!prefix) {
    const dtp = doc.getDefaults().tagPrefixes;
    if (dtp) prefix = dtp.find(p => p.handle === handle);
    if (!prefix) throw new PlainValueEc8e588e.YAMLSemanticError(node, `The ${handle} tag handle is non-default and was not declared.`);
  }

  if (!suffix) throw new PlainValueEc8e588e.YAMLSemanticError(node, `The ${handle} tag has no suffix.`);

  if (handle === '!' && (doc.version || doc.options.version) === '1.0') {
    if (suffix[0] === '^') {
      doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(node, 'YAML 1.0 ^ tag expansion is not supported'));
      return suffix;
    }

    if (/[:/]/.test(suffix)) {
      // word/foo -> tag:word.yaml.org,2002:foo
      const vocab = suffix.match(/^([a-z0-9-]+)\/(.*)/i);
      return vocab ? `tag:${vocab[1]}.yaml.org,2002:${vocab[2]}` : `tag:${suffix}`;
    }
  }

  return prefix.prefix + decodeURIComponent(suffix);
}

function resolveTagName(doc, node) {
  const {
    tag,
    type
  } = node;
  let nonSpecific = false;

  if (tag) {
    const {
      handle,
      suffix,
      verbatim
    } = tag;

    if (verbatim) {
      if (verbatim !== '!' && verbatim !== '!!') return verbatim;
      const msg = `Verbatim tags aren't resolved, so ${verbatim} is invalid.`;
      doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
    } else if (handle === '!' && !suffix) {
      nonSpecific = true;
    } else {
      try {
        return resolveTagHandle(doc, node);
      } catch (error) {
        doc.errors.push(error);
      }
    }
  }

  switch (type) {
    case PlainValueEc8e588e.Type.BLOCK_FOLDED:
    case PlainValueEc8e588e.Type.BLOCK_LITERAL:
    case PlainValueEc8e588e.Type.QUOTE_DOUBLE:
    case PlainValueEc8e588e.Type.QUOTE_SINGLE:
      return PlainValueEc8e588e.defaultTags.STR;

    case PlainValueEc8e588e.Type.FLOW_MAP:
    case PlainValueEc8e588e.Type.MAP:
      return PlainValueEc8e588e.defaultTags.MAP;

    case PlainValueEc8e588e.Type.FLOW_SEQ:
    case PlainValueEc8e588e.Type.SEQ:
      return PlainValueEc8e588e.defaultTags.SEQ;

    case PlainValueEc8e588e.Type.PLAIN:
      return nonSpecific ? PlainValueEc8e588e.defaultTags.STR : null;

    default:
      return null;
  }
}

function resolveByTagName(doc, node, tagName) {
  const {
    tags
  } = doc.schema;
  const matchWithTest = [];

  for (const tag of tags) {
    if (tag.tag === tagName) {
      if (tag.test) matchWithTest.push(tag);else {
        const res = tag.resolve(doc, node);
        return res instanceof Collection$1 ? res : new Scalar(res);
      }
    }
  }

  const str = resolveString(doc, node);
  if (typeof str === 'string' && matchWithTest.length > 0) return resolveScalar(str, matchWithTest, tags.scalarFallback);
  return null;
}

function getFallbackTagName({
  type
}) {
  switch (type) {
    case PlainValueEc8e588e.Type.FLOW_MAP:
    case PlainValueEc8e588e.Type.MAP:
      return PlainValueEc8e588e.defaultTags.MAP;

    case PlainValueEc8e588e.Type.FLOW_SEQ:
    case PlainValueEc8e588e.Type.SEQ:
      return PlainValueEc8e588e.defaultTags.SEQ;

    default:
      return PlainValueEc8e588e.defaultTags.STR;
  }
}

function resolveTag(doc, node, tagName) {
  try {
    const res = resolveByTagName(doc, node, tagName);

    if (res) {
      if (tagName && node.tag) res.tag = tagName;
      return res;
    }
  } catch (error) {
    /* istanbul ignore if */
    if (!error.source) error.source = node;
    doc.errors.push(error);
    return null;
  }

  try {
    const fallback = getFallbackTagName(node);
    if (!fallback) throw new Error(`The tag ${tagName} is unavailable`);
    const msg = `The tag ${tagName} is unavailable, falling back to ${fallback}`;
    doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(node, msg));
    const res = resolveByTagName(doc, node, fallback);
    res.tag = tagName;
    return res;
  } catch (error) {
    const refError = new PlainValueEc8e588e.YAMLReferenceError(node, error.message);
    refError.stack = error.stack;
    doc.errors.push(refError);
    return null;
  }
}

const isCollectionItem = node => {
  if (!node) return false;
  const {
    type
  } = node;
  return type === PlainValueEc8e588e.Type.MAP_KEY || type === PlainValueEc8e588e.Type.MAP_VALUE || type === PlainValueEc8e588e.Type.SEQ_ITEM;
};

function resolveNodeProps(errors, node) {
  const comments = {
    before: [],
    after: []
  };
  let hasAnchor = false;
  let hasTag = false;
  const props = isCollectionItem(node.context.parent) ? node.context.parent.props.concat(node.props) : node.props;

  for (const {
    start,
    end
  } of props) {
    switch (node.context.src[start]) {
      case PlainValueEc8e588e.Char.COMMENT:
        {
          if (!node.commentHasRequiredWhitespace(start)) {
            const msg = 'Comments must be separated from other tokens by white space characters';
            errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
          }

          const {
            header,
            valueRange
          } = node;
          const cc = valueRange && (start > valueRange.start || header && start > header.start) ? comments.after : comments.before;
          cc.push(node.context.src.slice(start + 1, end));
          break;
        }
      // Actual anchor & tag resolution is handled by schema, here we just complain

      case PlainValueEc8e588e.Char.ANCHOR:
        if (hasAnchor) {
          const msg = 'A node can have at most one anchor';
          errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
        }

        hasAnchor = true;
        break;

      case PlainValueEc8e588e.Char.TAG:
        if (hasTag) {
          const msg = 'A node can have at most one tag';
          errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
        }

        hasTag = true;
        break;
    }
  }

  return {
    comments,
    hasAnchor,
    hasTag
  };
}

function resolveNodeValue(doc, node) {
  const {
    anchors,
    errors,
    schema
  } = doc;

  if (node.type === PlainValueEc8e588e.Type.ALIAS) {
    const name = node.rawValue;
    const src = anchors.getNode(name);

    if (!src) {
      const msg = `Aliased anchor not found: ${name}`;
      errors.push(new PlainValueEc8e588e.YAMLReferenceError(node, msg));
      return null;
    } // Lazy resolution for circular references


    const res = new Alias$1(src);

    anchors._cstAliases.push(res);

    return res;
  }

  const tagName = resolveTagName(doc, node);
  if (tagName) return resolveTag(doc, node, tagName);

  if (node.type !== PlainValueEc8e588e.Type.PLAIN) {
    const msg = `Failed to resolve ${node.type} node here`;
    errors.push(new PlainValueEc8e588e.YAMLSyntaxError(node, msg));
    return null;
  }

  try {
    const str = resolveString(doc, node);
    return resolveScalar(str, schema.tags, schema.tags.scalarFallback);
  } catch (error) {
    if (!error.source) error.source = node;
    errors.push(error);
    return null;
  }
} // sets node.resolved on success


function resolveNode(doc, node) {
  if (!node) return null;
  if (node.error) doc.errors.push(node.error);
  const {
    comments,
    hasAnchor,
    hasTag
  } = resolveNodeProps(doc.errors, node);

  if (hasAnchor) {
    const {
      anchors
    } = doc;
    const name = node.anchor;
    const prev = anchors.getNode(name); // At this point, aliases for any preceding node with the same anchor
    // name have already been resolved, so it may safely be renamed.

    if (prev) anchors.map[anchors.newName(name)] = prev; // During parsing, we need to store the CST node in anchors.map as
    // anchors need to be available during resolution to allow for
    // circular references.

    anchors.map[name] = node;
  }

  if (node.type === PlainValueEc8e588e.Type.ALIAS && (hasAnchor || hasTag)) {
    const msg = 'An alias node must not specify any properties';
    doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
  }

  const res = resolveNodeValue(doc, node);

  if (res) {
    res.range = [node.range.start, node.range.end];
    if (doc.options.keepCstNodes) res.cstNode = node;
    if (doc.options.keepNodeTypes) res.type = node.type;
    const cb = comments.before.join('\n');

    if (cb) {
      res.commentBefore = res.commentBefore ? `${res.commentBefore}\n${cb}` : cb;
    }

    const ca = comments.after.join('\n');
    if (ca) res.comment = res.comment ? `${res.comment}\n${ca}` : ca;
  }

  return node.resolved = res;
}

function resolveMap(doc, cst) {
  if (cst.type !== PlainValueEc8e588e.Type.MAP && cst.type !== PlainValueEc8e588e.Type.FLOW_MAP) {
    const msg = `A ${cst.type} node cannot be resolved as a mapping`;
    doc.errors.push(new PlainValueEc8e588e.YAMLSyntaxError(cst, msg));
    return null;
  }

  const {
    comments,
    items
  } = cst.type === PlainValueEc8e588e.Type.FLOW_MAP ? resolveFlowMapItems(doc, cst) : resolveBlockMapItems(doc, cst);
  const map = new YAMLMap();
  map.items = items;
  resolveComments(map, comments);
  let hasCollectionKey = false;

  for (let i = 0; i < items.length; ++i) {
    const {
      key: iKey
    } = items[i];
    if (iKey instanceof Collection$1) hasCollectionKey = true;

    if (doc.schema.merge && iKey && iKey.value === MERGE_KEY) {
      items[i] = new Merge(items[i]);
      const sources = items[i].value.items;
      let error = null;
      sources.some(node => {
        if (node instanceof Alias$1) {
          // During parsing, alias sources are CST nodes; to account for
          // circular references their resolved values can't be used here.
          const {
            type
          } = node.source;
          if (type === PlainValueEc8e588e.Type.MAP || type === PlainValueEc8e588e.Type.FLOW_MAP) return false;
          return error = 'Merge nodes aliases can only point to maps';
        }

        return error = 'Merge nodes can only have Alias nodes as values';
      });
      if (error) doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(cst, error));
    } else {
      for (let j = i + 1; j < items.length; ++j) {
        const {
          key: jKey
        } = items[j];

        if (iKey === jKey || iKey && jKey && Object.prototype.hasOwnProperty.call(iKey, 'value') && iKey.value === jKey.value) {
          const msg = `Map keys must be unique; "${iKey}" is repeated`;
          doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(cst, msg));
          break;
        }
      }
    }
  }

  if (hasCollectionKey && !doc.options.mapAsMap) {
    const warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
    doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(cst, warn));
  }

  cst.resolved = map;
  return map;
}

const valueHasPairComment = ({
  context: {
    lineStart,
    node,
    src
  },
  props
}) => {
  if (props.length === 0) return false;
  const {
    start
  } = props[0];
  if (node && start > node.valueRange.start) return false;
  if (src[start] !== PlainValueEc8e588e.Char.COMMENT) return false;

  for (let i = lineStart; i < start; ++i) if (src[i] === '\n') return false;

  return true;
};

function resolvePairComment(item, pair) {
  if (!valueHasPairComment(item)) return;
  const comment = item.getPropValue(0, PlainValueEc8e588e.Char.COMMENT, true);
  let found = false;
  const cb = pair.value.commentBefore;

  if (cb && cb.startsWith(comment)) {
    pair.value.commentBefore = cb.substr(comment.length + 1);
    found = true;
  } else {
    const cc = pair.value.comment;

    if (!item.node && cc && cc.startsWith(comment)) {
      pair.value.comment = cc.substr(comment.length + 1);
      found = true;
    }
  }

  if (found) pair.comment = comment;
}

function resolveBlockMapItems(doc, cst) {
  const comments = [];
  const items = [];
  let key = undefined;
  let keyStart = null;

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    switch (item.type) {
      case PlainValueEc8e588e.Type.BLANK_LINE:
        comments.push({
          afterKey: !!key,
          before: items.length
        });
        break;

      case PlainValueEc8e588e.Type.COMMENT:
        comments.push({
          afterKey: !!key,
          before: items.length,
          comment: item.comment
        });
        break;

      case PlainValueEc8e588e.Type.MAP_KEY:
        if (key !== undefined) items.push(new Pair(key));
        if (item.error) doc.errors.push(item.error);
        key = resolveNode(doc, item.node);
        keyStart = null;
        break;

      case PlainValueEc8e588e.Type.MAP_VALUE:
        {
          if (key === undefined) key = null;
          if (item.error) doc.errors.push(item.error);

          if (!item.context.atLineStart && item.node && item.node.type === PlainValueEc8e588e.Type.MAP && !item.node.context.atLineStart) {
            const msg = 'Nested mappings are not allowed in compact mappings';
            doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item.node, msg));
          }

          let valueNode = item.node;

          if (!valueNode && item.props.length > 0) {
            // Comments on an empty mapping value need to be preserved, so we
            // need to construct a minimal empty node here to use instead of the
            // missing `item.node`. -- eemeli/yaml#19
            valueNode = new PlainValueEc8e588e.PlainValue(PlainValueEc8e588e.Type.PLAIN, []);
            valueNode.context = {
              parent: item,
              src: item.context.src
            };
            const pos = item.range.start + 1;
            valueNode.range = {
              start: pos,
              end: pos
            };
            valueNode.valueRange = {
              start: pos,
              end: pos
            };

            if (typeof item.range.origStart === 'number') {
              const origPos = item.range.origStart + 1;
              valueNode.range.origStart = valueNode.range.origEnd = origPos;
              valueNode.valueRange.origStart = valueNode.valueRange.origEnd = origPos;
            }
          }

          const pair = new Pair(key, resolveNode(doc, valueNode));
          resolvePairComment(item, pair);
          items.push(pair);

          if (key && typeof keyStart === 'number') {
            if (item.range.start > keyStart + 1024) doc.errors.push(getLongKeyError(cst, key));
          }

          key = undefined;
          keyStart = null;
        }
        break;

      default:
        if (key !== undefined) items.push(new Pair(key));
        key = resolveNode(doc, item);
        keyStart = item.range.start;
        if (item.error) doc.errors.push(item.error);

        next: for (let j = i + 1;; ++j) {
          const nextItem = cst.items[j];

          switch (nextItem && nextItem.type) {
            case PlainValueEc8e588e.Type.BLANK_LINE:
            case PlainValueEc8e588e.Type.COMMENT:
              continue next;

            case PlainValueEc8e588e.Type.MAP_VALUE:
              break next;

            default:
              {
                const msg = 'Implicit map keys need to be followed by map values';
                doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, msg));
                break next;
              }
          }
        }

        if (item.valueRangeContainsNewline) {
          const msg = 'Implicit map keys need to be on a single line';
          doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, msg));
        }

    }
  }

  if (key !== undefined) items.push(new Pair(key));
  return {
    comments,
    items
  };
}

function resolveFlowMapItems(doc, cst) {
  const comments = [];
  const items = [];
  let key = undefined;
  let explicitKey = false;
  let next = '{';

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    if (typeof item.char === 'string') {
      const {
        char,
        offset
      } = item;

      if (char === '?' && key === undefined && !explicitKey) {
        explicitKey = true;
        next = ':';
        continue;
      }

      if (char === ':') {
        if (key === undefined) key = null;

        if (next === ':') {
          next = ',';
          continue;
        }
      } else {
        if (explicitKey) {
          if (key === undefined && char !== ',') key = null;
          explicitKey = false;
        }

        if (key !== undefined) {
          items.push(new Pair(key));
          key = undefined;

          if (char === ',') {
            next = ':';
            continue;
          }
        }
      }

      if (char === '}') {
        if (i === cst.items.length - 1) continue;
      } else if (char === next) {
        next = ':';
        continue;
      }

      const msg = `Flow map contains an unexpected ${char}`;
      const err = new PlainValueEc8e588e.YAMLSyntaxError(cst, msg);
      err.offset = offset;
      doc.errors.push(err);
    } else if (item.type === PlainValueEc8e588e.Type.BLANK_LINE) {
      comments.push({
        afterKey: !!key,
        before: items.length
      });
    } else if (item.type === PlainValueEc8e588e.Type.COMMENT) {
      checkFlowCommentSpace(doc.errors, item);
      comments.push({
        afterKey: !!key,
        before: items.length,
        comment: item.comment
      });
    } else if (key === undefined) {
      if (next === ',') doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, 'Separator , missing in flow map'));
      key = resolveNode(doc, item);
    } else {
      if (next !== ',') doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, 'Indicator : missing in flow map entry'));
      items.push(new Pair(key, resolveNode(doc, item)));
      key = undefined;
      explicitKey = false;
    }
  }

  checkFlowCollectionEnd(doc.errors, cst);
  if (key !== undefined) items.push(new Pair(key));
  return {
    comments,
    items
  };
}

function resolveSeq(doc, cst) {
  if (cst.type !== PlainValueEc8e588e.Type.SEQ && cst.type !== PlainValueEc8e588e.Type.FLOW_SEQ) {
    const msg = `A ${cst.type} node cannot be resolved as a sequence`;
    doc.errors.push(new PlainValueEc8e588e.YAMLSyntaxError(cst, msg));
    return null;
  }

  const {
    comments,
    items
  } = cst.type === PlainValueEc8e588e.Type.FLOW_SEQ ? resolveFlowSeqItems(doc, cst) : resolveBlockSeqItems(doc, cst);
  const seq = new YAMLSeq();
  seq.items = items;
  resolveComments(seq, comments);

  if (!doc.options.mapAsMap && items.some(it => it instanceof Pair && it.key instanceof Collection$1)) {
    const warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
    doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(cst, warn));
  }

  cst.resolved = seq;
  return seq;
}

function resolveBlockSeqItems(doc, cst) {
  const comments = [];
  const items = [];

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    switch (item.type) {
      case PlainValueEc8e588e.Type.BLANK_LINE:
        comments.push({
          before: items.length
        });
        break;

      case PlainValueEc8e588e.Type.COMMENT:
        comments.push({
          comment: item.comment,
          before: items.length
        });
        break;

      case PlainValueEc8e588e.Type.SEQ_ITEM:
        if (item.error) doc.errors.push(item.error);
        items.push(resolveNode(doc, item.node));

        if (item.hasProps) {
          const msg = 'Sequence items cannot have tags or anchors before the - indicator';
          doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, msg));
        }

        break;

      default:
        if (item.error) doc.errors.push(item.error);
        doc.errors.push(new PlainValueEc8e588e.YAMLSyntaxError(item, `Unexpected ${item.type} node in sequence`));
    }
  }

  return {
    comments,
    items
  };
}

function resolveFlowSeqItems(doc, cst) {
  const comments = [];
  const items = [];
  let explicitKey = false;
  let key = undefined;
  let keyStart = null;
  let next = '[';
  let prevItem = null;

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    if (typeof item.char === 'string') {
      const {
        char,
        offset
      } = item;

      if (char !== ':' && (explicitKey || key !== undefined)) {
        if (explicitKey && key === undefined) key = next ? items.pop() : null;
        items.push(new Pair(key));
        explicitKey = false;
        key = undefined;
        keyStart = null;
      }

      if (char === next) {
        next = null;
      } else if (!next && char === '?') {
        explicitKey = true;
      } else if (next !== '[' && char === ':' && key === undefined) {
        if (next === ',') {
          key = items.pop();

          if (key instanceof Pair) {
            const msg = 'Chaining flow sequence pairs is invalid';
            const err = new PlainValueEc8e588e.YAMLSemanticError(cst, msg);
            err.offset = offset;
            doc.errors.push(err);
          }

          if (!explicitKey && typeof keyStart === 'number') {
            const keyEnd = item.range ? item.range.start : item.offset;
            if (keyEnd > keyStart + 1024) doc.errors.push(getLongKeyError(cst, key));
            const {
              src
            } = prevItem.context;

            for (let i = keyStart; i < keyEnd; ++i) if (src[i] === '\n') {
              const msg = 'Implicit keys of flow sequence pairs need to be on a single line';
              doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(prevItem, msg));
              break;
            }
          }
        } else {
          key = null;
        }

        keyStart = null;
        explicitKey = false;
        next = null;
      } else if (next === '[' || char !== ']' || i < cst.items.length - 1) {
        const msg = `Flow sequence contains an unexpected ${char}`;
        const err = new PlainValueEc8e588e.YAMLSyntaxError(cst, msg);
        err.offset = offset;
        doc.errors.push(err);
      }
    } else if (item.type === PlainValueEc8e588e.Type.BLANK_LINE) {
      comments.push({
        before: items.length
      });
    } else if (item.type === PlainValueEc8e588e.Type.COMMENT) {
      checkFlowCommentSpace(doc.errors, item);
      comments.push({
        comment: item.comment,
        before: items.length
      });
    } else {
      if (next) {
        const msg = `Expected a ${next} in flow sequence`;
        doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, msg));
      }

      const value = resolveNode(doc, item);

      if (key === undefined) {
        items.push(value);
        prevItem = item;
      } else {
        items.push(new Pair(key, value));
        key = undefined;
      }

      keyStart = item.range.start;
      next = ',';
    }
  }

  checkFlowCollectionEnd(doc.errors, cst);
  if (key !== undefined) items.push(new Pair(key));
  return {
    comments,
    items
  };
}

var Alias_1 = Alias$1;
var Collection_1 = Collection$1;
var Merge_1 = Merge;
var Node_1$1 = Node$1;
var Pair_1 = Pair;
var Scalar_1 = Scalar;
var YAMLMap_1 = YAMLMap;
var YAMLSeq_1 = YAMLSeq;
var addComment_1 = addComment;
var binaryOptions_1 = binaryOptions;
var boolOptions_1 = boolOptions;
var findPair_1 = findPair;
var intOptions_1 = intOptions;
var isEmptyPath_1 = isEmptyPath;
var nullOptions_1 = nullOptions;
var resolveMap_1 = resolveMap;
var resolveNode_1 = resolveNode;
var resolveSeq_1 = resolveSeq;
var resolveString_1 = resolveString;
var strOptions_1 = strOptions;
var stringifyNumber_1 = stringifyNumber;
var stringifyString_1 = stringifyString;
var toJSON_1 = toJSON;

var resolveSeqD03cb037 = {
	Alias: Alias_1,
	Collection: Collection_1,
	Merge: Merge_1,
	Node: Node_1$1,
	Pair: Pair_1,
	Scalar: Scalar_1,
	YAMLMap: YAMLMap_1,
	YAMLSeq: YAMLSeq_1,
	addComment: addComment_1,
	binaryOptions: binaryOptions_1,
	boolOptions: boolOptions_1,
	findPair: findPair_1,
	intOptions: intOptions_1,
	isEmptyPath: isEmptyPath_1,
	nullOptions: nullOptions_1,
	resolveMap: resolveMap_1,
	resolveNode: resolveNode_1,
	resolveSeq: resolveSeq_1,
	resolveString: resolveString_1,
	strOptions: strOptions_1,
	stringifyNumber: stringifyNumber_1,
	stringifyString: stringifyString_1,
	toJSON: toJSON_1
};

/* global atob, btoa, Buffer */
const binary = {
  identify: value => value instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: false,
  tag: 'tag:yaml.org,2002:binary',

  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve: (doc, node) => {
    const src = resolveSeqD03cb037.resolveString(doc, node);

    if (typeof Buffer === 'function') {
      return Buffer.from(src, 'base64');
    } else if (typeof atob === 'function') {
      // On IE 11, atob() can't handle newlines
      const str = atob(src.replace(/[\n\r]/g, ''));
      const buffer = new Uint8Array(str.length);

      for (let i = 0; i < str.length; ++i) buffer[i] = str.charCodeAt(i);

      return buffer;
    } else {
      const msg = 'This environment does not support reading binary tags; either Buffer or atob is required';
      doc.errors.push(new PlainValueEc8e588e.YAMLReferenceError(node, msg));
      return null;
    }
  },
  options: resolveSeqD03cb037.binaryOptions,
  stringify: ({
    comment,
    type,
    value
  }, ctx, onComment, onChompKeep) => {
    let src;

    if (typeof Buffer === 'function') {
      src = value instanceof Buffer ? value.toString('base64') : Buffer.from(value.buffer).toString('base64');
    } else if (typeof btoa === 'function') {
      let s = '';

      for (let i = 0; i < value.length; ++i) s += String.fromCharCode(value[i]);

      src = btoa(s);
    } else {
      throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
    }

    if (!type) type = resolveSeqD03cb037.binaryOptions.defaultType;

    if (type === PlainValueEc8e588e.Type.QUOTE_DOUBLE) {
      value = src;
    } else {
      const {
        lineWidth
      } = resolveSeqD03cb037.binaryOptions;
      const n = Math.ceil(src.length / lineWidth);
      const lines = new Array(n);

      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
        lines[i] = src.substr(o, lineWidth);
      }

      value = lines.join(type === PlainValueEc8e588e.Type.BLOCK_LITERAL ? '\n' : ' ');
    }

    return resolveSeqD03cb037.stringifyString({
      comment,
      type,
      value
    }, ctx, onComment, onChompKeep);
  }
};

function parsePairs(doc, cst) {
  const seq = resolveSeqD03cb037.resolveSeq(doc, cst);

  for (let i = 0; i < seq.items.length; ++i) {
    let item = seq.items[i];
    if (item instanceof resolveSeqD03cb037.Pair) continue;else if (item instanceof resolveSeqD03cb037.YAMLMap) {
      if (item.items.length > 1) {
        const msg = 'Each pair must have its own sequence indicator';
        throw new PlainValueEc8e588e.YAMLSemanticError(cst, msg);
      }

      const pair = item.items[0] || new resolveSeqD03cb037.Pair();
      if (item.commentBefore) pair.commentBefore = pair.commentBefore ? `${item.commentBefore}\n${pair.commentBefore}` : item.commentBefore;
      if (item.comment) pair.comment = pair.comment ? `${item.comment}\n${pair.comment}` : item.comment;
      item = pair;
    }
    seq.items[i] = item instanceof resolveSeqD03cb037.Pair ? item : new resolveSeqD03cb037.Pair(item);
  }

  return seq;
}
function createPairs(schema, iterable, ctx) {
  const pairs = new resolveSeqD03cb037.YAMLSeq(schema);
  pairs.tag = 'tag:yaml.org,2002:pairs';

  for (const it of iterable) {
    let key, value;

    if (Array.isArray(it)) {
      if (it.length === 2) {
        key = it[0];
        value = it[1];
      } else throw new TypeError(`Expected [key, value] tuple: ${it}`);
    } else if (it && it instanceof Object) {
      const keys = Object.keys(it);

      if (keys.length === 1) {
        key = keys[0];
        value = it[key];
      } else throw new TypeError(`Expected { key: value } tuple: ${it}`);
    } else {
      key = it;
    }

    const pair = schema.createPair(key, value, ctx);
    pairs.items.push(pair);
  }

  return pairs;
}
const pairs = {
  default: false,
  tag: 'tag:yaml.org,2002:pairs',
  resolve: parsePairs,
  createNode: createPairs
};

class YAMLOMap extends resolveSeqD03cb037.YAMLSeq {
  constructor() {
    super();

    PlainValueEc8e588e._defineProperty(this, "add", resolveSeqD03cb037.YAMLMap.prototype.add.bind(this));

    PlainValueEc8e588e._defineProperty(this, "delete", resolveSeqD03cb037.YAMLMap.prototype.delete.bind(this));

    PlainValueEc8e588e._defineProperty(this, "get", resolveSeqD03cb037.YAMLMap.prototype.get.bind(this));

    PlainValueEc8e588e._defineProperty(this, "has", resolveSeqD03cb037.YAMLMap.prototype.has.bind(this));

    PlainValueEc8e588e._defineProperty(this, "set", resolveSeqD03cb037.YAMLMap.prototype.set.bind(this));

    this.tag = YAMLOMap.tag;
  }

  toJSON(_, ctx) {
    const map = new Map();
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const pair of this.items) {
      let key, value;

      if (pair instanceof resolveSeqD03cb037.Pair) {
        key = resolveSeqD03cb037.toJSON(pair.key, '', ctx);
        value = resolveSeqD03cb037.toJSON(pair.value, key, ctx);
      } else {
        key = resolveSeqD03cb037.toJSON(pair, '', ctx);
      }

      if (map.has(key)) throw new Error('Ordered maps must not include duplicate keys');
      map.set(key, value);
    }

    return map;
  }

}

PlainValueEc8e588e._defineProperty(YAMLOMap, "tag", 'tag:yaml.org,2002:omap');

function parseOMap(doc, cst) {
  const pairs = parsePairs(doc, cst);
  const seenKeys = [];

  for (const {
    key
  } of pairs.items) {
    if (key instanceof resolveSeqD03cb037.Scalar) {
      if (seenKeys.includes(key.value)) {
        const msg = 'Ordered maps must not include duplicate keys';
        throw new PlainValueEc8e588e.YAMLSemanticError(cst, msg);
      } else {
        seenKeys.push(key.value);
      }
    }
  }

  return Object.assign(new YAMLOMap(), pairs);
}

function createOMap(schema, iterable, ctx) {
  const pairs = createPairs(schema, iterable, ctx);
  const omap = new YAMLOMap();
  omap.items = pairs.items;
  return omap;
}

const omap = {
  identify: value => value instanceof Map,
  nodeClass: YAMLOMap,
  default: false,
  tag: 'tag:yaml.org,2002:omap',
  resolve: parseOMap,
  createNode: createOMap
};

class YAMLSet extends resolveSeqD03cb037.YAMLMap {
  constructor() {
    super();
    this.tag = YAMLSet.tag;
  }

  add(key) {
    const pair = key instanceof resolveSeqD03cb037.Pair ? key : new resolveSeqD03cb037.Pair(key);
    const prev = resolveSeqD03cb037.findPair(this.items, pair.key);
    if (!prev) this.items.push(pair);
  }

  get(key, keepPair) {
    const pair = resolveSeqD03cb037.findPair(this.items, key);
    return !keepPair && pair instanceof resolveSeqD03cb037.Pair ? pair.key instanceof resolveSeqD03cb037.Scalar ? pair.key.value : pair.key : pair;
  }

  set(key, value) {
    if (typeof value !== 'boolean') throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
    const prev = resolveSeqD03cb037.findPair(this.items, key);

    if (prev && !value) {
      this.items.splice(this.items.indexOf(prev), 1);
    } else if (!prev && value) {
      this.items.push(new resolveSeqD03cb037.Pair(key));
    }
  }

  toJSON(_, ctx) {
    return super.toJSON(_, ctx, Set);
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    if (this.hasAllNullValues()) return super.toString(ctx, onComment, onChompKeep);else throw new Error('Set items must all have null values');
  }

}

PlainValueEc8e588e._defineProperty(YAMLSet, "tag", 'tag:yaml.org,2002:set');

function parseSet(doc, cst) {
  const map = resolveSeqD03cb037.resolveMap(doc, cst);
  if (!map.hasAllNullValues()) throw new PlainValueEc8e588e.YAMLSemanticError(cst, 'Set items must all have null values');
  return Object.assign(new YAMLSet(), map);
}

function createSet(schema, iterable, ctx) {
  const set = new YAMLSet();

  for (const value of iterable) set.items.push(schema.createPair(value, null, ctx));

  return set;
}

const set = {
  identify: value => value instanceof Set,
  nodeClass: YAMLSet,
  default: false,
  tag: 'tag:yaml.org,2002:set',
  resolve: parseSet,
  createNode: createSet
};

const parseSexagesimal = (sign, parts) => {
  const n = parts.split(':').reduce((n, p) => n * 60 + Number(p), 0);
  return sign === '-' ? -n : n;
}; // hhhh:mm:ss.sss


const stringifySexagesimal = ({
  value
}) => {
  if (isNaN(value) || !isFinite(value)) return resolveSeqD03cb037.stringifyNumber(value);
  let sign = '';

  if (value < 0) {
    sign = '-';
    value = Math.abs(value);
  }

  const parts = [value % 60]; // seconds, including ms

  if (value < 60) {
    parts.unshift(0); // at least one : is required
  } else {
    value = Math.round((value - parts[0]) / 60);
    parts.unshift(value % 60); // minutes

    if (value >= 60) {
      value = Math.round((value - parts[0]) / 60);
      parts.unshift(value); // hours
    }
  }

  return sign + parts.map(n => n < 10 ? '0' + String(n) : String(n)).join(':').replace(/000000\d*$/, '') // % 60 may introduce error
  ;
};

const intTime = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'TIME',
  test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+)$/,
  resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
  stringify: stringifySexagesimal
};
const floatTime = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'TIME',
  test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*)$/,
  resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
  stringify: stringifySexagesimal
};
const timestamp = {
  identify: value => value instanceof Date,
  default: true,
  tag: 'tag:yaml.org,2002:timestamp',
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp('^(?:' + '([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
  '(?:(?:t|T|[ \\t]+)' + // t | T | whitespace
  '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
  '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
  ')?' + ')$'),
  resolve: (str, year, month, day, hour, minute, second, millisec, tz) => {
    if (millisec) millisec = (millisec + '00').substr(1, 3);
    let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec || 0);

    if (tz && tz !== 'Z') {
      let d = parseSexagesimal(tz[0], tz.slice(1));
      if (Math.abs(d) < 30) d *= 60;
      date -= 60000 * d;
    }

    return new Date(date);
  },
  stringify: ({
    value
  }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '')
};

/* global console, process, YAML_SILENCE_DEPRECATION_WARNINGS, YAML_SILENCE_WARNINGS */
function shouldWarn(deprecation) {
  const env = typeof process !== 'undefined' && process.env || {};

  if (deprecation) {
    if (typeof YAML_SILENCE_DEPRECATION_WARNINGS !== 'undefined') return !YAML_SILENCE_DEPRECATION_WARNINGS;
    return !env.YAML_SILENCE_DEPRECATION_WARNINGS;
  }

  if (typeof YAML_SILENCE_WARNINGS !== 'undefined') return !YAML_SILENCE_WARNINGS;
  return !env.YAML_SILENCE_WARNINGS;
}

function warn(warning, type) {
  if (shouldWarn(false)) {
    const emit = typeof process !== 'undefined' && process.emitWarning; // This will throw in Jest if `warning` is an Error instance due to
    // https://github.com/facebook/jest/issues/2549

    if (emit) emit(warning, type);else {
      // eslint-disable-next-line no-console
      console.warn(type ? `${type}: ${warning}` : warning);
    }
  }
}
function warnFileDeprecation(filename) {
  if (shouldWarn(true)) {
    const path = filename.replace(/.*yaml[/\\]/i, '').replace(/\.js$/, '').replace(/\\/g, '/');
    warn(`The endpoint 'yaml/${path}' will be removed in a future release.`, 'DeprecationWarning');
  }
}
const warned = {};
function warnOptionDeprecation(name, alternative) {
  if (!warned[name] && shouldWarn(true)) {
    warned[name] = true;
    let msg = `The option '${name}' will be removed in a future release`;
    msg += alternative ? `, use '${alternative}' instead.` : '.';
    warn(msg, 'DeprecationWarning');
  }
}

var binary_1 = binary;
var floatTime_1 = floatTime;
var intTime_1 = intTime;
var omap_1 = omap;
var pairs_1 = pairs;
var set_1 = set;
var timestamp_1 = timestamp;
var warn_1 = warn;
var warnFileDeprecation_1 = warnFileDeprecation;
var warnOptionDeprecation_1 = warnOptionDeprecation;

var warnings1000a372 = {
	binary: binary_1,
	floatTime: floatTime_1,
	intTime: intTime_1,
	omap: omap_1,
	pairs: pairs_1,
	set: set_1,
	timestamp: timestamp_1,
	warn: warn_1,
	warnFileDeprecation: warnFileDeprecation_1,
	warnOptionDeprecation: warnOptionDeprecation_1
};

function createMap(schema, obj, ctx) {
  const map = new resolveSeqD03cb037.YAMLMap(schema);

  if (obj instanceof Map) {
    for (const [key, value] of obj) map.items.push(schema.createPair(key, value, ctx));
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) map.items.push(schema.createPair(key, obj[key], ctx));
  }

  if (typeof schema.sortMapEntries === 'function') {
    map.items.sort(schema.sortMapEntries);
  }

  return map;
}

const map = {
  createNode: createMap,
  default: true,
  nodeClass: resolveSeqD03cb037.YAMLMap,
  tag: 'tag:yaml.org,2002:map',
  resolve: resolveSeqD03cb037.resolveMap
};

function createSeq(schema, obj, ctx) {
  const seq = new resolveSeqD03cb037.YAMLSeq(schema);

  if (obj && obj[Symbol.iterator]) {
    for (const it of obj) {
      const v = schema.createNode(it, ctx.wrapScalars, null, ctx);
      seq.items.push(v);
    }
  }

  return seq;
}

const seq = {
  createNode: createSeq,
  default: true,
  nodeClass: resolveSeqD03cb037.YAMLSeq,
  tag: 'tag:yaml.org,2002:seq',
  resolve: resolveSeqD03cb037.resolveSeq
};

const string = {
  identify: value => typeof value === 'string',
  default: true,
  tag: 'tag:yaml.org,2002:str',
  resolve: resolveSeqD03cb037.resolveString,

  stringify(item, ctx, onComment, onChompKeep) {
    ctx = Object.assign({
      actualString: true
    }, ctx);
    return resolveSeqD03cb037.stringifyString(item, ctx, onComment, onChompKeep);
  },

  options: resolveSeqD03cb037.strOptions
};

const failsafe = [map, seq, string];

/* global BigInt */

const intIdentify$2 = value => typeof value === 'bigint' || Number.isInteger(value);

const intResolve$1 = (src, part, radix) => resolveSeqD03cb037.intOptions.asBigInt ? BigInt(src) : parseInt(part, radix);

function intStringify$1(node, radix, prefix) {
  const {
    value
  } = node;
  if (intIdentify$2(value) && value >= 0) return prefix + value.toString(radix);
  return resolveSeqD03cb037.stringifyNumber(node);
}

const nullObj = {
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeqD03cb037.Scalar(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => null,
  options: resolveSeqD03cb037.nullOptions,
  stringify: () => resolveSeqD03cb037.nullOptions.nullStr
};
const boolObj = {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: str => str[0] === 't' || str[0] === 'T',
  options: resolveSeqD03cb037.boolOptions,
  stringify: ({
    value
  }) => value ? resolveSeqD03cb037.boolOptions.trueStr : resolveSeqD03cb037.boolOptions.falseStr
};
const octObj = {
  identify: value => intIdentify$2(value) && value >= 0,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'OCT',
  test: /^0o([0-7]+)$/,
  resolve: (str, oct) => intResolve$1(str, oct, 8),
  options: resolveSeqD03cb037.intOptions,
  stringify: node => intStringify$1(node, 8, '0o')
};
const intObj = {
  identify: intIdentify$2,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^[-+]?[0-9]+$/,
  resolve: str => intResolve$1(str, str, 10),
  options: resolveSeqD03cb037.intOptions,
  stringify: resolveSeqD03cb037.stringifyNumber
};
const hexObj = {
  identify: value => intIdentify$2(value) && value >= 0,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'HEX',
  test: /^0x([0-9a-fA-F]+)$/,
  resolve: (str, hex) => intResolve$1(str, hex, 16),
  options: resolveSeqD03cb037.intOptions,
  stringify: node => intStringify$1(node, 16, '0x')
};
const nanObj = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^(?:[-+]?\.inf|(\.nan))$/i,
  resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: resolveSeqD03cb037.stringifyNumber
};
const expObj = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'EXP',
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: str => parseFloat(str),
  stringify: ({
    value
  }) => Number(value).toExponential()
};
const floatObj = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^[-+]?(?:\.([0-9]+)|[0-9]+\.([0-9]*))$/,

  resolve(str, frac1, frac2) {
    const frac = frac1 || frac2;
    const node = new resolveSeqD03cb037.Scalar(parseFloat(str));
    if (frac && frac[frac.length - 1] === '0') node.minFractionDigits = frac.length;
    return node;
  },

  stringify: resolveSeqD03cb037.stringifyNumber
};
const core = failsafe.concat([nullObj, boolObj, octObj, intObj, hexObj, nanObj, expObj, floatObj]);

/* global BigInt */

const intIdentify$1 = value => typeof value === 'bigint' || Number.isInteger(value);

const stringifyJSON = ({
  value
}) => JSON.stringify(value);

const json = [map, seq, {
  identify: value => typeof value === 'string',
  default: true,
  tag: 'tag:yaml.org,2002:str',
  resolve: resolveSeqD03cb037.resolveString,
  stringify: stringifyJSON
}, {
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeqD03cb037.Scalar(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^null$/,
  resolve: () => null,
  stringify: stringifyJSON
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^true|false$/,
  resolve: str => str === 'true',
  stringify: stringifyJSON
}, {
  identify: intIdentify$1,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^-?(?:0|[1-9][0-9]*)$/,
  resolve: str => resolveSeqD03cb037.intOptions.asBigInt ? BigInt(str) : parseInt(str, 10),
  stringify: ({
    value
  }) => intIdentify$1(value) ? value.toString() : JSON.stringify(value)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
  resolve: str => parseFloat(str),
  stringify: stringifyJSON
}];

json.scalarFallback = str => {
  throw new SyntaxError(`Unresolved plain scalar ${JSON.stringify(str)}`);
};

/* global BigInt */

const boolStringify = ({
  value
}) => value ? resolveSeqD03cb037.boolOptions.trueStr : resolveSeqD03cb037.boolOptions.falseStr;

const intIdentify = value => typeof value === 'bigint' || Number.isInteger(value);

function intResolve(sign, src, radix) {
  let str = src.replace(/_/g, '');

  if (resolveSeqD03cb037.intOptions.asBigInt) {
    switch (radix) {
      case 2:
        str = `0b${str}`;
        break;

      case 8:
        str = `0o${str}`;
        break;

      case 16:
        str = `0x${str}`;
        break;
    }

    const n = BigInt(str);
    return sign === '-' ? BigInt(-1) * n : n;
  }

  const n = parseInt(str, radix);
  return sign === '-' ? -1 * n : n;
}

function intStringify(node, radix, prefix) {
  const {
    value
  } = node;

  if (intIdentify(value)) {
    const str = value.toString(radix);
    return value < 0 ? '-' + prefix + str.substr(1) : prefix + str;
  }

  return resolveSeqD03cb037.stringifyNumber(node);
}

const yaml11 = failsafe.concat([{
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeqD03cb037.Scalar(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => null,
  options: resolveSeqD03cb037.nullOptions,
  stringify: () => resolveSeqD03cb037.nullOptions.nullStr
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => true,
  options: resolveSeqD03cb037.boolOptions,
  stringify: boolStringify
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
  resolve: () => false,
  options: resolveSeqD03cb037.boolOptions,
  stringify: boolStringify
}, {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'BIN',
  test: /^([-+]?)0b([0-1_]+)$/,
  resolve: (str, sign, bin) => intResolve(sign, bin, 2),
  stringify: node => intStringify(node, 2, '0b')
}, {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'OCT',
  test: /^([-+]?)0([0-7_]+)$/,
  resolve: (str, sign, oct) => intResolve(sign, oct, 8),
  stringify: node => intStringify(node, 8, '0')
}, {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^([-+]?)([0-9][0-9_]*)$/,
  resolve: (str, sign, abs) => intResolve(sign, abs, 10),
  stringify: resolveSeqD03cb037.stringifyNumber
}, {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'HEX',
  test: /^([-+]?)0x([0-9a-fA-F_]+)$/,
  resolve: (str, sign, hex) => intResolve(sign, hex, 16),
  stringify: node => intStringify(node, 16, '0x')
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^(?:[-+]?\.inf|(\.nan))$/i,
  resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: resolveSeqD03cb037.stringifyNumber
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'EXP',
  test: /^[-+]?([0-9][0-9_]*)?(\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: str => parseFloat(str.replace(/_/g, '')),
  stringify: ({
    value
  }) => Number(value).toExponential()
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^[-+]?(?:[0-9][0-9_]*)?\.([0-9_]*)$/,

  resolve(str, frac) {
    const node = new resolveSeqD03cb037.Scalar(parseFloat(str.replace(/_/g, '')));

    if (frac) {
      const f = frac.replace(/_/g, '');
      if (f[f.length - 1] === '0') node.minFractionDigits = f.length;
    }

    return node;
  },

  stringify: resolveSeqD03cb037.stringifyNumber
}], warnings1000a372.binary, warnings1000a372.omap, warnings1000a372.pairs, warnings1000a372.set, warnings1000a372.intTime, warnings1000a372.floatTime, warnings1000a372.timestamp);

const schemas = {
  core,
  failsafe,
  json,
  yaml11
};
const tags = {
  binary: warnings1000a372.binary,
  bool: boolObj,
  float: floatObj,
  floatExp: expObj,
  floatNaN: nanObj,
  floatTime: warnings1000a372.floatTime,
  int: intObj,
  intHex: hexObj,
  intOct: octObj,
  intTime: warnings1000a372.intTime,
  map,
  null: nullObj,
  omap: warnings1000a372.omap,
  pairs: warnings1000a372.pairs,
  seq,
  set: warnings1000a372.set,
  timestamp: warnings1000a372.timestamp
};

function findTagObject(value, tagName, tags) {
  if (tagName) {
    const match = tags.filter(t => t.tag === tagName);
    const tagObj = match.find(t => !t.format) || match[0];
    if (!tagObj) throw new Error(`Tag ${tagName} not found`);
    return tagObj;
  } // TODO: deprecate/remove class check


  return tags.find(t => (t.identify && t.identify(value) || t.class && value instanceof t.class) && !t.format);
}

function createNode(value, tagName, ctx) {
  if (value instanceof resolveSeqD03cb037.Node) return value;
  const {
    defaultPrefix,
    onTagObj,
    prevObjects,
    schema,
    wrapScalars
  } = ctx;
  if (tagName && tagName.startsWith('!!')) tagName = defaultPrefix + tagName.slice(2);
  let tagObj = findTagObject(value, tagName, schema.tags);

  if (!tagObj) {
    if (typeof value.toJSON === 'function') value = value.toJSON();
    if (!value || typeof value !== 'object') return wrapScalars ? new resolveSeqD03cb037.Scalar(value) : value;
    tagObj = value instanceof Map ? map : value[Symbol.iterator] ? seq : map;
  }

  if (onTagObj) {
    onTagObj(tagObj);
    delete ctx.onTagObj;
  } // Detect duplicate references to the same object & use Alias nodes for all
  // after first. The `obj` wrapper allows for circular references to resolve.


  const obj = {
    value: undefined,
    node: undefined
  };

  if (value && typeof value === 'object' && prevObjects) {
    const prev = prevObjects.get(value);

    if (prev) {
      const alias = new resolveSeqD03cb037.Alias(prev); // leaves source dirty; must be cleaned by caller

      ctx.aliasNodes.push(alias); // defined along with prevObjects

      return alias;
    }

    obj.value = value;
    prevObjects.set(value, obj);
  }

  obj.node = tagObj.createNode ? tagObj.createNode(ctx.schema, value, ctx) : wrapScalars ? new resolveSeqD03cb037.Scalar(value) : value;
  if (tagName && obj.node instanceof resolveSeqD03cb037.Node) obj.node.tag = tagName;
  return obj.node;
}

function getSchemaTags(schemas, knownTags, customTags, schemaId) {
  let tags = schemas[schemaId.replace(/\W/g, '')]; // 'yaml-1.1' -> 'yaml11'

  if (!tags) {
    const keys = Object.keys(schemas).map(key => JSON.stringify(key)).join(', ');
    throw new Error(`Unknown schema "${schemaId}"; use one of ${keys}`);
  }

  if (Array.isArray(customTags)) {
    for (const tag of customTags) tags = tags.concat(tag);
  } else if (typeof customTags === 'function') {
    tags = customTags(tags.slice());
  }

  for (let i = 0; i < tags.length; ++i) {
    const tag = tags[i];

    if (typeof tag === 'string') {
      const tagObj = knownTags[tag];

      if (!tagObj) {
        const keys = Object.keys(knownTags).map(key => JSON.stringify(key)).join(', ');
        throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
      }

      tags[i] = tagObj;
    }
  }

  return tags;
}

const sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;

class Schema {
  // TODO: remove in v2
  // TODO: remove in v2
  constructor({
    customTags,
    merge,
    schema,
    sortMapEntries,
    tags: deprecatedCustomTags
  }) {
    this.merge = !!merge;
    this.name = schema;
    this.sortMapEntries = sortMapEntries === true ? sortMapEntriesByKey : sortMapEntries || null;
    if (!customTags && deprecatedCustomTags) warnings1000a372.warnOptionDeprecation('tags', 'customTags');
    this.tags = getSchemaTags(schemas, tags, customTags || deprecatedCustomTags, schema);
  }

  createNode(value, wrapScalars, tagName, ctx) {
    const baseCtx = {
      defaultPrefix: Schema.defaultPrefix,
      schema: this,
      wrapScalars
    };
    const createCtx = ctx ? Object.assign(ctx, baseCtx) : baseCtx;
    return createNode(value, tagName, createCtx);
  }

  createPair(key, value, ctx) {
    if (!ctx) ctx = {
      wrapScalars: true
    };
    const k = this.createNode(key, ctx.wrapScalars, null, ctx);
    const v = this.createNode(value, ctx.wrapScalars, null, ctx);
    return new resolveSeqD03cb037.Pair(k, v);
  }

}

PlainValueEc8e588e._defineProperty(Schema, "defaultPrefix", PlainValueEc8e588e.defaultTagPrefix);

PlainValueEc8e588e._defineProperty(Schema, "defaultTags", PlainValueEc8e588e.defaultTags);

var Schema_1 = Schema;

var Schema88e323a7 = {
	Schema: Schema_1
};

const defaultOptions = {
  anchorPrefix: 'a',
  customTags: null,
  indent: 2,
  indentSeq: true,
  keepCstNodes: false,
  keepNodeTypes: true,
  keepBlobsInJSON: true,
  mapAsMap: false,
  maxAliasCount: 100,
  prettyErrors: false,
  // TODO Set true in v2
  simpleKeys: false,
  version: '1.2'
};
const scalarOptions = {
  get binary() {
    return resolveSeqD03cb037.binaryOptions;
  },

  set binary(opt) {
    Object.assign(resolveSeqD03cb037.binaryOptions, opt);
  },

  get bool() {
    return resolveSeqD03cb037.boolOptions;
  },

  set bool(opt) {
    Object.assign(resolveSeqD03cb037.boolOptions, opt);
  },

  get int() {
    return resolveSeqD03cb037.intOptions;
  },

  set int(opt) {
    Object.assign(resolveSeqD03cb037.intOptions, opt);
  },

  get null() {
    return resolveSeqD03cb037.nullOptions;
  },

  set null(opt) {
    Object.assign(resolveSeqD03cb037.nullOptions, opt);
  },

  get str() {
    return resolveSeqD03cb037.strOptions;
  },

  set str(opt) {
    Object.assign(resolveSeqD03cb037.strOptions, opt);
  }

};
const documentOptions = {
  '1.0': {
    schema: 'yaml-1.1',
    merge: true,
    tagPrefixes: [{
      handle: '!',
      prefix: PlainValueEc8e588e.defaultTagPrefix
    }, {
      handle: '!!',
      prefix: 'tag:private.yaml.org,2002:'
    }]
  },
  1.1: {
    schema: 'yaml-1.1',
    merge: true,
    tagPrefixes: [{
      handle: '!',
      prefix: '!'
    }, {
      handle: '!!',
      prefix: PlainValueEc8e588e.defaultTagPrefix
    }]
  },
  1.2: {
    schema: 'core',
    merge: false,
    tagPrefixes: [{
      handle: '!',
      prefix: '!'
    }, {
      handle: '!!',
      prefix: PlainValueEc8e588e.defaultTagPrefix
    }]
  }
};

function stringifyTag(doc, tag) {
  if ((doc.version || doc.options.version) === '1.0') {
    const priv = tag.match(/^tag:private\.yaml\.org,2002:([^:/]+)$/);
    if (priv) return '!' + priv[1];
    const vocab = tag.match(/^tag:([a-zA-Z0-9-]+)\.yaml\.org,2002:(.*)/);
    return vocab ? `!${vocab[1]}/${vocab[2]}` : `!${tag.replace(/^tag:/, '')}`;
  }

  let p = doc.tagPrefixes.find(p => tag.indexOf(p.prefix) === 0);

  if (!p) {
    const dtp = doc.getDefaults().tagPrefixes;
    p = dtp && dtp.find(p => tag.indexOf(p.prefix) === 0);
  }

  if (!p) return tag[0] === '!' ? tag : `!<${tag}>`;
  const suffix = tag.substr(p.prefix.length).replace(/[!,[\]{}]/g, ch => ({
    '!': '%21',
    ',': '%2C',
    '[': '%5B',
    ']': '%5D',
    '{': '%7B',
    '}': '%7D'
  })[ch]);
  return p.handle + suffix;
}

function getTagObject(tags, item) {
  if (item instanceof resolveSeqD03cb037.Alias) return resolveSeqD03cb037.Alias;

  if (item.tag) {
    const match = tags.filter(t => t.tag === item.tag);
    if (match.length > 0) return match.find(t => t.format === item.format) || match[0];
  }

  let tagObj, obj;

  if (item instanceof resolveSeqD03cb037.Scalar) {
    obj = item.value; // TODO: deprecate/remove class check

    const match = tags.filter(t => t.identify && t.identify(obj) || t.class && obj instanceof t.class);
    tagObj = match.find(t => t.format === item.format) || match.find(t => !t.format);
  } else {
    obj = item;
    tagObj = tags.find(t => t.nodeClass && obj instanceof t.nodeClass);
  }

  if (!tagObj) {
    const name = obj && obj.constructor ? obj.constructor.name : typeof obj;
    throw new Error(`Tag not resolved for ${name} value`);
  }

  return tagObj;
} // needs to be called before value stringifier to allow for circular anchor refs


function stringifyProps(node, tagObj, {
  anchors,
  doc
}) {
  const props = [];
  const anchor = doc.anchors.getName(node);

  if (anchor) {
    anchors[anchor] = node;
    props.push(`&${anchor}`);
  }

  if (node.tag) {
    props.push(stringifyTag(doc, node.tag));
  } else if (!tagObj.default) {
    props.push(stringifyTag(doc, tagObj.tag));
  }

  return props.join(' ');
}

function stringify(item, ctx, onComment, onChompKeep) {
  const {
    anchors,
    schema
  } = ctx.doc;
  let tagObj;

  if (!(item instanceof resolveSeqD03cb037.Node)) {
    const createCtx = {
      aliasNodes: [],
      onTagObj: o => tagObj = o,
      prevObjects: new Map()
    };
    item = schema.createNode(item, true, null, createCtx);

    for (const alias of createCtx.aliasNodes) {
      alias.source = alias.source.node;
      let name = anchors.getName(alias.source);

      if (!name) {
        name = anchors.newName();
        anchors.map[name] = alias.source;
      }
    }
  }

  if (item instanceof resolveSeqD03cb037.Pair) return item.toString(ctx, onComment, onChompKeep);
  if (!tagObj) tagObj = getTagObject(schema.tags, item);
  const props = stringifyProps(item, tagObj, ctx);
  if (props.length > 0) ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1;
  const str = typeof tagObj.stringify === 'function' ? tagObj.stringify(item, ctx, onComment, onChompKeep) : item instanceof resolveSeqD03cb037.Scalar ? resolveSeqD03cb037.stringifyString(item, ctx, onComment, onChompKeep) : item.toString(ctx, onComment, onChompKeep);
  if (!props) return str;
  return item instanceof resolveSeqD03cb037.Scalar || str[0] === '{' || str[0] === '[' ? `${props} ${str}` : `${props}\n${ctx.indent}${str}`;
}

class Anchors {
  static validAnchorNode(node) {
    return node instanceof resolveSeqD03cb037.Scalar || node instanceof resolveSeqD03cb037.YAMLSeq || node instanceof resolveSeqD03cb037.YAMLMap;
  }

  constructor(prefix) {
    PlainValueEc8e588e._defineProperty(this, "map", Object.create(null));

    this.prefix = prefix;
  }

  createAlias(node, name) {
    this.setAnchor(node, name);
    return new resolveSeqD03cb037.Alias(node);
  }

  createMergePair(...sources) {
    const merge = new resolveSeqD03cb037.Merge();
    merge.value.items = sources.map(s => {
      if (s instanceof resolveSeqD03cb037.Alias) {
        if (s.source instanceof resolveSeqD03cb037.YAMLMap) return s;
      } else if (s instanceof resolveSeqD03cb037.YAMLMap) {
        return this.createAlias(s);
      }

      throw new Error('Merge sources must be Map nodes or their Aliases');
    });
    return merge;
  }

  getName(node) {
    const {
      map
    } = this;
    return Object.keys(map).find(a => map[a] === node);
  }

  getNames() {
    return Object.keys(this.map);
  }

  getNode(name) {
    return this.map[name];
  }

  newName(prefix) {
    if (!prefix) prefix = this.prefix;
    const names = Object.keys(this.map);

    for (let i = 1; true; ++i) {
      const name = `${prefix}${i}`;
      if (!names.includes(name)) return name;
    }
  } // During parsing, map & aliases contain CST nodes


  resolveNodes() {
    const {
      map,
      _cstAliases
    } = this;
    Object.keys(map).forEach(a => {
      map[a] = map[a].resolved;
    });

    _cstAliases.forEach(a => {
      a.source = a.source.resolved;
    });

    delete this._cstAliases;
  }

  setAnchor(node, name) {
    if (node != null && !Anchors.validAnchorNode(node)) {
      throw new Error('Anchors may only be set for Scalar, Seq and Map nodes');
    }

    if (name && /[\x00-\x19\s,[\]{}]/.test(name)) {
      throw new Error('Anchor names must not contain whitespace or control characters');
    }

    const {
      map
    } = this;
    const prev = node && Object.keys(map).find(a => map[a] === node);

    if (prev) {
      if (!name) {
        return prev;
      } else if (prev !== name) {
        delete map[prev];
        map[name] = node;
      }
    } else {
      if (!name) {
        if (!node) return null;
        name = this.newName();
      }

      map[name] = node;
    }

    return name;
  }

}

const visit = (node, tags) => {
  if (node && typeof node === 'object') {
    const {
      tag
    } = node;

    if (node instanceof resolveSeqD03cb037.Collection) {
      if (tag) tags[tag] = true;
      node.items.forEach(n => visit(n, tags));
    } else if (node instanceof resolveSeqD03cb037.Pair) {
      visit(node.key, tags);
      visit(node.value, tags);
    } else if (node instanceof resolveSeqD03cb037.Scalar) {
      if (tag) tags[tag] = true;
    }
  }

  return tags;
};

const listTagNames = node => Object.keys(visit(node, {}));

function parseContents(doc, contents) {
  const comments = {
    before: [],
    after: []
  };
  let body = undefined;
  let spaceBefore = false;

  for (const node of contents) {
    if (node.valueRange) {
      if (body !== undefined) {
        const msg = 'Document contains trailing content not separated by a ... or --- line';
        doc.errors.push(new PlainValueEc8e588e.YAMLSyntaxError(node, msg));
        break;
      }

      const res = resolveSeqD03cb037.resolveNode(doc, node);

      if (spaceBefore) {
        res.spaceBefore = true;
        spaceBefore = false;
      }

      body = res;
    } else if (node.comment !== null) {
      const cc = body === undefined ? comments.before : comments.after;
      cc.push(node.comment);
    } else if (node.type === PlainValueEc8e588e.Type.BLANK_LINE) {
      spaceBefore = true;

      if (body === undefined && comments.before.length > 0 && !doc.commentBefore) {
        // space-separated comments at start are parsed as document comments
        doc.commentBefore = comments.before.join('\n');
        comments.before = [];
      }
    }
  }

  doc.contents = body || null;

  if (!body) {
    doc.comment = comments.before.concat(comments.after).join('\n') || null;
  } else {
    const cb = comments.before.join('\n');

    if (cb) {
      const cbNode = body instanceof resolveSeqD03cb037.Collection && body.items[0] ? body.items[0] : body;
      cbNode.commentBefore = cbNode.commentBefore ? `${cb}\n${cbNode.commentBefore}` : cb;
    }

    doc.comment = comments.after.join('\n') || null;
  }
}

function resolveTagDirective({
  tagPrefixes
}, directive) {
  const [handle, prefix] = directive.parameters;

  if (!handle || !prefix) {
    const msg = 'Insufficient parameters given for %TAG directive';
    throw new PlainValueEc8e588e.YAMLSemanticError(directive, msg);
  }

  if (tagPrefixes.some(p => p.handle === handle)) {
    const msg = 'The %TAG directive must only be given at most once per handle in the same document.';
    throw new PlainValueEc8e588e.YAMLSemanticError(directive, msg);
  }

  return {
    handle,
    prefix
  };
}

function resolveYamlDirective(doc, directive) {
  let [version] = directive.parameters;
  if (directive.name === 'YAML:1.0') version = '1.0';

  if (!version) {
    const msg = 'Insufficient parameters given for %YAML directive';
    throw new PlainValueEc8e588e.YAMLSemanticError(directive, msg);
  }

  if (!documentOptions[version]) {
    const v0 = doc.version || doc.options.version;
    const msg = `Document will be parsed as YAML ${v0} rather than YAML ${version}`;
    doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(directive, msg));
  }

  return version;
}

function parseDirectives(doc, directives, prevDoc) {
  const directiveComments = [];
  let hasDirectives = false;

  for (const directive of directives) {
    const {
      comment,
      name
    } = directive;

    switch (name) {
      case 'TAG':
        try {
          doc.tagPrefixes.push(resolveTagDirective(doc, directive));
        } catch (error) {
          doc.errors.push(error);
        }

        hasDirectives = true;
        break;

      case 'YAML':
      case 'YAML:1.0':
        if (doc.version) {
          const msg = 'The %YAML directive must only be given at most once per document.';
          doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(directive, msg));
        }

        try {
          doc.version = resolveYamlDirective(doc, directive);
        } catch (error) {
          doc.errors.push(error);
        }

        hasDirectives = true;
        break;

      default:
        if (name) {
          const msg = `YAML only supports %TAG and %YAML directives, and not %${name}`;
          doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(directive, msg));
        }

    }

    if (comment) directiveComments.push(comment);
  }

  if (prevDoc && !hasDirectives && '1.1' === (doc.version || prevDoc.version || doc.options.version)) {
    const copyTagPrefix = ({
      handle,
      prefix
    }) => ({
      handle,
      prefix
    });

    doc.tagPrefixes = prevDoc.tagPrefixes.map(copyTagPrefix);
    doc.version = prevDoc.version;
  }

  doc.commentBefore = directiveComments.join('\n') || null;
}

function assertCollection(contents) {
  if (contents instanceof resolveSeqD03cb037.Collection) return true;
  throw new Error('Expected a YAML collection as document contents');
}

class Document$1 {
  constructor(options) {
    this.anchors = new Anchors(options.anchorPrefix);
    this.commentBefore = null;
    this.comment = null;
    this.contents = null;
    this.directivesEndMarker = null;
    this.errors = [];
    this.options = options;
    this.schema = null;
    this.tagPrefixes = [];
    this.version = null;
    this.warnings = [];
  }

  add(value) {
    assertCollection(this.contents);
    return this.contents.add(value);
  }

  addIn(path, value) {
    assertCollection(this.contents);
    this.contents.addIn(path, value);
  }

  delete(key) {
    assertCollection(this.contents);
    return this.contents.delete(key);
  }

  deleteIn(path) {
    if (resolveSeqD03cb037.isEmptyPath(path)) {
      if (this.contents == null) return false;
      this.contents = null;
      return true;
    }

    assertCollection(this.contents);
    return this.contents.deleteIn(path);
  }

  getDefaults() {
    return Document$1.defaults[this.version] || Document$1.defaults[this.options.version] || {};
  }

  get(key, keepScalar) {
    return this.contents instanceof resolveSeqD03cb037.Collection ? this.contents.get(key, keepScalar) : undefined;
  }

  getIn(path, keepScalar) {
    if (resolveSeqD03cb037.isEmptyPath(path)) return !keepScalar && this.contents instanceof resolveSeqD03cb037.Scalar ? this.contents.value : this.contents;
    return this.contents instanceof resolveSeqD03cb037.Collection ? this.contents.getIn(path, keepScalar) : undefined;
  }

  has(key) {
    return this.contents instanceof resolveSeqD03cb037.Collection ? this.contents.has(key) : false;
  }

  hasIn(path) {
    if (resolveSeqD03cb037.isEmptyPath(path)) return this.contents !== undefined;
    return this.contents instanceof resolveSeqD03cb037.Collection ? this.contents.hasIn(path) : false;
  }

  set(key, value) {
    assertCollection(this.contents);
    this.contents.set(key, value);
  }

  setIn(path, value) {
    if (resolveSeqD03cb037.isEmptyPath(path)) this.contents = value;else {
      assertCollection(this.contents);
      this.contents.setIn(path, value);
    }
  }

  setSchema(id, customTags) {
    if (!id && !customTags && this.schema) return;
    if (typeof id === 'number') id = id.toFixed(1);

    if (id === '1.0' || id === '1.1' || id === '1.2') {
      if (this.version) this.version = id;else this.options.version = id;
      delete this.options.schema;
    } else if (id && typeof id === 'string') {
      this.options.schema = id;
    }

    if (Array.isArray(customTags)) this.options.customTags = customTags;
    const opt = Object.assign({}, this.getDefaults(), this.options);
    this.schema = new Schema88e323a7.Schema(opt);
  }

  parse(node, prevDoc) {
    if (this.options.keepCstNodes) this.cstNode = node;
    if (this.options.keepNodeTypes) this.type = 'DOCUMENT';
    const {
      directives = [],
      contents = [],
      directivesEndMarker,
      error,
      valueRange
    } = node;

    if (error) {
      if (!error.source) error.source = this;
      this.errors.push(error);
    }

    parseDirectives(this, directives, prevDoc);
    if (directivesEndMarker) this.directivesEndMarker = true;
    this.range = valueRange ? [valueRange.start, valueRange.end] : null;
    this.setSchema();
    this.anchors._cstAliases = [];
    parseContents(this, contents);
    this.anchors.resolveNodes();

    if (this.options.prettyErrors) {
      for (const error of this.errors) if (error instanceof PlainValueEc8e588e.YAMLError) error.makePretty();

      for (const warn of this.warnings) if (warn instanceof PlainValueEc8e588e.YAMLError) warn.makePretty();
    }

    return this;
  }

  listNonDefaultTags() {
    return listTagNames(this.contents).filter(t => t.indexOf(Schema88e323a7.Schema.defaultPrefix) !== 0);
  }

  setTagPrefix(handle, prefix) {
    if (handle[0] !== '!' || handle[handle.length - 1] !== '!') throw new Error('Handle must start and end with !');

    if (prefix) {
      const prev = this.tagPrefixes.find(p => p.handle === handle);
      if (prev) prev.prefix = prefix;else this.tagPrefixes.push({
        handle,
        prefix
      });
    } else {
      this.tagPrefixes = this.tagPrefixes.filter(p => p.handle !== handle);
    }
  }

  toJSON(arg, onAnchor) {
    const {
      keepBlobsInJSON,
      mapAsMap,
      maxAliasCount
    } = this.options;
    const keep = keepBlobsInJSON && (typeof arg !== 'string' || !(this.contents instanceof resolveSeqD03cb037.Scalar));
    const ctx = {
      doc: this,
      indentStep: '  ',
      keep,
      mapAsMap: keep && !!mapAsMap,
      maxAliasCount,
      stringify // Requiring directly in Pair would create circular dependencies

    };
    const anchorNames = Object.keys(this.anchors.map);
    if (anchorNames.length > 0) ctx.anchors = new Map(anchorNames.map(name => [this.anchors.map[name], {
      alias: [],
      aliasCount: 0,
      count: 1
    }]));
    const res = resolveSeqD03cb037.toJSON(this.contents, arg, ctx);
    if (typeof onAnchor === 'function' && ctx.anchors) for (const {
      count,
      res
    } of ctx.anchors.values()) onAnchor(res, count);
    return res;
  }

  toString() {
    if (this.errors.length > 0) throw new Error('Document with errors cannot be stringified');
    const indentSize = this.options.indent;

    if (!Number.isInteger(indentSize) || indentSize <= 0) {
      const s = JSON.stringify(indentSize);
      throw new Error(`"indent" option must be a positive integer, not ${s}`);
    }

    this.setSchema();
    const lines = [];
    let hasDirectives = false;

    if (this.version) {
      let vd = '%YAML 1.2';

      if (this.schema.name === 'yaml-1.1') {
        if (this.version === '1.0') vd = '%YAML:1.0';else if (this.version === '1.1') vd = '%YAML 1.1';
      }

      lines.push(vd);
      hasDirectives = true;
    }

    const tagNames = this.listNonDefaultTags();
    this.tagPrefixes.forEach(({
      handle,
      prefix
    }) => {
      if (tagNames.some(t => t.indexOf(prefix) === 0)) {
        lines.push(`%TAG ${handle} ${prefix}`);
        hasDirectives = true;
      }
    });
    if (hasDirectives || this.directivesEndMarker) lines.push('---');

    if (this.commentBefore) {
      if (hasDirectives || !this.directivesEndMarker) lines.unshift('');
      lines.unshift(this.commentBefore.replace(/^/gm, '#'));
    }

    const ctx = {
      anchors: Object.create(null),
      doc: this,
      indent: '',
      indentStep: ' '.repeat(indentSize),
      stringify // Requiring directly in nodes would create circular dependencies

    };
    let chompKeep = false;
    let contentComment = null;

    if (this.contents) {
      if (this.contents instanceof resolveSeqD03cb037.Node) {
        if (this.contents.spaceBefore && (hasDirectives || this.directivesEndMarker)) lines.push('');
        if (this.contents.commentBefore) lines.push(this.contents.commentBefore.replace(/^/gm, '#')); // top-level block scalars need to be indented if followed by a comment

        ctx.forceBlockIndent = !!this.comment;
        contentComment = this.contents.comment;
      }

      const onChompKeep = contentComment ? null : () => chompKeep = true;
      const body = stringify(this.contents, ctx, () => contentComment = null, onChompKeep);
      lines.push(resolveSeqD03cb037.addComment(body, '', contentComment));
    } else if (this.contents !== undefined) {
      lines.push(stringify(this.contents, ctx));
    }

    if (this.comment) {
      if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '') lines.push('');
      lines.push(this.comment.replace(/^/gm, '#'));
    }

    return lines.join('\n') + '\n';
  }

}

PlainValueEc8e588e._defineProperty(Document$1, "defaults", documentOptions);

var Document_1 = Document$1;
var defaultOptions_1 = defaultOptions;
var scalarOptions_1 = scalarOptions;

var Document9b4560a1 = {
	Document: Document_1,
	defaultOptions: defaultOptions_1,
	scalarOptions: scalarOptions_1
};

function createNode$1(value, wrapScalars = true, tag) {
  if (tag === undefined && typeof wrapScalars === 'string') {
    tag = wrapScalars;
    wrapScalars = true;
  }

  const options = Object.assign({}, Document9b4560a1.Document.defaults[Document9b4560a1.defaultOptions.version], Document9b4560a1.defaultOptions);
  const schema = new Schema88e323a7.Schema(options);
  return schema.createNode(value, wrapScalars, tag);
}

class Document$2 extends Document9b4560a1.Document {
  constructor(options) {
    super(Object.assign({}, Document9b4560a1.defaultOptions, options));
  }

}

function parseAllDocuments(src, options) {
  const stream = [];
  let prev;

  for (const cstDoc of parseCst.parse(src)) {
    const doc = new Document$2(options);
    doc.parse(cstDoc, prev);
    stream.push(doc);
    prev = doc;
  }

  return stream;
}

function parseDocument(src, options) {
  const cst = parseCst.parse(src);
  const doc = new Document$2(options).parse(cst[0]);

  if (cst.length > 1) {
    const errMsg = 'Source contains multiple documents; please use YAML.parseAllDocuments()';
    doc.errors.unshift(new PlainValueEc8e588e.YAMLSemanticError(cst[1], errMsg));
  }

  return doc;
}

function parse$1(src, options) {
  const doc = parseDocument(src, options);
  doc.warnings.forEach(warning => warnings1000a372.warn(warning));
  if (doc.errors.length > 0) throw doc.errors[0];
  return doc.toJSON();
}

function stringify$1(value, options) {
  const doc = new Document$2(options);
  doc.contents = value;
  return String(doc);
}

const YAML = {
  createNode: createNode$1,
  defaultOptions: Document9b4560a1.defaultOptions,
  Document: Document$2,
  parse: parse$1,
  parseAllDocuments,
  parseCST: parseCst.parse,
  parseDocument,
  scalarOptions: Document9b4560a1.scalarOptions,
  stringify: stringify$1
};

var YAML_1 = YAML;

var dist = {
	YAML: YAML_1
};

var yaml = dist.YAML;

var Alias$2 = resolveSeqD03cb037.Alias;
var Collection$2 = resolveSeqD03cb037.Collection;
var Merge$1 = resolveSeqD03cb037.Merge;
var Node$2 = resolveSeqD03cb037.Node;
var Pair$1 = resolveSeqD03cb037.Pair;
var Scalar$1 = resolveSeqD03cb037.Scalar;
var YAMLMap$1 = resolveSeqD03cb037.YAMLMap;
var YAMLSeq$1 = resolveSeqD03cb037.YAMLSeq;
var binaryOptions$1 = resolveSeqD03cb037.binaryOptions;
var boolOptions$1 = resolveSeqD03cb037.boolOptions;
var intOptions$1 = resolveSeqD03cb037.intOptions;
var nullOptions$1 = resolveSeqD03cb037.nullOptions;
var strOptions$1 = resolveSeqD03cb037.strOptions;
var Schema_1$1 = Schema88e323a7.Schema;

var types$2 = {
	Alias: Alias$2,
	Collection: Collection$2,
	Merge: Merge$1,
	Node: Node$2,
	Pair: Pair$1,
	Scalar: Scalar$1,
	YAMLMap: YAMLMap$1,
	YAMLSeq: YAMLSeq$1,
	binaryOptions: binaryOptions$1,
	boolOptions: boolOptions$1,
	intOptions: intOptions$1,
	nullOptions: nullOptions$1,
	strOptions: strOptions$1,
	Schema: Schema_1$1
};

const YAMLMap$2 = types$2.YAMLMap;
const YAMLSeq$2 = types$2.YAMLSeq;

function getIn(obj, path) {
  return path.reduce(function (v, k) { return (k in v ? v[k] : {}); }, obj);
}

function addComments(context, path, commentNode, iterNode) {
  if ( iterNode === void 0 ) iterNode = commentNode;

  var ref = getIn(context, path);
  var title = ref.title;
  var description = ref.description;
  var comment = ref.comment;
  var lines = [];

  if (optionAPI('renderTitle') && title) {
    lines.push((" " + title), '');
  }
  if (optionAPI('renderDescription') && description) {
    lines.push((" " + description));
  }
  if (optionAPI('renderComment') && comment) {
    lines.push((" " + comment));
  }

  commentNode.commentBefore = lines.join('\n');

  if (iterNode instanceof YAMLMap$2) {
    iterNode.items.forEach(function (n) {
      addComments(context, path.concat( ['items'], [n.key.value]), n.key, n.value);
    });
  } else if (iterNode instanceof YAMLSeq$2) {
    iterNode.items.forEach(function (n, i) {
      addComments(context, path.concat( ['items'], [i]), n);
    });
  }
}

/** Render YAML string from the generated value and context
 *
 * @param value
 * @param context
 * @returns {string}
 */
function renderYAML(ref) {
  var value = ref.value;
  var context = ref.context;

  var nodes = yaml.createNode(value);

  addComments(context, [], nodes);

  var doc = new yaml.Document();
  doc.contents = nodes;

  return doc.toString();
}

var container = new Container();

function setupKeywords() {
  // safe auto-increment values
  container.define('autoIncrement', function autoIncrement(value, schema) {
    if (!this.offset) {
      var min = schema.minimum || 1;
      var max = min + env.MAX_NUMBER;
      var offset = value.initialOffset || schema.initialOffset;

      this.offset = offset || random.number(min, max);
    }

    if (value === true) {
      return this.offset++; // eslint-disable-line
    }

    return schema;
  });

  // safe-and-sequential dates
  container.define('sequentialDate', function sequentialDate(value, schema) {
    if (!this.now) {
      this.now = random.date();
    }

    if (value) {
      schema = this.now.toISOString();
      value = value === true
        ? 'days'
        : value;

      if (['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'].indexOf(value) === -1) {
        throw new Error(("Unsupported increment by " + (utils.short(value))));
      }

      this.now.setTime(this.now.getTime() + random.date(value));
    }

    return schema;
  });
}

function getRefs(refs, schema) {
  var $refs = {};

  if (Array.isArray(refs)) {
    refs.forEach(function (_schema) {
      $refs[_schema.$id || _schema.id] = _schema;
    });
  } else {
    $refs = refs || {};
  }

  function walk(obj) {
    if (!obj || typeof obj !== 'object') { return; }
    if (Array.isArray(obj)) { return obj.forEach(walk); }

    var _id = obj.$id || obj.id;

    if (typeof _id === 'string' && !$refs[_id]) {
      $refs[_id] = obj;
    }

    Object.keys(obj).forEach(function (key) {
      walk(obj[key]);
    });
  }

  walk(refs);
  walk(schema);

  return $refs;
}

var jsf = function (schema, refs, cwd) {
  console.log('[json-schema-faker] calling JsonSchemaFaker() is deprecated, call either .generate() or .resolve()');

  if (cwd) {
    console.log('[json-schema-faker] references are only supported by calling .resolve()');
  }

  return jsf.generate(schema, refs);
};

jsf.generateWithContext = function (schema, refs) {
  var $refs = getRefs(refs, schema);

  return run($refs, schema, container);
};

jsf.generate = function (schema, refs) { return renderJS(
    jsf.generateWithContext(schema, refs)
  ); };

jsf.generateYAML = function (schema, refs) { return renderYAML(
    jsf.generateWithContext(schema, refs)
  ); };

jsf.resolveWithContext = function (schema, refs, cwd) {
  if (typeof refs === 'string') {
    cwd = refs;
    refs = {};
  }

  // normalize basedir (browser aware)
  cwd = cwd || (typeof process !== 'undefined' ? process.cwd() : '');
  cwd = (cwd.replace(/\/+$/, '')) + "/";

  var $refs = getRefs(refs, schema);

  // identical setup as json-schema-sequelizer
  var fixedRefs = {
    order: 1,
    canRead: function canRead(file) {
      var key = file.url.replace('/:', ':');

      return $refs[key] || $refs[key.split('/').pop()];
    },
    read: function read(file, callback) {
      try {
        callback(null, this.canRead(file));
      } catch (e) {
        callback(e);
      }
    },
  };

  return $RefParser
    .bundle(cwd, schema, {
      resolve: {
        file: { order: 100 },
        http: { order: 200 },
        fixedRefs: fixedRefs,
      },
      dereference: {
        circular: 'ignore',
      },
    }).then(function (sub) { return run($refs, sub, container); })
    .catch(function (e) {
      throw new Error(("Error while resolving schema (" + (e.message) + ")"));
    });
};

jsf.resolve = function (schema, refs, cwd) { return jsf.resolveWithContext(schema, refs, cwd).then(renderJS); };

jsf.resolveYAML = function (schema, refs, cwd) { return jsf.resolveWithContext(schema, refs, cwd).then(renderYAML); };

setupKeywords();

jsf.format = formatAPI;
jsf.option = optionAPI;
jsf.random = random;

// returns itself for chaining
jsf.extend = function (name, cb) {
  container.extend(name, cb);
  return jsf;
};

jsf.define = function (name, cb) {
  container.define(name, cb);
  return jsf;
};

jsf.reset = function (name) {
  container.reset(name);
  setupKeywords();
  return jsf;
};

jsf.locate = function (name) {
  return container.get(name);
};


if (typeof VERSION !== 'undefined') {
  jsf.version = VERSION;
}

export default jsf;
