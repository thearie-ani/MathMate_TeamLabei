// Course: calculus 1

export const functionQuestions = [
  {
    text: "A set of inputs, a set of outputs, and a rule for assigning each input to exactly one output is the definition of a:",
    options: ["Relation", "Function", "Domain", "Intercept"],
    correctIndex: 1,
    explaination:
      "A function is a special relation where each input maps to exactly one output.",
    points: 1,
  },
  {
    text: "The set of all possible inputs for a function is called the:",
    options: ["Range", "Codomain", "Domain", "Output set"],
    correctIndex: 2,
    explaination:
      "The set of inputs for which a function is defined is its domain.",
    points: 1,
  },
  {
    text: "If a function is symmetric about the y-axis, it is considered:",
    options: ["Odd", "Even", "Periodic", "Transcendental"],
    correctIndex: 1,
    explaination:
      "A function is even if f(-x) = f(x) for all x in its domain, which results in symmetry about the y-axis.",
    points: 1,
  },
  {
    text: "Which test is used to determine if a graph represents a function?",
    options: [
      "Horizontal line test",
      "Symmetry test",
      "Zeros test",
      "Vertical line test",
    ],
    correctIndex: 3,
    explaination:
      "A graph represents a function if every vertical line intersects the graph at most once.",
    points: 1,
  },
  {
    text: "A function that cannot be expressed by a combination of basic arithmetic operations is called:",
    options: [
      "Algebraic",
      "Polynomial",
      "Transcendental",
      "Piecewise",
    ],
    correctIndex: 2,
    explaination:
      "Transcendental functions transcend algebra and include trigonometric, exponential, and logarithmic functions.",
    points: 1,
  },
  {
    text: "To define the composition (f ∘ g)(x), what must be true about the range of g?",
    options: [
      "It must be equal to the domain of f.",
      "It must be a subset of the domain of f.",
      "It must contain only positive values.",
      "It must be identical to the range of f.",
    ],
    correctIndex: 1,
    explaination:
      "For a composite function to be defined, the output of the inner function must be a valid input for the outer function.",
    points: 1,
  },
  {
    text: "What are the zeros of a function?",
    options: [
      "The y-intercepts",
      "The values of x where f(x) = 0",
      "The values of x where x = 0",
      "The minimum points",
    ],
    correctIndex: 1,
    explaination:
      "Zeros are the values of x that make the function output zero, indicating where the graph intersects the x-axis.",
    points: 1,
  },
  {
    text: "The natural domain of the square root function f(x) = √x is:",
    options: [
      "All real numbers",
      "(-∞, 0]",
      "[0, ∞)",
      "(0, ∞)",
    ],
    correctIndex: 2,
    explaination:
      "The square root function gives a real output only for non-negative inputs.",
    points: 1,
  },
  {
    text: "Which of the following is an example of an odd function?",
    options: [
      "f(x) = x²",
      "f(x) = |x|",
      "f(x) = x³",
      "f(x) = eˣ",
    ],
    correctIndex: 2,
    explaination:
      "The power function x³ is odd because f(-x) = -f(x), and its graph is symmetric about the origin.",
    points: 1,
  },
  {
    text: "A function defined by different formulas on different parts of its domain is a:",
    options: [
      "Composite function",
      "Rational function",
      "Piecewise-defined function",
      "Linear function",
    ],
    correctIndex: 2,
    explaination:
      "Piecewise functions use different rules depending on where the input falls in the domain.",
    points: 1,
  },
  {
    text: "The slope of a linear function represents:",
    options: [
      "The y-intercept",
      "The change in y for each unit change in x",
      "The zero of the function",
      "The total area under the line",
    ],
    correctIndex: 1,
    explaination:
      "Slope measures the rate of change of the dependent variable relative to the independent variable.",
    points: 1,
  },
  {
    text: "If f(x) is one-to-one, what test does its graph pass?",
    options: [
      "Vertical line test",
      "Horizontal line test",
      "Origin symmetry test",
      "Power rule test",
    ],
    correctIndex: 1,
    explaination:
      "A function is one-to-one if every horizontal line intersects its graph at most once.",
    points: 1,
  },
  {
    text: "In the expression bˣ, the number b is called the:",
    options: [
      "Exponent",
      "Argument",
      "Base",
      "Power",
    ],
    correctIndex: 2,
    explaination:
      "The base is the constant value raised to a variable exponent.",
    points: 1,
  },
  {
    text: "The domain of a rational function f(x) = P(x)/Q(x) is all x such that:",
    options: [
      "P(x) ≠ 0",
      "Q(x) ≠ 0",
      "x > 0",
      "Q(x) = 0",
    ],
    correctIndex: 1,
    explaination:
      "A rational function is undefined wherever the denominator equals zero.",
    points: 1,
  },
  {
    text: "For a polynomial function of degree n, what determines the end behavior as x → ∞?",
    options: [
      "The constant term",
      "The sum of all coefficients",
      "The leading coefficient and whether n is even or odd",
      "The number of zeros",
    ],
    correctIndex: 2,
    explaination:
      "The end behavior depends only on the leading coefficient and whether the degree is even or odd.",
    points: 2,
  },
  {
    text: "If a function f is periodic with period P, then f(x + P) is equal to:",
    options: [
      "f(x)",
      "f(x) + P",
      "P × f(x)",
      "f(x) / P",
    ],
    correctIndex: 0,
    explaination:
      "Periodic functions repeat their values every P units.",
    points: 2,
  },
  {
    text: "Which of the following is true for the function f(x) = x^(1/n) when n is even?",
    options: [
      "The domain is all real numbers.",
      "The function is odd.",
      "The domain is [0, ∞).",
      "The graph is symmetric about the origin.",
    ],
    correctIndex: 2,
    explaination:
      "Even-root functions are defined only for non-negative real numbers.",
    points: 2,
  },
];

