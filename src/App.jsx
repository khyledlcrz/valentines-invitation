import { useState, useEffect } from "react";
import Confetti from "react-confetti";

//* Restaurant
import restaurant1 from "./images/restaurant/1.png";
import restaurant2 from "./images/restaurant/2.jpg";
import restaurant3 from "./images/restaurant/3.jpg";
import restaurant4 from "./images/restaurant/4.jpeg";
import restaurant5 from "./images/restaurant/5.jpeg";
import restaurant6 from "./images/restaurant/6.jpg";
import restaurant7 from "./images/restaurant/7.jpg";
import restaurant8 from "./images/restaurant/8.jpg";
import restaurant9 from "./images/restaurant/9.jpg";
import restaurant10 from "./images/restaurant/10.jpg";

//* Outfit
import outfit1 from "./images/outfits/1.jpg";
import outfit2 from "./images/outfits/2.png";
import outfit3 from "./images/outfits/3.jpg";

//* Signature
import signature from "./images/signature/signature.png";

//* Music
import backgroundMusic from "./music/song.mp3";
import letterMusic from "./music/song2.mp3";

function App() {
  const [stage, setStage] = useState("game"); // 'game', 'question', 'loading', 'restaurant', 'outfit', 'letter', 'reveal'
  const [showHint, setShowHint] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeModal, setShakeModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Scribble game state
  const WORDS = ["CAN", "I", "BE", "YOUR", "VALENTINE"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [completedWords, setCompletedWords] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [usedLetterIds, setUsedLetterIds] = useState([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  // Restaurant ranking state
  const [restaurantRankings, setRestaurantRankings] = useState({
    1: null,
    2: null,
    3: null,
  });

  // Outfit selection state (single choice)
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useState(() => {
    const audio = new Audio(backgroundMusic);
    audio.loop = true;
    audio.volume = 0.15;
    return audio;
  })[0];

  const letterAudioRef = useState(() => {
    const audio = new Audio(letterMusic);
    audio.loop = true;
    audio.volume = 0.15;
    return audio;
  })[0];

  // Initialize available letters (scrambled)
  useEffect(() => {
    const allLetters = "CANIBEYOURVALENTINE".split("");
    const scrambled = allLetters
      .map((letter, i) => ({ letter, id: i }))
      .sort(() => Math.random() - 0.5);
    setAvailableLetters(scrambled);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-transition from loading to restaurant
  useEffect(() => {
    if (stage === "loading") {
      const timer = setTimeout(() => {
        setStage("restaurant");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Switch music when entering/leaving letter stage
  useEffect(() => {
    if (stage === "letter") {
      // Fade out background music and play letter music
      audioRef.pause();
      letterAudioRef.currentTime = 0;
      letterAudioRef.muted = isMuted;
      letterAudioRef.play().catch(err => console.log("Letter music play failed:", err));
    } else if (stage === "reveal") {
      // Stop letter music and resume background music
      letterAudioRef.pause();
      audioRef.currentTime = 0;
      audioRef.muted = isMuted;
      audioRef.play().catch(err => console.log("Background music play failed:", err));
    }
  }, [stage, audioRef, letterAudioRef, isMuted]);

  // Background music control
  const startAudio = async () => {
    if (!audioStarted) {
      try {
        await audioRef.play();
        setAudioStarted(true);
      } catch (error) {
        console.log("Audio play failed:", error);
      }
    }
  };

  useEffect(() => {
    // Try autoplay on mount
    const playAudio = async () => {
      try {
        await audioRef.play();
        setAudioStarted(true);
      } catch (error) {
        console.log("Autoplay prevented:", error);
      }
    };
    playAudio();

    return () => {
      audioRef.pause();
    };
  }, [audioRef]);

  // Handle mute/unmute
  useEffect(() => {
    audioRef.muted = isMuted;
    letterAudioRef.muted = isMuted;
  }, [isMuted, audioRef, letterAudioRef]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleLetterClick = (letterId) => {
    // Start audio on first interaction
    startAudio();

    const clicked = availableLetters.find((l) => l.id === letterId);
    if (!clicked || selectedLetters.find((l) => l.id === letterId)) return;

    const newSelected = [...selectedLetters, clicked];
    setSelectedLetters(newSelected);

    // Check if word is complete
    const currentWord = WORDS[currentWordIndex];
    const formedWord = newSelected.map((l) => l.letter).join("");

    if (formedWord.length === currentWord.length) {
      if (formedWord === currentWord) {
        // Correct word!
        setCompletedWords([...completedWords, currentWord]);
        // Mark these letter IDs as used
        setUsedLetterIds([...usedLetterIds, ...newSelected.map((l) => l.id)]);

        if (currentWordIndex === WORDS.length - 1) {
          // All words complete!
          setTimeout(() => setStage("question"), 3500);
        } else {
          // Next word
          setTimeout(() => {
            setCurrentWordIndex(currentWordIndex + 1);
            setSelectedLetters([]);
          }, 800);
        }
      } else {
        // Wrong word
        setWrongAttempt(true);
        setTimeout(() => {
          setSelectedLetters([]);
          setWrongAttempt(false);
        }, 500);
      }
    }
  };

  const handleBackspace = () => {
    if (selectedLetters.length > 0) {
      setSelectedLetters(selectedLetters.slice(0, -1));
    }
  };

  const handleAnswerType = (e) => {
    const value = e.target.value.toUpperCase();
    setAnswer(value);

    if (value === "YES") {
      setTimeout(() => {
        setStage("loading");
      }, 500);
    }
  };

  const handleKeyboardClick = (key) => {
    // Start audio on first interaction
    startAudio();

    const newValue = (answer + key).toUpperCase();
    setAnswer(newValue);
    setShowHint(true);

    if (newValue === "YES") {
      setTimeout(() => {
        setStage("loading");
      }, 500);
    } else if (newValue === "NO") {
      // Shake the modal and clear after animation
      setShakeModal(true);
      setTimeout(() => {
        setShakeModal(false);
        setAnswer("");
      }, 500);
    }
  };

  const handleKeyboardBackspace = () => {
    setAnswer(answer.slice(0, -1));
  };

  // Scribble Game Stage
  const renderGame = () => {
    const currentWord = WORDS[currentWordIndex];

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
            Might be a little confusing...
          </h1>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Click the letters below to form each word!. Complete all words to
            reveal the message 💝
          </p>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 md:p-6 shadow-lg">
            {/* Completed Words Display - At the Top */}
            {completedWords.length > 0 && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  {completedWords.map((word, idx) => {
                    // Calculate starting index for this word
                    let letterStartIndex = 0;
                    for (let i = 0; i < idx; i++) {
                      letterStartIndex += completedWords[i].length;
                    }

                    return (
                      <div key={idx} className="flex gap-1">
                        {word.split("").map((letter, i) => {
                          const letterIndex = letterStartIndex + i;
                          const isComplete =
                            completedWords.length === WORDS.length;
                          return (
                            <div
                              key={i}
                              className={`w-10 h-10 md:w-12 md:h-12 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg ${
                                isComplete ? "animate-letter-zoom" : ""
                              }`}
                              style={
                                isComplete
                                  ? { animationDelay: `${letterIndex * 0.1}s` }
                                  : {}
                              }
                            >
                              {letter}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {/* Question mark when all words are complete */}
                  {completedWords.length === WORDS.length && (
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg animate-letter-zoom"
                      style={{
                        animationDelay: `${WORDS.join("").length * 0.1}s`,
                      }}
                    >
                      ?
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current word being formed - Input Area */}
            {currentWordIndex < WORDS.length && (
              <div className="mb-6 min-h-[60px] flex justify-center items-center">
                <div className="flex gap-1">
                  {selectedLetters.map((item, i) => (
                    <button
                      key={i}
                      onClick={handleBackspace}
                      className={`w-10 h-10 md:w-12 md:h-12 ${wrongAttempt ? "bg-red-500 animate-wiggle" : "bg-rose-500 hover:bg-rose-600"} rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg transition-all cursor-pointer transform hover:scale-105 active:scale-95`}
                    >
                      {item.letter}
                    </button>
                  ))}
                  {/* Empty boxes for remaining letters */}
                  {Array.from({
                    length: currentWord.length - selectedLetters.length,
                  }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Available Letters Grid */}
            <div className="flex flex-wrap gap-2 justify-center mb-4 max-w-md mx-auto">
              {availableLetters.map((item) => {
                const isSelected = selectedLetters.find(
                  (l) => l.id === item.id,
                );
                const isInCompletedWord = usedLetterIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleLetterClick(item.id)}
                    disabled={isSelected || isInCompletedWord}
                    className={`w-12 h-12 md:w-14 md:h-14 border-2 rounded-lg flex items-center justify-center font-bold text-xl md:text-2xl transition-all transform ${
                      isInCompletedWord
                        ? "bg-rose-100 border-rose-200 text-rose-400 cursor-not-allowed opacity-50"
                        : isSelected
                          ? "bg-rose-500 border-rose-600 text-white scale-90"
                          : "bg-white border-gray-300 text-gray-800 hover:border-rose-400 cursor-pointer hover:scale-110 active:scale-95 shadow-sm"
                    }`}
                  >
                    {!isInCompletedWord && item.letter}
                  </button>
                );
              })}
            </div>

            {/* Clear Button */}
            <div className="flex justify-center">
              <button
                onClick={handleBackspace}
                disabled={selectedLetters.length === 0}
                className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-rose-400 disabled:border-gray-200 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-gray-800 disabled:text-gray-400 font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              >
                ⌫
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Question Stage
  const renderQuestion = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
          Can I be your Valentine?
        </h1>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Type your answer...
          <br />
          Hint: Already there!!
        </p>

        <div
          className={`bg-white border-2 border-gray-200 rounded-2xl p-4 md:p-6 shadow-lg ${shakeModal ? "animate-wiggle" : ""}`}
        >
          {/* Answer Display */}
          <div className="mb-6 min-h-[60px] flex gap-2 justify-center items-center">
            {[0, 1, 2].map((index) => {
              const isNo =
                answer.startsWith("NO") || (answer === "N" && index === 0);
              const isComplete = answer === "YES";
              return (
                <div
                  key={index}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center font-bold text-xl md:text-2xl shadow-lg border-2 ${
                    answer[index]
                      ? isNo && index < 2
                        ? "bg-red-500 border-red-600 text-white"
                        : "bg-rose-500 border-rose-600 text-white"
                      : "bg-gray-100 border-gray-300"
                  } ${isComplete ? "animate-letter-zoom" : ""}`}
                  style={
                    isComplete ? { animationDelay: `${index * 0.15}s` } : {}
                  }
                >
                  {answer[index] || ""}
                </div>
              );
            })}
          </div>

          {/* Visual keyboard representation */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-center gap-1">
              {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyboardClick(key)}
                  className={`w-8 h-12 md:w-10 md:h-14 border-2 rounded-lg flex items-center justify-center font-bold text-sm transition-all transform hover:scale-110 active:scale-95 shadow-sm ${
                    "YES".includes(key)
                      ? "bg-rose-500 border-rose-600 text-white hover:bg-rose-600"
                      : "bg-white border-gray-300 text-gray-800 hover:border-rose-400"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-1">
              {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyboardClick(key)}
                  className={`w-8 h-12 md:w-10 md:h-14 border-2 rounded-lg flex items-center justify-center font-bold text-sm transition-all transform hover:scale-110 active:scale-95 shadow-sm ${
                    "YES".includes(key)
                      ? "bg-rose-500 border-rose-600 text-white hover:bg-rose-600"
                      : "bg-white border-gray-300 text-gray-800 hover:border-rose-400"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-1">
              <button
                onClick={handleKeyboardBackspace}
                className="w-16 h-12 md:w-20 md:h-14 bg-white border-2 border-gray-300 hover:border-rose-400 rounded-lg flex items-center justify-center text-gray-800 font-bold text-xs transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              >
                ⌫
              </button>
              {["Z", "X", "C", "V", "B", "N", "M"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyboardClick(key)}
                  className={`w-8 h-12 md:w-10 md:h-14 border-2 rounded-lg flex items-center justify-center font-bold text-sm transition-all transform hover:scale-110 active:scale-95 shadow-sm ${
                    "YES".includes(key)
                      ? "bg-rose-500 border-rose-600 text-white hover:bg-rose-600"
                      : "bg-white border-gray-300 text-gray-800 hover:border-rose-400"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs">
            💡 Try typing "NO" if you dare...
          </div>
        </div>
      </div>
    </div>
  );

  // Loading Stage
  const renderLoading = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8 text-6xl md:text-8xl animate-bounce-slow">✨</div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Can I be your Valentine?
        </h2>
        <div className="flex justify-center gap-2 mb-6">
          {["Y", "E", "S"].map((letter, i) => (
            <div
              key={i}
              className="w-16 h-16 md:w-20 md:h-20 bg-rose-500 border-2 border-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {letter}
            </div>
          ))}
        </div>
        <p className="text-gray-800 text-xl md:text-2xl font-semibold animate-pulse">
          Preparing something special...
        </p>
        <p className="text-gray-500 text-sm mt-2">Just a moment</p>
      </div>
    </div>
  );

  // Restaurant Selection Stage
  const renderRestaurant = () => {
    const restaurants = [
      {
        id: 1,
        name: "Aya by Hapag",
        cuisine: "Modern Filipino Cuisine",
        description:
          "An elegant dining space offering a refined and innovative take on traditional Filipino flavors.",
        image: restaurant1,
      },
      {
        id: 2,
        name: "Uma Nota",
        cuisine: "Japanese-Brazilian Cuisine",
        description:
          "A vibrant and energetic Nipo-Brazilian restobar featuring colorful decor and a lively atmosphere.",
        image: restaurant2,
      },
      {
        id: 3,
        name: "Papillon",
        cuisine: "Modern Southeast Asian Cuisine",
        description:
          "A chic and sophisticated spot known for its stylish interiors and contemporary Asian fusion dishes.",
        image: restaurant3,
      },
      {
        id: 4,
        name: "Grapevine",
        cuisine: "International Cuisine",
        description:
          "A cozy and welcoming neighborhood restaurant perfect for casual gatherings and hearty comfort food.",
        image: restaurant4,
      },
      {
        id: 5,
        name: "Lobby 385",
        cuisine: "International/Fusion Cuisine",
        description:
          "A versatile dining destination offering a mix of local and international favorites in a relaxed setting.",
        image: restaurant5,
      },
      {
        id: 6,
        name: "Osteria Antica",
        cuisine: "Italian Cuisine",
        description:
          "An authentic Italian osteria serving traditional pasta, wine, and classic rustic dishes.",
        image: restaurant6,
      },
      {
        id: 7,
        name: "12/10",
        cuisine: "Modern Japanese Cuisine",
        description:
          "A minimalist and intimate izakaya focused on curated small plates and premium drink pairings.",
        image: restaurant7,
      },
      {
        id: 8,
        name: "Tartufo",
        cuisine: "Italian Cuisine",
        description:
          "A sophisticated ristorante specializing in truffle-infused dishes and upscale Italian classics.",
        image: restaurant8,
      },
      {
        id: 9,
        name: "Emilia's",
        cuisine: "Filipino Cuisine",
        description:
          "A charming house of Filipino food that serves traditional heritage recipes in a warm environment.",
        image: restaurant9,
      },
      {
        id: 10,
        name: "Firefly Roof Deck",
        cuisine: "International Grill/Bar",
        description:
          "A breathtaking rooftop venue offering panoramic city views alongside grilled specialties and cocktails.",
        image: restaurant10,
      },
    ];

    const handleRestaurantClick = (restaurant) => {
      // Find the next available ranking slot
      for (let rank = 1; rank <= 3; rank++) {
        if (restaurantRankings[rank] === null) {
          setRestaurantRankings({
            ...restaurantRankings,
            [rank]: restaurant,
          });
          break;
        }
      }
    };

    const handleRemoveRanking = (rank) => {
      setRestaurantRankings({
        ...restaurantRankings,
        [rank]: null,
      });
    };

    const isRestaurantSelected = (restaurantId) => {
      return Object.values(restaurantRankings).some(
        (r) => r && r.id === restaurantId,
      );
    };

    const allRankingsFilled = Object.values(restaurantRankings).every(
      (r) => r !== null,
    );

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-6">
          {/* Rankings Sidebar */}
          <div className="w-full lg:w-80 bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg lg:order-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Your Ranking
            </h2>
            <div className="space-y-3 mb-6">
              {[1, 2, 3].map((rank) => {
                const restaurant = restaurantRankings[rank];
                return (
                  <div
                    key={rank}
                    className="bg-white rounded-lg p-3 shadow-lg min-h-[80px] flex items-center"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-rose-500 border-2 border-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
                      {rank}
                    </div>
                    {restaurant ? (
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">
                          {restaurant.name}
                        </p>
                        <p className="text-xs text-rose-600">
                          {restaurant.cuisine}
                        </p>
                        <button
                          onClick={() => handleRemoveRanking(rank)}
                          className="text-xs text-red-500 hover:text-red-700 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        Click a restaurant
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => allRankingsFilled && setStage("outfit")}
              disabled={!allRankingsFilled}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
                allRankingsFilled
                  ? "bg-rose-500 border-2 border-rose-600 text-white hover:bg-rose-600 hover:shadow-lg cursor-pointer"
                  : "bg-gray-200 border-2 border-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {allRankingsFilled ? "Continue 💖" : "Rank All 3 First"}
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:order-1">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Rank Your Restaurant Choices!
              </h1>
              <p className="text-gray-600 text-lg">
                Pick your Top 3 choices in case some are fully booked 🍽️
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {restaurants.map((restaurant, index) => {
                const selected = isRestaurantSelected(restaurant.id);
                return (
                  <div
                    key={restaurant.id}
                    className={`bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all cursor-pointer animate-open-letter ${
                      selected
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() =>
                      !selected && handleRestaurantClick(restaurant)
                    }
                  >
                    {/* Restaurant Image */}
                    <div className="h-32 overflow-hidden relative">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      {selected && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            ✓ Selected
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Restaurant Details */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {restaurant.name}
                      </h3>
                      <p className="text-rose-600 font-semibold text-sm mb-2">
                        {restaurant.cuisine}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {restaurant.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Outfit Selection Stage
  const renderOutfit = () => {
    const outfits = [
      {
        id: 1,
        name: "Old Money",
        style: "Navy Blue and Cream",

        image: outfit1,
      },
      {
        id: 2,
        name: "Start Boy / Girl",
        style: "Black and White",

        image: outfit2,
      },
      {
        id: 3,
        name: "Girly Pop",
        style: "Pink / Floral and White",

        image: outfit3,
      },
    ];

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Pick Our Outfit
            </h1>
            <p className="text-gray-600 text-lg">
              Select the Outfit Vibe on our date
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {outfits.map((outfit, index) => {
              const selected = selectedOutfit?.id === outfit.id;
              return (
                <div
                  key={outfit.id}
                  className={`bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all cursor-pointer animate-open-letter ${
                    selected
                      ? "ring-4 ring-rose-500 scale-105"
                      : "hover:scale-105"
                  }`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                  onClick={() => setSelectedOutfit(outfit)}
                >
                  {/* Outfit Image */}
                  <div className="h-80 overflow-hidden relative bg-white">
                    <img
                      src={outfit.image}
                      alt={outfit.name}
                      className="w-full h-full object-contain"
                    />
                    {selected && (
                      <div className="absolute top-4 right-4 bg-rose-500 text-white rounded-full p-3 shadow-lg">
                        <span className="text-2xl">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Outfit Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {outfit.name}
                    </h3>
                    <p className="text-rose-600 font-semibold mb-3">
                      {outfit.style}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {outfit.description}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOutfit(outfit);
                      }}
                      className={`w-full py-2 rounded-lg font-semibold transition-all ${
                        selected
                          ? "bg-rose-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {selected ? "Selected ✓" : "Select This Outfit"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={() => selectedOutfit && setStage("letter")}
              disabled={!selectedOutfit}
              className={`px-12 py-4 rounded-full font-bold text-lg transition-all ${
                selectedOutfit
                  ? "bg-rose-500 border-2 border-rose-600 text-white hover:bg-rose-600 hover:scale-105 cursor-pointer shadow-lg"
                  : "bg-gray-200 border-2 border-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedOutfit ? "Continue 💖" : "Select an Outfit First"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Letter Stage (Modal)
  const renderLetter = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12 max-h-[90vh] overflow-y-auto animate-open-letter">
        {/* Letter Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💌</div>

          <div className="w-24 h-1 bg-rose-300 mx-auto rounded-full"></div>
        </div>

        {/* Letter Content */}
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p className="text-xl md:text-2xl font-semibold">
            To my dearest Marianne,
          </p>

          <p className="text-base md:text-lg">
            I know I'm not the kind of guy who showers you with letters or
            flowers every day, but I hope you know just how deeply I love you. I
            have my own ways of showing it, and I hope you feel that every day.
          </p>

          <p className="text-base md:text-lg">
            I'm sorry we missed our chance to celebrate last year. Since we've
            both been so busy lately, I want to make this Valentine's Day truly
            special and make up for all the "baby time" we've missed.
          </p>

          <p className="text-base md:text-lg">
            I'm still learning how to love you the way you need, and I'm trying
            my best to be the partner you deserve. You mean everything to me,
            and I can't wait to spend this day with you.
          </p>

          <div className="pt-6">
            <p className="text-base md:text-lg">With all my love,</p>
            <div className="mt-4">
              <img src={signature} alt="Khyle's Signature" className="w-40" />
              <p className="text-lg md:text-xl font-semibold text-gray-800 mt-2">
                Khyle Dela Cruz
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setStage("reveal");
              setShowConfetti(true);
            }}
            className="px-8 py-3 bg-rose-500 border-2 border-rose-600 text-white rounded-full font-semibold text-lg hover:bg-rose-600 hover:scale-105 transition-transform shadow-lg"
          >
            Continue 💖
          </button>
        </div>
      </div>
    </div>
  );

  // Final Reveal Stage
  const renderReveal = () => {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={true}
            numberOfPieces={500}
            colors={[
              "#ff0000",
              "#ff69b4",
              "#ff1493",
              "#ffb6c1",
              "#ffc0cb",
              "#ffffff",
            ]}
          />
        )}

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="text-8xl md:text-9xl mb-8 animate-bounce-slow">
            💕
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            I knew you'd say YES!
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            You just made me the happiest person! 🥰
          </p>

          {/* Screenshot Instruction */}
          <div className="text-center mb-6">
            <p className="text-xl md:text-2xl text-gray-800 font-semibold">
              📸 Screenshot this and send this to me! 💕
            </p>
          </div>

          {/* Summary of Choices */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 mb-6 shadow-lg text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              Your Choices for Our Date 💖
            </h2>

            {/* Restaurant Rankings */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-rose-600 mb-4 flex items-center">
                🍽️ Your Top Restaurant Picks:
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((rank) => {
                  const restaurant = restaurantRankings[rank];
                  return restaurant ? (
                    <div
                      key={rank}
                      className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                        {rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {restaurant.name}
                        </p>
                        <p className="text-sm text-rose-600">
                          {restaurant.cuisine}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {restaurant.description}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Outfit Choice */}
            {selectedOutfit && (
              <div>
                <h3 className="text-xl font-semibold text-rose-600 mb-4 flex items-center">
                  👗 Your Outfit Choice:
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">
                    {selectedOutfit.name}
                  </p>
                  <p className="text-sm text-rose-600">
                    {selectedOutfit.style}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedOutfit.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 mb-8 shadow-lg">
            <p className="text-md md:text-lg text-gray-800 mb-2">
              This Valentine's Day is going to be special because I get to spend
              it with you 💗
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <div className="text-4xl animate-bounce-slow">💕</div>
            <div
              className="text-4xl animate-bounce-slow"
              style={{ animationDelay: "0.1s" }}
            >
              💖
            </div>
            <div
              className="text-4xl animate-bounce-slow"
              style={{ animationDelay: "0.2s" }}
            >
              💗
            </div>
            <div
              className="text-4xl animate-bounce-slow"
              style={{ animationDelay: "0.3s" }}
            >
              💝
            </div>
            <div
              className="text-4xl animate-bounce-slow"
              style={{ animationDelay: "0.4s" }}
            >
              💘
            </div>
          </div>
        </div>

        {/* Floating hearts animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce-slow opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {["💕", "💖", "💗", "💝", "💘"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Music Toggle Button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-rose-500 border-2 border-rose-600 text-white rounded-full shadow-xl hover:bg-rose-600 hover:scale-110 transition-all flex items-center justify-center text-2xl"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? "🔇" : "🎵"}
      </button>

      {stage === "game" && renderGame()}
      {stage === "question" && renderQuestion()}
      {stage === "loading" && renderLoading()}
      {stage === "restaurant" && renderRestaurant()}
      {stage === "outfit" && renderOutfit()}
      {stage === "letter" && renderLetter()}
      {stage === "reveal" && renderReveal()}
    </>
  );
}

export default App;
