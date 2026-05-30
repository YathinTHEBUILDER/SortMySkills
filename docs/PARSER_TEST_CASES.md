# Skill Parser Test Cases & Verifications

This document outlines the expected parser behavior and test cases for SortMySkills canonical skill mapping.

## Objective
Ensure the parser is accurate, specific, does not collapse independent libraries/platforms into broad categories, and successfully filters out common English false positives.

---

## 1. Library Specificity Verification

* **Case 1: Data Science Libraries**
  * **Input**: "Highly skilled in Pandas and NumPy."
  * **Expected Output**:
    * `Pandas` (canonical) — NOT collapsed to `Data Science`.
    * `NumPy` (canonical) — NOT collapsed to `Data Science`.
  * **Category**: Both mapped to `"Data Science & Analytics"`.

* **Case 2: Deep Learning & ML Libraries**
  * **Input**: "Built CNNs using TensorFlow and PyTorch."
  * **Expected Output**:
    * `TensorFlow` (canonical) — NOT collapsed to `Machine Learning`.
    * `PyTorch` (canonical) — NOT collapsed to `Machine Learning`.
  * **Category**: Both mapped to `"AI & Machine Learning"`.

* **Case 3: Machine Learning Frameworks**
  * **Input**: "Used scikit-learn for basic classifications."
  * **Expected Output**:
    * `Scikit-learn` (canonical) — NOT collapsed to `Machine Learning`.
  * **Category**: Mapped to `"AI & Machine Learning"`.

---

## 2. Cloud & Hosting Specificity Verification

* **Case 4: Firebase vs Google Cloud**
  * **Input**: "Managed database on Firebase and hosted web-server on Google Cloud Platform."
  * **Expected Output**:
    * `Firebase` (canonical) — NOT collapsed to `Google Cloud`.
    * `Google Cloud` (canonical).
  * **Category**: `Firebase` mapped to `"Cloud & Hosting Services"`, `Google Cloud` mapped to `"Cloud Infrastructure"`.

* **Case 5: Amazon Web Services (AWS) Resources**
  * **Input**: "Deployed microservices using EC2, Lambda, S3, and DynamoDB."
  * **Expected Output**:
    * `Amazon EC2` (canonical) — NOT collapsed to `AWS`.
    * `AWS Lambda` (canonical) — NOT collapsed to `AWS`.
    * `Amazon S3` (canonical) — NOT collapsed to `AWS`.
    * `DynamoDB` (canonical) — NOT collapsed to `AWS`.

---

## 3. DevOps Specificity Verification

* **Case 6: Containerization & Orchestration**
  * **Input**: "Dockerized standard services and managed with Kubernetes."
  * **Expected Output**:
    * `Docker` (canonical) — NOT collapsed to `DevOps`.
    * `Kubernetes` (canonical) — NOT collapsed to `DevOps`.

---

## 4. English False Positives & Stopwords Filtering

* **Case 7: English verb "go"**
  * **Input**: "I want to go to the office. Let's go build it."
  * **Expected Output**:
    * No `Go` (canonical language) detected.
  * **Behavior**: Punctuation and surrounding verbs correctly trigger the regex filter `GO_FALSE_POSITIVE_BEFORE` to bypass mapping standard words.

* **Case 8: Actual "Go" language usage**
  * **Input**: "Experienced backend developer with Go and Python."
  * **Expected Output**:
    * `Go` (canonical language).
    * `Python` (canonical language).

---

## How to Run Parser Verifications
The parser logic resides entirely in `src/lib/skill-map.ts`. You can verify these test cases in Next.js pages or custom Node scripts by importing `parseSkills`:

```typescript
import { parseSkills } from "@/lib/skill-map";

const result = parseSkills("Highly skilled in Pandas and NumPy");
console.log(result.skills.map(s => s.canonical)); 
// Expected: ["NumPy", "Pandas"]
```
