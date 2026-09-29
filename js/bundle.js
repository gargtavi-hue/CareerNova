/* CareerNova - Standalone Universal Application Bundle with Web & AI Search */
(function() {
  'use strict';

  /* ==========================================================================
     1. STATE MANAGEMENT
     ========================================================================== */
  const state = {
    currentScore: 0,
    solvedDsaCount: 0,
    solvedDsaMap: {},
    dsaStreak: 1,
    savedJobIds: new Set(),
    registeredHackathonIds: new Set(),
    registeredHackathonTeams: {},
    currentUser: {
      name: 'Alex Wright',
      email: 'alex.wright@university.edu',
      college: 'Stanford University',
      branch: 'Computer Science & Engineering',
      year: '2026',
      role: 'Student'
    }
  };

  function setScore(newScore) {
    state.currentScore = Math.min(100, Math.max(0, newScore));
    return state.currentScore;
  }

  function markDsaSolved(id) {
    if (!state.solvedDsaMap[id]) {
      state.solvedDsaMap[id] = true;
      state.solvedDsaCount++;
      return true;
    }
    return false;
  }

  function unmarkDsaSolved(id) {
    if (state.solvedDsaMap[id]) {
      delete state.solvedDsaMap[id];
      state.solvedDsaCount = Math.max(0, state.solvedDsaCount - 1);
      return true;
    }
    return false;
  }

  function toggleJobSaved(jobId) {
    if (state.savedJobIds.has(jobId)) {
      state.savedJobIds.delete(jobId);
      return false;
    } else {
      state.savedJobIds.add(jobId);
      return true;
    }
  }

  // Initialize registered hackathons from localStorage if available
  try {
    const savedRegs = localStorage.getItem('careernova_registered_hackathons');
    if (savedRegs) {
      const parsed = JSON.parse(savedRegs);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => state.registeredHackathonIds.add(id));
      }
    }
  } catch(e) {}

  function registerHackathonState(id, teamInfo = {}) {
    state.registeredHackathonIds.add(id);
    state.registeredHackathonTeams[id] = teamInfo;
    try {
      localStorage.setItem('careernova_registered_hackathons', JSON.stringify([...state.registeredHackathonIds]));
    } catch(e) {}
    return true;
  }

  function unregisterHackathonState(id) {
    state.registeredHackathonIds.delete(id);
    delete state.registeredHackathonTeams[id];
    try {
      localStorage.setItem('careernova_registered_hackathons', JSON.stringify([...state.registeredHackathonIds]));
    } catch(e) {}
    return true;
  }

  function isHackathonRegistered(id) {
    return state.registeredHackathonIds.has(id);
  }

  /* ==========================================================================
     2. DATASETS
     ========================================================================== */
  const DSA_PROBLEMS = [
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

  const MOCK_QUESTIONS = {
    technical: {
      easy: [
        "What is the difference between a compiler and an interpreter?",
        "What is object-oriented programming?",
        "What is the difference between a class and an object?",
        "What is a primary key in a database?",
        "What is the purpose of an operating system?"
      ],
      medium: [
        "Explain the difference between process and thread.",
        "What is normalization in DBMS and why is it used?",
        "Explain the difference between SQL and NoSQL databases.",
        "What is polymorphism in Java? Give an example.",
        "Explain the difference between stack memory and heap memory.",
        "What is deadlock in operating systems? Explain its necessary conditions.",
        "What is an API and why is it useful?",
        "Explain the concept of inheritance in object-oriented programming."
      ],
      hard: [
        "How would you design a URL shortening service like TinyURL?",
        "Explain database indexing and discuss its advantages and trade-offs.",
        "How would you design a highly scalable notification system?",
        "Explain horizontal and vertical scaling with practical examples.",
        "How would you approach designing a system that handles millions of concurrent users?"
      ]
    },
    hr: {
      easy: [
        "Tell me about yourself.",
        "Why do you want to work in the technology industry?",
        "What are your strengths?",
        "What is one weakness you are currently working on?",
        "Where do you see yourself in the next five years?"
      ],
      medium: [
        "Tell me about a challenging project you worked on and how you handled it.",
        "Describe a time when you had a disagreement with a teammate.",
        "Tell me about a failure and what you learned from it.",
        "How do you manage multiple deadlines?",
        "Why should we hire you?",
        "Describe a situation where you had to learn something quickly.",
        "How do you handle constructive criticism?",
        "Tell me about a time you demonstrated leadership."
      ],
      hard: [
        "Tell me about a decision you made that negatively affected a team. What did you learn?",
        "Describe a situation where you strongly disagreed with your manager.",
        "You have two important deadlines tomorrow. How would you decide what to prioritize?",
        "Tell me about a professional situation where you changed your opinion after receiving new information.",
        "What would you do if you were assigned a task you believed was technically incorrect?"
      ]
    },
    dsa: {
      easy: [
        "What is the time complexity of searching for an element in an unsorted array?",
        "What is the difference between an array and a linked list?",
        "Explain how a stack works.",
        "What is a queue and where is it commonly used?",
        "What is the difference between BFS and DFS?"
      ],
      medium: [
        "Explain how you would solve the Two Sum problem.",
        "How does binary search work and what is its time complexity?",
        "How would you detect a cycle in a linked list?",
        "Explain the sliding window technique with an example.",
        "How would you find the first non-repeating character in a string?",
        "Explain how a hash table works.",
        "How would you find the maximum subarray sum?",
        "Explain the difference between BFS and DFS and when you would use each."
      ],
      hard: [
        "Explain an efficient approach to solving the Trapping Rain Water problem.",
        "How would you find the shortest path in a weighted graph?",
        "Explain a dynamic programming approach to the Coin Change problem.",
        "How would you detect a cycle in a directed graph?",
        "Explain how you would approach the Longest Increasing Subsequence problem."
      ]
    },
    company: {
      easy: [
        "Tell me about yourself and your technical background.",
        "Why are you interested in joining a technology company?",
        "What programming language are you most comfortable with?",
        "Describe a project you are proud of.",
        "What technical skill are you currently improving?"
      ],
      medium: [
        "Explain one technical project from your resume in detail.",
        "How would you optimize a slow piece of code?",
        "How do you approach debugging a problem you have never seen before?",
        "Explain a challenging technical decision you made in a project.",
        "How would you design a scalable web application?",
        "Which data structures do you use most frequently and why?",
        "How do you ensure the quality of your code?",
        "Explain a technical concept to a non-technical person."
      ],
      hard: [
        "Design a scalable system for processing millions of events per day.",
        "How would you investigate a sudden performance degradation in production?",
        "Design a distributed caching system and explain your trade-offs.",
        "How would you design an application that must remain available even when individual servers fail?",
        "Walk me through how you would design a large-scale collaborative application."
      ]
    }
  };

  const COMPANY_PREP_DATA = {
    Google: {
      careers: "https://www.google.com/about/careers/applications/jobs/results",
      roles: "Software Engineer / AI-ML Engineer",
      difficulty: "Advanced",
      rounds: "Coding + Technical + Behavioral",
      skills: ["DSA", "Python", "Java", "Algorithms", "System Design", "DBMS", "Operating Systems"],
      dsa: ["Arrays", "Strings", "Trees", "Graphs", "Dynamic Programming", "Binary Search", "Hashing"],
      questions: [
        "Explain your approach to solving a graph problem.",
        "How would you optimize an algorithm from O(n²) to O(n log n)?",
        "Explain a technical project from your resume.",
        "How would you design a scalable system?",
        "Tell me about a difficult problem you solved."
      ],
      checklist: [
        "Revise DSA fundamentals",
        "Practice medium and hard DSA problems",
        "Revise DBMS and Operating Systems",
        "Prepare project explanations",
        "Practice behavioral questions"
      ]
    },
    Microsoft: {
      careers: "https://careers.microsoft.com/v2/global/en/home.html",
      roles: "Software Engineer / Cloud Engineer",
      difficulty: "Advanced",
      rounds: "Coding + Technical + Behavioral",
      skills: ["DSA", "C++", "Java", "Python", "OOP", "DBMS", "Azure"],
      dsa: ["Arrays", "Linked Lists", "Trees", "Graphs", "Stacks & Queues", "Dynamic Programming", "Sorting"],
      questions: [
        "Explain object-oriented programming with an example.",
        "How would you detect a cycle in a linked list?",
        "Explain the difference between process and thread.",
        "How would you design a scalable web application?",
        "Describe a challenging technical problem you solved."
      ],
      checklist: [
        "Practice DSA regularly",
        "Revise OOP concepts",
        "Practice coding in your strongest language",
        "Revise DBMS and OS",
        "Prepare project and HR answers"
      ]
    },
    Amazon: {
      careers: "https://www.amazon.jobs/en/job-category/software-development",
      roles: "Software Development Engineer",
      difficulty: "Advanced",
      rounds: "Online Assessment + Technical + Leadership",
      skills: ["DSA", "Java", "Python", "Algorithms", "OOP", "AWS", "Problem Solving"],
      dsa: ["Arrays", "Strings", "Trees", "Graphs", "Heaps", "Dynamic Programming", "Sliding Window"],
      questions: [
        "How would you solve the Two Sum problem efficiently?",
        "Explain a tree traversal and its complexity.",
        "How would you design a scalable service?",
        "Describe a situation where you solved a difficult problem.",
        "How do you handle a technical disagreement in a team?"
      ],
      checklist: [
        "Practice DSA problems",
        "Revise core CS concepts",
        "Practice coding under time limits",
        "Prepare project explanations",
        "Practice behavioral answers"
      ]
    },
    Infosys: {
      careers: "https://www.infosys.com/careers/apply.html",
      roles: "Systems Engineer / Software Engineer",
      difficulty: "Beginner–Intermediate",
      rounds: "Aptitude + Coding + Technical + HR",
      skills: ["Java", "Python", "SQL", "OOP", "DBMS", "Aptitude", "Communication"],
      dsa: ["Arrays", "Strings", "Sorting", "Searching", "Linked Lists", "Stacks", "Queues"],
      questions: [
        "What is OOP? Explain its main principles.",
        "What is normalization in DBMS?",
        "Write a program to check whether a number is prime.",
        "What is the difference between an array and a linked list?",
        "Tell me about your academic project."
      ],
      checklist: [
        "Practice aptitude questions",
        "Revise Java or Python basics",
        "Revise SQL queries",
        "Practice basic DSA",
        "Prepare HR questions"
      ]
    },
    TCS: {
      careers: "https://www.tcs.com/careers/india",
      roles: "Graduate Engineer / Software Engineer",
      difficulty: "Beginner–Intermediate",
      rounds: "Aptitude + Coding + Technical + HR",
      skills: ["Java", "Python", "SQL", "DSA", "OOP", "Aptitude", "Communication"],
      dsa: ["Arrays", "Strings", "Searching", "Sorting", "Linked Lists", "Stacks", "Queues"],
      questions: [
        "What is inheritance in Java?",
        "Explain the difference between SQL and NoSQL.",
        "Write a program to reverse a string.",
        "What is the difference between stack and queue?",
        "Explain your final-year or academic project."
      ],
      checklist: [
        "Practice aptitude",
        "Revise programming fundamentals",
        "Practice basic coding problems",
        "Revise SQL and DBMS",
        "Prepare HR questions"
      ]
    },
    NVIDIA: {
      careers: "https://jobs.nvidia.com/careers",
      roles: "AI Engineer / Software Engineer",
      difficulty: "Advanced",
      rounds: "Technical + Coding + System Design",
      skills: ["C++", "Python", "AI / ML", "CUDA", "DSA", "Computer Architecture", "Algorithms"],
      dsa: ["Arrays", "Graphs", "Trees", "Dynamic Programming", "Hashing", "Bit Manipulation"],
      questions: [
        "Explain the difference between CPU and GPU architecture.",
        "What is CUDA and why is it useful?",
        "Explain an ML project you have worked on.",
        "How would you optimize a computationally expensive algorithm?",
        "Explain the time and space complexity of your solution."
      ],
      checklist: [
        "Revise C++ fundamentals",
        "Strengthen DSA",
        "Revise AI/ML concepts",
        "Study computer architecture",
        "Prepare technical project explanations"
      ]
    }
  };

  /* ==========================================================================
     3. TOAST CONTROLLER
     ========================================================================== */
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    toast.innerText = message;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.classList.add('hidden'), 250);
    }, 3200);
  }

  /* ==========================================================================
     4. DASHBOARD & GAUGE VISUALS
     ========================================================================== */
  function updateGaugeVisual(score) {
    const currentScore = setScore(score);

    const circumference = 408;
    const offset = circumference - (circumference * currentScore / 100);

    const circleEl = document.getElementById('readiness-gauge-circle');
    if (circleEl) circleEl.style.strokeDashoffset = offset;

    const scoreText = document.getElementById('gauge-score-text');
    if (scoreText) scoreText.innerText = `${currentScore}%`;

    const tierBadge = document.getElementById('gauge-tier-badge');
    if (tierBadge) {
      if (currentScore === 0) {
        tierBadge.innerText = 'Diagnostic Baseline: 0%';
        tierBadge.className = 'badge badge-navy';
      } else if (currentScore >= 85) {
        tierBadge.innerText = 'Tier 1 Qualified';
        tierBadge.className = 'badge badge-green';
      } else if (currentScore >= 60) {
        tierBadge.innerText = 'Tier 2 Candidate';
        tierBadge.className = 'badge badge-orange';
      } else {
        tierBadge.innerText = `Preparation Score: ${currentScore}%`;
        tierBadge.className = 'badge badge-navy';
      }
    }

    const sysBar = document.getElementById('skill-sys-bar');
    const sysText = document.getElementById('skill-sys-text');
    if (sysBar && sysText) {
      const sysVal = Math.min(100, Math.round(currentScore * 0.9));
      sysBar.style.width = `${sysVal}%`;
      sysText.innerText = `${sysVal}%`;
    }

    const resBar = document.getElementById('skill-res-bar');
    const resText = document.getElementById('skill-res-text');
    if (resBar && resText) {
      const resVal = Math.min(100, Math.round(currentScore * 0.85));
      resBar.style.width = `${resVal}%`;
      resText.innerText = `${resVal}%`;
    }
  }

  function updatePriorityTask(title, desc, btnLabel, actionFn) {
    const tEl = document.getElementById('priority-title-text');
    const dEl = document.getElementById('priority-desc-text');
    const bEl = document.getElementById('priority-cta-btn');
    if (tEl) tEl.innerText = title;
    if (dEl) dEl.innerText = desc;
    if (bEl) {
      bEl.innerText = btnLabel;
      bEl.onclick = actionFn;
    }
  }

  /* ==========================================================================
     5. NAVIGATION & VIEW ROUTING
     ========================================================================== */
  function switchView(viewId) {
    document.body.classList.toggle('applications-active', viewId === 'applications');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const pageViews = document.querySelectorAll('.page-view');
    pageViews.forEach(view => {
      if (view.id === `view-${viewId}`) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    });
  }

  function handleGlobalSearch(query) {
    if (!query) return;
    const q = query.toLowerCase().trim();

    if (q.includes('dsa') || q.includes('tree') || q.includes('algorithm') || q.includes('array') || q.includes('stack')) {
      switchView('dsa');
      const searchInput = document.getElementById('dsa-search');
      if (searchInput) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else if (q.includes('job') || q.includes('google') || q.includes('microsoft') || q.includes('amazon') || q.includes('hire')) {
      switchView('jobs');
    } else if (q.includes('college') || q.includes('tpo') || q.includes('campus') || q.includes('roster')) {
      switchView('college');
    } else if (q.includes('hackathon') || q.includes('sprint') || q.includes('challenge')) {
      switchView('hackathons');
    } else if (q.includes('application') || q.includes('company') || q.includes('tcs') || q.includes('nvidia') || q.includes('infosys')) {
      switchView('applications');
      const compSearch = document.getElementById('company-search');
      if (compSearch) {
        compSearch.value = query;
        compSearch.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  /* ==========================================================================
     6. AUTHENTICATION & DEMO PROFILES
     ========================================================================== */
  function handleAuthSubmit(event) {
    if (event && event.preventDefault) event.preventDefault();

    const name = document.getElementById('auth-name')?.value?.trim() || 'Alex Wright';
    const email = document.getElementById('auth-email')?.value?.trim() || 'alex.wright@university.edu';
    const college = document.getElementById('auth-college')?.value?.trim() || 'Stanford University';
    const branch = document.getElementById('auth-branch')?.value || 'Computer Science & Engineering';
    const year = document.getElementById('auth-year')?.value || '2026';

    state.currentUser = { name, email, college, branch, year, role: 'Student' };

    const nameEl = document.getElementById('sidebar-user-name');
    if (nameEl) nameEl.innerText = name;

    const roleEl = document.getElementById('sidebar-user-role');
    if (roleEl) roleEl.innerText = `${college.split(' ')[0]} • ${year}`;

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const avatarEl = document.getElementById('sidebar-user-avatar');
    if (avatarEl) avatarEl.innerText = initials || 'AW';

    const heroNameEl = document.getElementById('hero-student-name');
    if (heroNameEl) heroNameEl.innerText = name;

    const heroSubEl = document.getElementById('hero-profile-subtitle');
    if (heroSubEl) heroSubEl.innerText = `${college} • ${branch} '${year.slice(-2)}`;

    document.getElementById('auth-view')?.classList.add('hidden');
    document.getElementById('app-shell')?.classList.remove('hidden');

    updateGaugeVisual(state.currentScore || 0);
    switchView('dashboard');
    showToast(`Welcome ${name}! Candidate portal initialized for ${college}.`);
  }

  function demoSignIn(roleType) {
    if (roleType === 'Student') {
      const nameInput = document.getElementById('auth-name');
      const collegeInput = document.getElementById('auth-college');
      const branchInput = document.getElementById('auth-branch');
      const yearInput = document.getElementById('auth-year');

      if (nameInput) nameInput.value = 'Alexander Wright';
      if (collegeInput) collegeInput.value = 'Stanford University';
      if (branchInput) branchInput.value = 'Computer Science & Engineering';
      if (yearInput) yearInput.value = '2026';

      handleAuthSubmit({ preventDefault: () => {} });
    } else {
      state.currentUser = {
        name: 'Dr. Robert Vance (TPO)',
        email: 'tpo@university.edu',
        college: 'Stanford University',
        branch: 'Placement Cell',
        year: 'Admin',
        role: 'TPO'
      };

      const nameEl = document.getElementById('sidebar-user-name');
      if (nameEl) nameEl.innerText = 'Dr. Robert Vance (TPO)';

      const roleEl = document.getElementById('sidebar-user-role');
      if (roleEl) roleEl.innerText = 'Placement Officer';

      const avatarEl = document.getElementById('sidebar-user-avatar');
      if (avatarEl) avatarEl.innerText = 'TP';

      const heroNameEl = document.getElementById('hero-student-name');
      if (heroNameEl) heroNameEl.innerText = 'TPO Officer';

      const heroSubEl = document.getElementById('hero-profile-subtitle');
      if (heroSubEl) heroSubEl.innerText = 'Stanford University TPO Office • Campus Placement Coordinator';

      document.getElementById('auth-view')?.classList.add('hidden');
      document.getElementById('app-shell')?.classList.remove('hidden');
      switchView('college');
      showToast('Signed in as Campus Placement Officer (TPO Portal)');
    }
  }

  function handleSignOut() {
    document.getElementById('app-shell')?.classList.add('hidden');
    document.getElementById('auth-view')?.classList.remove('hidden');
    showToast('Signed out successfully.');
  }

  /* ==========================================================================
     7. DSA PRACTICE MODULE
     ========================================================================== */
  function initDsaModule() {
    renderDsaProblems();
    updateDsaProgressUI();
  }

  function renderDsaProblems(problems = getFilteredDsaProblems()) {
    const container = document.getElementById('dsa-problem-list');
    const noResults = document.getElementById('dsa-no-results');
    if (!container) return;

    container.innerHTML = '';

    if (problems.length === 0) {
      if (noResults) noResults.style.display = 'block';
      return;
    }

    if (noResults) noResults.style.display = 'none';

    problems.forEach(p => {
      const isCompleted = !!state.solvedDsaMap[p.id];
      const diffClass = p.difficulty.toLowerCase();

      const card = document.createElement('div');
      card.className = `dsa-problem-card ${isCompleted ? 'completed' : ''}`;
      card.setAttribute('data-id', p.id);
      card.onclick = () => openDsaProblem(p.id);

      const companyChips = p.companies.map(c => `<span class="company-chip">${c}</span>`).join('');

      card.innerHTML = `
        <div class="dsa-card-top">
          <span class="dsa-badge ${diffClass}">${p.difficulty}</span>
          <span class="dsa-problem-topic">${p.topic}</span>
        </div>
        <h3 class="dsa-problem-title">${p.title}</h3>
        <div class="dsa-company-list">
          ${companyChips}
        </div>
        <div class="dsa-card-actions">
          <a href="${p.leetcodeUrl}" target="_blank" class="leetcode-btn" onclick="event.stopPropagation()">
            Solve on LeetCode ↗
          </a>
          <button 
            class="complete-dsa-btn ${isCompleted ? 'completed-btn' : ''}" 
            onclick="event.stopPropagation(); toggleDsaCompleted(${p.id})">
            ${isCompleted ? 'Completed ✓' : 'Mark Complete'}
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  function getFilteredDsaProblems() {
    const searchInput = document.getElementById('dsa-search');
    const topicFilter = document.getElementById('dsa-topic-filter');
    const diffFilter = document.getElementById('dsa-difficulty-filter');
    const compFilter = document.getElementById('dsa-company-filter');

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedTopic = topicFilter ? topicFilter.value : 'all';
    const selectedDiff = diffFilter ? diffFilter.value : 'all';
    const selectedComp = compFilter ? compFilter.value : 'all';

    return DSA_PROBLEMS.filter(p => {
      const matchesSearch = !query || 
        p.title.toLowerCase().includes(query) ||
        p.topic.toLowerCase().includes(query) ||
        p.companies.some(c => c.toLowerCase().includes(query));

      const matchesTopic = selectedTopic === 'all' || p.topic.toLowerCase() === selectedTopic.toLowerCase();
      const matchesDiff = selectedDiff === 'all' || p.difficulty.toLowerCase() === selectedDiff.toLowerCase();
      const matchesComp = selectedComp === 'all' || p.companies.some(c => c.toLowerCase() === selectedComp.toLowerCase());

      return matchesSearch && matchesTopic && matchesDiff && matchesComp;
    });
  }

  function filterDsaProblems() {
    renderDsaProblems(getFilteredDsaProblems());
  }

  function openDsaProblem(problemId) {
    const problem = DSA_PROBLEMS.find(p => p.id === problemId);
    if (!problem) return;

    const isCompleted = !!state.solvedDsaMap[problemId];

    const diffBadge = document.getElementById('modal-dsa-difficulty');
    if (diffBadge) {
      diffBadge.innerText = problem.difficulty;
      diffBadge.className = `dsa-badge ${problem.difficulty.toLowerCase()}`;
    }

    const titleEl = document.getElementById('modal-dsa-title');
    if (titleEl) titleEl.innerText = problem.title;

    const topicEl = document.getElementById('modal-dsa-topic');
    if (topicEl) topicEl.innerText = problem.topic;

    const companiesContainer = document.getElementById('modal-dsa-companies');
    if (companiesContainer) {
      companiesContainer.innerHTML = problem.companies
        .map(c => `<span class="company-chip">${c}</span>`)
        .join('');
    }

    const descEl = document.getElementById('modal-dsa-description');
    if (descEl) descEl.innerText = problem.description;

    const exEl = document.getElementById('modal-dsa-example');
    if (exEl) exEl.innerText = problem.example;

    const hintEl = document.getElementById('modal-dsa-hint');
    if (hintEl) hintEl.innerText = problem.hint;

    const leetcodeBtn = document.getElementById('modal-leetcode-btn');
    if (leetcodeBtn) {
      leetcodeBtn.onclick = () => window.open(problem.leetcodeUrl, '_blank');
    }

    const completeBtn = document.getElementById('modal-complete-btn');
    if (completeBtn) {
      completeBtn.className = `complete-dsa-btn ${isCompleted ? 'completed-btn' : ''}`;
      completeBtn.innerText = isCompleted ? 'Completed ✓' : 'Mark Completed';
      completeBtn.onclick = () => {
        toggleDsaCompleted(problemId);
        closeDsaProblem();
      };
    }

    const modal = document.getElementById('dsa-problem-modal');
    if (modal) modal.style.display = 'flex';
  }

  function closeDsaProblem() {
    const modal = document.getElementById('dsa-problem-modal');
    if (modal) modal.style.display = 'none';
  }

  function openRandomDsa() {
    const unsolved = DSA_PROBLEMS.filter(p => !state.solvedDsaMap[p.id]);
    const pool = unsolved.length > 0 ? unsolved : DSA_PROBLEMS;
    const randomProblem = pool[Math.floor(Math.random() * pool.length)];
    if (randomProblem) {
      openDsaProblem(randomProblem.id);
    }
  }

  function toggleDsaCompleted(problemId) {
    const problem = DSA_PROBLEMS.find(p => p.id === problemId);
    if (!problem) return;

    if (!state.solvedDsaMap[problemId]) {
      markDsaSolved(problemId);
      showToast(`Marked "${problem.title}" as completed!`);
    } else {
      unmarkDsaSolved(problemId);
      showToast(`Unmarked "${problem.title}".`);
    }

    updateDsaProgressUI();
    renderDsaProblems();

    const newScore = Math.min(100, state.solvedDsaCount * 8);
    updateGaugeVisual(newScore);

    if (state.solvedDsaCount >= 5) {
      updatePriorityTask(
        'Step 2: Submit Google & Microsoft Campus Drive Applications',
        'Your DSA score is benchmarked! Next priority is submitting target application packages for scheduled recruitment drives.',
        'Apply to Target Drives →',
        () => switchView('applications')
      );
    }
  }

  function updateDsaProgressUI() {
    const total = DSA_PROBLEMS.length;
    const solved = state.solvedDsaCount;
    const pct = Math.round((solved / total) * 100);

    const countEl = document.getElementById('dsa-solved-count');
    if (countEl) countEl.innerText = solved;

    const pctEl = document.getElementById('dsa-percentage');
    if (pctEl) pctEl.innerText = `${pct}%`;

    const barEl = document.getElementById('dsa-progress-bar');
    if (barEl) barEl.style.width = `${pct}%`;

    const streakEl = document.getElementById('dsa-streak');
    if (streakEl) streakEl.innerText = solved > 0 ? solved + 1 : 1;

    let easySolved = 0;
    let medSolved = 0;
    let hardSolved = 0;

    DSA_PROBLEMS.forEach(p => {
      if (state.solvedDsaMap[p.id]) {
        if (p.difficulty === 'Easy') easySolved++;
        else if (p.difficulty === 'Medium') medSolved++;
        else if (p.difficulty === 'Hard') hardSolved++;
      }
    });

    const easyEl = document.getElementById('dsa-easy-count');
    if (easyEl) easyEl.innerText = easySolved;

    const medEl = document.getElementById('dsa-medium-count');
    if (medEl) medEl.innerText = medSolved;

    const hardEl = document.getElementById('dsa-hard-count');
    if (hardEl) hardEl.innerText = hardSolved;

    const dsaBar = document.getElementById('skill-dsa-bar');
    const dsaText = document.getElementById('skill-dsa-text');
    if (dsaBar) dsaBar.style.width = `${pct}%`;
    if (dsaText) dsaText.innerText = `${solved} / ${total} Solved`;
  }

  /* ==========================================================================
     8. TOP TECH APPLICATIONS MODULE
     ========================================================================== */
  function filterCompanies() {
    const searchInput = document.getElementById('company-search');
    const categoryFilter = document.getElementById('company-category-filter');
    const cards = document.querySelectorAll('.company-card');

    if (!searchInput || !categoryFilter) return;

    const searchValue = searchInput.value.toLowerCase().trim();
    const categoryValue = categoryFilter.value;

    cards.forEach(card => {
      const company = card.dataset.company ? card.dataset.company.toLowerCase() : '';
      const category = card.dataset.category || '';
      const searchData = card.dataset.search ? card.dataset.search.toLowerCase() : '';

      const matchesSearch = !searchValue ||
        company.includes(searchValue) ||
        searchData.includes(searchValue);

      const matchesCategory =
        categoryValue === 'All' ||
        category === categoryValue;

      if (matchesSearch && matchesCategory) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function openCompanyPreparation(companyName) {
    const data = COMPANY_PREP_DATA[companyName];
    if (!data) {
      showToast('Company preparation data is not available yet.');
      return;
    }

    const nameEl = document.getElementById('prep-company-name');
    if (nameEl) nameEl.innerText = companyName;

    const roleSubEl = document.getElementById('prep-company-role');
    if (roleSubEl) roleSubEl.innerText = data.roles;

    const rolesEl = document.getElementById('prep-roles');
    if (rolesEl) rolesEl.innerText = data.roles;

    const diffEl = document.getElementById('prep-difficulty');
    if (diffEl) diffEl.innerText = data.difficulty;

    const roundsEl = document.getElementById('prep-rounds');
    if (roundsEl) roundsEl.innerText = data.rounds;

    const skillsContainer = document.getElementById('prep-skills');
    if (skillsContainer) {
      skillsContainer.innerHTML = '';
      data.skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'prep-tag';
        tag.innerText = skill;
        skillsContainer.appendChild(tag);
      });
    }

    const dsaContainer = document.getElementById('prep-dsa');
    if (dsaContainer) {
      dsaContainer.innerHTML = '';
      data.dsa.forEach(topic => {
        const tag = document.createElement('span');
        tag.className = 'prep-tag';
        tag.innerText = topic;
        dsaContainer.appendChild(tag);
      });
    }

    const questionsContainer = document.getElementById('prep-questions');
    if (questionsContainer) {
      questionsContainer.innerHTML = '';
      data.questions.forEach((question, index) => {
        const questionBox = document.createElement('div');
        questionBox.className = 'prep-question';
        questionBox.innerHTML = `<strong>Q${index + 1}.</strong> ${question}`;
        questionsContainer.appendChild(questionBox);
      });
    }

    const checklistContainer = document.getElementById('prep-checklist');
    if (checklistContainer) {
      checklistContainer.innerHTML = '';
      data.checklist.forEach((item, index) => {
        const label = document.createElement('label');
        label.className = 'prep-check-item';
        label.innerHTML = `
          <input type="checkbox" id="prep-check-${companyName}-${index}">
          <span>${item}</span>
        `;
        checklistContainer.appendChild(label);
      });
    }

    const opportunityButton = document.getElementById('prep-opportunity-btn');
    if (opportunityButton) {
      opportunityButton.onclick = function () {
        window.open(data.careers, '_blank');
      };
    }

    document.getElementById('company-prep-modal')?.classList.remove('hidden');
  }

  function closeCompanyPreparation() {
    document.getElementById('company-prep-modal')?.classList.add('hidden');
  }

  /* ==========================================================================
     9. JOBS MODULE
     ========================================================================== */
  function filterJobs() {
    const roleFilter = document.getElementById('job-role-filter');
    const typeFilter = document.getElementById('job-type-filter');
    const rows = document.querySelectorAll('#jobs-container .job-row');
    const countEl = document.getElementById('job-count');

    if (!roleFilter || !typeFilter) return;

    const roleVal = roleFilter.value;
    const typeVal = typeFilter.value;
    let visibleCount = 0;

    rows.forEach(row => {
      const rowRole = row.getAttribute('data-role');
      const rowType = row.getAttribute('data-type');

      const matchesRole = (roleVal === 'All' || rowRole === roleVal);
      const matchesType = (typeVal === 'All' || rowType === typeVal);

      if (matchesRole && matchesType) {
        row.style.display = 'flex';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (countEl) countEl.innerText = visibleCount;
  }

  function toggleSavedJob(button) {
    if (!button) return;
    button.classList.toggle('saved');

    if (button.classList.contains('saved')) {
      button.innerText = '♥';
      showToast('Job saved successfully.');
    } else {
      button.innerText = '♡';
      showToast('Job removed from saved jobs.');
    }
  }

  /* ==========================================================================
     10. HACKATHONS MODULE & DATA
     ========================================================================== */
  /* CareerNova - Placement Hackathons & Drives Data Store */

const HACKATHONS_DATA = {
  'sih-2026': {
    id: 'sih-2026',
    title: 'Smart India Hackathon 2026',
    icon: '🔥',
    organizer: 'Government of India (MoE & AICTE)',
    category: 'Open Innovation',
    mode: 'Online',
    location: 'National AICTE Portal / Nodal Centers',
    deadline: '12 Oct 2026',
    deadlineDate: '2026-10-12',
    status: 'Upcoming',
    statusBadgeClass: 'badge-navy',
    prize: '₹1,00,000',
    prizeSubtitle: 'Per Problem Statement (₹1 Cr Total Pool)',
    prizeAmount: 100000,
    eligibility: 'All College Undergrads & Postgrads (AICTE / UGC Institutes)',
    teamSize: '3 to 6 Members (Min. 1 Female Participant)',
    description: "The world's largest open innovation initiative. Solve pressing real-world problem statements submitted by 50+ central ministries, state departments, and premier PSUs. Top teams receive direct placement fast-tracks, central funding grants, and national recognition.",
    tags: ['Govt of India', 'AICTE', 'Open Innovation', 'Grant Funding', 'Placement Fast-Track'],
    officialUrl: 'https://www.sih.gov.in/',
    problemStatements: [
      'Smart Automation & Leakage Detection for Public Distribution (MoCA)',
      'AI-Powered Multi-Spectral Crop Disease Early Diagnosis (MoA&FW)',
      'Offline Mesh Disaster Early-Warning Network for Coastal Regions (NDMA)',
      'Blockchain-Verified Academic Credential & Skill Repository (AICTE)'
    ],
    rounds: [
      'Campus Internal Hackathon & SPOC Vetting (Sep 2026)',
      'National Idea Evaluation & Screening (Mid Oct 2026)',
      '36-Hour Non-stop Grand Finale at Assigned Nodal Center (Nov 2026)'
    ],
    perks: [
      '₹1,00,000 Cash Prize for each winning team per theme',
      'Direct interview fast-tracks with participating ministry tech units & sponsors',
      'Fast-track incubation support and up to ₹10 Lakhs seed funding grant',
      'National Certificate of Honor issued by Ministry of Education'
    ]
  },

  'flipkart-grid-7': {
    id: 'flipkart-grid-7',
    title: 'Flipkart GRiD 7.0 - SDE Sprint',
    icon: '⚡',
    organizer: 'Flipkart Internet Pvt. Ltd.',
    category: 'Web Development',
    mode: 'Online',
    location: 'Virtual via Unstop',
    deadline: '18 Oct 2026',
    deadlineDate: '2026-10-18',
    status: 'Closing Soon',
    statusBadgeClass: 'badge-orange',
    prize: '₹5,00,000',
    prizeSubtitle: '+ Direct SDE Pre-Placement Interviews (₹32 LPA)',
    prizeAmount: 500000,
    eligibility: 'B.Tech / B.E / M.Tech / MCA (Batch of 2026 & 2027)',
    teamSize: '1 to 3 Members',
    description: 'Flipkart’s flagship engineering campus challenge engineered to test your mettle on real-world e-commerce scalability. Solve high-throughput checkout queues, distributed cache consistency, and supply chain routing under mega sales scale.',
    tags: ['Flipkart', 'Web Development', 'SDE PPI', 'Microservices', '32 LPA CTC'],
    officialUrl: 'https://unstop.com/hackathons/flipkart-grid',
    problemStatements: [
      'Sub-second Lock-Free Inventory Allocation for Big Billion Days',
      'Real-time Multi-tenant Event Driven Fraud Detection Engine',
      'Automated Optical Quality Inspection for Return Package Logistics'
    ],
    rounds: [
      'Round 1: E-Commerce Domain & Advanced CS Fundamentals Quiz',
      'Round 2: Scalable Coding Challenge & Edge Case Stress Testing',
      'Round 3: Hackathon Prototype MVP & Architectural Defense',
      'National Grand Finale & Live Demonstration to Flipkart Fellows'
    ],
    perks: [
      'Pre-Placement Interview (PPI) for SDE-1 roles (₹32 LPA CTC)',
      '₹5,00,000 Cash Prize pool divided among top finalists',
      'Direct mentorship from Principal Architects at Flipkart',
      'Exclusive Flipkart GRiD finalist tech kit and digital credentials'
    ]
  },

  'google-genai-2026': {
    id: 'google-genai-2026',
    title: 'Google Cloud GenAI Challenge',
    icon: '🤖',
    organizer: 'Google Cloud',
    category: 'AI & ML',
    mode: 'Online',
    location: 'Virtual / Google Cloud Innovators Portal',
    deadline: '30 Oct 2026',
    deadlineDate: '2026-10-30',
    status: 'Upcoming',
    statusBadgeClass: 'badge-navy',
    prize: '₹16,50,000',
    prizeSubtitle: '($20,000 Total Pool) + $2k Cloud Credits',
    prizeAmount: 1650000,
    eligibility: 'All Engineering, BCA/MCA & CS Undergrads / Grads',
    teamSize: '1 to 4 Members',
    description: 'Build enterprise-grade multimodal generative AI agents and intelligent search systems powered by Gemini 1.5 Pro, Vertex AI, and vector retrieval. Outstanding teams receive direct recruiter CV highlights and cloud compute stipends.',
    tags: ['Google Cloud', 'Gemini 1.5', 'GenAI', 'Vertex AI', 'Fast-Track'],
    officialUrl: 'https://cloud.google.com/innovators',
    problemStatements: [
      'Autonomous Multi-Agent Workflow Orchestrator with Tool-Use & Memory',
      'Multimodal Clinical Diagnostic Assistant with Citation & Grounding',
      'Zero-Shot Codebase Modernization & Unit Test Synthesis Assistant'
    ],
    rounds: [
      'Idea Proposal, Architecture Diagram & Vertex AI Service Plan',
      'Prototype Implementation & Gemini 1.5 API Integration Submission',
      'Live Virtual Demo & Technical Defense with Google AI Engineers'
    ],
    perks: [
      'Direct recruiter review for Software Engineer & AI Specialist internships',
      '$2,000 USD Google Cloud credits for all shortlisted teams',
      'Google Pixel devices & official Google Cloud Developer swag bags',
      'Featured showcase in the Google Cloud Global Innovators directory'
    ]
  },

  'tcs-hackquest-10': {
    id: 'tcs-hackquest-10',
    title: 'TCS HackQuest Season 10',
    icon: '🛡️',
    organizer: 'Tata Consultancy Services',
    category: 'Cybersecurity',
    mode: 'Online',
    location: 'Virtual / TCS iON Platform',
    deadline: '05 Nov 2026',
    deadlineDate: '2026-11-05',
    status: 'Upcoming',
    statusBadgeClass: 'badge-navy',
    prize: '₹5,00,000',
    prizeSubtitle: '+ Direct TCS Prime (9 LPA) & Digital (7 LPA) Job Offers',
    prizeAmount: 500000,
    eligibility: 'B.E / B.Tech / M.E / M.Tech / MCA (2026 & 2027 Batches)',
    teamSize: 'Individual (1 Member)',
    description: 'Premier national cybersecurity Capture-The-Flag (CTF) tournament. Put your ethical hacking skills to the test across web security, system exploitation, cryptography, digital forensics, and binary reverse engineering.',
    tags: ['Cybersecurity', 'CTF', 'TCS Prime', 'TCS Digital', 'Job Offers'],
    officialUrl: 'https://www.tcs.com/careers/hackquest',
    problemStatements: [
      'Web Application Exploitation: Advanced Blind SQLi & JWT Forgery',
      'Binary Reverse Engineering & ROP Chain Buffer Overflow Exploits',
      'Cryptographic Analysis: Elliptic Curve Fault Attacks & Zero-Knowledge'
    ],
    rounds: [
      'Round 1: 24-Hour Non-stop Online CTF Competition (iON Platform)',
      'Round 2: Security Methodology Presentation & Exploit Documentation',
      'Direct Technical Interview Rounds with TCS Cyber Security Unit Heads'
    ],
    perks: [
      'Direct placement offer letters for TCS Prime (9 LPA) and TCS Digital (7 LPA)',
      'Total cash bounty of ₹5,00,000 for top individual rankers',
      'Waiver of standard campus aptitude & national qualifier test',
      'Specialized certification from TCS Cyber Security Center of Excellence'
    ]
  },

  'cloudflare-systems-2026': {
    id: 'cloudflare-systems-2026',
    title: 'Distributed Systems Sprint',
    icon: '🌐',
    organizer: 'Cloudflare',
    category: 'Systems & Infra',
    mode: 'Hybrid',
    location: 'Virtual + Cloudflare Bengaluru Engineering Hub',
    deadline: '25 Oct 2026',
    deadlineDate: '2026-10-25',
    status: 'Closing Soon',
    statusBadgeClass: 'badge-orange',
    prize: '₹12,50,000',
    prizeSubtitle: '($15,000 Pool) + Principal Engineer Interview Bypass',
    prizeAmount: 1250000,
    eligibility: 'Pre-final & Final Year CS / IT / Software Eng. Students',
    teamSize: '2 to 4 Members',
    description: 'Design and benchmark high-throughput edge caching and resilient proxy services handling 100k+ req/sec with under 5ms P99 latency. Judged directly by Cloudflare Principal Engineers with interview bypass passes for top teams.',
    tags: ['Cloudflare', 'Distributed Systems', 'Edge Computing', 'Rust', 'Go'],
    officialUrl: 'https://cloudflare.com/careers',
    problemStatements: [
      'High-throughput Global Key-Value Cache with Zero-Downtime Re-sharding',
      'Decentralized Rate Limiter with Gossip Protocol Synchronization',
      'Edge WebAssembly Runtime for Streaming Response Transformations'
    ],
    rounds: [
      'Architecture Specification & Distributed Invariant Verification',
      'Automated Load Test Gauntlet: 100,000 concurrent req/sec benchmark',
      'In-person / Virtual Code Defense & Technical Deep Dive'
    ],
    perks: [
      'Direct interview round bypass to Cloudflare systems engineering team',
      '$15,000 USD cash prize pool for the top 3 ranked teams',
      'Cloudflare Workers Enterprise accounts with free compute tier',
      'One-on-one architectural mentoring from Cloudflare Principal Engineers'
    ]
  },

  'aws-mobile-sprint': {
    id: 'aws-mobile-sprint',
    title: 'AWS Cross-Platform Mobile Drive',
    icon: '📱',
    organizer: 'Amazon Web Services',
    category: 'App Development',
    mode: 'Online',
    location: 'Virtual (AWS Student Developer Community)',
    deadline: '15 Nov 2026',
    deadlineDate: '2026-11-15',
    status: 'Upcoming',
    statusBadgeClass: 'badge-navy',
    prize: '₹3,50,000',
    prizeSubtitle: '+ AWS Certification Exam Vouchers & Recruiter Connect',
    prizeAmount: 350000,
    eligibility: 'All Undergraduate & Graduate Students (All Branches)',
    teamSize: '1 to 4 Members',
    description: 'Build responsive, offline-first mobile applications with Flutter or React Native backed by AWS Amplify, AppSync GraphQL, and Cognito. Winning teams receive AWS Certification exam vouchers and Amazon recruiter outreach.',
    tags: ['AWS', 'App Development', 'Mobile', 'Flutter', 'React Native', 'Amplify'],
    officialUrl: 'https://aws.amazon.com/events/',
    problemStatements: [
      'Offline-First Healthcare Delivery & Field Telemedicine Mobile App',
      'Real-time Campus Carpooling & Micromobility Tracker with Geofencing',
      'Gamified Peer-to-Peer Skill Sharing & Placement Prep Mobile Hub'
    ],
    rounds: [
      'UI/UX Wireframes, Flowcharts & AWS Architecture Diagram',
      'Working APK / TestFlight Build & GraphQL Backend Verification',
      'Final Project Showcase & Architecture Evaluation'
    ],
    perks: [
      'AWS Certified Developer Associate exam vouchers ($150 value each)',
      '₹3,50,000 in cash prizes & Amazon gift vouchers',
      'Resume spotlight with Amazon AWS Student Recruitment team',
      'AWS Starter Developer Kits and premium tech backpacks'
    ]
  },

  'polygon-web3-marathon': {
    id: 'polygon-web3-marathon',
    title: 'Polygon Web3 BUIDL Marathon',
    icon: '⛓️',
    organizer: 'Polygon Labs',
    category: 'Blockchain',
    mode: 'Offline',
    location: 'Bengaluru International Exhibition Centre (BIEC)',
    deadline: '22 Oct 2026',
    deadlineDate: '2026-10-22',
    status: 'Closing Soon',
    statusBadgeClass: 'badge-orange',
    prize: '₹20,00,000',
    prizeSubtitle: '($25,000 Bounty Pool) + VC Seed Grants',
    prizeAmount: 2000000,
    eligibility: 'Open to All College Undergraduates & Web3 Developers',
    teamSize: '2 to 4 Members',
    description: '36-hour physical hackathon hosted at Bengaluru tech hub. Build zero-knowledge proofs, decentralized finance (DeFi) protocols, decentralized identity, and cross-chain bridges. Direct angel mentorship and VC seed grant tracks.',
    tags: ['Polygon', 'Web3', 'Blockchain', 'Solidity', 'Offline Bengaluru', 'DeFi'],
    officialUrl: 'https://polygon.technology/',
    problemStatements: [
      'Zero-Knowledge Proof Academic Transcript & Credential Verification',
      'Decentralized Micro-Credit Lending Protocol for College Students',
      'Decentralized Identity & Privacy-Preserving Reputation Engine'
    ],
    rounds: [
      'Online GitHub Portfolio Screening & Smart Contract Abstract',
      '36-Hour In-Person Hacking Marathon at Bengaluru Hub',
      'Demo Day Pitch on Mainstage to Web3 Founders & Venture Capitalists'
    ],
    perks: [
      'Direct fast-track seed grants up to $10,000 from Polygon Village',
      'Full travel reimbursement and luxury stay for outstation student teams',
      'Bounties awarded in USDC, ETH, and MATIC',
      'Direct hiring opportunities with leading Web3 scale-ups and protocols'
    ]
  },

  'intel-edge-iot': {
    id: 'intel-edge-iot',
    title: 'Intel Edge AI & IoT Sprint',
    icon: '⚙️',
    organizer: 'Intel Corporation',
    category: 'IoT',
    mode: 'Offline',
    location: 'Intel Technology India, SRR Campus, Hyderabad',
    deadline: '15 Sep 2026',
    deadlineDate: '2026-09-15',
    status: 'Closed',
    statusBadgeClass: 'badge-gray',
    prize: '₹2,00,000',
    prizeSubtitle: '+ Intel OpenVINO Hardware Kits & Fast-Track Internships',
    prizeAmount: 200000,
    eligibility: '3rd & 4th Year ECE / EEE / CSE / IT Students',
    teamSize: '2 to 3 Members',
    description: 'On-device deep learning inference and edge robotics hardware hackathon using Intel OpenVINO toolkit. Registration has closed. Selected university finalists are currently demoing physical hardware prototypes at Intel Hyderabad campus.',
    tags: ['Intel', 'IoT', 'Edge AI', 'OpenVINO', 'Embedded', 'Closed'],
    officialUrl: 'https://intel.com/',
    problemStatements: [
      'Autonomous Drone Computer Vision for Disaster Relief Topography',
      'Real-Time Industrial Defect Detection on Edge Sensors at 120 FPS'
    ],
    rounds: [
      'Problem Abstract & Simulation Model Evaluation (Completed)',
      'Hardware Developer Kit Dispatch & Local Testing (Completed)',
      'Grand Finale Hardware Demonstration at Intel Campus Day'
    ],
    perks: [
      'Intel Neural Compute Stick & AI Dev Kits for finalists',
      'Pre-Placement Internship fast-track interviews with Intel Core Team',
      'Cash awards and trophies for top 3 physical prototypes'
    ]
  }
};


  /* CareerNova - Placement Hackathons & Corporate Sprints Module */




let activeQuickFilter = 'all';

/**
 * Filter hackathons by status, category, mode, and search keyword.
 * Extends the existing CareerNova filtering logic.
 */
function filterHackathons() {
  const statusFilter = document.getElementById('hackathon-status-filter');
  const catFilter = document.getElementById('hackathon-cat-filter');
  const modeFilter = document.getElementById('hackathon-mode-filter');
  const searchInput = document.getElementById('hackathon-search');
  const cards = document.querySelectorAll('#hackathons-grid .item-card');
  const countEl = document.getElementById('hackathon-count');

  if (!statusFilter || !catFilter || !modeFilter || !cards) return;

  const statusVal = statusFilter.value;
  const catVal = catFilter.value;
  const modeVal = modeFilter.value;
  const searchVal = (searchInput ? searchInput.value || '' : '').toLowerCase().trim();

  let visibleCount = 0;

  cards.forEach(card => {
    // Read data attributes
    const cardStatus = card.getAttribute('data-status') || '';
    const cardCat = card.getAttribute('data-cat') || '';
    const cardMode = card.getAttribute('data-mode') || '';
    const cardPrize = parseInt(card.getAttribute('data-prize') || '0', 10);
    const isRegistered = card.getAttribute('data-registered') === 'true';

    // Status filtering
    let matchesStatus = false;
    if (statusVal === 'All') {
      matchesStatus = true;
    } else if (statusVal === 'Upcoming') {
      matchesStatus = cardStatus === 'Upcoming';
    } else if (statusVal === 'Closing Soon') {
      matchesStatus = cardStatus === 'Closing Soon';
    } else if (statusVal === 'Closed') {
      matchesStatus = cardStatus === 'Closed';
    } else if (statusVal === 'Registered') {
      matchesStatus = isRegistered;
    } else {
      matchesStatus = cardStatus.toLowerCase() === statusVal.toLowerCase();
    }

    // Category filtering
    let matchesCat = false;
    if (catVal === 'All') {
      matchesCat = true;
    } else {
      matchesCat = cardCat === catVal || cardCat.toLowerCase().includes(catVal.toLowerCase());
    }

    // Mode filtering
    let matchesMode = false;
    if (modeVal === 'All') {
      matchesMode = true;
    } else {
      matchesMode = cardMode.toLowerCase() === modeVal.toLowerCase() ||
                    (modeVal === 'Offline' && cardMode.toLowerCase().includes('offline')) ||
                    (modeVal === 'Online' && cardMode.toLowerCase().includes('online'));
    }

    // Quick Pill filtering
    let matchesQuickPill = true;
    if (activeQuickFilter === 'closing-soon') {
      matchesQuickPill = (cardStatus === 'Closing Soon');
    } else if (activeQuickFilter === 'online') {
      matchesQuickPill = (cardMode === 'Online');
    } else if (activeQuickFilter === 'offline') {
      matchesQuickPill = (cardMode === 'Offline' || cardMode === 'Hybrid');
    } else if (activeQuickFilter === 'high-prize') {
      matchesQuickPill = cardPrize >= 400000;
    } else if (activeQuickFilter === 'registered') {
      matchesQuickPill = isRegistered;
    }

    // Search filtering - checks title, organizer, category, mode, description, eligibility, prize, tags
    let matchesSearch = true;
    if (searchVal) {
      matchesSearch = false;
      const titleEl = card.querySelector('.item-title') || card.querySelector('.hackathon-title');
      const subTitleEl = card.querySelector('.item-subtitle') || card.querySelector('.hackathon-org');
      const bodyEl = card.querySelector('.item-body') || card.querySelector('.hackathon-desc');
      const fullText = card.innerText.toLowerCase();
      const dataSearch = (card.getAttribute('data-search') || '').toLowerCase();

      if (
        (titleEl && titleEl.innerText.toLowerCase().includes(searchVal)) ||
        (subTitleEl && subTitleEl.innerText.toLowerCase().includes(searchVal)) ||
        (bodyEl && bodyEl.innerText.toLowerCase().includes(searchVal)) ||
        fullText.includes(searchVal) ||
        dataSearch.includes(searchVal)
      ) {
        matchesSearch = true;
      }
    }

    // Combined visibility condition
    if (matchesStatus && matchesCat && matchesMode && matchesQuickPill && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (countEl) countEl.innerText = visibleCount;

  // Handle empty state display
  const emptyState = document.getElementById('hackathon-empty-state');
  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  // Handle search clear button
  const clearBtn = document.getElementById('hackathon-search-clear');
  if (clearBtn) {
    clearBtn.style.display = searchVal ? 'inline-flex' : 'none';
  }
}

/**
 * Reset all filters to default 'All' and clear search input
 */
function clearHackathonFilters() {
  const statusFilter = document.getElementById('hackathon-status-filter');
  const catFilter = document.getElementById('hackathon-cat-filter');
  const modeFilter = document.getElementById('hackathon-mode-filter');
  const searchInput = document.getElementById('hackathon-search');

  if (statusFilter) statusFilter.value = 'All';
  if (catFilter) catFilter.value = 'All';
  if (modeFilter) modeFilter.value = 'All';
  if (searchInput) searchInput.value = '';

  activeQuickFilter = 'all';
  document.querySelectorAll('.hackathon-quick-pill').forEach(pill => {
    pill.classList.remove('active');
  });
  const allPill = document.querySelector('.hackathon-quick-pill[data-filter="all"]');
  if (allPill) allPill.classList.add('active');

  filterHackathons();
  showToast('Filters reset to show all hackathons.');
}

/**
 * Clear only the search input
 */
function clearHackathonSearch() {
  const searchInput = document.getElementById('hackathon-search');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  filterHackathons();
}

/**
 * Select quick filter pill
 */
function setHackathonQuickFilter(filterType, element) {
  activeQuickFilter = filterType;

  document.querySelectorAll('.hackathon-quick-pill').forEach(p => p.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  }

  // Optional: keep select dropdowns synced when clicking a direct status pill
  const statusFilter = document.getElementById('hackathon-status-filter');
  if (statusFilter) {
    if (filterType === 'closing-soon') {
      statusFilter.value = 'Closing Soon';
    } else if (filterType === 'registered') {
      statusFilter.value = 'Registered';
    } else if (filterType === 'all') {
      statusFilter.value = 'All';
    }
  }

  filterHackathons();
}

/**
 * Legacy & quick registration handler
 */
function registerHackathon(name, hackathonId = null) {
  if (hackathonId) {
    openHackathonRegister(hackathonId);
    return;
  }
  showToast(`Registered team for ${name}!`);
}

/**
 * Open registration modal for specific hackathon
 */
function openHackathonRegister(hackathonId) {
  const hackathon = HACKATHONS_DATA[hackathonId];
  if (!hackathon) {
    showToast('Hackathon details not found.');
    return;
  }

  if (hackathon.status === 'Closed') {
    showToast('Registration for this hackathon has closed.');
    return;
  }

  if (isHackathonRegistered(hackathonId)) {
    // If already registered, offer option to unregister or view info
    if (confirm(`You are already registered for ${hackathon.title}. Would you like to withdraw your registration?`)) {
      unregisterHackathonState(hackathonId);
      updateRegisteredCardsUI();
      filterHackathons();
      showToast(`Registration withdrawn for ${hackathon.title}.`);
    }
    return;
  }

  const modal = document.getElementById('hackathon-register-modal');
  if (!modal) return;

  // Set modal fields
  document.getElementById('reg-hackathon-id').value = hackathon.id;
  document.getElementById('reg-modal-title').innerText = `Register: ${hackathon.title}`;
  document.getElementById('reg-modal-sponsor').innerText = `${hackathon.organizer} • Deadline: ${hackathon.deadline}`;
  document.getElementById('reg-modal-prize').innerText = `${hackathon.prize} Prize • Mode: ${hackathon.mode}`;

  // Pre-fill user profile info
  const user = state.currentUser || {};
  const leadNameInput = document.getElementById('reg-lead-name');
  const leadEmailInput = document.getElementById('reg-lead-email');
  const leadCollegeInput = document.getElementById('reg-lead-college');
  const teamNameInput = document.getElementById('reg-team-name');

  if (leadNameInput) leadNameInput.value = user.name || 'Alex Wright';
  if (leadEmailInput) leadEmailInput.value = user.email || 'alex.wright@university.edu';
  if (leadCollegeInput) leadCollegeInput.value = user.college || 'Stanford University';
  if (teamNameInput) teamNameInput.value = `Team Nova ${Math.floor(100 + Math.random() * 900)}`;

  // Populate track options
  const trackSelect = document.getElementById('reg-track-select');
  if (trackSelect) {
    trackSelect.innerHTML = '<option value="General Track">General / Best Overall Innovation</option>';
    if (hackathon.problemStatements && hackathon.problemStatements.length > 0) {
      hackathon.problemStatements.forEach(ps => {
        const opt = document.createElement('option');
        opt.value = ps;
        opt.innerText = ps;
        trackSelect.appendChild(opt);
      });
    }
  }

  modal.classList.remove('hidden');
}

/**
 * Close registration modal
 */
function closeHackathonRegisterModal() {
  const modal = document.getElementById('hackathon-register-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Submit registration form
 */
function submitHackathonRegistration(event) {
  if (event) event.preventDefault();

  const hackathonId = document.getElementById('reg-hackathon-id').value;
  const teamName = document.getElementById('reg-team-name').value.trim() || 'Team Nova';
  const teamSize = document.getElementById('reg-team-size').value;
  const selectedTrack = document.getElementById('reg-track-select').value;
  const hackathon = HACKATHONS_DATA[hackathonId];
  const hackathonTitle = hackathon ? hackathon.title : 'the hackathon';

  // Save to application state & localStorage
  registerHackathonState(hackathonId, {
    teamName,
    teamSize,
    selectedTrack,
    registeredAt: new Date().toLocaleDateString()
  });

  updateRegisteredCardsUI();
  filterHackathons();
  closeHackathonRegisterModal();

  showToast(`🎉 Registered "${teamName}" for ${hackathonTitle}! Confirmation sent.`);
}

/**
 * Open detail preview modal for a hackathon
 */
function openHackathonModal(hackathonId) {
  const hackathon = HACKATHONS_DATA[hackathonId];
  if (!hackathon) {
    showToast('Hackathon details not found.');
    return;
  }

  const modal = document.getElementById('hackathon-detail-modal');
  if (!modal) return;

  document.getElementById('modal-hack-icon').innerText = hackathon.icon || '🔥';
  document.getElementById('modal-hack-title').innerText = hackathon.title;
  document.getElementById('modal-hack-organizer').innerText = hackathon.organizer;
  document.getElementById('modal-hack-status').innerText = hackathon.status;
  document.getElementById('modal-hack-status').className = `badge ${hackathon.statusBadgeClass || 'badge-navy'}`;
  document.getElementById('modal-hack-category').innerText = hackathon.category;
  document.getElementById('modal-hack-mode').innerText = hackathon.mode;
  document.getElementById('modal-hack-deadline').innerText = hackathon.deadline;
  document.getElementById('modal-hack-prize').innerText = hackathon.prize;
  document.getElementById('modal-hack-prize-sub').innerText = hackathon.prizeSubtitle || '';
  document.getElementById('modal-hack-eligibility').innerText = hackathon.eligibility;
  document.getElementById('modal-hack-teamsize').innerText = hackathon.teamSize;
  document.getElementById('modal-hack-location').innerText = hackathon.location;
  document.getElementById('modal-hack-description').innerText = hackathon.description;

  // Problem statements list
  const psList = document.getElementById('modal-hack-problems');
  if (psList) {
    psList.innerHTML = '';
    (hackathon.problemStatements || []).forEach(ps => {
      const li = document.createElement('li');
      li.innerText = ps;
      psList.appendChild(li);
    });
  }

  // Rounds / Timeline
  const roundsList = document.getElementById('modal-hack-rounds');
  if (roundsList) {
    roundsList.innerHTML = '';
    (hackathon.rounds || []).forEach(r => {
      const li = document.createElement('li');
      li.innerText = r;
      roundsList.appendChild(li);
    });
  }

  // Perks & Incentives
  const perksList = document.getElementById('modal-hack-perks');
  if (perksList) {
    perksList.innerHTML = '';
    (hackathon.perks || []).forEach(p => {
      const li = document.createElement('li');
      li.innerText = p;
      perksList.appendChild(li);
    });
  }

  // External Portal link
  const portalBtn = document.getElementById('modal-hack-portal-btn');
  if (portalBtn) {
    portalBtn.href = hackathon.officialUrl || 'https://unstop.com/';
  }

  // Register CTA button in modal
  const regCtaBtn = document.getElementById('modal-hack-register-btn');
  if (regCtaBtn) {
    if (hackathon.status === 'Closed') {
      regCtaBtn.innerText = 'Registration Closed';
      regCtaBtn.disabled = true;
      regCtaBtn.className = 'btn-secondary';
      regCtaBtn.onclick = null;
    } else if (isHackathonRegistered(hackathonId)) {
      regCtaBtn.innerText = '✓ Registered';
      regCtaBtn.disabled = false;
      regCtaBtn.className = 'btn-secondary btn-registered';
      regCtaBtn.onclick = () => {
        closeHackathonModal();
        openHackathonRegister(hackathonId);
      };
    } else {
      regCtaBtn.innerText = 'Register Now ↗';
      regCtaBtn.disabled = false;
      regCtaBtn.className = 'btn-primary';
      regCtaBtn.onclick = () => {
        closeHackathonModal();
        openHackathonRegister(hackathonId);
      };
    }
  }

  modal.classList.remove('hidden');
}

/**
 * Close detail modal
 */
function closeHackathonModal() {
  const modal = document.getElementById('hackathon-detail-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Update card registration badges and buttons across the DOM
 */
function updateRegisteredCardsUI() {
  const cards = document.querySelectorAll('#hackathons-grid .item-card');
  let regCount = 0;

  cards.forEach(card => {
    const hackathonId = card.getAttribute('data-id');
    const isRegistered = isHackathonRegistered(hackathonId);
    card.setAttribute('data-registered', isRegistered ? 'true' : 'false');

    const regBtn = card.querySelector('.register-btn');
    if (regBtn) {
      if (card.getAttribute('data-status') === 'Closed') {
        regBtn.innerText = 'Registration Closed';
        regBtn.disabled = true;
        regBtn.classList.remove('btn-primary', 'btn-registered');
        regBtn.classList.add('btn-secondary');
        regBtn.style.opacity = '0.65';
        regBtn.style.cursor = 'not-allowed';
      } else if (isRegistered) {
        regCount++;
        regBtn.innerHTML = '✓ Registered';
        regBtn.disabled = false;
        regBtn.classList.remove('btn-primary');
        regBtn.classList.add('btn-secondary', 'btn-registered');
        regBtn.style.opacity = '1';
        regBtn.style.cursor = 'pointer';
        regBtn.title = 'Click to view or withdraw registration';
      } else {
        regBtn.innerHTML = 'Register Now ↗';
        regBtn.disabled = false;
        regBtn.classList.remove('btn-registered', 'btn-secondary');
        regBtn.classList.add('btn-primary');
        regBtn.style.opacity = '1';
        regBtn.style.cursor = 'pointer';
        regBtn.title = 'Register team for this hackathon';
      }
    }
  });

  // Update badge counter in summary bar
  const badgeCountEl = document.getElementById('hackathon-registered-count-badge');
  if (badgeCountEl) {
    badgeCountEl.innerText = regCount;
  }
}

/**
 * Module initialization
 */
function initHackathonsModule() {
  updateRegisteredCardsUI();
  filterHackathons();
}


  /* ==========================================================================
     11. INTERACTIVE CHATGPT & GEMINI AI CHATBOT ENGINE
     ========================================================================== */
  const AI_KEY_STORAGE = 'careernova_gemini_api_key';
  let conversationMessages = [];

  function getGeminiApiKey() {
    return localStorage.getItem(AI_KEY_STORAGE) || '';
  }

  function setGeminiApiKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(AI_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(AI_KEY_STORAGE);
    }
    updateAiStatusBadge();
  }

  function openAiSettingsModal() {
    const modal = document.getElementById('ai-settings-modal');
    const input = document.getElementById('gemini-api-key-input');
    const statusEl = document.getElementById('ai-key-status');

    const currentKey = getGeminiApiKey();
    if (input) input.value = currentKey;

    if (statusEl) {
      if (currentKey) {
        statusEl.innerHTML = `
          <span style="color: #15803d; font-weight: 700;">🟢 Gemini 2.5 Flash Connected</span>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 11px;">Multi-turn interactive conversation active with Google's generative AI model.</p>
        `;
      } else {
        statusEl.innerHTML = `
          <span style="color: #0369a1; font-weight: 700;">🌐 Free Live Web Search Active</span>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 11px;">The chatbot will search the live web (Wikipedia & DuckDuckGo) for real-time definitions, algorithms, and concepts.</p>
        `;
      }
    }

    if (modal) modal.classList.remove('hidden');
  }

  function closeAiSettingsModal() {
    document.getElementById('ai-settings-modal')?.classList.add('hidden');
  }

  function saveAiKey() {
    const input = document.getElementById('gemini-api-key-input');
    const key = input ? input.value.trim() : '';

    if (key) {
      setGeminiApiKey(key);
      showToast('Gemini AI connected! Multi-turn conversational mode active.');
    } else {
      setGeminiApiKey('');
      showToast('Key cleared. Switched to Free Live Web Search mode.');
    }

    closeAiSettingsModal();
  }

  function clearAiKey() {
    setGeminiApiKey('');
    const input = document.getElementById('gemini-api-key-input');
    if (input) input.value = '';
    showToast('AI Key removed. Live Web Search is active.');
    closeAiSettingsModal();
  }

  function updateAiStatusBadge() {
    const key = getGeminiApiKey();
    const indicator = document.getElementById('coach-mode-indicator');
    const badge = document.getElementById('coach-status-badge');

    if (indicator) {
      indicator.innerText = key ? 'Gemini 2.5 Flash • Multi-Turn Chat Active' : 'Nova AI • Live Web Search Active';
    }
    if (badge) {
      badge.innerText = key ? '✨ Gemini AI' : 'Web Online';
      badge.className = key ? 'badge badge-navy' : 'badge badge-green';
    }
  }

  function handleChatInputInput(event) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px';
    const sendBtn = document.getElementById('chat-send-btn');
    if (sendBtn) {
      sendBtn.disabled = !textarea.value.trim();
    }
  }

  function handleChatInputKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendChatMessage();
    }
  }

  function copyCode(btn) {
    const codeEl = btn.closest('.code-container')?.querySelector('code');
    if (codeEl) {
      const text = codeEl.innerText;
      navigator.clipboard.writeText(text).then(() => {
        btn.innerText = '✓ Copied!';
        setTimeout(() => btn.innerText = '📋 Copy', 2000);
      }).catch(() => {
        btn.innerText = '✓ Copied';
        setTimeout(() => btn.innerText = '📋 Copy', 2000);
      });
    }
  }

  function resetChatSession() {
    conversationMessages = [];
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      chatBox.innerHTML = `
        <div class="chat-empty-state" id="chat-empty-state">
          <div class="chat-welcome-sparkle">✨</div>
          <h2 class="chat-welcome-title">Where shall we begin today?</h2>
          <p class="chat-welcome-desc">Ask any question, write & debug code, solve algorithms, prepare for interviews, or explore live web knowledge.</p>

          <div class="chat-prompt-grid">
            <div class="chat-prompt-card" onclick="sendSuggestedChat('Implement a Trie (Prefix Tree) in Python with insert and search methods, including complexity analysis.')">
              <div class="chat-prompt-card-header">💻 Write Code & Algorithms</div>
              <div class="chat-prompt-card-desc">Implement a Trie with insert and search methods + Big-O analysis.</div>
            </div>

            <div class="chat-prompt-card" onclick="sendSuggestedChat('Explain the system design of a distributed Rate Limiter using Token Bucket and Redis.')">
              <div class="chat-prompt-card-header">🏗️ System Design Blueprint</div>
              <div class="chat-prompt-card-desc">Explore rate limiters with token buckets, API gateways, and Redis.</div>
            </div>

            <div class="chat-prompt-card" onclick="sendSuggestedChat('Give me a high-impact STAR framework response for: Tell me about a time you handled a difficult production bug.')">
              <div class="chat-prompt-card-header">🎤 STAR Behavioral Prep</div>
              <div class="chat-prompt-card-desc">Structure answers for handling tight deadlines and production bugs.</div>
            </div>

            <div class="chat-prompt-card" onclick="sendSuggestedChat('What are the core trade-offs between SQL and NoSQL databases for high-scale microservices?')">
              <div class="chat-prompt-card-header">🗄️ SQL vs NoSQL Trade-offs</div>
              <div class="chat-prompt-card-desc">Compare ACID relational databases vs horizontal NoSQL clusters.</div>
            </div>
          </div>
        </div>
      `;
    }
    const inputEl = document.getElementById('chat-input');
    if (inputEl) {
      inputEl.value = '';
      inputEl.style.height = 'auto';
      inputEl.focus();
    }
    showToast('Started a new chat session.');
  }

  function cleanSearchQuery(query) {
    let s = (query || '').replace(/[?.,!]/g, '').trim();
    s = s.replace(/^(what is an|what is a|what is the|what are the|what are|what is|who is the|who was|who is|explain the|explain|tell me about|how does a|how does the|how does|how do|define)\s+/i, '');
    return s.trim() || query;
  }

  async function searchLiveWeb(query) {
    try {
      const cleanQuery = cleanSearchQuery(query);
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery)}&utf8=&format=json&origin=*`;
      
      const res = await fetch(searchUrl, {
        headers: { 'Api-User-Agent': 'CareerNova/1.0 (Campus Placement Platform)' }
      });
      if (!res.ok) return null;
      
      const data = await res.json();
      if (data.query && data.query.search && data.query.search.length > 0) {
        let chosenHit = data.query.search[0];
        const csHit = data.query.search.slice(0, 5).find(h => 
          /\(computer science\)|\(computing\)|\(programming\)|\(software\)|\(data structure\)|\(algorithm\)/i.test(h.title)
        );
        if (csHit) {
          chosenHit = csHit;
        }

        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(chosenHit.title)}`;
        const sumRes = await fetch(summaryUrl, {
          headers: { 'Api-User-Agent': 'CareerNova/1.0 (Campus Placement Platform)' }
        });
        if (sumRes.ok) {
          const sumData = await sumRes.json();
          return {
            title: sumData.title,
            description: sumData.description || 'Web Topic Overview',
            extract: sumData.extract,
            url: sumData.content_urls ? sumData.content_urls.desktop.page : `https://en.wikipedia.org/wiki/${encodeURIComponent(chosenHit.title)}`
          };
        }
      }
    } catch (err) {
      console.warn('Wikipedia web search error:', err);
    }

    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&origin=*`;
      const res = await fetch(ddgUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.AbstractText) {
          return {
            title: data.Heading || query,
            description: 'Instant Answer',
            extract: data.AbstractText,
            url: data.AbstractURL || 'https://duckduckgo.com/?q=' + encodeURIComponent(query)
          };
        }
      }
    } catch (err) {
      console.warn('DuckDuckGo search error:', err);
    }

    return null;
  }

  async function queryGeminiApi(history, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const contents = history.map(item => ({
      role: item.role === 'user' ? 'user' : 'model',
      parts: [{ text: item.content }]
    }));

    const payload = {
      contents,
      systemInstruction: {
        parts: [{
          text: `You are Nova, an intelligent conversational AI assistant like ChatGPT and Gemini.
You assist university students, software engineers, and professionals with:
1. Coding & Algorithms: Write production-grade, bug-free code with comments. State Big-O Time & Space complexity.
2. System Design: Outline high-level architecture, scalability trade-offs, caching, and database schemas.
3. Interview & Career Preparation: Behavioral STAR framework answers, resume enhancements, and mock interview critique.
4. General Knowledge: Explain concepts clearly, step-by-step, with real-world analogies.

Formatting: Always use clean GitHub-flavored Markdown. Wrap code in fenced code blocks with the language tag (e.g. \`\`\`python).`
        }]
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.error?.message || `HTTP error ${res.status}`;
      throw new Error(message);
    }

    const result = await res.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response text returned by Gemini API');
    return text;
  }

  function getConversationalReply(text) {
    const q = text.trim().toLowerCase();

    if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening))\b/i.test(q)) {
      return `Hello! 👋 I'm **Nova**, your interactive AI assistant.

I can help you with:
- 💻 **Coding & Algorithms** (Python, JavaScript, Java, C++, DSA, LeetCode)
- 🏗️ **System Design** (Microservices, Caching, Databases, Scalability)
- 📝 **Interview Prep** (STAR behavioral answers, Resume bullets, HR questions)
- 🌐 **Live Web Information** (Searching definitions, tools, and technical concepts)

What would you like to work on or discuss today?`;
    }

    if (/who are you|what are you|what can you do|introduce yourself/i.test(q)) {
      return `I am **Nova AI**, an interactive conversational AI assistant designed for engineers and university candidates.

Like ChatGPT and Gemini, I can chat interactively, answer complex technical questions, write clean code with time and space complexity, and debug software.

*Tip:* You can also click **⚙️ AI Settings** to connect a free Google Gemini key for deep generative reasoning and multi-turn code generation!`;
    }

    if (/^(thank you|thanks|thx|awesome|great|cool|perfect|appreciate it)\b/i.test(q)) {
      return `You're very welcome! 😊 Feel free to ask follow-up questions, request more code examples, or explore another topic!`;
    }

    if (/tell me a joke|say something funny/i.test(q)) {
      return `Why do programmers prefer dark mode?
Because light attracts bugs! 🐛😄

What problem can we solve together next?`;
    }

    return null;
  }

  function getCuratedPlacementResponse(text) {
    const q = text.toLowerCase();

    if (q.includes('two sum') || (q.includes('dsa') && q.includes('approach'))) {
      return `
### 🧩 Two Sum Problem — Optimal Approach

**1. Problem Statement:**
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

**2. Complexity Trade-Offs:**
- **Brute Force:** Nested loops comparing every pair $\\rightarrow$ $O(n^2)$ time, $O(1)$ space.
- **Optimal (HashMap):** Store numbers in a hash map as you iterate $\\rightarrow$ $O(n)$ time, $O(n)$ space.

\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
\`\`\`

**Interview Tip:** Always clarify whether the input array is sorted (which enables $O(1)$ space Two-Pointer approach).
      `;
    }

    if (q.includes('sql') && q.includes('nosql')) {
      return `
### 🗄️ SQL vs NoSQL — System Design Comparison

| Dimension | SQL (Relational) | NoSQL (Non-Relational) |
| :--- | :--- | :--- |
| **Examples** | PostgreSQL, MySQL, SQLite | MongoDB, Redis, Cassandra |
| **Data Schema** | Rigid, normalized tables with schemas | Dynamic, flexible (Documents, Key-Value) |
| **Transactions** | Strict **ACID** guarantees | Eventual consistency (**BASE** properties) |
| **Scaling** | Vertical (scale-up with bigger VM) | Horizontal (scale-out with sharded nodes) |
| **Best For** | Financial ledgers, ERP, complex JOINs | Real-time analytics, user sessions, catalogs |

**Interview Tip:** Don't declare one "better". Contrast read-heavy vs write-heavy workloads and partition tolerance (CAP theorem).
      `;
    }

    if (q.includes('star') || (q.includes('deadline') && q.includes('behavioral'))) {
      return `
### 🎤 STAR Behavioral Framework: Handling Tight Deadlines

- **Situation:** Describe a high-stakes project facing an unforeseen deadline crunch or scope expansion.
- **Task:** Clearly outline the core deliverable and the impact of missing the release date.
- **Action (Spend 50% of time here):**
  1. *Prioritization:* Evaluated features with the team using the Eisenhower Matrix to de-scope non-critical items.
  2. *Resource Allocation:* Delegated parallel modules and automated regression testing.
  3. *Proactive Communication:* Sent daily stakeholder updates to manage expectations.
- **Result:** Delivered the release on time with zero P0 production incidents, followed by a post-launch retrospective.

**Interview Tip:** Interviewers look for how YOU think, prioritize, and communicate under pressure.
      `;
    }

    if (q.includes('rate limiter') && q.includes('system design')) {
      return `
### 🏗️ Rate Limiter — 5-Minute System Design Blueprint

**1. Core Algorithms:**
- **Token Bucket:** Best for bursty traffic; tokens refilled at fixed rate.
- **Leaky Bucket:** Constant outflow rate, smooths sudden spikes.
- **Sliding Window Counter:** Low memory footprint, 99% accuracy.

**2. High-Level Architecture:**
Place the rate limiter at the **API Gateway** layer backed by an in-memory **Redis** cluster using atomic \`INCR\` and \`EXPIRE\` operations.

\`\`\`python
# Conceptual Redis Token Bucket Check
def is_allowed(user_id, limit=100, window_sec=60):
    key = f"rate:{user_id}"
    current = redis_client.incr(key)
    if current == 1:
        redis_client.expire(key, window_sec)
    return current <= limit
\`\`\`

**3. HTTP Return Codes:** Return \`429 Too Many Requests\` with \`Retry-After\` headers.
      `;
    }

    if (q.includes('polymorphism') || (q.includes('oop') && (q.includes('pillar') || q.includes('principle')))) {
      return `
### 🧱 OOP Pillars & Polymorphism Explained

**The 4 Pillars of Object-Oriented Programming:**
1. **Encapsulation:** Bundling state and methods together while restricting direct access (private variables + public getters/setters).
2. **Abstraction:** Hiding complex implementation details and exposing only the essential interface.
3. **Inheritance:** Creating new classes based on existing ones to promote code reuse (\`Dog extends Animal\`).
4. **Polymorphism:** *"Many forms"* — ability of an object or method to take on multiple behaviors.

**Two Main Types of Polymorphism:**
- **Compile-Time (Static):** Method Overloading (same method name, different argument parameters).
- **Run-Time (Dynamic):** Method Overriding (subclass overrides parent class method using dynamic method dispatch).
      `;
    }

    if (q.includes('acid') || (q.includes('database') && q.includes('transaction'))) {
      return `
### 💾 ACID Properties in Databases

- **Atomicity (All-or-Nothing):** Every statement in a transaction succeeds, or the entire transaction is rolled back.
- **Consistency:** The database transitions only from one valid state to another, respecting all constraints and foreign keys.
- **Isolation:** Concurrent transactions execute without interfering with one another (Isolation levels: *Read Uncommitted, Read Committed, Repeatable Read, Serializable*).
- **Durability:** Once committed, updates survive server crashes and power outages (persisted to Write-Ahead Log on disk).
      `;
    }

    if (q.includes('cap theorem')) {
      return `
### 🌐 CAP Theorem (Brewer's Theorem)

In any distributed data store, you can only guarantee at most **two out of three** properties simultaneously:

1. **Consistency (C):** Every read receives the most recent write or an error.
2. **Availability (A):** Every non-failing node returns a non-error response for every request.
3. **Partition Tolerance (P):** The system continues to operate despite network splits or dropped packets.

**Crucial Interview Insight:** Because network partitions (P) are physically unavoidable across cloud datacenters, the true trade-off is always between **CP** (e.g. MongoDB, Google Spanner, Redis) and **AP** (e.g. Cassandra, DynamoDB, CouchDB).
      `;
    }

    return null;
  }

  async function resolveAnswer(userQuery, history = []) {
    const apiKey = getGeminiApiKey();

    if (apiKey) {
      try {
        const aiReply = await queryGeminiApi(history, apiKey);
        return `
          <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
            ✨ Powered by Gemini 2.5 Flash
          </div>
          <div>${formatMarkdown(aiReply)}</div>
        `;
      } catch (err) {
        console.error('Gemini API failed:', err);
        showToast('Gemini API error. Falling back to Live Web Search.');
      }
    }

    const conversational = getConversationalReply(userQuery);
    if (conversational) {
      return `
        <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#7c3aed; background:#f5f3ff; border:1px solid #ddd6fe; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
          💬 Nova Assistant
        </div>
        <div>${formatMarkdown(conversational)}</div>
      `;
    }

    const curated = getCuratedPlacementResponse(userQuery);
    if (curated) {
      return `
        <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#15803d; background:#f0fdf4; border:1px solid #bbf7d0; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
          🎯 Placement Blueprint
        </div>
        <div>${formatMarkdown(curated)}</div>
      `;
    }

    const webResult = await searchLiveWeb(userQuery);
    if (webResult && webResult.extract) {
      return `
        <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
          🌐 Live Web Search
        </div>
        <h3 style="margin: 0 0 4px; font-size: 15.5px; color: var(--text-main); font-weight: 700;">${webResult.title}</h3>
        <p style="margin: 0 0 10px; font-size: 11.5px; color: var(--text-muted); font-style: italic;">${webResult.description}</p>
        <div style="line-height: 1.65; color: var(--text-body); margin-bottom: 12px; font-size: 13.5px;">${webResult.extract}</div>
        <div style="padding-top: 10px; border-top: 1px solid var(--border-color); font-size: 11.5px;">
          🔗 <a href="${webResult.url}" target="_blank" style="color: var(--primary-accent); font-weight: 600; text-decoration: underline;">Read complete article on Wikipedia ↗</a>
        </div>
      `;
    }

    return `
      <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#b45309; background:#fffbeb; border:1px solid #fef08a; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
        💡 Search Insight
      </div>
      <p>I searched the web for <strong>"${escapeHtml(userQuery)}"</strong>, but couldn't find a direct summary page.</p>
      <div style="margin-top: 12px; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 12px; line-height: 1.6;">
        <strong>Want answers to literally ANY question?</strong>
        <p style="margin: 4px 0 10px; color: #64748b;">Connect your free Google Gemini API key to allow Nova to write code, debug complex errors, explain architectures, and hold multi-turn conversations.</p>
        <button class="chat-btn-pill primary" style="font-size: 11px; padding: 6px 14px;" onclick="openAiSettingsModal()">
          ⚙️ Connect Free Gemini Key
        </button>
      </div>
    `;
  }

  async function sendChatMessage(promptOverride) {
    const inputEl = document.getElementById('chat-input');
    const text = (promptOverride || (inputEl ? inputEl.value : '')).trim();
    if (!text) return;

    const chatBox = document.getElementById('chat-box');
    const emptyState = document.getElementById('chat-empty-state');
    if (emptyState) emptyState.remove();

    appendUserMessage(text);

    if (inputEl) {
      inputEl.value = '';
      inputEl.style.height = 'auto';
      inputEl.disabled = true;
    }

    conversationMessages.push({ role: 'user', content: text });

    const thinkingId = 'thinking-' + Date.now();
    appendThinkingRow(thinkingId);

    try {
      const replyHtml = await resolveAnswer(text, conversationMessages);
      document.getElementById(thinkingId)?.remove();

      appendBotMessage(replyHtml);
      conversationMessages.push({ role: 'assistant', content: replyHtml });
    } catch (err) {
      document.getElementById(thinkingId)?.remove();
      appendBotMessage(`<p style="color:#dc2626;">Sorry, an error occurred while processing: ${escapeHtml(err.message)}</p>`);
    } finally {
      if (inputEl) {
        inputEl.disabled = false;
        inputEl.focus();
      }
    }
  }

  function sendSuggestedChat(promptText) {
    const inputEl = document.getElementById('chat-input');
    if (inputEl) {
      inputEl.value = promptText;
    }
    sendChatMessage(promptText);
  }

  function appendUserMessage(text) {
    const container = document.getElementById('chat-box');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'chat-row user';
    row.innerHTML = `
      <div class="chat-bubble user">${escapeHtml(text)}</div>
      <div class="chat-avatar user-avatar">👤</div>
    `;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  }

  function appendThinkingRow(id) {
    const container = document.getElementById('chat-box');
    if (!container) return;

    const row = document.createElement('div');
    row.id = id;
    row.className = 'chat-row bot';
    row.innerHTML = `
      <div class="chat-avatar bot-avatar">✨</div>
      <div class="chat-bubble bot">
        <div class="typing-indicator">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  }

  function appendBotMessage(htmlContent) {
    const container = document.getElementById('chat-box');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'chat-row bot';
    row.innerHTML = `
      <div class="chat-avatar bot-avatar">✨</div>
      <div class="chat-bubble bot">${htmlContent}</div>
    `;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = (lang || 'code').toUpperCase();
        return `
          <div class="code-container">
            <div class="code-header">
              <span class="code-lang">${language}</span>
              <button class="code-copy-btn" onclick="copyCode(this)">📋 Copy</button>
            </div>
            <pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>
          </div>
        `;
      })
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>')
      .replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    return html;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     12. MOCK INTERVIEW SYSTEM
     ========================================================================== */
  let selectedInterviewType = 'technical';
  let mockQuestions = [];
  let currentMockQuestion = 0;
  let mockAnswers = [];
  let mockQuestionCount = 10;

  function openMockInterviewModal() {
    document.getElementById('mock-interview-modal')?.classList.remove('hidden');
  }

  function closeMockInterviewModal() {
    document.getElementById('mock-interview-modal')?.classList.add('hidden');
  }

  function selectInterviewType(type, button) {
    selectedInterviewType = type;
    document.querySelectorAll('.interview-type-card').forEach(card => card.classList.remove('selected'));
    if (button) button.classList.add('selected');
  }

  function startMockSession() {
    const diffEl = document.getElementById('interview-difficulty');
    const countEl = document.getElementById('interview-question-count');

    const difficulty = diffEl ? diffEl.value : 'medium';
    mockQuestionCount = countEl ? Number(countEl.value) : 10;

    const pool = MOCK_QUESTIONS[selectedInterviewType]?.[difficulty] || [];

    if (pool.length === 0) {
      showToast('No questions available for this configuration.');
      return;
    }

    mockQuestions = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(mockQuestionCount, pool.length));
    currentMockQuestion = 0;
    mockAnswers = [];

    closeMockInterviewModal();
    document.getElementById('mock-session-modal')?.classList.remove('hidden');
    displayMockQuestion();
  }

  function displayMockQuestion() {
    const question = mockQuestions[currentMockQuestion];
    const total = mockQuestions.length;

    const qNum = document.getElementById('mock-question-number');
    if (qNum) qNum.innerText = `Question ${currentMockQuestion + 1} of ${total}`;

    const qCounter = document.getElementById('mock-question-counter');
    if (qCounter) qCounter.innerText = `${currentMockQuestion + 1} / ${total}`;

    const qText = document.getElementById('mock-question-text');
    if (qText) qText.innerText = question;

    const qType = document.getElementById('mock-question-type');
    if (qType) {
      const typeNames = { technical: 'Technical CS', hr: 'HR / Behavioral', dsa: 'Data Structures & Algorithms', company: 'Company Focus' };
      qType.innerText = typeNames[selectedInterviewType] || 'Technical';
    }

    const diffEl = document.getElementById('interview-difficulty');
    const qDiff = document.getElementById('mock-question-difficulty');
    if (qDiff && diffEl) {
      const diffNames = { easy: 'Beginner', medium: 'Intermediate', hard: 'Advanced' };
      qDiff.innerText = diffNames[diffEl.value] || 'Intermediate';
    }

    const progress = (currentMockQuestion / total) * 100;
    const pBar = document.getElementById('mock-progress-bar');
    if (pBar) pBar.style.width = `${progress}%`;

    const ansInput = document.getElementById('mock-answer');
    if (ansInput) {
      ansInput.value = '';
      ansInput.focus();
    }
  }

  function submitMockAnswer() {
    const ansInput = document.getElementById('mock-answer');
    const answer = ansInput ? ansInput.value.trim() : '';

    if (!answer) {
      showToast('Please type your answer before proceeding.');
      return;
    }

    mockAnswers.push({ question: mockQuestions[currentMockQuestion], answer: answer });

    if (currentMockQuestion < mockQuestions.length - 1) {
      currentMockQuestion++;
      displayMockQuestion();
    } else {
      finishMockInterview();
    }
  }

  function finishMockInterview() {
    document.getElementById('mock-session-modal')?.classList.add('hidden');

    let totalLength = 0;
    let detailedAnswers = 0;
    mockAnswers.forEach(item => {
      totalLength += item.answer.length;
      if (item.answer.length >= 120) detailedAnswers++;
    });

    const avgLength = mockAnswers.length > 0 ? totalLength / mockAnswers.length : 0;
    const communication = avgLength >= 200 ? 92 : avgLength >= 120 ? 82 : avgLength >= 60 ? 68 : 50;
    const completeness = mockAnswers.length > 0 ? Math.round((detailedAnswers / mockAnswers.length) * 100) : 0;
    const accuracy = selectedInterviewType === 'hr' ? Math.min(95, communication + 5) : Math.min(95, communication);
    const overall = Math.round((accuracy + communication + completeness) / 3);

    const finalScoreEl = document.getElementById('mock-final-score');
    if (finalScoreEl) finalScoreEl.innerText = overall;

    const accEl = document.getElementById('mock-accuracy-score');
    if (accEl) accEl.innerText = `${accuracy}%`;

    const commEl = document.getElementById('mock-communication-score');
    if (commEl) commEl.innerText = `${communication}%`;

    const compEl = document.getElementById('mock-completeness-score');
    if (compEl) compEl.innerText = `${completeness}%`;

    const titleEl = document.getElementById('mock-result-title');
    if (titleEl) titleEl.innerText = overall >= 85 ? 'Top Tier Placement Performance' : overall >= 70 ? 'Competent Candidate Baseline' : 'Targeted Practice Recommended';

    const summaryEl = document.getElementById('mock-result-summary');
    if (summaryEl) summaryEl.innerText = overall >= 85 ? 'Your answers demonstrated solid technical reasoning and clear articulation.' : 'Your answers showed good fundamentals. Continue refining trade-off analysis.';

    const strList = document.getElementById('mock-strengths');
    if (strList) strList.innerHTML = `<li>Attempted all ${mockAnswers.length} questions.</li><li>Demonstrated technical vocabulary.</li>`;

    const impList = document.getElementById('mock-improvements');
    if (impList) impList.innerHTML = `<li>State Big-O time and space complexity explicitly.</li><li>Structure answers using STAR points.</li>`;

    const nextEl = document.getElementById('mock-next-steps');
    if (nextEl) nextEl.innerText = 'Visit DSA Practice to drill more algorithmic problems!';

    document.getElementById('mock-results-modal')?.classList.remove('hidden');

    updateGaugeVisual(Math.max(state.currentScore, overall));
    showToast(`Diagnostic complete! Your evaluated score: ${overall}/100`);
  }

  function exitMockSession() {
    const confirmed = confirm('Are you sure you want to exit? Your current session progress will be lost.');
    if (!confirmed) return;

    document.getElementById('mock-session-modal')?.classList.add('hidden');
    mockQuestions = [];
    mockAnswers = [];
    currentMockQuestion = 0;
  }

  function closeMockResults() {
    document.getElementById('mock-results-modal')?.classList.add('hidden');
  }

  function restartMockInterview() {
    closeMockResults();
    openMockInterviewModal();
  }

  /* ==========================================================================
     13. COLLEGE TPO MODULE
     ========================================================================== */
  function filterTpoRoster() {
    const branchFilter = document.getElementById('tpo-branch-filter');
    const statusFilter = document.getElementById('tpo-status-filter');
    const rows = document.querySelectorAll('#tpo-table-body tr');
    const countEl = document.getElementById('tpo-student-count');

    if (!branchFilter || !statusFilter) return;

    const branchVal = branchFilter.value;
    const statusVal = statusFilter.value;
    let visibleCount = 0;

    rows.forEach(row => {
      const rowBranch = row.getAttribute('data-branch');
      const rowStatus = row.getAttribute('data-status');

      const matchesBranch = (branchVal === 'All' || rowBranch === branchVal);
      const matchesStatus = (statusVal === 'All' || rowStatus === statusVal);

      if (matchesBranch && matchesStatus) {
        row.style.display = 'table-row';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (countEl) countEl.innerText = visibleCount;
  }

  function exportTpoReport() {
    showToast('Generating official Campus Placement Report PDF...');
  }

  /* ==========================================================================
     14. CONTEXT-AWARE HELP ASSISTANT WITH WEB SEARCH
     ========================================================================== */
  const CONTEXT_HELP = {
    dashboard: {
      title: 'Dashboard Help',
      intro: 'This page summarizes placement readiness, practice progress, and upcoming campus recruitment drives.',
      sections: {
        readiness: 'The Placement Readiness Index is an at-a-glance score. Completing DSA problems and skill diagnostics updates your readiness tier.',
        priority: 'Next Best Action suggests an immediate focus area. Start with the skill diagnostic to benchmark your algorithmic problem solving.',
        drives: 'Target Campus Drives lists scheduled corporate hiring drives. Choose View All Drives to explore company preparation guides.'
      }
    },
    dsa: {
      title: 'DSA Practice Help',
      intro: 'Practice curated data structures & algorithm problems and filter by topic, difficulty, or company.',
      sections: {
        progress: 'The progress card tracks solved questions and difficulty breakdown. Mark problems complete after solving to update your index.',
        filters: 'Use search for a problem title, topic, or company, or use the dropdown filters to narrow the list.',
        problems: 'Click any problem to view its statement, test cases, and hint. Explain your time and space complexity before coding.'
      }
    },
    hackathons: {
      title: 'Hackathons & Sprints Help',
      intro: 'Browse corporate challenges and filter opportunities by registration status and category.',
      sections: {
        filters: 'Select a status or category to filter active sprints. The count dynamically updates.',
        listings: 'Each card summarizes the challenge, sponsor, skills, rewards, and fast-track recruitment passes.'
      }
    },
    aichat: {
      title: 'Placement Coach Help',
      intro: 'Use the AI coach for mock interview practice, DSA explanations, system design architecture, and behavioral STAR feedback.',
      sections: {
        shortcuts: 'Prompt shortcuts provide immediate answers to frequent technical and behavioral placement questions.',
        messages: 'Ask questions or paste your drafted answers to receive structured, rubric-based feedback.'
      }
    },
    jobs: {
      title: 'Verified Job Postings Help',
      intro: 'Browse university graduate placement roles and filter postings by engineering role and employment type.',
      sections: {
        filters: 'Filter by Frontend, Backend, Fullstack, or Internships. Click the heart icon to save jobs.',
        listings: 'Review job requirements, skills, location, and click Apply Now to jump directly to official careers portals.'
      }
    },
    applications: {
      title: 'Company Preparation Help',
      intro: 'Explore company application guides, hiring preparation, required tech stacks, and interview checklists.',
      sections: {
        search: 'Search by company or role keyword, and filter by Product or Service companies.',
        companies: 'Click Prepare for Company to open detailed interview rounds, DSA focus topics, and preparation checklists.'
      }
    },
    college: {
      title: 'College TPO Portal Help',
      intro: 'The TPO portal summarizes campus placement statistics and student recruitment progression.',
      sections: {
        roster: 'Use the roster filters to narrow students by branch or placement status.',
        overview: 'Review batch placement percentage, average CTC packages, and highest offers.'
      }
    }
  };

  function getHelpContext() {
    const activeView = document.querySelector('.page-view:not(.hidden)');
    const viewId = activeView?.id.replace('view-', '') || 'dashboard';
    const config = CONTEXT_HELP[viewId] || CONTEXT_HELP.dashboard;
    const activeElement = document.activeElement;
    const section = activeElement?.closest('[data-help-section]') || activeElement?.closest('.card, .dsa-progress-card, .dsa-controls, .dsa-problem-grid, .filter-bar, .jobs-list, .applications-layout, .chat-wrapper, table');
    const key = section?.dataset?.helpSection || inferHelpSection(section, viewId) || inferHelpSection(activeView, viewId);
    return { viewId, config, section, key };
  }

  function inferHelpSection(element, viewId) {
    if (!element) return '';
    const text = (element.innerText || '').slice(0, 500).toLowerCase();
    const rules = {
      dashboard: [[/readiness|skill|index/, 'readiness'], [/priority|next best/, 'priority'], [/drive|scheduled/, 'drives']],
      dsa: [[/progress|solved/, 'progress'], [/filter|search/, 'filters'], [/problem|leetcode/, 'problems']],
      hackathons: [[/status|category|filter/, 'filters'], [/challenge|sponsor|register/, 'listings']],
      aichat: [[/shortcut|prompt/, 'shortcuts'], [/chat|coach|question/, 'messages']],
      jobs: [[/role|type|filter/, 'filters'], [/job|company|apply/, 'listings']],
      applications: [[/search|category/, 'search'], [/company|application|preparation/, 'companies']],
      college: [[/filter|branch|status|roster/, 'roster'], [/placement|readiness|overview/, 'overview']]
    };
    for (const [pattern, result] of (rules[viewId] || [])) {
      const reg = Array.isArray(pattern) ? pattern[0] : pattern;
      if (reg.test(text)) return Array.isArray(pattern) ? pattern[1] : result;
    }
    return '';
  }

  function formatHelpReply(question) {
    const context = getHelpContext();
    const q = question.toLowerCase();
    if (/\b(tab|page|screen|where am i)\b/.test(q)) return context.config.intro;
    if (/\b(section|this area|this part)\b/.test(q) || context.key) {
      const answer = context.config.sections[context.key];
      if (answer) return answer;
    }
    const matches = Object.values(CONTEXT_HELP).flatMap(page => [page.intro, ...Object.values(page.sections)]).filter(answer => {
      const words = answer.toLowerCase().match(/[a-z]{4,}/g) || [];
      return words.some(word => q.includes(word));
    });
    if (matches.length) return matches[0];
    return null;
  }

  function addContextHelpMessage(text, sender) {
    const messages = document.getElementById('context-help-messages');
    if (!messages) return;
    const bubble = document.createElement('p');
    bubble.className = `context-help-message ${sender}`;
    bubble.innerHTML = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function refreshContextHelp() {
    const { config, section, key } = getHelpContext();
    const titleEl = document.getElementById('context-help-title');
    if (titleEl) titleEl.textContent = config.title;
    const label = section ? (section.querySelector('h1,h2,h3,h4')?.innerText || key || 'Current section') : 'Current page';
    const locEl = document.getElementById('context-help-location');
    if (locEl) locEl.textContent = label;
  }

  function initContextChatbot() {
    const panel = document.getElementById('context-help-panel');
    const toggle = document.getElementById('context-help-toggle');
    if (!panel || !toggle) return;

    toggle.addEventListener('click', () => {
      const opening = panel.classList.contains('hidden');
      panel.classList.toggle('hidden', !opening);
      toggle.setAttribute('aria-expanded', String(opening));
      if (opening) document.getElementById('context-help-input')?.focus();
      refreshContextHelp();
    });

    const closeBtn = document.getElementById('context-help-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    const form = document.getElementById('context-help-form');
    if (form) {
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const input = document.getElementById('context-help-input');
        if (!input) return;
        const question = input.value.trim();
        if (!question) return;

        addContextHelpMessage(escapeHtml(question), 'user');
        input.value = '';
        input.disabled = true;

        const pageReply = formatHelpReply(question);
        if (pageReply) {
          addContextHelpMessage(pageReply, 'assistant');
          input.disabled = false;
          input.focus();
          refreshContextHelp();
        } else {
          // Asynchronously query live web search or Gemini AI
          const thinkingId = 'context-thinking-' + Date.now();
          const thinkingBubble = document.createElement('p');
          thinkingBubble.id = thinkingId;
          thinkingBubble.className = 'context-help-message assistant';
          thinkingBubble.innerHTML = '<em>Searching web & preparing answer...</em>';
          document.getElementById('context-help-messages')?.appendChild(thinkingBubble);

          try {
            const webReply = await resolveAnswer(question);
            document.getElementById(thinkingId)?.remove();
            addContextHelpMessage(webReply, 'assistant');
          } catch (err) {
            document.getElementById(thinkingId)?.remove();
            addContextHelpMessage(`Sorry, an error occurred: ${escapeHtml(err.message)}`, 'assistant');
          } finally {
            input.disabled = false;
            input.focus();
            refreshContextHelp();
          }
        }
      });
    }

    document.addEventListener('click', event => {
      if (event.target.closest('.nav-item')) setTimeout(refreshContextHelp, 0);
    });
    document.addEventListener('focusin', refreshContextHelp);
    refreshContextHelp();
  }

  /* ==========================================================================
     15. GLOBAL REGISTRATIONS & INITIALIZATION
     ========================================================================== */
  window.state = state;
  window.showToast = showToast;
  window.handleAuthSubmit = handleAuthSubmit;
  window.demoSignIn = demoSignIn;
  window.handleSignOut = handleSignOut;
  window.switchView = switchView;
  window.handleGlobalSearch = handleGlobalSearch;
  window.updateGaugeVisual = updateGaugeVisual;
  window.updatePriorityTask = updatePriorityTask;

  // DSA
  window.filterDsaProblems = filterDsaProblems;
  window.openDsaProblem = openDsaProblem;
  window.closeDsaProblem = closeDsaProblem;
  window.openRandomDsa = openRandomDsa;
  window.toggleDsaCompleted = toggleDsaCompleted;

  // Applications
  window.filterCompanies = filterCompanies;
  window.openCompanyPreparation = openCompanyPreparation;
  window.closeCompanyPreparation = closeCompanyPreparation;

  // Jobs
  window.filterJobs = filterJobs;
  window.toggleSavedJob = toggleSavedJob;

  // Hackathons
  window.filterHackathons = filterHackathons;
  window.clearHackathonFilters = clearHackathonFilters;
  window.clearHackathonSearch = clearHackathonSearch;
  window.setHackathonQuickFilter = setHackathonQuickFilter;
  window.registerHackathon = registerHackathon;
  window.openHackathonRegister = openHackathonRegister;
  window.closeHackathonRegisterModal = closeHackathonRegisterModal;
  window.submitHackathonRegistration = submitHackathonRegistration;
  window.openHackathonModal = openHackathonModal;
  window.closeHackathonModal = closeHackathonModal;
  window.initHackathonsModule = initHackathonsModule;

  // Interactive AI Chatbot (ChatGPT / Gemini)
  window.sendChatMessage = sendChatMessage;
  window.sendSuggestedChat = sendSuggestedChat;
  window.resetChatSession = resetChatSession;
  window.handleChatInputInput = handleChatInputInput;
  window.handleChatInputKeyDown = handleChatInputKeyDown;
  window.copyCode = copyCode;
  window.openAiSettingsModal = openAiSettingsModal;
  window.closeAiSettingsModal = closeAiSettingsModal;
  window.saveAiKey = saveAiKey;
  window.clearAiKey = clearAiKey;

  // Mock Interview
  window.openMockInterviewModal = openMockInterviewModal;
  window.closeMockInterviewModal = closeMockInterviewModal;
  window.selectInterviewType = selectInterviewType;
  window.startMockSession = startMockSession;
  window.submitMockAnswer = submitMockAnswer;
  window.exitMockSession = exitMockSession;
  window.closeMockResults = closeMockResults;
  window.restartMockInterview = restartMockInterview;

  // College TPO
  window.filterTpoRoster = filterTpoRoster;
  window.exportTpoReport = exportTpoReport;

  // Context Help Assistant
  window.initContextChatbot = initContextChatbot;
  window.refreshContextHelp = refreshContextHelp;

  /* ==========================================================================
     15. NOTIFICATION CENTER
     ========================================================================== */
  class NotificationManager {
    constructor() {
      this.currentFilter = 'all';
      this.notifications = [
        {
          id: 1,
          title: "Google placement drive opened",
          description: "Google 2026 Campus Recruitment is now live. Explore interview rounds & preparation checklist.",
          time: "Just now",
          category: "deadlines",
          type: "drive",
          target: "Google",
          isRead: false
        },
        {
          id: 2,
          title: "You have been shortlisted",
          description: "Congratulations! Shortlisted for Amazon SDE-1 Technical Round. Try a mock interview session.",
          time: "45 min ago",
          category: "interviews",
          type: "interview",
          target: "Amazon",
          isRead: false
        },
        {
          id: 3,
          title: "New hackathon added",
          description: "Distributed Systems Sprint 2026 with $15k in prize pool is now open for university teams.",
          time: "2 hours ago",
          category: "hackathons",
          type: "hackathon",
          target: "Distributed Systems Sprint",
          isRead: false
        },
        {
          id: 4,
          title: "New verified job alert",
          description: "Stripe posted Frontend Engineer (New Grad 2026) — Remote / Hybrid.",
          time: "4 hours ago",
          category: "jobs",
          type: "job",
          target: "Frontend",
          isRead: false
        },
        {
          id: 5,
          title: "Google drive deadline is tomorrow",
          description: "Reminder: Submit your online assessment score before tomorrow 11:59 PM.",
          time: "1 day ago",
          category: "deadlines",
          type: "drive",
          target: "Google",
          isRead: false
        }
      ];
    }

    getUnreadCount() {
      return this.notifications.filter(item => !item.isRead).length;
    }

    markAsRead(id) {
      const target = this.notifications.find(item => item.id === id);
      if (target) {
        target.isRead = true;
        this.updateBadge();
      }
    }

    markAllAsRead() {
      this.notifications.forEach(item => (item.isRead = true));
      this.updateBadge();
      if (typeof document !== 'undefined') {
        this.renderUI(document.getElementById('notification-center-panel'), this.currentFilter);
      }
      if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
        window.showToast('All notifications marked as read.');
      }
    }

    clearAll() {
      this.notifications = [];
      this.updateBadge();
      if (typeof document !== 'undefined') {
        this.renderUI(document.getElementById('notification-center-panel'), this.currentFilter);
      }
      if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
        window.showToast('All notifications cleared.');
      }
    }

    getByCategory(category) {
      if (!category || category === "all") {
        return this.notifications;
      }
      return this.notifications.filter(
        item => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    updateBadge() {
      if (typeof document === 'undefined') return;
      const count = this.getUnreadCount();
      const badge = document.getElementById('notification-badge');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
      }
    }

    handleNotificationClick(id) {
      const item = this.notifications.find(n => n.id === id);
      if (!item) return;

      this.markAsRead(id);
      this.renderUI(document.getElementById('notification-center-panel'), this.currentFilter);

      if (item.type === 'drive') {
        if (typeof window.switchView === 'function') {
          window.switchView('applications');
        }
        if (typeof window.openCompanyPreparation === 'function' && item.target) {
          window.openCompanyPreparation(item.target);
        }
      } else if (item.type === 'hackathon') {
        if (typeof window.switchView === 'function') {
          window.switchView('hackathons');
        }
      } else if (item.type === 'job') {
        if (typeof window.switchView === 'function') {
          window.switchView('jobs');
        }
        if (typeof window.filterJobs === 'function' && item.target) {
          window.filterJobs(item.target);
        }
      } else if (item.type === 'interview') {
        if (typeof window.openMockInterviewModal === 'function') {
          window.openMockInterviewModal();
        } else if (typeof window.switchView === 'function') {
          window.switchView('aichat');
        }
      }

      const panel = document.getElementById('notification-center-panel');
      if (panel) panel.classList.add('hidden');
    }

    renderUI(containerElement, categoryFilter = "all") {
      if (!containerElement) return;
      this.currentFilter = categoryFilter;

      const itemsToDisplay = this.getByCategory(categoryFilter);
      const unreadCount = this.getUnreadCount();
      this.updateBadge();

      const categories = [
        { id: 'all', label: 'All' },
        { id: 'deadlines', label: 'Drives 🏢' },
        { id: 'hackathons', label: 'Hackathons 🏆' },
        { id: 'jobs', label: 'Jobs 💼' },
        { id: 'interviews', label: 'Shortlists 🎯' }
      ];

      const filterTabsHtml = `
        <div class="notification-tabs">
          ${categories.map(cat => `
            <button class="notification-tab-btn ${this.currentFilter === cat.id ? 'active' : ''}" 
                    onclick="setNotificationCategory('${cat.id}')">
              ${cat.label}
            </button>
          `).join('')}
        </div>
      `;

      if (itemsToDisplay.length === 0) {
        containerElement.innerHTML = `
          <div class="notification-header">
            <h3>🔔 Notifications <span class="badge">${unreadCount}</span></h3>
            <div class="notification-actions">
              <button onclick="markAllNotificationsRead()">Mark all read</button>
              <button onclick="clearAllNotifications()">Clear all</button>
            </div>
          </div>
          ${filterTabsHtml}
          <div class="notification-empty">No notifications in this category</div>
        `;
        return;
      }

      const html = `
        <div class="notification-header">
          <h3>🔔 Notifications <span class="badge">${unreadCount}</span></h3>
          <div class="notification-actions">
            <button onclick="markAllNotificationsRead()">Mark all read</button>
            <button onclick="clearAllNotifications()">Clear all</button>
          </div>
        </div>
        ${filterTabsHtml}
        <ul class="notification-list">
          ${itemsToDisplay
            .map(
              item => `
            <li class="notification-item ${item.isRead ? "read" : "unread"}" 
                data-id="${item.id}" 
                onclick="handleNotificationItemClick(${item.id})">
              <div class="notification-content">
                <div class="notification-title-row">
                  <span class="notification-tag tag-${item.category}">${item.category.toUpperCase()}</span>
                  <span class="notification-time">${item.time}</span>
                </div>
                <p class="notification-text">${item.title}</p>
                ${item.description ? `<p class="notification-desc">${item.description}</p>` : ''}
              </div>
              ${!item.isRead ? `<button class="mark-read-btn" onclick="event.stopPropagation(); markNotificationRead(${item.id})">Read</button>` : ""}
            </li>
          `
            )
            .join("")}
        </ul>
      `;

      containerElement.innerHTML = html;
    }
  }

  const notificationManager = new NotificationManager();

  function toggleNotificationCenter() {
    const panel = document.getElementById('notification-center-panel');
    if (!panel) return;
    const isHidden = panel.classList.contains('hidden');

    const searchDropdown = document.getElementById('global-search-results');
    if (searchDropdown) searchDropdown.classList.add('hidden');

    if (isHidden) {
      notificationManager.renderUI(panel, notificationManager.currentFilter);
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  }

  function setNotificationCategory(category) {
    const panel = document.getElementById('notification-center-panel');
    notificationManager.renderUI(panel, category);
  }

  function markNotificationRead(id) {
    notificationManager.markAsRead(id);
    const panel = document.getElementById('notification-center-panel');
    notificationManager.renderUI(panel, notificationManager.currentFilter);
  }

  function markAllNotificationsRead() {
    notificationManager.markAllAsRead();
  }

  function clearAllNotifications() {
    notificationManager.clearAll();
  }

  function handleNotificationItemClick(id) {
    notificationManager.handleNotificationClick(id);
  }

  /* ==========================================================================
     16. GLOBAL SEARCH ENGINE & ROUTING
     ========================================================================== */
  class GlobalSearchEngine {
    constructor() {
      this.database = {
        companies: [
          { name: "Google Placement Roadmap", tag: "Google", desc: "4 Rounds • DSA & System Design" },
          { name: "Microsoft Technical Rounds", tag: "Microsoft", desc: "3 Rounds • Cloud & Algorithms" },
          { name: "Amazon Preparation", tag: "Amazon", desc: "4 Rounds • Leadership Principles & DSA" },
          { name: "NVIDIA Systems Track", tag: "NVIDIA", desc: "3 Rounds • C++ & Concurrency" },
          { name: "Infosys Specialist Programmer", tag: "Infosys", desc: "2 Rounds • Speed Coding" },
          { name: "TCS Digital Assessment", tag: "TCS", desc: "2 Rounds • Aptitude & CS Core" }
        ],
        jobs: [
          { name: "Amazon Software Engineer", tag: "Amazon", badge: "New Grad", role: "Backend" },
          { name: "Google Frontend Developer", tag: "Google", badge: "Verified", role: "Frontend" },
          { name: "Microsoft Cloud Engineer", tag: "Microsoft", badge: "Full-Time", role: "Fullstack" },
          { name: "Stripe Full-Stack Engineer", tag: "Stripe", badge: "Remote", role: "Fullstack" },
          { name: "SDE-1 Summer Internship", tag: "General", badge: "Internship", role: "Internships" }
        ],
        dsa: [
          { name: "Two Sum", tag: "Array", difficulty: "Easy", id: 1 },
          { name: "Valid Parentheses", tag: "Stack", difficulty: "Easy", id: 2 },
          { name: "Merge Two Sorted Lists", tag: "Linked List", difficulty: "Easy", id: 3 },
          { name: "Best Time to Buy & Sell Stock", tag: "Array", difficulty: "Easy", id: 4 },
          { name: "Longest Substring Without Repeating", tag: "String", difficulty: "Medium", id: 5 },
          { name: "3Sum", tag: "Two Pointers", difficulty: "Medium", id: 6 },
          { name: "Binary Tree Level Order Traversal", tag: "Tree", difficulty: "Medium", id: 7 },
          { name: "Course Schedule", tag: "Graph", difficulty: "Medium", id: 8 },
          { name: "LRU Cache", tag: "Design", difficulty: "Medium", id: 9 },
          { name: "Trapping Rain Water", tag: "Dynamic Programming", difficulty: "Hard", id: 10 }
        ],
        hackathons: [
          { name: "Smart India Hackathon 2026", tag: "Open Innovation", prize: "₹1,00,000" },
          { name: "Flipkart GRiD 7.0 - SDE Sprint", tag: "Web Development", prize: "₹5,00,000" },
          { name: "Google Cloud GenAI Challenge", tag: "AI & ML", prize: "₹16,50,000" },
          { name: "TCS HackQuest Season 10", tag: "Cybersecurity", prize: "₹5,00,000" },
          { name: "Distributed Systems Sprint", tag: "Systems & Infra", prize: "₹12,50,000" },
          { name: "AWS Cross-Platform Mobile Drive", tag: "App Development", prize: "₹3,50,000" },
          { name: "Polygon Web3 BUIDL Marathon", tag: "Blockchain", prize: "₹20,00,000" },
          { name: "Intel Edge AI & IoT Sprint", tag: "IoT", prize: "₹2,00,000" }
        ]
      };
    }

    search(query) {
      const term = (query || '').trim().toLowerCase();

      if (!term) {
        return { companies: [], jobs: [], dsa: [], hackathons: [] };
      }

      const isCompanyIntent = /company|companies|drive|drives|placement|roadmap/i.test(term);
      const isJobIntent = /job|jobs|intern|internship|hiring|career|role/i.test(term);
      const isDsaIntent = /dsa|problem|algo|algorithm|leetcode|sheet|data structure/i.test(term);
      const isHackathonIntent = /hackathon|sprint|challenge|prize|event/i.test(term);

      return {
        companies: this.database.companies.filter(
          c => isCompanyIntent || c.name.toLowerCase().includes(term) || c.tag.toLowerCase().includes(term)
        ),
        jobs: this.database.jobs.filter(
          j => isJobIntent || j.name.toLowerCase().includes(term) || j.tag.toLowerCase().includes(term) || (j.role && j.role.toLowerCase().includes(term))
        ),
        dsa: this.database.dsa.filter(
          d => isDsaIntent || d.name.toLowerCase().includes(term) || d.tag.toLowerCase().includes(term) || (d.difficulty && d.difficulty.toLowerCase().includes(term))
        ),
        hackathons: this.database.hackathons.filter(
          h => isHackathonIntent || h.name.toLowerCase().includes(term) || h.tag.toLowerCase().includes(term)
        )
      };
    }

    renderResults(results, resultsContainerElement) {
      if (!resultsContainerElement) return;

      const totalResults =
        results.companies.length + results.jobs.length + results.dsa.length + results.hackathons.length;

      if (totalResults === 0) {
        resultsContainerElement.innerHTML = `
          <div class="search-results-card">
            <div class="search-empty">No results found matching your search.</div>
          </div>
        `;
        resultsContainerElement.classList.remove('hidden');
        return;
      }

      let html = `<div class="search-results-card">`;

      if (results.companies.length > 0) {
        html += `
          <div class="search-category">
            <h4>🏢 Target Companies</h4>
            <ul>
              ${results.companies
                .map(
                  c => `
                <li onclick="executeSearchRoute('company', '${c.tag}', '${escape(c.name)}')">
                  <span>&rarr; <strong>${c.name}</strong></span>
                  <span class="search-item-badge">${c.tag}</span>
                </li>`
                )
                .join("")}
            </ul>
          </div>`;
      }

      if (results.dsa.length > 0) {
        html += `
          <div class="search-category">
            <h4>🧩 DSA Practice Problems</h4>
            <ul>
              ${results.dsa
                .map(
                  d => `
                <li onclick="executeSearchRoute('dsa', '${d.id || d.name}', '${escape(d.name)}')">
                  <span>&rarr; <strong>${d.name}</strong> (${d.tag})</span>
                  <span class="search-item-badge">${d.difficulty}</span>
                </li>`
                )
                .join("")}
            </ul>
          </div>`;
      }

      if (results.jobs.length > 0) {
        html += `
          <div class="search-category">
            <h4>💼 Verified Job Openings</h4>
            <ul>
              ${results.jobs
                .map(
                  j => `
                <li onclick="executeSearchRoute('jobs', '${j.role || j.tag}', '${escape(j.name)}')">
                  <span>&rarr; <strong>${j.name}</strong></span>
                  <span class="search-item-badge">${j.badge || j.tag}</span>
                </li>`
                )
                .join("")}
            </ul>
          </div>`;
      }

      if (results.hackathons.length > 0) {
        html += `
          <div class="search-category">
            <h4>🏆 Hackathons & Drives</h4>
            <ul>
              ${results.hackathons
                .map(
                  h => `
                <li onclick="executeSearchRoute('hackathons', '${h.name}', '${escape(h.name)}')">
                  <span>&rarr; <strong>${h.name}</strong></span>
                  <span class="search-item-badge">${h.prize}</span>
                </li>`
                )
                .join("")}
            </ul>
          </div>`;
      }

      html += `</div>`;
      resultsContainerElement.innerHTML = html;
      resultsContainerElement.classList.remove('hidden');
    }
  }

  const globalSearchEngine = new GlobalSearchEngine();

  function executeSearchRoute(category, target) {
    const resultsContainer = document.getElementById('global-search-results');
    if (resultsContainer) resultsContainer.classList.add('hidden');

    const searchInput = document.getElementById('global-search-input');
    if (searchInput) searchInput.value = '';

    if (category === 'company') {
      if (typeof window.switchView === 'function') {
        window.switchView('applications');
      }
      if (typeof window.openCompanyPreparation === 'function') {
        window.openCompanyPreparation(target);
      }
    } else if (category === 'dsa') {
      if (typeof window.switchView === 'function') {
        window.switchView('dsa');
      }
      const problemId = parseInt(target, 10);
      if (!isNaN(problemId) && typeof window.openDsaProblem === 'function') {
        window.openDsaProblem(problemId);
      } else {
        const dsaSearch = document.getElementById('dsa-search');
        if (dsaSearch) {
          dsaSearch.value = target;
          dsaSearch.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    } else if (category === 'jobs') {
      if (typeof window.switchView === 'function') {
        window.switchView('jobs');
      }
      if (typeof window.filterJobs === 'function') {
        window.filterJobs(target);
      }
    } else if (category === 'hackathons') {
      if (typeof window.switchView === 'function') {
        window.switchView('hackathons');
      }
      const hackSearch = document.getElementById('hackathon-search');
      if (hackSearch) {
        hackSearch.value = target;
        filterHackathons();
      }
    }
  }

  function handleGlobalSearchInput(query) {
    const container = document.getElementById('global-search-results');
    if (!container) return;

    if (!query || !query.trim()) {
      container.classList.add('hidden');
      return;
    }

    const results = globalSearchEngine.search(query);
    globalSearchEngine.renderResults(results, container);
  }

  function handleGlobalSearchKeyDown(event) {
    if (event.key === 'Escape') {
      const container = document.getElementById('global-search-results');
      if (container) container.classList.add('hidden');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const query = event.target.value.trim();
      if (!query) return;

      const results = globalSearchEngine.search(query);
      if (results.companies.length > 0) {
        executeSearchRoute('company', results.companies[0].tag);
      } else if (results.dsa.length > 0) {
        executeSearchRoute('dsa', results.dsa[0].id || results.dsa[0].name);
      } else if (results.jobs.length > 0) {
        executeSearchRoute('jobs', results.jobs[0].role || results.jobs[0].tag);
      } else if (results.hackathons.length > 0) {
        executeSearchRoute('hackathons', results.hackathons[0].name);
      } else if (typeof window.handleGlobalSearch === 'function') {
        window.handleGlobalSearch(query);
        const container = document.getElementById('global-search-results');
        if (container) container.classList.add('hidden');
      }
    }
  }

  // Close search and notification dropdown on outside click
  document.addEventListener('click', (event) => {
    const searchContainer = event.target.closest('#global-search-container');
    if (!searchContainer) {
      const results = document.getElementById('global-search-results');
      if (results && !results.classList.contains('hidden')) {
        results.classList.add('hidden');
      }
    }

    const notifWrapper = event.target.closest('.notification-dropdown-wrapper');
    if (!notifWrapper) {
      const notifPanel = document.getElementById('notification-center-panel');
      if (notifPanel && !notifPanel.classList.contains('hidden')) {
        notifPanel.classList.add('hidden');
      }
    }
  });

  // Global window bindings for Notification Center & Search
  window.NotificationManager = NotificationManager;
  window.notificationManager = notificationManager;
  window.toggleNotificationCenter = toggleNotificationCenter;
  window.setNotificationCategory = setNotificationCategory;
  window.markNotificationRead = markNotificationRead;
  window.markAllNotificationsRead = markAllNotificationsRead;
  window.clearAllNotifications = clearAllNotifications;
  window.handleNotificationItemClick = handleNotificationItemClick;

  window.GlobalSearchEngine = GlobalSearchEngine;
  window.globalSearchEngine = globalSearchEngine;
  window.executeSearchRoute = executeSearchRoute;
  window.handleGlobalSearchInput = handleGlobalSearchInput;
  window.handleGlobalSearchKeyDown = handleGlobalSearchKeyDown;

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    updateGaugeVisual(0);
    initDsaModule();
    initHackathonsModule();
    initContextChatbot();
    updateAiStatusBadge();
    notificationManager.updateBadge();
  });
})();

