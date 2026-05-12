import type { VideoResult, AISummary } from "./types";

export const mockVideos: VideoResult[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Understanding Neural Networks: A Complete Beginner's Guide",
    description: "Learn the fundamentals of neural networks from scratch. This comprehensive guide covers perceptrons, backpropagation, and real-world applications.",
    channelTitle: "AI Academy",
    channelId: "UC123",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    publishedAt: "2024-08-15T10:00:00Z",
    viewCount: 1250000,
    likeCount: 85000,
    dislikeCount: 2100,
    commentCount: 4200,
    score: 91,
    scoreBreakdown: {
      likeRatio: 0.976,
      engagementRate: 7.14,
      timeDecay: 0.45,
      commentScore: 4.2,
    },
  },
  {
    id: "jNQXAC9IVRw",
    title: "Deep Learning Crash Course - From Zero to Hero in 2 Hours",
    description: "A fast-paced but thorough introduction to deep learning concepts, tools, and frameworks.",
    channelTitle: "TechVault",
    channelId: "UC456",
    thumbnailUrl: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    publishedAt: "2024-09-01T14:00:00Z",
    viewCount: 890000,
    likeCount: 62000,
    dislikeCount: 1800,
    commentCount: 3100,
    score: 84,
    scoreBreakdown: {
      likeRatio: 0.972,
      engagementRate: 7.31,
      timeDecay: 0.52,
      commentScore: 3.1,
    },
  },
  {
    id: "9bZkp7q19f0",
    title: "Machine Learning Mathematics You Actually Need",
    description: "The essential math behind ML: linear algebra, calculus, and probability explained intuitively.",
    channelTitle: "MathMinds",
    channelId: "UC789",
    thumbnailUrl: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    publishedAt: "2024-07-20T08:00:00Z",
    viewCount: 2100000,
    likeCount: 110000,
    dislikeCount: 5200,
    commentCount: 6800,
    score: 78,
    scoreBreakdown: {
      likeRatio: 0.955,
      engagementRate: 5.56,
      timeDecay: 0.32,
      commentScore: 6.8,
    },
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Build Your First AI Project in Python (Step by Step)",
    description: "Hands-on tutorial: build a real AI project from data collection to deployment.",
    channelTitle: "CodeCraft",
    channelId: "UC101",
    thumbnailUrl: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    publishedAt: "2024-10-05T16:00:00Z",
    viewCount: 450000,
    likeCount: 38000,
    dislikeCount: 900,
    commentCount: 2800,
    score: 72,
    scoreBreakdown: {
      likeRatio: 0.977,
      engagementRate: 9.07,
      timeDecay: 0.61,
      commentScore: 2.8,
    },
  },
  {
    id: "RgKAFK5djSk",
    title: "The Future of AI: What Experts Are Saying in 2024",
    description: "A panel discussion featuring leading AI researchers on what's coming next.",
    channelTitle: "FutureTech",
    channelId: "UC202",
    thumbnailUrl: "https://img.youtube.com/vi/RgKAFK5djSk/maxresdefault.jpg",
    publishedAt: "2024-06-10T12:00:00Z",
    viewCount: 3200000,
    likeCount: 140000,
    dislikeCount: 8500,
    commentCount: 9200,
    score: 65,
    scoreBreakdown: {
      likeRatio: 0.943,
      engagementRate: 4.66,
      timeDecay: 0.22,
      commentScore: 9.2,
    },
  },
];

export const mockSummary: AISummary = {
  coreTakeaway:
    "Neural networks are pattern-recognition systems inspired by the human brain that learn by adjusting connection weights through a process called backpropagation.",
  keyLessons: [
    "A neural network consists of input, hidden, and output layers connected by weighted edges",
    "Backpropagation is the algorithm that adjusts weights by calculating how much each contributed to the error",
    "Activation functions like ReLU introduce non-linearity, allowing networks to learn complex patterns",
    "Training requires labeled data, a loss function, and an optimizer like gradient descent",
    "Overfitting can be prevented using techniques like dropout, regularization, and cross-validation",
  ],
  followUpTopics: [
    "Convolutional Neural Networks (CNNs) for image recognition",
    "Recurrent Neural Networks (RNNs) and LSTMs for sequence data",
    "Transfer learning and pre-trained models like GPT and BERT",
  ],
};

export const mockTranscript = `Welcome to this comprehensive guide on neural networks. Today we're going to break down everything you need to know about how neural networks work, from the very basics to more advanced concepts.

First, let's talk about what a neural network actually is. At its core, a neural network is a computing system inspired by the biological neural networks in our brains. It consists of layers of interconnected nodes, or "neurons," that process information.

The three main types of layers are: the input layer, which receives the raw data; hidden layers, which perform computations; and the output layer, which produces the final result.

Each connection between neurons has a weight, which determines how much influence one neuron has on another. During training, these weights are adjusted to minimize errors in the network's predictions.

The process of adjusting these weights is called backpropagation. It works by calculating the error at the output and then propagating it backwards through the network, adjusting each weight based on how much it contributed to the error.

Activation functions are crucial components that introduce non-linearity into the network. Without them, the network would just be a linear function, no matter how many layers it has. Common activation functions include ReLU, sigmoid, and tanh.

To train a neural network, you need three things: labeled training data, a loss function that measures how wrong the predictions are, and an optimizer like gradient descent that adjusts the weights to minimize the loss.

One common problem is overfitting, where the network memorizes the training data instead of learning general patterns. Techniques like dropout, regularization, and cross-validation help prevent this.`;
