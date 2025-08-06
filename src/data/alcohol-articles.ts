export interface AlcoholArticle {
  id: string;
  title: string;
  category: string;
  duration: string;
  content: {
    introduction: string;
    sections: {
      heading: string;
      content: string;
      bulletPoints?: string[];
    }[];
    callout?: {
      text: string;
      author: string;
    };
    conclusion: string;
  };
}

export const alcoholArticles: AlcoholArticle[] = [
  {
    id: 'neuroplasticity',
    title: 'Changing Our Brains Through Neuroplasticity',
    category: 'NEUROSCIENCE',
    duration: '3 min read',
    content: {
      introduction: 'Neuroplasticity is the brain\'s remarkable ability to reorganize itself by forming new neural connections throughout life. This incredible capacity means that our brains are constantly adapting and changing based on our experiences, thoughts, and behaviors.',
      sections: [
        {
          heading: 'How Neuroplasticity Works in Recovery',
          content: 'When it comes to addiction recovery, understanding neuroplasticity gives us hope. The same brain that developed addiction patterns can be rewired to support recovery. Every time we choose a healthy behavior over an addictive one, we\'re literally rewiring our neural pathways.',
          bulletPoints: [
            'Synaptic Plasticity: The strength of connections between neurons can increase or decrease based on our repeated behaviors and thoughts.',
            'Structural Plasticity: New neurons can be generated, and existing neural pathways can be modified or replaced with healthier alternatives.',
            'Functional Plasticity: Different areas of the brain can take over functions that were previously managed by addiction-affected regions.'
          ]
        }
      ],
      callout: {
        text: 'The brain that got addicted is not the brain that gets sober. Recovery involves the creation of new neural pathways and the strengthening of healthier patterns of thinking and behavior.',
        author: 'Dr. Judith Grisel, Neuroscientist'
      },
      conclusion: 'Your brain is incredibly resilient and adaptable. Trust in its ability to heal and change, and remember that every step you take in recovery is literally reshaping your mind for the better.'
    }
  },
  {
    id: 'dopamine-reward',
    title: 'Understanding Dopamine and the Reward System',
    category: 'NEUROSCIENCE',
    duration: '4 min read',
    content: {
      introduction: 'Dopamine is often called the "feel-good" chemical, but its role in addiction is more complex than simple pleasure. Understanding how dopamine works can help us make better choices in recovery.',
      sections: [
        {
          heading: 'The Dopamine Myth',
          content: 'Contrary to popular belief, dopamine doesn\'t create pleasure directly. Instead, it signals the anticipation of reward, driving us to seek out experiences we expect will feel good.',
          bulletPoints: [
            'Dopamine spikes before we receive a reward, not during',
            'Alcohol hijacks this system, creating artificial spikes',
            'Over time, normal activities produce less dopamine satisfaction'
          ]
        },
        {
          heading: 'Healing Your Reward System',
          content: 'Recovery involves rebalancing your dopamine system through natural, healthy activities that provide genuine satisfaction.',
          bulletPoints: [
            'Exercise releases natural dopamine',
            'Completing goals creates healthy reward pathways',
            'Social connections activate positive dopamine responses'
          ]
        }
      ],
      conclusion: 'Understanding your dopamine system empowers you to make choices that support long-term happiness rather than short-term artificial highs.'
    }
  },
  {
    id: 'sleep-recovery',
    title: 'The Critical Role of Sleep in Alcohol Recovery',
    category: 'HEALTH',
    duration: '3 min read',
    content: {
      introduction: 'Sleep is one of the most important yet overlooked aspects of alcohol recovery. Quality sleep is essential for brain healing, emotional regulation, and maintaining sobriety.',
      sections: [
        {
          heading: 'How Alcohol Disrupts Sleep',
          content: 'While alcohol may initially make you feel drowsy, it severely disrupts your sleep architecture, preventing deep, restorative sleep.',
          bulletPoints: [
            'Reduces REM sleep, crucial for emotional processing',
            'Causes frequent wake-ups throughout the night',
            'Leads to morning fatigue despite hours in bed'
          ]
        },
        {
          heading: 'Sleep Recovery Timeline',
          content: 'Your sleep will gradually improve as you maintain sobriety, but it takes time.',
          bulletPoints: [
            'Week 1-2: Sleep may initially worsen (temporary)',
            'Week 3-4: Sleep quality begins to improve',
            'Month 2-3: Significant improvements in deep sleep',
            'Month 3+: Sleep architecture returns to healthy patterns'
          ]
        }
      ],
      conclusion: 'Prioritizing sleep hygiene accelerates your recovery and makes maintaining sobriety easier. Good sleep is not a luxury—it\'s a necessity for lasting recovery.'
    }
  },
  {
    id: 'stress-management',
    title: 'Managing Stress Without Alcohol',
    category: 'WELLNESS',
    duration: '4 min read',
    content: {
      introduction: 'Stress is one of the primary triggers for alcohol use. Learning healthy stress management techniques is crucial for long-term sobriety and overall well-being.',
      sections: [
        {
          heading: 'Why We Turn to Alcohol for Stress',
          content: 'Alcohol temporarily dampens the stress response system, but this relief comes at a significant cost to our long-term stress resilience.',
          bulletPoints: [
            'Alcohol provides immediate but temporary stress relief',
            'Regular use weakens natural stress coping mechanisms',
            'Rebound anxiety often makes stress worse the next day'
          ]
        },
        {
          heading: 'Healthy Stress Management Techniques',
          content: 'Building a toolkit of healthy stress management strategies provides lasting relief without the negative consequences.',
          bulletPoints: [
            'Deep breathing exercises activate the parasympathetic nervous system',
            'Regular exercise reduces cortisol and releases endorphins',
            'Mindfulness meditation builds stress resilience over time',
            'Progressive muscle relaxation provides immediate physical relief'
          ]
        }
      ],
      conclusion: 'Stress will always be part of life, but how we respond to it is within our control. Healthy coping mechanisms build resilience and make us stronger over time.'
    }
  },
  {
    id: 'liver-healing',
    title: 'Your Liver\'s Amazing Recovery Journey',
    category: 'HEALTH',
    duration: '3 min read',
    content: {
      introduction: 'The liver is one of the most resilient organs in the human body. Understanding how it heals during alcohol recovery can provide motivation and hope for your journey.',
      sections: [
        {
          heading: 'The Liver Recovery Timeline',
          content: 'Your liver begins healing remarkably quickly once alcohol consumption stops.',
          bulletPoints: [
            '24-72 hours: Inflammation begins to reduce',
            '1-2 weeks: Fat deposits start to decrease',
            '1 month: Significant improvement in liver enzyme levels',
            '3-6 months: Substantial healing of liver tissue',
            '1 year+: Near-complete regeneration possible (depending on damage)'
          ]
        },
        {
          heading: 'Supporting Liver Recovery',
          content: 'You can accelerate your liver\'s healing through healthy lifestyle choices.',
          bulletPoints: [
            'Stay hydrated to help liver flush out toxins',
            'Eat antioxidant-rich foods like berries and leafy greens',
            'Maintain a healthy weight to reduce liver fat',
            'Avoid unnecessary medications that stress the liver'
          ]
        }
      ],
      conclusion: 'Your liver\'s capacity for healing is remarkable. Every alcohol-free day is a gift to this vital organ and your overall health.'
    }
  },
  {
    id: 'social-drinking',
    title: 'Navigating Social Situations Without Drinking',
    category: 'SOCIAL',
    duration: '4 min read',
    content: {
      introduction: 'Social situations can be challenging when you\'re not drinking. Learning to navigate these situations confidently is a key skill in maintaining long-term sobriety.',
      sections: [
        {
          heading: 'Preparation is Key',
          content: 'Before attending social events, prepare yourself mentally and practically.',
          bulletPoints: [
            'Have a plan for what you\'ll drink (mocktails, sparkling water)',
            'Prepare responses to questions about not drinking',
            'Identify a support person you can text if needed',
            'Set a time limit for how long you\'ll stay'
          ]
        },
        {
          heading: 'Changing Your Social Circle',
          content: 'Recovery often means evaluating and sometimes changing your social relationships.',
          bulletPoints: [
            'Identify friends who support your sobriety journey',
            'Seek out alcohol-free social activities and groups',
            'Distance yourself from people who pressure you to drink',
            'Remember: true friends will respect your choices'
          ]
        }
      ],
      conclusion: 'Social situations become easier with practice. Your confidence will grow, and you\'ll discover that meaningful connections don\'t require alcohol.'
    }
  },
  {
    id: 'cravings-science',
    title: 'The Science Behind Alcohol Cravings',
    category: 'NEUROSCIENCE',
    duration: '3 min read',
    content: {
      introduction: 'Cravings can feel overwhelming, but understanding the science behind them can help you manage them more effectively. Cravings are temporary neurological events, not permanent states.',
      sections: [
        {
          heading: 'What Happens During a Craving',
          content: 'Cravings involve multiple brain systems working together to drive the urge to drink.',
          bulletPoints: [
            'The limbic system triggers emotional memories associated with drinking',
            'The prefrontal cortex may weaken its inhibitory control',
            'Stress hormones can intensify the craving experience',
            'Physical sensations may accompany the mental urge'
          ]
        },
        {
          heading: 'The SURF Technique',
          content: 'SURF is a proven method for riding out cravings without acting on them.',
          bulletPoints: [
            'Stop: Pause and acknowledge the craving',
            'Urge surf: Observe the sensation without fighting it',
            'Reflect: Remember your reasons for quitting',
            'Focus: Redirect attention to a healthy activity'
          ]
        }
      ],
      conclusion: 'Cravings are temporary visitors, not permanent residents. With practice, you can learn to observe them without being controlled by them.'
    }
  },
  {
    id: 'anxiety-alcohol',
    title: 'Breaking the Anxiety-Alcohol Cycle',
    category: 'MENTAL HEALTH',
    duration: '4 min read',
    content: {
      introduction: 'Many people drink to manage anxiety, but alcohol actually makes anxiety worse over time. Understanding this cycle is crucial for breaking free from both anxiety and alcohol dependence.',
      sections: [
        {
          heading: 'How Alcohol Worsens Anxiety',
          content: 'While alcohol may provide temporary relief, it ultimately increases anxiety levels.',
          bulletPoints: [
            'Alcohol disrupts neurotransmitter balance',
            'Withdrawal creates rebound anxiety',
            'Sleep disruption increases next-day anxiety',
            'Guilt and shame about drinking add to anxiety'
          ]
        },
        {
          heading: 'Natural Anxiety Management',
          content: 'Building healthy anxiety management skills provides lasting relief.',
          bulletPoints: [
            'Regular exercise reduces anxiety by 20-30%',
            'Deep breathing activates the relaxation response',
            'Cognitive behavioral techniques challenge anxious thoughts',
            'Mindfulness practice builds tolerance for uncomfortable feelings'
          ]
        }
      ],
      conclusion: 'Breaking the anxiety-alcohol cycle takes time, but the result is genuine peace of mind rather than temporary escape.'
    }
  },
  {
    id: 'immune-system',
    title: 'How Quitting Alcohol Boosts Your Immune System',
    category: 'HEALTH',
    duration: '3 min read',
    content: {
      introduction: 'Alcohol significantly weakens your immune system, making you more susceptible to infections and slowing healing. Recovery brings remarkable immune system improvements.',
      sections: [
        {
          heading: 'Alcohol\'s Impact on Immunity',
          content: 'Regular alcohol consumption suppresses multiple aspects of immune function.',
          bulletPoints: [
            'Reduces white blood cell effectiveness',
            'Impairs the body\'s inflammatory response',
            'Slows wound healing and tissue repair',
            'Increases susceptibility to infections'
          ]
        },
        {
          heading: 'Immune Recovery Timeline',
          content: 'Your immune system begins recovering quickly after stopping alcohol.',
          bulletPoints: [
            '24 hours: White blood cell function begins improving',
            '1 week: Inflammation markers start decreasing',
            '1 month: Significant improvement in infection resistance',
            '3 months: Immune system function dramatically improved'
          ]
        }
      ],
      conclusion: 'A strong immune system is one of sobriety\'s greatest gifts. You\'ll notice fewer colds, faster healing, and better overall health.'
    }
  },
  {
    id: 'relationships-recovery',
    title: 'Rebuilding Relationships in Recovery',
    category: 'SOCIAL',
    duration: '4 min read',
    content: {
      introduction: 'Alcohol often damages our most important relationships. Recovery provides an opportunity to rebuild trust, improve communication, and create deeper connections.',
      sections: [
        {
          heading: 'The Damage Alcohol Causes',
          content: 'Understanding how alcohol affected your relationships is the first step in healing them.',
          bulletPoints: [
            'Broken promises and unreliable behavior',
            'Emotional unavailability and mood swings',
            'Prioritizing drinking over relationship needs',
            'Communication problems and conflicts'
          ]
        },
        {
          heading: 'Rebuilding Trust',
          content: 'Trust is rebuilt through consistent actions over time, not just words.',
          bulletPoints: [
            'Keep your commitments, no matter how small',
            'Be transparent about your recovery journey',
            'Acknowledge past hurts without making excuses',
            'Show up emotionally present and engaged'
          ]
        }
      ],
      conclusion: 'Rebuilding relationships takes patience and commitment, but the rewards of authentic, sober connections are immeasurable.'
    }
  },
  {
    id: 'exercise-recovery',
    title: 'The Power of Exercise in Alcohol Recovery',
    category: 'FITNESS',
    duration: '3 min read',
    content: {
      introduction: 'Exercise is one of the most powerful tools in recovery. It provides natural mood enhancement, stress relief, and helps rebuild both physical and mental strength.',
      sections: [
        {
          heading: 'Exercise as Natural Medicine',
          content: 'Physical activity provides many of the benefits people seek from alcohol, but in a healthy way.',
          bulletPoints: [
            'Releases endorphins that improve mood naturally',
            'Reduces cortisol and manages stress effectively',
            'Improves sleep quality and duration',
            'Builds self-confidence and self-efficacy'
          ]
        },
        {
          heading: 'Getting Started Safely',
          content: 'You don\'t need to become a fitness enthusiast overnight. Start small and build gradually.',
          bulletPoints: [
            'Begin with 10-15 minutes of walking daily',
            'Try yoga or stretching for stress relief',
            'Find activities you enjoy, not just ones that burn calories',
            'Listen to your body and rest when needed'
          ]
        }
      ],
      conclusion: 'Exercise becomes easier and more enjoyable as your body heals from alcohol. Movement is medicine for both body and mind.'
    }
  },
  {
    id: 'nutrition-recovery',
    title: 'Nutrition for Alcohol Recovery',
    category: 'HEALTH',
    duration: '4 min read',
    content: {
      introduction: 'Proper nutrition plays a crucial role in recovery. Alcohol depletes essential nutrients and disrupts normal eating patterns. Healing your relationship with food supports your sobriety journey.',
      sections: [
        {
          heading: 'How Alcohol Affects Nutrition',
          content: 'Alcohol interferes with nutrient absorption and metabolism in multiple ways.',
          bulletPoints: [
            'Depletes B vitamins, especially B1 (thiamine)',
            'Reduces absorption of zinc, magnesium, and folate',
            'Interferes with protein synthesis and muscle maintenance',
            'Disrupts blood sugar regulation'
          ]
        },
        {
          heading: 'Recovery Nutrition Priorities',
          content: 'Focus on foods that support brain health and overall recovery.',
          bulletPoints: [
            'Protein at every meal to support neurotransmitter production',
            'Complex carbohydrates for stable blood sugar and mood',
            'Omega-3 fatty acids for brain health and inflammation reduction',
            'Plenty of fruits and vegetables for antioxidants and fiber'
          ]
        }
      ],
      conclusion: 'Good nutrition accelerates recovery and helps you feel your best. Treat food as fuel for your healing journey.'
    }
  },
  {
    id: 'depression-alcohol',
    title: 'Understanding Depression and Alcohol Use',
    category: 'MENTAL HEALTH',
    duration: '4 min read',
    content: {
      introduction: 'Depression and alcohol use often go hand in hand. Understanding this relationship is crucial for addressing both issues effectively and building lasting mental wellness.',
      sections: [
        {
          heading: 'The Vicious Cycle',
          content: 'Depression and alcohol create a reinforcing cycle that becomes increasingly difficult to break.',
          bulletPoints: [
            'People drink to temporarily escape depressive feelings',
            'Alcohol is a depressant that worsens mood over time',
            'Hangover effects increase depression and hopelessness',
            'Shame about drinking adds to depressive thoughts'
          ]
        },
        {
          heading: 'Breaking Free from Both',
          content: 'Recovery from both depression and alcohol use requires addressing underlying causes.',
          bulletPoints: [
            'Professional therapy can address root causes of depression',
            'Medication may be helpful for some individuals',
            'Regular exercise naturally improves mood and brain chemistry',
            'Building social connections combats isolation and hopelessness'
          ]
        }
      ],
      conclusion: 'Recovery from depression and alcohol use is possible. Professional help combined with healthy lifestyle changes can transform your mental health.'
    }
  },
  {
    id: 'brain-fog',
    title: 'Clearing the Brain Fog: Cognitive Recovery',
    category: 'NEUROSCIENCE',
    duration: '3 min read',
    content: {
      introduction: 'Many people experience "brain fog" during and after drinking - difficulty concentrating, memory problems, and mental sluggishness. The good news is that cognitive function improves significantly in recovery.',
      sections: [
        {
          heading: 'How Alcohol Impairs Cognition',
          content: 'Alcohol affects multiple aspects of brain function, even when you\'re not actively drinking.',
          bulletPoints: [
            'Disrupts sleep, which is crucial for memory consolidation',
            'Reduces blood flow to the prefrontal cortex',
            'Interferes with neurotransmitter balance',
            'Causes inflammation that affects brain function'
          ]
        },
        {
          heading: 'Cognitive Recovery Timeline',
          content: 'Your brain function will improve gradually as you maintain sobriety.',
          bulletPoints: [
            '1 week: Improved focus and attention span',
            '1 month: Better short-term memory and processing speed',
            '3 months: Significant improvement in executive function',
            '6 months+: Memory and cognitive abilities often exceed pre-drinking levels'
          ]
        }
      ],
      conclusion: 'The mental clarity that comes with sobriety is remarkable. Your cognitive abilities will continue improving as your brain heals.'
    }
  },
  {
    id: 'triggers-patterns',
    title: 'Identifying and Breaking Drinking Triggers',
    category: 'PSYCHOLOGY',
    duration: '4 min read',
    content: {
      introduction: 'Understanding your personal drinking triggers is essential for long-term sobriety. Triggers can be emotional, environmental, or social cues that create the urge to drink.',
      sections: [
        {
          heading: 'Common Drinking Triggers',
          content: 'While triggers are personal, certain patterns are common among people in recovery.',
          bulletPoints: [
            'Emotional triggers: stress, anxiety, boredom, celebration',
            'Environmental triggers: bars, parties, certain locations',
            'Social triggers: peer pressure, feeling left out',
            'Time-based triggers: end of workday, weekends, holidays'
          ]
        },
        {
          heading: 'Developing Trigger Management Strategies',
          content: 'Once you identify your triggers, you can develop specific strategies to handle them.',
          bulletPoints: [
            'Avoid triggers when possible, especially early in recovery',
            'Prepare alternative responses for unavoidable triggers',
            'Practice mindfulness to notice triggers before they overwhelm you',
            'Build a support network you can reach out to when triggered'
          ]
        }
      ],
      conclusion: 'Triggers will become less powerful over time as you practice new responses. Awareness is the first step to freedom.'
    }
  },
  {
    id: 'hydration-health',
    title: 'The Importance of Proper Hydration in Recovery',
    category: 'HEALTH',
    duration: '3 min read',
    content: {
      introduction: 'Alcohol is severely dehydrating, and many people don\'t realize how dehydrated they\'ve become. Proper hydration is crucial for feeling your best in recovery.',
      sections: [
        {
          heading: 'How Alcohol Causes Dehydration',
          content: 'Alcohol disrupts your body\'s normal fluid balance in multiple ways.',
          bulletPoints: [
            'Alcohol is a diuretic, causing increased urination',
            'It interferes with the hormone that regulates fluid balance',
            'Hangover symptoms are largely due to dehydration',
            'Chronic drinking leads to persistent dehydration'
          ]
        },
        {
          heading: 'Rehydration Benefits',
          content: 'Proper hydration brings immediate and long-term benefits to your recovery.',
          bulletPoints: [
            'Improved energy levels and mental clarity',
            'Better skin health and appearance',
            'Enhanced physical performance and recovery',
            'Improved mood and reduced anxiety'
          ]
        }
      ],
      conclusion: 'Something as simple as drinking enough water can dramatically improve how you feel in recovery. Hydration is one of the easiest ways to support your healing.'
    }
  },
  {
    id: 'self-compassion',
    title: 'Practicing Self-Compassion in Recovery',
    category: 'PSYCHOLOGY',
    duration: '4 min read',
    content: {
      introduction: 'Self-criticism and shame often fuel the cycle of addiction. Learning to treat yourself with compassion is not only healing but also strengthens your recovery.',
      sections: [
        {
          heading: 'The Problem with Self-Criticism',
          content: 'Harsh self-judgment often backfires and can actually increase the likelihood of relapse.',
          bulletPoints: [
            'Shame creates stress that can trigger drinking urges',
            'Self-criticism lowers motivation and self-efficacy',
            'Perfectionist thinking sets you up for feeling like a failure',
            'Negative self-talk becomes a self-fulfilling prophecy'
          ]
        },
        {
          heading: 'Building Self-Compassion',
          content: 'Self-compassion is a skill that can be learned and practiced.',
          bulletPoints: [
            'Speak to yourself like you would a good friend',
            'Recognize that making mistakes is part of being human',
            'Practice mindfulness to observe thoughts without judgment',
            'Celebrate small victories and progress over perfection'
          ]
        }
      ],
      conclusion: 'Self-compassion is not self-indulgence - it\'s a powerful tool for healing and growth. Be gentle with yourself on this journey.'
    }
  },
  {
    id: 'hobbies-interests',
    title: 'Rediscovering Hobbies and Interests',
    category: 'LIFESTYLE',
    duration: '3 min read',
    content: {
      introduction: 'Many people find that alcohol consumed time and energy they once devoted to hobbies and interests. Recovery is an opportunity to rediscover what brings you joy and meaning.',
      sections: [
        {
          heading: 'Why Hobbies Matter in Recovery',
          content: 'Hobbies and interests provide natural rewards and fill the time previously spent drinking.',
          bulletPoints: [
            'Create positive structure and routine',
            'Provide natural dopamine from achievement and progress',
            'Build self-confidence and sense of identity',
            'Offer opportunities for social connection'
          ]
        },
        {
          heading: 'Exploring New Interests',
          content: 'Don\'t be afraid to try new things. Recovery is a time of rediscovering who you are.',
          bulletPoints: [
            'Think about what interested you before drinking became a focus',
            'Try activities that engage different parts of your brain',
            'Consider creative pursuits like art, music, or writing',
            'Explore physical activities that make you feel strong'
          ]
        }
      ],
      conclusion: 'Hobbies and interests add richness and meaning to sober life. Allow yourself to play and explore - you might surprise yourself with what you discover.'
    }
  },
  {
    id: 'mindfulness-meditation',
    title: 'Mindfulness and Meditation for Recovery',
    category: 'WELLNESS',
    duration: '4 min read',
    content: {
      introduction: 'Mindfulness and meditation are powerful tools for recovery. They help build awareness, emotional regulation, and inner peace without relying on substances.',
      sections: [
        {
          heading: 'Benefits of Mindfulness in Recovery',
          content: 'Regular mindfulness practice provides numerous benefits that support sobriety.',
          bulletPoints: [
            'Increases awareness of thoughts and feelings before they become overwhelming',
            'Builds tolerance for uncomfortable emotions',
            'Reduces reactivity and impulsive behavior',
            'Improves focus and concentration'
          ]
        },
        {
          heading: 'Getting Started with Meditation',
          content: 'You don\'t need to meditate for hours to see benefits. Start small and be consistent.',
          bulletPoints: [
            'Begin with just 5 minutes of focused breathing',
            'Use guided meditation apps for structure and support',
            'Practice mindful moments throughout your day',
            'Be patient - meditation is a skill that develops over time'
          ]
        }
      ],
      conclusion: 'Mindfulness and meditation offer a path to inner peace that no substance can provide. These practices become more rewarding the more you engage with them.'
    }
  },
  {
    id: 'financial-recovery',
    title: 'The Financial Benefits of Sobriety',
    category: 'LIFESTYLE',
    duration: '3 min read',
    content: {
      introduction: 'One of the most immediate and tangible benefits of quitting alcohol is the money you\'ll save. The financial impact of drinking is often much larger than people realize.',
      sections: [
        {
          heading: 'The True Cost of Drinking',
          content: 'Alcohol expenses go far beyond the direct cost of drinks.',
          bulletPoints: [
            'Direct costs: alcohol purchases at stores, bars, and restaurants',
            'Indirect costs: rideshares, late fees, poor financial decisions',
            'Health costs: medical bills, medications, missed work',
            'Opportunity costs: money that could have been invested or saved'
          ]
        },
        {
          heading: 'Your Sobriety Savings',
          content: 'Calculate how much you\'ll save and put that money toward meaningful goals.',
          bulletPoints: [
            'Track your savings in the first month to see the immediate impact',
            'Redirect alcohol money toward goals that matter to you',
            'Consider investing saved money for long-term financial health',
            'Use some savings to reward yourself for sobriety milestones'
          ]
        }
      ],
      conclusion: 'Financial freedom is one of sobriety\'s unexpected gifts. Use your savings to build the life you really want.'
    }
  }
];

// Function to get a random article for a given day (based on day index)
export const getArticleForDay = (dayIndex: number): AlcoholArticle | null => {
  // Only show articles for the first 20 days
  if (dayIndex >= 20) return null;
  
  // Use day index to select article (ensures consistency per day)
  const articleIndex = dayIndex % alcoholArticles.length;
  return alcoholArticles[articleIndex];
};

// Function to create article route
export const getArticleRoute = (articleId: string): string => {
  return `/articles/${articleId}`;
};