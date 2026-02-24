/**
 * Code runner for Code Arena.
 * DEMO_MODE: Runs JavaScript in browser (sandboxed).
 * Production: Use makeApiRequest to backend judge.
 */

const RUN_TIMEOUT_MS = 3000;

const PROBLEM_TESTS = {
  cp1: {
    // Two Sum: function twoSum(nums, target) -> indices
    fn: "twoSum",
    inputs: [[[2, 7, 11, 15], 9], [[3, 2, 4], 6], [[3, 3], 6]],
    expected: [[0, 1], [1, 2], [0, 1]],
  },
  cp2: {
    // Reverse String: function reverse(s) or reverseString(s) -> string
    fn: "reverse",
    inputs: [["hello"], ["world"], ["a"]],
    expected: ["olleh", "dlrow", "a"],
  },
  cp3: {
    // Binary Search: function search(nums, target) or binarySearch(nums, target) -> index
    fn: "search",
    inputs: [[[-1, 0, 3, 5, 9], 9], [[-1, 0, 3, 5, 9], 2], [[5], 5]],
    expected: [4, -1, 0],
  },
};

const normalizeOutput = (val) => {
  if (Array.isArray(val)) return JSON.stringify(val.sort?.() ?? val);
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const runInSandbox = (code, fnName, args) => {
  const fn = new Function(
    "args",
    `
    ${code}
    if (typeof ${fnName} !== 'function') {
      throw new Error('Please define a function named ${fnName}');
    }
    return ${fnName}(...args);
  `
  );
  return fn(args);
};

export const runCode = async (problemId, code) => {
  const test = PROBLEM_TESTS[problemId];
  if (!test) {
    return { status: "Error", output: "No test cases for this problem.", error: null };
  }

  const results = [];
  let passed = 0;

  try {
    for (let i = 0; i < test.inputs.length; i++) {
      const args = test.inputs[i];
      const expected = test.expected[i];

      const start = Date.now();
      const result = await Promise.race([
        new Promise((resolve) => {
          try {
            const out = runInSandbox(code, test.fn, args);
            resolve({ ok: true, value: out });
          } catch (e) {
            resolve({ ok: false, error: e.message });
          }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Time limit exceeded")), RUN_TIMEOUT_MS)
        ),
      ]);

      const elapsed = Date.now() - start;

      if (!result.ok) {
        results.push({ input: args, expected, actual: null, passed: false, error: result.error });
        continue;
      }

      const actualStr = normalizeOutput(result.value);
      const expectedStr = normalizeOutput(expected);
      const isPassed = actualStr === expectedStr;

      if (isPassed) passed++;

      results.push({
        input: JSON.stringify(args),
        expected: expectedStr,
        actual: actualStr,
        passed: isPassed,
        time: elapsed,
      });
    }

    const status = passed === test.inputs.length ? "Accepted" : "Wrong Answer";
    const output = results
      .map(
        (r, i) =>
          `Test ${i + 1}: ${r.passed ? "✓ Passed" : "✗ Failed"}${r.time ? ` (${r.time}ms)` : ""}${r.error ? ` - ${r.error}` : ""}\n  Input: ${r.input}\n  Expected: ${r.expected}\n  Got: ${r.actual || r.error}`
      )
      .join("\n\n");

    return {
      status,
      output,
      passed,
      total: test.inputs.length,
      results,
    };
  } catch (err) {
    return {
      status: "Error",
      output: err.message || "Execution failed",
      error: err.message,
    };
  }
};

export const getStarterCode = (problemId) => {
  const starters = {
    cp1: `function twoSum(nums, target) {
  // Return indices of two numbers that add up to target
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
    cp2: `function reverse(s) {
  // Reverse the string in-place (return new string for simplicity)
  return s.split('').reverse().join('');
}`,
    cp3: `function search(nums, target) {
  // Binary search - return index of target or -1
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  };
  return starters[problemId] || "// Write your solution here\nfunction solve() {\n  \n}";
};
