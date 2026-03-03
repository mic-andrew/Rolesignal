"""Seed service — populates the database with DSA topics and problems."""

import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Problem, TestCase, Topic

logger = logging.getLogger(__name__)

# ───────────────────────────────────────────────────────────────────
# Topic definitions
# ───────────────────────────────────────────────────────────────────

TOPICS: list[dict] = [
    # Core DSA
    {"name": "Arrays", "slug": "arrays", "description": "Linear data structures for storing elements in contiguous memory.", "icon": "array", "sort_order": 1, "category": "core_dsa"},
    {"name": "Strings", "slug": "strings", "description": "Sequences of characters with specialized manipulation techniques.", "icon": "string", "sort_order": 2, "category": "core_dsa"},
    {"name": "Linked Lists", "slug": "linked-lists", "description": "Sequential data structures where elements are connected via pointers.", "icon": "linked-list", "sort_order": 3, "category": "core_dsa"},
    {"name": "Stacks", "slug": "stacks", "description": "Last-in-first-out data structures for tracking state and parsing.", "icon": "stack", "sort_order": 4, "category": "core_dsa"},
    {"name": "Queues", "slug": "queues", "description": "First-in-first-out data structures for scheduling and BFS.", "icon": "queue", "sort_order": 5, "category": "core_dsa"},
    {"name": "Hash Maps", "slug": "hash-maps", "description": "Key-value stores with constant-time average lookup.", "icon": "hash-map", "sort_order": 6, "category": "core_dsa"},
    {"name": "Trees", "slug": "trees", "description": "Hierarchical structures with root node and branching children.", "icon": "tree", "sort_order": 7, "category": "core_dsa"},
    {"name": "Graphs", "slug": "graphs", "description": "Collections of nodes connected by edges for modeling relationships.", "icon": "graph", "sort_order": 8, "category": "core_dsa"},
    {"name": "Sorting", "slug": "sorting", "description": "Algorithms for arranging elements in a defined order.", "icon": "sorting", "sort_order": 9, "category": "core_dsa"},
    {"name": "Searching", "slug": "searching", "description": "Techniques for locating elements within data structures.", "icon": "search", "sort_order": 10, "category": "core_dsa"},
    # Advanced
    {"name": "Dynamic Programming", "slug": "dynamic-programming", "description": "Optimization via overlapping subproblems and memoization.", "icon": "dynamic-programming", "sort_order": 11, "category": "advanced"},
    {"name": "Tries", "slug": "tries", "description": "Tree-like structures optimized for prefix-based string search.", "icon": "trie", "sort_order": 12, "category": "advanced"},
    {"name": "Heaps", "slug": "heaps", "description": "Complete binary trees maintaining min/max ordering.", "icon": "heap", "sort_order": 13, "category": "advanced"},
    {"name": "Sliding Window", "slug": "sliding-window", "description": "Technique for processing contiguous subarrays with a moving window.", "icon": "sliding-window", "sort_order": 14, "category": "advanced"},
    {"name": "Two Pointers", "slug": "two-pointers", "description": "Pattern using two indices to traverse data from different positions.", "icon": "two-pointers", "sort_order": 15, "category": "advanced"},
    {"name": "Backtracking", "slug": "backtracking", "description": "Systematic search that explores possibilities and prunes invalid paths.", "icon": "backtracking", "sort_order": 16, "category": "advanced"},
    {"name": "Greedy", "slug": "greedy", "description": "Algorithms making locally optimal choices for a global optimum.", "icon": "greedy", "sort_order": 17, "category": "advanced"},
    # System Design
    {"name": "System Design", "slug": "system-design", "description": "Designing scalable, reliable distributed systems.", "icon": "system-design", "sort_order": 18, "category": "system_design"},
]

# ───────────────────────────────────────────────────────────────────
# Reusable driver-code fragments
# ───────────────────────────────────────────────────────────────────

# Java: parse "[1,2,3]" → int[]
_JAVA_PARSE_ARR = (
    "    static int[] _pa(String s) {\n"
    "        s = s.trim();\n"
    "        if (s.equals(\"[]\")) return new int[0];\n"
    "        s = s.substring(1, s.length()-1);\n"
    "        String[] p = s.split(\",\");\n"
    "        int[] a = new int[p.length];\n"
    "        for (int i=0;i<p.length;i++) a[i]=Integer.parseInt(p[i].trim());\n"
    "        return a;\n"
    "    }\n"
)

# Java: format int[] as "[0,1]"
_JAVA_FMT_ARR = (
    "    static String _fa(int[] a) {\n"
    "        StringBuilder sb = new StringBuilder(\"[\");\n"
    "        for (int i=0;i<a.length;i++){if(i>0)sb.append(\",\");sb.append(a[i]);}\n"
    "        sb.append(\"]\"); return sb.toString();\n"
    "    }\n"
)

# C++: parse "[1,2,3]" → vector<int>
_CPP_PARSE_ARR = (
    "std::vector<int> _pa(const std::string& s){\n"
    "    std::vector<int> r;\n"
    "    if(s.size()<=2) return r;\n"
    "    std::stringstream ss(s.substr(1,s.size()-2));\n"
    "    std::string t;\n"
    "    while(std::getline(ss,t,',')) r.push_back(std::stoi(t));\n"
    "    return r;\n"
    "}\n"
)

# ───────────────────────────────────────────────────────────────────
# Problem 1: Two Sum
# ───────────────────────────────────────────────────────────────────


def _two_sum() -> dict:
    return {
        "title": "Two Sum",
        "slug": "two-sum",
        "topic_slug": "hash-maps",
        "difficulty": "easy",
        "description": (
            "Given an array of integers `nums` and an integer `target`, "
            "return the indices of the two numbers such that they add up "
            "to `target`.\n\n"
            "You may assume that each input would have **exactly one "
            "solution**, and you may not use the same element twice.\n\n"
            "You can return the answer in any order."
        ),
        "constraints": [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists.",
        ],
        "examples": [
            {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]",
             "explanation": "nums[0] + nums[1] == 9, so we return [0, 1]."},
            {"input": "nums = [3,2,4], target = 6", "output": "[1,2]",
             "explanation": "nums[1] + nums[2] == 6."},
            {"input": "nums = [3,3], target = 6", "output": "[0,1]"},
        ],
        "starter_code": {
            "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass",
            "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n\n}",
            "typescript": "function twoSum(nums: number[], target: number): number[] {\n\n}",
            "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n\n    }\n}",
            "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n\n    }\n};",
            "go": "func twoSum(nums []int, target int) []int {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def twoSum(self, nums: list[int], target: int) -> list[int]:\n"
                "        seen = {}\n"
                "        for i, num in enumerate(nums):\n"
                "            comp = target - num\n"
                "            if comp in seen:\n"
                "                return [seen[comp], i]\n"
                "            seen[num] = i\n"
                "        return []"
            ),
            "javascript": (
                "function twoSum(nums, target) {\n"
                "    const seen = new Map();\n"
                "    for (let i = 0; i < nums.length; i++) {\n"
                "        const comp = target - nums[i];\n"
                "        if (seen.has(comp)) return [seen.get(comp), i];\n"
                "        seen.set(nums[i], i);\n"
                "    }\n"
                "    return [];\n"
                "}"
            ),
            "typescript": (
                "function twoSum(nums: number[], target: number): number[] {\n"
                "    const seen = new Map<number, number>();\n"
                "    for (let i = 0; i < nums.length; i++) {\n"
                "        const comp = target - nums[i];\n"
                "        if (seen.has(comp)) return [seen.get(comp)!, i];\n"
                "        seen.set(nums[i], i);\n"
                "    }\n"
                "    return [];\n"
                "}"
            ),
            "java": (
                "class Solution {\n"
                "    public int[] twoSum(int[] nums, int target) {\n"
                "        java.util.Map<Integer,Integer> m = new java.util.HashMap<>();\n"
                "        for (int i = 0; i < nums.length; i++) {\n"
                "            int c = target - nums[i];\n"
                "            if (m.containsKey(c)) return new int[]{m.get(c), i};\n"
                "            m.put(nums[i], i);\n"
                "        }\n"
                "        return new int[]{};\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\n"
                "class Solution {\npublic:\n"
                "    vector<int> twoSum(vector<int>& nums, int target) {\n"
                "        unordered_map<int,int> m;\n"
                "        for (int i = 0; i < (int)nums.size(); i++) {\n"
                "            int c = target - nums[i];\n"
                "            if (m.count(c)) return {m[c], i};\n"
                "            m[nums[i]] = i;\n"
                "        }\n"
                "        return {};\n"
                "    }\n};"
            ),
            "go": (
                "func twoSum(nums []int, target int) []int {\n"
                "    seen := make(map[int]int)\n"
                "    for i, n := range nums {\n"
                "        if j, ok := seen[target-n]; ok {\n"
                "            return []int{j, i}\n"
                "        }\n"
                "        seen[n] = i\n"
                "    }\n"
                "    return nil\n"
                "}"
            ),
        },
        "driver_code": {
            "python": (
                "import sys, json\n"
                "_d = sys.stdin.read().strip().split('\\n')\n"
                "_nums = json.loads(_d[0])\n"
                "_target = int(_d[1])\n"
                "_r = Solution().twoSum(_nums, _target)\n"
                "print(json.dumps(sorted(_r), separators=(',',':')))"
            ),
            "javascript": (
                "const _i = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n"
                "const _r = twoSum(JSON.parse(_i[0]), parseInt(_i[1]));\n"
                "console.log(JSON.stringify(_r.sort((a,b)=>a-b)));"
            ),
            "typescript": (
                "const _i = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n"
                "const _r = twoSum(JSON.parse(_i[0]), parseInt(_i[1]));\n"
                "console.log(JSON.stringify(_r.sort((a,b)=>a-b)));"
            ),
            "java": (
                "class Main {\n"
                + _JAVA_PARSE_ARR
                + _JAVA_FMT_ARR
                + "    public static void main(String[] a) throws Exception {\n"
                "        java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));\n"
                "        int[] nums = _pa(br.readLine());\n"
                "        int target = Integer.parseInt(br.readLine().trim());\n"
                "        int[] r = new Solution().twoSum(nums, target);\n"
                "        java.util.Arrays.sort(r);\n"
                "        System.out.println(_fa(r));\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <iostream>\n#include <sstream>\n#include <algorithm>\n"
                + _CPP_PARSE_ARR
                + "int main(){\n"
                "    std::string l; std::getline(std::cin,l);\n"
                "    auto nums=_pa(l); int t; std::cin>>t;\n"
                "    Solution sol; auto r=sol.twoSum(nums,t);\n"
                "    std::sort(r.begin(),r.end());\n"
                "    std::cout<<\"[\";\n"
                "    for(int i=0;i<(int)r.size();i++){if(i)std::cout<<\",\";std::cout<<r[i];}\n"
                "    std::cout<<\"]\"<<std::endl;\n"
                "}"
            ),
            "go": (
                "package main\n"
                "import (\n"
                "    \"bufio\"\n"
                "    \"encoding/json\"\n"
                "    \"fmt\"\n"
                "    \"os\"\n"
                "    \"sort\"\n"
                "    \"strconv\"\n"
                "    \"strings\"\n"
                ")\n"
                "// USER_CODE_HERE\n"
                "func main() {\n"
                "    sc := bufio.NewScanner(os.Stdin)\n"
                "    sc.Buffer(make([]byte,1<<20),1<<20)\n"
                "    sc.Scan(); var nums []int\n"
                "    json.Unmarshal([]byte(sc.Text()), &nums)\n"
                "    sc.Scan()\n"
                "    t, _ := strconv.Atoi(strings.TrimSpace(sc.Text()))\n"
                "    r := twoSum(nums, t)\n"
                "    sort.Ints(r)\n"
                "    o, _ := json.Marshal(r)\n"
                "    fmt.Println(string(o))\n"
                "}"
            ),
        },
        "hints": [
            "Think about what value you need for each element to reach the target.",
            "Can you store previously seen numbers for O(1) lookup?",
            "Use a hash map: store each number's index, check if complement exists.",
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(n)",
        "time_limit_ms": 2000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "[2,7,11,15]\n9", "expected_output": "[0,1]", "is_sample": True, "sort_order": 1},
            {"input": "[3,2,4]\n6", "expected_output": "[1,2]", "is_sample": True, "sort_order": 2},
            {"input": "[3,3]\n6", "expected_output": "[0,1]", "is_sample": True, "sort_order": 3},
            {"input": "[1,5,8,3]\n4", "expected_output": "[0,3]", "is_sample": False, "sort_order": 4},
            {"input": "[-1,-2,-3,-4,-5]\n-8", "expected_output": "[2,4]", "is_sample": False, "sort_order": 5},
            {"input": "[0,4,3,0]\n0", "expected_output": "[0,3]", "is_sample": False, "sort_order": 6},
            {"input": "[1,2]\n3", "expected_output": "[0,1]", "is_sample": False, "sort_order": 7},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem 2: Valid Parentheses