export const limitQuestions = [
  {
    text: "The process of letting x approach a value a to see what value f(x) approaches is called:",
    options: [
      "Differentiation",
      "Integration",
      "Taking a limit",
      "Simplification",
    ],
    correctIndex: 2,
    explaination:
      "A limit describes the behavior of a function near a specific point.",
    points: 1,
  },
  {
    text: "A two-sided limit lim(x→a) f(x) = L exists if and only if:",
    options: [
      "f(a) is defined.",
      "f(a) = L.",
      "The left-hand and right-hand limits both exist and equal L.",
      "The function is a polynomial.",
    ],
    correctIndex: 2,
    explaination:
      "For a limit to exist at a point, the function must approach the same value from both directions.",
    points: 1,
  },
  {
    text: "If f(x) increases without bound as x approaches a, the line x = a is a:",
    options: [
      "Horizontal asymptote",
      "Vertical asymptote",
      "Slant asymptote",
      "Oblique asymptote",
    ],
    correctIndex: 1,
    explaination:
      "A vertical asymptote occurs when a function approaches infinity as x approaches a finite value.",
    points: 1,
  },
  {
    text: "A function f is continuous at a if which of the following is true?",
    options: [
      "f(a) is defined.",
      "lim(x→a) f(x) exists.",
      "lim(x→a) f(x) = f(a).",
      "All of the above.",
    ],
    correctIndex: 3,
    explaination:
      "Continuity requires the function to be defined, the limit to exist, and the limit to equal the function value.",
    points: 1,
  },
  {
    text: "A gap in a graph where the left and right limits exist but are not equal is a:",
    options: [
      "Removable discontinuity",
      "Jump discontinuity",
      "Infinite discontinuity",
      "Oscillating discontinuity",
    ],
    correctIndex: 1,
    explaination:
      "A jump discontinuity occurs when the one-sided limits are finite but different.",
    points: 1,
  },
  {
    text: "The Intermediate Value Theorem (IVT) requires the function to be:",
    options: [
      "Differentiable",
      "Symmetric",
      "Continuous over a closed interval",
      "A transcendental function",
    ],
    correctIndex: 2,
    explaination:
      "The Intermediate Value Theorem applies to functions that are continuous on a closed interval.",
    points: 1,
  },
  {
    text: "The rigorous mathematical definition of a limit is known as the:",
    options: [
      "Squeeze definition",
      "Epsilon-delta definition",
      "Difference quotient",
      "Power rule",
    ],
    correctIndex: 1,
    explaination:
      "The epsilon-delta definition provides the formal framework for proving limits.",
    points: 1,
  },
  {
    text: "What is the limit of a constant c as x approaches a?",
    options: [
      "a",
      "0",
      "c",
      "Does not exist",
    ],
    correctIndex: 2,
    explaination:
      "The limit of a constant function is always the constant itself.",
    points: 1,
  },
  {
    text: "If lim(x→∞) f(x) = L, then the line y = L is a:",
    options: [
      "Vertical asymptote",
      "Horizontal asymptote",
      "Tangent line",
      "Secant line",
    ],
    correctIndex: 1,
    explaination:
      "A horizontal asymptote describes the end behavior of a function as x approaches positive or negative infinity.",
    points: 1,
  },
  {
    text: "The slope of a tangent line to a curve at a point is found using:",
    options: [
      "Only algebraic multiplication",
      "A limit of secant line slopes",
      "The area under the curve",
      "The y-intercept",
    ],
    correctIndex: 1,
    explaination:
      "The tangent line slope is the value that secant line slopes approach as the distance between points approaches zero.",
    points: 1,
  },
  {
    text: "Average velocity over a time interval [a, t] is calculated by:",
    options: [
      "s(t) + s(a)",
      "s'(t)",
      "(s(t) - s(a)) / (t - a)",
      "s(t) × s(a)",
    ],
    correctIndex: 2,
    explaination:
      "Average velocity equals the change in position divided by the change in time.",
    points: 1,
  },
  {
    text: "If f is continuous at L and lim(x→a) g(x) = L, then lim(x→a) f(g(x)) is:",
    options: [
      "g(L)",
      "f(a)",
      "f(L)",
      "0",
    ],
    correctIndex: 2,
    explaination:
      "The composite function theorem allows the limit to be evaluated by substituting the inner limit into the outer function.",
    points: 2,
  },
  {
    text: "Which theorem is useful for finding the limit of a function trapped between two other functions?",
    options: [
      "Mean Value Theorem",
      "Intermediate Value Theorem",
      "Squeeze Theorem",
      "Fundamental Theorem of Calculus",
    ],
    correctIndex: 2,
    explaination:
      "The Squeeze Theorem uses the limits of two bounding functions to determine the limit of the function between them.",
    points: 2,
  },
  {
    text: "If lim(x→a) f(x) exists but is not equal to f(a), the discontinuity at a is:",
    options: [
      "Infinite",
      "Jump",
      "Removable",
      "Not a discontinuity",
    ],
    correctIndex: 2,
    explaination:
      "A removable discontinuity occurs when the limit exists but differs from the function value.",
    points: 2,
  },
  {
    text: "For lim(x→0) 1/xⁿ, if n is a positive even integer, the limit is:",
    options: [
      "0",
      "-∞",
      "∞",
      "Does not exist",
    ],
    correctIndex: 2,
    explaination:
      "Since xⁿ is always positive for even n, 1/xⁿ approaches positive infinity from both sides of zero.",
    points: 2,
  },
  {
    text: "If a function is differentiable at point a, then it must also be:",
    options: [
      "Odd",
      "Symmetric",
      "Continuous at a",
      "Non-zero at a",
    ],
    correctIndex: 2,
    explaination:
      "Differentiability always implies continuity, although the converse is not necessarily true.",
    points: 2,
  },
  {
    text: "A function f has a vertical asymptote at x = a if:",
    options: [
      "f(a) = 0",
      "lim(x→a⁺) f(x) is infinite",
      "lim(x→∞) f(x) = a",
      "f'(a) = 0",
    ],
    correctIndex: 1,
    explaination:
      "A vertical asymptote exists when at least one one-sided limit approaches positive or negative infinity.",
    points: 2,
  },
];

