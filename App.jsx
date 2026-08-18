import { useState } from "react";
import "./App.css";

function App() {
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);
  const [currentReel, setCurrentReel] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const reels = [
    {
      emoji: "☕",
      title: "Java Meme",
      description:
        "A funny Reel about Java developers debugging code.",
      signals: ["java", "programming", "developer"],
    },
    {
      emoji: "💻",
      title: "Coding Interview Joke",
      description:
        "A humorous Reel about struggling with coding interview questions.",
      signals: [
        "programming",
        "developer",
        "software-engineering",
        "coding-interview",
      ],
    },
    {
      emoji: "👨‍💻",
      title: "Software Engineer Lifestyle",
      description:
        "A day-in-the-life Reel showing the work and lifestyle of a software engineer.",
      signals: ["software-engineering", "developer", "career"],
    },
    {
      emoji: "💻",
      title: "Laptop Comparison",
      description:
        "A comparison of laptops for programmers and developers.",
      signals: ["developer-hardware", "programming", "technology"],
    },
    {
      emoji: "🚀",
      title: "Tech Career Reel",
      description:
        "A Reel discussing skills needed to start a career in technology.",
      signals: ["career", "technology", "software-engineering"],
    },
    {
      emoji: "😂",
      title: "Programmer Meme",
      description:
        "A relatable meme about bugs, deadlines and programming.",
      signals: ["programming", "developer", "software-engineering"],
    },
  ];

  /*
   * Candidate technology recommendations.
   * Each candidate has:
   * - relevance
   * - educational value
   * - hype risk
   */

  const recommendations = [
    {
      title:
        "How DSA Concepts Actually Appear in Software Engineering Interviews",
      category: "DSA",
      difficulty: "Intermediate",
      relevance: 95,
      education: 94,
      hype: 5,
    },
    {
      title:
        "How Java Applications Work Behind the Scenes",
      category: "Java",
      difficulty: "Beginner",
      relevance: 88,
      education: 91,
      hype: 4,
    },
    {
      title:
        "What Software Engineers Actually Do During a Typical Workday",
      category: "Career",
      difficulty: "Beginner",
      relevance: 89,
      education: 86,
      hype: 8,
    },
    {
      title:
        "How to Choose the Right Laptop for Software Development",
      category: "Hardware",
      difficulty: "Beginner",
      relevance: 84,
      education: 82,
      hype: 7,
    },
    {
      title:
        "Cloud Computing Fundamentals Every Developer Should Know",
      category: "Cloud",
      difficulty: "Intermediate",
      relevance: 78,
      education: 90,
      hype: 3,
    },
    {
      title:
        "Cybersecurity Basics Every Software Developer Should Understand",
      category: "Cybersecurity",
      difficulty: "Beginner",
      relevance: 76,
      education: 92,
      hype: 2,
    },
    {
      title:
        "AI Fundamentals: How Modern AI Systems Actually Work",
      category: "AI",
      difficulty: "Intermediate",
      relevance: 75,
      education: 95,
      hype: 5,
    },
    {
      title:
        "10 AI Tools That Will Get You a Job",
      category: "AI",
      difficulty: "Beginner",
      relevance: 65,
      education: 35,
      hype: 95,
    },
  ];

  /*
   * Convert Reel signals into broader interests.
   */

  const inferInterest = (reel) => {
    const allSignals = reels.flatMap((item) => item.signals);

    const counts = {};

    allSignals.forEach((signal) => {
      counts[signal] = (counts[signal] || 0) + 1;
    });

    const programmingScore =
      (counts["programming"] || 0) +
      (counts["developer"] || 0) +
      (counts["software-engineering"] || 0) +
      (counts["coding-interview"] || 0);

    const careerScore =
      (counts["career"] || 0) +
      (counts["technology"] || 0);

    if (reel.title === "Laptop Comparison") {
      return {
        interest: "Software Engineering & Developer Technology",
        reason:
          "Although the current Reel is about laptops, the interaction history repeatedly connects hardware with programming and developer content. This suggests interest in technology used by software engineers rather than hardware alone.",
      };
    }

    if (programmingScore >= 5) {
      return {
        interest: "Software Engineering & Technology",
        reason:
          "The student interacted with programming memes, coding interviews, software-engineer content and developer topics. These signals point to a broader software-engineering interest instead of a narrow interest in one programming language.",
      };
    }

    if (careerScore >= 2) {
      return {
        interest: "Technology Career & Software Engineering",
        reason:
          "Career and technology signals appear repeatedly in the interaction history, suggesting interest in building a career in technology.",
      };
    }

    return {
      interest: "General Technology",
      reason:
        "The interaction history contains several technology-related signals, but there is not enough evidence to identify a narrower interest with high confidence.",
    };
  };

  /*
   * Score recommendations.
   */

  const scoreRecommendations = (interest) => {
    return recommendations
      .map((item) => {
        let score =
          item.relevance * 0.45 +
          item.education * 0.45 -
          item.hype * 0.25;

        if (
          interest.includes("Software Engineering") &&
          ["DSA", "Java", "Career"].includes(item.category)
        ) {
          score += 15;
        }

        if (
          interest.includes("Developer Technology") &&
          item.category === "Hardware"
        ) {
          score += 18;
        }

        if (
          interest.includes("Career") &&
          item.category === "Career"
        ) {
          score += 18;
        }

        return {
          ...item,
          score: Math.round(score),
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const analyzeInterests = () => {
    setAnalyzing(true);
    setAnalyzed(false);

    const reel = selectedReel || reels[1];

    setCurrentReel(reel);

    setTimeout(() => {
      const inferred = inferInterest(reel);

      const scoredRecommendations = scoreRecommendations(
        inferred.interest
      );

      const bestRecommendation =
        scoredRecommendations[0];

      setAnalysis({
        interest: inferred.interest,
        reason: inferred.reason,
        recommendation: bestRecommendation.title,
        category: bestRecommendation.category,
        difficulty: bestRecommendation.difficulty,
        confidence:
          bestRecommendation.score >= 85
            ? "High"
            : bestRecommendation.score >= 70
            ? "Medium"
            : "Low",
        score: bestRecommendation.score,
        candidates: scoredRecommendations,
      });

      setAnalyzing(false);
      setAnalyzed(true);
    }, 1500);
  };

  const selectReel = (reel) => {
    setSelectedReel(reel);
    setAnalyzed(false);
    setAnalysis(null);
  };

  const signalLabels = {
    java: "Java",
    programming: "Programming",
    developer: "Developer",
    "software-engineering": "Software Engineering",
    "coding-interview": "Coding Interview",
    "developer-hardware": "Developer Hardware",
    technology: "Technology",
    career: "Career",
  };

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div className="logo">
          ⚡ ReelMind AI
        </div>

        <div className="tagline">
          Make your scrolling more useful
        </div>
      </header>


      <main className="container">

        {/* HERO */}

        <section className="hero">

          <div className="hero-icon">
            🧠
          </div>

          <h1>
            Turn your Reels into
            <span> useful learning</span>
          </h1>

          <p>
            Our AI analyzes what you watch, infers your
            underlying interests, and recommends useful
            technology content.
          </p>

        </section>


        {/* REEL INPUT */}

        <section className="card">

          <h2>
            📱 Student's Recent Reels
          </h2>

          <p className="section-description">
            Select a Reel to analyze the student's interaction.
          </p>


          <div className="reels-grid">

            {reels.map((reel, index) => (

              <button
                className={`reel-card ${
                  selectedReel?.title === reel.title
                    ? "selected"
                    : ""
                }`}
                key={index}
                onClick={() => selectReel(reel)}
              >

                <div className="reel-emoji">
                  {reel.emoji}
                </div>

                <div className="reel-content">

                  <h3>
                    {reel.title}
                  </h3>

                  <p>
                    {reel.description}
                  </p>

                </div>

              </button>

            ))}

          </div>


          <button
            className="analyze-button"
            onClick={analyzeInterests}
            disabled={analyzing}
          >

            {analyzing
              ? "🧠 AI is analyzing..."
              : "🧠 Analyze My Interests"}

          </button>

        </section>


        {/* RESULTS */}

        {analyzed && analysis && (

          <section className="results">

            {/* AI THINKING */}

            <div className="thinking-box">

              <div className="result-label">
                🧠 HOW THE AI THINKS
              </div>


              <div className="thinking-flow">

                <div className="thinking-step">
                  <strong>
                    📱 Interactions
                  </strong>

                  <span>
                    Reel history
                  </span>
                </div>


                <div className="arrow">
                  →
                </div>


                <div className="thinking-step">
                  <strong>
                    🔎 Signals
                  </strong>

                  <span>
                    Topic + context
                  </span>
                </div>


                <div className="arrow">
                  →
                </div>


                <div className="thinking-step">
                  <strong>
                    🧩 Clustering
                  </strong>

                  <span>
                    Related interests
                  </span>
                </div>


                <div className="arrow">
                  →
                </div>


                <div className="thinking-step">
                  <strong>
                    🧠 Interest
                  </strong>

                  <span>
                    {analysis.interest}
                  </span>
                </div>


                <div className="arrow">
                  →
                </div>


                <div className="thinking-step">
                  <strong>
                    🎯 Ranking
                  </strong>

                  <span>
                    Relevance + value
                  </span>
                </div>

              </div>

            </div>


            <div className="result-header">
              ✨ AI Analysis Complete
            </div>


            {/* CURRENT REEL */}

            <div className="interest-box">

              <div className="result-label">
                🎬 CURRENT REEL
              </div>

              <h3>
                {currentReel.title}
              </h3>

              <p>
                {currentReel.description}
              </p>


              <div className="result-label">
                INTEREST DETECTED
              </div>

              <h2>
                {analysis.interest}
              </h2>


              <div className="result-label">
                WHY
              </div>

              <p>
                {analysis.reason}
              </p>

            </div>


            {/* RECOMMENDATION RANKING */}

            <div className="ranking-box">

              <div className="result-label">
                🏆 RECOMMENDATION RANKING
              </div>

              <p className="ranking-description">
                The agent compares candidate Reels using
                relevance, educational value and a penalty
                for hype-oriented content.
              </p>


              <div className="candidate-list">

                {analysis.candidates
                  .slice(0, 5)
                  .map((candidate, index) => (

                    <div
                      className={`candidate ${
                        index === 0
                          ? "winner"
                          : ""
                      }`}
                      key={candidate.title}
                    >

                      <div className="candidate-rank">
                        {index === 0
                          ? "🏆"
                          : `#${index + 1}`}
                      </div>


                      <div className="candidate-info">

                        <strong>
                          {candidate.title}
                        </strong>

                        <span>
                          {candidate.category}
                        </span>

                      </div>


                      <div className="candidate-score">

                        <strong>
                          {candidate.score}
                        </strong>

                        <small>
                          score
                        </small>

                      </div>

                    </div>

                  ))}

              </div>

            </div>


            {/* FINAL RECOMMENDATION */}

            <div className="recommendation-box">

              <div className="result-label">
                🚀 RECOMMENDED TECH REEL
              </div>


              <h2>
                {analysis.recommendation}
              </h2>


              <div className="details">

                <div>
                  <strong>
                    CATEGORY
                  </strong>

                  <span>
                    {analysis.category}
                  </span>
                </div>


                <div>
                  <strong>
                    DIFFICULTY
                  </strong>

                  <span>
                    {analysis.difficulty}
                  </span>
                </div>


                <div>
                  <strong>
                    CONFIDENCE
                  </strong>

                  <span>
                    {analysis.confidence}
                  </span>
                </div>

              </div>


              <div className="score-display">
                <span>
                  Recommendation Score
                </span>

                <strong>
                  {analysis.score}/100
                </strong>
              </div>


              <div className="result-label">
                WHY THIS RECOMMENDATION
              </div>


              <p>
                The recommendation connects multiple
                interaction signals to the student's broader
                technology interest instead of matching only
                the current Reel's keywords.
              </p>


              <p>
                The agent also considers educational value
                and penalizes hype-heavy recommendations.
                This prevents content such as
                "10 AI tools that will get you a job" from
                automatically winning just because AI is
                currently popular.
              </p>

            </div>


            {/* INTEREST SIGNALS */}

            <div className="signals-box">

              <div className="result-label">
                🧠 INTEREST SIGNALS
              </div>


              <div className="signals-grid">

                {reels.map((reel, index) => (

                  <div
                    className="signal-card"
                    key={index}
                  >

                    <span className="signal-icon">
                      {reel.emoji}
                    </span>


                    <div>

                      <strong>
                        {reel.title}
                      </strong>

                      <small>
                        {reel.signals
                          .slice(0, 2)
                          .map(
                            (signal) =>
                              signalLabels[signal]
                          )
                          .join(" / ")}
                      </small>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </section>

        )}


        <footer>
          🧠 ReelMind AI • Turning scrolling into learning
        </footer>

      </main>

    </div>
  );
}

export default App;