# ───────────────────────────────────────────────────────────────────


def _valid_parentheses() -> dict:
    return {
        "title": "Valid Parentheses",
        "slug": "valid-parentheses",
        "topic_slug": "stacks",
        "difficulty": "easy",
        "description": (
            "Given a string `s` containing just the characters `'('`, `')'`, "
            "`'{'`, `'}'`, `'['` and `']'`, determine if the input string is "
            "valid.\n\n"
            "An input string is valid if:\n"
            "1. Open brackets must be closed by the same type of brackets.\n"
            "2. Open brackets must be closed in the correct order.\n"
            "3. Every close bracket has a corresponding open bracket of the "
            "same type."
        ),
        "constraints": [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'.",
        ],
        "examples": [
            {"input": 's = "()"', "output": "true"},
            {"input": 's = "()[]{}"', "output": "true"},
            {"input": 's = "(]"', "output": "false",
             "explanation": "Opening '(' does not match closing ']'."},
        ],
        "starter_code": {
            "python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass",
            "javascript": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n\n}",
            "typescript": "function isValid(s: string): boolean {\n\n}",
            "java": "class Solution {\n    public boolean isValid(String s) {\n\n    }\n}",
            "cpp": "#include <string>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n\n    }\n};",
            "go": "func isValid(s string) bool {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def isValid(self, s: str) -> bool:\n"
                "        stack = []\n"
                "        m = {')':'(', '}':'{', ']':'['}\n"
                "        for c in s:\n"
                "            if c in m:\n"
                "                if not stack or stack[-1] != m[c]: return False\n"
                "                stack.pop()\n"
                "            else: stack.append(c)\n"
                "        return len(stack) == 0"
            ),
            "javascript": (
                "function isValid(s) {\n"
                "    const st=[], m={')':'(','}':'{',']':'['};\n"
                "    for (const c of s) {\n"
                "        if (m[c]) { if (!st.length||st[st.length-1]!==m[c]) return false; st.pop(); }\n"
                "        else st.push(c);\n"
                "    }\n"
                "    return st.length===0;\n"
                "}"
            ),
            "typescript": (
                "function isValid(s: string): boolean {\n"
                "    const st: string[]=[], m: Record<string,string>={')':'(','}':'{',']':'['};\n"
                "    for (const c of s) {\n"
                "        if (m[c]) { if (!st.length||st[st.length-1]!==m[c]) return false; st.pop(); }\n"
                "        else st.push(c);\n"
                "    }\n"
                "    return st.length===0;\n"
                "}"
            ),
            "java": (
                "class Solution {\n"
                "    public boolean isValid(String s) {\n"
                "        java.util.Stack<Character> st = new java.util.Stack<>();\n"
                "        for (char c : s.toCharArray()) {\n"
                "            if (c=='(') st.push(')');\n"
                "            else if (c=='{') st.push('}');\n"
                "            else if (c=='[') st.push(']');\n"
                "            else if (st.isEmpty()||st.pop()!=c) return false;\n"
                "        }\n"
                "        return st.isEmpty();\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <string>\n#include <stack>\nusing namespace std;\n\n"
                "class Solution {\npublic:\n"
                "    bool isValid(string s) {\n"
                "        stack<char> st;\n"
                "        for (char c : s) {\n"
                "            if (c=='(') st.push(')');\n"
                "            else if (c=='{') st.push('}');\n"
                "            else if (c=='[') st.push(']');\n"
                "            else if (st.empty()||st.top()!=c) return false;\n"
                "            else st.pop();\n"
                "        }\n"
                "        return st.empty();\n"
                "    }\n};"
            ),
            "go": (
                "func isValid(s string) bool {\n"
                "    st := []rune{}\n"
                "    m := map[rune]rune{')':'(','}':'{',']':'['}\n"
                "    for _, c := range s {\n"
                "        if o, ok := m[c]; ok {\n"
                "            if len(st)==0 || st[len(st)-1]!=o { return false }\n"
                "            st = st[:len(st)-1]\n"
                "        } else { st = append(st, c) }\n"
                "    }\n"
                "    return len(st)==0\n"
                "}"
            ),
        },
        "driver_code": {
            "python": (
                "import sys\n"
                "_s = sys.stdin.read().strip()\n"
                "print('true' if Solution().isValid(_s) else 'false')"
            ),
            "javascript": (
                "const _s=require('fs').readFileSync('/dev/stdin','utf8').trim();\n"
                "console.log(isValid(_s)?'true':'false');"
            ),
            "typescript": (
                "const _s=require('fs').readFileSync('/dev/stdin','utf8').trim();\n"
                "console.log(isValid(_s)?'true':'false');"
            ),
            "java": (
                "class Main {\n"
                "    public static void main(String[] a) throws Exception {\n"
                "        String s = new java.io.BufferedReader(new java.io.InputStreamReader(System.in)).readLine().trim();\n"
                "        System.out.println(new Solution().isValid(s)?\"true\":\"false\");\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <iostream>\n"
                "int main(){\n"
                "    std::string s; std::getline(std::cin,s);\n"
                "    Solution sol;\n"
                "    std::cout<<(sol.isValid(s)?\"true\":\"false\")<<std::endl;\n"
                "}"
            ),
            "go": (
                "package main\n"
                "import (\"bufio\";\"fmt\";\"os\")\n"
                "// USER_CODE_HERE\n"
                "func main() {\n"
                "    sc := bufio.NewScanner(os.Stdin)\n"
                "    sc.Scan()\n"
                "    if isValid(sc.Text()) { fmt.Println(\"true\") } else { fmt.Println(\"false\") }\n"
                "}"
            ),
        },
        "hints": [
            "What data structure follows Last-In-First-Out ordering?",
            "Push opening brackets onto a stack; when you see a closing bracket, check the top.",
            "After processing the string, the stack should be empty for valid input.",
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(n)",
        "time_limit_ms": 2000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "()", "expected_output": "true", "is_sample": True, "sort_order": 1},
            {"input": "()[]{}", "expected_output": "true", "is_sample": True, "sort_order": 2},
            {"input": "(]", "expected_output": "false", "is_sample": True, "sort_order": 3},
            {"input": "([)]", "expected_output": "false", "is_sample": False, "sort_order": 4},
            {"input": "{[]}", "expected_output": "true", "is_sample": False, "sort_order": 5},
            {"input": "(", "expected_output": "false", "is_sample": False, "sort_order": 6},
            {"input": "((()))", "expected_output": "true", "is_sample": False, "sort_order": 7},
            {"input": "]", "expected_output": "false", "is_sample": False, "sort_order": 8},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem 3: Best Time to Buy and Sell Stock
# ───────────────────────────────────────────────────────────────────


