#!/usr/bin/env python3
import sys
import json
import pandas as pd
import requests
import io
import logging
from analyzer import analyze_student  # Ensure this function is implemented correctly

# Log to stderr to keep stdout clean for the JSON result
logging.basicConfig(stream=sys.stderr, level=logging.INFO)

def main():

    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No file path provided'}))
        sys.exit(1)

    file_path = sys.argv[1]

    try:
        # Parse CSV directly from local file
        df = pd.read_csv(file_path)

        # Analyze data
        weak_topics = analyze_student(df)

        # Output result to stdout
        print(json.dumps({'weak_topics': weak_topics}))

    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
