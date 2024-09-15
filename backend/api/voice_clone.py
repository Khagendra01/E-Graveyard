import requests
import json
import os

def voice_clone(voice_url):

    url = "https://api.elevenlabs.io/v1/voices/add"

    headers = {
        "Accept": "application/json",
        "xi-api-key": os.getenv("ELEVENLABS_API_KEY")
    }

    data = {
        "name": "Voice Clone Name",
        "description": "A description of the voice"
    }

    # URL of the file to be uploaded
    file_url = voice_url

    # Download the file from the URL
    response = requests.get(file_url, stream=True)
    if response.status_code == 200:
        # If the file is successfully downloaded
        files = [
            ("files", (file_url.split('/')[-1], response.raw, "audio/mpeg")),
        ]

        # Make the POST request
        response = requests.post(url, headers=headers, data=data, files=files)

        # Check if the response was successful
        if response.status_code == 200:
            response_data = response.json()
            voice_id = response_data.get('voice_id')
            return voice_id