def _buy_sell_stock() -> dict:
    _py_driver = (
        "import sys, json\n"
        "_p = json.loads(sys.stdin.read().strip())\n"
        "print(Solution().maxProfit(_p))"
    )
    _js_driver = (
        "const _p=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\n"
        "console.log(maxProfit(_p));"
    )
    _java_driver = (
        "class Main {\n"
        + _JAVA_PARSE_ARR
        + "    public static void main(String[] a) throws Exception {\n"
        "        int[] p = _pa(new java.io.BufferedReader(new java.io.InputStreamReader(System.in)).readLine());\n"
        "        System.out.println(new Solution().maxProfit(p));\n"
        "    }\n"
        "}"
    )
    _cpp_driver = (
        "#include <iostream>\n#include <sstream>\n"
        + _CPP_PARSE_ARR
        + "int main(){\n"
        "    std::string l; std::getline(std::cin,l);\n"
        "    auto p=_pa(l); Solution sol;\n"
        "    std::cout<<sol.maxProfit(p)<<std::endl;\n"
        "}"
    )
    _go_driver = (
        "package main\n"
        "import (\"bufio\";\"encoding/json\";\"fmt\";\"os\")\n"
        "// USER_CODE_HERE\n"
        "func main() {\n"
        "    sc := bufio.NewScanner(os.Stdin)\n"
        "    sc.Buffer(make([]byte,1<<20),1<<20)\n"
        "    sc.Scan()\n"
        "    var p []int\n"
        "    json.Unmarshal([]byte(sc.Text()), &p)\n"
        "    fmt.Println(maxProfit(p))\n"
        "}"
    )
    return {
        "title": "Best Time to Buy and Sell Stock",
        "slug": "best-time-to-buy-and-sell-stock",
        "topic_slug": "arrays",
        "difficulty": "easy",
        "description": (
            "You are given an array `prices` where `prices[i]` is the price "
            "of a given stock on the i-th day.\n\n"
            "You want to maximize your profit by choosing a **single day** "
            "to buy one stock and choosing a **different day in the future** "
            "to sell that stock.\n\n"
            "Return the maximum profit you can achieve from this transaction. "
            "If you cannot achieve any profit, return `0`."
        ),
        "constraints": [
            "1 <= prices.length <= 10^5",
            "0 <= prices[i] <= 10^4",
        ],
        "examples": [
            {"input": "prices = [7,1,5,3,6,4]", "output": "5",
             "explanation": "Buy on day 2 (price=1), sell on day 5 (price=6), profit=5."},
            {"input": "prices = [7,6,4,3,1]", "output": "0",
             "explanation": "No profitable transaction possible."},
        ],
        "starter_code": {
            "python": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass",
            "javascript": "/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n\n}",
            "typescript": "function maxProfit(prices: number[]): number {\n\n}",
            "java": "class Solution {\n    public int maxProfit(int[] prices) {\n\n    }\n}",
            "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n\n    }\n};",
            "go": "func maxProfit(prices []int) int {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def maxProfit(self, prices: list[int]) -> int:\n"
                "        mn, mx = prices[0], 0\n"
                "        for p in prices[1:]:\n"
                "            mx = max(mx, p - mn)\n"
                "            mn = min(mn, p)\n"
                "        return mx"
            ),
            "javascript": (
                "function maxProfit(prices) {\n"
                "    let mn=prices[0], mx=0;\n"
                "    for (let i=1;i<prices.length;i++) {\n"
                "        mx=Math.max(mx,prices[i]-mn);\n"
                "        mn=Math.min(mn,prices[i]);\n"
                "    }\n"
                "    return mx;\n"
                "}"
            ),
            "typescript": (
                "function maxProfit(prices: number[]): number {\n"
                "    let mn=prices[0], mx=0;\n"
                "    for (let i=1;i<prices.length;i++) {\n"
                "        mx=Math.max(mx,prices[i]-mn);\n"
                "        mn=Math.min(mn,prices[i]);\n"
                "    }\n"
                "    return mx;\n"
                "}"
            ),
            "java": (
                "class Solution {\n"
                "    public int maxProfit(int[] prices) {\n"
                "        int mn=prices[0], mx=0;\n"
                "        for (int i=1;i<prices.length;i++) {\n"
                "            mx=Math.max(mx,prices[i]-mn);\n"
                "            mn=Math.min(mn,prices[i]);\n"
                "        }\n"
                "        return mx;\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <vector>\n#include <algorithm>\nusing namespace std;\n\n"
                "class Solution {\npublic:\n"
                "    int maxProfit(vector<int>& prices) {\n"
                "        int mn=prices[0], mx=0;\n"
                "        for (int i=1;i<(int)prices.size();i++) {\n"
                "            mx=max(mx,prices[i]-mn);\n"
                "            mn=min(mn,prices[i]);\n"
                "        }\n"
                "        return mx;\n"
                "    }\n};"
            ),
            "go": (
                "func maxProfit(prices []int) int {\n"
                "    mn, mx := prices[0], 0\n"
                "    for _, p := range prices[1:] {\n"
                "        if p-mn > mx { mx = p - mn }\n"
                "        if p < mn { mn = p }\n"
                "    }\n"
                "    return mx\n"
                "}"
            ),
        },
        "driver_code": {
            "python": _py_driver,
            "javascript": _js_driver,
            "typescript": _js_driver,
            "java": _java_driver,
            "cpp": _cpp_driver,
            "go": _go_driver,
        },
        "hints": [
            "Track the minimum price seen so far as you iterate.",
            "At each step, calculate the profit if you sold today.",
            "Keep a running maximum of that profit.",
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(1)",
        "time_limit_ms": 2000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "[7,1,5,3,6,4]", "expected_output": "5", "is_sample": True, "sort_order": 1},
            {"input": "[7,6,4,3,1]", "expected_output": "0", "is_sample": True, "sort_order": 2},
            {"input": "[2,4,1]", "expected_output": "2", "is_sample": True, "sort_order": 3},
            {"input": "[1]", "expected_output": "0", "is_sample": False, "sort_order": 4},
            {"input": "[1,2]", "expected_output": "1", "is_sample": False, "sort_order": 5},
            {"input": "[2,1,2,0,1]", "expected_output": "1", "is_sample": False, "sort_order": 6},
            {"input": "[3,3,5,0,0,3,1,4]", "expected_output": "4", "is_sample": False, "sort_order": 7},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem 4: Contains Duplicate
# ───────────────────────────────────────────────────────────────────


def _contains_duplicate() -> dict:
    _py_driver = (
        "import sys, json\n"
        "_a = json.loads(sys.stdin.read().strip())\n"
        "print('true' if Solution().containsDuplicate(_a) else 'false')"
    )
    _js_driver = (
        "const _a=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\n"
        "console.log(containsDuplicate(_a)?'true':'false');"
    )
    _java_driver = (
        "class Main {\n"
        + _JAVA_PARSE_ARR
        + "    public static void main(String[] a) throws Exception {\n"
        "        int[] arr = _pa(new java.io.BufferedReader(new java.io.InputStreamReader(System.in)).readLine());\n"
        "        System.out.println(new Solution().containsDuplicate(arr)?\"true\":\"false\");\n"
        "    }\n"
        "}"
    )
    _cpp_driver = (
        "#include <iostream>\n#include <sstream>\n"
        + _CPP_PARSE_ARR
        + "int main(){\n"
        "    std::string l; std::getline(std::cin,l);\n"
        "    auto a=_pa(l); Solution sol;\n"
        "    std::cout<<(sol.containsDuplicate(a)?\"true\":\"false\")<<std::endl;\n"
        "}"
    )
    _go_driver = (
        "package main\n"
        "import (\"bufio\";\"encoding/json\";\"fmt\";\"os\")\n"
        "// USER_CODE_HERE\n"
        "func main() {\n"
        "    sc := bufio.NewScanner(os.Stdin)\n"
        "    sc.Buffer(make([]byte,1<<20),1<<20)\n"
        "    sc.Scan()\n"
        "    var a []int\n"
        "    json.Unmarshal([]byte(sc.Text()), &a)\n"
        "    if containsDuplicate(a) { fmt.Println(\"true\") } else { fmt.Println(\"false\") }\n"
        "}"
    )
    return {
        "title": "Contains Duplicate",
        "slug": "contains-duplicate",
        "topic_slug": "hash-maps",
        "difficulty": "easy",
        "description": (
            "Given an integer array `nums`, return `true` if any value "
            "appears **at least twice** in the array, and return `false` if "
            "every element is distinct."
        ),
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^9 <= nums[i] <= 10^9",
        ],
        "examples": [
            {"input": "nums = [1,2,3,1]", "output": "true",
             "explanation": "The value 1 appears at indices 0 and 3."},
            {"input": "nums = [1,2,3,4]", "output": "false"},
            {"input": "nums = [1,1,1,3,3,4,3,2,4,2]", "output": "true"},
        ],
        "starter_code": {
            "python": "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        pass",
            "javascript": "/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction containsDuplicate(nums) {\n\n}",
            "typescript": "function containsDuplicate(nums: number[]): boolean {\n\n}",
            "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n\n    }\n}",
            "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n\n    }\n};",
            "go": "func containsDuplicate(nums []int) bool {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def containsDuplicate(self, nums: list[int]) -> bool:\n"
                "        return len(nums) != len(set(nums))"
            ),
            "javascript": (
                "function containsDuplicate(nums) {\n"
                "    return new Set(nums).size !== nums.length;\n"
                "}"
            ),
            "typescript": (
                "function containsDuplicate(nums: number[]): boolean {\n"
                "    return new Set(nums).size !== nums.length;\n"
                "}"
            ),
            "java": (
                "class Solution {\n"
                "    public boolean containsDuplicate(int[] nums) {\n"
                "        java.util.Set<Integer> s = new java.util.HashSet<>();\n"
                "        for (int n : nums) { if (!s.add(n)) return true; }\n"
                "        return false;\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <vector>\n#include <unordered_set>\nusing namespace std;\n\n"
                "class Solution {\npublic:\n"
                "    bool containsDuplicate(vector<int>& nums) {\n"
                "        return unordered_set<int>(nums.begin(),nums.end()).size()!=nums.size();\n"
                "    }\n};"
            ),
            "go": (
                "func containsDuplicate(nums []int) bool {\n"
                "    s := make(map[int]bool)\n"
                "    for _, n := range nums {\n"
                "        if s[n] { return true }\n"
                "        s[n] = true\n"
                "    }\n"
                "    return false\n"
                "}"
            ),
        },
        "driver_code": {
            "python": _py_driver,
            "javascript": _js_driver,
            "typescript": _js_driver,
            "java": _java_driver,
            "cpp": _cpp_driver,
            "go": _go_driver,
        },
        "hints": [
            "What data structure can tell you if an element was already seen?",
            "A set stores only unique elements — compare its size to the array size.",
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(n)",
        "time_limit_ms": 2000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "[1,2,3,1]", "expected_output": "true", "is_sample": True, "sort_order": 1},
            {"input": "[1,2,3,4]", "expected_output": "false", "is_sample": True, "sort_order": 2},
            {"input": "[1,1,1,3,3,4,3,2,4,2]", "expected_output": "true", "is_sample": True, "sort_order": 3},
            {"input": "[1]", "expected_output": "false", "is_sample": False, "sort_order": 4},
            {"input": "[0,0]", "expected_output": "true", "is_sample": False, "sort_order": 5},
            {"input": "[-1,0,1,-1]", "expected_output": "true", "is_sample": False, "sort_order": 6},
            {"input": "[1000000000,-1000000000]", "expected_output": "false", "is_sample": False, "sort_order": 7},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem 5: Climbing Stairs
