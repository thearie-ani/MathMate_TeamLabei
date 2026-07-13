# import warnings
# warnings.filterwarnings("ignore")

# import faiss
# import json
# import numpy as np
# from sentence_transformers import SentenceTransformer

# FAISS_PATH = "faiss-vector-store"
# # index = faiss.read_index("faiss-vector-store/index.faiss")
# # print(index.d) 
# # Load embedding model — MUST match what you used in ingestion.py
# model = SentenceTransformer("all-MiniLM-L6-v2")

# # Topic list for filtering (swap to match your formulas/lessons schema)
# TOPICS = [
#     # Chapter 1: Functions and Graphs
#     "function", "domain", "range", "graph",
#     "polynomial", "rational function", "exponential", "logarithmic",
#     "trigonometric", "inverse function",

#     # Chapter 2: Limits
#     "limit", "continuity", "asymptote",

#     # Chapter 3: Derivatives
#     "derivative", "differentiation", "chain rule",
#     "implicit differentiation", "rate of change",

#     # Chapter 4: Applications of Derivatives
#     "related rates", "linear approximation", "maxima", "minima",
#     "mean value theorem", "optimization", "newton's method",
#     "antiderivative", "l'hopital",

#     # Chapter 5: Integration
#     "integral", "integration", "substitution",
#     "fundamental theorem of calculus",

#     # Chapter 6: Applications of Integration
#     "area between curves", "volume", "arc length",
#     "center of mass", "exponential growth", "exponential decay",
#     "hyperbolic function"
# ]
# def load_vector_store():
#     index = faiss.read_index(f"{FAISS_PATH}/index.faiss")
#     with open(f"{FAISS_PATH}/chunks.json", "r", encoding="utf-8") as f:
#         chunks = json.load(f)
#     return index, chunks

# def retrieve(query, k=50):
#     index, chunks = load_vector_store()
#     topic_filter = [t for t in TOPICS if t in query.lower()]

#     if len(topic_filter) > 1:
#         # multi-topic query: balance k across topics, merge by distance
#         per_topic_k = max(k // len(topic_filter), 10)
#         seen, scored = set(), []

#         for topic in topic_filter:
#             sub_query = f"query: what is {topic}"
#             emb = np.array(model.encode([sub_query]), dtype="float32")
#             D, I = index.search(emb, per_topic_k)
#             for distance, i in zip(D[0], I[0]):
#                 if distance > 5.0 or i in seen:
#                     continue
#                 seen.add(i)
#                 scored.append((distance, topic, chunks[i]))

#         # sort by relevance so both topics are interleaved fairly, not topic1-then-topic2
#         scored.sort(key=lambda x: x[0])
#         return [chunk for _, _, chunk in scored]

#     # single-topic or no-topic path (unchanged)
#     query_embedding = np.array(model.encode([query]), dtype="float32")
#     D, I = index.search(query_embedding, k)
#     results = []
#     for distance, i in zip(D[0], I[0]):
#         if distance > 5.0:
#             continue
#         results.append(chunks[i])
#     return results


# if __name__ == "__main__":
#     print("=" * 50)
#     print("Math Retrieval Test")
#     print("Type 'exit' to quit")
#     print("=" * 50)

#     while True:
#         question = input("\nAsk a question: ").strip()
#         if not question:
#             continue
#         if question.lower() == "exit":
#             print("Goodbye! See you next time")
#             break

#         results = retrieve(question)

#         if not results:
#             print(" No relevant chunks found!")
#         else:
#             print(f"\n Found {len(results)} relevant chunks:")
#             for i, chunk in enumerate(results):
#                 print(f"\n--- Result {i+1} ---")
#                 print(chunk)
#                 print("-" * 30)


import warnings
warnings.filterwarnings("ignore")
import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

