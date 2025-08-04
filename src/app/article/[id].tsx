import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock articles data (same as in library.tsx - in a real app this would be from a context or API)
const mockArticles = {
  '1': {
    id: '1',
    title: 'Understanding Alcohol and Your Brain',
    category: 'Science',
    readTime: '5 min',
    author: 'Dr. Sarah Mitchell',
    publishDate: 'March 15, 2024',
    content: `Alcohol affects the brain in complex ways that go beyond the immediate feeling of intoxication. Understanding these effects can be a powerful motivator in your journey to reduce or quit drinking.

## The Immediate Effects

When you drink alcohol, it quickly enters your bloodstream and reaches your brain within minutes. Alcohol is a depressant, which means it slows down brain function and neural activity. This affects several neurotransmitter systems:

**GABA Enhancement**: Alcohol enhances the effects of GABA, the brain's primary inhibitory neurotransmitter. This leads to the relaxation and loss of inhibition commonly associated with drinking.

**Dopamine Release**: Alcohol triggers the release of dopamine in the brain's reward center, creating feelings of pleasure and reinforcing drinking behavior.

**Glutamate Suppression**: Alcohol suppresses glutamate, an excitatory neurotransmitter, contributing to memory impairment and reduced cognitive function.

## Long-term Brain Changes

Regular alcohol consumption can lead to lasting changes in brain structure and function:

**Neuroplasticity**: The brain adapts to regular alcohol exposure, requiring more alcohol to achieve the same effects (tolerance).

**Gray Matter Reduction**: Studies show that heavy drinking can reduce gray matter volume in areas responsible for decision-making and emotional regulation.

**White Matter Damage**: Alcohol can damage the white matter that connects different brain regions, affecting communication between areas.

## The Good News: Brain Recovery

The remarkable thing about the brain is its ability to heal and adapt. When you stop or reduce drinking:

**Week 1-2**: Brain fog begins to clear, and sleep patterns start to normalize.

**Month 1**: Neurotransmitter levels begin to rebalance, improving mood and cognitive function.

**Month 3-6**: Significant improvements in memory, attention, and emotional regulation.

**Year 1+**: Continued healing and potential recovery of gray matter volume.

## Supporting Your Brain's Recovery

To optimize brain healing during your alcohol-free journey:

1. **Exercise regularly**: Physical activity promotes neuroplasticity and brain health.
2. **Prioritize sleep**: Quality sleep is crucial for brain repair and consolidation of new neural pathways.
3. **Stay hydrated**: Proper hydration supports optimal brain function.
4. **Eat brain-healthy foods**: Omega-3 fatty acids, antioxidants, and B vitamins support neural recovery.
5. **Practice mindfulness**: Meditation and mindfulness can help rewire neural pathways.

Remember, every day without alcohol is a day your brain is healing and becoming stronger. The journey may have challenges, but your brain's remarkable ability to recover makes it all worthwhile.`,
  },
  '2': {
    id: '2',
    title: '10 Benefits of Reducing Alcohol Intake',
    category: 'Health',
    readTime: '3 min',
    author: 'Health Team',
    publishDate: 'March 18, 2024',
    content: `Reducing or eliminating alcohol from your life can lead to profound improvements in your physical and mental well-being. Here are ten evidence-based benefits you can expect:

## 1. Better Sleep Quality
While alcohol might help you fall asleep initially, it disrupts REM sleep and sleep cycles. Without alcohol, you'll experience deeper, more restorative sleep.

## 2. Improved Mental Clarity
Say goodbye to brain fog! Your cognitive function, memory, and concentration will significantly improve within weeks of reducing alcohol.

## 3. Enhanced Energy Levels
Without the dehydrating and energy-depleting effects of alcohol, you'll feel more energetic and motivated throughout the day.

## 4. Weight Loss
Alcohol is high in empty calories. Cutting it out can lead to natural weight loss and reduced belly fat.

## 5. Healthier Skin
Alcohol dehydrates your skin and can cause inflammation. Expect clearer, more radiant skin within weeks.

## 6. Stronger Immune System
Alcohol suppresses immune function. Reducing intake helps your body fight off infections more effectively.

## 7. Better Emotional Regulation
Without alcohol's mood-altering effects, you'll experience more stable emotions and improved mental health.

## 8. Improved Relationships
Clear communication and being fully present leads to deeper, more meaningful connections with loved ones.

## 9. Financial Savings
The money saved from not buying alcohol can add up to thousands of dollars per year.

## 10. Increased Self-Confidence
Achieving your goals and taking control of your health builds genuine self-esteem and confidence.

Each of these benefits compounds over time, creating a positive cycle of health and well-being. Your journey to reduce alcohol is an investment in a happier, healthier you.`,
  },
  '3': {
    id: '3',
    title: 'Mindful Strategies for Social Situations',
    category: 'Tips',
    readTime: '4 min',
    author: 'Emma Thompson',
    publishDate: 'March 20, 2024',
    content: `Social situations can be challenging when you're reducing or avoiding alcohol. Here are practical strategies to help you navigate these moments with confidence.

## Before the Event

**Set Your Intention**: Decide beforehand what you'll drink and how you'll handle offers of alcohol. Having a plan reduces decision fatigue.

**Eat Beforehand**: Never arrive hungry. A full stomach reduces cravings and gives you energy.

**Bring a Supportive Friend**: If possible, attend with someone who supports your goals.

## During the Event

**Always Have a Drink in Hand**: Hold a non-alcoholic beverage to avoid constant offers and questions.

**Master the Redirect**: When offered alcohol, try:
- "I'm good with this for now, thanks!"
- "I'm driving tonight"
- "I'm on a health kick"
- "Not drinking tonight, but thanks!"

**Find Your People**: Seek out others who aren't drinking or are supportive of your choice.

**Stay Busy**: Engage in activities like dancing, games, or meaningful conversations.

## Handling Pressure

Remember: You don't owe anyone an explanation. If pressed:
- Use humor: "I'm conducting a science experiment on myself"
- Be honest: "I feel better without it"
- Change the subject: "Have you tried the food? It's amazing!"

## Creating New Traditions

**Host Alcohol-Free Gatherings**: Game nights, morning hikes, coffee meetups
**Suggest Alternative Venues**: Museums, escape rooms, cooking classes
**Be the Designated Driver**: A built-in reason not to drink plus helping friends

## Self-Care After

**Celebrate Your Success**: Acknowledge your achievement
**Process Your Feelings**: Journal or talk with a supportive friend
**Plan Something Enjoyable**: Reward yourself with a treat or activity

Remember, the more you practice these strategies, the easier they become. You're not missing out - you're choosing to be fully present and authentic in your social interactions.`,
  },
  '4': {
    id: '4',
    title: 'The Science of Habit Formation',
    category: 'Science',
    readTime: '6 min',
    author: 'Dr. James Chen',
    publishDate: 'March 22, 2024',
    content: `Understanding how habits form and change is crucial for successfully reducing alcohol consumption. Let's explore the neuroscience behind habits and how to leverage it for positive change.

## The Habit Loop

Every habit consists of three components:

1. **Cue**: The trigger that initiates the behavior
2. **Routine**: The behavior itself
3. **Reward**: The benefit you gain from the behavior

With alcohol, common cues might include stress, social situations, or specific times of day. The routine is drinking, and the reward might be relaxation or social connection.

## How Habits Form in the Brain

**Basal Ganglia**: This brain region is responsible for habit formation. As behaviors are repeated, neural pathways strengthen, making the behavior more automatic.

**Prefrontal Cortex**: Initially involved in decision-making, this area becomes less active as habits form, which is why habits feel automatic.

**Neuroplasticity**: The brain's ability to form new neural connections means you can create new habits at any age.

## Breaking Old Habits

**Identify Your Triggers**: Keep a journal to track when and why you want to drink.

**Interrupt the Pattern**: When you notice a trigger, immediately engage in a different activity.

**Replace, Don't Erase**: It's easier to replace a habit than eliminate it entirely. Find healthier routines that provide similar rewards.

## Building New Habits

**Start Small**: Tiny habits are easier to maintain. Begin with 5 minutes of meditation rather than 30.

**Stack Habits**: Attach new habits to existing ones. "After I brush my teeth, I'll meditate."

**Use Implementation Intentions**: "When X happens, I will do Y." This pre-planning significantly increases success rates.

## The 21-Day Myth

While it's commonly said habits take 21 days to form, research shows it's more complex:
- Simple habits: 18-66 days on average
- Complex habits: Up to 254 days
- Individual variation is significant

## Strategies for Success

1. **Environment Design**: Remove alcohol from easy access and place healthy alternatives prominently.

2. **Social Support**: Share your goals with supportive people who can help reinforce new habits.

3. **Track Progress**: Visual progress tracking activates the reward center and maintains motivation.

4. **Practice Self-Compassion**: Setbacks are normal. What matters is getting back on track.

5. **Celebrate Small Wins**: Acknowledge every success to reinforce positive neural pathways.

## The Compound Effect

Small daily choices compound over time. Each time you choose a healthy alternative to alcohol, you're:
- Strengthening new neural pathways
- Weakening old habit loops
- Building momentum for lasting change

Remember, you're not just breaking a habit - you're rewiring your brain for a healthier, happier life. Be patient with yourself and trust the process.`,
  },
  '5': {
    id: '5',
    title: 'Success Stories: 30 Days Alcohol-Free',
    category: 'Stories',
    readTime: '7 min',
    author: 'Community',
    publishDate: 'March 25, 2024',
    content: `Real stories from people who have successfully completed 30 days without alcohol. Their experiences show that while everyone's journey is unique, the benefits are universal.

## Sarah, 34, Marketing Manager

"I never thought I had a 'problem' with alcohol, but I was tired of weekend hangovers affecting my Mondays. The first week was tough - I didn't know what to do with myself on Friday nights!

By week two, I discovered I actually love morning runs. Who knew? By day 30, I'd lost 8 pounds without trying, my skin was glowing, and I'd read three books. The biggest surprise? My anxiety, which I thought I was managing with wine, actually decreased significantly.

The game-changer was finding new routines. Friday nights became homemade pizza and movie nights. Saturday mornings were for farmers markets instead of nursing hangovers. I'm now at 90 days and can't imagine going back."

## Michael, 42, Teacher

"As a teacher, I told myself I 'deserved' those after-work beers. But I was modeling behavior I wouldn't want for my students. My 30-day challenge started as a health kick but became so much more.

Week 1: Intense cravings at 3 PM (my usual first beer time). I replaced it with a walk.
Week 2: Sleep improved dramatically. I was actually excited for morning classes!
Week 3: Students commented that I seemed 'different' - more patient and engaged.
Week 4: Saved $400 and finally started that woodworking project.

The biggest win? My relationship with my teenage daughter improved. We now have real conversations instead of me being checked out in the evenings. That alone makes it worth continuing."

## Priya, 28, Software Developer

"In tech, drinking is part of the culture - team happy hours, conference parties, startup celebrations. I worried about being seen as antisocial. Instead, I discovered I'm actually more social without alcohol.

My 30-day timeline:
- Days 1-7: Awkward at happy hours, left early
- Days 8-14: Started suggesting coffee meetings instead
- Days 15-21: Became the go-to person for restaurant recommendations (I was actually tasting food!)
- Days 22-30: Organized a team hiking trip - huge success!

Professionally, my code quality improved, I was sharper in meetings, and I landed a promotion. Turns out, being fully present is a superpower in tech. Six months later, I still drink occasionally but it's a conscious choice, not a default."

## Robert, 55, Sales Director

"After 30 years of 'liquid lunches' and client dinners, I thought alcohol was essential to my job. My doctor's warning about my liver was the wake-up call. I committed to 30 days, terrified it would hurt my career.

The opposite happened. Without alcohol clouding my judgment, I:
- Closed my biggest deal in years (clear-headed negotiation)
- Improved relationships with clients who appreciated genuine connection
- Discovered many clients were also reducing alcohol
- Had energy for evening calls with international clients

My sales actually increased by 15%. My team now does 'Walk and Talk' meetings instead of bar meetups. At 60 days now, and my recent health check showed significant improvements. My wife says she got her husband back."

## Lisa, 39, Stay-at-Home Mom

"'Mommy wine culture' had normalized my nightly glasses of wine. I justified it as self-care, but deep down, I knew it wasn't. My 30-day challenge was about being a better mom and role model.

The truth about my 30 days:
- Days 1-5: Irritable, wondered what I'd gotten myself into
- Days 6-10: Started yoga videos after kids' bedtime instead
- Days 11-20: More patient with kids, less yelling, more laughing
- Days 21-30: Kids noticed - 'Mommy, you're more fun now!'

I'm now 4 months alcohol-free. I've joined a morning swim group, lost 15 pounds, and most importantly, I'm present for my kids. Those precious bedtime conversations I was fuzzy for? Now they're the highlight of my day."

## Your Story Starts Today

These stories show that regardless of your situation, positive change is possible. Every journey begins with a single day, and every day you choose not to drink is a victory worth celebrating.

What will your 30-day story be?`,
  },
  '6': {
    id: '6',
    title: 'Nutrition Tips for Recovery',
    category: 'Health',
    readTime: '5 min',
    author: 'Nutritionist Team',
    publishDate: 'March 28, 2024',
    content: `Proper nutrition plays a crucial role in supporting your body and mind during alcohol reduction. Here's how to optimize your diet for recovery and reduced cravings.

## Understanding Alcohol's Nutritional Impact

Alcohol depletes essential nutrients and disrupts metabolic processes:
- Depletes B vitamins, magnesium, and zinc
- Impairs nutrient absorption
- Disrupts blood sugar regulation
- Causes dehydration

## Foods That Support Recovery

### 1. Complex Carbohydrates
**Why**: Stabilize blood sugar and boost serotonin
**Foods**: Oats, quinoa, sweet potatoes, whole grain bread
**Tip**: Start your day with oatmeal topped with berries and nuts

### 2. Protein-Rich Foods
**Why**: Support neurotransmitter production and reduce cravings
**Foods**: Eggs, Greek yogurt, lean meats, legumes, nuts
**Tip**: Include protein with every meal and snack

### 3. Healthy Fats
**Why**: Support brain health and hormone production
**Foods**: Avocados, olive oil, fatty fish, walnuts
**Tip**: Add avocado to smoothies for creaminess and nutrients

### 4. Leafy Greens and Vegetables
**Why**: Provide essential vitamins and minerals
**Foods**: Spinach, kale, broccoli, bell peppers
**Tip**: Aim for a rainbow of colors daily

## Key Supplements to Consider

**B-Complex Vitamins**: Essential for energy and nervous system function
**Magnesium**: Supports relaxation and sleep quality
**Omega-3 Fatty Acids**: Reduce inflammation and support brain health
**Vitamin D**: Often deficient in those who drink regularly
**Probiotics**: Support gut health and mood regulation

*Always consult with a healthcare provider before starting supplements*

## Managing Cravings Nutritionally

### When You Crave Alcohol, Try:
1. **Drink water first** - Dehydration can trigger cravings
2. **Eat something sweet** - Fruit can satisfy sugar cravings
3. **Have a protein snack** - Stabilizes blood sugar
4. **Try L-glutamine** - An amino acid that may reduce cravings

### Craving Substitutes:
- Sparkling water with fruit
- Herbal teas (especially calming ones like chamomile)
- Kombucha (for the fizz and slight tang)
- Fresh vegetable juice
- Coconut water for electrolytes

## Meal Planning for Success

### Breakfast Ideas:
- Veggie omelet with whole grain toast
- Greek yogurt parfait with berries and granola
- Smoothie with spinach, banana, protein powder

### Lunch Ideas:
- Quinoa bowl with roasted vegetables and chickpeas
- Turkey and avocado wrap with side salad
- Lentil soup with whole grain crackers

### Dinner Ideas:
- Grilled salmon with sweet potato and steamed broccoli
- Chicken stir-fry with brown rice
- Bean and vegetable chili with cornbread

### Snack Ideas:
- Apple slices with almond butter
- Hummus with vegetable sticks
- Trail mix with dried fruit and nuts
- Greek yogurt with honey

## Hydration is Key

Aim for at least 8 glasses of water daily:
- Start your day with warm lemon water
- Keep a water bottle with you
- Herbal teas count toward hydration
- Eat water-rich foods like cucumbers and watermelon

## Foods to Limit

- **Refined sugars**: Can trigger cravings and mood swings
- **Processed foods**: Often lack nutrients and can increase inflammation
- **Excessive caffeine**: Can increase anxiety and disrupt sleep
- **Sugary drinks**: Cause blood sugar spikes and crashes

## The Gut-Brain Connection

Alcohol disrupts gut health, which affects mood and cravings. Support your gut with:
- Fermented foods (yogurt, sauerkraut, kimchi)
- Prebiotic foods (garlic, onions, bananas)
- Bone broth for gut healing
- Plenty of fiber from fruits and vegetables

## Remember: Progress, Not Perfection

Focus on adding nutritious foods rather than restricting. Each healthy choice supports your recovery and makes the next choice easier. Your body is remarkably resilient - give it the nutrients it needs, and it will reward you with improved energy, mood, and well-being.`,
  },
};

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const article = mockArticles[id as string];

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${article.title}`,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBookmark = () => {
    // In a real app, this would save to bookmarks
    console.log('Bookmarked:', article.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleBookmark} style={styles.headerButton}>
            <Ionicons name="bookmark-outline" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Header */}
        <View style={styles.articleHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{article.category}</Text>
          </View>
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.author}>By {article.author}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.date}>{article.publishDate}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.readTime}>{article.readTime} read</Text>
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.articleContent}>
          <Text style={styles.contentText}>{article.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  articleHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 36,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  author: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 14,
    color: '#cccccc',
    marginHorizontal: 8,
  },
  date: {
    fontSize: 14,
    color: '#666666',
  },
  readTime: {
    fontSize: 14,
    color: '#666666',
  },
  articleContent: {
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 26,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});