# ───────────────────────────────────────────────────────────────────


def _climbing_stairs() -> dict:
    _py_driver = (
        "import sys\n"
        "_n = int(sys.stdin.read().strip())\n"
        "print(Solution().climbStairs(_n))"
    )
    _js_driver = (
        "const _n=parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());\n"
        "console.log(climbStairs(_n));"
    )
    _java_driver = (
        "class Main {\n"
        "    public static void main(String[] a) throws Exception {\n"
        "        int n = Integer.parseInt(new java.io.BufferedReader(new java.io.InputStreamReader(System.in)).readLine().trim());\n"
        "        System.out.println(new Solution().climbStairs(n));\n"
        "    }\n"
        "}"
    )
    _cpp_driver = (
        "#include <iostream>\n"
        "int main(){ int n; std::cin>>n; Solution s; std::cout<<s.climbStairs(n)<<std::endl; }"
    )
    _go_driver = (
        "package main\n"
        "import (\"bufio\";\"fmt\";\"os\";\"strconv\";\"strings\")\n"
        "// USER_CODE_HERE\n"
        "func main() {\n"
        "    sc := bufio.NewScanner(os.Stdin)\n"
        "    sc.Scan()\n"
        "    n, _ := strconv.Atoi(strings.TrimSpace(sc.Text()))\n"
        "    fmt.Println(climbStairs(n))\n"
        "}"
    )
    return {
        "title": "Climbing Stairs",
        "slug": "climbing-stairs",
        "topic_slug": "dynamic-programming",
        "difficulty": "easy",
        "description": (
            "You are climbing a staircase. It takes `n` steps to reach the "
            "top.\n\n"
            "Each time you can either climb **1** or **2** steps. In how "
            "many distinct ways can you climb to the top?"
        ),
        "constraints": [
            "1 <= n <= 45",
        ],
        "examples": [
            {"input": "n = 2", "output": "2",
             "explanation": "Two ways: 1+1 or 2."},
            {"input": "n = 3", "output": "3",
             "explanation": "Three ways: 1+1+1, 1+2, 2+1."},
        ],
        "starter_code": {
            "python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
            "javascript": "/**\n * @param {number} n\n * @return {number}\n */\nfunction climbStairs(n) {\n\n}",
            "typescript": "function climbStairs(n: number): number {\n\n}",
            "java": "class Solution {\n    public int climbStairs(int n) {\n\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n\n    }\n};",
            "go": "func climbStairs(n int) int {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def climbStairs(self, n: int) -> int:\n"
                "        if n <= 2: return n\n"
                "        a, b = 1, 2\n"
                "        for _ in range(3, n + 1):\n"
                "            a, b = b, a + b\n"
                "        return b"
            ),
            "javascript": (
                "function climbStairs(n) {\n"
                "    if (n<=2) return n;\n"
                "    let a=1, b=2;\n"
                "    for (let i=3;i<=n;i++) [a,b]=[b,a+b];\n"
                "    return b;\n"
                "}"
            ),
            "typescript": (
                "function climbStairs(n: number): number {\n"
                "    if (n<=2) return n;\n"
                "    let a=1, b=2;\n"
                "    for (let i=3;i<=n;i++) [a,b]=[b,a+b];\n"
                "    return b;\n"
                "}"
            ),
            "java": (
                "class Solution {\n"
                "    public int climbStairs(int n) {\n"
                "        if (n<=2) return n;\n"
                "        int a=1, b=2;\n"
                "        for (int i=3;i<=n;i++){int t=a+b;a=b;b=t;}\n"
                "        return b;\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "class Solution {\npublic:\n"
                "    int climbStairs(int n) {\n"
                "        if (n<=2) return n;\n"
                "        int a=1, b=2;\n"
                "        for (int i=3;i<=n;i++){int t=a+b;a=b;b=t;}\n"
                "        return b;\n"
                "    }\n};"
            ),
            "go": (
                "func climbStairs(n int) int {\n"
                "    if n <= 2 { return n }\n"
                "    a, b := 1, 2\n"
                "    for i := 3; i <= n; i++ {\n"
                "        a, b = b, a+b\n"
                "    }\n"
                "    return b\n"
                "}"
            ),
        },
        "driver_code": {
            "python": _py_driver,
            "javascript": _js_driver,
            "typescript": _js_driver,
            "java": _java_driver,
            "cpp": _cpp_driver,
            "go": _go_driver,
        },
        "hints": [
            "The number of ways to reach step n depends on step n-1 and n-2.",
            "This is the Fibonacci sequence! f(n) = f(n-1) + f(n-2).",
            "You only need two variables — no need for an array.",
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(1)",
        "time_limit_ms": 1000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "2", "expected_output": "2", "is_sample": True, "sort_order": 1},
            {"input": "3", "expected_output": "3", "is_sample": True, "sort_order": 2},
            {"input": "1", "expected_output": "1", "is_sample": True, "sort_order": 3},
            {"input": "5", "expected_output": "8", "is_sample": False, "sort_order": 4},
            {"input": "10", "expected_output": "89", "is_sample": False, "sort_order": 5},
            {"input": "20", "expected_output": "10946", "is_sample": False, "sort_order": 6},
            {"input": "45", "expected_output": "1836311903", "is_sample": False, "sort_order": 7},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem 6: Maximum Subarray
# ───────────────────────────────────────────────────────────────────


def _maximum_subarray() -> dict:
    _py_driver = (
        "import sys, json\n"
        "_a = json.loads(sys.stdin.read().strip())\n"
        "print(Solution().maxSubArray(_a))"
    )
    _js_driver = (
        "const _a=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\n"
        "console.log(maxSubArray(_a));"
    )
    _java_driver = (
        "class Main {\n"
        + _JAVA_PARSE_ARR
        + "    public static void main(String[] a) throws Exception {\n"
        "        int[] arr = _pa(new java.io.BufferedReader(new java.io.InputStreamReader(System.in)).readLine());\n"
        "        System.out.println(new Solution().maxSubArray(arr));\n"
        "    }\n"
        "}"
    )
    _cpp_driver = (
        "#include <iostream>\n#include <sstream>\n"
        + _CPP_PARSE_ARR
        + "int main(){\n"
        "    std::string l; std::getline(std::cin,l);\n"
        "    auto a=_pa(l); Solution sol;\n"
        "    std::cout<<sol.maxSubArray(a)<<std::endl;\n"
        "}"
    )
    _go_driver = (
        "package main\n"
        "import (\"bufio\";\"encoding/json\";\"fmt\";\"os\")\n"
        "// USER_CODE_HERE\n"
        "func main() {\n"
        "    sc := bufio.NewScanner(os.Stdin)\n"
        "    sc.Buffer(make([]byte,1<<20),1<<20)\n"
        "    sc.Scan()\n"
        "    var a []int\n"
        "    json.Unmarshal([]byte(sc.Text()), &a)\n"
        "    fmt.Println(maxSubArray(a))\n"
        "}"
    )
    return {
        "title": "Maximum Subarray",
        "slug": "maximum-subarray",
        "topic_slug": "arrays",
        "difficulty": "medium",
        "description": (
            "Given an integer array `nums`, find the subarray with the "
            "largest sum, and return its sum.\n\n"
            "A **subarray** is a contiguous non-empty sequence of elements "
            "within an array."
        ),
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4",
        ],
        "examples": [
            {"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6",
             "explanation": "The subarray [4,-1,2,1] has the largest sum 6."},
            {"input": "nums = [1]", "output": "1"},
            {"input": "nums = [5,4,-1,7,8]", "output": "23"},
        ],
        "starter_code": {
            "python": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        pass",
            "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n\n}",
            "typescript": "function maxSubArray(nums: number[]): number {\n\n}",
            "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n\n    }\n}",
            "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n\n    }\n};",
            "go": "func maxSubArray(nums []int) int {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def maxSubArray(self, nums: list[int]) -> int:\n"
                "        cur = mx = nums[0]\n"
                "        for n in nums[1:]:\n"
                "            cur = max(n, cur + n)\n"
                "            mx = max(mx, cur)\n"
                "        return mx"
            ),
            "javascript": (
                "function maxSubArray(nums) {\n"
                "    let cur=nums[0], mx=nums[0];\n"
                "    for (let i=1;i<nums.length;i++) {\n"
                "        cur=Math.max(nums[i],cur+nums[i]);\n"
                "        mx=Math.max(mx,cur);\n"
                "    }\n"
                "    return mx;\n"
                "}"
            ),
            "typescript": (
                "function maxSubArray(nums: number[]): number {\n"
                "    let cur=nums[0], mx=nums[0];\n"
                "    for (let i=1;i<nums.length;i++) {\n"
                "        cur=Math.max(nums[i],cur+nums[i]);\n"
                "        mx=Math.max(mx,cur);\n"
                "    }\n"
                "    return mx;\n"
                "}"
            ),
            "java": (
                "class Solution {\n"
                "    public int maxSubArray(int[] nums) {\n"
                "        int cur=nums[0], mx=nums[0];\n"
                "        for (int i=1;i<nums.length;i++) {\n"
                "            cur=Math.max(nums[i],cur+nums[i]);\n"
                "            mx=Math.max(mx,cur);\n"
                "        }\n"
                "        return mx;\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <vector>\n#include <algorithm>\nusing namespace std;\n\n"
                "class Solution {\npublic:\n"
                "    int maxSubArray(vector<int>& nums) {\n"
                "        int cur=nums[0], mx=nums[0];\n"
                "        for (int i=1;i<(int)nums.size();i++) {\n"
                "            cur=max(nums[i],cur+nums[i]);\n"
                "            mx=max(mx,cur);\n"
                "        }\n"
                "        return mx;\n"
                "    }\n};"
            ),
            "go": (
                "func maxSubArray(nums []int) int {\n"
                "    cur, mx := nums[0], nums[0]\n"
                "    for _, n := range nums[1:] {\n"
                "        if cur+n > n { cur = cur + n } else { cur = n }\n"
                "        if cur > mx { mx = cur }\n"
                "    }\n"
                "    return mx\n"
                "}"
            ),
        },
        "driver_code": {
            "python": _py_driver,
            "javascript": _js_driver,
            "typescript": _js_driver,
            "java": _java_driver,
            "cpp": _cpp_driver,
            "go": _go_driver,
        },
        "hints": [
            "Consider Kadane's algorithm: at each index decide whether to extend or start fresh.",
            "cur_sum = max(nums[i], cur_sum + nums[i]) — which is better?",
            "Track the global maximum alongside the current subarray sum.",
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(1)",
        "time_limit_ms": 2000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "[-2,1,-3,4,-1,2,1,-5,4]", "expected_output": "6", "is_sample": True, "sort_order": 1},
            {"input": "[1]", "expected_output": "1", "is_sample": True, "sort_order": 2},
            {"input": "[5,4,-1,7,8]", "expected_output": "23", "is_sample": True, "sort_order": 3},
            {"input": "[-1]", "expected_output": "-1", "is_sample": False, "sort_order": 4},
            {"input": "[-2,-1]", "expected_output": "-1", "is_sample": False, "sort_order": 5},
            {"input": "[1,2,3,4,5]", "expected_output": "15", "is_sample": False, "sort_order": 6},
            {"input": "[-1,0,-2]", "expected_output": "0", "is_sample": False, "sort_order": 7},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem 7: Longest Substring Without Repeating Characters
