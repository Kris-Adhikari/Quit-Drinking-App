export interface Workout {
  id: string;
  name: string;
  exercises: string[];
  duration: number; // minutes
  calories: number;
  category?: string;
}

export const CALORIES_PER_DRINK = 140;

// Daily Mini Workouts (60 total for rotation)
export const dailyMiniWorkouts: Workout[] = [
  {
    id: 'power-circuit',
    name: 'Power Circuit',
    exercises: ['20 squats', '10 push-ups', '30-sec plank', 'repeat 2x'],
    duration: 6,
    calories: 42,
  },
  {
    id: 'core-blast',
    name: 'Core Blast',
    exercises: ['15 crunches', '20 bicycle kicks', '30-sec side plank each side'],
    duration: 5,
    calories: 35,
  },
  {
    id: 'lower-body-burn',
    name: 'Lower Body Burn',
    exercises: ['25 lunges', '20 glute bridges', '15 wall sits', '10 calf raises'],
    duration: 7,
    calories: 49,
  },
  {
    id: 'upper-body-tone',
    name: 'Upper Body Tone',
    exercises: ['12 push-ups', '20 arm circles', '15 tricep dips', '30-sec arm hold'],
    duration: 5,
    calories: 35,
  },
  {
    id: 'cardio-burst',
    name: 'Cardio Burst',
    exercises: ['30 jumping jacks', '20 high knees', '15 burpees', 'rest 1 min', 'repeat'],
    duration: 8,
    calories: 56,
  },
  {
    id: 'flexibility-flow',
    name: 'Flexibility Flow',
    exercises: ['Cat-cow stretch', 'downward dog', 'warrior pose', 'child\'s pose sequence'],
    duration: 6,
    calories: 30,
  },
  {
    id: 'quick-tone',
    name: 'Quick Tone',
    exercises: ['15 squats', '10 modified push-ups', '20-sec plank'],
    duration: 4,
    calories: 28,
  },
  {
    id: 'evening-wind-down',
    name: 'Evening Wind-Down',
    exercises: ['Gentle stretches', 'wall push-ups', 'seated twists'],
    duration: 5,
    calories: 25,
  },
  {
    id: 'morning-energizer',
    name: 'Morning Energizer',
    exercises: ['20 jumping jacks', '15 squats', '10 push-ups', '30-sec mountain climbers'],
    duration: 6,
    calories: 42,
  },
  {
    id: 'desk-break',
    name: 'Desk Break',
    exercises: ['Shoulder rolls', 'seated leg lifts', 'standing calf raises'],
    duration: 3,
    calories: 21,
  },
];

