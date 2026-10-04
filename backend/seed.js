const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Question = require('./models/Question');
const CodingQuestion = require('./models/CodingQuestion');
const Interview = require('./models/Interview');
const PracticeSubmission = require('./models/PracticeSubmission');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_interview_prep';

    // Connect to MongoDB or Memory Server
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to MongoDB server for seeding.');
    } catch (err) {
      console.log('Local MongoDB connection failed. Starting MongoMemoryServer for seeding...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Connected to MongoMemoryServer at:', uri);
    }

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Question.deleteMany({});
    await CodingQuestion.deleteMany({});
    await Interview.deleteMany({});
    await PracticeSubmission.deleteMany({});

    console.log('Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@prep.com',
      password: adminPassword,
      role: 'admin',
      skills: ['System Design', 'Node.js', 'React', 'MongoDB', 'Python']
    });

    const studentUser = await User.create({
      name: 'Aditya JobSeeker',
      email: 'student@prep.com',
      password: studentPassword,
      role: 'user',
      skills: ['JavaScript', 'Java', 'Data Structures', 'React']
    });

    console.log('Seeding MCQs and Interview Questions...');

    const questionsList = [
      // MCQs (20+)
      {
        title: 'Which of the following is NOT a characteristic of Java garbage collection?',
        description: 'Java Memory Management concept',
        category: 'Java',
        difficulty: 'Medium',
        type: 'mcq',
        options: [
          'It runs automatically in the background',
          'It guarantees immediate object deallocation upon nullification',
          'It prevents memory leaks caused by unreachable objects',
          'System.gc() requests garbage collection but does not force it'
        ],
        correctAnswer: 1,
        explanation: 'Setting an object reference to null makes it eligible for GC, but GC execution time is non-deterministic and not guaranteed immediately.'
      },
      {
        title: 'What will be the output of `console.log(typeof NaN)` in JavaScript?',
        description: 'JavaScript data types',
        category: 'JavaScript',
        difficulty: 'Easy',
        type: 'mcq',
        options: ['"number"', '"nan"', '"undefined"', '"object"'],
        correctAnswer: 0,
        explanation: 'In JavaScript, NaN (Not-a-Number) is a special numeric value defined by IEEE 754 standard, so its typeof is "number".'
      },
      {
        title: 'In Python, how is list memory dynamically resized when appending elements?',
        description: 'Python internal data structures',
        category: 'Python',
        difficulty: 'Medium',
        type: 'mcq',
        options: [
          'Allocates +1 memory slot per append',
          'Doubles memory capacity whenever full (geometric growth pattern)',
          'Allocates memory in fixed chunks of 1024 bytes',
          'Overwrites earlier elements when list capacity is reached'
        ],
        correctAnswer: 1,
        explanation: 'Python lists use dynamic array resizing with geometric growth (typically over-allocating capacity by ~1.125x to 2x) to achieve amortized O(1) append time.'
      },
      {
        title: 'Which data structure is best suited for implementing a FIFO (First-In First-Out) order?',
        description: 'Data Structures basics',
        category: 'Data Structures',
        difficulty: 'Easy',
        type: 'mcq',
        options: ['Stack', 'Queue', 'Binary Search Tree', 'Max Heap'],
        correctAnswer: 1,
        explanation: 'A Queue enforces FIFO (First In First Out) order, whereas a Stack enforces LIFO (Last In First Out).'
      },
      {
        title: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
        description: 'Tree data structures time complexity',
        category: 'Algorithms',
        difficulty: 'Medium',
        type: 'mcq',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswer: 1,
        explanation: 'In a balanced BST, tree height is log2(N), making search, insertion, and deletion operations take average O(log N) time.'
      },
      {
        title: 'Which ACID property in DBMS guarantees that completed transactions persist even after a system crash?',
        description: 'Database transaction properties',
        category: 'DBMS',
        difficulty: 'Easy',
        type: 'mcq',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctAnswer: 3,
        explanation: 'Durability ensures that once a transaction has been committed, it will remain committed even in the event of a power loss or crash.'
      },
      {
        title: 'In Operating Systems, what is a condition that can lead to a Deadlock?',
        description: 'OS Synchronization and Deadlocks',
        category: 'Operating Systems',
        difficulty: 'Hard',
        type: 'mcq',
        options: [
          'Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
          'Preemption, Starvation, Paging, Fragmentation',
          'Context switching, Semaphore signaling, Priority inversion',
          'Spooling, Deadlock avoidance, Banker algorithm'
        ],
        correctAnswer: 0,
        explanation: 'The Coffman conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.'
      },
      {
        title: 'Which layer of the OSI model is responsible for end-to-end packet delivery and logical IP routing?',
        description: 'Computer Networks OSI Model',
        category: 'Computer Networks',
        difficulty: 'Easy',
        type: 'mcq',
        options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
        correctAnswer: 1,
        explanation: 'The Network Layer (Layer 3) handles IP addressing, packet forwarding, and router-to-router path determination.'
      },
      {
        title: 'Which OOP concept allows a subclass to provide a specific implementation of a method already defined in its superclass?',
        description: 'Object Oriented Programming',
        category: 'OOP',
        difficulty: 'Easy',
        type: 'mcq',
        options: ['Method Overloading', 'Method Overriding', 'Encapsulation', 'Abstraction'],
        correctAnswer: 1,
        explanation: 'Method Overriding is run-time polymorphism where a derived class provides a specialized implementation of a superclass method.'
      },
      {
        title: 'In JavaScript, what is the Event Loop primarily responsible for?',
        description: 'JS asynchronous execution engine',
        category: 'JavaScript',
        difficulty: 'Medium',
        type: 'mcq',
        options: [
          'Compiling JavaScript code to native bytecode',
          'Monitoring call stack and executing microtasks/macrotasks when stack is empty',
          'Managing DOM memory garbage collection',
          'Executing multi-threaded web workers concurrently'
        ],
        correctAnswer: 1,
        explanation: 'The Event Loop checks if the call stack is empty; if empty, it dequeues pending microtasks (Promises) and macrotasks (setTimeout).'
      },
      {
        title: 'What is the primary difference between Process and Thread in Operating Systems?',
        description: 'Process management',
        category: 'Operating Systems',
        difficulty: 'Medium',
        type: 'mcq',
        options: [
          'Processes share address space while threads have isolated address space',
          'Threads within the same process share address space, whereas processes have isolated memory spaces',
          'Processes are lightweight compared to threads',
          'Threads cannot run concurrently on multi-core processors'
        ],
        correctAnswer: 1,
        explanation: 'Threads share heap, code, and global memory within a parent process, making context switches faster than process switches.'
      },
      {
        title: 'What is a SQL Index and how does it improve query performance?',
        description: 'DBMS indexing internals',
        category: 'DBMS',
        difficulty: 'Medium',
        type: 'mcq',
        options: [
          'It duplicates the entire database table on disk',
          'It creates a B-Tree / B+Tree data structure to locate records faster without full table scans',
          'It encrypts sensitive columns for fast lookups',
          'It restricts table access to read-only mode'
        ],
        correctAnswer: 1,
        explanation: 'A database index creates a B-Tree/B+Tree structure mapping index keys to row IDs, reducing search complexity from O(N) to O(log N).'
      },
      {
        title: 'What does TCP 3-Way Handshake consist of?',
        description: 'TCP/IP Connection Establishment',
        category: 'Computer Networks',
        difficulty: 'Easy',
        type: 'mcq',
        options: ['SYN -> SYN-ACK -> ACK', 'FIN -> ACK -> FIN-ACK', 'REQ -> RES -> CONFIRM', 'PING -> PONG -> OK'],
        correctAnswer: 0,
        explanation: 'TCP connection setup requires Client sending SYN, Server responding with SYN-ACK, and Client acknowledging with ACK.'
      },
      {
        title: 'Which Java keyword prevents a variable from being re-assigned or a method from being overridden?',
        description: 'Java keywords',
        category: 'Java',
        difficulty: 'Easy',
        type: 'mcq',
        options: ['static', 'final', 'const', 'volatile'],
        correctAnswer: 1,
        explanation: '`final` variables cannot be re-assigned, `final` methods cannot be overridden, and `final` classes cannot be extended.'
      },
      {
        title: 'In Python, what is the difference between shallow copy and deep copy?',
        description: 'Python copy module',
        category: 'Python',
        difficulty: 'Medium',
        type: 'mcq',
        options: [
          'Shallow copy creates nested object copies while deep copy duplicates references',
          'Shallow copy copies references of nested objects; deep copy recursively duplicates all nested objects',
          'Shallow copy is slower than deep copy',
          'Deep copy only works on primitive types'
        ],
        correctAnswer: 1,
        explanation: 'Shallow copy constructs a new compound object and inserts references to original objects. Deep copy recursively copies all nested objects.'
      },

      // TECHNICAL INTERVIEW QUESTIONS (10+)
      {
        title: 'Explain Object-Oriented Programming (OOP) core pillars with practical software examples.',
        description: 'Discuss Encapsulation, Inheritance, Polymorphism, and Abstraction.',
        category: 'OOP',
        difficulty: 'Easy',
        type: 'technical',
        explanation: 'Candidate should explain all 4 pillars and provide realistic domain classes like Shape/Circle for Polymorphism or BankAccount for Encapsulation.'
      },
      {
        title: 'How does asynchronous execution and Promises work under the hood in JavaScript?',
        description: 'Event Loop, Call Stack, Microtask Queue, Macrotask Queue.',
        category: 'JavaScript',
        difficulty: 'Medium',
        type: 'technical',
        explanation: 'Candidate should explain call stack execution, web APIs, Promise microtask queue priority over setTimeout macrotask queue.'
      },
      {
        title: 'Compare REST APIs vs GraphQL vs WebSockets. When would you choose each for a enterprise application?',
        description: 'API Design patterns & protocols',
        category: 'System Design',
        difficulty: 'Medium',
        type: 'technical',
        explanation: 'Explain stateless HTTP endpoints, GraphQL flexible payload queries, and WebSockets bidirectional real-time streaming.'
      },
      {
        title: 'What is the difference between SQL (Relational) and NoSQL (Document/Key-Value) databases? Give trade-offs.',
        description: 'Database selection & architecture',
        category: 'DBMS',
        difficulty: 'Medium',
        type: 'technical',
        explanation: 'Discuss schema rigidity, ACID guarantees in SQL vs Horizontal scaling and flexible JSON schemas in MongoDB.'
      },
      {
        title: 'Explain the difference between Process, Thread, and Coroutines/Async Tasks in modern OS & runtimes.',
        description: 'Concurrency & Multithreading',
        category: 'Operating Systems',
        difficulty: 'Hard',
        type: 'technical',
        explanation: 'Detail memory isolation in processes, shared memory in threads, and non-blocking cooperative scheduling in coroutines.'
      },
      {
        title: 'How do you optimize slow database queries in production? Step-by-step troubleshooting.',
        description: 'Performance tuning & Indexing',
        category: 'DBMS',
        difficulty: 'Hard',
        type: 'technical',
        explanation: 'EXPLAIN plans, indexes, removing N+1 queries, query caching, connection pooling, and database sharding/partitioning.'
      },
      {
        title: 'Explain how Java HashMap handles collisions under the hood in Java 8+.',
        description: 'Data Structure Internal Implementation',
        category: 'Java',
        difficulty: 'Medium',
        type: 'technical',
        explanation: 'Buckets, LinkedList conversion to Red-Black Tree when bucket size exceeds TREEIFY_THRESHOLD (8).'
      },
      {
        title: 'What are Python Generators and Decorators? How do they work under the hood?',
        description: 'Advanced Python concepts',
        category: 'Python',
        difficulty: 'Medium',
        type: 'technical',
        explanation: 'Generators use `yield` and stateful iterators for memory efficiency; Decorators are higher-order functions wrapping functions.'
      },
      {
        title: 'Explain HTTPS and TLS Handshake process step-by-step.',
        description: 'Web Security and Networking',
        category: 'Computer Networks',
        difficulty: 'Hard',
        type: 'technical',
        explanation: 'Asymmetric encryption for key exchange (RSA/Diffie-Hellman), certificate validation, and symmetric AES session keys.'
      },
      {
        title: 'What is Virtual Memory, Paging, and Page Fault in Operating Systems?',
        description: 'Memory Management',
        category: 'Operating Systems',
        difficulty: 'Medium',
        type: 'technical',
        explanation: 'Virtual address translation via Page Tables, RAM page frames, and page fault handling when page is in disk swap space.'
      },

      // HR INTERVIEW QUESTIONS (10+)
      {
        title: 'Tell me about yourself and your background in software engineering.',
        description: 'Elevator pitch, relevant experience, core skills, passion for tech.',
        category: 'HR',
        difficulty: 'Easy',
        type: 'hr',
        explanation: 'Focus on 60-90 sec concise story: Present role, past background highlights, key technical accomplishments, and why you are excited for this opportunity.'
      },
      {
        title: 'What are your greatest professional strengths and your biggest weakness?',
        description: 'Self-awareness, honesty, self-improvement plan.',
        category: 'HR',
        difficulty: 'Easy',
        type: 'hr',
        explanation: 'Strengths should align with problem solving and teamwork. Weakness must be genuine with active mitigation steps.'
      },
      {
        title: 'Describe a time when you faced a difficult technical conflict within a team. How did you resolve it?',
        description: 'Behavioral - Conflict Resolution using STAR method.',
        category: 'HR',
        difficulty: 'Medium',
        type: 'hr',
        explanation: 'STAR: Situation, Task, Action (data-driven compromise, respectful communication), Result (successful delivery).'
      },
      {
        title: 'Where do you see yourself in 3 to 5 years in your engineering career?',
        description: 'Career alignment and long-term vision.',
        category: 'HR',
        difficulty: 'Easy',
        type: 'hr',
        explanation: 'Show ambition for mastering technical depth, taking ownership, mentoring juniors, and contributing to core business goals.'
      },
      {
        title: 'Tell me about a project that failed or missed a critical deadline. What did you learn?',
        description: 'Accountability and resilience.',
        category: 'HR',
        difficulty: 'Medium',
        type: 'hr',
        explanation: 'Take responsibility without blaming others, highlight root cause analysis, and explain new processes implemented to prevent recurrence.'
      },
      {
        title: 'How do you handle working under high pressure or tight project deadlines?',
        description: 'Stress management & prioritization.',
        category: 'HR',
        difficulty: 'Medium',
        type: 'hr',
        explanation: 'Prioritization (MoSCoW/Eisenhower matrix), transparent communication with stakeholders, breaking tasks into manageable sprints.'
      },
      {
        title: 'Give an example of a time you took initiative or led a project without being explicitly asked.',
        description: 'Leadership and ownership mindsets.',
        category: 'HR',
        difficulty: 'Medium',
        type: 'hr',
        explanation: 'Show proactiveness: identifying technical debt, automated testing improvements, or documentation overhauls.'
      },
      {
        title: 'Why do you want to work at our company specifically?',
        description: 'Company alignment and interest.',
        category: 'HR',
        difficulty: 'Easy',
        type: 'hr',
        explanation: 'Connect company mission, product impact, tech stack, and engineering culture with your own growth goals.'
      },
      {
        title: 'How do you prioritize competing feature requests or bugs when resources are limited?',
        description: 'Decision making and pragmatic trade-offs.',
        category: 'HR',
        difficulty: 'Hard',
        type: 'hr',
        explanation: 'Assess severity, user impact, business value, and effort estimation in collaboration with product managers.'
      },
      {
        title: 'Do you have any questions for us about the team, tech stack, or engineering culture?',
        description: 'Closing interview question.',
        category: 'HR',
        difficulty: 'Easy',
        type: 'hr',
        explanation: 'Ask insightful questions regarding sprint velocity, deployment frequency, team growth, and technical challenges.'
      }
    ];

    await Question.insertMany(questionsList);

    console.log('Seeding Coding Questions...');
    const codingQuestionsList = [
      {
        title: 'Two Sum',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
        difficulty: 'Easy',
        category: 'Arrays & Hashing',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6.' }
        ],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
        testCases: [
          { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false },
          { input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: false },
          { input: '[3,3], 6', expectedOutput: '[0,1]', isHidden: true }
        ],
        starterCode: {
          javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
          python: 'def twoSum(nums, target):\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n    return []',
          java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[] { map.get(diff), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}'
        }
      },
      {
        title: 'Valid Anagram',
        description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word formed by rearranging the letters of a different word using all the original letters exactly once.',
        difficulty: 'Easy',
        category: 'Strings',
        examples: [
          { input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Both strings have identical character frequency counts.' },
          { input: 's = "rat", t = "car"', output: 'false', explanation: 'Character frequencies do not match.' }
        ],
        constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
        testCases: [
          { input: '"anagram", "nagaram"', expectedOutput: 'true', isHidden: false },
          { input: '"rat", "car"', expectedOutput: 'false', isHidden: false }
        ],
        starterCode: {
          javascript: 'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (let char of s) count[char] = (count[char] || 0) + 1;\n  for (let char of t) {\n    if (!count[char]) return false;\n    count[char]--;\n  }\n  return true;\n}',
          python: 'def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t): return False\n    return sorted(s) == sorted(t)'
        }
      },
      {
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        difficulty: 'Easy',
        category: 'Linked List',
        examples: [
          { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed direction of pointers.' }
        ],
        constraints: ['Number of nodes in list is [0, 5000]', '-5000 <= Node.val <= 5000'],
        testCases: [
          { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isHidden: false }
        ],
        starterCode: {
          javascript: 'function reverseList(head) {\n  let prev = null;\n  let current = head;\n  while (current) {\n    let nextTemp = current.next;\n    current.next = prev;\n    prev = current;\n    current = nextTemp;\n  }\n  return prev;\n}'
        }
      },
      {
        title: 'Maximum Subarray (Kadanes Algorithm)',
        description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
        difficulty: 'Medium',
        category: 'Algorithms',
        examples: [
          { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum 6.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
          { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false }
        ],
        starterCode: {
          javascript: 'function maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currentMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentMax = Math.max(nums[i], currentMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currentMax);\n  }\n  return maxSoFar;\n}'
        }
      },
      {
        title: 'Binary Search',
        description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.',
        difficulty: 'Easy',
        category: 'Binary Search',
        examples: [
          { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' }
        ],
        constraints: ['1 <= nums.length <= 10^4', 'O(log n) runtime complexity required.'],
        testCases: [
          { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4', isHidden: false }
        ],
        starterCode: {
          javascript: 'function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}'
        }
      }
    ];

    await CodingQuestion.insertMany(codingQuestionsList);

    console.log('Seeding Sample Mock Interviews & Submissions for Demo User...');
    const sampleInterview = await Interview.create({
      userId: studentUser._id,
      type: 'Mixed',
      difficulty: 'Medium',
      topics: ['JavaScript', 'Data Structures', 'HR'],
      questions: [
        { title: 'Tell me about yourself and your background in software engineering.', category: 'HR', type: 'hr' },
        { title: 'How does asynchronous execution and Promises work under the hood in JavaScript?', category: 'JavaScript', type: 'technical' },
        { title: 'What is the difference between SQL and NoSQL databases?', category: 'DBMS', type: 'technical' }
      ],
      answers: [
        {
          questionIndex: 0,
          questionText: 'Tell me about yourself and your background in software engineering.',
          answer: 'I am a software engineering student passionate about full-stack web development. I have built several projects using React, Node.js, and MongoDB. I enjoy solving algorithmic challenges on LeetCode and collaborating in agile team projects.',
          evaluation: 'Great introduction structure. Clearly states experience and stack.',
          score: 88,
          feedback: 'Elaborate slightly more on specific impact metrics from your projects.',
          improvedAnswer: 'I am a full-stack engineer specializing in React and Node.js with experience building high-traffic web applications. Recently, I optimized API response times by 35% using database indexing.'
        },
        {
          questionIndex: 1,
          questionText: 'How does asynchronous execution and Promises work under the hood in JavaScript?',
          answer: 'JavaScript is single threaded with an Event Loop. Asynchronous calls like promises go into the Microtask Queue which executes immediately after the main Call Stack clears.',
          evaluation: 'Accurate explanation of microtask queue and event loop.',
          score: 85,
          feedback: 'Mention web APIs and Macrotask queue comparison.',
          improvedAnswer: 'JavaScript executes synchronous code on the Call Stack. Async operations delegate to Web APIs. When completed, Promise callbacks enter the Microtask Queue which takes priority over the Macrotask Queue.'
        }
      ],
      score: 86,
      technicalScore: 85,
      communicationScore: 88,
      relevanceScore: 86,
      confidenceScore: 87,
      strengths: ['Clear articulate speech', 'Good knowledge of JS Event Loop', 'Solid project context'],
      weaknesses: ['Could mention database query optimization', 'Explain Macrotask vs Microtask in detail'],
      suggestions: ['Practice system design trade-offs', 'Use STAR method for behavioral answers'],
      topicsToRevise: ['System Design', 'WebSockets'],
      status: 'completed',
      completedAt: new Date()
    });

    console.log('Database seeding completed successfully!');
    console.log(`Demo Admin Login: admin@prep.com / admin123`);
    console.log(`Demo Student Login: student@prep.com / student123`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();