# ───────────────────────────────────────────────────────────────────


def _longest_substring() -> dict:
    _py_driver = (
        "import sys\n"
        "_s = sys.stdin.read().strip()\n"
        "print(Solution().lengthOfLongestSubstring(_s))"
    )
    _js_driver = (
        "const _s=require('fs').readFileSync('/dev/stdin','utf8').trim();\n"
        "console.log(lengthOfLongestSubstring(_s));"
    )
    _java_driver = (
        "class Main {\n"
        "    public static void main(String[] a) throws Exception {\n"
        "        String s = new java.io.BufferedReader(new java.io.InputStreamReader(System.in)).readLine();\n"
        "        if (s == null) s = \"\";\n"
        "        System.out.println(new Solution().lengthOfLongestSubstring(s.trim()));\n"
        "    }\n"
        "}"
    )
    _cpp_driver = (
        "#include <iostream>\n"
        "int main(){\n"
        "    std::string s; std::getline(std::cin,s);\n"
        "    Solution sol;\n"
        "    std::cout<<sol.lengthOfLongestSubstring(s)<<std::endl;\n"
        "}"
    )
    _go_driver = (
        "package main\n"
        "import (\"bufio\";\"fmt\";\"os\")\n"
        "// USER_CODE_HERE\n"
        "func main() {\n"
        "    sc := bufio.NewScanner(os.Stdin)\n"
        "    sc.Scan()\n"
        "    fmt.Println(lengthOfLongestSubstring(sc.Text()))\n"
        "}"
    )
    return {
        "title": "Longest Substring Without Repeating Characters",
        "slug": "longest-substring-without-repeating-characters",
        "topic_slug": "sliding-window",
        "difficulty": "medium",
        "description": (
            "Given a string `s`, find the length of the **longest substring** "
            "without repeating characters.\n\n"
            "A **substring** is a contiguous non-empty sequence of characters "
            "within a string."
        ),
        "constraints": [
            "0 <= s.length <= 5 * 10^4",
            "s consists of English letters, digits, symbols, and spaces.",
        ],
        "examples": [
            {"input": 's = "abcabcbb"', "output": "3",
             "explanation": 'The longest substring is "abc" with length 3.'},
            {"input": 's = "bbbbb"', "output": "1",
             "explanation": 'The longest substring is "b" with length 1.'},
            {"input": 's = "pwwkew"', "output": "3",
             "explanation": 'The longest substring is "wke" with length 3.'},
        ],
        "starter_code": {
            "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
            "javascript": "/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n\n}",
            "typescript": "function lengthOfLongestSubstring(s: string): number {\n\n}",
            "java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n\n    }\n}",
            "cpp": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n\n    }\n};",
            "go": "func lengthOfLongestSubstring(s string) int {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def lengthOfLongestSubstring(self, s: str) -> int:\n"
                "        seen = {}\n"
                "        l = mx = 0\n"
                "        for r, c in enumerate(s):\n"
                "            if c in seen and seen[c] >= l:\n"
                "                l = seen[c] + 1\n"
                "            seen[c] = r\n"
                "            mx = max(mx, r - l + 1)\n"
                "        return mx"
            ),
            "javascript": (
                "function lengthOfLongestSubstring(s) {\n"
                "    const m = new Map();\n"
                "    let l=0, mx=0;\n"
                "    for (let r=0;r<s.length;r++) {\n"
                "        if (m.has(s[r])&&m.get(s[r])>=l) l=m.get(s[r])+1;\n"
                "        m.set(s[r],r);\n"
                "        mx=Math.max(mx,r-l+1);\n"
                "    }\n"
                "    return mx;\n"
                "}"
            ),
            "typescript": (
                "function lengthOfLongestSubstring(s: string): number {\n"
                "    const m = new Map<string,number>();\n"
                "    let l=0, mx=0;\n"
                "    for (let r=0;r<s.length;r++) {\n"
                "        if (m.has(s[r])&&m.get(s[r])!>=l) l=m.get(s[r])!+1;\n"
                "        m.set(s[r],r);\n"
                "        mx=Math.max(mx,r-l+1);\n"
                "    }\n"
                "    return mx;\n"
                "}"
            ),
            "java": (
                "class Solution {\n"
                "    public int lengthOfLongestSubstring(String s) {\n"
                "        java.util.Map<Character,Integer> m = new java.util.HashMap<>();\n"
                "        int l=0, mx=0;\n"
                "        for (int r=0;r<s.length();r++) {\n"
                "            char c = s.charAt(r);\n"
                "            if (m.containsKey(c)&&m.get(c)>=l) l=m.get(c)+1;\n"
                "            m.put(c,r);\n"
                "            mx=Math.max(mx,r-l+1);\n"
                "        }\n"
                "        return mx;\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <string>\n#include <unordered_map>\nusing namespace std;\n\n"
                "class Solution {\npublic:\n"
                "    int lengthOfLongestSubstring(string s) {\n"
                "        unordered_map<char,int> m;\n"
                "        int l=0, mx=0;\n"
                "        for (int r=0;r<(int)s.size();r++) {\n"
                "            if (m.count(s[r])&&m[s[r]]>=l) l=m[s[r]]+1;\n"
                "            m[s[r]]=r;\n"
                "            mx=max(mx,r-l+1);\n"
                "        }\n"
                "        return mx;\n"
                "    }\n};"
            ),
            "go": (
                "func lengthOfLongestSubstring(s string) int {\n"
                "    m := make(map[byte]int)\n"
                "    l, mx := 0, 0\n"
                "    for r := 0; r < len(s); r++ {\n"
                "        if idx, ok := m[s[r]]; ok && idx >= l {\n"
                "            l = idx + 1\n"
                "        }\n"
                "        m[s[r]] = r\n"
                "        if r-l+1 > mx { mx = r - l + 1 }\n"
                "    }\n"
                "    return mx\n"
                "}"
            ),
        },
        "driver_code": {
            "python": _py_driver,
            "javascript": _js_driver,
            "typescript": _js_driver,
            "java": _java_driver,
            "cpp": _cpp_driver,
            "go": _go_driver,
        },
        "hints": [
            "Use a sliding window — expand the right pointer, shrink the left when you see a duplicate.",
            "A hash map can track the last index where each character appeared.",
            "When you find a duplicate, move the left pointer to one past the duplicate's last position.",
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(min(n, m))",
        "time_limit_ms": 2000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "abcabcbb", "expected_output": "3", "is_sample": True, "sort_order": 1},
            {"input": "bbbbb", "expected_output": "1", "is_sample": True, "sort_order": 2},
            {"input": "pwwkew", "expected_output": "3", "is_sample": True, "sort_order": 3},
            {"input": "", "expected_output": "0", "is_sample": False, "sort_order": 4},
            {"input": " ", "expected_output": "1", "is_sample": False, "sort_order": 5},
            {"input": "au", "expected_output": "2", "is_sample": False, "sort_order": 6},
            {"input": "dvdf", "expected_output": "3", "is_sample": False, "sort_order": 7},
            {"input": "abba", "expected_output": "2", "is_sample": False, "sort_order": 8},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem 8: 3Sum
# ───────────────────────────────────────────────────────────────────


