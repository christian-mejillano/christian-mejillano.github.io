import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

export default function ConnectionsGame() {
  const initialPuzzle = {
    groups: [
      {
        category: "Stranger Things Characters",
        words: ["ELEVEN", "MIKE", "DUSTIN", "WILL"],
        difficulty: "easy",
        color: "#fbbf24",
        sentenceWord: "WILL"
      },
      {
        category: "Ocean Creatures",
        words: ["PINE", "CEDAR", "FIR", "YEW"],
        difficulty: "medium",
        color: "#4ade80",
        sentenceWord: "YEW"
      },
      {
        category: "Insects/Bugs",
        words: ["BUTTERFLY", "MOSQUITO", "SPIDER", "BEE"],
        difficulty: "hard",
        color: "#60a5fa",
        sentenceWord: "BEE"
      },
      {
        category: "Possessive Words",
        words: ["YOUR", "THEIR", "OUR", "MY"],
        difficulty: "very-hard",
        color: "#a78bfa",
        sentenceWord: "MY"
      }
    ],
    sentenceOrder: [0, 1, 2, 3],
    name: "ELIZA",
    restOfMessage: "VALENTINES?", // Text that appears after the sentence words
    eventDetails: {
      title: "Valentines Date! 🎉",
      date: "Monday, February 16th, 2026",
      time: "9:00 AM - 9:00 PM (TBD)",
      location: "To be disclosed on the day!",
      details: "Join me on this day to celebrate the beautiful relationship between me and you!",
      rsvp: "Please RSVP by February 7th."
    }
  };

  const [puzzle] = useState(initialPuzzle);
  const [words, setWords] = useState([]);
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [showSentence, setShowSentence] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [userResponse, setUserResponse] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [correctCards, setCorrectCards] = useState([]);
  const [gameMode, setGameMode] = useState(null); // null, 'standard', or 'unlimited'

  const MAX_MISTAKES = 4;

  useEffect(() => {
    // Don't initialize words until mode is selected
  }, []);

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function toggleWord(word) {
    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
    } else if (selected.length < 4) {
      setSelected([...selected, word]);
    }
  }

  function shuffleWords() {
    setWords(shuffleArray(words));
  }

  function deselectAll() {
    setSelected([]);
  }

  function checkSubmission() {
    if (selected.length !== 4) return;

    const matchedGroup = puzzle.groups.find(group => {
      const groupWords = group.words;
      return !solved.some(s => s.category === group.category) &&
             selected.every(word => groupWords.includes(word)) &&
             selected.length === groupWords.length;
    });

    if (matchedGroup) {
      // Correct guess! Animate cards floating to their position
      setCorrectCards(selected);
      
      setTimeout(() => {
        setSolved([...solved, matchedGroup]);
        setWords(words.filter(w => !selected.includes(w)));
        setSelected([]);
        setCorrectCards([]);
        setMessage(`Correct! ${matchedGroup.category}`);
        
        setTimeout(() => setMessage(''), 2000);

        if (solved.length === puzzle.groups.length - 1) {
          setGameOver(true);
          setTimeout(() => {
            setAnimating(true);
            setTimeout(() => {
              setShowSentence(true);
              setAnimating(false);
            }, 2500); // Increased to match longer animation
          }, 1000);
        }
      }, 800); // Wait for float animation to complete
    } else {
      // Incorrect - shake the cards
      setShaking(true);
      setTimeout(() => setShaking(false), 500);

      const oneAway = puzzle.groups.find(group => {
        const groupWords = group.words;
        const matchCount = selected.filter(word => groupWords.includes(word)).length;
        return !solved.some(s => s.category === group.category) && matchCount === 3;
      });

      if (oneAway) {
        setMessage('One away...');
      } else {
        setMessage('Not quite!');
      }

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      
      // In standard mode, check if game is over
      if (gameMode === 'standard' && newMistakes >= MAX_MISTAKES) {
        setGameOver(true);
        // In standard mode with mistakes, DON'T show the sentence
      }

      setTimeout(() => setMessage(''), 2000);
    }
  }

  function getSentence() {
    const sentenceWords = puzzle.sentenceOrder.map(index => 
      puzzle.groups[index].sentenceWord
    );
    return puzzle.name + ' ' + sentenceWords.join(' ') + ' ' + (puzzle.restOfMessage || '');
  }

  function resetGame() {
    const allWords = puzzle.groups.flatMap(group => group.words);
    setWords(shuffleArray(allWords));
    setSelected([]);
    setSolved([]);
    setMistakes(0);
    setGameOver(false);
    setMessage('');
    setShowSentence(false);
    setAnimating(false);
    setUserResponse(null);
    setShaking(false);
    setCorrectCards([]);
    setGameMode(null); // Reset to mode selection
  }

  function startGame(mode) {
    setGameMode(mode);
    const allWords = puzzle.groups.flatMap(group => group.words);
    setWords(shuffleArray(allWords));
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6b7280'
    },
    solvedGroup: {
      borderRadius: '0.5rem',
      padding: '1rem',
      textAlign: 'center',
      marginBottom: '0.5rem',
      position: 'relative'
    },
    groupCategory: {
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    groupWords: {
      fontSize: '0.875rem',
      color: '#1f2937'
    },
    wordSpan: (isAnimating) => ({
      display: 'inline-block',
      transition: 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      opacity: isAnimating ? 0 : 1,
      transform: isAnimating ? 'translateY(-400px) scale(1.5)' : 'translateY(0) scale(1)',
      fontWeight: isAnimating ? 'bold' : 'normal'
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '0.5rem',
      marginBottom: '1.5rem'
    },
    wordButton: (isSelected, isShaking, isCorrect) => ({
      aspectRatio: '1',
      borderRadius: '0.5rem',
      fontWeight: 'bold',
      fontSize: '0.875rem',
      border: '2px solid',
      borderColor: isSelected ? '#374151' : '#d1d5db',
      backgroundColor: isSelected ? '#374151' : '#ffffff',
      color: isSelected ? '#ffffff' : '#111827',
      cursor: 'pointer',
      transition: 'all 0.2s',
      transform: isSelected ? 'scale(0.95)' : 'scale(1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem',
      animation: isShaking && isSelected ? 'shake 0.5s' : isCorrect ? 'floatUp 0.8s ease-out forwards' : 'none'
    }),
    message: {
      textAlign: 'center',
      marginBottom: '1rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#374151'
    },
    mistakesContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
      alignItems: 'center'
    },
    mistakeLabel: {
      color: '#6b7280',
      marginRight: '0.5rem'
    },
    mistakeDot: (isMistake) => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: isMistake ? '#d1d5db' : '#1f2937'
    }),
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap'
    },
    button: (disabled = false, primary = false) => ({
      padding: '0.75rem 1.5rem',
      backgroundColor: primary ? (disabled ? '#d1d5db' : '#111827') : '#ffffff',
      color: primary ? (disabled ? '#6b7280' : '#ffffff') : '#111827',
      border: primary ? 'none' : '2px solid #d1d5db',
      borderRadius: '9999px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }),
    gameOverContainer: {
      textAlign: 'center'
    },
    gameOverTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1.5rem'
    },
    sentenceBox: {
      background: 'linear-gradient(to right, #fae8ff, #fce7f3)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      border: '2px solid #d8b4fe',
      marginTop: '1.5rem',
      marginBottom: '1.5rem',
      animation: 'fadeIn 0.5s ease-in'
    },
    sentenceText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1rem',
      animation: 'floatToCenter 1.5s ease-out'
    },
    yesNoButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1rem'
    },
    yesButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#22c55e',
      color: '#ffffff',
      border: 'none',
      borderRadius: '9999px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    noButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      borderRadius: '9999px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    responseText: {
      marginTop: '1rem',
      fontSize: '1.125rem',
      color: '#374151'
    },
    instructions: {
      marginTop: '2rem',
      padding: '1rem',
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb'
    },
    instructionsTitle: {
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    instructionsList: {
      fontSize: '0.875rem',
      color: '#6b7280',
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    instructionItem: {
      marginBottom: '0.25rem'
    },
    customizationNote: {
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#eff6ff',
      borderRadius: '0.5rem',
      border: '1px solid #bfdbfe',
      fontSize: '0.875rem',
      color: '#374151'
    },
    code: {
      backgroundColor: '#dbeafe',
      padding: '0 0.25rem',
      borderRadius: '0.25rem',
      fontFamily: 'monospace'
    },
    modeSelection: {
      textAlign: 'center',
      padding: '3rem 1rem',
      maxWidth: '600px',
      margin: '0 auto'
    },
    modeTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1rem'
    },
    modeDescription: {
      fontSize: '1rem',
      color: '#6b7280',
      marginBottom: '3rem'
    },
    modeButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      maxWidth: '400px',
      margin: '0 auto'
    },
    modeButton: {
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      border: '2px solid #d1d5db',
      borderRadius: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left'
    },
    modeButtonTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    modeButtonDesc: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    modeBadge: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1rem'
    },
    eventDetails: {
      marginTop: '2rem',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      border: '2px solid #d1d5db',
      textAlign: 'left',
      animation: 'fadeIn 0.5s ease-in'
    },
    eventTitle: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    eventSection: {
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #e5e7eb'
    },
    eventLabel: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.25rem'
    },
    eventValue: {
      fontSize: '1.125rem',
      color: '#111827',
      fontWeight: '500'
    },
    eventDetailsText: {
      fontSize: '1rem',
      color: '#374151',
      lineHeight: '1.6',
      marginTop: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Connections</h1>
        <p style={styles.subtitle}>Create four groups of four!</p>
      </div>

      {/* Mode Selection */}
      {gameMode === null && (
        <div style={styles.modeSelection}>
          <h2 style={styles.modeTitle}>Choose Your Mode</h2>
          <p style={styles.modeDescription}>Select how you'd like to play</p>
          
          <div style={styles.modeButtons}>
            <button
              onClick={() => startGame('standard')}
              style={styles.modeButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <div style={styles.modeButtonTitle}>⚡ Standard Mode</div>
              <div style={styles.modeButtonDesc}>
                4 mistakes allowed. Complete all groups to reveal the secret message!
              </div>
            </button>
            
            <button
              onClick={() => startGame('unlimited')}
              style={styles.modeButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <div style={styles.modeButtonTitle}>♾️ Unlimited Mode</div>
              <div style={styles.modeButtonDesc}>
                No mistake limit. Keep trying until you solve all groups and see the secret message!
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Game Content - only show when mode is selected */}
      {gameMode !== null && (
        <>
          <div style={{textAlign: 'center'}}>
            <span style={styles.modeBadge}>
              {gameMode === 'standard' ? '⚡ Standard Mode' : '♾️ Unlimited Mode'}
            </span>
          </div>

          {/* Solved Groups */}
          <div>
            {solved.map((group, idx) => (
              <div key={idx} style={{...styles.solvedGroup, backgroundColor: group.color}}>
                <h3 style={styles.groupCategory}>{group.category}</h3>
                <p style={styles.groupWords}>
                  {group.words.map((word, wordIdx) => (
                    <span
                      key={wordIdx}
                      style={styles.wordSpan(animating && word === group.sentenceWord)}
                    >
                      {word}
                      {wordIdx < group.words.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>

      {/* Game Board */}
      {!gameOver && (
        <>
          <div style={styles.grid}>
            {words.map((word, idx) => (
              <button
                key={idx}
                onClick={() => toggleWord(word)}
                style={styles.wordButton(
                  selected.includes(word),
                  shaking,
                  correctCards.includes(word)
                )}
                  onMouseEnter={(e) => {
                    if (!selected.includes(word)) {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected.includes(word)) {
                      e.target.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {word}
                </button>
              ))}
          </div>

          {message && (
            <div style={styles.message}>
              <p>{message}</p>
            </div>
          )}

          {gameMode === 'standard' && (
            <div style={styles.mistakesContainer}>
              <p style={styles.mistakeLabel}>Mistakes remaining:</p>
              {[...Array(MAX_MISTAKES - mistakes)].map((_, i) => (
                <div key={i} style={styles.mistakeDot(false)} />
              ))}
              {[...Array(mistakes)].map((_, i) => (
                <div key={`mistake-${i}`} style={styles.mistakeDot(true)} />
              ))}
            </div>
          )}

          <div style={styles.controls}>
            <button
              onClick={shuffleWords}
              style={styles.button()}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            >
              <Shuffle size={18} />
              Shuffle
            </button>
            <button
              onClick={deselectAll}
              style={styles.button()}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            >
              Deselect All
            </button>
            <button
              onClick={checkSubmission}
              disabled={selected.length !== 4}
              style={styles.button(selected.length !== 4, true)}
              onMouseEnter={(e) => {
                if (selected.length === 4) {
                  e.target.style.backgroundColor = '#1f2937';
                }
              }}
              onMouseLeave={(e) => {
                if (selected.length === 4) {
                  e.target.style.backgroundColor = '#111827';
                }
              }}
            >
              Submit
            </button>
          </div>
        </>
      )}

      {/* Game Over */}
      {gameOver && (
        <div style={styles.gameOverContainer}>
          <h2 style={styles.gameOverTitle}>
            {solved.length === puzzle.groups.length 
              ? '🎉 You won!' 
              : gameMode === 'standard' 
                ? '😔 Game Over - Out of Guesses!' 
                : '😔 Game Over'}
          </h2>
          
          {puzzle.groups.filter(g => !solved.some(s => s.category === g.category)).map((group, idx) => (
            <div key={idx} style={{...styles.solvedGroup, backgroundColor: group.color}}>
              <h3 style={styles.groupCategory}>{group.category}</h3>
              <p style={styles.groupWords}>{group.words.join(', ')}</p>
            </div>
          ))}

          {showSentence && (
            <div style={styles.sentenceBox}>
              <p style={styles.sentenceText}>{getSentence()}</p>
              
              {userResponse === null ? (
                <div style={styles.yesNoButtons}>
                  <button
                    onClick={() => setUserResponse('yes')}
                    style={styles.yesButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#22c55e'}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setUserResponse('no')}
                    style={styles.noButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                  >
                    No
                  </button>
                </div>
              ) : userResponse === 'yes' ? (
                <div style={styles.eventDetails}>
                  <h3 style={styles.eventTitle}>{puzzle.eventDetails.title}</h3>
                  
                  <div style={styles.eventSection}>
                    <div style={styles.eventLabel}>Date</div>
                    <div style={styles.eventValue}>{puzzle.eventDetails.date}</div>
                  </div>
                  
                  <div style={styles.eventSection}>
                    <div style={styles.eventLabel}>Time</div>
                    <div style={styles.eventValue}>{puzzle.eventDetails.time}</div>
                  </div>
                  
                  <div style={styles.eventSection}>
                    <div style={styles.eventLabel}>Location</div>
                    <div style={styles.eventValue}>{puzzle.eventDetails.location}</div>
                  </div>
                  
                  <div style={{...styles.eventSection, borderBottom: 'none'}}>
                    <div style={styles.eventLabel}>Details</div>
                    <div style={styles.eventDetailsText}>{puzzle.eventDetails.details}</div>
                  </div>
                  
                  <div style={{...styles.eventValue, textAlign: 'center', marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem'}}>
                    {puzzle.eventDetails.rsvp}
                  </div>
                </div>
              ) : (
                <div style={styles.responseText}>
                  <p>You answered: <strong>No</strong></p>
                  <p style={{marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem'}}>
                    Hope to see you next time! 😊
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={resetGame}
            style={{...styles.button(false, true), margin: '1rem auto'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1f2937'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#111827'}
          >
            Play Again
          </button>
        </div>
      )}
        </>
      )}

      {gameMode !== null && (
        <>
          <div style={styles.instructions}>
            <h3 style={styles.instructionsTitle}>How to Play:</h3>
            <ul style={styles.instructionsList}>
              <li style={styles.instructionItem}>• Find groups of four words that share a common theme</li>
              <li style={styles.instructionItem}>• Select four words and click Submit</li>
              <li style={styles.instructionItem}>• You have {gameMode === 'standard' ? '4 mistakes' : 'unlimited tries'} before the game ends</li>
            </ul>
          </div>

          {/* <div style={styles.customizationNote}>
            <p>
              <strong>💡 Tip:</strong> To customize this puzzle, edit the <code style={styles.code}>initialPuzzle</code> object in the code. Change the categories, words, <code style={styles.code}>sentenceWord</code> values, <code style={styles.code}>restOfMessage</code>, and <code style={styles.code}>eventDetails</code> to create your own puzzles!
            </p>
          </div> */}
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        @keyframes floatUp {
          0% { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% { 
            opacity: 0;
            transform: translateY(-300px) scale(0.8);
          }
        }
        
        @keyframes floatToCenter {
          0% {
            opacity: 0;
            transform: translateY(200px) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}