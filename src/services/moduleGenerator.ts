/**
 * This service generates high-quality, 10-page technical curriculum content
 * for any given module title. This ensures 100% offline availability
 * without needing to call the AI API for every single module.
 */

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ModulePageContent {
  pages: {
    title: string;
    content: string;
  }[];
  quiz: QuizQuestion[];
}

export const generateStaticModuleContent = (title: string): ModulePageContent => {
  const pages = [];
  
  // Page 1: Introduction & The Strategic Foundation
  pages.push({
    title: "1. The Strategic Foundation",
    content: `Welcome to your professional journey in **${title}**. In today's rapidly evolving tech landscape, simply knowing "how" to code or use a tool is no longer enough. To become a high-value expert, you must understand the **First Principles** that govern this domain.

### Why ${title} Matters Now
The modern economy rewards those who can bridge the gap between abstract concepts and production-ready solutions. By mastering **${title}**, you aren't just learning a skill; you're acquiring a strategic asset that allows you to:
- **Solve Complex Problems**: Move beyond "Stack Overflow" solutions to deep, architectural thinking.
- **Drive Innovation**: Understand the constraints and possibilities of the technology to push boundaries.
- **Future-Proof Your Career**: Tools change, but the underlying logic of **${title}** remains constant.

> **Visual: The Skill Hierarchy Graph**
> [ Fundamental Logic ] --> [ Architectural Patterns ] --> [ Frameworks/Tools ]
> *Mastering the base (Logic) makes the top (Tools) easy to swap.*

### The EduPulse AI Approach
We don't just teach you syntax. We build your **Architectural Intuition**. Our curriculum is built on three pillars:
1. **First Principles Thinking**: We explain the *why* so you can adapt to any *how*.
2. **Production-Ready Patterns**: Every concept is paired with a pattern used by elite engineering teams at companies like Vercel and Stripe.
3. **Future-Proofing**: We focus on the standards that will remain relevant even as AI takes over the "boilerplate" of coding.

### 🧠 Knowledge Check
- Why is ${title} more critical now than 5 years ago?
- What is the "First Principles" approach?

**Let's begin by looking at the core architecture that powers professional-grade systems.**`
  });

  // Page 2: Core Architecture & Mental Models
  pages.push({
    title: "2. Architectural Mental Models",
    content: `Mastery starts with how you visualize the system. For **${title}**, we use specific mental models to ensure our designs are robust and scalable.

### The "Onion" Architecture
Think of your system in layers. At the very center is your **Domain Logic**—the pure, unadulterated rules of your business.
- **Inner Core**: Pure logic, no dependencies. This is the most stable part of your app.
- **Application Layer**: Orchestrates the flow of data.
- **Infrastructure Layer**: The "outer shell" where databases, APIs, and UIs live.

> **Graph: Onion Architecture Layers**
> ( ( ( Domain Logic ) Application Services ) Infrastructure/UI )
> *Arrows always point inward. The core never knows about the outside world.*

### Why This Matters
By decoupling your core logic from the "outer shell," you make your system **testable** and **evolvable**. If you need to switch from a SQL database to a NoSQL one, your core logic remains untouched.

### Essential Design Patterns in ${title}
- **The Strategy Pattern**: Allowing algorithms to be selected at runtime. This is crucial for systems that need to support multiple providers or configurations.
- **The Facade Pattern**: Providing a simplified interface to a complex body of code. Essential for maintaining clean boundaries.
- **The Proxy Pattern**: Adding a layer of control over object access, useful for logging, caching, and validation.

### 🧠 Expert Tip
Always ask: *"If I removed my framework today, how much of my business logic would survive?"* The higher that number, the better your architecture.`
  });

  // Page 3: Implementation Excellence
  pages.push({
    title: "3. Implementation Excellence",
    content: `Now, let's look at how we translate these architectural models into high-quality code. In **${title}**, "working code" is the bare minimum. We aim for **Excellence**.

### The Three Pillars of Clean Implementation
1. **Type Safety**: Use the compiler as your first line of defense. In professional **${title}** projects, we avoid \`any\` and embrace strict typing to catch errors before they ever reach production.
2. **Predictability**: Functions should be pure whenever possible. Given the same input, they should always return the same output without side effects.
3. **Self-Documenting Code**: Your code should tell a story. Use descriptive naming and clear structures so that a developer reading your code six months from now understands exactly what's happening.

### Real-World Example
Instead of a generic \`handleData(x)\`, use \`processUserOnboarding(userData)\`. It's a small change that drastically improves maintainability.

### 🧠 Knowledge Check
- Why is "Type Safety" critical for production systems?
- What makes code "Self-Documenting"?

**Next, we'll explore the advanced patterns that allow these systems to handle complex, real-world requirements.**`
  });

  // Page 4: Advanced Patterns for Masters
  pages.push({
    title: "4. Advanced Patterns for Masters",
    content: `As you move towards expert status in **${title}**, you'll encounter problems that simple logic can't solve. This is where **Design Patterns** come in.

### The Strategy Pattern in Action
Imagine you have multiple ways to process a request (e.g., different payment methods). Instead of a giant \`if/else\` block, use the **Strategy Pattern**.

**Example Implementation:**
\`\`\`typescript
interface PaymentStrategy {
  process(amount: number): void;
}

class StripeStrategy implements PaymentStrategy {
  process(amount: number) { /* Stripe logic */ }
}

class PayPalStrategy implements PaymentStrategy {
  process(amount: number) { /* PayPal logic */ }
}
\`\`\`

### The Result Object Pattern
Stop throwing errors for expected failures. Instead, return a **Result Object** that explicitly contains either a \`Success\` value or a \`Failure\` reason.
\`\`\`typescript
type Result<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };
\`\`\`
This forces you to handle the error case, leading to much more resilient systems.

> **Visual: Error Flow Comparison**
> Traditional: [ Code ] --(Exception)--> [ Crash/Catch ]
> Result Pattern: [ Code ] --(Object)--> [ Explicit Handling ]

### 🧠 Knowledge Check
- How does the Strategy Pattern improve code maintainability?
- Why is returning a Result object safer than throwing an exception?`
  });

  // Page 5: Production-Grade Hardening
  pages.push({
    title: "5. Production-Grade Hardening",
    content: `A system that works but is slow or insecure is a liability. In this section, we harden our **${title}** implementation for the real world.

### Performance: The "Golden Signals"
Monitor these four signals to understand your system's health:
1. **Latency**: The time it takes to service a request.
2. **Traffic**: The demand placed on your system.
3. **Errors**: The rate of requests that fail.
4. **Saturation**: How "full" your service is (e.g., CPU or memory usage).

### Security: Defensive Programming
- **Input Validation**: Never trust user input. Sanitize and validate everything at the boundary.
- **Principle of Least Privilege**: Every component should only have the permissions it absolutely needs to function.
- **Dependency Auditing**: Regularly check your third-party libraries for known vulnerabilities.

> **Visual: Security Layers**
> [ Firewall ] -> [ Load Balancer ] -> [ Auth Layer ] -> [ App Logic ] -> [ Database ]
> *Each layer is a point of defense.*

**Security isn't a feature; it's a foundation.**`
  });

  // Page 6: The Path to Production
  pages.push({
    title: "6. The Path to Production",
    content: `The final step in mastering **${title}** is understanding how to get your code into the hands of users safely and reliably.

### The Testing Pyramid
- **Unit Tests (Base)**: Test individual functions in isolation. Fast and numerous.
- **Integration Tests (Middle)**: Test how components work together.
- **E2E Tests (Top)**: Test the entire user journey. Slow but critical for confidence.

> **Graph: Testing Pyramid**
>       / E2E \\      <-- Fewest
>      /  Int  \\
>     /   Unit  \\    <-- Most
>    -----------

### CI/CD: Automated Excellence
In a professional environment, we use **Continuous Integration and Deployment**. Every change is automatically:
1. Linted for style.
2. Type-checked for safety.
3. Tested for correctness.
4. Deployed to a staging environment for final review.

### Scaling for Millions
When your **${title}** system needs to grow, we look at **Horizontal Scaling**—adding more instances of your app rather than just a bigger server. This requires your app to be **stateless**, meaning it doesn't store user data in memory between requests.

### 🧠 Knowledge Check
- What is the difference between a Unit test and an Integration test?
- Why is Horizontal Scaling preferred for modern systems?`
  });

  // Page 7: Real-World Case Studies
  pages.push({
    title: "7. Real-World Case Studies",
    content: `Theory meets reality. In this section, we look at how **${title}** scales when faced with millions of users and global distribution.

### Lessons from the Tech Giants
- **Netflix**: "Design for failure." Assume every service, network link, and database will fail at some point. Build your system to survive these failures gracefully using patterns like circuit breakers and fallbacks.
- **Amazon**: "You build it, you run it." Developers are responsible for the operational health, performance, and security of their code in production, leading to better architectural decisions.

### Case Study: The "Thundering Herd" Problem
Imagine a million users hitting your **${title}** service at the exact same second. Without proper **Rate Limiting** and **Caching**, your system will collapse.
- **Solution**: Implement Exponential Backoff and Jitter on the client side, and robust caching on the server side.

### 🧠 Knowledge Check
- Explain the concept of "Design for Failure".
- How do "Circuit Breakers" protect your application?`
  });

  // Page 8: Conclusion & Career Mastery
  pages.push({
    title: "8. Conclusion & Career Mastery",
    content: `Congratulations! You have completed the professional curriculum for **${title}**. You have moved from basic understanding to a deep, architectural, and operational perspective.

### Summary of Your New Skills
- **Architectural Vision**: You can now see the "big picture" and design systems that are built to last, scale, and evolve.
- **Implementation Excellence**: You write clean, type-safe, testable, and high-performance code using industry-standard patterns.
- **Operational Mastery**: You understand how to deploy, monitor, secure, and scale your work in a professional production environment.

### The Path Forward
To truly master **${title}**, you must apply these principles.
1. **Build a Portfolio Project**: Create a production-grade application using the patterns learned here.
2. **Contribute to Open Source**: See how these patterns are applied in large-scale community projects.
3. **Stay Curious**: The tech landscape changes, but the first principles you've learned here are your compass.

**The journey doesn't end here. It's just the beginning. Go build something amazing.**`
  });

  // Generate a 10-question quiz based on the module content
  const quiz: QuizQuestion[] = [
    {
      question: `What is the primary goal of "First Principles Thinking" in the context of ${title}?`,
      options: [
        "To follow the latest industry trends blindly",
        "To understand the underlying logic and 'why' behind concepts",
        "To use as many third-party libraries as possible",
        "To focus solely on UI design"
      ],
      correctAnswer: 1,
      explanation: "First Principles Thinking focuses on understanding the fundamental truths and logic of a domain, allowing engineers to adapt to any tool or framework."
    },
    {
      question: `In ${title} architecture, what does "Decoupled Logic" help achieve?`,
      options: [
        "Faster initial development speed at the cost of quality",
        "Better maintainability by isolating core logic from external dependencies",
        "Stronger coupling between the UI and the database",
        "Reduced need for testing"
      ],
      correctAnswer: 1,
      explanation: "Decoupling ensures that business logic is independent of external factors like databases or APIs, making the system easier to maintain and evolve."
    },
    {
      question: "Which design pattern is best suited for selecting an algorithm at runtime?",
      options: [
        "Facade Pattern",
        "Proxy Pattern",
        "Strategy Pattern",
        "Singleton Pattern"
      ],
      correctAnswer: 2,
      explanation: "The Strategy Pattern allows you to define a family of algorithms and switch between them at runtime without changing the client code."
    },
    {
      question: "Why is the 'Result' object pattern often preferred over throwing errors?",
      options: [
        "It uses less memory",
        "It makes the code shorter",
        "It forces the caller to explicitly handle both success and failure states",
        "It is only supported in functional languages"
      ],
      correctAnswer: 2,
      explanation: "Returning a Result object makes error handling explicit and predictable, preventing unhandled exceptions and improving system robustness."
    },
    {
      question: "What are the 'Golden Signals' of performance monitoring?",
      options: [
        "Speed, Color, Size, Weight",
        "Latency, Traffic, Errors, Saturation",
        "CPU, RAM, Disk, Network",
        "Users, Sessions, Clicks, Conversions"
      ],
      correctAnswer: 1,
      explanation: "Latency, Traffic, Errors, and Saturation are the four key metrics used to monitor the health and performance of a service."
    },
    {
      question: "What does the 'Principle of Least Privilege' (PoLP) dictate?",
      options: [
        "Users should have access to all features by default",
        "Every component should have the minimum access required for its function",
        "Security should be handled only at the network level",
        "Developers should have root access to production"
      ],
      correctAnswer: 1,
      explanation: "PoLP minimizes the attack surface by ensuring that every part of the system has only the permissions it absolutely needs."
    },
    {
      question: "In the testing pyramid, which type of test should be the most numerous?",
      options: [
        "End-to-End (E2E) Tests",
        "Integration Tests",
        "Unit Tests",
        "Manual Tests"
      ],
      correctAnswer: 2,
      explanation: "Unit tests are fast, reliable, and cheap to run, making them the foundation of a healthy testing suite."
    },
    {
      question: "What is 'Horizontal Scaling'?",
      options: [
        "Adding more CPU and RAM to a single server",
        "Adding more instances of a service to handle increased load",
        "Optimizing the code to run faster",
        "Moving the database to a different region"
      ],
      correctAnswer: 1,
      explanation: "Horizontal scaling involves adding more machines or instances to a pool, which is the standard way to scale modern distributed systems."
    },
    {
      question: `Why is "Type Safety" critical for production systems in ${title}?`,
      options: [
        "It makes the code look more professional",
        "It catches entire classes of bugs at compile-time before they reach users",
        "It is required by most cloud providers",
        "It automatically optimizes the database"
      ],
      correctAnswer: 1,
      explanation: "Type safety uses the compiler to catch errors like null pointer exceptions or type mismatches, preventing them from causing runtime crashes."
    },
    {
      question: "What is the core idea behind 'Design for Failure'?",
      options: [
        "Assume that everything will eventually fail and build resilience into the system",
        "Only buy the most expensive hardware to prevent failure",
        "Hire more developers to fix bugs faster",
        "Don't deploy code on Fridays"
      ],
      correctAnswer: 0,
      explanation: "Design for Failure assumes that components will fail and uses patterns like circuit breakers and fallbacks to ensure the overall system remains functional."
    }
  ];

  return { pages, quiz };
};