def _three_sum() -> dict:
    _py_driver = (
        "import sys, json\n"
        "_a = json.loads(sys.stdin.read().strip())\n"
        "_r = Solution().threeSum(_a)\n"
        "_r = sorted([sorted(t) for t in _r])\n"
        "print(json.dumps(_r, separators=(',',':')))"
    )
    _js_driver = (
        "const _a=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\n"
        "const _r=threeSum(_a);\n"
        "_r.forEach(t=>t.sort((a,b)=>a-b));\n"
        "_r.sort((a,b)=>{for(let i=0;i<a.length;i++){if(a[i]!==b[i])return a[i]-b[i];}return 0;});\n"
        "console.log(JSON.stringify(_r));"
    )
    _java_driver = (
        "class Main {\n"
        + _JAVA_PARSE_ARR
        + "    public static void main(String[] a) throws Exception {\n"
        "        int[] nums = _pa(new java.io.BufferedReader(new java.io.InputStreamReader(System.in)).readLine());\n"
        "        java.util.List<java.util.List<Integer>> r = new Solution().threeSum(nums);\n"
        "        for (java.util.List<Integer> t : r) java.util.Collections.sort(t);\n"
        "        r.sort((x,y)->{for(int i=0;i<Math.min(x.size(),y.size());i++){int c=x.get(i)-y.get(i);if(c!=0)return c;}return x.size()-y.size();});\n"
        "        StringBuilder sb = new StringBuilder(\"[\");\n"
        "        for (int i=0;i<r.size();i++) {\n"
        "            if(i>0) sb.append(\",\");\n"
        "            sb.append(\"[\");\n"
        "            for(int j=0;j<r.get(i).size();j++){if(j>0)sb.append(\",\");sb.append(r.get(i).get(j));}\n"
        "            sb.append(\"]\");\n"
        "        }\n"
        "        sb.append(\"]\");\n"
        "        System.out.println(sb.toString());\n"
        "    }\n"
        "}"
    )
    _cpp_driver = (
        "#include <iostream>\n#include <sstream>\n#include <algorithm>\n"
        + _CPP_PARSE_ARR
        + "int main(){\n"
        "    std::string l; std::getline(std::cin,l);\n"
        "    auto nums=_pa(l); Solution sol;\n"
        "    auto r=sol.threeSum(nums);\n"
        "    for(auto& v:r) std::sort(v.begin(),v.end());\n"
        "    std::sort(r.begin(),r.end());\n"
        "    std::cout<<\"[\";\n"
        "    for(int i=0;i<(int)r.size();i++){\n"
        "        if(i)std::cout<<\",\";\n"
        "        std::cout<<\"[\";\n"
        "        for(int j=0;j<(int)r[i].size();j++){if(j)std::cout<<\",\";std::cout<<r[i][j];}\n"
        "        std::cout<<\"]\";\n"
        "    }\n"
        "    std::cout<<\"]\"<<std::endl;\n"
        "}"
    )
    _go_driver = (
        "package main\n"
        "import (\"bufio\";\"encoding/json\";\"fmt\";\"os\";\"sort\")\n"
        "// USER_CODE_HERE\n"
        "func main() {\n"
        "    sc := bufio.NewScanner(os.Stdin)\n"
        "    sc.Buffer(make([]byte,1<<20),1<<20)\n"
        "    sc.Scan()\n"
        "    var nums []int\n"
        "    json.Unmarshal([]byte(sc.Text()), &nums)\n"
        "    r := threeSum(nums)\n"
        "    for _, t := range r { sort.Ints(t) }\n"
        "    sort.Slice(r, func(i,j int) bool {\n"
        "        for k:=0;k<len(r[i])&&k<len(r[j]);k++ { if r[i][k]!=r[j][k]{return r[i][k]<r[j][k]} }\n"
        "        return len(r[i])<len(r[j])\n"
        "    })\n"
        "    o, _ := json.Marshal(r)\n"
        "    fmt.Println(string(o))\n"
        "}"
    )
    return {
        "title": "3Sum",
        "slug": "3sum",
        "topic_slug": "two-pointers",
        "difficulty": "medium",
        "description": (
            "Given an integer array `nums`, return all the triplets "
            "`[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, "
            "`j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\n"
            "Notice that the solution set must not contain duplicate triplets."
        ),
        "constraints": [
            "3 <= nums.length <= 3000",
            "-10^5 <= nums[i] <= 10^5",
        ],
        "examples": [
            {"input": "nums = [-1,0,1,2,-1,-4]", "output": "[[-1,-1,2],[-1,0,1]]",
             "explanation": "The distinct triplets summing to zero."},
            {"input": "nums = [0,1,1]", "output": "[]"},
            {"input": "nums = [0,0,0]", "output": "[[0,0,0]]"},
        ],
        "starter_code": {
            "python": "class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        pass",
            "javascript": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction threeSum(nums) {\n\n}",
            "typescript": "function threeSum(nums: number[]): number[][] {\n\n}",
            "java": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n\n    }\n}",
            "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n\n    }\n};",
            "go": "func threeSum(nums []int) [][]int {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def threeSum(self, nums: list[int]) -> list[list[int]]:\n"
                "        nums.sort()\n"
                "        res = []\n"
                "        for i in range(len(nums) - 2):\n"
                "            if i > 0 and nums[i] == nums[i-1]: continue\n"
                "            l, r = i + 1, len(nums) - 1\n"
                "            while l < r:\n"
                "                s = nums[i] + nums[l] + nums[r]\n"
                "                if s < 0: l += 1\n"
                "                elif s > 0: r -= 1\n"
                "                else:\n"
                "                    res.append([nums[i], nums[l], nums[r]])\n"
                "                    while l < r and nums[l] == nums[l+1]: l += 1\n"
                "                    while l < r and nums[r] == nums[r-1]: r -= 1\n"
                "                    l += 1; r -= 1\n"
                "        return res"
            ),
            "javascript": (
                "function threeSum(nums) {\n"
                "    nums.sort((a,b)=>a-b);\n"
                "    const res=[];\n"
                "    for (let i=0;i<nums.length-2;i++) {\n"
                "        if (i>0&&nums[i]===nums[i-1]) continue;\n"
                "        let l=i+1, r=nums.length-1;\n"
                "        while (l<r) {\n"
                "            const s=nums[i]+nums[l]+nums[r];\n"
                "            if (s<0) l++;\n"
                "            else if (s>0) r--;\n"
                "            else {\n"
                "                res.push([nums[i],nums[l],nums[r]]);\n"
                "                while(l<r&&nums[l]===nums[l+1])l++;\n"
                "                while(l<r&&nums[r]===nums[r-1])r--;\n"
                "                l++;r--;\n"
                "            }\n"
                "        }\n"
                "    }\n"
                "    return res;\n"
                "}"
            ),
            "typescript": (
                "function threeSum(nums: number[]): number[][] {\n"
                "    nums.sort((a,b)=>a-b);\n"
                "    const res: number[][]=[];\n"
                "    for (let i=0;i<nums.length-2;i++) {\n"
                "        if (i>0&&nums[i]===nums[i-1]) continue;\n"
                "        let l=i+1, r=nums.length-1;\n"
                "        while (l<r) {\n"
                "            const s=nums[i]+nums[l]+nums[r];\n"
                "            if (s<0) l++;\n"
                "            else if (s>0) r--;\n"
                "            else {\n"
                "                res.push([nums[i],nums[l],nums[r]]);\n"
                "                while(l<r&&nums[l]===nums[l+1])l++;\n"
                "                while(l<r&&nums[r]===nums[r-1])r--;\n"
                "                l++;r--;\n"
                "            }\n"
                "        }\n"
                "    }\n"
                "    return res;\n"
                "}"
            ),
            "java": (
                "import java.util.*;\n\n"
                "class Solution {\n"
                "    public List<List<Integer>> threeSum(int[] nums) {\n"
                "        Arrays.sort(nums);\n"
                "        List<List<Integer>> res = new ArrayList<>();\n"
                "        for (int i=0;i<nums.length-2;i++) {\n"
                "            if (i>0&&nums[i]==nums[i-1]) continue;\n"
                "            int l=i+1, r=nums.length-1;\n"
                "            while (l<r) {\n"
                "                int s=nums[i]+nums[l]+nums[r];\n"
                "                if (s<0) l++;\n"
                "                else if (s>0) r--;\n"
                "                else {\n"
                "                    res.add(Arrays.asList(nums[i],nums[l],nums[r]));\n"
                "                    while(l<r&&nums[l]==nums[l+1])l++;\n"
                "                    while(l<r&&nums[r]==nums[r-1])r--;\n"
                "                    l++;r--;\n"
                "                }\n"
                "            }\n"
                "        }\n"
                "        return res;\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <vector>\n#include <algorithm>\nusing namespace std;\n\n"
                "class Solution {\npublic:\n"
                "    vector<vector<int>> threeSum(vector<int>& nums) {\n"
                "        sort(nums.begin(),nums.end());\n"
                "        vector<vector<int>> res;\n"
                "        for (int i=0;i<(int)nums.size()-2;i++) {\n"
                "            if (i>0&&nums[i]==nums[i-1]) continue;\n"
                "            int l=i+1, r=nums.size()-1;\n"
                "            while (l<r) {\n"
                "                int s=nums[i]+nums[l]+nums[r];\n"
                "                if (s<0) l++;\n"
                "                else if (s>0) r--;\n"
                "                else {\n"
                "                    res.push_back({nums[i],nums[l],nums[r]});\n"
                "                    while(l<r&&nums[l]==nums[l+1])l++;\n"
                "                    while(l<r&&nums[r]==nums[r-1])r--;\n"
                "                    l++;r--;\n"
                "                }\n"
                "            }\n"
                "        }\n"
                "        return res;\n"
                "    }\n};"
            ),
            "go": (
                "import \"sort\"\n\n"
                "func threeSum(nums []int) [][]int {\n"
                "    sort.Ints(nums)\n"
                "    var res [][]int\n"
                "    for i := 0; i < len(nums)-2; i++ {\n"
                "        if i > 0 && nums[i] == nums[i-1] { continue }\n"
                "        l, r := i+1, len(nums)-1\n"
                "        for l < r {\n"
                "            s := nums[i] + nums[l] + nums[r]\n"
                "            if s < 0 { l++ } else if s > 0 { r-- } else {\n"
                "                res = append(res, []int{nums[i], nums[l], nums[r]})\n"
                "                for l < r && nums[l] == nums[l+1] { l++ }\n"
                "                for l < r && nums[r] == nums[r-1] { r-- }\n"
                "                l++; r--\n"
                "            }\n"
                "        }\n"
                "    }\n"
                "    return res\n"
                "}"
            ),
        },
        "driver_code": {
            "python": _py_driver,
            "javascript": _js_driver,
            "typescript": _js_driver,
            "java": _java_driver,
            "cpp": _cpp_driver,
            "go": _go_driver,
        },
        "hints": [
            "Sort the array first — this helps skip duplicates and use two pointers.",
            "Fix one element, then use two pointers to find pairs that sum to its negation.",
            "Skip duplicate values for the fixed element and after finding a triplet.",
        ],
        "time_complexity": "O(n^2)",
        "space_complexity": "O(1)",
        "time_limit_ms": 3000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "[-1,0,1,2,-1,-4]", "expected_output": "[[-1,-1,2],[-1,0,1]]", "is_sample": True, "sort_order": 1},
            {"input": "[0,1,1]", "expected_output": "[]", "is_sample": True, "sort_order": 2},
            {"input": "[0,0,0]", "expected_output": "[[0,0,0]]", "is_sample": True, "sort_order": 3},
            {"input": "[0,0,0,0]", "expected_output": "[[0,0,0]]", "is_sample": False, "sort_order": 4},
            {"input": "[-2,0,1,1,2]", "expected_output": "[[-2,0,2],[-2,1,1]]", "is_sample": False, "sort_order": 5},
            {"input": "[-1,0,1]", "expected_output": "[[-1,0,1]]", "is_sample": False, "sort_order": 6},
            {"input": "[1,2,-2,-1]", "expected_output": "[]", "is_sample": False, "sort_order": 7},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem 9: Merge Intervals