// Workout Library Categories
export const workoutLibrary = {
  'craving-crushers': {
    title: 'Craving Crushers',
    description: 'Quick, energizing circuits to redirect your focus',
    workouts: [
      {
        id: 'intensity-reset',
        name: 'Intensity Reset',
        exercises: ['15 jumping jacks', '10 burpees', '20 high knees', '15 squat jumps'],
        duration: 4,
        calories: 32,
      },
      {
        id: 'power-distraction',
        name: 'Power Distraction',
        exercises: ['20 mountain climbers', '15 push-ups', '25 lunges', '30-sec plank'],
        duration: 5,
        calories: 40,
      },
      {
        id: 'energy-surge',
        name: 'Energy Surge',
        exercises: ['30 jumping jacks', '20 squats', '10 push-ups'],
        duration: 3,
        calories: 24,
      },
      {
        id: 'focus-shifter',
        name: 'Focus Shifter',
        exercises: ['20 burpees', '30 crunches', '25 lunges', '40-sec wall sit'],
        duration: 6,
        calories: 45,
      },
      {
        id: 'instant-endorphins',
        name: 'Instant Endorphins',
        exercises: ['25 jumping jacks', '15 squat to calf raise', '20 arm swings', '10 burpees'],
        duration: 4,
        calories: 35,
      },
    ],
  },
  'evening-energy-boosts': {
    title: 'Evening Energy Boosts',
    description: 'Light workouts to replace your evening drink ritual',
    workouts: [
      {
        id: 'sunset-flow',
        name: 'Sunset Flow',
        exercises: ['Gentle yoga sequence', 'warrior poses', 'hip stretches', 'spinal twists'],
        duration: 8,
        calories: 48,
      },
      {
        id: 'evening-tone',
        name: 'Evening Tone',
        exercises: ['20 wall push-ups', '25 squats', '30 calf raises', 'full body stretch'],
        duration: 7,
        calories: 42,
      },
      {
        id: 'relaxation-circuit',
        name: 'Relaxation Circuit',
        exercises: ['Light stretching', 'gentle core work', 'breathing exercises'],
        duration: 6,
        calories: 30,
      },
      {
        id: 'wind-down-workout',
        name: 'Wind-Down Workout',
        exercises: ['15 modified push-ups', '20 glute bridges', 'leg stretches'],
        duration: 5,
        calories: 35,
      },
      {
        id: 'peaceful-movement',
        name: 'Peaceful Movement',
        exercises: ['Slow flowing movements', 'balance poses', 'gentle core activation'],
        duration: 9,
        calories: 45,
      },
    ],
  },
  'morning-resets': {
    title: 'Morning Resets',
    description: 'Gentle mobility and energy for fresh starts',
    workouts: [
      {
        id: 'gentle-awakening',
        name: 'Gentle Awakening',
        exercises: ['Slow yoga flow', 'hip openers', 'spinal twists', 'gentle backbends'],
        duration: 8,
        calories: 40,
      },
      {
        id: 'recovery-flow',
        name: 'Recovery Flow',
        exercises: ['Light stretching', 'gentle core activation', 'mobility work'],
        duration: 10,
        calories: 50,
      },
      {
        id: 'hydration-helper',
        name: 'Hydration Helper',
        exercises: ['Gentle movements', 'circulation boosters', 'energy activation'],
        duration: 6,
        calories: 30,
      },
      {
        id: 'fresh-start',
        name: 'Fresh Start',
        exercises: ['Easy bodyweight exercises', 'posture improvement', 'gentle cardio'],
        duration: 7,
        calories: 42,
      },
    ],
  },
  'strength-builders': {
    title: 'Strength Builders',
    description: 'Progressive bodyweight training for lean muscle',
    workouts: [
      {
        id: 'foundation-builder',
        name: 'Foundation Builder',
        exercises: ['Progressive squats', 'push-up variations', 'core strengthening', 'stability work'],
        duration: 12,
        calories: 72,
      },
      {
        id: 'lean-and-strong',
        name: 'Lean & Strong',
        exercises: ['Full-body circuit', 'major muscle groups', 'functional movements'],
        duration: 10,
        calories: 65,
      },
      {
        id: 'tone-and-define',
        name: 'Tone & Define',
        exercises: ['Targeted arm exercises', 'leg sculpting', 'core definition'],
        duration: 9,
        calories: 54,
      },
      {
        id: 'power-and-grace',
        name: 'Power & Grace',
        exercises: ['Dynamic movements', 'strength and flexibility combo', 'balance challenges'],
        duration: 8,
        calories: 56,
      },
      {
        id: 'body-sculptor',
        name: 'Body Sculptor',
        exercises: ['Compound movements', 'isometric holds', 'resistance patterns'],
        duration: 11,
        calories: 68,
      },
    ],
  },
};

// Helper function to get daily workout
export const getDailyWorkout = (): Workout => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const workoutIndex = dayOfYear % dailyMiniWorkouts.length;
  return dailyMiniWorkouts[workoutIndex];
};

// Helper function to calculate "burn a drink" time
export const getBurnADrinkTime = (workoutCalories: number): number => {
  return Math.ceil(CALORIES_PER_DRINK / workoutCalories); // Always return whole number
};