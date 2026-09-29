/* CareerNova - Curated DSA Practice Problems */

export const DSA_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    hint: "Use a hash map to store the difference between the target and current value. This allows O(n) lookup time.",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/"
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    companies: ["Amazon", "Microsoft", "Meta"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets and in the correct order.",
    example: "Input: s = \"()[]{}\"\nOutput: true\n\nInput: s = \"(]\"\nOutput: false",
    hint: "Push open brackets onto a stack. When an opening bracket is matched with a closing bracket, pop from the stack. Check if stack is empty at the end.",
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/"
  },
  {
    id: 3,
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    companies: ["Google", "Amazon", "Microsoft"],
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list. Can you solve it both iteratively and recursively?",
    example: "Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]",
    hint: "Maintain three pointers: prev, curr, and next. At each step, point curr.next to prev.",
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/"
  },
  {
    id: 4,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Array",
    companies: ["Amazon", "Google", "Microsoft"],
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    example: "Input: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
    hint: "Track the minimum price seen so far and calculate profit at each day.",
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
  },
  {
    id: 5,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "String",
    companies: ["Amazon", "Google", "Meta"],
    description: "Given a string s, find the length of the longest substring without duplicate characters.",
    example: "Input: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.",
    hint: "Use the sliding window technique with two pointers and a set or hash map to store visited characters.",
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
  },
  {
    id: 6,
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    companies: ["Google", "Microsoft", "Amazon"],
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    example: "Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.",
    hint: "At each element, choose whether to add it to the current running sum or start a fresh subarray at this element.",
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/"
  },
  {
    id: 7,
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    companies: ["Google", "Microsoft"],
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    example: "Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\nExplanation: 9 exists in nums and its index is 4",
    hint: "Calculate mid = left + (right - left) / 2 to prevent integer overflow.",
    leetcodeUrl: "https://leetcode.com/problems/binary-search/"
  },
  {
    id: 8,
    title: "Lowest Common Ancestor of a BST",
    difficulty: "Medium",
    topic: "Tree",
    companies: ["Amazon", "Meta", "Microsoft"],
    description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
    example: "Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8\nOutput: 6\nExplanation: The LCA of nodes 2 and 8 is 6.",
    hint: "Utilize BST properties: if both p and q are greater than root, go right; if both are less, go left; otherwise current node is LCA.",
    leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"
  },
  {
    id: 9,
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graph",
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    example: "Input: grid = [\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"1\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"1\",\"1\"]\n]\nOutput: 3",
    hint: "Iterate through the grid. When encountering '1', trigger a BFS or DFS traversal to mark all connected land as visited ('0').",
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/"
  },
  {
    id: 10,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    companies: ["Google", "Amazon", "Meta"],
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    example: "Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\nExplanation: The elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.",
    hint: "Use two pointers from left and right maintaining leftMax and rightMax, or precompute prefix and suffix maximum arrays.",
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/"
  }
];