# ───────────────────────────────────────────────────────────────────


def _merge_intervals() -> dict:
    _py_driver = (
        "import sys, json\n"
        "_a = json.loads(sys.stdin.read().strip())\n"
        "_r = Solution().merge(_a)\n"
        "print(json.dumps(_r, separators=(',',':')))"
    )
    _js_driver = (
        "const _a=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\n"
        "const _r=merge(_a);\n"
        "console.log(JSON.stringify(_r));"
    )
    # Java driver with nested array parsing
    _java_driver = (
        "class Main {\n"
        "    public static void main(String[] a) throws Exception {\n"
        "        String line = new java.io.BufferedReader(new java.io.InputStreamReader(System.in)).readLine().trim();\n"
        "        int[][] iv;\n"
        "        if (line.equals(\"[]\")) { iv = new int[0][]; }\n"
        "        else {\n"
        "            String inner = line.substring(2, line.length()-2);\n"
        "            String[] g = inner.split(\"\\\\],\\\\[\");\n"
        "            iv = new int[g.length][2];\n"
        "            for (int i=0;i<g.length;i++) {\n"
        "                String[] p = g[i].split(\",\");\n"
        "                iv[i][0]=Integer.parseInt(p[0].trim());\n"
        "                iv[i][1]=Integer.parseInt(p[1].trim());\n"
        "            }\n"
        "        }\n"
        "        int[][] r = new Solution().merge(iv);\n"
        "        StringBuilder sb = new StringBuilder(\"[\");\n"
        "        for (int i=0;i<r.length;i++) {\n"
        "            if(i>0) sb.append(\",\");\n"
        "            sb.append(\"[\").append(r[i][0]).append(\",\").append(r[i][1]).append(\"]\");\n"
        "        }\n"
        "        sb.append(\"]\");\n"
        "        System.out.println(sb.toString());\n"
        "    }\n"
        "}"
    )
    # C++ driver with nested array parsing
    _cpp_driver = (
        "#include <iostream>\n#include <sstream>\n#include <algorithm>\n"
        "int main(){\n"
        "    std::string s; std::getline(std::cin,s);\n"
        "    std::vector<std::vector<int>> iv;\n"
        "    int i=1;\n"
        "    while(i<(int)s.size()-1){\n"
        "        if(s[i]=='['){\n"
        "            i++; std::string num; std::vector<int> v;\n"
        "            while(s[i]!=']'){\n"
        "                if(s[i]==','){v.push_back(std::stoi(num));num.clear();}\n"
        "                else num+=s[i];\n"
        "                i++;\n"
        "            }\n"
        "            if(!num.empty()) v.push_back(std::stoi(num));\n"
        "            iv.push_back(v); i++;\n"
        "        } else i++;\n"
        "    }\n"
        "    Solution sol; auto r=sol.merge(iv);\n"
        "    std::cout<<\"[\";\n"
        "    for(int i=0;i<(int)r.size();i++){\n"
        "        if(i)std::cout<<\",\";\n"
        "        std::cout<<\"[\"<<r[i][0]<<\",\"<<r[i][1]<<\"]\";\n"
        "    }\n"
        "    std::cout<<\"]\"<<std::endl;\n"
        "}"
    )
    _go_driver = (
        "package main\n"
        "import (\"bufio\";\"encoding/json\";\"fmt\";\"os\")\n"
        "// USER_CODE_HERE\n"
        "func main() {\n"
        "    sc := bufio.NewScanner(os.Stdin)\n"
        "    sc.Buffer(make([]byte,1<<20),1<<20)\n"
        "    sc.Scan()\n"
        "    var iv [][]int\n"
        "    json.Unmarshal([]byte(sc.Text()), &iv)\n"
        "    r := merge(iv)\n"
        "    o, _ := json.Marshal(r)\n"
        "    fmt.Println(string(o))\n"
        "}"
    )
    return {
        "title": "Merge Intervals",
        "slug": "merge-intervals",
        "topic_slug": "sorting",
        "difficulty": "medium",
        "description": (
            "Given an array of `intervals` where `intervals[i] = [start_i, "
            "end_i]`, merge all overlapping intervals, and return an array "
            "of the non-overlapping intervals that cover all the intervals "
            "in the input."
        ),
        "constraints": [
            "1 <= intervals.length <= 10^4",
            "intervals[i].length == 2",
            "0 <= start_i <= end_i <= 10^4",
        ],
        "examples": [
            {"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
             "output": "[[1,6],[8,10],[15,18]]",
             "explanation": "Intervals [1,3] and [2,6] overlap → [1,6]."},
            {"input": "intervals = [[1,4],[4,5]]", "output": "[[1,5]]",
             "explanation": "Intervals [1,4] and [4,5] are considered overlapping."},
        ],
        "starter_code": {
            "python": "class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        pass",
            "javascript": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n\n}",
            "typescript": "function merge(intervals: number[][]): number[][] {\n\n}",
            "java": "import java.util.*;\n\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n\n    }\n}",
            "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n\n    }\n};",
            "go": "func merge(intervals [][]int) [][]int {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n"
                "        intervals.sort()\n"
                "        merged = [intervals[0]]\n"
                "        for s, e in intervals[1:]:\n"
                "            if s <= merged[-1][1]:\n"
                "                merged[-1][1] = max(merged[-1][1], e)\n"
                "            else:\n"
                "                merged.append([s, e])\n"
                "        return merged"
            ),
            "javascript": (
                "function merge(intervals) {\n"
                "    intervals.sort((a,b)=>a[0]-b[0]);\n"
                "    const m=[intervals[0]];\n"
                "    for (let i=1;i<intervals.length;i++) {\n"
                "        if (intervals[i][0]<=m[m.length-1][1]) m[m.length-1][1]=Math.max(m[m.length-1][1],intervals[i][1]);\n"
                "        else m.push(intervals[i]);\n"
                "    }\n"
                "    return m;\n"
                "}"
            ),
            "typescript": (
                "function merge(intervals: number[][]): number[][] {\n"
                "    intervals.sort((a,b)=>a[0]-b[0]);\n"
                "    const m=[intervals[0]];\n"
                "    for (let i=1;i<intervals.length;i++) {\n"
                "        if (intervals[i][0]<=m[m.length-1][1]) m[m.length-1][1]=Math.max(m[m.length-1][1],intervals[i][1]);\n"
                "        else m.push(intervals[i]);\n"
                "    }\n"
                "    return m;\n"
                "}"
            ),
            "java": (
                "import java.util.*;\n\n"
                "class Solution {\n"
                "    public int[][] merge(int[][] intervals) {\n"
                "        Arrays.sort(intervals, (a,b)->a[0]-b[0]);\n"
                "        List<int[]> m = new ArrayList<>();\n"
                "        m.add(intervals[0]);\n"
                "        for (int i=1;i<intervals.length;i++) {\n"
                "            int[] last = m.get(m.size()-1);\n"
                "            if (intervals[i][0]<=last[1]) last[1]=Math.max(last[1],intervals[i][1]);\n"
                "            else m.add(intervals[i]);\n"
                "        }\n"
                "        return m.toArray(new int[0][]);\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <vector>\n#include <algorithm>\nusing namespace std;\n\n"
                "class Solution {\npublic:\n"
                "    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n"
                "        sort(intervals.begin(),intervals.end());\n"
                "        vector<vector<int>> m={intervals[0]};\n"
                "        for (int i=1;i<(int)intervals.size();i++) {\n"
                "            if (intervals[i][0]<=m.back()[1]) m.back()[1]=max(m.back()[1],intervals[i][1]);\n"
                "            else m.push_back(intervals[i]);\n"
                "        }\n"
                "        return m;\n"
                "    }\n};"
            ),
            "go": (
                "import \"sort\"\n\n"
                "func merge(intervals [][]int) [][]int {\n"
                "    sort.Slice(intervals, func(i,j int) bool { return intervals[i][0]<intervals[j][0] })\n"
                "    m := [][]int{intervals[0]}\n"
                "    for _, iv := range intervals[1:] {\n"
                "        last := m[len(m)-1]\n"
                "        if iv[0] <= last[1] {\n"
                "            if iv[1] > last[1] { m[len(m)-1][1] = iv[1] }\n"
                "        } else { m = append(m, iv) }\n"
                "    }\n"
                "    return m\n"
                "}"
            ),
        },
        "driver_code": {
            "python": _py_driver,
            "javascript": _js_driver,
            "typescript": _js_driver,
            "java": _java_driver,
            "cpp": _cpp_driver,
            "go": _go_driver,
        },
        "hints": [
            "Sort the intervals by their start times first.",
            "Walk through sorted intervals: if the current overlaps the last merged, extend it.",
            "Two intervals overlap when current.start <= last.end.",
        ],
        "time_complexity": "O(n log n)",
        "space_complexity": "O(n)",
        "time_limit_ms": 2000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "[[1,3],[2,6],[8,10],[15,18]]", "expected_output": "[[1,6],[8,10],[15,18]]", "is_sample": True, "sort_order": 1},
            {"input": "[[1,4],[4,5]]", "expected_output": "[[1,5]]", "is_sample": True, "sort_order": 2},
            {"input": "[[1,4],[0,4]]", "expected_output": "[[0,4]]", "is_sample": True, "sort_order": 3},
            {"input": "[[1,4],[2,3]]", "expected_output": "[[1,4]]", "is_sample": False, "sort_order": 4},
            {"input": "[[1,4],[0,0]]", "expected_output": "[[0,0],[1,4]]", "is_sample": False, "sort_order": 5},
            {"input": "[[1,3]]", "expected_output": "[[1,3]]", "is_sample": False, "sort_order": 6},
            {"input": "[[1,10],[2,3],[4,5],[6,7]]", "expected_output": "[[1,10]]", "is_sample": False, "sort_order": 7},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem 10: Container With Most Water
