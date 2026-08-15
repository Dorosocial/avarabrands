import subprocess
import glob
import time
import os
import sys
import whisper

LIVE_URL = "https://www.tiktok.com/@tymobeauty_official/live?enter_from_merge=general_search&enter_method=others_photo&search_id=20260816035054E99F153F1233763DFBB1&search_keyword=tymo%20beauty&search_result_id=7016877167896888325&search_type=general"

def main():
    print("Loading local Whisper model (base)...")
    model = whisper.load_model("base")
    processed_chunks = set()

    print(f"Connecting to live stream: {LIVE_URL}")

    # Extract raw HLS/stream URL via yt-dlp
    try:
        stream_url = subprocess.check_output(
            ["yt-dlp", "-g", LIVE_URL],
            stderr=subprocess.DEVNULL
        ).decode().strip()
    except Exception as e:
        print(f"Error fetching live stream URL: {e}")
        sys.exit(1)

    print("Stream connected. Starting live audio chunking (15s intervals)...")

    # Spawn ffmpeg as a background process to slice audio into WAV chunks
    ffmpeg_cmd = [
        "ffmpeg", "-i", stream_url,
        "-f", "segment", "-segment_time", "15",
        "-c:a", "pcm_s16le", "chunk_%03d.wav",
        "-y"
    ]

    ffmpeg_proc = subprocess.Popen(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    print("Transcription active. Appending genuine speech to ./live_transcript.txt...")
    print("Press Ctrl+C to stop recording.\n")

    current_timestamp_offset = 0.0

    try:
        while True:
            chunks = sorted(glob.glob("chunk_*.wav"))

            # Leave the active, currently writing chunk alone; process completed chunks
            for chunk in chunks[:-1]:
                if chunk not in processed_chunks:
                    try:
                        result = model.transcribe(chunk)

                        with open("live_transcript.txt", "a", encoding="utf-8") as f:
                            for segment in result.get("segments", []):
                                start = segment["start"] + current_timestamp_offset
                                end = segment["end"] + current_timestamp_offset
                                text = segment["text"].strip()
                                if text:
                                    f.write(f"[{start:.2f}s -> {end:.2f}s] {text}\n")
                                    print(f"[{start:.2f}s -> {end:.2f}s] {text}")

                        current_timestamp_offset += 15.0
                        processed_chunks.add(chunk)

                        # Clean up chunk file after processing
                        os.remove(chunk)
                    except Exception as err:
                        print(f"Error processing {chunk}: {err}")

            time.sleep(3)

    except KeyboardInterrupt:
        print("\nStopping recorder...")
        ffmpeg_proc.terminate()
        print("Done. Check ./live_transcript.txt for your output.")

if __name__ == "__main__":
    main()