export const derivativesQuestions = [
  {
    text: "The derivative of a function at a point represents the:",
    options: [
      "Total area under the graph",
      "Instantaneous rate of change",
      "Average value of the function",
      "y-coordinate of the point",
    ],
    correctIndex: 1,
    explaination:
      "The derivative measures how fast a function changes at a specific moment.",
    points: 1,
  },
  {
    text: "The process of finding a derivative is called:",
    options: ["Integration", "Evaluation", "Differentiation", "Composing"],
    correctIndex: 2,
    explaination: "Differentiation is the process of computing a derivative.",
    points: 1,
  },
  {
    text: "According to the Power Rule, the derivative of x^n is:",
    options: ["x^(n-1)", "n x^(n+1)", "n x^(n-1)", "n/x"],
    correctIndex: 2,
    explaination:
      "The exponent becomes the coefficient and the power decreases by one.",
    points: 1,
  },
  {
    text: "The derivative of a constant function f(x) = c is:",
    options: ["c", "1", "x", "0"],
    correctIndex: 3,
    explaination:
      "Constants do not change, so their derivative is zero.",
    points: 1,
  },
  {
    text: "What is the derivative of f(x) = e^x?",
    options: ["x e^(x-1)", "ln(x)", "e^x", "1/e^x"],
    correctIndex: 2,
    explaination:
      "The exponential function e^x is its own derivative.",
    points: 1,
  },
  {
    text: "Velocity is the derivative of which function?",
    options: ["Acceleration", "Position", "Speed", "Cost"],
    correctIndex: 1,
    explaination:
      "Velocity is the rate of change of position with respect to time.",
    points: 1,
  },
  {
    text: "Which rule is used to differentiate a product of two functions?",
    options: ["Sum Rule", "Quotient Rule", "Product Rule", "Chain Rule"],
    correctIndex: 2,
    explaination:
      "The product rule is (f'g + fg').",
    points: 1,
  },
  {
    text: "The derivative of ln(x) is:",
    options: ["e^x", "x", "1/x", "1/ln(x)"],
    correctIndex: 2,
    explaination:
      "The derivative of ln(x) is 1/x.",
    points: 1,
  },
  {
    text: "To differentiate f(g(x)), you must use the:",
    options: ["Power Rule", "Chain Rule", "Product Rule", "Constant Rule"],
    correctIndex: 1,
    explaination:
      "Chain rule: f'(g(x)) · g'(x).",
    points: 2,
  },
  {
    text: "Marginal cost in economics is the derivative of:",
    options: ["Revenue function", "Profit function", "Cost function", "Inventory function"],
    correctIndex: 2,
    explaination:
      "Marginal cost is the derivative of the cost function.",
    points: 2,
  },
  {
    text: "Implicit differentiation is used when:",
    options: [
      "y is explicitly defined",
      "y cannot be easily isolated",
      "The function is polynomial",
      "Finding area under curve",
    ],
    correctIndex: 1,
    explaination:
      "Used when y is defined implicitly in terms of x.",
    points: 2,
  },
  {
    text: "Acceleration is the derivative of:",
    options: ["Position", "Velocity", "Time", "Mass"],
    correctIndex: 1,
    explaination:
      "Acceleration is the derivative of velocity.",
    points: 1,
  },
  {
    text: "Speed is defined as:",
    options: [
      "Derivative of position",
      "Derivative of acceleration",
      "Absolute value of velocity",
      "Second derivative of position",
    ],
    correctIndex: 2,
    explaination:
      "Speed is magnitude of velocity.",
    points: 1,
  },
  {
    text: "Derivative of a^x (a > 0) is:",
    options: ["x a^(x-1)", "a^x ln(a)", "a^x / ln(a)", "e^x"],
    correctIndex: 1,
    explaination:
      "Derivative of a^x is a^x ln(a).",
    points: 2,
  },
  {
    text: "Best method to differentiate x^x is:",
    options: [
      "Power Rule",
      "Quotient Rule",
      "Logarithmic Differentiation",
      "Constant Rule",
    ],
    correctIndex: 2,
    explaination:
      "Logarithmic differentiation simplifies variable exponents.",
    points: 2,
  },
  {
    text: "Derivative of sin(x) is:",
    options: ["cos(x)", "-cos(x)", "sin(x)", "tan(x)"],
    correctIndex: 0,
    explaination:
      "Derivative of sin(x) is cos(x).",
    points: 1,
  },
  {
    text: "Derivative of tan(x) is:",
    options: ["sec(x)", "sec^2(x)", "cot(x)", "-sec^2(x)"],
    correctIndex: 1,
    explaination:
      "Derivative of tan(x) is sec^2(x).",
    points: 1,
  },
];
export const applicationsQuestions = [
  {
    text: "A point c where f'(c) = 0 or undefined is called:",
    options: [
      "Inflection point",
      "Critical number",
      "Absolute maximum",
      "Vertical asymptote",
    ],
    correctIndex: 1,
    explaination:
      "Critical numbers are candidates for local extrema.",
    points: 1,
  },
  {
    text: "The largest value of a function on its domain is:",
    options: [
      "Local maximum",
      "Absolute maximum",
      "Critical point",
      "Relative maximum",
    ],
    correctIndex: 1,
    explaination:
      "Absolute maximum is the highest value on the entire domain.",
    points: 1,
  },
  {
    text: "If f'(x) > 0 on an interval, the function is:",
    options: ["Decreasing", "Increasing", "Constant", "Concave down"],
    correctIndex: 1,
    explaination:
      "Positive derivative means function is increasing.",
    points: 1,
  },
  {
    text: "If f'(x) < 0 on an interval, the function is:",
    options: ["Increasing", "Decreasing", "Concave up", "Undefined"],
    correctIndex: 1,
    explaination:
      "Negative derivative means function is decreasing.",
    points: 1,
  },
  {
    text: "The second derivative is used to test:",
    options: ["Intercepts", "Domain", "Concavity", "Zeros"],
    correctIndex: 2,
    explaination:
      "Second derivative determines concavity.",
    points: 1,
  },
  {
    text: "A point where concavity changes is called:",
    options: [
      "Extremum",
      "Inflection point",
      "Intercept",
      "Critical number",
    ],
    correctIndex: 1,
    explaination:
      "Inflection point = change in concavity.",
    points: 1,
  },
  {
    text: "L’Hôpital’s Rule is used for:",
    options: [
      "Derivatives",
      "Limits of indeterminate forms",
      "Integration",
      "Areas",
    ],
    correctIndex: 1,
    explaination:
      "Used for 0/0 or ∞/∞ limits.",
    points: 2,
  },
  {
    text: "Newton’s Method is used to find:",
    options: [
      "Derivatives",
      "Roots of a function",
      "Integrals",
      "Areas",
    ],
    correctIndex: 1,
    explaination:
      "Iterative method for solving f(x)=0.",
    points: 2,
  },
  {
    text: "Mean Value Theorem guarantees:",
    options: [
      "f'(c) equals average rate of change",
      "f(c)=0",
      "Function is constant",
      "Function is linear",
    ],
    correctIndex: 0,
    explaination:
      "Instantaneous slope equals average slope.",
    points: 2,
  },
  {
    text: "Related rates problems involve change with respect to:",
    options: ["Space", "Time", "Area", "Constants"],
    correctIndex: 1,
    explaination:
      "Everything is differentiated with respect to time.",
    points: 1,
  },
  {
    text: "Linear approximation uses:",
    options: [
      "Secant line",
      "Tangent line",
      "Parabola",
      "Circle",
    ],
    correctIndex: 1,
    explaination:
      "Tangent line approximates near a point.",
    points: 1,
  },
  {
    text: "Rolle’s Theorem requires:",
    options: [
      "f(a) = f(b)",
      "f'(x) > 0",
      "Function discontinuous",
      "Function undefined",
    ],
    correctIndex: 0,
    explaination:
      "Equal endpoints guarantee a stationary point.",
    points: 2,
  },
  {
    text: "Optimization problems aim to find:",
    options: [
      "Derivative",
      "Max or min values",
      "Limit",
      "Slope only",
    ],
    correctIndex: 1,
    explaination:
      "Optimization finds extrema.",
    points: 1,
  },
  {
    text: "If f''(x) > 0, graph is:",
    options: ["Concave down", "Concave up", "Linear", "Constant"],
    correctIndex: 1,
    explaination:
      "Positive second derivative means concave up.",
    points: 1,
  },
  {
    text: "Oblique asymptote occurs when:",
    options: [
      "Numerator degree < denominator",
      "Equal degrees",
      "Numerator degree = denominator + 1",
      "Denominator is zero",
    ],
    correctIndex: 2,
    explaination:
      "Degree difference of 1 creates slant asymptote.",
    points: 2,
  },
  {
    text: "Family of antiderivatives is:",
    options: ["f'(x)", "F(x)+C", "Limit", "Product"],
    correctIndex: 1,
    explaination:
      "All antiderivatives differ by constant C.",
    points: 1,
  },
  {
    text: "Fermat’s Theorem states:",
    options: [
      "f'(c)=0 at extrema",
      "Function is continuous",
      "Function is linear",
      "Function is constant",
    ],
    correctIndex: 0,
    explaination:
      "Local extrema imply derivative 0 or undefined.",
    points: 2,
  },
];
export const integrationQuestions = [
  {
    text: "Sigma notation (Σ) represents:",
    options: ["Limit", "Sum", "Derivative", "Integral"],
    correctIndex: 1,
    explaination:
      "Sigma notation is used for summation.",
    points: 1,
  },
  {
    text: "Riemann sums are used to:",
    options: [
      "Differentiate functions",
      "Approximate area under curves",
      "Find derivatives",
      "Solve equations",
    ],
    correctIndex: 1,
    explaination:
      "They approximate area using rectangles.",
    points: 1,
  },
  {
    text: "A definite integral represents:",
    options: [
      "Slope",
      "Net signed area",
      "Derivative",
      "Maximum value",
    ],
    correctIndex: 1,
    explaination:
      "Integral gives signed area under curve.",
    points: 1,
  },
  {
    text: "The integrand is:",
    options: [
      "The variable",
      "The function being integrated",
      "The limit",
      "The derivative",
    ],
    correctIndex: 1,
    explaination:
      "Integrand = function inside integral.",
    points: 1,
  },
  {
    text: "Fundamental Theorem of Calculus connects:",
    options: [
      "Limits and derivatives",
      "Derivatives and integrals",
      "Algebra and geometry",
      "Graphs and tables",
    ],
    correctIndex: 1,
    explaination:
      "It links differentiation and integration.",
    points: 1,
  },
  {
    text: "∫_a^b f(x) dx equals:",
    options: [
      "F(a) - F(b)",
      "F(b) - F(a)",
      "f(b) - f(a)",
      "f'(b) - f'(a)",
    ],
    correctIndex: 1,
    explaination:
      "Evaluate antiderivative at bounds.",
    points: 1,
  },
  {
    text: "Net Change Theorem states:",
    options: [
      "Integral = total change",
      "Integral = zero",
      "Integral = slope",
      "Integral = derivative",
    ],
    correctIndex: 0,
    explaination:
      "Integral of rate gives total change.",
    points: 1,
  },
  {
    text: "Substitution method is used to:",
    options: [
      "Differentiate",
      "Simplify integrals",
      "Find limits",
      "Graph functions",
    ],
    correctIndex: 1,
    explaination:
      "u-sub simplifies integration.",
    points: 1,
  },
  {
    text: "In definite integrals using substitution, you must:",
    options: [
      "Change only function",
      "Change limits",
      "Change derivative",
      "Nothing",
    ],
    correctIndex: 1,
    explaination:
      "Limits must match new variable.",
    points: 2,
  },
  {
    text: "Average value of f(x) on [a,b] is:",
    options: [
      "Integral only",
      "f(a)+f(b)/2",
      "(1/(b-a)) ∫ f(x) dx",
      "Derivative",
    ],
    correctIndex: 2,
    explaination:
      "Integral divided by interval length.",
    points: 2,
  },
  {
    text: "A function is integrable if it is:",
    options: ["Odd", "Positive", "Continuous", "Linear"],
    correctIndex: 2,
    explaination:
      "Continuous functions are integrable.",
    points: 1,
  },
  {
    text: "Mean Value Theorem for integrals gives:",
    options: [
      "f(c)=average value",
      "f'(c)=0",
      "Integral=0",
      "Slope=0",
    ],
    correctIndex: 0,
    explaination:
      "Function equals its average value at some point.",
    points: 2,
  },
  {
    text: "∫(1/x) dx equals:",
    options: [
      "1/x",
      "-1/x²",
      "ln|x| + C",
      "e^x",
    ],
    correctIndex: 2,
    explaination:
      "Integral of 1/x is ln|x|.",
    points: 2,
  },
  {
    text: "∫ e^x dx equals:",
    options: ["e^x + C", "xe^x", "1/e^x", "ln x"],
    correctIndex: 0,
    explaination:
      "e^x integrates to itself.",
    points: 1,
  },
  {
    text: "FTC Part 1 says derivative of ∫ f(t) dt is:",
    options: ["f(x)", "f(t)", "0", "F(x)"],
    correctIndex: 0,
    explaination:
      "Derivative returns original function.",
    points: 2,
  },
  {
    text: "Net signed area means:",
    options: [
      "Absolute area only",
      "Above minus below x-axis",
      "Only above x-axis",
      "Perimeter",
    ],
    correctIndex: 1,
    explaination:
      "Below x-axis counts negative.",
    points: 1,
  },
];