# ───────────────────────────────────────────────────────────────────


def _container_with_most_water() -> dict:
    _py_driver = (
        "import sys, json\n"
        "_a = json.loads(sys.stdin.read().strip())\n"
        "print(Solution().maxArea(_a))"
    )
    _js_driver = (
        "const _a=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\n"
        "console.log(maxArea(_a));"
    )
    _java_driver = (
        "class Main {\n"
        + _JAVA_PARSE_ARR
        + "    public static void main(String[] a) throws Exception {\n"
        "        int[] h = _pa(new java.io.BufferedReader(new java.io.InputStreamReader(System.in)).readLine());\n"
        "        System.out.println(new Solution().maxArea(h));\n"
        "    }\n"
        "}"
    )
    _cpp_driver = (
        "#include <iostream>\n#include <sstream>\n"
        + _CPP_PARSE_ARR
        + "int main(){\n"
        "    std::string l; std::getline(std::cin,l);\n"
        "    auto h=_pa(l); Solution sol;\n"
        "    std::cout<<sol.maxArea(h)<<std::endl;\n"
        "}"
    )
    _go_driver = (
        "package main\n"
        "import (\"bufio\";\"encoding/json\";\"fmt\";\"os\")\n"
        "// USER_CODE_HERE\n"
        "func main() {\n"
        "    sc := bufio.NewScanner(os.Stdin)\n"
        "    sc.Buffer(make([]byte,1<<20),1<<20)\n"
        "    sc.Scan()\n"
        "    var h []int\n"
        "    json.Unmarshal([]byte(sc.Text()), &h)\n"
        "    fmt.Println(maxArea(h))\n"
        "}"
    )
    return {
        "title": "Container With Most Water",
        "slug": "container-with-most-water",
        "topic_slug": "two-pointers",
        "difficulty": "medium",
        "description": (
            "You are given an integer array `height` of length `n`. There "
            "are `n` vertical lines drawn such that the two endpoints of the "
            "i-th line are `(i, 0)` and `(i, height[i])`.\n\n"
            "Find two lines that together with the x-axis form a container, "
            "such that the container contains the most water.\n\n"
            "Return the maximum amount of water a container can store.\n\n"
            "**Notice:** You may not slant the container."
        ),
        "constraints": [
            "n == height.length",
            "2 <= n <= 10^5",
            "0 <= height[i] <= 10^4",
        ],
        "examples": [
            {"input": "height = [1,8,6,2,5,4,8,3,7]", "output": "49",
             "explanation": "Lines at index 1 (h=8) and 8 (h=7): area = 7 * 7 = 49."},
            {"input": "height = [1,1]", "output": "1"},
        ],
        "starter_code": {
            "python": "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass",
            "javascript": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction maxArea(height) {\n\n}",
            "typescript": "function maxArea(height: number[]): number {\n\n}",
            "java": "class Solution {\n    public int maxArea(int[] height) {\n\n    }\n}",
            "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n\n    }\n};",
            "go": "func maxArea(height []int) int {\n\n}",
        },
        "solution_code": {
            "python": (
                "class Solution:\n"
                "    def maxArea(self, height: list[int]) -> int:\n"
                "        l, r = 0, len(height) - 1\n"
                "        mx = 0\n"
                "        while l < r:\n"
                "            w = r - l\n"
                "            h = min(height[l], height[r])\n"
                "            mx = max(mx, w * h)\n"
                "            if height[l] < height[r]: l += 1\n"
                "            else: r -= 1\n"
                "        return mx"
            ),
            "javascript": (
                "function maxArea(height) {\n"
                "    let l=0, r=height.length-1, mx=0;\n"
                "    while (l<r) {\n"
                "        mx=Math.max(mx,(r-l)*Math.min(height[l],height[r]));\n"
                "        if (height[l]<height[r]) l++; else r--;\n"
                "    }\n"
                "    return mx;\n"
                "}"
            ),
            "typescript": (
                "function maxArea(height: number[]): number {\n"
                "    let l=0, r=height.length-1, mx=0;\n"
                "    while (l<r) {\n"
                "        mx=Math.max(mx,(r-l)*Math.min(height[l],height[r]));\n"
                "        if (height[l]<height[r]) l++; else r--;\n"
                "    }\n"
                "    return mx;\n"
                "}"
            ),
            "java": (
                "class Solution {\n"
                "    public int maxArea(int[] height) {\n"
                "        int l=0, r=height.length-1, mx=0;\n"
                "        while (l<r) {\n"
                "            mx=Math.max(mx,(r-l)*Math.min(height[l],height[r]));\n"
                "            if (height[l]<height[r]) l++; else r--;\n"
                "        }\n"
                "        return mx;\n"
                "    }\n"
                "}"
            ),
            "cpp": (
                "#include <vector>\n#include <algorithm>\nusing namespace std;\n\n"
                "class Solution {\npublic:\n"
                "    int maxArea(vector<int>& height) {\n"
                "        int l=0, r=height.size()-1, mx=0;\n"
                "        while (l<r) {\n"
                "            mx=max(mx,(r-l)*min(height[l],height[r]));\n"
                "            if (height[l]<height[r]) l++; else r--;\n"
                "        }\n"
                "        return mx;\n"
                "    }\n};"
            ),
            "go": (
                "func maxArea(height []int) int {\n"
                "    l, r, mx := 0, len(height)-1, 0\n"
                "    for l < r {\n"
                "        h := height[l]\n"
                "        if height[r] < h { h = height[r] }\n"
                "        a := (r - l) * h\n"
                "        if a > mx { mx = a }\n"
                "        if height[l] < height[r] { l++ } else { r-- }\n"
                "    }\n"
                "    return mx\n"
                "}"
            ),
        },
        "driver_code": {
            "python": _py_driver,
            "javascript": _js_driver,
            "typescript": _js_driver,
            "java": _java_driver,
            "cpp": _cpp_driver,
            "go": _go_driver,
        },
        "hints": [
            "Start with the widest container (pointers at both ends).",
            "Always move the shorter line inward — moving the taller one can't help.",
            "Track the maximum area seen so far.",
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(1)",
        "time_limit_ms": 2000,
        "memory_limit_kb": 131072,
        "test_cases": [
            {"input": "[1,8,6,2,5,4,8,3,7]", "expected_output": "49", "is_sample": True, "sort_order": 1},
            {"input": "[1,1]", "expected_output": "1", "is_sample": True, "sort_order": 2},
            {"input": "[4,3,2,1,4]", "expected_output": "16", "is_sample": True, "sort_order": 3},
            {"input": "[1,2,1]", "expected_output": "2", "is_sample": False, "sort_order": 4},
            {"input": "[2,3,4,5,18,17,6]", "expected_output": "17", "is_sample": False, "sort_order": 5},
            {"input": "[1,2,4,3]", "expected_output": "4", "is_sample": False, "sort_order": 6},
            {"input": "[10000,10000]", "expected_output": "10000", "is_sample": False, "sort_order": 7},
        ],
    }


# ───────────────────────────────────────────────────────────────────
# Problem aggregator
# ───────────────────────────────────────────────────────────────────


def _build_problems() -> list[dict]:
    """Return all seed problem definitions."""
    return [
        _two_sum(),
        _valid_parentheses(),
        _buy_sell_stock(),
        _contains_duplicate(),
        _climbing_stairs(),
        _maximum_subarray(),
        _longest_substring(),
        _three_sum(),
        _merge_intervals(),
        _container_with_most_water(),
    ]


# ───────────────────────────────────────────────────────────────────
# Database seeder
# ───────────────────────────────────────────────────────────────────


async def seed_all(db: AsyncSession) -> None:
    """Seed topics and problems if they don't already exist."""
    await _seed_topics(db)
    await _seed_problems(db)


async def _seed_topics(db: AsyncSession) -> None:
    for t in TOPICS:
        result = await db.execute(
            select(Topic).where(Topic.slug == t["slug"]),
        )
        if result.scalar_one_or_none():
            continue
        db.add(Topic(**t))
    await db.commit()
    logger.info("seed_topics_done count=%d", len(TOPICS))


async def _seed_problems(db: AsyncSession) -> None:
    problems = _build_problems()
    for p_data in problems:
        result = await db.execute(
            select(Problem).where(Problem.slug == p_data["slug"]),
        )
        if result.scalar_one_or_none():
            continue

        # Resolve topic by slug
        topic_slug = p_data.pop("topic_slug")
        topic_result = await db.execute(
            select(Topic).where(Topic.slug == topic_slug),
        )
        topic = topic_result.scalar_one_or_none()
        if not topic:
            logger.warning(
                "seed_skip_problem slug=%s topic=%s",
                p_data["slug"],
                topic_slug,
            )
            continue

        test_cases_data = p_data.pop("test_cases")

        problem = Problem(topic_id=topic.id, **p_data)
        db.add(problem)
        await db.flush()

        for tc in test_cases_data:
            db.add(TestCase(problem_id=problem.id, **tc))

    await db.commit()
    logger.info("seed_problems_done count=%d", len(problems))
