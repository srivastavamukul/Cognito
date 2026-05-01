#!/usr/bin/env python3
import sys
import json
import os
from dotenv import load_dotenv
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs
import requests

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def extract_video_id(youtube_url):
    parsed_url = urlparse(youtube_url)
    if "youtu.be" in parsed_url.netloc:
        return parsed_url.path[1:]
    if "youtube.com" in parsed_url.netloc:
        query_params = parse_qs(parsed_url.query)
        return query_params.get("v", [None])[0]
    return None

def extract_transcript(video_id):
    api = YouTubeTranscriptApi()
    try:
        # Try to get the transcript directly if possible
        transcript_text = api.get_transcript(video_id)
    except (AttributeError, Exception):
        # Fallback to list() and fetch() which seems to be the API for this version
        transcript_list = api.list(video_id)
        transcript_text = transcript_list.find_transcript(['en']).fetch()
            
    try:
        transcript = " ".join([i["text"] for i in transcript_text])
    except (TypeError, KeyError):
        transcript = " ".join([i.text for i in transcript_text])
    return transcript

def generate_summary(transcript_text):
    prompt = (
        "This is a YouTube video summarizer. It will take the transcript text and summarize "
        "the entire video, providing the important points in 500 words. Transcript: "
    )
    model = genai.GenerativeModel("models/gemini-flash-latest")
    response = model.generate_content(prompt + transcript_text)
    return response.text

def main(video_url: str):
    try:
        video_id = extract_video_id(video_url)
        if not video_id:
            raise ValueError("Could not extract video ID from URL.")
        transcript = extract_transcript(video_id)
        summary = generate_summary(transcript)
        
        # Fetch title from oEmbed API
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        title = None
        try:
            oembed_resp = requests.get(oembed_url)
            if oembed_resp.status_code == 200:
                title = oembed_resp.json().get("title")
        except:
            pass

        print(json.dumps({'summary': summary, 'title': title}, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({'error': str(e)}, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No video URL provided'}, ensure_ascii=False))
        sys.exit(1)
    main(sys.argv[1])
