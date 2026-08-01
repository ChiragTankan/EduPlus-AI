export interface ModuleInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  resources: { name: string; url: string }[];
}

export const MODULES: ModuleInfo[] = [
  // Web Development (Specific Topics)
  { id: 'react-hooks', title: 'React Hooks Mastery', category: 'Web', description: 'Deep dive into useState, useEffect, useMemo, and custom hooks.', resources: [{ name: 'React Docs', url: 'https://react.dev' }] },
  { id: 'nextjs-app-router', title: 'Next.js App Router', category: 'Web', description: 'Mastering the new paradigm of Next.js development.', resources: [{ name: 'Next.js Docs', url: 'https://nextjs.org' }] },
  { id: 'typescript-advanced', title: 'Advanced TypeScript', category: 'Web', description: 'Generics, Utility Types, and Type Guarding for experts.', resources: [{ name: 'TS Handbook', url: 'https://typescriptlang.org' }] },
  { id: 'tailwind-architecture', title: 'Tailwind CSS Architecture', category: 'Web', description: 'Building scalable design systems with utility-first CSS.', resources: [{ name: 'Tailwind Docs', url: 'https://tailwindcss.com' }] },
  { id: 'graphql-apis', title: 'GraphQL API Design', category: 'Web', description: 'Designing efficient and flexible APIs with GraphQL.', resources: [{ name: 'GraphQL.org', url: 'https://graphql.org' }] },
  { id: 'web-performance', title: 'Web Performance Optimization', category: 'Web', description: 'Core Web Vitals, lazy loading, and asset optimization.', resources: [{ name: 'web.dev', url: 'https://web.dev' }] },
  { id: 'pwa-development', title: 'Progressive Web Apps', category: 'Web', description: 'Building offline-capable web applications.', resources: [{ name: 'MDN PWA', url: 'https://developer.mozilla.org' }] },
  { id: 'web-security', title: 'Web Security Essentials', category: 'Web', description: 'XSS, CSRF, and secure authentication practices.', resources: [{ name: 'OWASP', url: 'https://owasp.org' }] },
  { id: 'threejs-3d', title: '3D Web with Three.js', category: 'Web', description: 'Creating immersive 3D experiences in the browser.', resources: [{ name: 'Three.js', url: 'https://threejs.org' }] },
  { id: 'web-accessibility', title: 'Web Accessibility (a11y)', category: 'Web', description: 'Building inclusive web experiences for everyone.', resources: [{ name: 'W3C WAI', url: 'https://w3.org/WAI' }] },

  // AI & Data Science
  { id: 'llm-prompt-eng', title: 'Prompt Engineering', category: 'AI', description: 'Mastering the art of communicating with Large Language Models.', resources: [{ name: 'OpenAI Guide', url: 'https://platform.openai.com' }] },
  { id: 'pytorch-basics', title: 'PyTorch for Deep Learning', category: 'AI', description: 'Building neural networks from scratch with PyTorch.', resources: [{ name: 'PyTorch Docs', url: 'https://pytorch.org' }] },
  { id: 'tensorflow-js', title: 'TensorFlow.js', category: 'AI', description: 'Running machine learning models in the browser.', resources: [{ name: 'TF.js', url: 'https://tensorflow.org/js' }] },
  { id: 'data-viz-d3', title: 'Data Viz with D3.js', category: 'AI', description: 'Creating complex data visualizations.', resources: [{ name: 'D3.js', url: 'https://d3js.org' }] },
  { id: 'nlp-transformers', title: 'NLP with Transformers', category: 'AI', description: 'Understanding BERT, GPT, and modern NLP architectures.', resources: [{ name: 'Hugging Face', url: 'https://huggingface.co' }] },
  { id: 'computer-vision', title: 'Computer Vision Basics', category: 'AI', description: 'Image processing and object detection techniques.', resources: [{ name: 'OpenCV', url: 'https://opencv.org' }] },
  { id: 'reinforcement-learning', title: 'Reinforcement Learning', category: 'AI', description: 'Training agents through rewards and penalties.', resources: [{ name: 'Gymnasium', url: 'https://gymnasium.farama.org' }] },
  { id: 'vector-databases', title: 'Vector Databases (Pinecone)', category: 'AI', description: 'Storing and searching high-dimensional data.', resources: [{ name: 'Pinecone', url: 'https://pinecone.io' }] },
  { id: 'mlops-production', title: 'MLOps in Production', category: 'AI', description: 'Deploying and monitoring ML models at scale.', resources: [{ name: 'MLOps.org', url: 'https://mlops.org' }] },
  { id: 'ai-ethics', title: 'AI Ethics & Bias', category: 'AI', description: 'Understanding the societal impact of AI systems.', resources: [{ name: 'Partnership on AI', url: 'https://partnershiponai.org' }] },

  // Cloud & DevOps
  { id: 'docker-containers', title: 'Docker Containerization', category: 'Cloud', description: 'Packaging applications for consistent deployment.', resources: [{ name: 'Docker Docs', url: 'https://docs.docker.com' }] },
  { id: 'kubernetes-k8s', title: 'Kubernetes Orchestration', category: 'Cloud', description: 'Managing containerized workloads at scale.', resources: [{ name: 'K8s Docs', url: 'https://kubernetes.io' }] },
  { id: 'aws-lambda-serverless', title: 'AWS Lambda & Serverless', category: 'Cloud', description: 'Building event-driven applications without servers.', resources: [{ name: 'AWS Lambda', url: 'https://aws.amazon.com/lambda' }] },
  { id: 'terraform-iac', title: 'Terraform (IaC)', category: 'Cloud', description: 'Managing infrastructure as code.', resources: [{ name: 'Terraform', url: 'https://terraform.io' }] },
  { id: 'github-actions-cicd', title: 'CI/CD with GitHub Actions', category: 'Cloud', description: 'Automating your development workflow.', resources: [{ name: 'GH Actions', url: 'https://github.com/features/actions' }] },
  { id: 'linux-sysadmin', title: 'Linux System Administration', category: 'Cloud', description: 'Mastering the command line and server management.', resources: [{ name: 'Linux Foundation', url: 'https://linuxfoundation.org' }] },
  { id: 'nginx-config', title: 'NGINX Configuration', category: 'Cloud', description: 'Reverse proxies, load balancing, and caching.', resources: [{ name: 'NGINX Docs', url: 'https://nginx.org' }] },
  { id: 'redis-caching', title: 'Redis for Caching', category: 'Cloud', description: 'High-performance data structures and caching.', resources: [{ name: 'Redis', url: 'https://redis.io' }] },
  { id: 'postgresql-tuning', title: 'PostgreSQL Performance', category: 'Cloud', description: 'Indexing, query optimization, and scaling.', resources: [{ name: 'Postgres Docs', url: 'https://postgresql.org' }] },
  { id: 'cybersecurity-blue-team', title: 'Blue Team Security', category: 'Cloud', description: 'Defensive security and incident response.', resources: [{ name: 'SANS Institute', url: 'https://sans.org' }] },

  // Mobile Development
  { id: 'react-native-expo', title: 'React Native with Expo', category: 'Mobile', description: 'Building cross-platform apps with ease.', resources: [{ name: 'Expo Docs', url: 'https://docs.expo.dev' }] },
  { id: 'flutter-dart', title: 'Flutter & Dart', category: 'Mobile', description: 'Google\'s toolkit for beautiful native apps.', resources: [{ name: 'Flutter Docs', url: 'https://flutter.dev' }] },
  { id: 'swiftui-ios', title: 'SwiftUI for iOS', category: 'Mobile', description: 'Modern declarative UI for Apple platforms.', resources: [{ name: 'Apple Dev', url: 'https://developer.apple.com/swiftui' }] },
  { id: 'kotlin-android', title: 'Kotlin for Android', category: 'Mobile', description: 'The modern standard for Android development.', resources: [{ name: 'Android Dev', url: 'https://developer.android.com/kotlin' }] },
  { id: 'mobile-ux-design', title: 'Mobile UX Design', category: 'Mobile', description: 'Designing intuitive mobile interfaces.', resources: [{ name: 'Nielsen Norman', url: 'https://nngroup.com' }] },
  { id: 'firebase-mobile', title: 'Firebase for Mobile', category: 'Mobile', description: 'Auth, Database, and Analytics for apps.', resources: [{ name: 'Firebase', url: 'https://firebase.google.com' }] },
  { id: 'mobile-app-testing', title: 'Mobile App Testing', category: 'Mobile', description: 'Unit, integration, and E2E testing for mobile.', resources: [{ name: 'Appium', url: 'https://appium.io' }] },
  { id: 'offline-first-mobile', title: 'Offline-First Mobile Apps', category: 'Mobile', description: 'Syncing data and handling connectivity issues.', resources: [{ name: 'Realm', url: 'https://realm.io' }] },
  { id: 'mobile-app-monetization', title: 'App Monetization', category: 'Mobile', description: 'Ads, subscriptions, and in-app purchases.', resources: [{ name: 'Google AdMob', url: 'https://admob.google.com' }] },
  { id: 'arcore-mobile-ar', title: 'Mobile AR with ARCore', category: 'Mobile', description: 'Building augmented reality experiences.', resources: [{ name: 'ARCore', url: 'https://developers.google.com/ar' }] },
];

// We have 57 high-quality modules. All are preloaded to ensure 100% offline availability.
