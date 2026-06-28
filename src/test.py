"""
Batch retrieval tester for Sala AI.
Runs a list of sample questions against each subject's FAISS index
and saves results to a JSON file + prints a quick summary to console.

Usage:
    python test_retrieval.py
    python test_retrieval.py 2        # only test subject "2" (statistics)
"""

import sys
import json
from datetime import datetime
from retreival import SUBJECTS, retrieve   # matches your actual filename

# ---------------------------------------------------------------------------
# Test questions per subject
# ---------------------------------------------------------------------------
TEST_QUESTIONS = {
    "1": [  # calculus1
        "What is a derivative?",
        "How do you find the domain of a function?",
        "Explain the chain rule with an example.",
        "What is the difference between a limit and continuity?",
        "How do you find local maxima and minima?",
        "What is the mean value theorem?",
        "How do you compute the area between two curves?",
        "What is l'hopital's rule used for?",
        "Explain related rates problems.",
        "What is the fundamental theorem of calculus?",
    ],
    "2": [  # statistics
        "What is the difference between mean and median?",
        "How do you calculate standard deviation?",
        "What is a p-value?",
        "Explain the central limit theorem.",
        "What is the difference between type I and type II error?",
        "How does a confidence interval work?",
        "What is conditional probability?",
        "Explain the difference between a t-test and a z-test.",
        "What is a chi-square test used for?",
        "How do you interpret a regression line's slope?",
    ],
    "3": [  # algebra
        "What is slope-intercept form?",
        "How do you solve a system of equations by substitution?",
        "What is the difference between a function and a relation?",
        "How do you factor a quadratic trinomial?",
        "What is the quadratic formula?",
        "Explain exponential growth vs decay.",
        "What is a residual in a scatter plot?",
        "How do you find the vertex of a parabola?",
        "What is the discriminant and what does it tell you?",
        "Explain arithmetic vs geometric sequences.",
    ],
    "4": [  # calculus2
        "What is a Riemann sum?",
        "How do you use u-substitution?",
        "What is the difference between the disk and shell method?",
        "Explain integration by parts.",
        "What is the ratio test used for?",
        "How do you find the radius of convergence of a power series?",
        "What is a Taylor series?",
        "Explain separable differential equations.",
        "How do you convert between polar and rectangular coordinates?",
        "What is the integral test for convergence?",
    ],
}

CHUNK_PREVIEW_LEN = 150  # chars shown in console preview


def run_tests(subject_keys):
    all_results = {}

    for key in subject_keys:
        subject = SUBJECTS[key]
        name = subject["name"]
        questions = TEST_QUESTIONS.get(key, [])

        print("\n" + "=" * 60)
        print(f"Subject: {name.upper()} ({len(questions)} questions)")
        print("=" * 60)

        subject_results = []

        for q in questions:
            try:
                results = retrieve(q, subject["path"], subject["topics"])
            except Exception as e:
                print(f"  [ERROR] '{q}' -> {e}")
                subject_results.append({
                    "question": q,
                    "error": str(e),
                    "num_results": 0,
                    "results": [],
                })
                continue

            status = "OK" if results else "EMPTY"
            print(f"  [{status}] ({len(results)} chunks) {q}")

            if results:
                preview = str(results[0])[:CHUNK_PREVIEW_LEN].replace("\n", " ")
                print(f"         top chunk: {preview}...")

            subject_results.append({
                "question": q,
                "num_results": len(results),
                "results": results,
            })

        all_results[name] = subject_results

    return all_results


def print_summary(all_results):
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for name, results in all_results.items():
        total = len(results)
        empty = sum(1 for r in results if r["num_results"] == 0)
        errors = sum(1 for r in results if "error" in r)
        print(f"  {name:<15} total={total:<3} empty={empty:<3} errors={errors}")


if __name__ == "__main__":
    # Optional CLI arg: test only one subject, e.g. `python test_retrieval.py 2`
    if len(sys.argv) > 1 and sys.argv[1] in SUBJECTS:
        keys_to_test = [sys.argv[1]]
    else:
        keys_to_test = list(SUBJECTS.keys())

    all_results = run_tests(keys_to_test)
    print_summary(all_results)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_file = f"test_results_{timestamp}.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)

    print(f"\nFull results saved to: {out_file}")