SUBJECTS = {
    "1": {
        "name": "calculus1",
        "path": "faiss-vector-store-calculus1",
        "topics": [
            # Chapter 1: Functions and Graphs
            "function", "domain", "range", "graph",
            "polynomial", "rational function", "exponential", "logarithmic",
            "trigonometric", "inverse function",

            # Chapter 2: Limits
            "limit", "continuity", "asymptote",

            # Chapter 3: Derivatives
            "derivative", "differentiation", "chain rule",
            "implicit differentiation", "rate of change",

            # Chapter 4: Applications of Derivatives
            "related rates", "linear approximation", "maxima", "minima",
            "mean value theorem", "optimization", "newton's method",
            "antiderivative", "l'hopital",

            # Chapter 5: Integration
            "integral", "integration", "substitution",
            "fundamental theorem of calculus",

            # Chapter 6: Applications of Integration
            "area between curves", "volume", "arc length",
            "center of mass", "exponential growth", "exponential decay",
            "hyperbolic function"
        ]
    },
    "2": {
        "name": "statistics",
        "path": "faiss-vector-store-statistics",
        "topics": [
            # Chapter 1: Introduction to Statistics
            "statistics", "probability", "population", "sample",
            "data types", "sampling", "bias", "experimental design", "ethics",

            # Chapter 2: Descriptive Statistics
            "mean", "median", "mode", "variance", "standard deviation",
            "range", "interquartile range", "histogram", "box plot",
            "skewness", "frequency table",

            # Chapter 3: Probability Topics
            "independent events", "mutually exclusive",
            "conditional probability", "tree diagram", "venn diagram",
            "contingency table", "addition rule", "multiplication rule",

            # Chapter 4: Discrete Random Variables
            "random variable", "probability distribution", "expected value",
            "binomial distribution", "poisson distribution",
            "geometric distribution", "hypergeometric distribution",

            # Chapter 5: Continuous Random Variables
            "continuous distribution", "probability density function",
            "uniform distribution", "exponential distribution",
            "area under curve",

            # Chapter 6: Normal Distribution
            "normal distribution", "bell curve", "z-score",
            "standard normal", "normal table", "symmetry",

            # Chapter 7: Central Limit Theorem
            "central limit theorem", "sampling distribution", "sample mean",
            "standard error", "law of large numbers", "normal approximation",

            # Chapter 8: Confidence Intervals
            "confidence interval", "margin of error", "point estimate",
            "confidence level", "t distribution", "z distribution",
            "population mean", "proportion",

            # Chapter 9: Hypothesis Testing (One Sample)
            "hypothesis testing", "null hypothesis", "alternative hypothesis",
            "p-value", "significance level", "type I error", "type II error",
            "one sample test",

            # Chapter 10: Hypothesis Testing (Two Samples)
            "two sample t-test", "independent samples", "paired samples",
            "difference of means", "two proportions", "test statistic",

            # Chapter 11: Chi-Square Tests
            "chi-square", "goodness of fit", "test of independence",
            "test of homogeneity", "observed frequency", "expected frequency",

            # Chapter 12: Linear Regression and Correlation
            "correlation", "regression", "least squares",
            "regression line", "slope", "intercept",
            "scatter plot", "outliers", "prediction",

            # Chapter 13: ANOVA and F Distribution
            "anova", "f distribution", "f-test",
            "between groups", "within groups",
            "variance comparison", "multiple groups"
        ]
    },
    "3": {
        "name":"algebra",
        "path":"faiss-vector-store-algebra1",
        "topics": [
            # Unit 1: Linear Equations
            "expression", "equation", "variable", "constant", "coefficient",
            "constraint", "linear equation", "equivalent equation",
            "solution", "one-variable equation", "two-variable equation",
            "graph of a line", "coordinate plane", "ordered pair",
            "slope", "slope formula", "slope-intercept form",
            "point-slope form", "standard form", "parallel lines",
            "perpendicular lines", "direct variation",

            # Unit 2: Linear Inequalities and Systems
            "system of equations", "graphing systems", "substitution method",
            "elimination method", "consistent system", "inconsistent system",
            "independent system", "dependent system", "linear inequality",
            "inequality symbols", "boundary line", "test point",
            "graphing inequalities", "system of inequalities",
            "feasible region", "constraints",

            # Unit 3: Two-Variable Statistics
            "scatter plot", "line of best fit", "linear model",
            "residual", "residual plot", "correlation",
            "correlation coefficient", "positive correlation",
            "negative correlation", "no correlation",
            "causation", "interpolation", "extrapolation",

            # Unit 4: Functions
            "relation", "function", "function notation",
            "input", "output", "independent variable",
            "dependent variable", "vertical line test",
            "rate of change", "average rate of change",
            "domain", "range", "function transformations",
            "vertical shift", "horizontal shift",
            "stretch", "compression", "reflection",
            "arithmetic sequence", "geometric sequence",
            "recursive formula", "explicit formula",
            "nth term", "common difference", "common ratio",

            # Unit 5: Exponential Functions
            "exponent", "power rule", "product rule",
            "quotient rule", "zero exponent",
            "negative exponent", "rational exponent",
            "radical", "nth root", "exponential growth",
            "exponential decay", "growth factor",
            "decay factor", "scientific notation",
            "exponential function", "average rate of change",
            "linear vs exponential",

            # Unit 6: Polynomials
            "polynomial", "monomial", "binomial",
            "trinomial", "degree", "polynomial addition",
            "polynomial subtraction", "polynomial multiplication",
            "FOIL", "long division", "synthetic division",
            "remainder theorem", "factor theorem",
            "greatest common factor", "factoring by grouping",
            "factor trinomials", "perfect square trinomial",
            "difference of squares", "factoring strategy",

            # Unit 7: Quadratic Functions
            "quadratic function", "quadratic expression",
            "parabola", "vertex", "axis of symmetry",
            "maximum", "minimum", "x-intercept",
            "y-intercept", "standard form",
            "factored form", "vertex form",
            "quadratic transformations",
            "linear vs quadratic",
            "quadratic vs exponential",

            # Unit 8: Quadratic Equations
            "quadratic equation", "zero product property",
            "factoring quadratics", "graphing quadratics",
            "real solutions", "zeros of a function",
            "quadratic regression", "curve of best fit",
            "quadratic model",

            # Unit 9: More Quadratic Equations
            "perfect square trinomial",
            "completing the square",
            "quadratic formula",
            "discriminant",
            "irrational solutions",
            "vertex form",
            "maximum value",
            "minimum value",
            "optimization",
            "quadratic modeling",
        ]
    },
    "4":{
        "name":"calculus2",
        "path":"faiss-vector-store-calculus2",
        "topics":[
        # Chapter 1: Integration
        "riemann sum", "area under a curve", "definite integral", "fundamental theorem of calculus", "antiderivative",
        "indefinite integral", "integration formulas", "net change theorem", "u-substitution",
        "substitution rule", "integrals of exponential functions", "integrals of logarithmic functions", "inverse trigonometric integrals",

        # Chapter 2: Applications of Integration
        "area between curves", "volume by slicing",
        "disk method", "washer method",
        "cylindrical shell method",
        "arc length", "surface area",
        "physical applications of integration",
        "work", "fluid force",
        "center of mass", "moment",
        "moments of mass",
        "integrals involving exponential functions",
        "exponential growth", "exponential decay",
        "hyperbolic functions",
        "hyperbolic identities",

        # Chapter 3: Techniques of Integration
        "integration by parts",
        "trigonometric integrals",
        "trigonometric substitution",
        "partial fractions",
        "integration strategies",
        "numerical integration",
        "trapezoidal rule",
        "simpson's rule",
        "improper integrals",

        # Chapter 4: Differential Equations
        "differential equation",
        "ordinary differential equation",
        "initial value problem",
        "direction field",
        "euler's method",
        "separable differential equations",
        "logistic equation",
        "first-order linear differential equations",
        "integrating factor",

        # Chapter 5: Sequences and Series
        "sequence",
        "series",
        "partial sums",
        "convergence",
        "divergence",
        "divergence test",
        "integral test",
        "comparison test",
        "limit comparison test",
        "alternating series",
        "alternating series test",
        "ratio test",
        "root test",

        # Chapter 6: Power Series
        "power series", "interval of convergence","radius of convergence", "properties of power series",
        "taylor series","maclaurin series", "taylor polynomial", "taylor approximation",

        # Chapter 7: Parametric Equations and Polar Coordinates
        "parametric equations", "parametric curves",
        "derivatives of parametric curves",
        "second derivative of parametric curves",
        "arc length of parametric curves",
        "polar coordinates",
        "polar equations",
        "polar graphs",
        "area in polar coordinates",
        "arc length in polar coordinates",
        "conic sections",
    ]

    
    }
    
}

