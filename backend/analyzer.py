import pandas as pd
from collections import defaultdict

def analyze_student(df):
    # Ensure required columns exist
    required_cols = ['Topic', 'Correct', 'Time_Taken']
    for col in required_cols:
        if col not in df.columns:
            return []

    topic_stats = defaultdict(lambda: {"total": 0, "correct": 0, "time": 0})

    for _, row in df.iterrows():
        try:
            topic = str(row['Topic'])
            correct = int(row['Correct'])
            time_taken = float(row['Time_Taken'])

            topic_stats[topic]['total'] += 1
            topic_stats[topic]['correct'] += correct
            topic_stats[topic]['time'] += time_taken
        except (ValueError, TypeError):
            continue

    weak_topics = []
    for topic, stats in topic_stats.items():
        if stats['total'] == 0: continue
        accuracy = stats['correct'] / stats['total']
        avg_time = stats['time'] / stats['total']
        
        # Criteria for weak topics
        if accuracy < 0.6 and avg_time > 80:
            weak_topics.append(topic)

    return weak_topics
