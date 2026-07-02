export interface CodingQuestion {
  id: string;
  title: string;
  slug: string;
  categoryLabel: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  solutionExplanation: string;
  solutionCode: string;
  language: string;
}

export const codingQuestions: CodingQuestion[] = [
  {
    id: "cq-1",
    title: "Two Sum",
    slug: "two-sum",
    categoryLabel: "Arrays",
    difficulty: "easy",
    prompt:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. You may assume each input has exactly one solution.",
    solutionExplanation:
      "Use a hash map to store each number and its index as you iterate. For each element, check if `target - nums[i]` exists in the map. This gives O(n) time and O(n) space.",
    language: "javascript",
    solutionCode: `function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }

  return [];
}`,
  },
  {
    id: "cq-2",
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    categoryLabel: "Stacks",
    difficulty: "easy",
    prompt:
      "Given a string containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if open brackets are closed in the correct order.",
    solutionExplanation:
      "Push opening brackets onto a stack. On closing brackets, pop and verify the pair matches. If the stack is empty at the end, the string is valid.",
    language: "javascript",
    solutionCode: `function isValid(s) {
  const pairs = { ")": "(", "}": "{", "]": "[" };
  const stack = [];

  for (const char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}`,
  },
  {
    id: "cq-3",
    title: "Reverse a Linked List",
    slug: "reverse-linked-list",
    categoryLabel: "Linked Lists",
    difficulty: "medium",
    prompt:
      "Given the head of a singly linked list, reverse the list and return the reversed list.",
    solutionExplanation:
      "Iterate with three pointers: `prev`, `curr`, and `next`. Point each node's `next` to the previous node. Move forward until `curr` is null, then return `prev`.",
    language: "javascript",
    solutionCode: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}`,
  },
  {
    id: "cq-4",
    title: "Binary Search",
    slug: "binary-search",
    categoryLabel: "Search",
    difficulty: "easy",
    prompt:
      "Given a sorted array of integers `nums` and a `target` value, return the index of `target` if found. If not found, return `-1`. You must write an algorithm with O(log n) runtime.",
    solutionExplanation:
      "Maintain `left` and `right` pointers. Compare the midpoint to the target and narrow the search range. Stop when found or when pointers cross.",
    language: "javascript",
    solutionCode: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
  },
  {
    id: "cq-5",
    title: "Debounced Search Input",
    slug: "debounced-search-input",
    categoryLabel: "React",
    difficulty: "medium",
    prompt:
      "Build a React search input that debounces API calls by 300ms. Handle rapid typing and cleanup on unmount.",
    solutionExplanation:
      "Store the timeout ID in a ref. On each keystroke, clear the previous timeout and schedule a new one. Use `useEffect` cleanup to clear pending timeouts when the component unmounts.",
    language: "tsx",
    solutionCode: `import { useEffect, useRef, useState } from "react";

export function DebouncedSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timeoutRef.current);
  }, [query, onSearch]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
  },
  {
    id: "cq-6",
    title: "Merge Intervals",
    slug: "merge-intervals",
    categoryLabel: "Arrays",
    difficulty: "medium",
    prompt:
      "Given an array of intervals where `intervals[i] = [start, end]`, merge all overlapping intervals and return the result.",
    solutionExplanation:
      "Sort intervals by start time. Iterate and merge into the result if the current interval overlaps the last merged one; otherwise push a new interval.",
    language: "javascript",
    solutionCode: `function merge(intervals) {
  if (!intervals.length) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const [start, end] = intervals[i];

    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push(intervals[i]);
    }
  }

  return merged;
}`,
  },
  {
    id: "cq-7",
    title: "Implement Promise.all",
    slug: "implement-promise-all",
    categoryLabel: "JavaScript",
    difficulty: "medium",
    prompt:
      "Implement your own version of `Promise.all` that resolves when all promises resolve, or rejects immediately when any promise rejects.",
    solutionExplanation:
      "Track resolved count in an array. Reject on first failure. Resolve with the collected results once every promise has settled successfully.",
    language: "javascript",
    solutionCode: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);

    const results = new Array(promises.length);
    let settled = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          settled += 1;
          if (settled === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}`,
  },
  {
    id: "cq-8",
    title: "LRU Cache",
    slug: "lru-cache",
    categoryLabel: "Design",
    difficulty: "hard",
    prompt:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement `get` and `put` in O(1) average time.",
    solutionExplanation:
      "Combine a Map for O(1) lookups with a doubly linked list for O(1) eviction of the least recently used entry. Move accessed nodes to the front on every `get` or `put`.",
    language: "javascript",
    solutionCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
  }
}`,
  },
];

export function getCodingQuestion(slug: string): CodingQuestion | undefined {
  return codingQuestions.find((q) => q.slug === slug);
}