def load_vector_store(path):
    index = faiss.read_index(f"{path}/index.faiss")
    with open(f"{path}/chunks.json", "r", encoding="utf-8") as f:
        chunks = json.load(f)
    return index, chunks

def retrieve(query, path, topics, k=50):
    index, chunks = load_vector_store(path)
    topic_filter = [t for t in topics if t in query.lower()]

    if len(topic_filter) > 1:
        per_topic_k = max(k // len(topic_filter), 10)
        seen, scored = set(), []
        for topic in topic_filter:
            sub_query = f"query: what is {topic}"
            emb = np.array(model.encode([sub_query]), dtype="float32")
            D, I = index.search(emb, per_topic_k)
            for distance, i in zip(D[0], I[0]):
                if distance > 5.0 or i in seen:
                    continue
                seen.add(i)
                scored.append((distance, topic, chunks[i]))
        scored.sort(key=lambda x: x[0])
        return [chunk for _, _, chunk in scored]

    query_embedding = np.array(model.encode([query]), dtype="float32")
    D, I = index.search(query_embedding, k)
    results = []
    for distance, i in zip(D[0], I[0]):
        if distance > 5.0:
            continue
        results.append(chunks[i])
    return results


if __name__ == "__main__":
    print("=" * 50)
    print("Retrieval Test")
    print("=" * 50)
    print("1. Calculus1")
    print("2. Statistics")
    print("3. Algebra1")
    print("4. Calculus2")

    choice = input("\nChoose a subject (1/4): ").strip()
    if choice not in SUBJECTS:
        print("Invalid choice. Exiting.")
        exit()

    subject = SUBJECTS[choice]
    print(f"\nLoaded subject: {subject['name'].capitalize()}")
    print("Type 'exit' to quit")
    print("=" * 50)

    while True:
        question = input("\nAsk a question: ").strip()
        if not question:
            continue
        if question.lower() == "exit":
            print("Goodbye! See you next time")
            break

        results = retrieve(question, subject["path"], subject["topics"])

        if not results:
            print(" No relevant chunks found!")
        else:
            print(f"\n Found {len(results)} relevant chunks:")
            for i, chunk in enumerate(results):
                print(f"\n--- Result {i+1} ---")
                print(chunk)
                print("-" * 30)